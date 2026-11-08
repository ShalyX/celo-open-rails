# System Architecture — Celo Agent Procurement Desk

## 1. Architectural Topology

```
+-----------------------------------------------------------------------------------+
|                              Operator / User Browser                              |
|   +---------------------------------------------------------------------------+   |
|   |                      Procurement Desk Web Application                      |   |
|   |  - Task Intake & Intent Formulator   - Live 402 Quote Inspector            |   |
|   |  - Dynamic Wallet & Balance Banner   - Explicit Human Approval Barrier     |   |
|   |  - Live Execution & Result Monitor   - Tabular Audit & Historical Archive  |   |
|   +---------------------------------------------------------------------------+   |
+-----------------------------------------|-----------------------------------------+
                                          | JSON over HTTPS
                                          v
+-----------------------------------------------------------------------------------+
|                        Next.js Server & Execution Runtime                         |
|                                                                                   |
|  +--------------------+  +--------------------+  +-----------------------------+  |
|  |   /api/catalog     |  |    /api/quote      |  |         /api/intent         |  |
|  | - Fetches gateway  |  | - Dispatches 402   |  | - AI Semantic Matching      |  |
|  |   catalog          |  |   preflight        |  |   (Gemini/OpenAI)           |  |
|  | - Caches & formats |  | - Parses headers   |  | - Deterministic fallback    |  |
|  |   capabilities     |  |   & accepts array  |  |   (explicitly marked)       |  |
|  +--------------------+  +--------------------+  +-----------------------------+  |
|                                                                                   |
|  +--------------------+  +--------------------+  +-----------------------------+  |
|  |   /api/account     |  |   /api/procure     |  |        /api/receipts        |  |
|  | - Reads cpay meta  |  | - Idempotency gate |  | - Reads cpay receipts.1.json|  |
|  | - Dynamic RPC bal  |  | - Policy guard     |  | - Queries Celo mainnet RPC |  |
|  |   (CELO + USDC)    |  | - SQD live runner  |  | - ERC-8004 verification     |  |
|  +--------------------+  +--------------------+  +-----------------------------+  |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | Local Persistence: .data/procurements.json & ~/.config/cpay/                |  |
|  +-----------------------------------------------------------------------------+  |
+--------------------|---------------------------------|----------------------------+
                     |                                 |
                     v                                 v
   +------------------------------------+   +-----------------------------------+
   |        Buy API Gateway             |   |        Celo Mainnet (42220)       |
   |   (https://gateway.usebuy.ai)      |   |        (https://forno.celo.org)   |
   | - /v1/catalog                      |   | - Dynamic balance verification    |
   | - /v1/social/x/posts/search        |   | - ERC-8004 Registry contract      |
   | - /sqd/datasets (free multi-chain) |   |   (0x8004A169FB4a3325136EB29f...) |
   | - Upstream provider credentials    |   | - Celoscan transaction receipts   |
   +------------------------------------+   +-----------------------------------+
```

---

## 2. Key Subsystems & Interaction Protocols

### 2.1 Intent Analysis & Capability Matcher (`/api/intent`)
- Ingests free-form research tasks.
- Evaluates against the live Buy Gateway catalog capabilities (`platform`, `method`, `inputSchema`, `pricingModel`).
- **Execution Paths**:
  1. **AI Model Available**: Uses LLM SDK / API with system instructions to output a strict JSON payload `{ capabilityId, reasoning, parameters, inputEnvelope, confidence }`.
  2. **No Model Key Configured**: Executes a deterministic token-frequency and schema-validating matcher. Emits `{ capabilityId, reasoning, parameters, inputEnvelope, isFallback: true, label: "Deterministic Matching (Rule-based Fallback — AI Unverified)" }`.

### 2.2 Unpaid Authoritative 402 Quoting (`/api/quote`)
- Emits a real HTTP request to the target gateway endpoint with the prospective body, deliberately omitting authorization headers.
- Captures the HTTP 402 response:
  - Header: `payment-required` (base64-encoded x402-v2 protocol specification).
  - Body: JSON object containing `accepts` array with scheme (`exact`), network (`celo`), `maxAmountRequired` (atomic units), asset contract address, recipient address, and timeout.
- Returns canonical quote parameters to the UI for human inspection.

### 2.3 Explicit Human Approval & Policy Enforcement (`/api/procure`)
- Requires explicit user authorization before any dispatch.
- **Strict Spend Policy**:
  - `POLICY_DISALLOW_SPEND = true` (default in this environment).
  - When a paid route is approved:
    1. Generates one-shot idempotency token and signs ready payment intent parameters.
    2. Enforces policy halt: logs the approved procurement in the audit store with status `"halted_by_policy"`.
    3. Emits transparent feedback: `"Procurement approved by operator. Execution halted: Policy Disallow Spend is ACTIVE. No funds debited."`
    4. **Zero Historical Substitution**: Never pretends the historical transaction was generated by this new task.
  - When a free route (SQD Portal) is approved:
    1. Executes the live call against `https://gateway.usebuy.ai/sqd/...`.
    2. Receives and validates genuine response payload.
    3. Saves record with status `"delivered"` and presents live data.

### 2.4 ERC-8004 Agent Trust Verification
- Gateway catalog binds providers to ERC-8004 Agent IDs on Celo:
  - Agent Registry: `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`.
  - Provider Agent ID (TikHub): `9895`.
  - Registration URI: `https://gateway.usebuy.ai/v1/providers/tikhub/agent-registration.json`.
- The backend queries the Celo RPC to verify agent ownership, token URI, and active status, cross-referencing with the HTTP registration document before presenting a verified badge.

---

## 3. Security & Operational Boundaries
1. **Keystore Isolation**: Frontend bundles contain no private keys, mnemonics, or RPC signer capabilities. All key material resides in OS keychain or secure server runtime.
2. **Dynamic Balances**: Balances are queried in real time from Celo mainnet (`forno.celo.org`) for address `0xf903e8a6FC3B751D8466469Fa85F2A1B9Caeba8b`.
3. **Settlement Ambiguity Handling**:
   - If a payment returns HTTP 500 `settle_uncertain` or network drops post-dispatch, status is recorded as `settle_uncertain`.
   - Never retries without explicit on-chain verification of the EIP-3009 nonce.
