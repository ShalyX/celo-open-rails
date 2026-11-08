"""Capture real local operator-authenticated UI through isolated headless Chrome.
Requires Python websocket-client and environment SMOKE_BASE / SMOKE_AUTH_TOKEN.
No payments, no public deployment, no network navigation except the local app.
"""
from pathlib import Path
from urllib.request import urlopen
import base64
import json
import os
import shutil
import subprocess
import tempfile
import time
import websocket

APP = os.environ.get("SMOKE_BASE", "http://127.0.0.1:4381")
TOKEN = os.environ.get("SMOKE_AUTH_TOKEN")
if not TOKEN or len(TOKEN) < 24:
    raise SystemExit("Provide a TEST-ONLY SMOKE_AUTH_TOKEN")

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9339
OUT = Path.cwd() / "docs" / "evidence"
OUT.mkdir(parents=True, exist_ok=True)
profile = tempfile.mkdtemp(prefix="celo-browser-proof-")
proc = subprocess.Popen([
    CHROME, "--headless=new", "--disable-gpu", "--no-first-run",
    "--no-default-browser-check", "--remote-allow-origins=*",
    f"--remote-debugging-port={PORT}", f"--user-data-dir={profile}",
    "--window-size=1536,1050", "about:blank"
], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
sock = None
seq = 0

def command(method, params=None):
    global seq
    seq += 1
    request_id = seq
    sock.send(json.dumps({"id":request_id,"method":method,"params":params or {}}))
    while True:
        reply = json.loads(sock.recv())
        if reply.get("id") == request_id:
            if "error" in reply:
                raise RuntimeError(f"{method}: {reply['error']}")
            return reply.get("result", {})

def evaluate(script):
    result = command("Runtime.evaluate", {
        "expression": script, "returnByValue": True, "awaitPromise": True
    })
    if result.get("exceptionDetails"):
        raise RuntimeError(str(result["exceptionDetails"]))
    return result.get("result", {}).get("value")

def screenshot(filename):
    payload = command("Page.captureScreenshot", {
        "format":"png", "captureBeyondViewport":False, "fromSurface":True
    })
    image = base64.b64decode(payload["data"])
    target = OUT / filename
    target.write_bytes(image)
    print(f"SCREENSHOT={target} SIZE={len(image)}")

try:
    page = None
    for _ in range(50):
        try:
            entries = json.load(urlopen(f"http://127.0.0.1:{PORT}/json/list", timeout=1))
            page = next((t for t in entries if t.get("type") == "page"), None)
            if page:
                break
        except Exception:
            pass
        time.sleep(0.2)
    if not page:
        raise RuntimeError("Chrome debugging page did not start")
    sock = websocket.create_connection(page["webSocketDebuggerUrl"], timeout=20, origin="http://localhost")
    command("Page.enable")
    command("Runtime.enable")
    command("Emulation.setDeviceMetricsOverride", {
        "width":1536, "height":1050, "deviceScaleFactor":1, "mobile":False
    })
    command("Page.navigate", {"url":APP})
    time.sleep(3)
    print("START_TITLE=", evaluate("document.title"))
    result = evaluate("""(async () => {
      const response = await fetch('/api/operator', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({token: TOKEN_VALUE})
      });
      return {status: response.status, body: await response.text()};
    })()""".replace("TOKEN_VALUE",json.dumps(TOKEN)))
    print("LOGIN_STATUS=", result.get("status"))
    if result.get("status") != 200:
        raise RuntimeError("Local operator login failed")
    command("Page.reload", {"ignoreCache":True})
    # Catalog is fetched asynchronously; wait until the real count is visible.
    text = ""
    for _ in range(25):
        time.sleep(1)
        text = evaluate("document.body.innerText.slice(0,2200)")
        if "Live Gateway Capabilities" in text and "Loading gateway catalog..." not in text:
            break
    else:
        print("CATALOG_NOTE=not ready before capture")
    # Live Celo RPC and provider trust can finish after catalog discovery.
    for _ in range(30):
        text = evaluate("document.body.innerText.slice(0,2200)")
        if "2.0000 CELO" in text and "0.062383 USDC" in text and "Provider ERC-8004: VERIFIED" in text:
            break
        time.sleep(1)
    else:
        print("LIVE_RPC_NOTE=Some live data still pending; preserving truthful UI status")

    print("BODY_SAMPLE=", str(text).replace("\n"," | ")[:700])
    if "Unlock procurement desk" in text or "Operator access" in text and "Task" not in text:
        raise RuntimeError("Logged-in product workspace did not render")
    command("Runtime.evaluate", {"expression":"window.scrollTo(0,0)"})
    time.sleep(0.5)
    screenshot("01-dashboard-authenticated.png")
    command("Runtime.evaluate", {"expression":"window.scrollTo(0,930)"})
    time.sleep(0.5)
    screenshot("02-workflow-and-history.png")
    command("Runtime.evaluate", {"expression":"window.scrollTo(0,1950)"})
    time.sleep(0.5)
    screenshot("03-history-and-trust.png")
finally:
    if sock:
        sock.close()
    proc.terminate()
    try: proc.wait(timeout=8)
    except subprocess.TimeoutExpired: proc.kill()
    shutil.rmtree(profile, ignore_errors=True)
