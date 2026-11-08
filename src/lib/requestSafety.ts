/** Pure request guards: keep untrusted URLs and unbounded budgets away from the gateway. */
export function assertTrustedGatewayUrl(raw: string): URL {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("Invalid capability URL");
  }
  if (
    url.protocol !== "https:" ||
    url.hostname !== "gateway.usebuy.ai" ||
    url.port !== "" ||
    url.username !== "" ||
    url.password !== "" ||
    !["/v1/", "/sqd/", "/chainstack/", "/cencori/"].some((prefix) => url.pathname.startsWith(prefix))
  ) {
    throw new Error("Only documented HTTPS buy gateway capability paths are allowed");
  }
  return url;
}

export function assertSafeGatewayMethod(method: string): "GET" | "POST" {
  const upper = method.toUpperCase();
  if (upper !== "GET" && upper !== "POST") {
    throw new Error("Unsupported gateway method");
  }
  return upper;
}

export function assertFreeSqdPath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error("Invalid SQD endpoint path");
  }
  const url = assertTrustedGatewayUrl("https://gateway.usebuy.ai" + path);
  if (!url.pathname.startsWith("/sqd/")) {
    throw new Error("Only free SQD endpoints are eligible for no-spend execution");
  }
  return url.pathname + url.search;
}

export function parseUsdSixDecimalAtoms(amount: string): bigint {
  if (typeof amount !== "string" || !/^(0|[1-9][0-9]*)(\.[0-9]{1,6})?$/.test(amount)) {
    throw new Error("Spend cap must be a valid non-negative amount with up to 6 decimals");
  }
  const [whole, fraction = ""] = amount.split(".");
  return BigInt(whole) * BigInt(1000000) + BigInt(fraction.padEnd(6, "0") || "0");
}

export function assertQuoteWithinApproval(
  atomicAmount: string,
  maxSpend: string,
  quoteToken: string,
  authorizedToken: string
): void {
  if (!/^(0|[1-9][0-9]*)$/.test(atomicAmount)) {
    throw new Error("Quote amount has invalid atomic units");
  }
  const quotedAtoms = BigInt(atomicAmount);
  const capAtoms = parseUsdSixDecimalAtoms(maxSpend);
  if (quoteToken.toUpperCase() !== authorizedToken.toUpperCase()) {
    throw new Error("Authorized settlement token differs from quoted token");
  }
  if (quotedAtoms > capAtoms) {
    throw new Error("Authorised spend cap is below the authoritative quote");
  }
}
