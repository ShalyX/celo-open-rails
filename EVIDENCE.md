# EVIDENCE — HQ Proof register

**Checked:** 2026-11-08 on connected Windows PC. Only actually observed evidence earns VERIFIED status. Proof is scoped to the exact operation/environment.

| ID | Material claim | Criticality | Status | Proof method and artifact | Limitation / next step |
|---|---|---|---|---|---|
| E01 | Buy can settle 0.005 USDC on Celo from our wallet | CRITICAL sponsor | VERIFIED (historical spike) | Celo tx `0x7e511e9094756923f3373c01ae7965a3f1ea1f5b43b03172ee91d97e19d8ac43`, block 82246474, prior @celo/buy run | NOT a new purchase by app |
| E02 | Gateway catalog is live | IMPORTANT | VERIFIED | 2026-11-08 local production smoke: 171 capabilities | Snapshot changes over time |
| E03 | Unpaid 402 exact quote works | CRITICAL | VERIFIED | 2026-11-08 live smoke: 5000 USDC atomic units, x.posts.search | No purchase implied |
| E04 | Genuine free SQD task delivers data | IMPORTANT | VERIFIED | 2026-11-08 isolated production smoke, delivered live response, persisted | Free only; not a scored paid service |
| E05 | Operator approval/budget/one-shot policy gate works in safe path | CRITICAL | VERIFIED (zero spend) | 12/12 smoke steps, 12/12 unit/security tests, HTTP 401/403/409 and halted_by_policy | No live paid replay/uncertain branch validated |
| E06 | New paid API call through desk delivers useful paid result | CRITICAL | IMPLEMENTED, UNVERIFIED | `buyPlan.ts` + `buyExecutor.ts`: bound CLI args, preflight re-quote, persistent attempt, explicit double enable, receipt check. **16 unit/security tests pass**; no live paid CLI call | Spending still disabled; no new paid result or tx |
| E07 | Own agent registered via ERC-8004 | CRITICAL eligibility | BLOCKED | 2026-11-08 read-only viem Celo registry balanceOf(0xf903e8a6FC3B751D8466469Fa85F2A1B9Caeba8b) = **0** | Requires actual registration and onchain proof; provider verification is not our identity |
| E08 | Provider TikHub agent ID 9895 registered on Celo | SUPPORTING | STALE pending re-run | Previous `/api/trust` returned verified:true; revised verifier now requires both onchain `ownerOf` and matching provider doc | Re-run after build; does not satisfy OUR agent ID |
| E09 | Model-driven capability reasoning | CRITICAL product | UNPROVEN | Code exists using optional Gemini/OpenAI credentials; deterministic mode labeled | No working model key/live inference checked; don't advertise as verified AI |
| E10 | Public repo accessible to judges | CRITICAL eligibility | BLOCKED | GitHub CLI confirmed ShalyX/celo-open-rails PRIVATE | Needs user-approved visibility change |
| E11 | Independent users used product | CRITICAL qualification | UNPROVEN | No independently owned qualifying user/wallet evidence | Do not fabricate or proxy with own secondary wallets |
| E12 | Production build and basic security checks pass | IMPORTANT | VERIFIED (prior isolated build; latest underway) | 19/19 unit/security/digest tests and TypeScript pass after safe paid-executor code. Prior isolated Next.js build and authenticated screenshots exist. | Latest digest build currently underway; cross-device multi-instance runtime unverified |
| E13 | Full narrated demo recorded and independently reviewed | CRITICAL presentation | UNPROVEN | `docs/DEMO_SCRIPT.md`, 3 authentic captures at `docs/evidence/` | No finished video/QA |
| E14 | Entry submitted with Loops confirmation | CRITICAL | BLOCKED | No saved enrollment ID/submission receipt | User account-specific Loops form, final authorization needed |

| E15 | Free Buy CLI invocation works without signing or spending | IMPORTANT | VERIFIED (FREE ONLY) | `buy --account celo-open-rails --json curl --max-amount 0 --request GET https://gateway.usebuy.ai/sqd/datasets` returned HTTP-success JSON with exit 0, output 6349 bytes on Nov 9 | Does not establish paid Buy command succeeds |
| E16 | Historic 5000-atomic USDC transfer really matches exact PayTo | IMPORTANT | VERIFIED (historical) | Read-only Forno RPC for 0x7e511...ac43 returned status 0x1 and one Transfer log matching USDC, payee 0x20fa..., amount 5000 | Not a fresh payment; exact token proof function included in new executor |

| E17 | Own ERC-8004 registration transaction is ready to sign | CRITICAL eligibility | PREPARED, NOT SIGNED | 2026-11-09 Celo read-only preflight: balance 0, register(string) calldata 196 bytes, 229664 gas estimate, max fee estimate 0.05569352 CELO, metadata URL 404 while repo PRIVATE | Require public metadata and user permission before sending; no identity exists yet |

| E18 | Real delivered result is distilled without fabricated AI claims | IMPORTANT | UNIT-TESTED | `resultDigest.ts`: count & sample live SQD entries, extract provider model responses, fall back honestly to raw JSON; 3 tests pass | Browser UI screenshot latest version still needed; paid result not observed |

## Evidence provenance

- Local build root: `C:\Users\USER\Documents\Codex\2026-11-08\celo-open-rails`
- Tests: `tests/procurement.test.mjs`, `tests/security.test.mjs`, `tests/guards.test.mjs`, `tests/e2e-smoke.mjs` (last is live isolated smoke, not auto-run with unit tests).
- Visual: `docs/evidence/01-dashboard-authenticated.png`, `02-workflow-and-history.png`, `03-history-and-trust.png`.
- Git: private `ShalyX/celo-open-rails`; do not expose wallet credentials.
- Network: Celo mainnet 42220; official Buy gateway.
- Qualifier: timestamps are approximate time of local test in prior run; dynamic external data may become stale.

## Proof Engine

**OPEN / BLOCKED.** E06, E07, E09, E10, E11, E13, E14 prevent a truthful 'full product judged artifact done'. No simulated paid purchase may be represented as verified.

## 2026-11-09 authorized mainnet milestone (supersedes prior permission/identity status)

- E07 VERIFIED: own ERC-8004 agent **10059**, Celo 42220; owner and tokenURI independently read after successful tx `0xbac5c383f43d381d27313694cb4d5141d9d34817f266fdfa54e88eae7d88bd36`, block 82285362. Total fee **0.04531464 CELO**, cap 0.07. Artifact: `docs/evidence/erc8004-registration-20261109.json`.
- E10 VERIFIED: GitHub visibility PUBLIC, raw registration JSON and image return HTTP 200. History scan: 10 commits / 144 unique blobs; no credential patterns found (heuristic scan, not a guarantee).
- Authorized remaining action: exactly one real Buy through the product, maximum 0.005 USDC. No independent users or enrollment/submission confirmation claimed.
