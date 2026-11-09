# ERC-8004 agent identity registration — prepared, NOT submitted

**Read-only preflight on 2026-11-09 (WAT):** `node scripts/erc8004-preflight.mjs`.

- Celo mainnet: chain 42220.
- Identity Registry: `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`.
- Intended registering owner wallet: `0xf903e8a6FC3B751D8466469Fa85F2A1B9Caeba8b` (same `celo-open-rails` account as the historical buy transaction).
- Read-only `balanceOf(wallet)` returned **0**. OWN identity has NOT been registered.
- Publicly hosted registration URI proposed: `https://raw.githubusercontent.com/ShalyX/celo-open-rails/master/public/.well-known/agent-registration.json`.
- Current URI GET returned **HTTP 404** because repository remains private. Do NOT register using this URL until it is publicly reachable.
- Proposed contract call after that: `register(string agentURI)` (ERC-8004 standard).
- RPC read-only gas estimation: **229,664 gas units**, estimated maximum **0.05569352 CELO** at observed network fee; the actual fee is variable and this is NOT a quote or authorization.
- **No wallet signature, contract transaction, or registration payment occurred.**

## Prepared artifacts

- `public/.well-known/agent-registration.json` — truthful temporary registration metadata with `registrations: []`; working name and service endpoints must be updated later.
- `scripts/erc8004-preflight.mjs` — checks identity balance, candidate URL availability, calldata length, read-only gas estimate; it has no signing function.

## Required sequence (human authorization gate)

1. Confirm the project name and public metadata are ready; preserve the approved product.
2. **Obtain explicit permission** before changing GitHub repository visibility to PUBLIC.
3. Verify URI GET 200 and correct owner wallet.
4. **Obtain explicit permission** for signing/sending a one-time mainnet ERC-8004 `register(string)` transaction from that wallet, with a user-approved CELO gas cap. No key material should be displayed, copied into repo, or exposed to a site.
5. Observe actual receipt; extract own minted `agentId` from Registered/Transfer event and independently confirm `ownerOf(agentId)` equals wallet.
6. Add `{agentRegistry:"eip155:42220:0x8004...",agentId}` to metadata JSON and push. Re-read URI and registry to verify.
7. Update Loops enrollment entry with own wallet/agent ID and save confirmation. No invented registration or independent-user claim.

**Current status:** PREPARED / BLOCKED BY PERMISSION and PUBLIC METADATA. This is eligibility-critical; do it before optional polish.

Sources:
- https://www.loops.house/agents-on-open-rails
- https://eips.ethereum.org/EIPS/eip-8004
- https://github.com/erc-8004/erc-8004-contracts
