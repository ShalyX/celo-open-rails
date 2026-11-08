# Research and Resources — Celo Agent Procurement Desk

## 1. Official Gateway & Protocol Specifications

- **Buy API Gateway Root**: `https://gateway.usebuy.ai`
- **Live Catalog URL**: `https://gateway.usebuy.ai/v1/catalog`
  - Returns service metadata, protocol versions (`x402-v1`, `x402-v2`), accepted payment assets, sandbox configurations, capabilities, and free services.
- **Official Repository**: `https://github.com/celo-org/buy-skill`
  - Skills for `use-api-gateway`, `order-compute`, `data-availability`, `file-feedback`.
- **Installed CLI Runtime**:
  - Binary path: `C:\Users\USER\AppData\Local\npm-cache\_npx\5079eae48a4f4b98\node_modules\@celo\buy\dist\main.js`
  - Keystore configuration: `~/.config/cpay/accounts.json` and `~/.config/cpay/receipts.1.json`

---

## 2. On-Chain Contracts & Network Reference (Celo Mainnet — Chain ID: 42220)

| Entity / Token | Address | Details |
|---|---|---|
| **Celo RPC Endpoint** | `https://forno.celo.org` | Canonical JSON-RPC provider |
| **USDC Token (ERC-20)** | `0xcebA9300f2b948710d2653dD7B07f33A8B32118C` | 6 decimals, native USDC on Celo |
| **USDT Token (ERC-20)** | `0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e` | 6 decimals, Tether USD on Celo |
| **USAT Token (ERC-20)** | `0xD2ab3C9A02DBBAB236BfEC45D1d755DF4267F771` | 6 decimals, Tether America USD |
| **Gateway PayTo Address**| `0x20faAca5F980E29639A0FCC6dcA6988E18ed333B` | Mainnet payment recipient |
| **ERC-8004 Identity Registry** | `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` | Canonical agent identity registry |
| **ERC-8004 Reputation Registry** | `0x8004BAa17C55a88189AE136b182e5fdA19dE9b63` | Trust & feedback registry |
| **Operator Dedicated Account** | `0xf903e8a6FC3B751D8466469Fa85F2A1B9Caeba8b` | Account label: `celo-open-rails` |

---

## 3. Verified Historical Mainnet Transaction

- **Transaction Hash**: `0x7e511e9094756923f3373c01ae7965a3f1ea1f5b43b03172ee91d97e19d8ac43`
- **Block Number**: 82246474 (`0x4e6fb4a`)
- **Block Timestamp**: `2026-11-08 14:13:49 UTC`
- **Sender**: `0xf903e8a6FC3B751D8466469Fa85F2A1B9Caeba8b`
- **Recipient (PayTo)**: `0x20faAca5F980E29639A0FCC6dcA6988E18ed333B`
- **Token Contract**: USDC (`0xcebA9300f2b948710d2653dD7B07f33A8B32118C`)
- **Amount Paid**: 0.005 USDC (`5000` atomic units)
- **Settlement Method**: EIP-3009 (`transferWithAuthorization`)
- **Celoscan Link**: `https://celoscan.io/tx/0x7e511e9094756923f3373c01ae7965a3f1ea1f5b43b03172ee91d97e19d8ac43`
- **Role in Project**: Historical settlement baseline and audit reference. Strictly isolated from new procurements.

---

## 4. Free Multi-Chain Data (SQD Decentralized Portal)

- **Datasets Endpoint**: `https://gateway.usebuy.ai/sqd/datasets`
- **Chains Supported**: 113+ networks (Celo, Ethereum, Polygon, Arbitrum, Optimism, Solana, Bitcoin, etc.)
- **Pricing**: Completely free, unmetered, no wallet signatures or tokens required.
- **Rate Limit**: 120 req/min per IP, burst 20.
- **Capability within Desk**: Delivers live, verifiable on-chain data for zero-spend research requests.
