"""Local real paid-result browser acceptance. READ ONLY except operator login.
Does NOT call /api/procure PUT or POST and cannot trigger payment.
Screenshots omit the operator credential. Original paid task stays unchanged.
"""
import base64
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import time
from urllib.request import urlopen
import websocket

BASE=os.getenv("SMOKE_BASE","http://127.0.0.1:4385")
TOKEN=os.getenv("SMOKE_AUTH_TOKEN")
if not TOKEN or len(TOKEN)<24: raise SystemExit("Missing locally injected operator credential")
PORT=9343
OUT=Path.cwd()/"docs"/"evidence"
OUT.mkdir(parents=True,exist_ok=True)
profile=tempfile.mkdtemp(prefix="celo-real-paid-proof-")
proc=subprocess.Popen([
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    "--headless=new","--disable-gpu","--no-first-run","--no-default-browser-check",
    "--remote-allow-origins=*",f"--remote-debugging-port={PORT}",
    f"--user-data-dir={profile}","--window-size=1536,1050","about:blank"
],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
ws=None
seq=0
def cmd(method,params=None):
    global seq
    seq+=1
    cid=seq
    ws.send(json.dumps({"id":cid,"method":method,"params":params or {}}))
    while True:
        packet=json.loads(ws.recv())
        if packet.get("id")==cid:
            if "error" in packet: raise RuntimeError(str(packet["error"]))
            return packet.get("result",{})
def js(expression):
    result=cmd("Runtime.evaluate",{"expression":expression,"returnByValue":True,"awaitPromise":True})
    if "exceptionDetails" in result:raise RuntimeError(str(result["exceptionDetails"]))
    return result.get("result",{}).get("value")
def screenshot(name):
    shot=cmd("Page.captureScreenshot",{"format":"png","captureBeyondViewport":False})
    target=OUT/name
    target.write_bytes(base64.b64decode(shot["data"]))
    print("CAPTURED="+str(target)+" bytes="+str(target.stat().st_size))
try:
    page=None
    for _ in range(50):
        try:
            tabs=json.load(urlopen(f"http://127.0.0.1:{PORT}/json/list",timeout=1))
            page=next((a for a in tabs if a.get("type")=="page"),None)
            if page:break
        except Exception:pass
        time.sleep(0.2)
    if not page:raise RuntimeError("Chrome CDP unavailable")
    ws=websocket.create_connection(page["webSocketDebuggerUrl"],timeout=30,origin="http://localhost")
    cmd("Page.enable")
    cmd("Runtime.enable")
    cmd("Emulation.setDeviceMetricsOverride",{"width":1536,"height":1050,"deviceScaleFactor":1,"mobile":False})
    cmd("Page.navigate",{"url":BASE})
    time.sleep(2)
    result=js("""(async()=>{
      const r=await fetch('/api/operator',{method:'POST',
        headers:{'Content-Type':'application/json'},body:JSON.stringify({token:SECRET})});
      return r.status
    })()""".replace("SECRET",json.dumps(TOKEN)))
    if result!=200:raise RuntimeError("Operator login failed; HTTP "+str(result))
    cmd("Page.reload",{"ignoreCache":True})
    metrics={}
    for _ in range(50):
        time.sleep(1)
        metrics=js("""(()=>{
          const p=document.querySelector('section[aria-label="Paid research results"]');
          return {found:!!p, raw:!!document.body.innerText.includes('18'),
          links:p? p.querySelectorAll('a[href^="https://x.com/"]').length:0,
          visibleSummary:p? p.innerText.slice(0,110):null};
        })()""")
        if metrics.get("found") and metrics.get("links",0)==6:break
    else:raise RuntimeError("Real paid research pane failed to render: "+str(metrics))
    print("PAID_UI_FIRST_VIEW="+json.dumps(metrics))
    screenshot("07-paid-task-overview.png")
    js("""document.querySelector('section[aria-label="Paid research results"]').scrollIntoView({block:'start'});""")
    time.sleep(0.5)
    screenshot("08-paid-18-posts-first-page.png")
    action=js("""(()=>{
      const p=document.querySelector('section[aria-label="Paid research results"]');
      const b=[...p.querySelectorAll('button')].find(b=>b.innerText.includes('Show all'));
      if(!b)return false;b.click();return true;
    })()""")
    if not action:raise RuntimeError("Show-all control not functional")
    time.sleep(1)
    full=js("""(()=>{
      const p=document.querySelector('section[aria-label="Paid research results"]');
      return {links:p.querySelectorAll('a[href^="https://x.com/"]').length,
        posts:p.querySelectorAll('ol > li').length,
        receiptVisible:document.body.innerText.includes("Verify this task")};
    })()""")
    print("PAID_UI_SHOW_ALL="+json.dumps(full))
    if full.get("links")!=18 or full.get("posts")!=18:raise RuntimeError("Not all 18 posts were rendered")
    screenshot("09-paid-all-18-posts.png")
    print("REAL_PAID_BROWSER_ACCEPTANCE_PASSED_READ_ONLY")
finally:
    if ws:ws.close()
    proc.terminate()
    try:proc.wait(timeout=8)
    except subprocess.TimeoutExpired:proc.kill()
    shutil.rmtree(profile,ignore_errors=True)
