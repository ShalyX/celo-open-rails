# QA Report — Celo Agent Procurement Desk

**Date:** 2026-11-08
**Scope:** Local Windows implementation, not a released or publicly hosted product.
**Verdict:** CORE IMPLEMENTATION + REAL ZERO-SPEND E2E VERIFIED; **NOT YET PUBLIC-RELEASE READY**.
This report supersedes the original overly optimistic "READY / no blockers" claim.

## Evidence actually verified

| Check | Status | Evidence / qualification |
|---|---|---|
| App source / frontend / API routes | PASS | Next.js App Router source, task intake, quotes, approval, execution status, receipt history, trust drawer present. |
| Automated tests | PASS | `npm test`: 12/12 passing on Windows; four original tests assert fixtures or mock logic, the newer guards test actual pure functions. |
| TypeScript | PASS | `npx tsc --noEmit --pretty false`: exit 0 after security changes. |
| Operator auth | PASS (API and browser session) | Anonymous history/account/receipts returned 401; wrong credential 401; test-only operator login 200; cross-origin mutation 403. Headless Chrome authenticated and rendered the operator workspace. Form click-through recording not yet captured. |
| Approved-spend gate | PASS (safe live API smoke) | Authenticated PUT for real 402 quote returned policy halt BEFORE signing. Both free and paid duplicate PUTs returned 409. No additional paid transaction executed. |
| SSRF and route isolation | UNIT-TESTED | Official HTTPS buy gateway URL allowlist; arbitrary host, internal routes and non-SQD free paths rejected. Test direct API response separately. |
| Mainnet historical settlement | PREVIOUSLY VERIFIED | 0x7e511e9094756923f3373c01ae7965a3f1ea1f5b43b03172ee91d97e19d8ac43 is an earlier real purchase. It is NOT evidence that the new app has completed an additional paid procurement. |
| Zero-spend | CODE-PROVEN | `POLICY_DISALLOW_SPEND=true` and debit path is disarmed. No additional payments authorized or attempted. |
| Real AI reasoning | NOT VERIFIED | Requires configured working model credential; deterministic matching is explicitly the fallback. A deterministic result digest is derived from actual fields and makes no model inference claim. |
| Live catalog, quote, free result | PASS (safe live API smoke) | Independent test on loopback production server fetched 171 catalog capabilities, delivered authentic free SQD output, and received unpaid real 402 quote for 5,000 atomic USDC units. |
| Current ERC-8004 identity | PROVIDER VERIFIED | Live `/api/trust?agentId=9895&provider=tikhub` returned HTTP 200 with `verified:true` for gateway provider. The procurement desk itself is NOT registered or verified. |
| Persistence and deployment | PARTIAL | Local JSON ledger present. Not hardened for parallel serverless deployment or cross-device durable storage. |
| Visual / judge walkthrough | PARTIAL PASS | Real authenticated headless Chrome screenshots captured under `docs/evidence/`, visually inspected: 171 live gateway capabilities, genuine free/policy-halt ledger, historical receipt, live Celo balances, provider trust badge. Final narrated video/UI click-through still pending. |

| New paid task execution | CODE IMPLEMENTED; LIVE UNVERIFIED | Buy CLI is bound to exact approved quote and fresh re-quote, double-disabled by environment, records attempt before dispatch, never retries, verifies new receipt and exact Celo ERC-20 Transfer amount/recipient. **No new paid purchase occurred.** |
| Own ERC-8004 identity | BLOCKED | On-chain registry read-only `balanceOf(0xf903...eba8b)=0` on Nov 9; metadata URI 404 while GitHub is private; registration must be signed with user's permission. |

## Security conditions

- A random operator access token is stored ONLY in ignored `.env.local`, not in Git.
- Operator login issues an HttpOnly SameSite=Strict cookie. Mutations require same-origin requests and an authenticated operator.
- A live Buy executor is coded, but the application still **cannot spend by default**: both `POLICY_DISALLOW_SPEND=false` and `LIVE_BUY_MODE=EXPLICIT_PER_TASK_SPEND_APPROVED` must be configured after explicit user permission; each task also needs authorized exact cap and quote. The payment path is UNVERIFIED and remains a **core product-completeness blocker**.
- Local task storage uses a task lock to prevent accidental duplicate dispatch. Multi-instance production operation will need a durable transactional database and idempotency keys in persistent shared storage.
- Do not deploy this local-wallet build publicly; keep keystore materials out of any hosted runtime until the auth/security/storage model has been reviewed.

## Explicit release gates

1. [x] Live catalog fetch, exact unpaid 402 quote, and authentic free SQD result verified by `tests/e2e-smoke.mjs` against an isolated local production server with test-only auth and data directory.
2. [x] Authenticated local browser session and three genuine product screenshots captured and inspected. [ ] Narrated click-through video remains outstanding.
3. Verify that invalid budget, token mismatch, stale quote, replay, and blocked remote URL fail through real routes.
4. [x] Production build PASS using isolated output directory `.next-final-qa`, avoiding concurrent Next.js build collisions.
5. [x] Source backed up in PRIVATE GitHub repo ShalyX/celo-open-rails, without secrets. [x] Demo script/screenshots prepared. [ ] Final walkthrough video and formal hackathon submission not completed.
6. Only after a separate spending authorization: enable and test a real paid procurement. No extra spend is permitted in this QA session.

**Judge-facing accuracy:** a green build and historical on-chain proof are valuable evidence, but neither alone proves a new successful end-to-end paid procurement inside this app.
