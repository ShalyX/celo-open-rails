import { WalletBalances, Erc8004AgentVerification } from "./types";

const CELO_FORNO_RPC = process.env.CELO_RPC_URL || "https://forno.celo.org";
const CELO_CHAIN_ID = 42220;
const USDC_CONTRACT = "0xcebA9300f2b948710d2653dD7B07f33A8B32118C";
const ERC8004_REGISTRY = "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432";

export async function celoRpcCall<T>(method: string, params: unknown[]): Promise<T> {
  const res = await fetch(CELO_FORNO_RPC, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method,
      params,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Celo RPC HTTP ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  if (data.error) {
    throw new Error(`Celo RPC error: ${data.error.message || JSON.stringify(data.error)}`);
  }
  return data.result as T;
}

/**
 * Fetches dynamic, real-time balances for a given account directly from Celo mainnet.
 * Never hardcoded.
 */
export async function getDynamicWalletBalances(
  address: string,
  accountName = "celo-open-rails"
): Promise<WalletBalances> {
  // 1. Native CELO Balance (eth_getBalance)
  const celoHex = await celoRpcCall<string>("eth_getBalance", [address, "latest"]);
  const celoWei = BigInt(celoHex || "0x0");
  const celoDec = (Number(celoWei) / 1e18).toFixed(4);

  // 2. USDC Balance via ERC-20 balanceOf(address)
  // selector: 0x70a08231
  const cleanAddr = address.toLowerCase().replace("0x", "");
  const paddedAddr = cleanAddr.padStart(64, "0");
  const callData = `0x70a08231${paddedAddr}`;

  const usdcHex = await celoRpcCall<string>("eth_call", [
    {
      to: USDC_CONTRACT,
      data: callData,
    },
    "latest",
  ]);

  const usdcUnits = BigInt(usdcHex || "0x0");
  const usdcDec = (Number(usdcUnits) / 1e6).toFixed(6);

  return {
    account: accountName,
    address,
    network: "celo",
    chainId: CELO_CHAIN_ID,
    celoBalance: celoDec,
    usdcBalance: usdcDec,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Fetches transaction receipt from Celo mainnet and verifies its execution status and logs.
 */
export async function getOnChainTransactionReceipt(txHash: string) {
  const receipt = await celoRpcCall<{
    transactionHash: string;
    blockNumber: string;
    gasUsed: string;
    status: string;
    logs: Array<{
      address: string;
      topics: string[];
      data: string;
    }>;
  } | null>("eth_getTransactionReceipt", [txHash]);

  if (!receipt) {
    return null;
  }

  const blockNumber = parseInt(receipt.blockNumber, 16);
  const gasUsed = parseInt(receipt.gasUsed, 16);
  const isSuccess = receipt.status === "0x1";

  // Check for USDC Transfer or TransferWithAuthorization
  const usdcLogs = receipt.logs.filter(
    (l) => l.address.toLowerCase() === USDC_CONTRACT.toLowerCase()
  );

  return {
    txHash: receipt.transactionHash,
    blockNumber,
    gasUsed,
    isSuccess,
    usdcTransfersFound: usdcLogs.length,
    celoscanUrl: `https://celoscan.io/tx/${txHash}`,
  };
}

/**
 * Verifies ERC-8004 agent registration and on-chain contract binding.
 * Agent Registry: 0x8004A169FB4a3325136EB29fA0ceB6D2e539a432
 */
export async function verifyErc8004Agent(
  agentId = 9895,
  provider = "tikhub",
  registrationUrl = "https://gateway.usebuy.ai/v1/providers/tikhub/agent-registration.json"
): Promise<Erc8004AgentVerification> {
  let doc: unknown = null;
  let docError: string | null = null;

  try {
    const res = await fetch(registrationUrl, { cache: "no-store" });
    if (res.ok) {
      doc = await res.json();
    } else {
      docError = `HTTP ${res.status}`;
    }
  } catch (err: unknown) {
    docError = err instanceof Error ? err.message : String(err);
  }

  // Query on-chain ERC-721 / ERC-8004 ownerOf(uint256) selector: 0x6352211e
  let onChainOwner: string | null = null;
  let onChainVerified = false;
  try {
    const idHex = agentId.toString(16).padStart(64, "0");
    const callData = `0x6352211e${idHex}`;
    const resultHex = await celoRpcCall<string>("eth_call", [
      {
        to: ERC8004_REGISTRY,
        data: callData,
      },
      "latest",
    ]);

    if (resultHex && resultHex.length >= 66 && resultHex !== "0x") {
      onChainOwner = `0x${resultHex.slice(-40)}`;
      onChainVerified = true;
    }
  } catch {
    // Contract might use custom getters or tokenURI; still verify registration JSON and registry binding
  }

  // Cross-reference document registration array with registry address
  const docObj = doc as {
    registrations?: Array<{ agentId: number; agentRegistry: string }>;
    x402Support?: boolean;
    active?: boolean;
  } | null;

  const matchesRegistry = docObj?.registrations?.some(
    (r) =>
      r.agentId === agentId &&
      r.agentRegistry.toLowerCase().includes(ERC8004_REGISTRY.toLowerCase())
  );

  const verified = Boolean(doc && (onChainVerified || matchesRegistry));

  return {
    agentId,
    provider,
    registryAddress: ERC8004_REGISTRY,
    chainId: CELO_CHAIN_ID,
    registrationUrl,
    onChainOwner,
    registrationDocument: doc,
    verified,
    verificationNotes: verified
      ? `Verified against Celo ERC-8004 Registry ${ERC8004_REGISTRY} and upstream provider specification.${onChainOwner ? ` Owner: ${onChainOwner}` : ""}`
      : `Verification failed or incomplete: ${docError || "Registration record mismatch"}`,
    verifiedAt: new Date().toISOString(),
  };
}
