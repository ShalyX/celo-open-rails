# Celo Open Rails — Agent Procurement Desk
## Project Brief

**Project Name**: Celo Agent Procurement Desk  
**Hackathon Track**: Build with buy (Celo Agents on Open Rails Hackathon)  
**Target User**: Independent operators, quantitative researchers, and autonomous agent systems needing verifiable external capabilities (social intelligence, web browsing, GPU compute, blockchain indexers) with cryptographic traceability, budget governance, and settlement certainty.  
**Repository**: `celo-open-rails`  
**Date**: 2026-11-08  
**Status**: ACTIVE IMPLEMENTATION — Core Mechanism Locked

---

## 1. Problem Statement
Autonomous AI agents are increasingly tasked with external research and operational workflows. However, existing architectures suffer from a critical dilemma:
1. **Unconstrained API Access**: Agents are provided raw master API keys or unfettered credit cards, creating catastrophic financial and security attack surfaces.
2. **Paywall Roadblocks**: Web paywalls, dynamic pricing, and siloed authentication prevent autonomous agents from acquiring specialized data on demand.
3. **Settlement Ambiguity**: Typical crypto-agent payment demos suffer from double-spending on timeouts, blind retries on network failures, and zero durable auditing.

## 2. Solution: The Agent Procurement Desk
The **Celo Agent Procurement Desk** is an institutional-grade, human-in-the-loop and autonomous procurement system designed around the `@celo/buy` API Gateway and Celo mainnet rails:
- **Provider-Neutral Live Discovery**: Real-time discovery of live capabilities across social platforms (X/Twitter, Reddit, YouTube, Instagram, LinkedIn), browser automation, GPU compute leases, and free multi-chain decentralized data (SQD Network across 113+ chains).
- **Dual-Mode Intent Engine**:
  - **AI Model Reasoning** (when an LLM key is configured): Deep semantic decomposition of user research tasks into gateway routes, field mapping, and rationale.
  - **Honest Deterministic Fallback** (when no LLM key is configured): Explicitly labeled rule-based schema matcher, preventing deceptive claims of AI autonomy.
- **Unpaid Exact 402 Quoting**: Issues zero-cost preflight requests to obtain authoritative HTTP 402 challenge offers with exact atomic amounts, asset contracts, payTo recipients, and expiration windows.
- **Human Approval & Spend Governance Gate**: Clear visual authorization barrier displaying token balances, maximum spend caps, and one-shot execution nonces.
- **Strict Uncertainty Protection**: Enforces single-attempt payment semantics; treats `500 settle_uncertain` and `retryable: false` as terminal audit events without blind retrying.
- **Durable On-Chain Ledger & ERC-8004 Trust**: Live verification of Celo mainnet transaction receipts (e.g. historical proof `0x7e511e9094756923f3373c01ae7965a3f1ea1f5b43b03172ee91d97e19d8ac43`), persistent local keystore synchronization, and ERC-8004 Agent Identity Registry verification (`0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`).

## 3. Goals & Key Results
- **G1 (End-to-End Task Flow)**: Complete task intake -> intent match -> exact quote -> approval -> execution/guard -> delivered result.
- **G2 (Strict Spend Boundary)**: Dynamic balance tracking with zero unauthorized spend. Paid routes halt cleanly at policy gate during test/evaluation; free multi-chain SQD routes execute live end-to-end.
- **G3 (Authentic On-Chain Proof)**: Verified Celo mainnet transaction receipts parsed directly from Celo RPC and linked to Celoscan.
- **G4 (Institutional Design)**: Bespoke, high-density terminal/ledger UI without emojis or AI marketing clichés.

## 4. Non-Goals
- Speculative token trading or automated yield farming.
- Autonomous unlimited wallet spending without human-configured caps.
- Synthetic mock responses or simulated dummy delays masquerading as real network operations.
