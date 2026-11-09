# Celo Agents on Open Rails — Judge Submission Package

**Status:** submission package prepared; **not formally submitted** until Loops displays a saved-entry confirmation.  
**Track:** Build with buy.  
**Deadline:** 2026-11-09 09:00 UTC / 10:00 WAT.  
**Project:** Celo Procurement Desk.  
**Public source:** https://github.com/ShalyX/celo-open-rails

## Short pitch

A human-governed procurement desk for research agents on Celo. It discovers external Buy services, inspects the exact unpaid HTTP 402 terms, requests explicit approval under a fixed USDC cap, makes one bounded paid call, and preserves the useful result with its Celo receipt. One verified task bought TikHub X search for **0.005 USDC** and returned **18 actual Celo MiniPay-related posts**. The product's own ERC-8004 agent is **#10059**. Paid execution is now disabled; the judge viewer is read-only.

## Detailed description

Research agents need fresh data from external services, but unrestricted wallets and opaque API keys make spending hard to control and audit. Celo Procurement Desk turns that into a governed procurement workflow: task intake, live Buy capability discovery, exact HTTP 402 quote inspection, human authorization of a fixed budget, one paid service request, useful returned data, and a durable record tied to the Celo settlement receipt. The product also supports a free SQD data path and read-only recovery checks.

**Paid Buy integration:** TikHub `x.posts.search`, called through the Celo Buy gateway. The completed task searched for Celo MiniPay and paid exactly **5,000 atomic USDC (0.005 USDC)** on Celo mainnet. It returned 18 actual tweet records, preserved with source links. The exact token transfer, payer, recipient, amount, and transaction receipt are recorded in the evidence artifact below.

**Separate model proof:** Hermes reasoning was verified against the live Buy catalog in two authenticated intent calls: one selected `x.posts.search` for a social research objective and one selected `sqd.datasets` for a blockchain data objective. Both were inference-only and made no paid calls. The paid task itself used the deterministic fallback path; the two proofs are not conflated.

**Identity:** ERC-8004 agent **10059**, registered from the entry wallet on Celo mainnet. The provider's own agent ID is separate and is not claimed as our identity.

## Proof links

| Item | Link |
|---|---|
| Public repository | https://github.com/ShalyX/celo-open-rails |
| Read-only judge viewer | https://celo-procurement-proof.vercel.app/ |
| 48-second captioned walkthrough | https://celo-procurement-proof.vercel.app/walkthrough.mp4 |
| Preview image | https://celo-procurement-proof.vercel.app/preview.png |
| Paid-task transaction | https://celoscan.io/tx/0xba529f67e679cfafb1ffeb6749cebd06cf967b0dc43ce6cf79b0255bcec63a61 |
| Paid-task + provider response JSON | https://github.com/ShalyX/celo-open-rails/blob/master/docs/evidence/paid-task-20261109.json |
| ERC-8004 registration | https://celoscan.io/tx/0xbac5c383f43d381d27313694cb4d5141d9d34817f266fdfa54e88eae7d88bd36 |
| Hermes reasoning evidence | https://github.com/ShalyX/celo-open-rails/blob/master/docs/evidence/hermes-live-selection-20261109.json |

## Inspect safely

The Vercel proof viewer is a static, read-only record. It does not request a wallet, expose signing credentials, or make a new purchase. The 48-second video is a real browser walkthrough with captions and no voiceover. The source repository includes the implementation and reproducible evidence artifacts.

For local evaluation, follow README quick-start instructions, set a fresh local operator token, and keep `POLICY_DISALLOW_SPEND=true` and `LIVE_BUY_MODE=DISABLED`. Do not provide a private wallet key or enable live spending.

## Honest limitations

- One team-operated paid task is verified; **independent-user adoption is not verified**. The organizer lists independent users as a qualification criterion for Build with buy.
- The deployed viewer is read-only; it is not a public multi-user procurement backend.
- Hermes was verified in two separate zero-spend intent checks. The paid purchase used the deterministic fallback path; do not claim the model chose that paid task.
- Paid execution remains disabled after the single authorized purchase. No repeat spend is authorized.
- The local ledger is not a multi-instance hosted transactional datastore. Abrupt process-crash and multi-instance recovery remain unverified.
- The walkthrough is captioned and silent, not narrated.
- The Vercel project has SSO protection on the deployment host. The temporary share link expires 2026-11-10 06:27 WAT; persistent public judge access needs a narrow production access change or a custom domain.
- No Loops submission receipt exists until the actual form is saved.

## Entry identity

- **Wallet:** `0xf903e8a6FC3B751D8466469Fa85F2A1B9Caeba8b`
- **ERC-8004 ID:** `10059`
- **Registration transaction:** https://celoscan.io/tx/0xbac5c383f43d381d27313694cb4d5141d9d34817f266fdfa54e88eae7d88bd36
- **Attribution tag:** `celo_dd8616266527`. The official Build with buy FAQ says no attribution tag is required for this track; use it only if Loops explicitly asks for it.
