# PRODUCT — Original approved Agent Procurement Desk, reconstructed HQ lock

**Source of original decision:** User's Celo hackathon build instruction, accepted Antigravity implementation plan with mandatory corrections on 2026-11-08, `docs/PROJECT_BRIEF.md`, `docs/REQUIREMENTS.md`. This file **preserves**, rather than revises, the approved product. Formal original HQ lock record did not previously exist.

**Lock:** Reconstructed revision 1, 2026-11-08, no substantive scope changes permitted without user approval.
**Current classification:** **PARTIAL PRODUCT**. Historical spike and real local paid API slice independently verified; full product NOT VERIFIED.

## Target user and problem

An independent researcher or solo agent builder doing real-time research needs external API data but doesn't want unconstrained API keys, silent wallet spending, unclear paywall prices, or a trail of unaccounted charges. The desk turns a research objective into a controlled purchase of outside capabilities, a useful returned result, and a durable Celo-backed audit.

**Demand validation:** still UNKNOWN; the user segment is a product hypothesis, not an independently proven user base.

## Original product promise

Task intake -> intelligent capability selection -> authoritative unpaid HTTP 402 quote -> clear human spend approval -> exactly one paid service call -> useful result -> preserved provider/amount/receipt. Free SQD data works without charges. Show verified agent/provider identity separately; never mislabel a historical setup transaction as new payment.

**Differentiator to preserve:** Task-to-result procurement under a human-controlled cap with an independently inspectable settlement history; **not** a generic budget dashboard or a status screen of a prior payment.

**Magic moment:** Operator asks a real question, the agent chooses and buys a paid outside capability under budget and delivers an answer and on-chain receipt in the same task.

## Full user journey

Entry -> operator sign-in and wallet readiness -> research objective -> capability selection (model-driven if configured, honestly labeled fallback otherwise) -> price and exact input preview -> human authorization -> real paid one-shot call (or free route) -> service response made useful -> durable status/receipt -> revisit/result follow-through. The local paid API leg is now verified; full browser acceptance and useful result follow-through remain incomplete.

## Immutable P0 coverage ledger

Statuses: VERIFIED = directly tested; IMPLEMENTED = present but unverified; BLOCKED = nonfunctional or external constraint. Historical spike never satisfies P0-06 or P0-07.

| ID | Locked P0 / user value | Surface | Implementation | Acceptance scenario / proof | Status | Gap |
|---|---|---|---|---|---|---|
| P0-01 | Accept an actual research task | Task console | `src/components/TaskIntakeConsole.tsx`, `/api/procure` | Authenticated API creates task from user input; browser screenshot | VERIFIED (API) | Full browser click-through not captured |
| P0-02 | Agent selects appropriate capabilities, explains why | Intent reasoning card | `src/lib/intentEngine.ts`, `src/lib/hermesIntent.ts` | Real Hermes model selects valid live provider and request payload; human can inspect rationale | IMPLEMENTED / LIVE UNVERIFIED | 35 tests and build pass; VPS authenticated model endpoint and actual model response still need proof; fallback is opt-in |
| P0-03 | Discover actual Buy services dynamically | Capability chooser | `src/lib/gateway.ts`, `/api/catalog` | Live catalog returned 171 capabilities during smoke run | VERIFIED | May change with gateway |
| P0-04 | Present exact unpaid quote, asset and payee | 402 quote inspector | `/api/quote`, `src/lib/gateway.ts` | Live 402 quotes 5,000 atomic USDC units | VERIFIED | Quote revalidation on eventual paid dispatch needed |
| P0-05 | Only authorized bounded spending | Approval barrier | `/api/operator`, `/api/procure`, `requestSafety.ts` | Operator login, spend/token caps, same-origin guard, policy halt smoke | VERIFIED (safe path) | One authorized live API run verified; default mode disarmed |
| P0-06 | Execute one real paid outside service call | Execution monitor | `src/lib/buyPlan.ts`, `src/lib/buyExecutor.ts`, `procurementStore.ts` | New task `task-1794186340719-t3y6`, 0.005 USDC, confirmed tx; paid-task artifact E06 | VERIFIED (local API) | Full browser acceptance pending; approval consumed, no new spend |
| P0-07 | Receive useful result from purchased capability | Result panel | `src/components/ExecutionMonitor.tsx` | Real TikHub output for Celo MiniPay query, 18 tweet records tied to new task and tx, E06 | VERIFIED (API payload) | Paid UI readability still P0-12; no invented interpretation |
| P0-08 | Provide genuine free blockchain-data route | SQD preset/results | `executeSqdQuery`, `/api/procure` | Real free SQD dataset response persists | VERIFIED | None in tested path |
| P0-09 | Durable auditable task/settlement history | History and receipts | `procurementStore.ts`, `/api/receipts` | Disabled-mode server restart returns same delivered task/hash; E19 | VERIFIED (local single-instance) | Local JSON is not transactional across hosted instances |
| P0-10 | Handle uncertainty, replays, and failures safely | Backend / statuses | `withProcurementLock`, `readOnlyRecovery.ts`, `/api/reconcile` | Repeat PUT 409; mocked uncertain states plus real read-only onchain recovery using only original tx | VERIFIED (scoped) | No automatic repeat charge; abrupt OS-crash and multi-instance recovery remain unverified |
| P0-11 | Verify own agent identity and show provider identity truthfully | Trust drawer + submission | Registry / public metadata; `/api/trust` separately verifies provider | Own ID 10059 ownerOf and tokenURI match entry wallet, E07; provider remains ID 9895 | VERIFIED (chain identity) | Own-ID UI integration and official enrollment remain separate |
| P0-12 | Make results usable beyond raw API response | Paid result / history / public proof | `PaidXResearch.tsx`, `xResearch.ts`, `ExecutionMonitor.tsx`, `/proof` | Real local Chrome expands 18 paid X posts with 18 source links; original record and Celo tx remain inspectable; anonymous proof Chrome passes desktop/mobile | VERIFIED (local browser) | No model-generated research synthesis claimed; proof URL not hosted publicly |

