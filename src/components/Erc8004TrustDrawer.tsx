"use client";

import React, { useState } from "react";
import { ShieldCheck, ChevronDown, ChevronUp, ExternalLink, Key, Check } from "lucide-react";
import { Erc8004AgentVerification } from "@/lib/types";

interface Erc8004TrustDrawerProps {
  trustInfo: Erc8004AgentVerification | null;
}

export function Erc8004TrustDrawer({ trustInfo }: Erc8004TrustDrawerProps) {
  const [open, setOpen] = useState(false);

  if (!trustInfo) return null;

  return (
    <div className="bg-surface rounded-lg border border-surface-border p-4 shadow-sm">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-celo-green" />
          <div>
            <h4 className="text-xs font-mono font-semibold text-foreground uppercase tracking-wider">
              ERC-8004 Agent Identity & Trust Registry
            </h4>
            <p className="text-[11px] text-foreground/60 font-sans">
              Cryptographic verification binding gateway providers to Celo mainnet agent IDs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-celo-green/10 text-celo-green border border-celo-green/20">
            {trustInfo.verified ? "VERIFIED ON-CHAIN" : "UNVERIFIED"}
          </span>
          {open ? (
            <ChevronUp className="w-4 h-4 text-foreground/40" />
          ) : (
            <ChevronDown className="w-4 h-4 text-foreground/40" />
          )}
        </div>
      </div>

      {open && (
        <div className="mt-4 pt-3 border-t border-surface-border/60 space-y-3 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded bg-surface-subtle border border-surface-border">
            <div>
              <span className="text-foreground/40 block mb-0.5">Agent Registry (Celo 42220):</span>
              <a
                href={`https://celoscan.io/address/${trustInfo.registryAddress}`}
                target="_blank"
                rel="noreferrer"
                className="text-celo-green hover:underline inline-flex items-center gap-1 select-all"
              >
                <span>{trustInfo.registryAddress}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div>
              <span className="text-foreground/40 block mb-0.5">Provider Agent ID:</span>
              <span className="text-foreground font-semibold">
                ID #{trustInfo.agentId} ({trustInfo.provider})
              </span>
            </div>
            <div>
              <span className="text-foreground/40 block mb-0.5">Registration Metadata URI:</span>
              <a
                href={trustInfo.registrationUrl}
                target="_blank"
                rel="noreferrer"
                className="text-celo-green/80 hover:text-celo-green inline-flex items-center gap-1 truncate block"
              >
                <span>{trustInfo.registrationUrl}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div>
              <span className="text-foreground/40 block mb-0.5">Verification Notes:</span>
              <span className="text-foreground/80 font-sans text-[11px] block">
                {trustInfo.verificationNotes}
              </span>
            </div>
          </div>

          {Boolean(trustInfo.registrationDocument) && (
            <div>
              <span className="text-[10px] text-foreground/40 uppercase block mb-1">
                EIP-8004 Registration Specification
              </span>
              <pre className="p-3 rounded bg-black/40 border border-surface-border text-[11px] text-foreground/80 max-h-48 overflow-y-auto whitespace-pre-wrap">
                {JSON.stringify(trustInfo.registrationDocument, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
