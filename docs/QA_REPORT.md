# QA Report — 2026-11-09 current checkpoint

**Scope:** Windows local production build and real Celo mainnet integrations. **Verdict:** local paid API slice VERIFIED; full product / public hosted wallet release NOT READY.

| Check | Result / proof | Limits |
|---|---|---|
| Automated checks | 19/19 unit/security/digest tests PASS; TypeScript PASS; fresh `.next-approved` build PASS | Four original tests use fixture/mock logic; tests do not prove the entire product |
| Existing zero-spend smoke | Earlier 12-step live flow verified auth, catalog, unpaid quote, genuine SQD, policy halt, replay/history | Historical smoke does not prove a paid call |
| New paid task | Authenticated product created task, obtained exact unpaid quote and accepted bounded 0.005 USDC approval; one guarded Buy call delivered authentic TikHub data | API-driven local run, no final browser click-through |
| Exact settlement | Successful tx `0xba529f67e679cfafb1ffeb6749cebd06cf967b0dc43ce6cf79b0255bcec63a61`, block 82285602; exact USDC Transfer from operator to quoted payee for 5000 atoms | First secondary receipt lookup briefly returned null; read-only reconciliation confirmed receipt; no paid retry |
| Result | 18 actual tweet entries in `output.timeline`; provider run and exact response preserved in paid-task artifact | Provider `resultCount: 1` is a separate upstream field, not tweet count; redaction/depth truncation applies |
| Replay / persistence | Disabled-mode server restart read same delivered task/hash; duplicate authorization HTTP 409 | Single-instance file ledger, uncertainty/crash recovery and multi-instance durability unproven |
| Own ERC-8004 | ID 10059, successful Registered event plus ownerOf and tokenURI; fee 0.04531464 CELO < 0.07 | Provider ID 9895 remains separate; official entry not inferred |
| Public source | Repo PUBLIC; raw JSON/image HTTP 200 before registration; latest registration list re-fetched after cache propagation | Heuristic secret scan: 10 commits, 144 unique blobs, no findings; not a guarantee |
| Spend closeout | Exactly one new USDC payment; unique local receipts 1 -> 2 including historical spike; wallet 0.062383 -> 0.057383 USDC | Approval consumed; no further spending authorized |
| Disarm | Approved paid server terminated; ignored local env remains POLICY_DISALLOW_SPEND=true / LIVE_BUY_MODE=DISABLED | Prior local safe-mode servers were not changed |
| Model selection / full product | UNPROVEN live model; deterministic fallback used and labeled | P0-02, P0-10 and P0-12 remain open; original scope preserved |
| Browser/demo/hygiene | Previous genuine screenshots retained | Paid browser QA, complete narrated demo, Product Hygiene and judge review remain open |

Artifacts: `docs/evidence/erc8004-registration-20261109.json`, `docs/evidence/paid-task-20261109.json`. Credentials stayed in the Windows OS credential store or ignored local environment; no secret exported into repository or evidence.

No deployment, independent user, outreach, Loops enrollment or submission is claimed. The new slice proves one real paid task, not full product readiness.
