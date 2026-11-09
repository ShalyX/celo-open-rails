# Demo Production / Demo QA — Celo Procurement Desk

**Recorded output:** [48-second captioned browser walkthrough](docs/evidence/celo-paid-proof-walkthrough.mp4).
**Media:** MP4 H.264, 1440×810, 12fps, 48.00s, approximately 2.6 MB, **no audio/voiceover**.
**Recording source:** real anonymous local `/proof` route in Chrome, no credential, no new mainnet calls. Captured via `scripts/record-proof-demo.py`; every frame comes from actual rendered browser screenshots. Scrolling and Show All interaction happened in the browser, not composited fake product mockups. Captions were added externally and label only verified evidence.

## Final six scenes (exactly 48s)

| Time | On-screen truth and captions |
|---|---|
| 00–07s | Real public-proof hero: research question, one 0.005 USDC purchase, registered agent #10059. "ONE RESEARCH TASK. ONE AUTHORIZED PURCHASE." |
| 07–14s | Four truthful stages: original task → exact unpaid 402 quote → human cap → delivered outside result. |
| 14–23s | Scroll to actual paid MiniPay X results, source post links and observed metrics. |
| 23–32s | Actual React "Show all" event expands **all 18** returned posts, real source data retained. |
| 32–40s | Read-only onchain payment/agent links, explicitly disclosed limitations. |
| 40–48s | Return to recorded proof hero; "THE NEXT PURCHASE IS DISABLED." |

## Recorded demo QA

- **Frame verification:** extracted and visually inspected seconds 4, 17, 30, 39 via `ffmpeg`; text and green/brown receipt highlights readable, screenshots genuine. `ffprobe` reports 48.00s MP4 and approximately 2,629,355 bytes.
- **Truth / secrets:** no operator token or signing code is shown; no purchased result fabricated; all 18 posts and public links are previously verified. Source route itself performs no new payment.
- **CTA correctness:** onchain transfer and own ERC8004 registration appear as links on real proof page. Their hashes are independently documented in EVIDENCE.md.
- **Visual:** editorial desktop composition and captions readable; lower-third intentionally overlays bottom 122 px; sticky top-right "RECORDING" can partially overlap an unimportant login link in first scene. No show-stopping content occlusion in sampled frames.
- **Audio:** intentionally silent, captions carry meaning. No machine-generated narration was added, to avoid misleading voice/poor-quality synthetic audio.
- **Limitations:** this is a **recorded evidence tour**, not footage of a second actual paid purchase nor a fully hosted multi-user service. Actual continuous frame-by-frame review of every second (rather than sampled frames) is not claimed.
- **Demo status:** DEMO_PRODUCTION = COMPLETE for captioned real walkthrough. DEMO_QA = **PARTIAL PASS** (timing, frames, factual claims and source proven; professional voiceover optional/not provided). The official platform video requirement, if any, must be checked against the authenticated Loops form.

## Reproduce (no spending)

The read-only judge viewer is deployed at https://celo-procurement-proof.vercel.app/ and the captioned walkthrough is at https://celo-procurement-proof.vercel.app/walkthrough.mp4. The deployed viewer cannot initiate payments. Vercel SSO protection is enabled on the deployment host; a temporary share URL is available for immediate review but expires 2026-11-10 06:27 WAT. Stable public access requires an approved narrow production access change or a custom domain.

For local reproduction, start `npm run dev` with live spend disabled and open `http://127.0.0.1:3000/proof`. Source of truth is `docs/evidence/paid-task-20261109.json`, not a new API purchase. The recorded video uses this same source.
