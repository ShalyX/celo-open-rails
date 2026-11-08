import { NextResponse } from "next/server";
import { isOperatorAuthenticated, isSameOriginRequest } from "@/lib/operatorAuth";
import { assertQuoteWithinApproval } from "@/lib/requestSafety";
import {
  loadProcurements,
  saveProcurement,
  getProcurementById,
  executeProcurement,
  withProcurementLock,
} from "@/lib/procurementStore";
import { analyzeIntent } from "@/lib/intentEngine";
import { fetch402Quote, getLiveCatalog } from "@/lib/gateway";
import { ProcurementRecord } from "@/lib/types";

export async function GET(request: Request) {
  if (!isOperatorAuthenticated(request)) {
    return NextResponse.json({ error: "Operator login required" }, { status: 401 });
  }
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
  if (!isOperatorAuthenticated(request)) {
    return NextResponse.json({ error: "Operator login required" }, { status: 401 });
  }
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Same-origin request required" }, { status: 403 });
  }
  try {
    const body = await request.json();
    const { objective, capabilityId } = body;

    if (!objective || typeof objective !== "string" || objective.length > 1000) {
      return NextResponse.json(
        { error: "Objective is required" },
        { status: 400 }
      );
    }

    // 1. Analyze intent
    const intent = await analyzeIntent(objective, capabilityId);

    // 2. Fetch capability details from live catalog
    const catalog = await getLiveCatalog();
    const capability = catalog.capabilities.find((c) => c.id === intent.selectedCapabilityId);
    if (!capability || !capability.available || capability.url !== intent.requestEnvelope.url) {
      throw new Error("Intent capability must resolve to a live, available catalog entry");
    }

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
  if (!isOperatorAuthenticated(request)) {
    return NextResponse.json({ error: "Operator login required" }, { status: 401 });
  }
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Same-origin request required" }, { status: 403 });
  }
  try {
    const body = await request.json();
    const { recordId, maxSpend, tokenSymbol } = body;
    if (typeof recordId !== "string" || !/^task-[a-zA-Z0-9-]+$/.test(recordId) ||
        typeof maxSpend !== "string" || typeof tokenSymbol !== "string") {
      return NextResponse.json({ error: "Valid record, explicit cap, and quoted token required" }, { status: 400 });
    }
    return await withProcurementLock(recordId, async () => {
      const record = getProcurementById(recordId);
      if (!record) return NextResponse.json({ error: "Record not found" }, { status: 404 });
      if (record.approval || record.execution) {
        return NextResponse.json({ error: "This task has already been authorized; repeat execution is blocked" }, { status: 409 });
      }
      if (!record.quote) {
        return NextResponse.json({ error: "An authoritative unpaid quote must be obtained before approval" }, { status: 409 });
      }
      try {
        assertQuoteWithinApproval(
          record.quote.selectedOffer.atomicAmount, maxSpend,
          record.quote.selectedOffer.tokenSymbol, tokenSymbol
        );
      } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
      }
      const expiryMs = (record.quote.selectedOffer.timeoutSeconds || 300) * 1000;
      if (!Number.isFinite(Date.parse(record.quote.timestamp)) ||
          Date.now() > Date.parse(record.quote.timestamp) + expiryMs) {
        return NextResponse.json({ error: "Quote expired; create a fresh task for a new quote" }, { status: 409 });
      }
      record.approval = {
        approvedAt: new Date().toISOString(),
        approvedBy: "authenticated-local-operator",
        maxAuthorizedSpend: maxSpend,
        authorizedToken: tokenSymbol,
      };
      saveProcurement(record);
      return NextResponse.json(await executeProcurement(recordId));
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Execution blocked", details: message },
      { status: 409 }
    );
  }
}
