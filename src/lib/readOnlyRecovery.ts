import type { ProcurementRecord, KeystoreReceipt } from "./types";

export const OLD_SPIKE_TX = "0x7e511e9094756923f3373c01ae7965a3f1ea1f5b43b03172ee91d97e19d8ac43";

function time(value: string | undefined): number {
  const t = Date.parse(value || "");
  return Number.isFinite(t) ? t : NaN;
}

/** Read-only, narrowly matched receipt candidates for a previously dispatched task.
 * Never queries the paid gateway and never initiates a payment.
 */
export function possibleReceipts(record: ProcurementRecord, receipts: KeystoreReceipt[]): KeystoreReceipt[] {
  const exec = record.execution;
  const quote = record.quote;
  if (!exec || !quote || !record.approval || !Number.isFinite(time(exec.attemptedAt))) return [];
  const matched = new Map<string, KeystoreReceipt>();
  const account = process.env.BUY_ACCOUNT_NAME || "celo-open-rails";
  for (const receipt of receipts) {
    if (!/^0x[a-f0-9]{64}$/i.test(receipt.txHash || "")) continue;
    const hash = receipt.txHash.toLowerCase();
    if (hash === OLD_SPIKE_TX) continue;
    if (receipt.account !== account) continue;
    if (receipt.url !== quote.url) continue;
    if (receipt.amount !== quote.selectedOffer.atomicAmount) continue;
    if (receipt.asset.toLowerCase() !== quote.selectedOffer.assetContract.toLowerCase()) continue;
    if (receipt.network !== "celo" && receipt.network !== "eip155:42220") continue;
    const recorded = time(receipt.timestamp);
    if (!Number.isFinite(recorded) || recorded < time(exec.attemptedAt) - 60_000) continue;
    matched.set(hash, receipt);
  }
  return Array.from(matched.values());
}

export type VerifyTransfer = (
  txHash: string, token: string, payTo: string, amount: string
) => Promise<{ verified: boolean; reason: string }>;

export async function reconcileWithoutNewSpend(
  record: ProcurementRecord,
  receipts: KeystoreReceipt[],
  verify: VerifyTransfer
): Promise<ProcurementRecord> {
  const exec = record.execution;
  const quote = record.quote;
  if (!exec || !quote || !["executing", "settle_uncertain"].includes(exec.status)) {
    throw new Error("Only a previously dispatched, unresolved paid task can be reconciled");
  }
  const at = new Date().toISOString();
  const candidates = possibleReceipts(record, receipts);
  const setNote = (note: string, verified = false) => {
    exec.reconciliation = { checkedAt: at, readOnly: true, paymentVerified: verified, note };
  };
  if (candidates.length === 0) {
    setNote("No unique matching payment receipt is present. Settlement remains uncertain. Do not retry the paid request.");
    exec.status = "settle_uncertain";
    return record;
  }
  if (candidates.length !== 1) {
    setNote("Multiple distinct receipts matched this attempt. Manual review required; no paid retry.");
    exec.status = "settle_uncertain";
    return record;
  }
  const candidate = candidates[0];
  // A matching price/time/account is not sufficient to attribute this payment
  // to one exact task if multiple identical paid requests happened nearby.
  // Require a transaction hash that was ALREADY durably recorded on this task.
  const boundHash = exec.settlementDetails?.txHash;
  if (!boundHash || boundHash.toLowerCase() !== candidate.txHash.toLowerCase()) {
    setNote("A possible payment receipt exists, but this task has no persisted exact matching transaction hash. Manual attribution required; do not repay.");
    exec.status = "settle_uncertain";
    return record;
  }
  const chain = await verify(
    candidate.txHash, quote.selectedOffer.assetContract,
    quote.selectedOffer.payTo, quote.selectedOffer.atomicAmount
  );
  if (!chain.verified) {
    setNote("On-chain transfer could not be confirmed: " + chain.reason + ". No paid retry permitted.");
    exec.status = "settle_uncertain";
    return record;
  }
  exec.settlementDetails = {
    network: "eip155:42220",
    asset: quote.selectedOffer.assetContract,
    amount: quote.selectedOffer.atomicAmount,
    payTo: quote.selectedOffer.payTo,
    txHash: candidate.txHash,
    status: 200,
    outcome: exec.resultData ? "confirmed_on_celo" : "payment_confirmed_response_missing",
  };
  if (exec.resultData !== undefined && exec.resultData !== null) {
    exec.status = "delivered";
    exec.deliveredAt ||= at;
    setNote("The original payment and saved provider result are verified. No new transaction occurred.", true);
  } else {
    exec.status = "settle_uncertain";
    setNote("Payment is confirmed, but the original paid provider response was not saved. Do not purchase again; investigate the upstream run.", true);
  }
  return record;
}
