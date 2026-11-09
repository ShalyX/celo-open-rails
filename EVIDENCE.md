# EVIDENCE — HQ Proof register

**Owner:** Operator HQ / Engineering. **Checked:** 2026-11-09 on Windows, Celo mainnet 42220. Evidence is scoped to the observed environment. A green slice is not full-product readiness.

| ID | Claim | Status | Proof / artifact | Limits |
|---|---|---|---|---|
| E01 | Historical 0.005 USDC Buy mechanism worked | VERIFIED, historical spike | `0x7e511e9094756923f3373c01ae7965a3f1ea1f5b43b03172ee91d97e19d8ac43`, block 82246474 | Not the new application task |
| E02 | Live Buy catalog discovery | VERIFIED | Current product purchase flow fetched catalog and selected available `x.posts.search` | Dynamic catalog can change |
| E03 | Authoritative unpaid exact quote | VERIFIED | New paid-task artifact records 5000 atomic USDC, Celo, exact request and payee | Exact quote is time-limited |
| E04 | Genuine free SQD result | VERIFIED, prior local run | `tests/e2e-smoke.mjs`; `docs/QA_REPORT.md` | Free result is not a paid call |
| E05 | Bounded operator authorization and one-shot execution | VERIFIED, scoped | New task approved at 0.005 USDC, executor fresh-quoted, saved attempt, one CLI call; replay 409 | Multi-instance safety and crash recovery not proven |
| E06 | New paid service result through product | VERIFIED, local API slice | `docs/evidence/paid-task-20261109.json`: task `task-1794186340719-t3y6`, tx `0xba529f67e679cfafb1ffeb6749cebd06cf967b0dc43ce6cf79b0255bcec63a61`, block 82285602, successful exact 5000-atomic Transfer, 18 returned tweet records | Team-owned task; no model or full paid browser QA claim |
| E07 | Own ERC-8004 identity | VERIFIED | Agent 10059; `docs/evidence/erc8004-registration-20261109.json`; successful registration tx `0xbac5c383f43d381d27313694cb4d5141d9d34817f266fdfa54e88eae7d88bd36`; ownerOf/tokenURI matched | Identity does not prove users or enrollment |
| E08 | TikHub provider identity | VERIFIED in previous live smoke | Provider ID 9895 matched registry owner and provider metadata | Separate from our own ID 10059; dynamic proof freshness applies |
| E09 | Live model-driven selection | UNPROVEN | Optional model code exists; new paid task explicitly uses deterministic fallback | No model use claimed or additional API spending authorized |
| E10 | Public source and registration URI | VERIFIED | GitHub CLI PUBLIC; raw JSON/image HTTP 200 before signing; pushed metadata includes agent 10059 | GitHub raw cache briefly lagged push, then refreshed |
| E11 | Genuine independent users / demand | UNPROVEN | No qualifying independent wallet or adoption evidence | Own purchase cannot satisfy this |
| E12 | Build/type/security checks | VERIFIED | 19/19 tests, TypeScript exit 0, fresh `.next-approved` production build exit 0 | Does not prove every P0 or hosted production readiness |
| E13 | Finished narrated demo | UNPROVEN | Prior authentic screenshots and demo draft exist | Video and demo QA not completed |
| E14 | Loops enrollment/submission | UNPROVEN | No observed confirmation or receipt | No submission action authorized in this request |
| E15 | Free Buy CLI invocation | VERIFIED, previous free run | Zero-cap SQD CLI call succeeded | Separate from the new paid purchase |
| E16 | Exact new settlement from operator wallet | VERIFIED | Raw chain receipt and Transfer in paid-task artifact: USDC `0xcebA9300f2b948710d2653dD7B07f33A8B32118C`, from `0xf903e8a6FC3B751D8466469Fa85F2A1B9Caeba8b`, to `0x20faAca5F980E29639A0FCC6dcA6988E18ed333B`, amount 5000; wallet debit 0.005 | Facilitator sent settlement transaction; owner debit verified from token log |
| E17 | Registration stayed within cap | MEASURED / VERIFIED | Gas 223776 × 202500000000 wei + reported zero L1 fee = 0.04531464 CELO < 0.07; signed fee bound with reserve 0.0642630175 | No further transaction authorized |
| E18 | Useful result presentation | VERIFIED (scoped local browser) | Real Chrome operator paid task renders 18 original X posts and 18 source links after Show All; /proof anonymous page does likewise; screenshots `docs/evidence/07` to `13` | Source-backed field extraction, not sentiment/model synthesis; public proof page not yet hosted on HTTPS |
| E19 | Paid task survives process restart | VERIFIED, local | Disabled-mode server restart: authenticated history returns same delivered task/hash; duplicate PUT 409 | Single Windows instance; not cross-device transactional storage |

