# Dependency Attack — HQ Engineering

Checked 2026-11-09 (West Africa Time). Stage is NOT passed until existential blockers are cleared or explicitly recorded.

| Dependency | Existential risk | Read-only or safe test | Result | Fallback and owner |
|---|---|---|---|---|
| Celo Buy gateway catalog and live 402 | Task-to-price cannot function | Live production smoke, 171 capabilities, 5000 atomic USDC quote | PROVEN (specific task) | Never invent prices; fail closed on network errors |
| Buy CLI version, local account, body support | Paid request might not reach actual tool | Installed `@celo/buy` CLI `curl --help`, `--account`, `--data-file` verified; Buy CLI with `--max-amount 0` fetched real free SQD JSON without wallet signature | CLI FREE PATH PROVEN; actual new paid dispatch UNPROVEN | Prepare direct CLI invocation, require separate live authorization |
| Celo mainnet settlement | Sponsor paid proof could be imaginary | Historical Celo tx 0x7e511...ac43; read-only RPC shows success and ONE exact USDC transfer to intended payee of 5000 atomic units | PROVEN as historical spike ONLY | Store fresh transaction receipt and verify exact token/payee/amount before showing success |
| Human approval and budget safety | Unauthorized spend / duplicated calls | 16 security/guard tests pass, 12 live zero-spend smoke steps and repeated PUT rejection | PROVEN for safe path | Default double-disable real paid run; no retry |
| Key/account transport | Desktop signing not portable to public Vercel | CLI from local cpay account and ignored `.env.local`; no external hosted signer | BLOCKED for public cloud | Keep execution on private local/VPS runtime, expose only authenticated front end after architecture review |
| Agent ERC-8004 identity | Entry may be ineligible | Celo mainnet `balanceOf(operator_wallet)` read-only call returned **0** | FAILED / BLOCKED | Requires owner wallet signing transaction; user authorization needed |
| Independent user / demand | Qualifier not met | No genuine independent wallet user present in project records | UNVERIFIED | Ask a real external user to try, do NOT manufacture evidence |
| Agent model/inference | Autonomous selection weak | Code supports optional Gemini/OpenAI, no credentials in current local .env | BLOCKED for model proof | Honest deterministic mode; use connected model only when independently verified |
| Public judge access and submission | Judges cannot clone private code | GitHub CLI confirms PRIVATE | BLOCKED / user permission | Prepare public-ready source without secrets; visibility/submission need approval |
| Deadline / artifact packaging | Submission deadline 09:00 GMT Nov 9 | Official Loops page checked Nov 8 | CONFIRMED | Prioritize P0s, keep early submission buffer, no imaginary time extension |

**Hard stop:** No new payment signing or onchain identity registration transaction without explicit user approval; no public repo or submission without permission. Continue safe code, tests, metadata, demo, research while blocked.
