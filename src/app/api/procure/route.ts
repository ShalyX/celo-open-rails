import { NextResponse } from "next/server";
import {
  loadProcurements,
  saveProcurement,
  getProcurementById,
  executeProcurement,
} from "@/lib/procurementStore";
import { analyzeIntent } from "@/lib/intentEngine";
import { fetch402Quote, getLiveCatalog } from "@/lib/gateway";
import { ProcurementRecord } from "@/lib/types";

export async function GET() {
  try {
    const list = loadProcurements();
    return NextResponse.json(list);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Failed to load procurement records", details: message },
      { status: 500 }
    );
  }
}

/**
 * Initiates a new procurement task: analyzes intent and fetches authoritative 402 quote.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { objective, capabilityId } = body;

    if (!objective || typeof objective !== "string") {
      return NextResponse.json(
        { error: "Objective is required" },
        { status: 400 }
      );
    }

    // 1. Analyze intent
    const intent = await analyzeIntent(objective, capabilityId);

    // 2. Fetch capability details from live catalog
    const catalog = await getLiveCatalog();
    const capability =
      catalog.capabilities.find((c) => c.id === intent.selectedCapabilityId) ||
      catalog.capabilities[0];

    // 3. Fetch exact authoritative quote
    let quote = undefined;
    try {
      quote = await fetch402Quote(
        intent.requestEnvelope.url,
        intent.requestEnvelope.method,
        intent.requestEnvelope.body
      );
    } catch (quoteErr) {
      console.warn("Unpaid 402 quote failed:", quoteErr);
    }

    const newRecord: ProcurementRecord = {
      id: intent.taskId,
      createdAt: new Date().toISOString(),
      objective,
      capabilityId: capability.id,
      capabilityTitle: capability.title,
      platform: capability.platform,
      intent,
      quote,
      approval: undefined,
      execution: undefined,
    };

    saveProcurement(newRecord);
    return NextResponse.json(newRecord);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Procurement initiation failed", details: message },
      { status: 500 }
    );
  }
}

/**
 * Operator approval and safe execution handler.
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { recordId, maxSpend, tokenSymbol = "USDC" } = body;

    if (!recordId) {
      return NextResponse.json({ error: "Missing recordId" }, { status: 400 });
    }

    const record = getProcurementById(recordId);
    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    // Record explicit human approval
    record.approval = {
      approvedAt: new Date().toISOString(),
      approvedBy: "operator@celo-open-rails",
      maxAuthorizedSpend: maxSpend || record.quote?.selectedOffer.humanAmount || "0.005",
      authorizedToken: tokenSymbol,
    };

    saveProcurement(record);

    // Execute or policy-halt
    const executed = await executeProcurement(recordId);
    return NextResponse.json(executed);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Execution processing failed", details: message },
      { status: 500 }
    );
  }
}
