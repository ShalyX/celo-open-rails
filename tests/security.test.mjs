import test from "node:test";
import assert from "node:assert/strict";
import {
  assertTrustedGatewayUrl, assertSafeGatewayMethod, assertFreeSqdPath,
  parseUsdSixDecimalAtoms, assertQuoteWithinApproval,
} from "../src/lib/requestSafety.ts";
import {
  validOperatorToken, isOperatorAuthenticated, isSameOriginRequest,
  operatorSessionValue, OPERATOR_COOKIE,
} from "../src/lib/operatorAuth.ts";

test("quote URLs forbid SSRF to localhost, internal IPs, arbitrary hosts and spoofed hostnames", () => {
  for (const url of [
    "http://gateway.usebuy.ai/v1/catalog",
    "https://gateway.usebuy.ai.evil.example/v1/catalog",
    "http://localhost:8080/v1/catalog",
    "https://127.0.0.1/v1/catalog",
    "https://gateway.usebuy.ai@evil.example/v1/catalog",
    "https://gateway.usebuy.ai/not-gateway",
    "file:///etc/passwd",
  ]) {
    assert.throws(() => assertTrustedGatewayUrl(url), /Only documented|Invalid/);
  }
  assert.equal(assertTrustedGatewayUrl("https://gateway.usebuy.ai/v1/social/x/posts/search").hostname, "gateway.usebuy.ai");
  assert.equal(assertSafeGatewayMethod("get"), "GET");
  assert.throws(() => assertSafeGatewayMethod("DELETE"));
  assert.throws(() => assertSafeGatewayMethod("PUT"));
});

test("free SQD path is never an arbitrary external URL or paid gateway route", () => {
  assert.equal(assertFreeSqdPath("/sqd/datasets"), "/sqd/datasets");
  for (const path of [
    "//evil.example/foo",
    "https://evil.example/",
    "/v1/social/x/posts/search",
    "/v1/other",
  ]) assert.throws(() => assertFreeSqdPath(path));
});

test("authorization cap compares exact atomic units and rejects invalid caps or wrong asset", () => {
  assert.equal(parseUsdSixDecimalAtoms("0.005"), 5000n);
  assert.equal(parseUsdSixDecimalAtoms("1.000001"), 1000001n);
  assert.doesNotThrow(() => assertQuoteWithinApproval("5000", "0.005", "USDC", "USDC"));
  assert.throws(() => assertQuoteWithinApproval("5001", "0.005", "USDC", "USDC"), /below/);
  assert.throws(() => assertQuoteWithinApproval("5000", "0.005", "USDC", "USDT"), /differs/);
  for (const bad of ["-1", "0.0000001", "Infinity", "1e9", "NaN", "1,000", "01.1", ""]) {
    assert.throws(() => parseUsdSixDecimalAtoms(bad));
  }
});

test("operator login validates secret and signed session and rejects cross-origin requests", () => {
  const old = process.env.OPERATOR_ACCESS_TOKEN;
  try {
    process.env.OPERATOR_ACCESS_TOKEN = "superlong_test_only_secret_string_abc123";
    assert.equal(validOperatorToken("bad"), false);
    assert.equal(validOperatorToken("superlong_test_only_secret_string_abc123"), true);
    const req = new Request("http://localhost:4319/api/procure", {
      headers: { cookie: OPERATOR_COOKIE + "=" + operatorSessionValue(), origin: "http://localhost:4319" },
    });
    assert.equal(isOperatorAuthenticated(req), true);
    assert.equal(isSameOriginRequest(req), true);
    const foreign = new Request("http://localhost:4319/api/procure", { headers: { origin: "https://evil.example" } });
    assert.equal(isSameOriginRequest(foreign), false);
    assert.equal(isOperatorAuthenticated(foreign), false);
  } finally {
    if (old === undefined) delete process.env.OPERATOR_ACCESS_TOKEN;
    else process.env.OPERATOR_ACCESS_TOKEN = old;
  }
});
