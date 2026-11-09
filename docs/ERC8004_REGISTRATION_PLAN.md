# ERC-8004 registration — confirmed

User explicitly approved repository publication and one registration with a maximum total gas spend of **0.07 CELO** on 2026-11-09.

- Celo mainnet chain ID: **42220**.
- Identity Registry: `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`.
- Agent ID: **10059**.
- Owner, confirmed by `ownerOf`: `0xf903e8a6FC3B751D8466469Fa85F2A1B9Caeba8b`.
- Agent URI, confirmed by `tokenURI`: https://raw.githubusercontent.com/ShalyX/celo-open-rails/master/public/.well-known/agent-registration.json
- Successful transaction: `0xbac5c383f43d381d27313694cb4d5141d9d34817f266fdfa54e88eae7d88bd36`, block **82285362**.
- Gas used: 223776; effective gas price: 202500000000 wei.
- **Total fee: 0.04531464 CELO**, below cap; L1 fee reported as 0.
- Signed transaction execution-fee ceiling: 0.0612630175 CELO plus 0.003 CELO additional-fee reserve; bounded total 0.0642630175 CELO. L1 fee oracle was checked before single broadcast.
- Signing used the existing Windows OS credential store in memory; no private key exported to files or project documentation.
- Before signing: registry balance was zero, correct chain/wallet verified, public JSON and its image fetched successfully.
- After receipt: Registered event, owner and tokenURI verified; registration metadata now records agent 10059.

Evidence: `docs/evidence/erc8004-registration-20261109.json`. The local attempt marker prevents automatic resend. No further registration or onchain metadata update is authorized.

The public repository is https://github.com/ShalyX/celo-open-rails . GitHub raw responses can remain cached temporarily after a push; the committed metadata is authoritative and the URI must be rechecked after propagation.

This identity is team-owned. It does not prove independent use, demand, Loops enrollment or submission. Those remain separate gates.
