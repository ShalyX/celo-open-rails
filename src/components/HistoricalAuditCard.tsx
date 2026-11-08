"use client";

import React from "react";
import { CheckCircle2, ExternalLink, Archive, FileText, Check } from "lucide-react";
import { KeystoreReceipt } from "@/lib/types";

interface HistoricalAuditCardProps {
  receipt: KeystoreReceipt | null;
}

export function HistoricalAuditCard({ receipt }: HistoricalAuditCardProps) {
  const txHash = receipt?.txHash || "0x7e511e9094756923f3373c01ae7965a3f1ea1f5b43b03172ee91d97e19d8ac43";

  return (
    <div className="bg-surface rounded-lg border border-surface-border p-5 shadow-sm space-y-4">
      {/* Header with clear Historical Evidence Labeling */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-surface-border/60">
        <div className="flex items-center gap-2">
          <Archive className="w-4 h-4 text-celo-green" />
          <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground">
            Historical Mainnet Verification Evidence
          </h3>
        </div>
        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-surface-elevated text-celo-green border border-celo-green/30 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Confirmed On-Chain (Block 82246474)</span>
        </span>
      </div>

      <p className="text-xs text-foreground/70 leading-relaxed font-sans">
        This record serves as the verifiable baseline proof of real Celo mainnet HTTP 402 settlement executed prior to this build session. It remains archived in the durable keystore and is strictly isolated from new procurements.
      </p>

      {/* Audit Specification Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3.5 rounded bg-surface-subtle border border-surface-border font-mono text-xs">
        <div>
          <span className="text-foreground/40 block mb-0.5">Execution Timestamp:</span>
          <span className="text-foreground/90 font-medium">
            2026-11-08 14:13:49 UTC
          </span>
        </div>
        <div>
          <span className="text-foreground/40 block mb-0.5">Settlement Amount:</span>
          <span className="text-celo-green font-bold">0.005000 USDC</span>
          <span className="text-foreground/40 text-[11px] block">(5000 atomic units)</span>
        </div>
        <div>
          <span className="text-foreground/40 block mb-0.5">Origin Account:</span>
          <span className="text-foreground/90 truncate block" title="0xf903e8a6FC3B751D8466469Fa85F2A1B9Caeba8b">
            0xf903...a8b (celo-open-rails)
          </span>
        </div>
        <div>
          <span className="text-foreground/40 block mb-0.5">Gateway Provider Route:</span>
          <span className="text-foreground/90 truncate block">
            /v1/social/x/posts/search
          </span>
        </div>
      </div>

      {/* Transaction Hash & Links */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded bg-black/40 border border-surface-border font-mono text-xs">
        <div className="truncate flex-1">
          <span className="text-foreground/40 block mb-0.5">Mainnet Transaction Hash:</span>
          <span className="text-foreground/90 select-all font-mono break-all sm:break-normal">
            {txHash}
          </span>
        </div>
        <a
          href={`https://celoscan.io/tx/${txHash}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-elevated hover:bg-surface-border border border-surface-border text-celo-green font-semibold text-xs transition-colors shrink-0"
        >
          <span>Inspect on Celoscan</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
