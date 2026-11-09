# Read-only public judge proof
This folder is a static evidence-only web root for Vercel. It has no API routes,
no wallet client, no operator authentication, no private runtime environment,
and no capability to send transactions. Content is deterministically extracted
from the real paid task snapshot in docs/evidence/paid-task-20261109.json.
Regenerate with python scripts/generate-static-proof.py. Do NOT put secrets here.
