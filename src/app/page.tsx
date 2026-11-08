"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { TaskIntakeConsole } from "@/components/TaskIntakeConsole";
import { IntentReasoningCard } from "@/components/IntentReasoningCard";
import { QuoteInspector } from "@/components/QuoteInspector";
import { ApprovalBarrier } from "@/components/ApprovalBarrier";
import { ExecutionMonitor } from "@/components/ExecutionMonitor";
import { HistoricalAuditCard } from "@/components/HistoricalAuditCard";
import { DurableLedger } from "@/components/DurableLedger";
import { Erc8004TrustDrawer } from "@/components/Erc8004TrustDrawer";
import {
  WalletBalances,
  Erc8004AgentVerification,
  GatewayCapability,
  ProcurementRecord,
  KeystoreReceipt,
} from "@/lib/types";
import { Shield, Sparkles, RefreshCw, AlertCircle } from "lucide-react";

export default function ProcurementDeskPage() {
  const [balances, setBalances] = useState<WalletBalances | null>(null);
  const [trustInfo, setTrustInfo] = useState<Erc8004AgentVerification | null>(null);
  const [capabilities, setCapabilities] = useState<GatewayCapability[]>([]);
  const [procurements, setProcurements] = useState<ProcurementRecord[]>([]);
  const [historicalReceipt, setHistoricalReceipt] = useState<KeystoreReceipt | null>(null);

  const [activeRecord, setActiveRecord] = useState<ProcurementRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingApproval, setIsProcessingApproval] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load account balances
  const loadAccountBalances = useCallback(async () => {
    try {
      const res = await fetch("/api/account");
      if (res.ok) {
        const data = await res.json();
        setBalances(data.balances);
      }
    } catch (err) {
      console.warn("Failed to load balances:", err);
    }
  }, []);

  // Load gateway catalog
  const loadCatalog = useCallback(async () => {
    try {
      const res = await fetch("/api/catalog");
      if (res.ok) {
        const data = await res.json();
        setCapabilities(data.capabilities || []);
      }
    } catch (err) {
      console.warn("Failed to load catalog:", err);
    }
  }, []);

  // Load ERC-8004 trust verification
  const loadTrust = useCallback(async () => {
    try {
      const res = await fetch("/api/trust?agentId=9895&provider=tikhub");
      if (res.ok) {
        const data = await res.json();
        setTrustInfo(data);
      }
    } catch (err) {
      console.warn("Failed to load trust info:", err);
    }
  }, []);

  // Load receipts and historical proof
  const loadReceipts = useCallback(async () => {
    try {
      const res = await fetch("/api/receipts");
      if (res.ok) {
        const data = await res.json();
        if (data.receipts && data.receipts.length > 0) {
          const hist = data.receipts.find(
            (r: KeystoreReceipt) =>
              r.txHash === "0x7e511e9094756923f3373c01ae7965a3f1ea1f5b43b03172ee91d97e19d8ac43"
          );
          setHistoricalReceipt(hist || data.receipts[0]);
        }
      }
    } catch (err) {
      console.warn("Failed to load receipts:", err);
    }
  }, []);

  // Load saved procurements
  const loadProcurements = useCallback(async () => {
    try {
      const res = await fetch("/api/procure");
      if (res.ok) {
        const data: ProcurementRecord[] = await res.json();
        setProcurements(data);
        if (data.length > 0 && !activeRecord) {
          setActiveRecord(data[0]);
        }
      }
    } catch (err) {
      console.warn("Failed to load procurements:", err);
    }
  }, [activeRecord]);

  // Initial load
  useEffect(() => {
    loadAccountBalances();
    loadCatalog();
    loadTrust();
    loadReceipts();
    loadProcurements();
  }, [loadAccountBalances, loadCatalog, loadTrust, loadReceipts, loadProcurements]);

  // Handle task submission
  const handleSubmitTask = async (objective: string, capabilityId?: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/procure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objective, capabilityId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to initiate procurement");
      }

      const newRecord: ProcurementRecord = await res.json();
      setActiveRecord(newRecord);
      await loadProcurements();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle operator approval & execution
  const handleApprove = async (recordId: string, maxSpend: string, token: string) => {
    setIsProcessingApproval(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/procure", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recordId,
          maxSpend,
          tokenSymbol: token,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to execute procurement");
      }

      const updatedRecord: ProcurementRecord = await res.json();
      setActiveRecord(updatedRecord);
      await loadProcurements();
      await loadAccountBalances();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setIsProcessingApproval(false);
    }
  };

  const handleCancelApproval = () => {
    if (activeRecord && !activeRecord.approval) {
      // Discard active view or leave as draft
      setErrorMessage(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Dynamic Header */}
      <Header
        balances={balances}
        trustInfo={trustInfo}
        onRefresh={() => {
          loadAccountBalances();
          loadCatalog();
          loadTrust();
          loadReceipts();
        }}
        isLoading={isLoading}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="flex items-center gap-2 p-3.5 rounded bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Top Area: Task Intake Console */}
        <TaskIntakeConsole
          onSubmitTask={handleSubmitTask}
          isLoading={isLoading}
          capabilities={capabilities}
        />

        {/* Active Workflow Workspace */}
        {activeRecord && (
          <div className="space-y-6">
            
            {/* Step 1: Intent Analysis Result */}
            <IntentReasoningCard intent={activeRecord.intent} />

            {/* Step 2: Authoritative 402 Quote Inspector */}
            {activeRecord.quote && (
              <QuoteInspector quote={activeRecord.quote} />
            )}

            {/* Step 3: Human Approval Barrier (if pending approval) */}
            {!activeRecord.approval && (
              <ApprovalBarrier
                record={activeRecord}
                balances={balances}
                onApprove={handleApprove}
                onCancel={handleCancelApproval}
                isProcessing={isProcessingApproval}
              />
            )}

            {/* Step 4: Execution Pipeline & Delivered Results (if approved or executed) */}
            {activeRecord.approval && (
              <ExecutionMonitor record={activeRecord} />
            )}

          </div>
        )}

        {/* Bottom Section: Audit Trail, Historical Proof & Trust Info */}
        <div className="space-y-6 pt-4 border-t border-surface-border">
          
          {/* Durable Procurement Ledger */}
          <DurableLedger
            records={procurements}
            onSelectRecord={(rec) => setActiveRecord(rec)}
            selectedRecordId={activeRecord?.id}
          />

          {/* Historical Settlement Baseline Proof */}
          <HistoricalAuditCard receipt={historicalReceipt} />

          {/* ERC-8004 Identity & Registry Trust Drawer */}
          <Erc8004TrustDrawer trustInfo={trustInfo} />

        </div>

      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-surface-border py-4 bg-surface text-center text-xs font-mono text-foreground/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Celo Agents on Open Rails — Build with buy Hackathon Product</span>
          <span>Zero-Spend Evaluation Safe | Celo Mainnet 42220 | ERC-8004 Registered</span>
        </div>
      </footer>
    </div>
  );
}
