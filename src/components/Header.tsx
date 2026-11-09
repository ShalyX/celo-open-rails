"use client";

import React from "react";
import { ShieldCheck, Wallet, ExternalLink, RefreshCw, AlertCircle } from "lucide-react";
import { BrandMark } from "./BrandMark";
import { WalletBalances, Erc8004AgentVerification } from "@/lib/types";

interface HeaderProps {
  balances: WalletBalances | null;
  trustInfo: Erc8004AgentVerification | null;
  onRefresh: () => void;
  isLoading: boolean;
}

export function Header({ balances, trustInfo, onRefresh, isLoading }: HeaderProps) {
  return (
    <header className="border-b border-surface-border bg-surface/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          
          {/* Logo & Network Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-surface-elevated border border-surface-border flex items-center justify-center text-celo-green">
              <BrandMark className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold tracking-wider text-foreground">
                  CELO PROCUREMENT DESK
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-celo-green/10 text-celo-green border border-celo-green/20 font-mono">
                  Mainnet 42220
                </span>
              </div>
              <p className="text-xs text-foreground/60">
                Discover services · approve spend · inspect verified outcomes
              </p>
            </div>
          </div>

          {/* Operator Account & Dynamic Balances */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Policy Guard Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-mono">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>SPEND GUARD: ACTIVE</span>
            </div>

            {/* ERC-8004 Trust Badge */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono transition-colors ${
                trustInfo?.verified
                  ? "bg-celo-green/10 border-celo-green/30 text-celo-green"
                  : "bg-surface-elevated border-surface-border text-foreground/70"
              }`}
              title={trustInfo?.verificationNotes || "Checking ERC-8004 agent registry..."}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Provider ERC-8004: {trustInfo?.verified ? "VERIFIED" : "UNVERIFIED"}</span>
            </div>

            {/* Dynamic Wallet Balances */}
            <div className="flex items-center gap-3 px-3 py-1 rounded bg-surface-elevated border border-surface-border">
              <Wallet className="w-3.5 h-3.5 text-foreground/50" />
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-foreground/60">{balances?.account || "celo-open-rails"}:</span>
                <span className="text-celo-gold font-medium">
                  {balances ? `${balances.celoBalance} CELO` : "..."}
                </span>
                <span className="text-foreground/30">|</span>
                <span className="text-celo-green font-medium">
                  {balances ? `${balances.usdcBalance} USDC` : "..."}
                </span>
              </div>
              <button
                onClick={onRefresh}
                disabled={isLoading}
                title="Refresh balances from Celo RPC"
                className="text-foreground/40 hover:text-foreground transition-colors ml-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-celo-green" : ""}`} />
              </button>
            </div>

            {/* Explorer Link */}
            {balances && (
              <a
                href={`https://celoscan.io/address/${balances.address}`}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded hover:bg-surface-elevated text-foreground/40 hover:text-foreground transition-colors"
                title={`View account ${balances.address} on Celoscan`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
