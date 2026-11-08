"use client";

import React, { useState } from "react";
import { ShieldCheck, AlertTriangle, ArrowRight, X, Lock } from "lucide-react";
import { ProcurementRecord, WalletBalances } from "@/lib/types";

interface ApprovalBarrierProps {
  record: ProcurementRecord;
  balances: WalletBalances | null;
  onApprove: (recordId: string, maxSpend: string, token: string) => void;
  onCancel: () => void;
  isProcessing: boolean;
}

export function ApprovalBarrier({
  record,
  balances,
  onApprove,
  onCancel,
  isProcessing,
}: ApprovalBarrierProps) {
  const quote = record.quote;
  const defaultSpend = quote?.selectedOffer.humanAmount || "0.005000";
  const [maxSpend, setMaxSpend] = useState(defaultSpend);
  const [selectedToken, setSelectedToken] = useState(quote?.selectedOffer.tokenSymbol || "USDC");

  const isFree = quote?.selectedOffer.tokenSymbol === "FREE" || quote?.selectedOffer.atomicAmount === "0";

  const handleConfirm = () => {
    onApprove(record.id, maxSpend, selectedToken);
  };

  return (
    <div className="bg-surface rounded-lg border-2 border-celo-green/40 p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-celo-green" />
          <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground">
            Operator Approval & Budget Governance Barrier
          </h3>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-celo-green/10 text-celo-green border border-celo-green/30">
          Action Required: Human Authorization
        </span>
      </div>

      <p className="text-xs text-foreground/80 leading-relaxed font-sans">
        Review the procurement specifications below. No network request with payment authorization will be dispatched without explicit confirmation.
      </p>

      {/* Summary Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded bg-surface-subtle border border-surface-border text-xs font-mono">
        <div>
          <span className="text-foreground/50 block mb-0.5">Capability:</span>
          <span className="font-semibold text-foreground">{record.capabilityId}</span>
        </div>
        <div>
          <span className="text-foreground/50 block mb-0.5">Target Route:</span>
          <span className="text-foreground/80 truncate block">{record.intent.requestEnvelope.url}</span>
        </div>
        <div>
          <span className="text-foreground/50 block mb-0.5">Live Wallet Balance:</span>
          <span className="text-celo-green font-semibold">
            {balances ? `${balances.usdcBalance} USDC` : "Loading..."}
          </span>
        </div>
      </div>

      {/* Authorization Parameter Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-mono text-foreground/60 mb-1 block uppercase tracking-wider">
            Maximum Authorized Spend Cap
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={maxSpend}
              onChange={(e) => setMaxSpend(e.target.value)}
              disabled={isFree}
              className="w-full rounded bg-surface-subtle border border-surface-border px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:border-celo-green disabled:opacity-50"
            />
            <span className="text-xs font-mono text-foreground/60">{selectedToken}</span>
          </div>
          <span className="text-[11px] font-mono text-foreground/40 mt-1 block">
            Spend limit enforced against authoritative 402 challenge.
          </span>
        </div>

        <div>
          <label className="text-xs font-mono text-foreground/60 mb-1 block uppercase tracking-wider">
            Settlement Asset
          </label>
          <select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            disabled={isFree}
            className="w-full rounded bg-surface-subtle border border-surface-border px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:border-celo-green disabled:opacity-50"
          >
            <option value="USDC">USDC (Native Celo - 0xcebA...118C)</option>
            <option value="USDT">USDT (Tether USD - 0x4806...3D5e)</option>
            <option value="USAT">USAT (Tether America - 0xD2ab...F771)</option>
          </select>
          <span className="text-[11px] font-mono text-foreground/40 mt-1 block">
            Selected asset contract on Celo Mainnet.
          </span>
        </div>
      </div>

      {/* Policy Guard Disclosure Banner */}
      <div className="flex items-start gap-2.5 p-3 rounded bg-amber-500/10 border border-amber-500/20 text-xs">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-amber-300/90 font-mono text-[11px]">
          <span className="font-semibold block text-amber-300">
            Hackathon Zero-Spend Safety Notice:
          </span>
          <p>
            {isFree
              ? "This capability is part of the free decentralized SQD tier and will execute live without spending funds."
              : "Spend Guard is ACTIVE. Approval records your selected cap and token, but execution halts before any payment authorization is signed, submitted, or debited."}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded border border-surface-border text-foreground/60 hover:text-foreground text-xs font-mono hover:bg-surface-elevated transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          <span>Cancel</span>
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={isProcessing}
          className="flex items-center gap-2 px-5 py-2 rounded bg-celo-green text-surface font-semibold text-xs hover:bg-celo-greenDark transition-colors shadow"
        >
          {isProcessing ? (
            <span>Processing Authorization...</span>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Authorize & Execute Procurement</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
