import { NextResponse } from "next/server";
import { loadLocalAccountMetadata } from "@/lib/procurementStore";
import { getDynamicWalletBalances } from "@/lib/celoRpc";
import { isOperatorAuthenticated } from "@/lib/operatorAuth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isOperatorAuthenticated(request)) return NextResponse.json({ error: "Operator login required" }, { status: 401 });
  try {
    const meta = loadLocalAccountMetadata();
    const balances = await getDynamicWalletBalances(meta.address, meta.name);
    return NextResponse.json({
      meta,
      balances,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Failed to fetch account or dynamic balances", details: message },
      { status: 500 }
    );
  }
}
