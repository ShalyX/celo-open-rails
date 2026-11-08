import { NextResponse } from "next/server";
import {
  isOperatorAuthenticated, isOperatorConfigured, isSameOriginRequest,
  operatorSessionValue, OPERATOR_COOKIE, validOperatorToken,
} from "@/lib/operatorAuth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return NextResponse.json({
    configured: isOperatorConfigured(),
    authenticated: isOperatorAuthenticated(request),
  }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Same-origin login required" }, { status: 403 });
  }
  const body = await request.json().catch(() => ({}));
  if (!validOperatorToken(body.token)) {
    return NextResponse.json({ error: "Invalid operator credential" }, { status: 401 });
  }
  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(OPERATOR_COOKIE, operatorSessionValue(), {
    httpOnly: true, sameSite: "strict",
    secure: process.env.NODE_ENV === "production" && !["localhost", "127.0.0.1", "[::1]"].includes(new URL(request.url).hostname),
    path: "/", maxAge: 60 * 60 * 8,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function DELETE(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Same-origin logout required" }, { status: 403 });
  }
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(OPERATOR_COOKIE, "", {
    httpOnly: true, sameSite: "strict", path: "/", maxAge: 0,
  });
  return response;
}
