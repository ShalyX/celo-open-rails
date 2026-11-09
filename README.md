# Celo Agent Procurement Desk

A task-first procurement workstation for agent-selected external services on **Celo**. An operator enters a research objective, inspects the live Buy gateway catalog and exact HTTP 402 quote, authorizes a fixed budget, and receives an auditable outcome. Real blockchain data can be delivered from the gateway's free SQD tier; one authorized paid task has now delivered real provider data and a confirmed receipt. Paid mode remains disabled by default.

**Hackathon:** Celo Agents on Open Rails — Build with buy.

## What exists

- Next.js/TypeScript workspace: task intake, capability reasoning, quote inspector, operator approval, execution timeline, ledger, historical proof, ERC-8004 trust inspection.
- Real `@celo/buy` gateway catalog / unpaid 402 quote integration, free SQD dataset discovery, direct Celo RPC account and receipt checks when the network is reachable.
- Operator-only login. Session cookies are HttpOnly, SameSite=Strict. Authenticated state-changing endpoints require a matching Origin.
- Exact 6-decimal spend-cap checks and token equality, single-attempt local file locks, no automatic re-execution.
- 19 passing unit/security/digest tests, TypeScript checked, fresh Next.js production build produced.
- Own ERC-8004 agent **10059** on Celo mainnet; public registration metadata under `public/.well-known/agent-registration.json`.

## Local quick start

Requires Node.js 20+ and npm.

```sh
npm install
cp .env.example .env.local
# edit .env.local and replace OPERATOR_ACCESS_TOKEN with your own random 24+ character secret
npm run dev -- --hostname 127.0.0.1 --port 4399
```

Open `http://127.0.0.1:4399`. Sign in using your local operator token. No credential is bundled in Git.

On Windows PowerShell use `Copy-Item .env.example .env.local`. Start only on loopback for local demo. The running build was tested on Windows.

```sh
npm test
npx tsc --noEmit
npm run build
```

## Workflow

1. Enter a useful research objective or select an advertised capability.
2. Inspect the gateway's **live** capability entry. With an LLM key configured, the intent engine can use model reasoning; otherwise it clearly labels deterministic matching.
3. Run an unpaid gateway request and inspect the exact 402 price. Catalog prices are not authorization.
4. Review the explicit cap and token, log in as operator and authorize once.
5. In default safe mode, paid tasks halt before signing. Under the consumed one-time user authorization, the guarded executor bought one TikHub X search for 0.005 USDC and preserved 18 returned tweet records. Free SQD remains available without payment.
6. Inspect the [new paid-task proof](docs/evidence/paid-task-20261109.json) and the separately labeled [historical purchase proof](https://celoscan.io/tx/0x7e511e9094756923f3373c01ae7965a3f1ea1f5b43b03172ee91d97e19d8ac43).

**Never describe the historical transaction as a payment made by this application.** It was an independently verified integration spike, not the execution of a new task from the desk.

## Configuration

- `OPERATOR_ACCESS_TOKEN`: required locally generated 24+ character secret (server-only). Do not commit it.
- `POLICY_DISALLOW_SPEND=true` and `LIVE_BUY_MODE=DISABLED`: default evaluation settings. Paid execution requires both explicit live switches, an installed CLI and an approved exact task; the authorization used for the recorded purchase is consumed.
- `GEMINI_API_KEY` or `OPENAI_API_KEY`: optional server-only model credentials. Without a working model, intent matching is deterministic and visibly labeled.
- `BUY_HOME`: optional location of local cpay receipt files.

All wallet keystores, local `.data/`, and `.env.local` are ignored by Git. Never publish receipts containing private authorization details or private keys.

## Verification boundaries

See [QA report](docs/QA_REPORT.md), [project status](docs/STATUS.md), and [submission package](docs/SUBMISSION.md).

The paid executor is **live-verified once**, through the actual authenticated product API, on Celo mainnet. By default paid dispatch requires BOTH `POLICY_DISALLOW_SPEND=false` and `LIVE_BUY_MODE=EXPLICIT_PER_TASK_SPEND_APPROVED`, plus a quoted operator-approved task and a locally installed Buy CLI at `BUY_CLI_ENTRY`. Do not enable these without separate user authorization. It does not attempt to automatically retry ambiguous outcomes.

The production build and security tests pass. An isolated, live production-server smoke run verified gateway catalog discovery (171 capabilities), real unpaid 402 quote, free SQD payload delivery, operator approval, safe paid-policy halt, replay prevention, and local persistence. That earlier smoke made no paid purchase. The later authorized run did: see the verified proof below.

This is a local judge-evaluation build, **not production-ready for public wallet operation**. Before deployment, implement a transactional shared ledger, robust operator identity, deployed keystore signing strategy, and run full live end-to-end/regression tests.


## Verified mainnet proof — 2026-11-09

- Own ERC-8004 agent **10059**; registration [transaction](https://celoscan.io/tx/0xbac5c383f43d381d27313694cb4d5141d9d34817f266fdfa54e88eae7d88bd36). Fee **0.04531464 CELO**, within 0.07 cap. [Registration proof](docs/evidence/erc8004-registration-20261109.json).
- Task `task-1794186340719-t3y6`: **Search for Celo MiniPay**, TikHub `x.posts.search`, **0.005 USDC**, **18 returned tweet records**. [Payment transaction](https://celoscan.io/tx/0xba529f67e679cfafb1ffeb6749cebd06cf967b0dc43ce6cf79b0255bcec63a61), block 82285602. [Exact task, response and receipt](docs/evidence/paid-task-20261109.json).
- On-chain Transfer matched token, operator wallet, payee and exact amount; wallet balance decreased from 0.062383 to 0.057383 USDC. Saved task survived a server restart, and replay returned 409. Paid mode is off.

This is one team-owned local API slice. Model-assisted selection, paid browser result usability, uncertainty recovery, independent users, finished demo and official enrollment/submission remain unverified. The original product scope remains in [PRODUCT.md](PRODUCT.md).

## Core references

- [Official Buy API Gateway skill](buy-skill/skills/use-api-gateway/SKILL.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Project requirements](docs/REQUIREMENTS.md)
- [Submission evidence](docs/SUBMISSION.md)
