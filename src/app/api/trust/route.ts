import { NextResponse } from "next/server";
import { verifyErc8004Agent } from "@/lib/celoRpc";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = parseInt(searchParams.get("agentId") || "9895", 10);
    const provider = searchParams.get("provider") || "tikhub";

    const verification = await verifyErc8004Agent(agentId, provider);
    return NextResponse.json(verification);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "ERC-8004 verification failed", details: message },
      { status: 500 }
    );
  }
}
