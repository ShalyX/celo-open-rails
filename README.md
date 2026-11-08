# Celo Agent Procurement Desk

A task-first procurement workstation for agent-selected external services on **Celo**. An operator enters a research objective, inspects the live Buy gateway catalog and exact HTTP 402 quote, authorizes a fixed budget, and receives an auditable outcome. Real blockchain data can be delivered from the gateway's free SQD tier; paid execution is deliberately disarmed during safety evaluation.

**Hackathon:** Celo Agents on Open Rails — Build with buy.

## What exists

- Next.js/TypeScript workspace: task intake, capability reasoning, quote inspector, operator approval, execution timeline, ledger, historical proof, ERC-8004 trust inspection.
- Real `@celo/buy` gateway catalog / unpaid 402 quote integration, free SQD dataset discovery, direct Celo RPC account and receipt checks when the network is reachable.
- Operator-only login. Session cookies are HttpOnly, SameSite=Strict. Authenticated state-changing endpoints require a matching Origin.
- Exact 6-decimal spend-cap checks and token equality, single-attempt local file locks, no automatic re-execution.
- 12 passing unit/security tests, TypeScript checked, Next.js production build produced.

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
5. Paid task: **honest policy halt; no wallet signing or new purchase**. Free SQD task: attempt the real gateway query and preserve its response on success.
6. Inspect receipts and the separately labeled [historical purchase proof](https://celoscan.io/tx/0x7e511e9094756923f3373c01ae7965a3f1ea1f5b43b03172ee91d97e19d8ac43).

**Never describe the historical transaction as a payment made by this application.** It was an independently verified integration spike, not the execution of a new task from the desk.

## Configuration

- `OPERATOR_ACCESS_TOKEN`: required locally generated 24+ character secret (server-only). Do not commit it.
- `POLICY_DISALLOW_SPEND=true`: required evaluation policy. The current paid debit handler is hard-disarmed even if this is changed.
- `GEMINI_API_KEY` or `OPENAI_API_KEY`: optional server-only model credentials. Without a working model, intent matching is deterministic and visibly labeled.
- `BUY_HOME`: optional location of local cpay receipt files.

All wallet keystores, local `.data/`, and `.env.local` are ignored by Git. Never publish receipts containing private authorization details or private keys.

## Verification boundaries

See [QA report](docs/QA_REPORT.md), [project status](docs/STATUS.md), and [submission package](docs/SUBMISSION.md).

The production build and security tests pass. An isolated, live production-server smoke run verified gateway catalog discovery (171 capabilities), real unpaid 402 quote, free SQD payload delivery, operator approval, safe paid-policy halt, replay prevention, and local persistence. **There was no new paid purchase.** ERC-8004 identity status still requires a fresh verified chain response.

This is a local judge-evaluation build, **not production-ready for public wallet operation**. Before deployment, implement a transactional shared ledger, robust operator identity, deployed keystore signing strategy, real paid execution after explicit authorization, and run full live end-to-end/regression tests.

## Core references

- [Official Buy API Gateway skill](buy-skill/skills/use-api-gateway/SKILL.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Project requirements](docs/REQUIREMENTS.md)
- [Submission evidence](docs/SUBMISSION.md)