## Approval consumption and provenance

User approved exactly one registration (total cap 0.07 CELO), repository publication and exactly one product Buy (cap 0.005 USDC). Both monetary actions confirmed within cap. No additional spend, deployment, submission, outreach or independent-user activity occurred. One-time local markers are consumed; paid server stopped and `.env.local` remains disarmed. Signing used the Windows OS credential store; no key export.

Paid response includes provider run `01M6YXE89ZFM8S5C4TC3VSP1M1`; quoted body `{"query":"Celo MiniPay","type":"latest"}`. Provider `resultCount: 1` is preserved verbatim; separately measured `output.timeline` contains 18 tweet entries. No independent-user, sentiment, novelty or model-analysis claims are inferred from those records. Application redacts secret-looking fields and truncates deeply nested data.

A secondary receipt lookup briefly returned null; read-only RPC reconciliation confirmed success. There was no paid retry. Local cpay receipt shards contain duplicates of historical data; count UNIQUE hashes: 1 before, 2 after.

## Product Integrity / Proof Engine

PARTIAL_PRODUCT, local paid API SLICE_VERIFIED with 18-post browser followthrough. Original 12 P0s preserved, 11 scoped P0s verified; P0-02 live model-driven selection remains UNPROVEN. Read-only uncertain recovery matched original receipt in a safe in-memory test; a real process-crash rehearsal remains OPEN. Proof Engine remains OPEN: E09, E11, E13 and E14 plus name/hygiene/hosting/submission gates. Not JUDGE_READY or submitted.

## Hermes P0-02 reasoning evidence (new)

**Code implemented; live proof BLOCKED:** `src/lib/hermesIntent.ts`, `src/lib/intentEngine.ts`, and `tests/hermes-intent.test.mjs` contain seven new unit/negative cases. 35 automated tests passed and TypeScript validation passed. The Caraxes VPS Hermes v0.19.0 gateway is active with an existing provider/model configured, but its new authenticated API is not yet listening on `127.0.0.1:8642`; real provider selection through the desk is **not verified**. No false fallback, no new payment and no claim of P0-02 completion. An actual run and tool-permissions verification remain mandatory. See `docs/HERMES_INTEGRATION.md`.


## E20 — Real Hermes model reasoning through the actual Desk API (2026-11-09)

**VERIFIED — locally scoped.** Caraxes Hermes v0.19.0 runs an authenticated OpenAI-compatible server on VPS loopback; the Windows desk reaches it via a local SSH tunnel. Bare `/v1/models` returned HTTP 401, authenticated `/v1/models` returned `forge`, and authenticated `/v1/toolsets` showed **zero executable tools**. The active forge profile explicitly disables MCP and selects an empty executable-tool set.

Two distinct authenticated `POST /api/intent` calls fetched the **real current Buy catalog** and obtained genuine model replies: (1) Celo MiniPay posts → `x.posts.search`, valid `POST` request with search query and latest type, confidence 0.98; (2) SQD chain datasets → `sqd.datasets`, valid `GET` request with empty body, confidence 1. Both have `isAiReasoning=true` and `engineModel=Hermes Agent (forge)`. Model-proposed routes are rejected unless in the real Buy catalog and pass schema/safety validation. Both were inference-only: **zero paid calls**. Exact sanitized evidence: `docs/evidence/hermes-live-selection-20261109.json`, implementation `src/lib/hermesIntent.ts`, detailed acceptance notes `docs/HERMES_INTEGRATION.md`.

**P0-02 is now VERIFIED for the original single-operator research-selection scenario.** This does not prove multi-user production readiness, onchain repeated settlement, or a single combined new Hermes-selected paid purchase. Existing 0.005 USDC completed task remains separate. Previous E20-unverified or legacy descriptions are superseded by this scoped evidence.
