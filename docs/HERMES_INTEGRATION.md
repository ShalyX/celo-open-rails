# Hermes Agent integration — live verification checkpoint

**Status (2026-11-09): VERIFIED in the authenticated single-operator desk API; no new payment.** Hermes is the actual model-driven service selector, replacing the previously mandatory deterministic matcher. The public Vercel judge site is still a separate read-only static showcase, **not** the live purchasing application.

## Architecture and security

- Caraxes VPS: Hermes Agent **v0.19.0**, API alias **`forge`**, with configured `openai-codex` backend. The exact underlying provider model is subject to Hermes's active profile.
- A host-local HTTP listener `127.0.0.1:8642` is enabled via a systemd environment-file drop-in. Remote users cannot reach it directly.
- Windows developer machine connects over an SSH local port forward `127.0.0.1:8642 -> caraxes-vps:127.0.0.1:8642`. The tunnel's currently observed process ID was **4476**; this will change after a restart.
- Strong API key exists only in a private 0600 file on Caraxes and in the local ignored `.env.local`. The key does not appear in GitHub and is never delivered to a browser.
- HTTP `GET /health` returned **200**. Unauthenticated `GET /v1/models` returned **401**. Authenticated `GET /v1/models` returned **200** with model `forge`.
- The active Hermes **forge** profile explicitly selects `platform_toolsets.api_server = [stt, no_mcp]`. Here, the `stt` toolset has **zero executable tools** and `no_mcp` suppresses MCP servers. Authenticated `GET /v1/toolsets` confirmed an enabled `stt` toolset with `tools: []` and **zero exposed tool names**. Other Hermes messaging and CLI profile permissions were not changed.
- The desk uses `src/lib/hermesIntent.ts`, bound to trusted loopback HTTP with bearer authentication. It never supplies wallet secrets, payment credentials, a terminal or browser tools. The model may only propose a capability ID, rationale, confidence and JSON body; the backend resolves URLs and methods from the live Buy catalog, validates schemas and requires separate human spending authorization.
- `HERMES_MODEL=forge`, `HERMES_ALLOW_DETERMINISTIC_FALLBACK=false`, `HERMES_REQUIRED=true`. When inference fails, the authenticated app returns an error instead of silently substituting keyword matching.
- `POLICY_DISALLOW_SPEND=true`, `LIVE_BUY_MODE=DISABLED` remain in force. No `/api/procure`, payment or blockchain call was made in the Hermes tests.

## Live model evidence

Authenticated requests were sent **through the working Next.js `POST /api/intent` route** with the actual current Buy catalog, not through a mocked model.

| User objective | Actual Hermes selection | Validated model output | Status |
|---|---|---|---|
| Recent X posts about Celo MiniPay merchant adoption and USDC wallets | `x.posts.search` | `POST`, query containing MiniPay merchant/adoption/USDC terms; `type: latest`; reasoning, confidence **0.98** | PASS |
| List supported SQD blockchain datasets and networks, not social posts | `sqd.datasets` | `GET`, empty body; relevant rationale, confidence **1.00** | PASS |

Both returned `isAiReasoning: true`, `engineModel: Hermes Agent (forge)` and live-catalog-supported routes. First request returned authenticated HTTP **200**; second also passed. The results are saved, without credentials, in `docs/evidence/hermes-live-selection-20261109.json`.

## QA and remaining limits

- Unit/negative tests: **35 passed** before the live acceptance; final rerun is recorded in the Operator checkpoint.
- TypeScript and production build were previously green; rerun after latest aliases before final gate.
- No product-wide public multi-user purchasing rollout, wallet account segregation, or independent-user adoption is claimed.
- The previous real paid task (0.005 USDC for 18 X posts) and the two new real Hermes inference tests are separate verified events. **Do not combine them into a fictitious second paid transaction.**
- CLI/agent profiles remain distinct. The inactive default Hermes configuration is not evidence of the active `forge` profile; the live `/v1/toolsets` and inference responses are the primary acceptance records.

**P0-02 verdict:** VERIFIED **for the live, authenticated, local single-operator desk**. Remaining product readiness work belongs to public access / durable multi-user backend / independent users, not model integration.
