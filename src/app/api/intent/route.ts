import { NextResponse } from "next/server";
import { analyzeIntent } from "@/lib/intentEngine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { objective, capabilityId } = body;

    if (!objective || typeof objective !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'objective' string in request body." },
        { status: 400 }
      );
    }

    const result = await analyzeIntent(objective, capabilityId);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Intent analysis failed", details: message },
      { status: 500 }
    );
  }
}
