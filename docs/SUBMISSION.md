# Celo Agents on Open Rails — Judge Submission Package

**Status: READY-TO-REVIEW SOURCE AND PROOF / NOT FORMALLY SUBMITTED.**
**Track:** Build with buy. **Deadline:** 2026-11-09 09:00 UTC / 10:00 WAT.
**Project display name (provisional):** Celo Procurement Desk.
**Public source:** https://github.com/ShalyX/celo-open-rails
**Proof route:** `/proof` (read-only, anonymously accessible when running the app; **no public URL deployed as of this review**).

## Short submission pitch (factually supportable)

An operator-governed procurement desk for agent research on Celo. It discovers external Buy gateway services, obtains authoritative unpaid HTTP 402 quotes, asks the operator to approve an exact USDC budget, then makes at most one paid request and preserves its result, chain receipt and audit trail. A verified local task purchased X search for **0.005 USDC** and returned **18 genuine Celo MiniPay-related posts**. Our own registered ERC-8004 agent is **10059**. After the authorized purchase, live spending was disabled. The product also supports live free SQD data, and a read-only source-backed result viewer.

## Judge-visible proof links

| Item | Proof |
|---|---|
| Public repository | https://github.com/ShalyX/celo-open-rails |
| Agent identity #10059 | https://celoscan.io/tx/0xbac5c383f43d381d27313694cb4d5141d9d34817f266fdfa54e88eae7d88bd36 |
| Exactly one new paid product task | https://celoscan.io/tx/0xba529f67e679cfafb1ffeb6749cebd06cf967b0dc43ce6cf79b0255bcec63a61 |
| Payment + task + provider response | [Recorded proof JSON](evidence/paid-task-20261109.json), task `task-1794186340719-t3y6`, block `82285602` |
| Historical mechanism spike — distinct transaction | https://celoscan.io/tx/0x7e511e9094756923f3373c01ae7965a3f1ea1f5b43b03172ee91d97e19d8ac43 |
| Screenshots | [Public desktop](evidence/10-public-proof-first-fold.png), [18 real posts](evidence/12-public-proof-all-18.png), [mobile](evidence/13-public-proof-mobile.png) |
| Source of truth | [Product coverage](../PRODUCT.md), [Evidence](../EVIDENCE.md), [Product Hygiene](../HYGIENE.md), [Demo shot list](../DEMO.md) |

## Inspect without a wallet and without spending

1. Clone the repository and run `npm install` then `npm run dev`. This uses the local default server.
2. Open `http://127.0.0.1:3000/proof`. No login needed for the recorded proof page. It cannot initiate payments.
3. Inspect the 18 posts and expand `Show all` to see their source URLs; click the onchain payment and registration explorer links.
4. For safe operator-desk evaluation, create `.env.local` using `.env.example`, set a unique `OPERATOR_ACCESS_TOKEN` 24+ characters and keep `POLICY_DISALLOW_SPEND=true` and `LIVE_BUY_MODE=DISABLED`. Do not supply private wallet keys or enable a charge.
5. Existing CLI wallet credentials are **not** included in public GitHub; the one paid task is recorded proof, not a repeatable free purchase.

## Genuine sponsor integrations

- Buy gateway live catalog and exact 402 quote preflight.
- `@celo/buy` one-shot CLI purchase, no auto-retry on uncertain settlement.
- Celo mainnet USDC EIP-3009 token transfer; independently matched exact token, payee and 5,000 atomic units in tx `0xba529...3a61`.
- ERC-8004 own agent #10059 with registration tx and public metadata (provider agent #9895 is separate).
- Actual provider response for `x.posts.search` on topic Celo MiniPay: 18 posts, preserved without fabricated sentiment analysis.
- Celo RPC verification and read-only recovery analysis. Safe free SQD data path.

## Truthful limitations — DO NOT DELETE

- This is **one team-owned research task**, not a verified independent user, user growth or market sentiment measurement.
- The paid path was locally verified via authenticated API. New spending is now disabled. Public `/proof` presents a **recorded result**; it does not execute a live new purchase.
- The selected capability was chosen by clearly labeled deterministic fallback; **real model reasoning has not been proven** (no available configured inference model during QA).
- Local file ledger is not a multi-instance hosted transactional datastore. Crash uncertainty handling is tested by read-only chain reconciliation with the exact saved transaction hash; real abrupt-kill recovery is not yet independently verified.
- No hosted public deployment, final narrated video, verified independent users, or official Loops form confirmation exists yet. A GitHub repo is not proof that the hackathon form was submitted.
- Registered agent's public metadata currently declares `active:false`; do not claim a hosted production service.

## Remaining submission gates

Confirm Loops enrollment and actual required fields; produce/QA a truthful final video (if required by form); decide authorized public-hosting strategy for the read-only page; run judge/sponsor Q&A; submit through the real event form with user's approval and obtain visible receipt before deadline. No more onchain actions or payments are authorized.
