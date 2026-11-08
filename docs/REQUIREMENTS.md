# Requirements Specification — Celo Agent Procurement Desk

**Version**: 1.0.0  
**Status**: APPROVED & LOCKED  
**Mapping**: BUILD_INSTRUCTIONS.txt & Hackathon Evaluation Rubric

---

## Functional Requirements

### R1: Task Intake, Intent Analysis & Capability Selection
- **R1.1**: The desk must accept arbitrary plain-text research objectives (e.g. social sentiment, blockchain data queries, browser automation).
- **R1.2 (Dual-Mode Reasoning)**:
  - When an AI model key (`GEMINI_API_KEY`, `OPENAI_API_KEY`, etc.) is present, perform full semantic capability selection with structured reasoning.
  - When no AI model key is configured, execute deterministic keyword/schema matching and **explicitly label the output** as `"Deterministic Matching (Rule-based Fallback — AI Unverified)"`.
- **R1.3**: The engine must output the selected route, HTTP method, target URL, formatted input payload matching the capability's `inputSchema`, and an explanation.

### R2: Live Discovery of Buy Gateway Capabilities
- **R2.1**: The application must fetch live capabilities from `https://gateway.usebuy.ai/v1/catalog`.
- **R2.2**: The catalog must group capabilities by platform (`x`, `reddit`, `youtube`, `instagram`, `linkedin`, `browser`, `chainstack`, `cencori`, `sqd`).
- **R2.3**: Free unmetered services (SQD Network multi-chain portal covering 113+ chains) must be exposed as executable zero-cost capabilities.

### R3: Exact Unpaid 402 Quote Verification
- **R3.1**: The desk must dispatch the exact serialized JSON body to the target gateway endpoint without payment credentials to trigger an authoritative HTTP 402 response.
- **R3.2**: The quoter must parse the `payment-required` header (base64) and the JSON body `accepts` array.
- **R3.3**: The quoter must extract and display:
  - Exact atomic price (e.g. `5000` units) and human-readable amount (e.g. `0.005 USDC`).
  - Accepted token symbols and ERC-20 contract addresses on Celo (USDC `0xcebA...`, USDT `0x4806...`, USAT `0xD2ab...`).
  - PayTo recipient address (`0x20faAca5F980E29639A0FCC6dcA6988E18ed333B`).
  - Expiration window and maximum timeout.

### R4: Explicit Human Approval & Budget Governance Gate
- **R4.1**: No payment attempt or execution dispatch may occur without explicit human approval.
- **R4.2**: The approval gate must present:
  - Selected capability and upstream provider.
  - Target URL and serialized payload.
  - Authoritative 402 quote and maximum spend allowance.
  - Real-time dynamic wallet balances fetched from Celo RPC (CELO and USDC).
- **R4.3 (Policy Enforcement)**:
  - Under `POLICY_DISALLOW_SPEND=true` (testing/hackathon constraint), paid requests must halt cleanly at the approval gate with an explicit status: `"Approved by operator — Execution halted by Policy Guard (Zero Spend Enabled)"`.
  - The system must never substitute historical transactions for new procurement requests.
  - Free SQD queries must execute live end-to-end and deliver verified data.

### R5: Single-Attempt Idempotency & Payment Uncertainty Protection
- **R5.1**: Enforce unique request IDs and one-shot nonces.
- **R5.2**: Never automatically retry requests that fail with network timeout, `500 settle_uncertain`, or `retryable: false`.
- **R5.3**: Maintain an ambiguous state log for uncertain settlements that requires on-chain nonce inspection before any subsequent action.

### R6: ERC-8004 Agent Identity & Trust Verification
- **R6.1**: Parse trust and agent metadata from the gateway catalog:
  - Agent Registry: `eip155:42220:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`.
  - Reputation Registry: `0x8004BAa17C55a88189AE136b182e5fdA19dE9b63`.
- **R6.2**: Fetch provider agent registration JSON (e.g. `https://gateway.usebuy.ai/v1/providers/tikhub/agent-registration.json`) and verify provider agentId (e.g. `9895`).
- **R6.3**: Verify agent registration against the Celo ERC-8004 contract via RPC. Only display the verified trust badge if registration data and registry match.

### R7: Durable Ledger, Historical Evidence & Audit Trails
- **R7.1**: Read and display historical on-chain payment proof:
  - Transaction hash: `0x7e511e9094756923f3373c01ae7965a3f1ea1f5b43b03172ee91d97e19d8ac43`.
  - Labeled explicitly as `"Historical Mainnet Verification Evidence (Executed 2026-11-08 14:13:49 UTC)"`.
- **R7.2**: Read durable local keystore receipts from `~/.config/cpay/receipts.1.json`.
- **R7.3**: Persist all new procurement tasks and outcomes to durable local storage (`.data/procurements.json`).
- **R7.4**: Provide direct verified links to Celoscan block explorer for all on-chain transactions.

---

## Non-Functional & Security Requirements
- **SEC-1**: Never expose private keys, OS keychain contents, or upstream provider credentials in frontend code, client bundles, or API responses.
- **SEC-2**: Dynamic balance polling via authenticated Celo JSON-RPC (`forno.celo.org`).
- **UI-1**: High-density institutional typography and restrained palette (slate neutrals, Celo green/gold accents).
- **UI-2**: Zero emojis as UI icons. Use vector SVGs exclusively (`lucide-react`).
- **PERF-1**: Fast server-side catalog caching with 60-second revalidation.
