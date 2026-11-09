import fs from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import os from "node:os";
import { spawn } from "node:child_process";
import type { KeystoreReceipt, ProcurementRecord } from "./types";
import { fetch402Quote } from "./gateway";
import { verifyExactTokenSettlement } from "./celoRpc";
import {
  assertPaidModeExplicitlyEnabled, assertFreshQuoteUnchanged,
  buildBuyCliArgs, verifyApprovedPaidPlan,
} from "./buyPlan";

type ReceiptReader = () => KeystoreReceipt[];
type Recorder = (record: ProcurementRecord) => void;

function clip(value: string, max = 800): string {
  return value.slice(0, max).replace(/(bearer\s+)[A-Za-z0-9._-]+/gi, "$1[REDACTED]");
}

function redactedOutput(value: unknown, depth = 0): unknown {
  if (depth > 8) return "[TRUNCATED]";
  if (Array.isArray(value)) return value.slice(0, 100).map((v) => redactedOutput(v, depth + 1));
  if (typeof value === "object" && value !== null) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (/access.?token|api.?key|password|private.?key|secret|authorization|mnemonic|signature/i.test(k)) {
        out[k] = "[REDACTED]";
      } else {
        out[k] = redactedOutput(v, depth + 1);
      }
    }
    return out;
  }
  if (typeof value === "string") return clip(value, 50000);
  return value;
}

type RunResult = { exitCode: number | null; stdout: string; stderr: string; timedOut: boolean };

function invokeBuyExactlyOnce(args: string[]): Promise<RunResult> {
  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    let completed = false;
    let timer: NodeJS.Timeout | undefined;

    const finish = (result: RunResult) => {
      if (completed) return;
      completed = true;
      if (timer) clearTimeout(timer);
      resolve(result);
    };
    // No shell expansion, no stdin or TTY prompt, no repeat/retry.
    const child = spawn(process.execPath, args, {
      shell: false, windowsHide: true, stdio: ["ignore", "pipe", "pipe"],
      env: process.env,
    });
    child.stdout?.on("data", (data: Buffer) => {
      stdout += data.toString("utf8");
      if (stdout.length > 250000) { timedOut = true; child.kill(); }
    });
    child.stderr?.on("data", (data: Buffer) => {
      stderr += data.toString("utf8");
      if (stderr.length > 50000) { timedOut = true; child.kill(); }
    });
    child.on("error", (err) => {
      finish({ exitCode: null, stdout, stderr: stderr + " " + err.message, timedOut: true });
    });
    child.on("close", (exitCode) => {
      finish({ exitCode, stdout, stderr, timedOut });
    });
    timer = setTimeout(() => {
      timedOut = true;
      child.kill();
    }, 120000);
  });
}

/**
 * ONLY call from the authenticated, locked per-task execution gate.
 *
 * The CLI is deliberately disabled by default, even if the policy flag is toggled.
 * Once a user separately authorizes actual spend, both explicit switches must
 * be locally enabled, and the task itself must have exact operator approval.
 *
 * Persist 'executing' BEFORE starting the CLI. If the process crashes or its
 * outcome is ambiguous, NEVER automatically retry or overwrite the attempt.
 */
