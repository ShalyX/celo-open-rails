# Hermes Agent reasoning — Celo Procurement Desk

**Status: IMPLEMENTED, UNIT-TESTED, NOT YET LIVE-VERIFIED.** This does not satisfy PRODUCT P0-02 until a genuine inference succeeds through the working interface with the real catalog.

## Architecture

The authenticated Next.js backend calls the operator's Caraxes VPS Hermes Agent through a private **SSH tunnel**. The HTTP service must be bound exclusively to `127.0.0.1:8642`, protected by a strong `API_SERVER_KEY`. The browser never sees this key or directly reaches Hermes. The public Vercel site remains read-only and has no API or wallet backend.

- Implementation: `src/lib/hermesIntent.ts`, invoked from `src/lib/intentEngine.ts`.
- Expected Hermes endpoint: `http://127.0.0.1:8642/v1/chat/completions`.
- Backend environment keys: `HERMES_API_BASE_URL`, `HERMES_API_KEY`, `HERMES_MODEL`, `HERMES_REQUIRED=true`, `HERMES_ALLOW_DETERMINISTIC_FALLBACK=false`.
- The connection only accepts a localhost SSH tunnel; it rejects externally addressable API URLs, preventing accidental public exposure or SSRF.
- Hermes proposes a capability ID, confidence, reasoning and JSON request body. The backend resolves **method and URL only from the live Buy catalog** and checks the proposed ID, schema, required fields, types, spending-safe gateway host and operator-selected capability.
- Hermes never receives the Buy wallet keys, operator cookie, local payment history or API key for any other service.
- The original approval and spending guards remain intact. `POLICY_DISALLOW_SPEND=true` and `LIVE_BUY_MODE=DISABLED` must stay enforced; inference itself cannot pay.

## Host reality / observed checks

- VPS: existing Caraxes host, Hermes Agent v0.19.0, `hermes-gateway` active.
- Existing Hermes provider: `openai-codex`; configured model: `gpt-5.6-sol`. This is a **configuration observation**, not proof of a successful model call.
- The official Hermes documentation supports OpenAI-compatible `POST /v1/chat/completions`.
- The API listener is **not yet confirmed healthy**. An initial attempt to enable `API_SERVER_ENABLED` in `/root/.hermes/.env` and restart the existing gateway left the listener unopened; the missing systemd environment injection is under review.
- Hermes API server grants agent tool access by default. For this desk, `platform_toolsets.api_server` has been set to `[no_mcp]`, intended to expose no agent tools. **Do not trust this until authenticated `/v1/toolsets` confirms zero enabled tools.**
- A private API key was generated and stored on the VPS, **never in GitHub**. The systemd service drop-in and local SSH key handoff are not yet complete.
- Existing scheduled gateway work can be interrupted by restart. Avoid repeated restarts and protect the user's other processes.

## QA and acceptance

- Existing 28 tests + 7 new Hermes inference/validation tests = **35 passing**.
- TypeScript validation passed.
- Production build: see latest Operator checkpoint / build output.
- **P0-02 requires:** authenticated private server + zero tool permissions; a real Gemini/OpenAI-compatible Hermes response; two meaningfully different research objectives selecting valid live capabilities with traceable model explanations; zero purchases; normal operator API/browser task experience; evidence in EVIDENCE.md.
- If Hermes is unavailable, a configured deployment **fails closed**, showing the failure. Deterministic fallback only runs when `HERMES_ALLOW_DETERMINISTIC_FALLBACK=true` is explicitly set. Old fallback code remains as a labeled opt-in compatibility path.

## Reference

Hermes official API server docs: https://hermes-agent.nousresearch.com/docs/user-guide/features/api-server

**Safety limits:** No extra on-chain transactions or Buy spending, no public API bind, no giving Hermes shell access from the procurement task, no claims that P0-02 is verified without a real response.
