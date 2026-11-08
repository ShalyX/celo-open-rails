import test from "node:test";
import assert from "node:assert/strict";
import {
  assertTrustedGatewayUrl, assertSafeGatewayMethod, assertFreeSqdPath,
  parseUsdSixDecimalAtoms, assertQuoteWithinApproval,
} from "../src/lib/requestSafety.ts";
import {
  isOperatorAuthenticated, isSameOriginRequest, operatorSessionValue, validOperatorToken,
} from "../src/lib/operatorAuth.ts";

test("quote gateway URL rejects SSRF and redirects to arbitrary hosts", () => {
  assert.equal(assertTrustedGatewayUrl("https://gateway.usebuy.ai/v1/social/x/posts/search").hostname, "gateway.usebuy.ai");
  for (const url of [
    "http://gateway.usebuy.ai/v1/social",
    "http://127.0.0.1:4000/",
    "https://gateway.usebuy.ai.evil.com/v1/data",
    "https://example.com/v1/data",
    "file:///etc/passwd",
    "https://gateway.usebuy.ai/admin",
    "https://test@gateway.usebuy.ai/v1/data",
  ]) {
    assert.throws(() => assertTrustedGatewayUrl(url));
  }
  assert.equal(assertSafeGatewayMethod("post"), "POST");
  assert.throws(() => assertSafeGatewayMethod("DELETE"));
});

test("free SQD paths are constrained to real gateway SQD subroutes", () => {
  assert.equal(assertFreeSqdPath("/sqd/datasets"), "/sqd/datasets");
  for (const path of ["//attacker.test/", "https://attacker.test/", "/v1/social/x/posts/search", "/admin", "/v1/free"]) {
    assert.throws(() => assertFreeSqdPath(path));
  }
});

test("quote approval uses integer atomic comparison, rejects underfunding and token substitution", () => {
  assert.equal(parseUsdSixDecimalAtoms("0.005"), BigInt(5000));
  assert.equal(parseUsdSixDecimalAtoms("1.000001"), BigInt(1000001));
  assertQuoteWithinApproval("5000", "0.005", "USDC", "usdc");
  assert.throws(() => assertQuoteWithinApproval("5001", "0.005", "USDC", "USDC"));
  assert.throws(() => assertQuoteWithinApproval("5000", "0.005", "USDC", "USDT"));
  for (const value of ["-1", "1e6", "NaN", "0.0000001", "01.2", "0,005", ""]) {
    assert.throws(() => parseUsdSixDecimalAtoms(value));
  }
});

test("operator access requires valid secret and cookie; mutation requires same origin", () => {
  const old = process.env.OPERATOR_ACCESS_TOKEN;
  process.env.OPERATOR_ACCESS_TOKEN = "a".repeat(48);
  try {
    assert.equal(validOperatorToken("a".repeat(48)), true);
    assert.equal(validOperatorToken("b".repeat(48)), false);
    const request = new Request("http://127.0.0.1:4399/api/procure", {
      headers: {cookie: "celo_operator_session=" + operatorSessionValue(), origin: "http://127.0.0.1:4399"},
    });
    assert.equal(isOperatorAuthenticated(request), true);
    assert.equal(isSameOriginRequest(request), true);
    assert.equal(isSameOriginRequest(new Request(request.url, {headers:{origin:"https://evil.example"}})), false);
    assert.equal(isOperatorAuthenticated(new Request(request.url)), false);
  } finally {
    if (old === undefined) delete process.env.OPERATOR_ACCESS_TOKEN;
    else process.env.OPERATOR_ACCESS_TOKEN = old;
  }
});
