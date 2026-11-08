import { NextResponse } from "next/server";
import { fetch402Quote } from "@/lib/gateway";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, method = "POST", requestBody = {} } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'url' string in quote request." },
        { status: 400 }
      );
    }

    const quote = await fetch402Quote(url, method, requestBody);
    return NextResponse.json(quote);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Authoritative 402 quotation failed", details: message },
      { status: 502 }
    );
  }
}
