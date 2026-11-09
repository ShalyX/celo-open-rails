import type { AuthoritativeQuote, ProcurementRecord } from "./types";
import {
  assertQuoteWithinApproval,
  parseUsdSixDecimalAtoms,
  assertSafeGatewayMethod,
  assertTrustedGatewayUrl,
} from "./requestSafety.ts";

/**
 * Builds the only acceptable Buy invocation: a bounded, exact, one-shot purchase.
 * These pure guards are safe to unit-test without creating a wallet signature.
 */
export const BUY_ENABLE_LITERAL = "EXPLICIT_PER_TASK_SPEND_APPROVED";

export function assertPaidModeExplicitlyEnabled(
  env: Record<string, string | undefined> = process.env
): void {
  if (
    env.POLICY_DISALLOW_SPEND !== "false" ||
    env.LIVE_BUY_MODE !== BUY_ENABLE_LITERAL
  ) {
    throw new Error(
      "Paid Buy dispatch remains disabled. Both explicit live policy switches are required."
    );
  }
}

export function verifyApprovedPaidPlan(record: ProcurementRecord): {
  url: string;
  method: "GET" | "POST";
  body: Record<string, unknown>;
  token: "USDC" | "USDT" | "USAT";
  amount: string;
  account: string;
} {
  const quote = record.quote;
  const approval = record.approval;
  if (!quote || !approval) {
    throw new Error("Missing exact 402 quote or signed-in human approval");
  }
  if (record.execution) {
    throw new Error("Already dispatched; manual settlement inspection required");
  }
  if (
    !["x", "reddit", "instagram", "tiktok", "youtube", "linkedin", "flights", "chainstack", "cencori"]
      .includes(record.platform)
  ) {
    throw new Error("Unsupported paid category; credential-bearing browser/GPU rentals require separate controls");
  }
  const url = assertTrustedGatewayUrl(record.intent.requestEnvelope.url);
  const method = assertSafeGatewayMethod(record.intent.requestEnvelope.method);
  if (quote.url !== url.href || quote.method !== method) {
    throw new Error("Stored quote does not match exact request URL and method");
  }
  if (JSON.stringify(quote.requestBody) !== JSON.stringify(record.intent.requestEnvelope.body)) {
    throw new Error("Request payload changed after original quote");
  }
  if (
    !Number.isFinite(Date.parse(quote.timestamp)) ||
    Date.now() > Date.parse(quote.timestamp) + quote.selectedOffer.timeoutSeconds * 1000
  ) {
    throw new Error("Original price quote expired; obtain a fresh approved quote");
  }
  const token = quote.selectedOffer.tokenSymbol.toUpperCase();
  if (token !== "USDC" && token !== "USDT" && token !== "USAT") {
    throw new Error("Unsupported paid settlement token");
  }
  if (quote.selectedOffer.atomicAmount === "0") {
    throw new Error("Zero-cost quote is not a paid service");
  }
  if (quote.selectedOffer.network !== "eip155:42220" && quote.selectedOffer.network !== "celo") {
    throw new Error("Only Celo mainnet settlement is permitted");
  }
  if (!/^0x[a-fA-F0-9]{40}$/.test(quote.selectedOffer.payTo) ||
      !/^0x[a-fA-F0-9]{40}$/.test(quote.selectedOffer.assetContract)) {
    throw new Error("Invalid asset or settlement recipient");
  }
  // The CLI cap is passed in HUMAN units. A stale or corrupted human
  // display must never silently enlarge the actual maximum wallet debit.
  if (parseUsdSixDecimalAtoms(quote.selectedOffer.humanAmount) !==
      BigInt(quote.selectedOffer.atomicAmount)) {
    throw new Error("Human-readable quote cap does not equal quoted atomic amount");
  }
  assertQuoteWithinApproval(
    quote.selectedOffer.atomicAmount,
    approval.maxAuthorizedSpend,
    quote.selectedOffer.tokenSymbol,
    approval.authorizedToken
  );
  return {
    url: url.href,
    method,
    body: record.intent.requestEnvelope.body,
    token,
    amount: quote.selectedOffer.humanAmount,
    account: process.env.BUY_ACCOUNT_NAME || "celo-open-rails",
  };
}

export function assertFreshQuoteUnchanged(
  original: AuthoritativeQuote,
  fresh: AuthoritativeQuote
): void {
  if (
    original.url !== fresh.url ||
    original.method !== fresh.method ||
    JSON.stringify(original.requestBody) !== JSON.stringify(fresh.requestBody)
  ) {
    throw new Error("Fresh quote request envelope differs from approved request");
  }
  const before = original.selectedOffer;
  const after = fresh.selectedOffer;
  if (
    before.tokenSymbol.toUpperCase() !== after.tokenSymbol.toUpperCase() ||
    before.atomicAmount !== after.atomicAmount ||
    before.assetContract.toLowerCase() !== after.assetContract.toLowerCase() ||
    before.payTo.toLowerCase() !== after.payTo.toLowerCase() ||
    before.network !== after.network
  ) {
    throw new Error("Authoritative 402 terms changed; request fresh human approval");
  }
}

export function buildBuyCliArgs(
  plan: ReturnType<typeof verifyApprovedPaidPlan>,
  entryFile: string,
  requestFile: string
): string[] {
  const args = [
    entryFile, "--account", plan.account, "--json",
    "curl", "--max-amount", plan.amount, "--token", plan.token,
    "--request", plan.method
  ];
  if (plan.method === "POST") {
    args.push("--header", "content-type: application/json", "--data-file", requestFile);
  }
  args.push(plan.url);
  return args;
}
