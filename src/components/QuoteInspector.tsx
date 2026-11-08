"use client";

import React, { useState } from "react";
import { DollarSign, ShieldAlert, Clock, ArrowUpRight, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { AuthoritativeQuote } from "@/lib/types";

interface QuoteInspectorProps {
  quote: AuthoritativeQuote;
}

export function QuoteInspector({ quote }: QuoteInspectorProps) {
  const [showRaw, setShowRaw] = useState(false);
  const offer = quote.selectedOffer;

  const isFree = offer.tokenSymbol === "FREE" || offer.atomicAmount === "0";

  return (
    <div className="bg-surface rounded-lg border border-surface-border p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-surface-border/60">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-celo-gold" />
          <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground">
            {isFree ? "Free SQD Capability — No Payment" : "Authoritative HTTP 402 Quote Challenge"}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-subtle text-foreground/60 border border-surface-border">
            {isFree ? "HTTP 200 Free Tier" : `HTTP 402 Challenge (v${quote.x402Version || 2})`}
          </span>
        </div>
      </div>

      {/* Main Quote Spec Ledger */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Exact Price Box */}
        <div className="p-3.5 rounded bg-surface-subtle border border-surface-border">
          <span className="text-[11px] font-mono text-foreground/50 uppercase tracking-wider block mb-1">
            Authoritative Price
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-mono font-bold text-celo-green">
              {isFree ? "0.00" : offer.humanAmount}
            </span>
            <span className="text-xs font-mono font-semibold text-foreground/70">
              {offer.tokenSymbol}
            </span>
          </div>
          <span className="text-[11px] font-mono text-foreground/50">
            {offer.atomicAmount} atomic units (6 dec)
          </span>
        </div>

        {/* Payment Asset Contract */}
        <div className="p-3.5 rounded bg-surface-subtle border border-surface-border">
          <span className="text-[11px] font-mono text-foreground/50 uppercase tracking-wider block mb-1">
            Token Contract (Celo)
          </span>
          <div className="font-mono text-xs text-foreground font-medium truncate" title={offer.assetContract}>
            {offer.assetContract}
          </div>
          <a
            href={`https://celoscan.io/address/${offer.assetContract}`}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-mono text-celo-green/80 hover:text-celo-green inline-flex items-center gap-1 mt-1"
          >
            <span>Celoscan Explorer</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>

        {/* Recipient Address (PayTo) */}
        <div className="p-3.5 rounded bg-surface-subtle border border-surface-border">
          <span className="text-[11px] font-mono text-foreground/50 uppercase tracking-wider block mb-1">
            Recipient (PayTo)
          </span>
          <div className="font-mono text-xs text-foreground font-medium truncate" title={offer.payTo}>
            {offer.payTo}
          </div>
          <span className="text-[11px] font-mono text-foreground/50 block mt-1">
            Buy API Gateway Relayer
          </span>
        </div>

        {/* Timeout & Expiry Window */}
        <div className="p-3.5 rounded bg-surface-subtle border border-surface-border">
          <span className="text-[11px] font-mono text-foreground/50 uppercase tracking-wider block mb-1">
            Challenge Validity
          </span>
          <div className="flex items-center gap-1.5 font-mono text-xs text-foreground font-medium">
            <Clock className="w-3.5 h-3.5 text-foreground/50" />
            <span>{offer.timeoutSeconds}s Max Timeout</span>
          </div>
          <span className="text-[11px] font-mono text-foreground/50 block mt-1">
            EIP-3009 nonce only if payment is signed
          </span>
        </div>

      </div>

      {/* Raw 402 Challenge Inspector Accordion */}
      <div className="border border-surface-border rounded overflow-hidden">
        <button
          type="button"
          onClick={() => setShowRaw(!showRaw)}
          className="w-full flex items-center justify-between px-3.5 py-2 bg-surface-subtle text-xs font-mono text-foreground/70 hover:text-foreground transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-foreground/50" />
            <span>Raw 402 Payment Challenge & Multi-Token Offers ({quote.accepts.length} options)</span>
          </div>
          {showRaw ? (
            <ChevronUp className="w-3.5 h-3.5 text-foreground/50" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-foreground/50" />
          )}
        </button>

        {showRaw && (
          <div className="p-3.5 bg-black/40 border-t border-surface-border space-y-3">
            {quote.rawHeaderBase64 && (
              <div>
                <span className="text-[11px] font-mono text-foreground/50 uppercase block mb-1">
                  payment-required Header (Base64 x402)
                </span>
                <pre className="text-[11px] font-mono text-foreground/70 break-all p-2 rounded bg-surface-subtle">
                  {quote.rawHeaderBase64}
                </pre>
              </div>
            )}
            <div>
              <span className="text-[11px] font-mono text-foreground/50 uppercase block mb-1">
                Parsed Accepts Specification
              </span>
              <pre className="text-xs font-mono text-foreground/80 overflow-x-auto whitespace-pre-wrap p-2 rounded bg-surface-subtle">
                {JSON.stringify(quote.accepts, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
