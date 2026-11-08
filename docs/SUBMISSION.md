# Hackathon Submission Package — Celo Agent Procurement Desk

**Official Event**: Celo Agents on Open Rails Hackathon  
**Target Track**: Build with buy  
**Reviewed Build**: `v1.0.0` (commit verified locally)  
**Date**: 2026-11-08  
**QA Status**: PASS (10/10 Acceptance Gates Verified in `docs/QA_REPORT.md`)

---

## 1. Project Overview

- **Project Title**: Celo Agent Procurement Desk
- **Short Pitch**: An institutional-grade procurement desk empowering autonomous AI agents and human operators to discover, quote, authorize, and settle external capabilities (social intelligence, web browsing, GPU compute, blockchain indexers) using HTTP 402 stablecoin payments on Celo Mainnet with ERC-8004 cryptographic trust verification.
- **Repository**: Local Git Repository (`celo-open-rails`)

---

## 2. Key Problem Solved

Autonomous AI agents face a critical security and operational dilemma:
1. **Unconstrained Credential Risk**: Handing master API keys or corporate credit cards to AI agents creates catastrophic financial and security attack surfaces.
2. **Paywall Roadblocks**: Web paywalls, dynamic API pricing, and fragmented provider authentication prevent agents from acquiring research data on demand.
3. **Settlement Uncertainty**: Conventional crypto-agent demos suffer from double-spending on timeouts, blind retries on network drops, and lack of durable auditing.

---

## 3. The Celo Open Rails Solution

The **Celo Agent Procurement Desk** implements an end-to-end, human-governed procurement pipeline:
1. **Provider-Neutral Discovery**: Direct integration with the live Buy API Gateway (`https://gateway.usebuy.ai/v1/catalog`), publishing real-time capabilities across social networks (X, Reddit, YouTube, Instagram, LinkedIn), browser rental, and free decentralized multi-chain data (SQD Network across 113+ chains).
2. **Dual-Mode Intent Reasoning**: Real LLM reasoning when a model key is configured; honest rule-based deterministic fallback when unconfigured, explicitly labeled to prevent false claims of autonomy.
3. **Authoritative HTTP 402 Preflight Quoting**: Zero-cost requests to target endpoints retrieve canonical 402 payment challenges, extracting exact atomic amounts (`5000` units = `$0.005000 USDC`), asset contracts, payTo recipients, and expiration windows.
4. **Human-in-the-Loop Spend Governance**: Visual authorization barrier showing live dynamic wallet balances, spend caps, and one-shot execution nonces.
5. **Payment Uncertainty Protection**: Zero blind retries on `500 settle_uncertain` or `retryable: false`; single-attempt idempotency.
6. **Durable On-Chain Ledger & ERC-8004 Trust**: Real on-chain verification of Celo mainnet transaction receipts (`0x7e511e9094756923f3373c01ae7965a3f1ea1f5b43b03172ee91d97e19d8ac43`), local cpay keystore synchronization, and ERC-8004 Agent Identity Registry verification (`0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`).

---

## 4. Prepared Submission Fields

| Field | Content |
|---|---|
| **Project Name** | Celo Agent Procurement Desk |
| **Track** | Build with buy |
| **Tech Stack** | Next.js 14, React 18, TypeScript, Tailwind CSS, Lucide Icons, Viem, @celo/buy Gateway, Celo Mainnet RPC (Forno) |
| **Live Contract Integrations** | Celo Mainnet USDC (`0xcebA9300f2b948710d2653dD7B07f33A8B32118C`), Gateway PayTo (`0x20faAca5F980E29639A0FCC6dcA6988E18ed333B`), ERC-8004 Agent Identity Registry (`0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`) |
| **Verified Settlement Evidence** | Tx `0x7e511e9094756923f3373c01ae7965a3f1ea1f5b43b03172ee91d97e19d8ac43` (Celo Block 82246474, 0.005 USDC to buy gateway) |
| **Evaluation Safety Guarantee** | Built with `POLICY_DISALLOW_SPEND=true` active to preserve operator wallet balance during evaluation while exercising live quotes, dynamic RPC balances, free SQD execution, and receipt verification. |

---

## 5. Judge Access & Verification Instructions

1. **Start the Procurement Desk**:
   ```sh
   npm install
   npm run build
   npm run start
   ```
2. **Open the Dashboard**:
   Navigate to `http://localhost:3000`.
3. **Verify Dynamic Live Balances**:
   Observe the top header displaying the active dedicated account `celo-open-rails` with real balances fetched dynamically from Celo Mainnet via `forno.celo.org` (~2 CELO, ~0.062383 USDC). Click the refresh icon to verify live RPC queries.
4. **Test Task Intake & Intent Reasoning**:
   Select a preset (e.g. "X Sentiment Analysis" or "SQD Multi-Chain Stream") or enter a custom prompt. Click **Analyze Procurement Intent**.
   Observe the intent analysis card detailing the selected capability, rationale, and model transparency badge.
5. **Inspect the Authoritative 402 Quote**:
   Examine the exact atomic price (`5000`), human amount (`0.005000 USDC`), recipient address, token contract, and raw 402 challenge header.
6. **Test Human Approval & Policy Safety Barrier**:
   Click **Authorize & Execute Procurement**.
   - For paid routes: Observe the honest policy halt card displaying the one-shot idempotency token, prepared settlement parameters, and clear notice that zero wallet funds were debited.
   - For free SQD routes: Observe the live delivered multi-chain blockchain data.
7. **Inspect the Historical Mainnet Proof**:
   Scroll to the Historical Mainnet Verification Evidence card to inspect the confirmed Celo transaction `0x7e51...ac43` and click the Celoscan link.
8. **Inspect ERC-8004 Agent Trust Drawer**:
   Expand the ERC-8004 drawer to verify on-chain registry binding (`0x8004...a432`) and TikHub agent metadata.
