"use client";

import React, { useState } from "react";
import { Shield, ArrowRight, LockKeyhole } from "lucide-react";

export function OperatorLogin({ onLogin }: { onLogin: () => void }) {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setWorking(true);
    try {
      const response = await fetch("/api/operator", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) throw new Error("Access denied. Check the local operator token.");
      setToken("");
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally { setWorking(false); }
  }

  return (
    <main className="min-h-screen bg-background text-foreground grid place-items-center p-6">
      <div className="w-full max-w-md border border-surface-border bg-surface rounded-xl p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg p-3 bg-celo-green/10 text-celo-green"><Shield className="h-6 w-6" /></div>
          <div><p className="font-mono text-xs uppercase tracking-[.2em] text-celo-green">Celo / Buy</p>
            <h1 className="text-2xl font-semibold tracking-tight">Procurement Desk</h1></div>
        </div>
        <p className="text-sm text-foreground/70">Operator-only access. Sign in with the local token in <code>.env.local</code>. Payments remain disabled.</p>
        <form className="space-y-4" onSubmit={signIn}>
          <label className="block text-xs uppercase tracking-widest font-mono text-foreground/60" htmlFor="operator-key">Operator access token</label>
          <input id="operator-key" type="password" value={token} onChange={(e) => setToken(e.target.value)}
            autoComplete="off" required minLength={24} placeholder="Paste operator token"
            className="w-full bg-surface-subtle border border-surface-border rounded-lg p-3 text-sm outline-none focus:border-celo-green" />
          {error && <p role="alert" className="text-red-400 text-xs">{error}</p>}
          <button disabled={working || token.length < 24} className="w-full p-3 rounded-lg bg-celo-green text-surface font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            <LockKeyhole className="h-4 w-4" /> {working ? "Verifying" : "Enter operator desk"} <ArrowRight className="h-4 w-4" />
          </button>
        </form>
        <p className="text-xs text-foreground/50">Local development only · Explicit authorization for all actions · No wallet signing</p>
      </div>
    </main>
  );
}
