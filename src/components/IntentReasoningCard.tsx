"use client";

import React, { useState } from "react";
import { Brain, Code, CheckCircle, ChevronDown, ChevronUp, Bot, Compass } from "lucide-react";
import { IntentAnalysisResult } from "@/lib/types";

interface IntentReasoningCardProps {
  intent: IntentAnalysisResult;
}

export function IntentReasoningCard({ intent }: IntentReasoningCardProps) {
  const [showPayload, setShowPayload] = useState(false);

  return (
    <div className="bg-surface rounded-lg border border-surface-border p-5 shadow-sm space-y-4">
      {/* Header & Engine Identification */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-surface-border/60">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-celo-green" />
          <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground">
            Procurement Intent Analysis
          </h3>
        </div>

        {/* Mandatory Transparency Badge: AI Model vs Deterministic Fallback */}
        <div className="flex items-center gap-2">
          {intent.isAiReasoning ? (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-celo-green/10 border border-celo-green/30 text-celo-green font-mono text-xs">
              <Bot className="w-3.5 h-3.5" />
              <span>AI Autonomy: {intent.engineModel}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs">
              <Brain className="w-3.5 h-3.5" />
              <span>Deterministic Fallback (AI Unverified)</span>
            </div>
          )}
          <span className="text-xs font-mono text-foreground/40">
            Confidence: {(intent.confidenceScore * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Selected Capability & Rationale */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Capability Target Box */}
        <div className="p-3.5 rounded bg-surface-subtle border border-surface-border space-y-1.5">
          <span className="text-[11px] font-mono text-foreground/50 uppercase tracking-wider block">
            Selected Capability
          </span>
          <div className="flex items-center gap-2 font-mono text-sm font-semibold text-foreground">
            <CheckCircle className="w-4 h-4 text-celo-green shrink-0" />
            <span className="truncate">{intent.selectedCapabilityId}</span>
          </div>
          <div className="text-xs font-mono text-foreground/60 break-all">
            {intent.requestEnvelope.method} {intent.requestEnvelope.url}
          </div>
        </div>

        {/* Reasoning Rationale */}
        <div className="md:col-span-2 p-3.5 rounded bg-surface-subtle border border-surface-border space-y-1.5">
          <span className="text-[11px] font-mono text-foreground/50 uppercase tracking-wider block">
            Selection Rationale & Strategy
          </span>
          <p className="text-xs text-foreground/80 leading-relaxed font-sans">
            {intent.reasoning}
          </p>
          <div className="text-[11px] font-mono text-foreground/50 pt-1">
            Engine: {intent.engineModel}
          </div>
        </div>

      </div>

      {/* Request Envelope Toggle & Inspector */}
      <div className="border border-surface-border rounded overflow-hidden">
        <button
          type="button"
          onClick={() => setShowPayload(!showPayload)}
          className="w-full flex items-center justify-between px-3.5 py-2 bg-surface-subtle text-xs font-mono text-foreground/70 hover:text-foreground transition-colors"
        >
          <div className="flex items-center gap-2">
            <Code className="w-3.5 h-3.5 text-foreground/50" />
            <span>Target Request Envelope Payload ({intent.requestEnvelope.method})</span>
          </div>
          {showPayload ? (
            <ChevronUp className="w-3.5 h-3.5 text-foreground/50" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-foreground/50" />
          )}
        </button>

        {showPayload && (
          <div className="p-3.5 bg-black/40 border-t border-surface-border">
            <pre className="text-xs font-mono text-foreground/80 overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(intent.requestEnvelope.body, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
