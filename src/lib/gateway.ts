import {
  CatalogResponse,
  GatewayCapability,
  AuthoritativeQuote,
  ChallengeAccept,
} from "./types";

const GATEWAY_BASE_URL = "https://gateway.usebuy.ai";
const CATALOG_URL = `${GATEWAY_BASE_URL}/v1/catalog`;

let cachedCatalog: CatalogResponse | null = null;
let catalogCacheTime = 0;
const CATALOG_CACHE_TTL_MS = 60 * 1000; // 1 minute cache

/**
 * Fetches the live Buy API Gateway catalog.
 */
export async function getLiveCatalog(forceFresh = false): Promise<CatalogResponse> {
  const now = Date.now();
  if (!forceFresh && cachedCatalog && now - catalogCacheTime < CATALOG_CACHE_TTL_MS) {
    return cachedCatalog;
  }

  const res = await fetch(CATALOG_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "User-Agent": "Celo-Open-Rails-ProcurementDesk/1.0",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch gateway catalog: HTTP ${res.status} ${res.statusText}`);
  }

  const data: CatalogResponse = await res.json();
  cachedCatalog = data;
  catalogCacheTime = now;
  return data;
}

/**
 * Dispatches an unpaid request to the exact target gateway route to retrieve
 * the authoritative HTTP 402 Payment Required challenge.
 *
 * Never spends funds. Does not include Authorization or payment headers.
 */
export async function fetch402Quote(
  targetUrl: string,
  method = "POST",
  body: Record<string, unknown> = {}
): Promise<AuthoritativeQuote> {
  const quoteId = `quote-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const hasBody = method.toUpperCase() === "POST" || method.toUpperCase() === "PUT";

  const fetchOptions: RequestInit = {
    method: method.toUpperCase(),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    cache: "no-store",
  };

  if (hasBody) {
    fetchOptions.body = JSON.stringify(body);
  }

  const res = await fetch(targetUrl, fetchOptions);

  if (res.status !== 402) {
    // If it's a free route (like /sqd/...) it may return 200 directly
    if (res.ok) {
      return {
        quoteId,
        timestamp: new Date().toISOString(),
        url: targetUrl,
        method,
        requestBody: body,
        x402Version: 0,
        accepts: [],
        selectedOffer: {
          tokenSymbol: "FREE",
          assetContract: "0x0000000000000000000000000000000000000000",
          atomicAmount: "0",
          humanAmount: "0.000000",
          payTo: "0x0000000000000000000000000000000000000000",
          network: "celo",
          timeoutSeconds: 300,
        },
      };
    }

    const errText = await res.text();
    throw new Error(
      `Gateway returned unexpected status HTTP ${res.status} instead of 402 challenge: ${errText.slice(0, 200)}`
    );
  }

  // Parse header 'payment-required'
  const rawHeaderBase64 = res.headers.get("payment-required") || undefined;
  let parsedAccepts: ChallengeAccept[] = [];
  let x402Version = 1;

  try {
    const jsonBody = await res.json();
    x402Version = jsonBody.x402Version || 1;
    if (Array.isArray(jsonBody.accepts)) {
      parsedAccepts = jsonBody.accepts;
    }
  } catch {
    // If body json fails, attempt decoding header
    if (rawHeaderBase64) {
      try {
        const decoded = JSON.parse(Buffer.from(rawHeaderBase64, "base64").toString("utf8"));
        if (Array.isArray(decoded.accepts)) {
          parsedAccepts = decoded.accepts;
        }
      } catch {
        // ignore
      }
    }
  }

  // Select primary Celo mainnet offer (prefer USDC, then USDT, then USAT)
  const celoOffers = parsedAccepts.filter(
    (a) =>
      a.network === "celo" ||
      a.network === "eip155:42220" ||
      a.network === "42220"
  );

  const usdcOffer = celoOffers.find(
    (a) =>
      a.extra?.name?.toUpperCase() === "USDC" ||
      a.asset.toLowerCase() === "0xceba9300f2b948710d2653dd7b07f33a8b32118c"
  );

  const selected = usdcOffer || celoOffers[0] || parsedAccepts[0];

  if (!selected) {
    throw new Error("402 challenge did not provide valid payment accept offers.");
  }

  const rawAmount = selected.maxAmountRequired || selected.amount || "0";
  const atomicAmount = rawAmount.toString();
  // 6 decimals standard for Celo USDC/USDT/USAT
  const humanAmount = (Number(atomicAmount) / 1e6).toFixed(6);
  const tokenSymbol = selected.extra?.name || "USDC";

  return {
    quoteId,
    timestamp: new Date().toISOString(),
    url: targetUrl,
    method,
    requestBody: body,
    x402Version,
    rawHeaderBase64,
    accepts: parsedAccepts,
    selectedOffer: {
      tokenSymbol,
      assetContract: selected.asset,
      atomicAmount,
      humanAmount,
      payTo: selected.payTo,
      network: selected.network,
      timeoutSeconds: selected.maxTimeoutSeconds || 300,
    },
  };
}

/**
 * Executes a free query against SQD multi-chain endpoints.
 */
export async function executeSqdQuery(path: string, options: RequestInit = {}) {
  const url = `${GATEWAY_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`SQD query failed: HTTP ${res.status}: ${err.slice(0, 200)}`);
  }

  return res.json();
}
