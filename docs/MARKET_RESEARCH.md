# Research and Resources — Celo Agent Procurement Desk

**Updated:** 2026-11-08. Preserve original research below as implementation input; do not interpret this as independent demand validation.

## Research findings — sources and rival products

| Source | What was observed | Interpretation / limits |
|---|---|---|
| [Official Celo Buy launch](https://blog.celo.org/celo-core-co-launches-buy-the-services-marketplace-for-agents-b0de5703b377) (Oct 2026) | Agents struggle with provisioning API keys and pay-as-you-go services; Buy sells services directly from wallet. | Organizer/technology provider describes pain; **not independent end-user proof** |
| [x402.pub](https://x402.pub/) | Agent-discoverable API marketplace with x402 paid calls without human approval. | Catalog + pay is already a commodity, not unique to our desk |
| [Shonin](https://shonin.studio/agents) | Paid agent payment checks, approve/confirm/escalate gating and receipt verification. | **Strong collision**: approval/receipt policy features alone are not differentiation |
| [checkout402 wallet budgets](https://checkout402.com/docs/guides/spending-wallets/) | Per-call/daily budgets, events and transaction refusal UX already exist. | Budget limits/ledger alone aren't novel |
| [agent402.tools on Celo](https://agent402.tools/celo) | Indexed Celo agent tools and publicly listed paid usage/buyers. | External ecosystem activity exists; self-reported site data, not independent validation of our product |
| [Official Loops entry](https://www.loops.house/agents-on-open-rails) | Build with buy rewards real paid service integrations, usefulness and independent users, not spam. | Mandatory proof requirement, not evidence we have adoption |

## Current user/problem hypothesis

- **Target user:** A solo researcher or agent builder needs fresh social/blockchain/browsing results from paid tools but cannot give an unrestricted agent API keys or a spendable wallet.
- **Pain:** Manual credential discovery, nontransparent per-call pricing, unbounded agent spending, uncertain settlement and disconnected receipts.
- **Workaround:** Manual API subscriptions + copy/paste; hand-run Buy CLI; generic x402 wallets/agent policy daemons.
- **Smallest useful outcome:** Research question -> selected outside service(s) -> quoted stablecoin cost -> user-approved paid execution -> useful delivered answer backed by independent transaction and receipt.
- **Validation status:** Mechanism **VERIFIED**; external pain prevalence, real user demand, and product differentiation **UNVERIFIED**. No user interviews or prior independent buyer logs found.

## Competitive kill-search conclusion

The generic 'AI procurement dashboard with approval and receipts' is heavily occupied. The surviving product insight, *if proven*, is a task-to-outcome desk that automatically chooses external capabilities, obtains exact price, enables authorized one-shot purchase, translates raw provider output into useful research output and preserves settlement auditability. This is the **existing approved product promise**, not a new idea introduced after the spike. We must not claim a novel payment protocol or a novel approval-only feature.

## Original implementation resources and credentials (references only)

- Buy catalog: https://gateway.usebuy.ai/v1/catalog
- Official buy skill: https://github.com/celo-org/buy-skill
- Celo RPC: https://forno.celo.org, mainnet chain 42220
- Historical verified 0.005 USDC tx: https://celoscan.io/tx/0x7e511e9094756923f3373c01ae7965a3f1ea1f5b43b03172ee91d97e19d8ac43
- Repo references actual `buy-skill/skills/use-api-gateway/SKILL.md`.
- Secrets stay only in local credential store or ignored local environment. Do not commit wallet keys.

## Important decision

Research does not authorize publishing, any onchain registration payment, paid API purchases, submission, outreach or claims about independent users. Pain and demand evidence gap remains explicitly open.
