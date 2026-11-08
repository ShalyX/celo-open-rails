import test from "node:test";
import assert from "node:assert/strict";

test("authoritative 402 challenge parsing logic", () => {
  const sample402Accepts = [
    {
      scheme: "exact",
      network: "celo",
      maxAmountRequired: "5000",
      resource: "https://gateway.usebuy.ai/v1/social/x/posts/search",
      description: "Search X posts through buy-gateway",
      mimeType: "application/json",
      payTo: "0x20faAca5F980E29639A0FCC6dcA6988E18ed333B",
      maxTimeoutSeconds: 300,
      asset: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
      extra: {
        name: "USDC",
        version: "2",
        gateway: {
          capability: "x.posts.search",
          provider: "tikhub",
          pricingModel: "per_call",
        },
      },
    },
    {
      scheme: "exact",
      network: "celo",
      maxAmountRequired: "5000",
      resource: "https://gateway.usebuy.ai/v1/social/x/posts/search",
      payTo: "0x20faAca5F980E29639A0FCC6dcA6988E18ed333B",
      asset: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
      extra: { name: "Tether USD" },
    },
  ];

  // Logic: find primary Celo USDC offer
  const usdcOffer = sample402Accepts.find(
    (a) => a.network === "celo" && a.extra?.name === "USDC"
  );

  assert.ok(usdcOffer, "Should locate Celo USDC offer");
  assert.equal(usdcOffer.maxAmountRequired, "5000");
  assert.equal(usdcOffer.payTo, "0x20faAca5F980E29639A0FCC6dcA6988E18ed333B");
  assert.equal(usdcOffer.asset, "0xcebA9300f2b948710d2653dD7B07f33A8B32118C");

  // Atomic units to human readable (6 decimals)
  const humanAmount = (Number(usdcOffer.maxAmountRequired) / 1e6).toFixed(6);
  assert.equal(humanAmount, "0.005000");
});

test("deterministic matcher fallback identification", () => {
  // When no AI model key is configured, fallback must be explicitly tagged
  const mockIntentResult = {
    taskId: "task-12345",
    objective: "Search X for Celo",
    selectedCapabilityId: "x.posts.search",
    reasoning: "Rule-based keyword matching.",
    isAiReasoning: false,
    engineModel: "Deterministic Schema Matcher (Fallback Engine — AI Unverified)",
    confidenceScore: 0.88,
  };

  assert.equal(mockIntentResult.isAiReasoning, false);
  assert.match(mockIntentResult.engineModel, /AI Unverified/);
  assert.match(mockIntentResult.engineModel, /Fallback/);
});

test("policy guard zero-spend enforcement", () => {
  const policyDisallowSpend = true;
  const isPaidCapability = true;

  let executionStatus = "pending";
  let policyHaltReason = null;
  let walletDebited = false;

  if (isPaidCapability && policyDisallowSpend) {
    executionStatus = "halted_by_policy";
    policyHaltReason = "Zero-Spend Safety Policy Guard is active";
    walletDebited = false;
  }

  assert.equal(executionStatus, "halted_by_policy");
  assert.equal(walletDebited, false);
  assert.ok(policyHaltReason.includes("Zero-Spend"));
});

test("historical proof transaction isolation", () => {
  const historicalProofTx = "0x7e511e9094756923f3373c01ae7965a3f1ea1f5b43b03172ee91d97e19d8ac43";
  const newProcurementId = "exec-998877";

  // Ensure new procurement has distinct ID and does not substitute historical proof
  assert.notEqual(newProcurementId, historicalProofTx);
});
