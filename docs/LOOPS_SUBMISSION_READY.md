# Loops submission — verified entry package (not yet submitted)

**Event:** Agents on Open Rails Hackathon  
**Track:** Build with buy  
**Deadline:** 2026-11-09 09:00 GMT / 10:00 WAT  
**Project:** Celo Procurement Desk  
**Submission status:** Draft prepared; Loops confirmation/receipt not yet observed.

## Project name
Celo Procurement Desk

## Tagline
Agent research procurement with exact quotes, bounded approval, real Buy results and auditable Celo receipts.

## Short description (form-ready)
Celo Procurement Desk is a human-governed procurement layer for research agents. Instead of giving an agent an unrestricted wallet or opaque API keys, an operator submits a research objective; the desk discovers live services in Celo Buy, shows the exact HTTP 402 quote (service, token, amount, recipient and request), asks for approval under a fixed spend cap, executes one paid call, and preserves the returned data with its Celo settlement receipt.

We completed a real Celo mainnet Buy purchase through TikHub's `x.posts.search`: **0.005 USDC** returned **18 actual X posts** about Celo MiniPay, with the exact USDC transfer independently verified. Separately, Hermes model reasoning was verified against the live Buy catalog for social research and SQD dataset discovery; those inference checks did not spend funds. Our registered ERC-8004 agent is **#10059**.

The judge-facing viewer is read-only and cannot initiate a purchase. Paid mode was disabled after the authorized run. Current usage evidence is team-operated; independent-user adoption is not claimed.

## Services and payment proof
- **Paid Buy service:** TikHub `x.posts.search` through the Celo Buy gateway.
- **Exact payment:** 5,000 atomic USDC = **0.005 USDC** on Celo mainnet (chain 42220).
- **Paid transaction:** https://celoscan.io/tx/0xba529f67e679cfafb1ffeb6749cebd06cf967b0dc43ce6cf79b0255bcec63a61
- **Provider output:** 18 returned tweet records, 18 source links; saved task `task-1794186340719-t3y6`.
- **Free route (not counted as paid):** SQD dataset discovery/data path.
- **Separate reasoning proof:** Hermes selected `x.posts.search` and `sqd.datasets` in two authenticated, zero-spend intent checks. These are not represented as the paid task's selection mechanism.

## Judge links
- **Public source:** https://github.com/ShalyX/celo-open-rails
- **Read-only proof viewer:** https://celo-procurement-proof.vercel.app/
- **48-second captioned walkthrough:** https://celo-procurement-proof.vercel.app/walkthrough.mp4
- **Preview image:** https://celo-procurement-proof.vercel.app/preview.png
- **Paid-task evidence JSON:** https://github.com/ShalyX/celo-open-rails/blob/master/docs/evidence/paid-task-20261109.json
- **Hermes reasoning evidence:** https://github.com/ShalyX/celo-open-rails/blob/master/docs/evidence/hermes-live-selection-20261109.json
- **Own ERC-8004 registration:** https://celoscan.io/tx/0xbac5c383f43d381d27313694cb4d5141d9d34817f266fdfa54e88eae7d88bd36

**Access note:** Vercel SSO protection is enabled for the deployment host. A temporary share URL has been generated for immediate review; it expires on 2026-11-10 at 06:27 WAT. Stable public reviewer access requires approval to change production protection to Preview-only or to provide a custom domain.

## Identity
- **Agent wallet / owner / economic payer:** `0xf903e8a6FC3B751D8466469Fa85F2A1B9Caeba8b`
- **Own ERC-8004 agent ID:** `10059`
- **Registration transaction:** https://celoscan.io/tx/0xbac5c383f43d381d27313694cb4d5141d9d34817f266fdfa54e88eae7d88bd36
- **Loops attribution tag:** `celo_dd8616266527` (issued during onboarding). The official Build with buy FAQ says no attribution tag is required for this track; use it only if the form explicitly requests it.

## Honest limitations
- The paid task was team-operated; no independent user or independent-wallet adoption is verified.
- Hermes reasoning was verified in two separate zero-spend calls; the paid purchase itself used the deterministic fallback path. Do not imply Hermes selected that paid task.
- The public viewer is a static, read-only record, not a public multi-user purchasing backend.
- Paid execution is disabled; no repeat payment is authorized.
- The 48-second walkthrough is captioned and silent (no voiceover).
- A successful Loops submission must be confirmed by a visible saved-entry receipt; this document is not proof of submission.
