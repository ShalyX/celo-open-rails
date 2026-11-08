"use client";

import React, { useState } from "react";
import { Search, Sparkles, Terminal, ArrowRight, Layers, CheckCircle2 } from "lucide-react";
import { GatewayCapability } from "@/lib/types";

interface TaskIntakeConsoleProps {
  onSubmitTask: (objective: string, capabilityId?: string) => void;
  isLoading: boolean;
  capabilities: GatewayCapability[];
}

const PRESET_TASKS = [
  {
    title: "X Sentiment Analysis",
    description: "Scan recent public X posts for Celo Layer-2 migration sentiment",
    prompt: "Search X for Celo L2 OP Stack migration developer feedback within_time:7d",
    capabilityId: "x.posts.search",
    platform: "x",
  },
  {
    title: "SQD Multi-Chain Stream",
    description: "Inspect Celo block heads & timestamp mappings (Free unmetered SQD tier)",
    prompt: "Fetch finalized block head and timestamps on Celo via SQD decentralized portal",
    capabilityId: "sqd.datasets",
    platform: "sqd",
  },
  {
    title: "Chainstack Celo RPC Batch",
    description: "Query latest Celo block number and validator state via Chainstack",
    prompt: "Celo mainnet JSON-RPC batch for latest block and sync status",
    capabilityId: "chainstack.celo",
    platform: "chainstack",
  },
  {
    title: "Disposable Browser Worker",
    description: "Rent 1-minute isolated browser container to snapshot a landing page",
    prompt: "Start isolated agent browser session for 1 minute to snapshot target URL",
    capabilityId: "browser.sessions.create",
    platform: "browser",
  },
];

export function TaskIntakeConsole({
  onSubmitTask,
  isLoading,
  capabilities,
}: TaskIntakeConsoleProps) {
  const [objective, setObjective] = useState("");
  const [selectedCapId, setSelectedCapId] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!objective.trim()) return;
    onSubmitTask(objective.trim(), selectedCapId || undefined);
  };

  const handleSelectPreset = (preset: typeof PRESET_TASKS[0]) => {
    setObjective(preset.prompt);
    setSelectedCapId(preset.capabilityId);
  };

  return (
    <div className="bg-surface rounded-lg border border-surface-border p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-surface-border/60">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-celo-green" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-foreground">
            Task Intake & Capability Selection
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-foreground/50 font-mono">
          <Layers className="w-3.5 h-3.5" />
          <span>{capabilities.length} Gateway Capabilities Active</span>
        </div>
      </div>

      {/* Preset Scenario Shortcuts */}
      <div className="mb-4">
        <label className="text-xs font-mono text-foreground/60 mb-2 block uppercase tracking-wider">
          Standard Research Templates
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {PRESET_TASKS.map((preset) => (
            <button
              key={preset.title}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`p-2.5 rounded border text-left transition-all text-xs ${
                objective === preset.prompt
                  ? "bg-celo-green/10 border-celo-green/40 text-foreground"
                  : "bg-surface-subtle border-surface-border/80 hover:border-surface-border text-foreground/70 hover:text-foreground"
              }`}
            >
              <div className="font-semibold flex items-center justify-between mb-1">
                <span>{preset.title}</span>
                {objective === preset.prompt && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-celo-green" />
                )}
              </div>
              <p className="text-[11px] text-foreground/50 line-clamp-2">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Task Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs font-mono text-foreground/60 mb-1.5 block uppercase tracking-wider">
            Research Objective / Prompt
          </label>
          <div className="relative">
            <textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Enter your task (e.g. 'Search X for MiniPay user feedback in Africa within_time:3d', or 'Inspect Celo block stream via SQD')..."
              rows={3}
              className="w-full rounded bg-surface-subtle border border-surface-border px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-celo-green font-mono"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-foreground/50">Capability Target:</span>
            <select
              value={selectedCapId}
              onChange={(e) => setSelectedCapId(e.target.value)}
              className="text-xs font-mono bg-surface-subtle border border-surface-border rounded px-2 py-1 text-foreground focus:outline-none focus:border-celo-green"
            >
              <option value="">Auto-Detect via Intent Engine</option>
              {capabilities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} ({c.price?.usd ? `$${c.price.usd}` : "Free / Option"})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading || !objective.trim()}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded bg-celo-green text-surface font-semibold text-xs hover:bg-celo-greenDark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Decomposing Objective...</span>
              </>
            ) : (
              <>
                <span>Analyze Procurement Intent</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
