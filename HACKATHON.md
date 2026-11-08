# HACKATHON — Agents on Open Rails

**Checked:** 2026-11-08 23:59 Africa/Lagos against the official Loops page and Celo DevRel announcement. This is the source of truth for judging and submission, rather than the old local workflow.

## Event and deadline

- **Name:** Agents on Open Rails Hackathon, organizer Celo Core Co / Loops.
- **Track:** Build with buy; $1,000 worth of CELO across five projects, $200 equivalent per award. Total event prize pool $5,000 equivalent; this is not a $5,000 track payout.
- **Deadline:** Monday **2026-11-09 09:00 GMT = 10:00 West Africa Time**. Registration AND submission end together.
- **Winner announcement:** 2026-11-13, per organizer.
- **User's entry:** `celo-open-rails`, wallet `0xf903e8a6FC3B751D8466469Fa85F2A1B9Caeba8b`. Enrollment/agent ID status UNKNOWN; do not claim registered.

## Mandatory conditions from official page

1. Celo mainnet chain ID 42220; real service calls, real settlement and truthful proof.
2. **Public GitHub repo from registration through judging.** This repo is currently PRIVATE; must obtain permission before visibility change.
3. **Own ERC-8004 agent ID**, registered from entry wallet before deadline. Current UI only verifies buy provider TikHub ID 9895 — that does not count for our own submission.
4. Submit registration/entry on Loops with wallet + agent ID + GitHub link and any live/demo artifacts required by the live entry form. We have no observed platform confirmation.
5. Code must be written within event window; repository history dated Nov 8 is available.
6. Official Build with buy FAQ: list paid services used and provide payment proof. Five $200-equivalent CELO awards; no fabricated user activity.
7. Independent users are a qualification criterion. Organizer defines an *independent wallet* as not owned by team, not initially funded by team/funder, with prior Celo activity before hackathon; newly onboarded users may still be measured differently.

## Rubric: Build with buy

Official qualitative criteria (weights **UNKNOWN**): actual user problem; depth of integration of buy; verified paid calls into outside services; service demand/growth created; genuinely independent users; meaningful usable interface. No evidence supports inventing numerical weights.

**Attribution:** general rules discuss ERC-8021 tag; the Build with buy-specific FAQ states **no attribution tag is needed for this track** and instead requires payment proof. For all x402 transactions the organizer asks for PayTo wallet when applicable. Confirm the submitted track interpretation if the entry form asks.

## Sponsor technology and resources

- `@celo/buy` gateway `https://gateway.usebuy.ai/v1/catalog`, reference `https://github.com/celo-org/buy-skill`.
- HTTP 402 / EIP-3009, Celo mainnet USDC, provider services (data, browser, inference, RPC).
- Optional ERC-8004 identity on Celo, sponsor docs, free SQD data.
- Official event: https://www.loops.house/agents-on-open-rails
- Organizer FAQ and rules: https://www.loops.house/agents-on-open-rails
- Celo DevRel update (2026-10-30): https://celo-devs.beehiiv.com/p/agents-on-open-rails-9-days-left-to-build-ship-and-stand-out
- Buy track launch/details: https://celo-devs.beehiiv.com/p/buy-is-live-on-celo-the-service-marketplace-for-ai-agents

## Non-negotiable disclosure

Earlier 0.005 USDC payment `0x7e511e9094756923f3373c01ae7965a3f1ea1f5b43b03172ee91d97e19d8ac43` is real historical mechanism proof; it is NOT payment for a new completed application task.

## Unknown / cannot claim passed

- Whether user completed Loops enrollment, assigned attribution, connected the entry wallet, or submitted details.
- **Verified NO own identity:** read-only Celo mainnet ERC-8004 Identity Registry `balanceOf(0xf903e8a6FC3B751D8466469Fa85F2A1B9Caeba8b)` returned **0** on 2026-11-09 00:03 WAT. Onchain registration is required before eligibility is satisfied. No registration transaction attempted.
- Whether a genuine independent user has actually used this product and has an eligible historic wallet.
- Whether sponsor requires additional media/form fields on account-specific entry page.
- Whether a safe fully functional paid workflow can be proven before the deadline; no authorization for extra payment.

**Intake gate:** event rules and current build reconciled; external enrollment/identity/public repo remain tracked blockers, not silently assumed passed.
