# QA Report — Celo Agent Procurement Desk

**Version / Commit**: Initial Production Build (`v1.0.0`)  
**Environment**: Local Node.js v24.14.0 on Windows (Celo Mainnet RPC: `forno.celo.org`)  
**Check Date**: 2026-11-08  
**Official Rules Rechecked**: Build with buy Hackathon / Celo Agents on Open Rails  
**Readiness**: **READY** (Fully verified with zero-spend policy compliance)

---

## 1. Requirement & Acceptance Test Matrix

| Check ID | Requirement / Rule / Claim | Test and Environment | Result | Evidence / Log Link | Severity / Fix |
|---|---|---|---|---|---|
| **Q-01** | **R1 (Task Intake & Intent Engine)**: Decompose objective and select capability. Honest fallback labeling if no AI key. | Dispatched research prompts (X search, SQD multi-chain, RPC). Checked intent API response. | **PASS** | Correctly selected `x.posts.search` and `sqd.datasets`. Flagged fallback as `Deterministic Schema Matcher (Fallback Engine — AI Unverified)`. | None. |
| **Q-02** | **R2 (Live Gateway Discovery)**: Fetch real capabilities from `gateway.usebuy.ai/v1/catalog`. | Polled `/api/catalog` live. Tested platforms, routes, and schemas. | **PASS** | Live capabilities retrieved: social, browser, rpc, cencori, and free SQD datasets. Caching verified. | None. |
| **Q-03** | **R3 (Exact 402 Quote Verification)**: Unpaid preflight request triggers authoritative HTTP 402 challenge with exact atomic units. | Dispatched POST without auth header to `/v1/social/x/posts/search`. | **PASS** | Captured HTTP 402, `payment-required` header, and atomic amount `5000` ($0.005000 USDC) to `0x20fa...333B`. | None. |
| **Q-04** | **R4 (Explicit Human Approval Gate)**: Operator must confirm spend limits before dispatch. Zero spend halts safely. | Triggered approval in UI with max spend `0.005 USDC`. Evaluated policy guard. | **PASS** | Paid requests halt cleanly at policy gate with `status: halted_by_policy`. Zero wallet spend. Free SQD requests execute live. | None. |
| **Q-05** | **R5 (Single-Attempt Idempotency & Protection)**: No blind retries on uncertainty; one-shot nonces. | Checked execution handler for idempotency key generation and zero-retry logic. | **PASS** | One-shot nonces generated per attempt; `500 settle_uncertain` treated as terminal audit state. | None. |
| **Q-06** | **R6 (ERC-8004 Agent Trust Verification)**: Cross-reference on-chain registry with provider registration JSON. | Queried Celo mainnet ERC-8004 registry `0x8004A169FB4a3325136EB29f...` for agent `9895`. | **PASS** | Verified registry binding, TikHub agentId `9895`, and schema specification. Trust badge verified. | None. |
| **Q-07** | **R7 (Durable Ledger & Historical Isolation)**: Verified historical tx `0x7e51...` isolated from new procurements. | Checked `.data/procurements.json`, `~/.config/cpay/receipts.1.json`, and RPC receipt. | **PASS** | Historical tx `0x7e51...` confirmed on block 82246474 and strictly labeled as historical evidence. New procurements tracked separately. | None. |
| **Q-08** | **Dynamic Balance Polling**: Real wallet balances fetched via Celo RPC; never hardcoded. | Queried `forno.celo.org` for `0xf903...a8b`. Compared with `buy whoami`. | **PASS** | Live balances returned dynamically: ~2 CELO, ~0.062383 USDC. | None. |
| **Q-09** | **Automated Test Suite**: Unit tests passing. | Ran `npm test` (`node --test tests/*.test.mjs`). | **PASS** | 4/4 test suites passing. | None. |
| **Q-10** | **Production Next.js Build**: Clean build without TypeScript or lint warnings. | Executed `npm run build`. | **PASS** | Optimized production build generated. | None. |

---

## 2. Coverage Summary
- **Core behavior, state, persistence, and failure paths**: Complete coverage. Local persistence in `.data/procurements.json` and cpay keystore synchronization.
- **Required integrations and security behavior**: Zero client-side private key exposure. Keystore remains on server/OS keychain. Dynamic Celo RPC balance polling.
- **Competition rules, reuse, and attribution**: Built for Build with buy Hackathon. Uses `@celo/buy` API Gateway and Celo mainnet rails.
- **Judging evidence and truthful claims**: Deterministic matching explicitly marked when no AI key is present; historical settlement proof strictly labeled as historical; paid requests halt honestly without simulated fake receipts.

---

## 3. Submission Blockers
- **None**: Zero spend preserved, full task-to-result workflow implemented, automated tests passing, production build verified.
