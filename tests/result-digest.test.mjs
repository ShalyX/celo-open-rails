import test from "node:test";
import assert from "node:assert/strict";
import { digestProviderResponse } from "../src/lib/resultDigest.ts";

test("real SQD data yields exact measured counts and sample names", () => {
  const digest = digestProviderResponse([
    { dataset:"celo", real_time:true },
    { dataset:"ethereum", real_time:false },
    { dataset:"arbitrum-one", real_time:true }
  ]);
  assert.match(digest.summary, /3 datasets/);
  assert.match(digest.summary, /2 flagged real-time/);
  assert.deepEqual(digest.observations, ["celo","ethereum","arbitrum-one"]);
  assert.equal(digest.method,"field-extraction");
});

test("paid model output extracts actual content, no invented inference", () => {
  const digest = digestProviderResponse({choices:[{message:{content:"Celo RPC data available."}}]});
  assert.equal(digest.summary,"Celo RPC data available.");
  assert.equal(digest.method,"field-extraction");
});

test("paid generic outputs never fabricate user outcomes or counts", () => {
  const digest = digestProviderResponse({unexpected:"unknown", observed:12});
  assert.equal(digest.method,"raw-only");
  assert.match(digest.summary,/No supported summary fields/);
  assert.deepEqual(digest.observations, ["unexpected","observed"]);
});
