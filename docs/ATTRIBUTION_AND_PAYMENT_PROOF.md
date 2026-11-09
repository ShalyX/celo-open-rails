# Attribution and payment proof — Loops Agents on Open Rails

**Checked 2026-11-09.** This is a correction to the earlier incomplete Hackathon Operator intake. Official rules are authoritative:
https://www.loops.house/agents-on-open-rails

## Issued attribution tag

`celo_dd8616266527`

The entry's onboarding flow asks for this ERC-8021 tag on normal mainnet transactions from the beginning. Such tags cannot be backfilled. The Loops project must use the same connected agent wallet for its event entry.

**Important track-specific exception:** The current official Loops FAQ separately states for **Build with buy**: "No attribution tag needed here." It also states that standard x402 transactions do not currently support tags and instead need the relevant PayTo wallet details for attribution. The event's general tag instructions therefore cannot be read as proof that our Buy settlement is automatically disqualified.

## Exact roles in our one paid Buy transaction

| Role | Chain address / proof |
|---|---|
| Agent/owner wallet (ERC20 Transfer from) | `0xf903e8a6FC3B751D8466469Fa85F2A1B9Caeba8b` |
| USDC recipient / payment payTo | `0x20faAca5F980E29639A0FCC6dcA6988E18ed333B` |
| ERC20 token address | `0xcebA9300f2b948710d2653dD7B07f33A8B32118C` |
| On-chain transaction sender (facilitator, **not** the agent wallet) | `0x0d74d5cefd2e7f24e623330ebe3d8d4cb45ffb48` |
| Confirmed payment transaction | https://celoscan.io/tx/0xba529f67e679cfafb1ffeb6749cebd06cf967b0dc43ce6cf79b0255bcec63a61 |
| USDC transfer amount | `5000` 6-decimal atomic units = **0.005 USDC** |
| Block | `82285602` |
| External service | Buy gateway, `x.posts.search`; 18 paid X records returned |
| Local task ID | `task-1794186340719-t3y6` |
| Our ERC-8004 agent ID | `10059` |
| Own agent registration tx | https://celoscan.io/tx/0xbac5c383f43d381d27313694cb4d5141d9d34817f266fdfa54e88eae7d88bd36 |
| Public judge proof | https://celo-procurement-proof.vercel.app/ |
| Public source | https://github.com/ShalyX/celo-open-rails |

The transfer and source wallet were checked via Celo mainnet RPC, including the ERC20 `Transfer` event. The onchain transaction sender is the payment facilitator, which is consistent with the x402 mechanism; the economic payer is the agent wallet in the Transfer log.

## Honest interpretation

- The existing Buy transfer remains a real confirmed transaction. It is not retroactively taggable.
- The Build with buy FAQ explicitly makes a tag exception; **do not claim it is disqualified solely because the x402 settlement has no normal ERC-8021 suffix**.
- The separate ERC-8004 registration is valid regardless of attribution credit. Whether that registration itself contributes to a tagged-transaction leaderboard is a separate question.
- No extra transaction, recreated agent registration or repeat paid Buy call is authorized merely to add a tag.
- For future **ordinary direct transactions**, append the ERC-8021 suffix at wallet-client construction and verify it prior to sending. This note does not authorize a transfer.
- Supply the agent wallet, payment payTo, registered agent ID and exact transaction link in the Loops entry. Formal submitted/credited status remains **UNVERIFIED** until Loops shows an actual confirmation/score.

## Root-cause finding

The earlier build began before event onboarding was completed. Our research mistakenly elevated the track-specific "no attribution tag needed" exception into a general assertion, while the event-wide requirement to register the tag at the entry level was not tracked as an intake gate. This was a process failure, not a reason to fabricate new proof.
