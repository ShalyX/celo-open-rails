import { NextResponse } from "next/server";
import { getLiveCatalog } from "@/lib/gateway";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const refresh = searchParams.get("refresh") === "true";
    const catalog = await getLiveCatalog(refresh);
    return NextResponse.json(catalog);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Failed to fetch live gateway catalog", details: message },
      { status: 502 }
    );
  }
}
