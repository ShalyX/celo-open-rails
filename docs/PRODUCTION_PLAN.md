# Production Plan — Celo Agent Procurement Desk

**Product**: Celo Agents on Open Rails (Agent Procurement Desk)  
**Target Completion**: 2026-11-08  
**Evaluation Mode**: Full build and verification, zero spend, local git commit.

---

## Milestones & Execution Schedule

### M1: Buy Gateway Real Paid Proof Verification [COMPLETED]
- **Objective**: Confirm buy CLI functionality, funded account `celo-open-rails`, and on-chain payment proof.
- **Evidence**:
  - Account: `celo-open-rails` (`0xf903e8a6FC3B751D8466469Fa85F2A1B9Caeba8b`).
  - Transaction Hash: `0x7e511e9094756923f3373c01ae7965a3f1ea1f5b43b03172ee91d97e19d8ac43`.
  - Block: 82246474 on Celo Mainnet (`0x4e6fb4a`).
  - Amount: 0.005 USDC (5000 atomic units) to `0x20faAca5F980E29639A0FCC6dcA6988E18ed333B`.
  - Keystore receipt recorded in `~/.config/cpay/receipts.1.json`.

### M2: Architecture & Planning Lock [COMPLETED]
- **Objective**: Align product brief, strict constraints, and system boundaries across the 6 documentation assets.
- **Evidence**:
  - `docs/PROJECT_BRIEF.md`, `docs/REQUIREMENTS.md`, `docs/ARCHITECTURE.md`, `docs/PRODUCTION_PLAN.md`, `docs/RESEARCH_AND_RESOURCES.md`, `docs/STATUS.md` updated.
  - User mandatory corrections integrated: no historical tx substitution, dynamic balance polling, honest fallback labeling, ERC-8004 verification.

### M3: Core Backend Engine & Gateway Integration [IN PROGRESS]
- **Objective**: Implement Next.js backend services:
  - Live catalog loader (`/api/catalog`).
  - Dual-mode intent reasoning engine (`/api/intent`).
  - Unpaid 402 challenge quoter (`/api/quote`).
  - Dynamic balance and account reader (`/api/account`).
  - Free SQD multi-chain execution runner & policy-guarded paid procurement dispatcher (`/api/procure`).
  - Durable receipts and on-chain proof resolver (`/api/receipts`).
  - ERC-8004 agent identity verifier (`/api/trust`).

### M4: Bespoke Institutional Frontend Application [PENDING]
- **Objective**: Build production-grade high-density procurement console:
  - Header with dynamic wallet balances and verified account badge.
  - Task Intake & Intent Formulator with dual-mode badge (AI Reasoning vs Deterministic Fallback).
  - Exact 402 Quote Inspector displaying atomic units and token terms.
  - Explicit Human Approval Barrier with budget cap warning.
  - Pipeline Execution Monitor with honest policy halt or live delivered result.
  - Historical Mainnet Verification Archive and durable task ledger.

### M5: Automated Testing, QA Report & Submission Package [PENDING]
- **Objective**: Full end-to-end verification, test suite execution, production build, QA report, submission checklist, and git commit.
- **Evidence**:
  - Unit/integration tests passing (`npm test`).
  - Next.js production build (`npm run build`).
  - `docs/QA_REPORT.md` and `docs/SUBMISSION.md` completed.
  - Clean local git commits.

---

## Stop Conditions & Risk Mitigations
- **Stop Condition 1 (Spend Breach)**: Any command attempting an unauthorized paid transaction or wallet signature while spend is disabled. Mitigation: `POLICY_DISALLOW_SPEND=true` hardcoded in execution handler.
- **Stop Condition 2 (Synthetic Mockery)**: Faking responses or pretending historical data is fresh. Mitigation: Honest execution halts for paid calls; real live execution for SQD calls.
- **Stop Condition 3 (Build/Type Failure)**: Unhandled TypeScript errors or broken styling. Mitigation: Strict type safety and pre-commit build verification.
