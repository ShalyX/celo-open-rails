"""Anonymous Chrome QA for /proof. No credentials, no writes to app, no payment calls."""
import base64,json,subprocess,tempfile,shutil,time,websocket
from pathlib import Path
from urllib.request import urlopen
BASE="http://127.0.0.1:4388/proof"
PORT=9344
OUT=Path.cwd()/"docs"/"evidence"
OUT.mkdir(parents=True,exist_ok=True)
profile=tempfile.mkdtemp(prefix="celo-public-qa-")
proc=subprocess.Popen([
 r"C:\Program Files\Google\Chrome\Application\chrome.exe",
 "--headless=new","--disable-gpu","--no-first-run","--remote-allow-origins=*",
 f"--remote-debugging-port={PORT}",f"--user-data-dir={profile}","--window-size=1536,950","about:blank"
],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
ws=None; seq=0
def command(method,params=None):
 global seq
 seq+=1;cid=seq
 ws.send(json.dumps({"id":cid,"method":method,"params":params or {}}))
 while True:
  r=json.loads(ws.recv())
  if r.get("id")==cid:
   if r.get("error"):raise RuntimeError(str(r["error"]))
   return r.get("result",{})
def eval_js(expr):
 r=command("Runtime.evaluate",{"expression":expr,"returnByValue":True,"awaitPromise":True})
 if r.get("exceptionDetails"):raise RuntimeError(str(r["exceptionDetails"]))
 return r.get("result",{}).get("value")
def capture(name):
 d=command("Page.captureScreenshot",{"format":"png","captureBeyondViewport":False})
 target=OUT/name
 target.write_bytes(base64.b64decode(d["data"]))
 print("CAPTURE="+name+" bytes="+str(target.stat().st_size))
try:
 tab=None
 for _ in range(50):
  try:
   arr=json.load(urlopen(f"http://127.0.0.1:{PORT}/json/list",timeout=1))
   tab=next((x for x in arr if x.get("type")=="page"),None)
   if tab:break
  except Exception:pass
  time.sleep(.2)
 if not tab:raise RuntimeError("No browser")
 ws=websocket.create_connection(tab["webSocketDebuggerUrl"],timeout=25,origin="http://localhost")
 command("Page.enable");command("Runtime.enable")
 command("Emulation.setDeviceMetricsOverride",{"width":1536,"height":950,"deviceScaleFactor":1,"mobile":False})
 command("Page.navigate",{"url":BASE})
 for _ in range(30):
  time.sleep(.5)
  a=eval_js("document.body?.innerText.includes('One bounded purchase.')")
  if a:break
 else:raise RuntimeError("Public hero absent")
 capture("10-public-proof-first-fold.png")
 eval_js("""document.querySelector('section[aria-label="Paid research results"]').scrollIntoView({block:'start'})""")
 time.sleep(.5);capture("11-public-proof-paid-results.png")
 count=eval_js("""(()=>{
  const p=document.querySelector('section[aria-label="Paid research results"]');
  const b=[...p.querySelectorAll('button')].find(x=>x.innerText.includes('Show all'));
  if(b)b.click();
  return Boolean(b);
 })()""")
 time.sleep(.5)
 links=eval_js("""document.querySelectorAll('section[aria-label="Paid research results"] a[href^="https://x.com/"]').length""")
 if not count or links!=18:raise RuntimeError("Public evidence did not expose all 18 real post links")
 capture("12-public-proof-all-18.png")
 command("Emulation.setDeviceMetricsOverride",{"width":390,"height":844,"deviceScaleFactor":1,"mobile":True})
 command("Page.navigate",{"url":BASE})
 time.sleep(2)
 mobile=eval_js("""(()=>{
  const d=document.documentElement;
  return {scrollWidth:d.scrollWidth,viewport:d.clientWidth,
    title:document.title, posts:document.querySelectorAll('section[aria-label="Paid research results"] ol > li').length};
 })()""")
 print("MOBILE_LAYOUT="+json.dumps(mobile))
 if mobile["scrollWidth"]>mobile["viewport"]+4:raise RuntimeError("Mobile horizontal overflow detected")
 capture("13-public-proof-mobile.png")
 print("ANON_PUBLIC_PROOF_BROWSER_PASSED postLinks="+str(links))
finally:
 if ws:ws.close()
 proc.terminate()
 try:proc.wait(timeout=8)
 except subprocess.TimeoutExpired:proc.kill()
 shutil.rmtree(profile,ignore_errors=True)
