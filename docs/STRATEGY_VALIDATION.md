# HQ Strategy: Research -> Retrospective Ideation -> Product Validation

**2026-11-09 (WAT).** This reconstructs the missed research/selection controls; it does not pretend that the old implementation was originally chosen through these steps. The user has already authorized building the existing Agent Procurement Desk thesis.

## Research completed and limitations

See [Market research](MARKET_RESEARCH.md) for source URLs and the competitive kill-search. Evidence supports that pay-per-call agent services, budget gating and transaction receipts already exist. In particular, Shonin, checkout402 and x402.pub provide competing parts. The organizer's own Buy launch describes credential and billing friction, but is not independent consumer interview data. We cannot claim verified demand, adoption or uniqueness.

## Candidate comparison (retrospective, not historical selection)

| Concept | Problem fit | Sponsor integration | Differentiation | Proof path | Verdict |
|---|---|---|---|---|---|
| A. Task-first Agent Procurement Desk (approved thesis) | Research/user buying external capabilities; credible but needs user | Buy is required for useful paid result | Medium only if procurement goes task -> result -> audit | Full new paid call + useful answer + receipt | **Retain and repair** |
| B. Buy API catalog/price browser | Convenience only | Shallow; Buy already provides discovery | Low; directly duplicates Buy | Easy demo but poor judged utility | KILL |
| C. Agent spending approval/receipt dashboard | Safety/budget governance | Shallow absent real service purchase | Low; Shonin and checkout402 exist | Policy UI without outside value | KILL |

No scores are fabricated and these do not stand in for independent user evidence. This comparison supports preserving the original choice, not inventing a new one.

## Product Critic / Validation

**Verdict: MODIFY within approved thesis.** The claim that a generic procurement desk is special fails a competitive kill-search. The narrower original promise — user task -> capability selection -> human budget approval -> paid outside data -> useful report with Celo receipt — is still technically feasible based on the historical real Buy mechanism, current UI and live free SQD flow. But it has *not been completed or proven*.

Major risks:
1. Own ERC-8004 identity absent (`balanceOf` = 0); event validity blocker.
2. No new paid call through application; judge sees free-data dashboard.
3. User's actual independent demand and wallet not proven.
4. AI agent reasoning not observed; current fallback is deterministic.
5. Local authenticated UI is not public judge-accessible; repo private.

No new idea selection is required for a corrective implementation that retains the approved thesis. Material changes or elimination of a locked P0 do require human review.

## Handoff to Engineering

- Preserve all 12 P0s in `PRODUCT.md`.
- First repair P0-06 paid execution and P0-07 useful paid outcome in strict no-spend mode, with real per-task approval and no automatic retries.
- Keep old historical payment isolated. Never claim a signed new transaction without receipt.
- Prepare owner ERC-8004 identity registration instructions (do not sign/register without permission).
- Request genuine user and release authorization only after all independent work is prepared.
- Re-run proof, QA, Product Integrity after each change; stage remains MODIFY until sponsor-critical path is verified.
