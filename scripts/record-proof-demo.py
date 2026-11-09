"""Produce a truthful screen-captured, captioned read-only browser demo.
Every frame is a screenshot of the actual locally rendered /proof page.
No payments, account mutations, model simulation, or fabricated UI states.
Audio: none. Voiceover can be added after human review.
"""
import base64, io, json, os, shutil, subprocess, tempfile, time
from pathlib import Path
from urllib.request import urlopen
from PIL import Image, ImageDraw, ImageFont
import websocket

URL=os.getenv("DEMO_URL","http://127.0.0.1:4388/proof")
W,H,FPS=1440,810,12
PORT=9348
ROOT=Path.cwd()
OUT=ROOT/"docs"/"evidence"/"celo-paid-proof-walkthrough.mp4"
OUT.parent.mkdir(parents=True,exist_ok=True)
exe=shutil.which("ffmpeg")
if not exe:raise RuntimeError("ffmpeg not installed")
profile=tempfile.mkdtemp(prefix="celo-true-demo-")
chrome=subprocess.Popen([
 r"C:\Program Files\Google\Chrome\Application\chrome.exe",
 "--headless=new","--disable-gpu","--no-first-run","--remote-allow-origins=*",
 f"--remote-debugging-port={PORT}",f"--user-data-dir={profile}",
 f"--window-size={W},{H}","about:blank"
],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
ws=None; encoder=None; sequence=0
def call(method,params=None):
 global sequence
 sequence+=1
 cid=sequence
 ws.send(json.dumps({"id":cid,"method":method,"params":params or {}}))
 while True:
  frame=json.loads(ws.recv())
  if frame.get("id")==cid:
   if "error" in frame:raise RuntimeError(str(frame["error"]))
   return frame.get("result",{})
def evaluate(src):
 res=call("Runtime.evaluate",{"expression":src,"returnByValue":True,"awaitPromise":True})
 if res.get("exceptionDetails"):raise RuntimeError(str(res["exceptionDetails"]))
 return res.get("result",{}).get("value")
def scrollTo(y):
 evaluate(f"window.scrollTo({{top:{int(y)},behavior:'instant'}})")
def getY(query):
 q=json.dumps(query)
 return evaluate(f"(()=>{{let el=document.querySelector({q});return el?el.getBoundingClientRect().top+scrollY:0}})()")
def screenshot():
 image=base64.b64decode(call("Page.captureScreenshot",{"format":"png","captureBeyondViewport":False})["data"])
 return Image.open(io.BytesIO(image)).convert("RGB").resize((W,H))
def font(name,size):
 for f in [name,r"C:\Windows\Fonts\segoeui.ttf"]:
  try:return ImageFont.truetype(f,size)
  except OSError:pass
 return ImageFont.load_default()
headingFont=font(r"C:\Windows\Fonts\seguisb.ttf",27)
subtitleFont=font(r"C:\Windows\Fonts\segoeui.ttf",19)
smallFont=font(r"C:\Windows\Fonts\consola.ttf",14)
def annotate(frame,scene,subtitle,step):
 base=frame.convert("RGBA")
 overlay=Image.new("RGBA",(W,H),(0,0,0,0))
 draw=ImageDraw.Draw(overlay)
 draw.rectangle((0,H-122,W,H),fill=(8,14,21,245))
 draw.rectangle((70,H-98,76,H-30),fill=(38,205,139,255))
 draw.text((100,H-104),scene,font=headingFont,fill=(244,248,249,255))
 draw.text((100,H-62),subtitle,font=subtitleFont,fill=(182,194,198,255))
 draw.rounded_rectangle((W-230,22,W-68,57),radius=8,fill=(4,15,19,218),outline=(38,166,114,160),width=1)
 draw.text((W-215,31),f"RECORDING  {step}/6",font=smallFont,fill=(159,230,197,255))
 return Image.alpha_composite(base,overlay).convert("RGB")
try:
 page=None
 for _ in range(50):
  try:
   tabs=json.load(urlopen(f"http://127.0.0.1:{PORT}/json/list",timeout=1))
   page=next((tab for tab in tabs if tab.get("type")=="page"),None)
   if page:break
  except Exception:pass
  time.sleep(.2)
 if not page:raise RuntimeError("Chrome CDP page not available")
 ws=websocket.create_connection(page["webSocketDebuggerUrl"],timeout=30,origin="http://localhost")
 call("Page.enable");call("Runtime.enable")
 call("Emulation.setDeviceMetricsOverride",{"width":W,"height":H,"deviceScaleFactor":1,"mobile":False})
 call("Page.navigate",{"url":URL})
 time.sleep(2)
 if not evaluate("document.body?.innerText.includes('One bounded purchase.')"):
  raise RuntimeError("Proof page not ready or not truthful")
 stepsY=getY('section[aria-label="Verified procurement workflow"]')
 postsY=getY('section[aria-label="Paid research results"]')
 start=0
 def revealAll():
  return evaluate("""(()=>{
    const p=document.querySelector('section[aria-label="Paid research results"]');
    const b=p && Array.from(p.querySelectorAll('button')).find(x=>x.innerText.includes('Show all'));
    if (b)b.click();
    return Boolean(b);
   })()""")
 scenes=[
  (7,"ONE RESEARCH TASK. ONE AUTHORIZED PURCHASE.","0.005 USDC bought 18 genuine X records with a confirmed receipt.",lambda:0),
  (7,"ONE EXACT PRICE. ONE OPERATOR APPROVAL.","A real HTTP 402 quote and capped, one-shot Buy execution.",lambda:max(0,stepsY-105)),
  (9,"PAID RESULTS, NOT MOCK DATA.","MiniPay research returned real posts with individual source links.",lambda:max(0,postsY-90)),
  (9,"INSPECT ALL 18 ORIGINAL POSTS.","Actual timestamps, reported metrics and links to each source.",lambda:max(0,postsY+550)),
  (8,"VERIFIABLE PAYMENT AND AGENT IDENTITY.","Celo USDC transfer plus registered ERC-8004 agent #10059.",lambda:max(0,evaluate("document.documentElement.scrollHeight")-H-40)),
  (8,"THE NEXT PURCHASE IS DISABLED.","This recorded evidence triggers no new spending or wallet action.",lambda:0)
 ]
 encoder=subprocess.Popen([
  exe,"-hide_banner","-loglevel","error","-y",
  "-f","rawvideo","-pixel_format","rgb24","-video_size",f"{W}x{H}",
  "-framerate",str(FPS),"-i","pipe:0",
  "-an","-c:v","libx264","-preset","veryfast","-crf","21",
  "-pix_fmt","yuv420p","-movflags","+faststart",str(OUT)
 ],stdin=subprocess.PIPE,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
 frameCount=0
 for index,(secs,title,desc,targetFn) in enumerate(scenes,1):
  if index==4:
   if not revealAll():raise RuntimeError("Show all 18 button not found")
   count=evaluate("document.querySelectorAll('section[aria-label=\"Paid research results\"] a[href^=\"https://x.com/\"]').length")
   if count!=18:raise RuntimeError("Expected 18 source hyperlinks after expansion, found "+str(count))
  previousY=start
  dest=targetFn()
  count=secs*FPS
  for number in range(count):
   t=min(1,number/max(1,int(FPS*3)))
   eased=1-(1-t)**3
   y=round(previousY+(dest-previousY)*eased)
   scrollTo(y)
   shot=annotate(screenshot(),title,desc,index)
   encoder.stdin.write(shot.tobytes())
   frameCount+=1
  start=dest
  print("CAPTURED_SCENE",index,secs,"seconds",title,flush=True)
 encoder.stdin.close()
 code=encoder.wait(timeout=180)
 if code:
  raise RuntimeError("ffmpeg exited "+str(code)+": "+encoder.stderr.read().decode(errors="replace")[-1800:])
 if not OUT.is_file() or OUT.stat().st_size<100000:
  raise RuntimeError("Video output absent or unexpectedly small")
 print("READ_ONLY_DEMO_VIDEO_OK",json.dumps({"seconds":round(frameCount/FPS,1),"frames":frameCount,"video":str(OUT),"sizeBytes":OUT.stat().st_size,"audio":"none","newPurchases":0}),flush=True)
finally:
 if ws:ws.close()
 if encoder and encoder.poll() is None:
  encoder.kill()
 chrome.terminate()
 try:chrome.wait(timeout=6)
 except subprocess.TimeoutExpired:chrome.kill()
 shutil.rmtree(profile,ignore_errors=True)
