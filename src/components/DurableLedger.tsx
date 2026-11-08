"use client";

import React, { useState } from "react";
import { ListOrdered, CheckCircle2, AlertCircle, Clock, ExternalLink, ArrowRight } from "lucide-react";
import { ProcurementRecord } from "@/lib/types";

interface DurableLedgerProps {
  records: ProcurementRecord[];
  onSelectRecord: (record: ProcurementRecord) => void;
  selectedRecordId?: string;
}

export function DurableLedger({
  records,
  onSelectRecord,
  selectedRecordId,
}: DurableLedgerProps) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = records.filter((r) => {
    if (filter === "all") return true;
    if (filter === "delivered") return r.execution?.status === "delivered";
    if (filter === "halted") return r.execution?.status === "halted_by_policy";
    if (filter === "pending") return !r.execution;
    return true;
  });

  return (
    <div className="bg-surface rounded-lg border border-surface-border p-5 shadow-sm space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-surface-border/60">
        <div className="flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-celo-green" />
          <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground">
            Durable Procurement Ledger ({records.length} Tasks Recorded)
          </h3>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-2.5 py-1 rounded transition-colors ${
              filter === "all"
                ? "bg-surface-elevated text-foreground font-semibold border border-surface-border"
                : "text-foreground/50 hover:text-foreground"
            }`}
          >
            All ({records.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("delivered")}
            className={`px-2.5 py-1 rounded transition-colors ${
              filter === "delivered"
                ? "bg-celo-green/10 text-celo-green font-semibold border border-celo-green/30"
                : "text-foreground/50 hover:text-foreground"
            }`}
          >
            Delivered
          </button>
          <button
            type="button"
            onClick={() => setFilter("halted")}
            className={`px-2.5 py-1 rounded transition-colors ${
              filter === "halted"
                ? "bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/30"
                : "text-foreground/50 hover:text-foreground"
            }`}
          >
            Halted by Policy
          </button>
          <button
            type="button"
            onClick={() => setFilter("pending")}
            className={`px-2.5 py-1 rounded transition-colors ${
              filter === "pending"
                ? "bg-surface-elevated text-foreground font-semibold border border-surface-border"
                : "text-foreground/50 hover:text-foreground"
            }`}
          >
            Pending
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      {filtered.length === 0 ? (
        <div className="py-8 text-center text-xs font-mono text-foreground/40 border border-dashed border-surface-border rounded">
          No procurement records matching filter. Enter a research task to initiate a workflow.
        </div>
      ) : (
        <div className="overflow-x-auto border border-surface-border rounded">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-surface-subtle border-b border-surface-border text-foreground/50 uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Task Objective</th>
                <th className="py-2.5 px-3">Capability</th>
                <th className="py-2.5 px-3">Quote</th>
                <th className="py-2.5 px-3">Engine</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filtered.map((item) => {
                const isSelected = item.id === selectedRecordId;
                const status = item.execution?.status || "awaiting_approval";

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectRecord(item)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-surface-elevated/90"
                        : "hover:bg-surface-subtle/70"
                    }`}
                  >
                    <td className="py-2.5 px-3 text-foreground/60 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="py-2.5 px-3 text-foreground font-sans font-medium max-w-xs truncate" title={item.objective}>
                      {item.objective}
                    </td>
                    <td className="py-2.5 px-3 text-foreground/80 whitespace-nowrap">
                      {item.capabilityId}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {item.quote ? (
                        <span className="text-celo-green font-medium">
                          {item.quote.selectedOffer.humanAmount} {item.quote.selectedOffer.tokenSymbol}
                        </span>
                      ) : (
                        <span className="text-foreground/40">-</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {item.intent.isAiReasoning ? (
                        <span className="text-celo-green">AI Model</span>
                      ) : (
                        <span className="text-amber-400">Fallback</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {status === "delivered" && (
                        <span className="inline-flex items-center gap-1 text-celo-green">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Delivered</span>
                        </span>
                      )}
                      {status === "halted_by_policy" && (
                        <span className="inline-flex items-center gap-1 text-amber-400">
                          <AlertCircle className="w-3 h-3" />
                          <span>Halted (Policy)</span>
                        </span>
                      )}
                      {status === "awaiting_approval" && (
                        <span className="inline-flex items-center gap-1 text-foreground/60">
                          <Clock className="w-3 h-3" />
                          <span>Awaiting Approval</span>
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRecord(item);
                        }}
                        className="text-celo-green hover:underline inline-flex items-center gap-1"
                      >
                        <span>Inspect</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
