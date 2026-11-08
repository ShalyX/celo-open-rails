"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  ShieldAlert,
  Layers,
  Database,
  Code,
  FileCheck,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { ProcurementRecord } from "@/lib/types";

interface ExecutionMonitorProps {
  record: ProcurementRecord;
}

export function ExecutionMonitor({ record }: ExecutionMonitorProps) {
  const [copied, setCopied] = useState(false);
  const exec = record.execution;

  const handleCopyResult = () => {
    if (!exec?.resultData) return;
    navigator.clipboard.writeText(JSON.stringify(exec.resultData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { name: "Task Ingested", completed: true },
    { name: "Intent Analyzed", completed: Boolean(record.intent) },
    { name: "402 Quoted", completed: Boolean(record.quote) },
    { name: "Approved", completed: Boolean(record.approval) },
    {
      name: exec?.status === "halted_by_policy" ? "Halted by Policy" : "Execution",
      completed: Boolean(exec),
      isHalted: exec?.status === "halted_by_policy",
    },
    {
      name: "Result Delivered",
      completed: exec?.status === "delivered",
    },
  ];

  return (
    <div className="bg-surface rounded-lg border border-surface-border p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-surface-border/60">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-celo-green" />
          <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground">
            Pipeline Execution Status & Result Delivery
          </h3>
        </div>
        <div className="font-mono text-xs">
          <span className="text-foreground/50">ID: </span>
          <span className="text-foreground/80">{record.id}</span>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {steps.map((step, idx) => (
          <div
            key={step.name}
            className={`p-2.5 rounded border text-xs font-mono transition-all ${
              step.completed
                ? step.isHalted
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  : "bg-celo-green/10 border-celo-green/30 text-celo-green"
                : "bg-surface-subtle border-surface-border/60 text-foreground/40"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-foreground/40">0{idx + 1}</span>
              {step.completed ? (
                step.isHalted ? (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-celo-green" />
                )
              ) : (
                <Clock className="w-3.5 h-3.5 text-foreground/30" />
              )}
            </div>
            <div className="font-semibold truncate">{step.name}</div>
          </div>
        ))}
      </div>

      {/* Honest Policy Halt Output Card */}
      {exec?.status === "halted_by_policy" && (
        <div className="p-4 rounded bg-amber-500/5 border border-amber-500/30 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-semibold">
            <ShieldAlert className="w-4 h-4" />
            <span>Honest Policy Gate Halt (Zero Spend Compliance)</span>
          </div>

          <p className="text-xs text-foreground/80 leading-relaxed font-sans">
            {exec.policyHaltReason}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded bg-black/40 border border-surface-border font-mono text-xs">
            <div>
              <span className="text-foreground/40 block mb-0.5">Idempotency Key:</span>
              <span className="text-foreground/90 select-all">{exec.idempotencyKey}</span>
            </div>
            <div>
              <span className="text-foreground/40 block mb-0.5">Prepared Settlement Amount:</span>
              <span className="text-celo-gold">
                {exec.settlementDetails?.amount} atomic units ({record.quote?.selectedOffer.humanAmount} USDC)
              </span>
            </div>
            <div>
              <span className="text-foreground/40 block mb-0.5">Target PayTo Recipient:</span>
              <span className="text-foreground/80 truncate block select-all">
                {exec.settlementDetails?.payTo}
              </span>
            </div>
            <div>
              <span className="text-foreground/40 block mb-0.5">Wallet Spend Recorded:</span>
              <span className="text-celo-green font-semibold">$0.00 (No payment dispatched by this task)</span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-foreground/50">
            Note: No wallet transaction or EIP-3009 authorization was created. Historical payment evidence is displayed separately.
          </div>
        </div>
      )}

      {/* Delivered Real Output (e.g. SQD Live Multi-Chain Stream) */}
      {exec?.status === "delivered" && Boolean(exec.resultData) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-celo-green font-semibold">
              <Database className="w-3.5 h-3.5" />
              <span>Delivered Real Response Payload (Live Output)</span>
            </div>
            <button
              type="button"
              onClick={handleCopyResult}
              className="flex items-center gap-1 text-[11px] font-mono text-foreground/60 hover:text-foreground transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-celo-green" />
                  <span className="text-celo-green">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3.5 rounded bg-black/50 border border-surface-border max-h-80 overflow-y-auto">
            <pre className="text-xs font-mono text-foreground/90 whitespace-pre-wrap">
              {JSON.stringify(exec.resultData, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Error Boundary View */}
      {exec?.status === "failed" && (
        <div className="p-4 rounded bg-red-500/10 border border-red-500/30 text-xs text-red-400 space-y-1 font-mono">
          <div className="flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4" />
            <span>Execution Failure</span>
          </div>
          <p className="text-foreground/80 font-sans">{exec.errorMessage}</p>
        </div>
      )}
    </div>
  );
}
