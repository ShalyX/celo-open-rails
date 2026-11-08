import { createHmac, timingSafeEqual } from "node:crypto";

export const OPERATOR_COOKIE = "celo_operator_session";

function operatorSecret(): string | null {
  const token = process.env.OPERATOR_ACCESS_TOKEN?.trim();
  return token && token.length >= 24 ? token : null;
}

function safeEqual(a: string, b: string): boolean {
  const aa = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}

export function isOperatorConfigured(): boolean {
  return operatorSecret() !== null;
}

export function validOperatorToken(candidate: unknown): boolean {
  const expected = operatorSecret();
  return Boolean(expected && typeof candidate === "string" && safeEqual(candidate, expected));
}

export function operatorSessionValue(): string {
  const secret = operatorSecret();
  if (!secret) throw new Error("Operator access is not configured");
  return createHmac("sha256", secret).update("celo-procurement-operator-v1").digest("hex");
}

export function isOperatorAuthenticated(request: Request): boolean {
  if (!isOperatorConfigured()) return false;
  const cookies = request.headers.get("cookie") ?? "";
  const token = cookies.split(";").map((v) => v.trim()).find((v) => v.startsWith(OPERATOR_COOKIE + "="));
  if (!token) return false;
  const found = token.substring(OPERATOR_COOKIE.length + 1);
  return safeEqual(found, operatorSessionValue());
}

export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const candidate = new URL(origin);
    const target = new URL(request.url);
    if (candidate.origin === target.origin) return true;
    // Next.js may normalize Request.url to localhost while preserving the
    // real request Host header (e.g. 127.0.0.1). Compare both explicitly.
    const host = request.headers.get("host");
    const proto = request.headers.get("x-forwarded-proto") || target.protocol.replace(":", "");
    return Boolean(host && candidate.host === host && candidate.protocol === proto + ":");
  } catch {
    return false;
  }
}
