import test from "node:test";
import assert from "node:assert/strict";
import {
  BUY_ENABLE_LITERAL, assertPaidModeExplicitlyEnabled,
  verifyApprovedPaidPlan, assertFreshQuoteUnchanged, buildBuyCliArgs,
} from "../src/lib/buyPlan.ts";

const URL = "https://gateway.usebuy.ai/v1/social/x/posts/search";
const PAY_TO = "0x20faAca5F980E29639A0FCC6dcA6988E18ed333B";
const ASSET = "0xcebA9300f2b948710d2653dD7B07f33A8B32118C";

function fixture() {
  const body = { query: "Celo agent task" };
  return {
    id: "task-test-001",
    platform: "x",
    capabilityId: "x.posts.search",
    intent: { requestEnvelope: { url: URL, method: "POST", body } },
    approval: { maxAuthorizedSpend: "0.005", authorizedToken: "USDC" },
    quote: {
      url: URL, method: "POST", requestBody: body,
      timestamp: new Date().toISOString(),
      selectedOffer: {
        tokenSymbol: "USDC", atomicAmount: "5000", humanAmount: "0.005",
        assetContract: ASSET, payTo: PAY_TO, network: "eip155:42220",
        timeoutSeconds: 300
      }
    }
  };
}

test("two explicit environment controls must be present; never enabled by one switch", () => {
  for (const env of [
    {}, {POLICY_DISALLOW_SPEND: "false"}, {LIVE_BUY_MODE: BUY_ENABLE_LITERAL},
    {POLICY_DISALLOW_SPEND: "true",LIVE_BUY_MODE: BUY_ENABLE_LITERAL},
    {POLICY_DISALLOW_SPEND: "false",LIVE_BUY_MODE: "true"}
  ]) {
    assert.throws(() => assertPaidModeExplicitlyEnabled(env));
  }
  assert.doesNotThrow(() => assertPaidModeExplicitlyEnabled({
    POLICY_DISALLOW_SPEND: "false", LIVE_BUY_MODE: BUY_ENABLE_LITERAL
  }));
});

test("approved plan binds the exact URL, method, body, quoted token and cap", () => {
  const record = fixture();
  const plan = verifyApprovedPaidPlan(record);
  assert.equal(plan.token, "USDC");
  assert.equal(plan.amount, "0.005");
  assert.equal(plan.method, "POST");
  const args = buildBuyCliArgs(plan, "C:/buy/main.js", "C:/tmp/body.json");
  assert.deepEqual(args, [
    "C:/buy/main.js", "--account", "celo-open-rails", "--json",
    "curl", "--max-amount", "0.005", "--token", "USDC",
    "--request", "POST", "--header", "content-type: application/json",
    "--data-file", "C:/tmp/body.json", URL
  ]);
  assert.ok(!args.includes("--sandbox"));
});

test("quotes must not change recipient, token, amount or payload after approval", () => {
  const rec = fixture();
  assertFreshQuoteUnchanged(rec.quote, structuredClone(rec.quote));
  for (const path of ["payTo", "atomicAmount", "assetContract", "tokenSymbol", "network"]) {
    const changed = structuredClone(rec.quote);
    changed.selectedOffer[path] = "CHANGED";
    assert.throws(() => assertFreshQuoteUnchanged(rec.quote, changed), path);
  }
  const changedBody = structuredClone(rec.quote);
  changedBody.requestBody.query = "different search";
  assert.throws(() => assertFreshQuoteUnchanged(rec.quote, changedBody));
});

test("over-budget, expired, replay, and untrusted endpoints fail before any CLI could start", () => {
  const edits = [
    (r) => r.approval.maxAuthorizedSpend = "0.004",
    (r) => r.approval.authorizedToken = "USDT",
    (r) => r.quote.timestamp = "2000-01-01T00:00:00Z",
    (r) => r.execution = {status:"settle_uncertain"},
    (r) => r.intent.requestEnvelope.url = "http://127.0.0.1:8000/",
    (r) => r.quote.selectedOffer.network = "eip155:8453",
    (r) => r.quote.selectedOffer.humanAmount = "2", // prevent CLI human cap differing from atomic charge
    (r) => r.platform = "browser",
    (r) => r.quote.requestBody = {query:"different"},
    (r) => r.approval = undefined
  ];
  for (const edit of edits) {
    const r = fixture();
    edit(r);
    assert.throws(() => verifyApprovedPaidPlan(r));
  }
});
