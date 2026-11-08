# QA Report — Celo Agent Procurement Desk

**Date:** 2026-11-08
**Scope:** Local Windows implementation, not a released or publicly hosted product.
**Verdict:** CORE IMPLEMENTATION BUILT — **NOT YET RELEASE/DEMO VERIFIED**.
This report supersedes the original overly optimistic "READY / no blockers" claim.

## Evidence actually verified

| Check | Status | Evidence / qualification |
|---|---|---|
| App source / frontend / API routes | PASS | Next.js App Router source, task intake, quotes, approval, execution status, receipt history, trust drawer present. |
| Automated tests | PASS | `npm test`: 12/12 passing on Windows; four original tests assert fixtures or mock logic, the newer guards test actual pure functions. |
| TypeScript | PASS | `npx tsc --noEmit --pretty false`: exit 0 after security changes. |
| Operator auth | PARTIAL PASS | Local `GET /api/operator` returned 200 with `configured:true, authenticated:false`. GET routes `/api/procure`, `/api/account`, `/api/receipts` returned 401 without auth. Interactive credential login not yet verified end-to-end. |
| Approved-spend gate | UNIT-TESTED | Server checks real quoted token and integer atomic cap, rejects unauthorized requests and repeat approvals. No paid transaction executed during this QA. |
| SSRF and route isolation | UNIT-TESTED | Official HTTPS buy gateway URL allowlist; arbitrary host, internal routes and non-SQD free paths rejected. Test direct API response separately. |
| Mainnet historical settlement | PREVIOUSLY VERIFIED | 0x7e511e9094756923f3373c01ae7965a3f1ea1f5b43b03172ee91d97e19d8ac43 is an earlier real purchase. It is NOT evidence that the new app has completed an additional paid procurement. |
| Zero-spend | CODE-PROVEN | `POLICY_DISALLOW_SPEND=true` and debit path is disarmed. No additional payments authorized or attempted. |
| Real AI reasoning | NOT VERIFIED | Requires configured working model credential; deterministic matching is explicitly the fallback. |
| Live catalog, quote, free result | BLOCKED | This PC experienced gateway DNS-resolution failure. A successful live task-to-result flow was not established in this QA pass. |
| Current ERC-8004 identity | NOT VERIFIED | Identity UI must display registration only after on-chain verification; no confirmed current registry response in this QA. |
| Persistence and deployment | PARTIAL | Local JSON ledger present. Not hardened for parallel serverless deployment or cross-device durable storage. |
| Visual / judge walkthrough | PENDING | Must inspect app in browser, capture screen and working interaction. |

## Security conditions

- A random operator access token is stored ONLY in ignored `.env.local`, not in Git.
- Operator login issues an HttpOnly SameSite=Strict cookie. Mutations require same-origin requests and an authenticated operator.
- The app currently **cannot execute a fresh paid buy**, even if the zero-spend flag is changed. That is a deliberate safety gate under the user's no-additional-spend instruction, but remains a **core product-completeness blocker** for a released procurement service.
- Local task storage uses a task lock to prevent accidental duplicate dispatch. Multi-instance production operation will need a durable transactional database and idempotency keys in persistent shared storage.
- Do not deploy this local-wallet build publicly; keep keystore materials out of any hosted runtime until the auth/security/storage model has been reviewed.

## Explicit release gates

1. Record a live catalog fetch, exact unpaid 402 quote, and authentic free SQD result, or report the network blocker.
2. Prove the operator can log in, create a task, review quote, and trigger an honest policy halt or real free result through the actual UI.
3. Verify that invalid budget, token mismatch, stale quote, replay, and blocked remote URL fail through real routes.
4. Re-run production build after all edits.
5. Publish source to GitHub with no credential files, mark historical evidence clearly, and prepare the judge-facing demo/submission.
6. Only after a separate spending authorization: enable and test a real paid procurement. No extra spend is permitted in this QA session.

**Judge-facing accuracy:** a green build and historical on-chain proof are valuable evidence, but neither alone proves a new successful end-to-end paid procurement inside this app.
