// Live integration smoke against an isolated local server with a TEST-ONLY token.
// Run only with POLICY_DISALLOW_SPEND=true and PROCUREMENT_DATA_DIR=.data-smoke.
// No payment authorization, wallet signature, or external purchase is made.
import assert from "node:assert/strict";

const base = process.env.SMOKE_BASE || "http://127.0.0.1:4320";
const token = process.env.SMOKE_AUTH_TOKEN;
if (!token || token.length < 24) throw new Error("Set a test-only SMOKE_AUTH_TOKEN");

async function call(path, method = "GET", body, cookie = "", origin = base) {
  const headers = { Accept: "application/json" };
  if (cookie) headers.Cookie = cookie;
  if (method !== "GET") {
    headers.Origin = origin;
    headers["Content-Type"] = "application/json";
  }
  const r = await fetch(base + path, {
    method, headers, body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(20000),
  });
  let data = null;
  try { data = await r.json(); } catch {}
  return { status: r.status, data, cookie: r.headers.get("set-cookie") };
}

const unauthorized = await call("/api/procure");
assert.equal(unauthorized.status, 401);
console.log("1. Anonymous ledger blocked: 401");

const badLogin = await call("/api/operator", "POST", { token: "bad" });
assert.equal(badLogin.status, 401);
console.log("2. Incorrect operator token blocked: 401");

const login = await call("/api/operator", "POST", { token });
assert.equal(login.status, 200, JSON.stringify(login.data));
const cookie = login.cookie?.split(";")[0];
assert.ok(cookie?.startsWith("celo_operator_session="));
console.log("3. Test-only operator login: 200");

const authed = await call("/api/procure", "GET", undefined, cookie);
assert.equal(authed.status, 200);
assert.ok(Array.isArray(authed.data));

const crossOrigin = await call("/api/intent", "POST", { objective: "test" }, cookie, "https://attacker.example");
assert.equal(crossOrigin.status, 403);
console.log("4. Cross-origin mutation blocked: 403");

const catalog = await call("/api/catalog");
assert.equal(catalog.status, 200, JSON.stringify(catalog.data));
assert.ok(catalog.data.capabilities.some((c) => c.id === "sqd.datasets"));
console.log("5. Live catalog: " + catalog.data.capabilities.length + " capabilities");

const free = await call("/api/procure", "POST", {
  objective: "List available SQD datasets across supported chains",
  capabilityId: "sqd.datasets",
}, cookie);
assert.equal(free.status, 200, JSON.stringify(free.data));
assert.equal(free.data.quote.selectedOffer.tokenSymbol, "FREE");
console.log("6. Free catalog capability and zero-cost quote: " + free.data.id);

const delivered = await call("/api/procure", "PUT", {
  recordId: free.data.id, maxSpend: "0", tokenSymbol: "FREE",
}, cookie);
assert.equal(delivered.status, 200, JSON.stringify(delivered.data));
assert.equal(delivered.data.execution?.status, "delivered", JSON.stringify(delivered.data.execution));
assert.ok(delivered.data.execution.resultData);
console.log("7. Live free SQD payload delivered and recorded");

const freeDuplicate = await call("/api/procure", "PUT", {
  recordId: free.data.id, maxSpend: "0", tokenSymbol: "FREE",
}, cookie);
assert.equal(freeDuplicate.status, 409);
console.log("8. Repeat free execution blocked: 409");

const paid = await call("/api/procure", "POST", {
  objective: "Search Twitter posts about Celo open rails",
  capabilityId: "x.posts.search",
}, cookie);
assert.equal(paid.status, 200, JSON.stringify(paid.data));
assert.ok(paid.data.quote?.selectedOffer);
assert.ok(BigInt(paid.data.quote.selectedOffer.atomicAmount) > 0n);
console.log("9. Real unpaid 402 quote: " + paid.data.quote.selectedOffer.atomicAmount + " atomic units");

const halted = await call("/api/procure", "PUT", {
  recordId: paid.data.id,
  maxSpend: paid.data.quote.selectedOffer.humanAmount,
  tokenSymbol: paid.data.quote.selectedOffer.tokenSymbol,
}, cookie);
assert.equal(halted.status, 200, JSON.stringify(halted.data));
assert.equal(halted.data.execution?.status, "halted_by_policy");
assert.equal(halted.data.execution?.settlementDetails?.txHash, undefined);
console.log("10. Paid execution halted safely BEFORE signing; no new transaction");

const paidDuplicate = await call("/api/procure", "PUT", {
  recordId: paid.data.id,
  maxSpend: paid.data.quote.selectedOffer.humanAmount,
  tokenSymbol: paid.data.quote.selectedOffer.tokenSymbol,
}, cookie);
assert.equal(paidDuplicate.status, 409);
console.log("11. Paid retry blocked: 409");

const history = await call("/api/procure", "GET", undefined, cookie);
assert.equal(history.status, 200);
assert.ok(history.data.some((r) => r.id === free.data.id && r.execution?.status === "delivered"));
assert.ok(history.data.some((r) => r.id === paid.data.id && r.execution?.status === "halted_by_policy"));
console.log("12. Both tasks persisted in isolated QA ledger");
console.log("LIVE_E2E_PASSED_WITH_ZERO_SPEND");