export async function executeAuthorizedPaidBuy(
  record: ProcurementRecord,
  persist: Recorder,
  readReceipts: ReceiptReader
): Promise<ProcurementRecord> {
  assertPaidModeExplicitlyEnabled();
  const plan = verifyApprovedPaidPlan(record);
  const cliEntry = process.env.BUY_CLI_ENTRY;
  if (!cliEntry || !path.isAbsolute(cliEntry) || !fs.existsSync(cliEntry)) {
    throw new Error("Buy CLI entry not configured as an existing absolute path");
  }

  // Fresh no-payment quote prevents a price, asset, recipient or payload switch.
  const freshQuote = await fetch402Quote(plan.url, plan.method, plan.body);
  assertFreshQuoteUnchanged(record.quote!, freshQuote);

  const priorHashes = new Set(readReceipts().map((r) => r.txHash?.toLowerCase()).filter(Boolean));
  const requestDir = path.join(os.tmpdir(), "celo-open-rails-buy");
  fs.mkdirSync(requestDir, { recursive: true });
  const attemptId = randomUUID();
  const requestPath = path.join(requestDir, record.id + "-" + attemptId + ".json");
  fs.writeFileSync(requestPath, JSON.stringify(plan.body), { encoding: "utf8", flag: "wx", mode: 0o600 });

  const startedAt = new Date().toISOString();
  record.execution = {
    attemptedAt: startedAt,
    idempotencyKey: attemptId,
    status: "executing",
    policyGuardTriggered: false,
    settlementDetails: {
      network: "eip155:42220",
      asset: record.quote!.selectedOffer.assetContract,
      amount: record.quote!.selectedOffer.atomicAmount,
      payTo: record.quote!.selectedOffer.payTo,
      outcome: "sent_once_outcome_unknown_until_receipt_verified",
    },
  };
  persist(record);

  try {
    const args = buildBuyCliArgs(plan, cliEntry, requestPath);
    const outcome = await invokeBuyExactlyOnce(args);
    if (outcome.timedOut || outcome.exitCode !== 0) {
      record.execution.status = "settle_uncertain";
      record.execution.errorMessage =
        "Buy command dispatched once but settlement was not conclusively verified. " +
        clip(outcome.stderr || "Command timeout or nonzero exit. Manual receipt/nonce check required.");
      record.execution.settlementDetails!.outcome = "unknown_do_not_retry";
      persist(record);
      return record;
    }

    let response: unknown;
    try { response = JSON.parse(outcome.stdout); }
    catch { response = { rawText: clip(outcome.stdout, 100000) }; }
    record.execution.resultData = redactedOutput(response);

    // A new CLI receipt must be causally matched and independently verified.
    const candidate = readReceipts().find((receipt) =>
      Boolean(receipt.txHash) &&
      !priorHashes.has(receipt.txHash.toLowerCase()) &&
      receipt.account === plan.account &&
      receipt.url === plan.url &&
      receipt.amount === record.quote!.selectedOffer.atomicAmount &&
      (receipt.network === "celo" || receipt.network === "eip155:42220") &&
      Number.isFinite(Date.parse(receipt.timestamp)) &&
      Date.parse(receipt.timestamp) >= Date.parse(startedAt) - 60000 &&
      receipt.asset.toLowerCase() === record.quote!.selectedOffer.assetContract.toLowerCase()
    );
    if (!candidate) {
      record.execution.status = "settle_uncertain";
      record.execution.errorMessage =
        "Provider response returned, but no unique new cpay receipt matched; manual verification required.";
      record.execution.settlementDetails!.outcome = "response_without_verified_payment_receipt";
      persist(record);
      return record;
    }

    // Durable binding before the read-only chain verification: if the server
    // crashes, recovery can still attribute this exact receipt to this task.
    record.execution.settlementDetails!.txHash = candidate.txHash;
    record.execution.settlementDetails!.outcome = "receipt_saved_chain_verification_pending";
    persist(record);

    const chain = await verifyExactTokenSettlement(
      candidate.txHash,
      record.quote!.selectedOffer.assetContract,
      record.quote!.selectedOffer.payTo,
      record.quote!.selectedOffer.atomicAmount
    );
    if (!chain.verified) {
      record.execution.status = "settle_uncertain";
      record.execution.errorMessage = "New cpay receipt did not prove the exact Celo token transfer: " + chain.reason;
      record.execution.settlementDetails!.outcome = "receipt_pending_chain_verification";
      persist(record);
      return record;
    }

    record.execution.status = "delivered";
    record.execution.deliveredAt = new Date().toISOString();
    record.execution.settlementDetails!.txHash = candidate.txHash;
    record.execution.settlementDetails!.outcome = "confirmed_on_celo";
    record.execution.settlementDetails!.status = 200;
    persist(record);
    return record;
  } catch (error) {
    // Once the attempt marker is saved, any unknown process failure may have
    // reached the gateway. Never blindly retry it.
    record.execution.status = "settle_uncertain";
    record.execution.errorMessage =
      "Post-dispatch exception; settlement requires manual verification: " +
      clip(error instanceof Error ? error.message : String(error));
    record.execution.settlementDetails!.outcome = "post_dispatch_uncertain_do_not_retry";
    persist(record);
    return record;
  } finally {
    try { fs.unlinkSync(requestPath); } catch { /* no credentials in this file */ }
  }
}
