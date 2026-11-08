# Judge Demo — Celo Agent Procurement Desk

**Track:** Agents on Open Rails / Build with buy
**Evidence level:** Real live zero-spend task orchestration + historical confirmed Celo stablecoin settlement.
**Not claimed:** A new paid purchase by the desk, LLM autonomy without configured credentials, or an identity owned by this application.

## The story (90 seconds)

**0:00–0:12 — Problem and product.**
An autonomous agent needs fresh external capabilities, but giving it an open-ended wallet or provider key is not acceptable. This is a task-first procurement desk: discover an API, quote its real on-chain settlement price, and require bounded operator approval before execution.

**0:12–0:30 — Live discovery and free result.**
Authenticate with the locally configured operator token. Pick SQD Dataset Discovery and submit. Show the no-cost catalog route and genuine live response, not fixture data. Its outcome stays in the ledger.

**0:30–0:53 — Actual payment challenge.**
Pick X Sentiment Analysis and submit. Show the matched Buy capability and the authoritative HTTP 402 response: 5,000 atomic USDC units = $0.005. Show token contract, merchant recipient, and exact payload.

**0:53–1:08 — Governance.**
Approve exact quoted token and cap. The evaluation spend guard halts BEFORE signing or transferring money. The ledger records an honest halted_by_policy outcome; repeat approval is blocked.

**1:08–1:22 — Historical settlement and trust.**
Scroll to the task history: fresh SQD result Delivered, X request Halted by Policy. Show the separately labeled historical Celo mainnet transaction as independently verified proof of the buy settlement mechanism. This payment predates the desk application.
https://celoscan.io/tx/0x7e511e9094756923f3373c01ae7965a3f1ea1f5b43b03172ee91d97e19d8ac43

**1:22–1:30 — Clear close.**
The desk proves real discovery, exact quotes, free research delivery, bounded operator approvals, and auditable history. New paid purchases are intentionally disabled in this evaluation build until separately authorized.

## Visual evidence

- [Authenticated task and quote](evidence/01-dashboard-authenticated.png)
- [Execution pipeline and history](evidence/02-workflow-and-history.png)
- [Historical proof, policy gate and trust](evidence/03-history-and-trust.png)

## Verification

The expanded test suite has 12 passing guards. The local independent production smoke run passed 12 steps: operator login, live catalog (171 capabilities), real free SQD delivery, unpaid 402 quote (5,000 USDC atomic units), human policy halt, replay prevention, and durable records. Zero additional payment was sent.

## Recording notes

Record the genuine local page, never mock transactions or results. The ERC-8004 badge refers to the gateway provider, not this desk's own identity. The AI selector is deterministic fallback unless a real model has been configured and verified. Hide operator credentials and keystores. Capture at 1536×864 or 1920×1080.
