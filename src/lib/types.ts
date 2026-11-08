export type Platform =
  | "x"
  | "instagram"
  | "tiktok"
  | "reddit"
  | "youtube"
  | "linkedin"
  | "flights"
  | "browser"
  | "chainstack"
  | "cencori"
  | "sqd"
  | "unknown";

export interface CapabilityPrice {
  usd?: string;
  atomic: string;
  tokens: string[];
  pricingModel?: string;
}

export interface CapabilityPriceOption {
  durationMinutes?: number;
  maxResults?: number;
  usd: string;
  atomic: string;
  tokens: string[];
}

export interface AgentTrustRef {
  provider: string;
  agentId: number;
  agentRegistry: string;
  registration: string;
}

export interface GatewayCapability {
  id: string;
  title: string;
  description: string;
  available: boolean;
  method: string;
  url: string;
  platform: Platform;
  agent?: AgentTrustRef;
  inputSchema?: {
    type?: string;
    required?: string[];
    properties?: Record<string, unknown>;
    additionalProperties?: boolean;
  };
  price?: CapabilityPrice;
  priceOptions?: CapabilityPriceOption[];
  pricingModel?: string;
  sandboxNetwork?: string;
  protocols?: string[];
}

export interface FreeServiceEndpoint {
  title: string;
  method: string;
  path: string;
}

export interface FreeService {
  id: string;
  title: string;
  description: string;
  url: string;
  free: boolean;
  rateLimit?: {
    scope: string;
    requestsPerMinute: number;
    burst: number;
  };
  endpoints: FreeServiceEndpoint[];
}

export interface CatalogResponse {
  service: string;
  version: number;
  baseUrl: string;
  catalog: string;
  trust: {
    protocol: string;
    chainId: number;
    identityRegistry: string;
    reputationRegistry: string;
    agentRegistry: string;
    feedbackClient: string;
  };
  payment: {
    protocol: string;
    network: string;
    chainId: number;
    payTo: string;
    tokens: Array<{
      symbol: string;
      asset: string;
      decimals: number;
    }>;
  };
  capabilities: GatewayCapability[];
  freeServices: FreeService[];
}

export interface IntentAnalysisResult {
  taskId: string;
  objective: string;
  selectedCapabilityId: string;
  reasoning: string;
  isAiReasoning: boolean;
  engineModel: string;
  confidenceScore: number;
  requestEnvelope: {
    method: string;
    url: string;
    body: Record<string, unknown>;
    headers?: Record<string, string>;
  };
  estimatedPricing?: {
    pricingModel: string;
    approximateUsd: string;
    approximateAtomic: string;
  };
}

export interface ChallengeAccept {
  scheme: string;
  network: string;
  maxAmountRequired: string;
  amount?: string;
  resource: string;
  description: string;
  mimeType: string;
  payTo: string;
  maxTimeoutSeconds: number;
  asset: string;
  extra?: {
    name?: string;
    version?: string;
    gateway?: {
      capability: string;
      provider?: string;
      pricingModel?: string;
      sandbox?: boolean;
    };
  };
}

export interface AuthoritativeQuote {
  quoteId: string;
  timestamp: string;
  url: string;
  method: string;
  requestBody: Record<string, unknown>;
  x402Version: number;
  rawHeaderBase64?: string;
  accepts: ChallengeAccept[];
  selectedOffer: {
    tokenSymbol: string;
    assetContract: string;
    atomicAmount: string;
    humanAmount: string;
    payTo: string;
    network: string;
    timeoutSeconds: number;
  };
}

export interface WalletBalances {
  account: string;
  address: string;
  network: string;
  chainId: number;
  celoBalance: string;
  usdcBalance: string;
  lastUpdated: string;
}

export type ProcurementStatus =
  | "draft"
  | "intent_analyzed"
  | "quote_received"
  | "awaiting_approval"
  | "approved"
  | "halted_by_policy"
  | "executing"
  | "delivered"
  | "failed"
  | "settle_uncertain";

export interface ProcurementRecord {
  id: string;
  createdAt: string;
  objective: string;
  capabilityId: string;
  capabilityTitle: string;
  platform: Platform;
  intent: IntentAnalysisResult;
  quote?: AuthoritativeQuote;
  approval?: {
    approvedAt: string;
    approvedBy: string;
    maxAuthorizedSpend: string;
    authorizedToken: string;
  };
  execution?: {
    attemptedAt: string;
    idempotencyKey: string;
    status: ProcurementStatus;
    policyGuardTriggered: boolean;
    policyHaltReason?: string;
    settlementDetails?: {
      network: string;
      asset: string;
      amount: string;
      payTo: string;
      nonce?: string;
      txHash?: string;
      outcome?: string;
      status?: number;
    };
    resultData?: unknown;
    deliveredAt?: string;
    errorMessage?: string;
  };
}

export interface KeystoreReceipt {
  account: string;
  url: string;
  network: string;
  asset: string;
  amount: string;
  scheme: string;
  outcome: string;
  status: number;
  txHash: string;
  authorization?: {
    from: string;
    nonce: string;
    validAfter: string;
    validBefore: string;
  };
  timestamp: string;
  id: string;
  isHistoricalProof?: boolean;
}

export interface Erc8004AgentVerification {
  agentId: number;
  provider: string;
  registryAddress: string;
  chainId: number;
  registrationUrl: string;
  onChainOwner: string | null;
  registrationDocument: unknown | null;
  verified: boolean;
  verificationNotes: string;
  verifiedAt: string;
}
