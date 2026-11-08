import { NextResponse } from "next/server";
import { analyzeIntent } from "@/lib/intentEngine";
import { isOperatorAuthenticated, isSameOriginRequest } from "@/lib/operatorAuth";

export async function POST(request: Request) {
  if (!isOperatorAuthenticated(request)) return NextResponse.json({ error: "Operator login required" }, { status: 401 });
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Same-origin request required" }, { status: 403 });
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
