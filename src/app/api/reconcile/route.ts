import { NextResponse } from "next/server";
import { isOperatorAuthenticated, isSameOriginRequest } from "@/lib/operatorAuth";
import {
  getProcurementById, loadKeystoreReceipts, saveProcurement, withProcurementLock,
} from "@/lib/procurementStore";
import { reconcileWithoutNewSpend } from "@/lib/readOnlyRecovery";
import { verifyExactTokenSettlement } from "@/lib/celoRpc";

export const dynamic = "force-dynamic";

/**
 * Reconciles an EXISTING uncertain attempt using only local receipts + read-only RPC.
 * Does not quote, sign, purchase, renew, retry or dispatch any paid request.
 */
export async function POST(request: Request) {
  if (!isOperatorAuthenticated(request)) {
    return NextResponse.json({ error: "Operator login required" }, { status: 401 });
  }
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Same-origin request required" }, { status: 403 });
  }
  let id: string;
  try {
    const body = await request.json();
    id = body?.recordId;
    if (typeof id !== "string" || !/^task-[a-zA-Z0-9-]+$/.test(id)) {
      return NextResponse.json({ error: "Invalid record ID" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON request" }, { status: 400 });
  }
  try {
    return await withProcurementLock(id, async () => {
      const record = getProcurementById(id);
      if (!record) return NextResponse.json({ error: "Task not found" }, { status: 404 });
      if (!record.execution || !["settle_uncertain", "executing"].includes(record.execution.status)) {
        return NextResponse.json({ error: "Task is not awaiting read-only reconciliation" }, { status: 409 });
      }
      const checked = await reconcileWithoutNewSpend(record, loadKeystoreReceipts(), verifyExactTokenSettlement);
      saveProcurement(checked);
      return NextResponse.json(checked, { headers: { "Cache-Control": "no-store" } });
    });
  } catch (error) {
    return NextResponse.json({
      error: "Read-only reconciliation not completed",
      details: error instanceof Error ? error.message : String(error),
    }, { status: 503 });
  }
}
