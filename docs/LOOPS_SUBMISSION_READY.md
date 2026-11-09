# Loops submission — ready-to-enter fields (not yet officially submitted)

**Event:** Agents on Open Rails — Build with buy
**Deadline:** 2026-11-09 09:00 GMT / 10:00 WAT
**Status:** Public proof deployed and source published. **Platform entry confirmation absent.**

## Project name
Celo Procurement Desk

## Tagline
Task-first AI-agent procurement: exact quotes, bounded approval, real Buy results and auditable Celo receipts.

## Short pitch
A research agent needs outside APIs without unlimited wallet access or opaque spending. Celo Procurement Desk turns a research objective into live service discovery, an authoritative HTTP 402 quote, a human-approved USDC budget, and one auditable paid call. We bought X search data through Celo Buy for **0.005 USDC**, received **18 actual Celo MiniPay-related posts**, saved the response, and verified the token transfer on Celo mainnet. Our own ERC-8004 agent is **#10059**. The demo is read-only and does not repeat the payment.

## Detailed project description
Celo Procurement Desk is a human-governed agent procurement workstation for researchers and builders who need fresh information from outside services but cannot responsibly hand an agent an unrestricted wallet or a pile of paid API keys.

The operator submits a task. The app retrieves live Buy gateway capabilities, routes the task to a matching service (a clearly labeled deterministic fallback when no AI model is configured), and presents the **exact unpaid HTTP 402 terms**—token, amount, chain, receiving wallet, and payload. An authenticated operator authorizes a fixed spending cap. The execution layer permits one bounded call, saves the real result and receipt, and prevents blind retries. A genuine free SQD path works alongside paid services. A read-only recovery mode examines saved receipts and Celo transfers without initiating another payment.

**Real sponsor proof:** our completed `x.posts.search` procurement paid exactly 5,000 atomic USDC units (**0.005 USDC**) from the agent wallet and returned **18 actual X posts** related to Celo MiniPay. The app now shows each post with its original source link, reported metrics and saved ledger history. This is the completed user-task outcome, not a fabricated simulation or a reused older transaction.

**Chain evidence:** Celo mainnet chain ID 42220; payment tx `0xba529f67e679cfafb1ffeb6749cebd06cf967b0dc43ce6cf79b0255bcec63a61`, block 82285602. ERC-8004 agent ID **10059**, separately registered with tx `0xbac5c383f43d381d27313694cb4d5141d9d34817f266fdfa54e88eae7d88bd36`. The wallet owner and payment source match `0xf903e8a6FC3B751D8466469Fa85F2A1B9Caeba8b`; the Buy payTo recipient was `0x20faAca5F980E29639A0FCC6dcA6988E18ed333B`.

**Sponsor:** Buy / `@celo/buy` gateway, `x.posts.search` paid outside service; SQD free data discovery. Our HTTP 402 quote and ERC20 transfer are verifiable, with public repo, screenshots, result and short recorded demo.

**Truthful limitations:** this proof reflects one team-operated paid task, **not** independently validated user demand, independent-wallet adoption or real model-driven capability selection. After the one authorized purchase, paid execution was disabled. The live demonstration is a static, read-only record with no wallet access.

## URLs

- **Public code:** https://github.com/ShalyX/celo-open-rails
- **Live demonstration:** https://celo-procurement-proof.vercel.app/
- **Demo video (48s, captioned, silent):** https://celo-procurement-proof.vercel.app/walkthrough.mp4
- **Logo:** https://celo-procurement-proof.vercel.app/favicon.svg
- **Screenshot / preview:** https://celo-procurement-proof.vercel.app/preview.png
- **Payment proof:** https://celoscan.io/tx/0xba529f67e679cfafb1ffeb6749cebd06cf967b0dc43ce6cf79b0255bcec63a61
- **Agent registration:** https://celoscan.io/tx/0xbac5c383f43d381d27313694cb4d5141d9d34817f266fdfa54e88eae7d88bd36
- **Recorded JSON evidence:** https://github.com/ShalyX/celo-open-rails/blob/master/docs/evidence/paid-task-20261109.json

## Wallet, recipient and tag roles

- Agent wallet / owner / economic payer: `0xf903e8a6FC3B751D8466469Fa85F2A1B9Caeba8b`
- PayTo USDC recipient: `0x20faAca5F980E29639A0FCC6dcA6988E18ed333B`
- x402/Buy facilitator transaction sender: `0x0d74d5cefd2e7f24e623330ebe3d8d4cb45ffb48`
- Own ERC-8004 agent ID: `10059`
- Loops attribution tag issued in onboarding: `celo_dd8616266527`
- **Track interpretation:** the official Build with buy FAQ says "No attribution tag needed here" for x402/Buy; it requires verified paid-service usage and payment proof. General event-wide tags are not retroactively addable.

## Must verify on the Loops form

- Selection of **Build with buy** track/bounty.
- All event-specific required fields and signed-in profile details.
- Agent wallet address and ERC-8004 ID fields must use our own ID/address, not provider TikHub #9895.
- Submission is not complete without an actual saved entry and visible confirmation. Do not claim submitted based solely on this file.

**Never invent independent users, published ratings, or a fresh tagged transaction.**
