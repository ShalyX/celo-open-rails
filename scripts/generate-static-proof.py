from pathlib import Path
import json, shutil, html, re, datetime
root=Path(__file__).resolve().parent.parent
out=root/"proof-public"
out.mkdir(exist_ok=True)
e=json.loads((root/"docs/evidence/paid-task-20261109.json").read_text(encoding="utf-8"))
items=e["record"]["execution"]["resultData"]["output"]["timeline"]
assert len(items)==18 and e["newPaidTransactions"]==1 and e["usdcSpent"]=="0.005"
tx=e["txHash"]
reg="0xbac5c383f43d381d27313694cb4d5141d9d34817f266fdfa54e88eae7d88bd36"
agent="10059"
esc=lambda v: html.escape(str(v or ""),quote=True)
def escaped_post(v):
    # Preserve the original trailing spaces in HTML without staging raw
    # whitespace that fails git diff --check.
    s=esc(v)
    return re.sub(r"(?m) +$",lambda m:"&#32;"*len(m.group()),s)
def intv(v):
    try:return max(0,int(v))
    except:return None
def short(v):
    n=intv(v)
    if n is None:return "—"
    return f"{n:,}"
posts=[]
for i,p in enumerate(items,1):
    handle=p.get("screen_name","")
    tweetid=str(p.get("tweet_id",""))
    safehandle=handle if re.fullmatch(r"[A-Za-z0-9_]{1,15}",handle) else ""
    safeid=tweetid if re.fullmatch(r"\d{5,25}",tweetid) else ""
    link=(f"https://x.com/{safehandle}/status/{safeid}" if safehandle and safeid else "")
    originaldate=p.get("created_at","")
    try:date=datetime.datetime.fromisoformat(originaldate.replace("Z","+00:00")).strftime("%d %b %Y")
    except:date=str(originaldate)[:26]
    stats=[("Likes",short(p.get("favorites"))),("Reposts",short(p.get("retweets"))),("Replies",short(p.get("replies")))]
    linkhtml=f'<a class="post-link" href="{esc(link)}" target="_blank" rel="noopener noreferrer">Open original post ↗</a>' if link else '<span class="muted">Source link unavailable</span>'
    posts.append(f"""<article class="post">
      <div class="post-head"><span class="post-author">@{esc(handle) if handle else "unknown"}</span><span class="post-date">{esc(date)}</span></div>
      <p class="post-text">{escaped_post(p.get("text",""))}</p>
      <div class="post-bottom"><div class="post-stats">{''.join(f'<span>{label} <b>{value}</b></span>' for label,value in stats)}</div>{linkhtml}</div>
    </article>""")
