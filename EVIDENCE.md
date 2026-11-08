# EVIDENCE — HQ Proof register

**Checked:** 2026-11-08 on connected Windows PC. Only actually observed evidence earns VERIFIED status. Proof is scoped to the exact operation/environment.

| ID | Material claim | Criticality | Status | Proof method and artifact | Limitation / next step |
|---|---|---|---|---|---|
| E01 | Buy can settle 0.005 USDC on Celo from our wallet | CRITICAL sponsor | VERIFIED (historical spike) | Celo tx `0x7e511e9094756923f3373c01ae7965a3f1ea1f5b43b03172ee91d97e19d8ac43`, block 82246474, prior @celo/buy run | NOT a new purchase by app |
| E02 | Gateway catalog is live | IMPORTANT | VERIFIED | 2026-11-08 local production smoke: 171 capabilities | Snapshot changes over time |
| E03 | Unpaid 402 exact quote works | CRITICAL | VERIFIED | 2026-11-08 live smoke: 5000 USDC atomic units, x.posts.search | No purchase implied |
| E04 | Genuine free SQD task delivers data | IMPORTANT | VERIFIED | 2026-11-08 isolated production smoke, delivered live response, persisted | Free only; not a scored paid service |
| E05 | Operator approval/budget/one-shot policy gate works in safe path | CRITICAL | VERIFIED (zero spend) | 12/12 smoke steps, 12/12 unit/security tests, HTTP 401/403/409 and halted_by_policy | No live paid replay/uncertain branch validated |
| E06 | New paid API call through desk delivers useful paid result | CRITICAL | BLOCKED | Required: new per-task Celo tx hash + paid provider response + task ledger | Paid handler disarmed; no authorization |
| E07 | Own agent registered via ERC-8004 | CRITICAL eligibility | BLOCKED | 2026-11-08 read-only viem Celo registry balanceOf(0xf903e8a6FC3B751D8466469Fa85F2A1B9Caeba8b) = **0** | Requires actual registration and onchain proof; provider verification is not our identity |
| E08 | Provider TikHub agent ID 9895 registered on Celo | SUPPORTING | OBSERVED | `/api/trust` returned verified:true; provider registration document | Verify onchain owner response separately; avoid confusing with our own identity |
| E09 | Model-driven capability reasoning | CRITICAL product | UNPROVEN | Code exists using optional Gemini/OpenAI credentials; deterministic mode labeled | No working model key/live inference checked; don't advertise as verified AI |
| E10 | Public repo accessible to judges | CRITICAL eligibility | BLOCKED | GitHub CLI confirmed ShalyX/celo-open-rails PRIVATE | Needs user-approved visibility change |
| E11 | Independent users used product | CRITICAL qualification | UNPROVEN | No independently owned qualifying user/wallet evidence | Do not fabricate or proxy with own secondary wallets |
| E12 | Production build and basic security checks pass | IMPORTANT | VERIFIED | 12 passing unit/security tests, isolated Next.js build, lint/type check, authenticated Chrome screenshots | Does not establish production multi-instance persistence |
| E13 | Full narrated demo recorded and independently reviewed | CRITICAL presentation | UNPROVEN | `docs/DEMO_SCRIPT.md`, 3 authentic captures at `docs/evidence/` | No finished video/QA |
| E14 | Entry submitted with Loops confirmation | CRITICAL | BLOCKED | No saved enrollment ID/submission receipt | User account-specific Loops form, final authorization needed |

## Evidence provenance

- Local build root: `C:\Users\USER\Documents\Codex\2026-11-08\celo-open-rails`
- Tests: `tests/procurement.test.mjs`, `tests/security.test.mjs`, `tests/guards.test.mjs`, `tests/e2e-smoke.mjs` (last is live isolated smoke, not auto-run with unit tests).
- Visual: `docs/evidence/01-dashboard-authenticated.png`, `02-workflow-and-history.png`, `03-history-and-trust.png`.
- Git: private `ShalyX/celo-open-rails`; do not expose wallet credentials.
- Network: Celo mainnet 42220; official Buy gateway.
- Qualifier: timestamps are approximate time of local test in prior run; dynamic external data may become stale.

## Proof Engine

**OPEN / BLOCKED.** E06, E07, E09, E10, E11, E13, E14 prevent a truthful 'full product judged artifact done'. No simulated paid purchase may be represented as verified.
