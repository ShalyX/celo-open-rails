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
  RefreshCw,
} from "lucide-react";
import { ProcurementRecord } from "@/lib/types";
import { digestProviderResponse } from "@/lib/resultDigest";
import { extractXSearchResults } from "@/lib/xResearch";
import { PaidXResearch } from "./PaidXResearch";

interface ExecutionMonitorProps {
  record: ProcurementRecord;
  onReconcile?: (recordId: string) => Promise<void>;
  isReconciling?: boolean;
}

export function ExecutionMonitor({ record, onReconcile, isReconciling = false }: ExecutionMonitorProps) {
  const [copied, setCopied] = useState(false);
  const exec = record.execution;
  const digest = exec?.status === "delivered" && exec.resultData
    ? digestProviderResponse(exec.resultData) : null;
  const xResearch = exec?.status === "delivered" && exec.resultData
    ? extractXSearchResults(exec.resultData) : null;

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

      {/* Read-only recovery: never signs, quotes, retries or pays. */}
      {(exec?.status === "settle_uncertain" || exec?.status === "executing") && (
        <section className="p-4 rounded-lg border border-amber-500/40 bg-amber-500/5 space-y-3" aria-label="Uncertain settlement">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold">
            <ShieldAlert className="w-4 h-4" aria-hidden="true" />
            Settlement not fully resolved — do not retry purchase
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">
            The previous payment may already have settled. Reconciliation checks existing local receipts
            and Celo chain records only. It never starts another service purchase.
          </p>
          {exec.errorMessage && <p className="text-xs text-foreground/65">{exec.errorMessage}</p>}
          {exec.reconciliation && (
            <p className="rounded border border-surface-border p-3 text-xs text-foreground/75">
              Checked {new Date(exec.reconciliation.checkedAt).toLocaleString()}: {exec.reconciliation.note}
            </p>
          )}
          {exec.settlementDetails?.txHash && (
            <a href={`https://celoscan.io/tx/${exec.settlementDetails.txHash}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-block text-xs underline text-celo-green">Inspect recorded Celo transfer</a>
          )}
          {onReconcile && (
            <button type="button" disabled={isReconciling} onClick={() => void onReconcile(record.id)}
              className="flex items-center gap-2 rounded-md px-4 py-2 border border-amber-500/40 text-sm text-amber-300 hover:bg-amber-500/10 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400">
              <RefreshCw className={`w-4 h-4 ${isReconciling ? "animate-spin" : ""}`} aria-hidden="true" />
              {isReconciling ? "Checking receipts..." : "Reconcile existing payment (read-only)"}
            </button>
          )}
        </section>
      )}

      {/* Delivered Real Output (e.g. SQD Live Multi-Chain Stream) */}
      {exec?.status === "delivered" && Boolean(exec.resultData) && (
        <div className="space-y-3">
          {xResearch && <PaidXResearch key={record.id} data={exec.resultData} objective={record.objective} />}
          {xResearch && exec.settlementDetails?.txHash && (
            <a className="inline-flex items-center gap-2 rounded-md border border-celo-green/30 bg-celo-green/5 px-4 py-3 text-xs text-celo-green hover:underline"
              href={`https://celoscan.io/tx/${exec.settlementDetails.txHash}`} rel="noopener noreferrer" target="_blank">
              <FileCheck className="w-4 h-4" aria-hidden="true" />
              Verify this task's paid Celo receipt — {record.quote?.selectedOffer.humanAmount} {record.quote?.selectedOffer.tokenSymbol}
            </a>
          )}
          {digest && !xResearch && (
            <div className="rounded-lg border border-celo-green/25 bg-celo-green/5 px-4 py-4 space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-celo-green">
                <FileCheck className="w-4 h-4" />
                <span>Task outcome · {digest.headline}</span>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{digest.summary}</p>
              {digest.observations.length > 0 && (
                <ul className="flex flex-wrap gap-2" aria-label="Fields extracted from actual provider data">
                  {digest.observations.map((item, i) => (
                    <li key={i} className="rounded border border-surface-border bg-surface-subtle px-2 py-1 text-[11px] font-mono text-foreground/70">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              <p className="font-mono text-[10px] text-foreground/50">
                {digest.method === "raw-only"
                  ? "No inferred claims. Inspect the unmodified source payload below."
                  : "Mechanical field extraction from the received provider response; not an AI interpretation."}
              </p>
              {exec.settlementDetails?.txHash && (
                <a className="text-xs text-celo-green underline underline-offset-4"
                  href={`https://celoscan.io/tx/${exec.settlementDetails.txHash}`} rel="noreferrer" target="_blank">
                  Verify this task's paid Celo receipt
                </a>
              )}
            </div>
          )}
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

          <details className="rounded bg-black/50 border border-surface-border group">
            <summary className="cursor-pointer p-3 text-xs font-mono text-foreground/70 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-celo-green">
              Inspect original provider JSON
            </summary>
            <div className="p-3.5 border-t border-surface-border max-h-80 overflow-y-auto">
              <pre className="text-xs font-mono text-foreground/90 whitespace-pre-wrap break-all">
                {JSON.stringify(exec.resultData, null, 2)}
              </pre>
            </div>
          </details>
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