intro="".join(posts[:6]); rest="".join(posts[6:])
page="""<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="description" content="Read-only proof of one real Celo Buy transaction: 0.005 USDC for 18 sourced X posts, agent 10059. No wallet access, no new purchases."/>
<meta property="og:title" content="Celo Procurement Desk — Verified Paid Research"/>
<meta property="og:description" content="One capped purchase. Eighteen real X posts. Verifiable Celo receipt."/>
<meta property="og:type" content="website"/>
<link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
<title>Celo Procurement Desk · Verified paid research proof</title>
<style>
:root{color-scheme:dark;--base:#0b0f17;--panel:#131a22;--border:#29343d;--text:#e4ebe9;--muted:#a0b1ad;--green:#62e6a2;--gold:#dabb6b}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--base);color:var(--text);font-family:Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
a{color:inherit}a:hover{color:var(--green)}a:focus-visible,summary:focus-visible{outline:2px solid var(--green);outline-offset:4px}
.wrapper{max-width:1190px;margin:0 auto;padding:0 24px}.top{border-bottom:1px solid var(--border);padding:20px 0}
.top-inner{display:flex;align-items:center;justify-content:space-between;gap:18px}.brand{display:flex;align-items:center;gap:13px;font-size:13px;letter-spacing:.18em;font-weight:750;text-decoration:none}.brand img{width:35px;height:35px}
.small{font:12px ui-monospace,SFMono-Regular,Consolas,monospace;color:var(--muted)}.top .small{white-space:nowrap}.main{padding-top:72px;padding-bottom:80px}.hero{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(315px,.75fr);gap:54px;align-items:center}.eyebrow{font:12px ui-monospace,Consolas,monospace;letter-spacing:.15em;color:var(--green);text-transform:uppercase}h1{font-size:clamp(35px,5.2vw,68px);letter-spacing:-.05em;line-height:1.09;margin:23px 0 26px}h1 em{color:var(--green);font-style:normal}.lead{font-size:17px;line-height:1.75;color:var(--muted);max-width:670px}
.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:30px}.btn{padding:13px 17px;background:var(--green);color:#08130e;border-radius:7px;text-decoration:none;font-size:13px;font-weight:750;display:inline-flex;align-items:center;gap:8px}.btn:hover{color:#08130e;filter:brightness(1.1)}.btn.ghost{background:transparent;border:1px solid var(--border);color:var(--text)}
.panel,.step,.post,.notice{border:1px solid var(--border);background:var(--panel);border-radius:12px}.panel{padding:28px}.panel .small{letter-spacing:.1em;text-transform:uppercase}.numbers{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin:23px 0}.number{font-size:35px;color:var(--green);font-weight:800;letter-spacing:-.055em}.number.gold{color:var(--gold)}.caption{font-size:12px;color:var(--muted);margin-top:3px}.micro{padding-top:18px;border-top:1px solid var(--border);font:12px ui-monospace,Consolas,monospace;line-height:2;color:var(--muted);overflow-wrap:anywhere}.micro b{color:var(--text);font-weight:500}.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin:64px 0}.step{padding:22px}.step .idx{font:12px ui-monospace,monospace;color:var(--green)}.step h3{font-size:17px;margin:14px 0 10px}.step p{font-size:13px;line-height:1.65;color:var(--muted);margin:0}
.results{border:1px solid #28543f;border-radius:14px;background:#10201c;padding:24px;scroll-margin-top:30px}.result-head{display:flex;align-items:start;justify-content:space-between;gap:30px;margin-bottom:19px}.result-head h2{font-size:30px;letter-spacing:-.035em;margin:10px 0 8px}.result-head p{color:var(--muted);line-height:1.7;margin:0}.bigcount{font-weight:800;color:var(--green);font-size:42px;white-space:nowrap;text-align:right;line-height:1}.bigcount span{display:block;font-size:11px;line-height:2.5;font-weight:500;text-transform:uppercase;letter-spacing:.12em;color:var(--muted)}
.source-note{font-size:13px;color:var(--muted);line-height:1.75;max-width:840px;margin-bottom:19px}.posts{display:grid;grid-template-columns:1fr 1fr;gap:12px}.post{padding:19px;min-width:0}.post-head,.post-bottom{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.post-author{font-weight:700;font-size:14px}.post-date{color:var(--muted);font-size:12px}.post-text{font-size:14px;line-height:1.74;white-space:pre-wrap;overflow-wrap:anywhere;margin:16px 0 23px}.post-bottom{border-top:1px solid var(--border);padding-top:13px}.post-stats{display:flex;gap:11px;font-size:11px;color:var(--muted);flex-wrap:wrap}.post-stats b{color:var(--text)}.post-link{font-size:12px;color:var(--green);text-decoration:none}.expand{margin-top:14px}.expand summary{cursor:pointer;list-style:none;text-align:center;padding:15px;border:1px solid #367d5c;border-radius:8px;color:var(--green);font-weight:700;font-size:13px}.expand summary::-webkit-details-marker{display:none}.expand summary:after{content:"↓";margin-left:9px}.expand[open] summary:after{content:"↑"}.expand .posts{margin-top:14px}
.details{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:48px}.notice{padding:25px}.notice h3{font-size:18px;margin:0 0 13px}.notice p{color:var(--muted);line-height:1.75;font-size:14px}.notice a{display:block;color:var(--green);font-size:13px;margin-top:12px;overflow-wrap:anywhere}.meta-label{font-size:11px;color:var(--muted);letter-spacing:.1em;text-transform:uppercase}.video{margin-top:50px}.video h2{font-size:25px}.video p{color:var(--muted);font-size:13px}.video video{display:block;width:100%;max-width:850px;border-radius:12px;border:1px solid var(--border);background:#000;margin-top:14px}.footer{border-top:1px solid var(--border);padding-top:23px;color:var(--muted);font-size:12px;margin-top:50px}
@media(max-width:780px){.main{padding-top:43px}.hero{grid-template-columns:1fr;gap:30px}.steps{grid-template-columns:1fr 1fr;margin:39px 0}.posts{grid-template-columns:1fr}.details{grid-template-columns:1fr}.top .small{display:none}.result-head h2{font-size:25px}}
@media(max-width:480px){.wrapper{padding:0 16px}.steps{grid-template-columns:1fr}.panel{padding:21px}.results{padding:15px}.result-head{gap:10px}.bigcount{font-size:32px}.post{padding:15px}}
</style></head>
<body><header class="top"><div class="wrapper top-inner"><a class="brand" href="/"><img src="/favicon.svg" alt=""/><span>CELO PROCUREMENT DESK</span></a><span class="small">RECORDED MAINNET PROOF · CHAIN 42220</span></div></header>
<main class="wrapper main">
<section class="hero"><div><div class="eyebrow">One authorized task · No new purchases</div><h1>A research question.<br/><em>One bounded purchase.</em><br/>Evidence you can inspect.</h1><p class="lead">An agent-operated desk purchased outside X research for 0.005 USDC on Celo mainnet. The gateway returned eighteen real posts, saved alongside the receipt. This is a <strong>recorded proof</strong> page, not a live payment service.</p>
<div class="actions"><a class="btn" href="https://celoscan.io/tx/TX" rel="noopener noreferrer" target="_blank">Verify paid transfer ↗</a><a class="btn ghost" href="https://github.com/ShalyX/celo-open-rails" rel="noopener noreferrer" target="_blank">Inspect public source ↗</a></div></div>
<aside class="panel"><div class="small">Chain-verified task receipt</div><div class="numbers"><div><div class="number">18</div><div class="caption">X posts returned</div></div><div><div class="number gold">0.005</div><div class="caption">USDC spent</div></div><div><div class="number" style="font-size:29px">10059</div><div class="caption">Own ERC-8004 agent ID</div></div><div><div class="number" style="font-size:28px">✓</div><div class="caption">One completed task</div></div></div><div class="micro">Task: <b>TASK</b><br/>Celo block: <b>BLOCK</b><br/>Provider: <b>Buy · x.posts.search</b></div></aside></section>
<section class="steps" aria-label="Verified procurement workflow">
<article class="step"><span class="idx">01</span><h3>Research task</h3><p>The operator requested X research about Celo MiniPay.</p></article>
<article class="step"><span class="idx">02</span><h3>Exact quote</h3><p>Gateway returned HTTP 402 for exactly 5,000 atomic units of USDC.</p></article>
<article class="step"><span class="idx">03</span><h3>Human approval</h3><p>One operator accepted the exact quote with a strict 0.005 USDC cap.</p></article>
<article class="step"><span class="idx">04</span><h3>Buy and deliver</h3><p>One charged request returned 18 posts. Result, payment and receipt were saved.</p></article>
</section>
<section class="results" id="results"><div class="result-head"><div><div class="eyebrow">Purchased source material</div><h2>Celo MiniPay X research</h2><p>Original provider records, not fabricated sentiment analysis.</p></div><div class="bigcount">18<span>Posts returned</span></div></div><p class="source-note">These posts were returned by the paid outside provider in a single captured request. Individual source links may become unavailable or change. Counts are reported snapshots, not proof of independent users, broad sentiment, accuracy or market demand.</p>
<div class="posts">FIRST_POSTS</div>
<details class="expand"><summary>Show all 18 returned posts</summary><div class="posts">REST_POSTS</div></details>
</section>
<section class="details"><article class="notice"><h3>Verify on Celo</h3><p>The full amount transferred from our agent wallet to the quoted recipient in the confirmed transaction. Our separate ERC-8004 identity was registered on the same chain.</p><a href="https://celoscan.io/tx/TX" target="_blank" rel="noopener noreferrer">→ 0.005 USDC payment transaction</a><a href="https://celoscan.io/tx/REG" target="_blank" rel="noopener noreferrer">→ ERC-8004 agent #10059 registration</a><a href="https://github.com/ShalyX/celo-open-rails/blob/master/docs/evidence/paid-task-20261109.json" target="_blank" rel="noopener noreferrer">→ Public recorded proof JSON</a></article>
<article class="notice"><h3>Honest limits</h3><p>The task was operated by the project team, not an independent user. The capability selector used a labeled deterministic fallback, not verified live model reasoning. Paid execution is disabled after the one authorized purchase. The public page cannot access a wallet, create tasks, or trigger payments.</p><div class="meta-label">Event attribution tag · celo_dd8616266527</div><p>For this Build with buy track, the organizer's FAQ states that x402 settlement transactions do not require the standard attribution tag; payment proof and agent/PayTo wallet details are supplied for judging.</p></article></section>
<section class="video"><h2>48-second real-browser walkthrough</h2><p>Actual recorded local proof page with factual captions. Silent by design; no synthetic paid flow.</p><video controls preload="metadata" playsinline poster="/preview.png"><source src="/walkthrough.mp4" type="video/mp4"/>Your browser does not support MP4 playback.</video></section>
<footer class="footer">CELO PROCUREMENT DESK · VERIFIED DATA, EXPLICIT LIMITS · <a href="https://www.loops.house/agents-on-open-rails" target="_blank" rel="noopener noreferrer">Agents on Open Rails</a></footer>
</main></body></html>"""
page=(page.replace("TX",tx).replace("REG",reg).replace("TASK",html.escape(e["taskId"]))
      .replace("BLOCK",str(e["blockNumber"])).replace("FIRST_POSTS",intro).replace("REST_POSTS",rest))
(out/"index.html").write_text(page,encoding="utf8")
shutil.copyfile(root/"src/app/icon.svg",out/"favicon.svg")
shutil.copyfile(root/"docs/evidence/celo-paid-proof-walkthrough.mp4",out/"walkthrough.mp4")
shutil.copyfile(root/"docs/evidence/10-public-proof-first-fold.png",out/"preview.png")
(out/"robots.txt").write_text("User-agent: *\nAllow: /\n",encoding="utf8")
(out/"README.md").write_text("""# Read-only public judge proof
This folder is a static evidence-only web root for Vercel. It has no API routes,
no wallet client, no operator authentication, no private runtime environment,
and no capability to send transactions. Content is deterministically extracted
from the real paid task snapshot in docs/evidence/paid-task-20261109.json.
Regenerate with python scripts/generate-static-proof.py. Do NOT put secrets here.
""",encoding="utf8")
print("STATIC_BUILD",str(out),len(items),"posts",len(page),"bytes html")