**Verified P0 IDs (scoped):** P0-01, P0-03, P0-04, P0-05, P0-06, P0-07, P0-08, P0-09, P0-10, P0-11, P0-12.
**P0 not yet fully verified:** P0-02 (live model-backed selection). Verified rows retain local/single-instance limits; P0-10 actual process-crash recovery and P0-12 public HTTPS hosting remain unproven production-level variants, not silently omitted.
**P0 total:** 12. Neither a historical Celo transaction nor a green build satisfies this inventory.

## Separate feasibility spikes

| Spike | What it proves | What it does NOT prove |
|---|---|---|
| Celo $0.005 paid `@celo/buy` tx 0x7e511...ac43 | External Buy service can settle from our operator wallet on Celo | A new user task completed within this application |
| Live unpaid 402 preflight | Service quote can be obtained for 5,000 atomic USDC | Paid call is made or data is delivered |
| Live free SQD response | A complete FREE task result is delivered and persisted | Paid service, signed settlement, model reasoning or independent adoption |

## Non-goals and forbidden reframings

No unlimited autonomous spend, no synthetic paid result, no fake user data, no wallet secrets in browser, no silent deletion of paid P0, no presentation of free SQD as purchased data, no substituting a prior tx into a new task. Avoid rebuilding the whole app, adding speculative trading or turning the dashboard into the product.

## Product Integrity checkpoint

approved_product: Original task-to-paid-outcome agent procurement desk, revision 1 reconstructed from approved sources.
current_deliverable: PARTIAL_PRODUCT.
mechanism_proven: Historical Buy settlement, genuine free-data flow, and ONE new 0.005 USDC product task with authentic provider output and chain receipt.
full_user_journey: API login -> task -> quote -> approval -> paid result -> confirmed receipt -> persisted history -> 18-post browser view VERIFIED locally; model-driven selection remains UNPROVEN, standalone public proof not hosted.
locked_P0_total: 12.
P0_verified (scoped): 01,03,04,05,06,07,08,09,10,11,12.
P0_missing_or_blocked: 02 (live model selection). Additional deployment-level limits: abrupt crash/multi-instance recovery, no public hosted proof or independent users.
differentiators_retained: task-first purchase, exact cap, real data and Celo audit; model-driven reasoning and polished result follow-through remain unverified.
new_or_replaced_thesis: **NO approved rewrite; YES danger of falsely substituting demo spike as product**.
next_action: verify available real model reasoning without paid calls, complete hygiene/demo/judge and official submission gates, keep original purchase authorization consumed.
verdict: **BLOCKED**.

## Scope and decisions

2026-11-08: User approved implementation plan with mandatory anti-fabrication corrections. No user authorization for additional spending, public publishing, project submission, or new product thesis has been granted.

2026-11-09: Explicit user approval consumed: repo public, own agent 10059 registration fee 0.04531464 CELO < 0.07, exactly one product Buy 0.005 USDC. See EVIDENCE.md. No additional spend or other public-account action authorized. Original lock is unchanged.
