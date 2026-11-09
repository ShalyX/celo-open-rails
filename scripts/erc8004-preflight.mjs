/**
 * READ-ONLY ERC-8004 registration preflight. This NEVER signs or submits.
 * Public metadata must be reachable before a user-authorized registration.
 */
import { createPublicClient, http, parseAbi, encodeFunctionData, formatEther } from "viem";
import { celo } from "viem/chains";
import fs from "node:fs";

const wallet = "0xf903e8a6FC3B751D8466469Fa85F2A1B9Caeba8b";
const registry = "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432";
const manifestPath = new URL("../public/.well-known/agent-registration.json", import.meta.url);
const uri = "https://raw.githubusercontent.com/ShalyX/celo-open-rails/master/public/.well-known/agent-registration.json";
const abi = parseAbi([
  "function balanceOf(address owner) view returns (uint256)",
  "function register(string agentURI) returns (uint256 agentId)",
]);
const client = createPublicClient({ chain: celo, transport: http("https://forno.celo.org") });
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
if (manifest.xOwnerWallet.toLowerCase() !== wallet.toLowerCase()) {
  throw new Error("Manifest wallet does not match intended ERC-8004 owner");
}
const count = await client.readContract({address: registry, abi, functionName:"balanceOf", args:[wallet]});
console.log("IDENTITY_READ_ONLY_CHECK");
console.log("chain=42220 registry=" + registry);
console.log("wallet=" + wallet + " ownedAgentIds=" + count);
console.log("proposedAgentURI=" + uri);
console.log("registrationMethod=register(string)");
const calldata = encodeFunctionData({abi,functionName:"register",args:[uri]});
console.log("calldataBytes=" + ((calldata.length-2)/2));
try {
  const response = await fetch(uri, {signal: AbortSignal.timeout(8000)});
  console.log("publicMetadataAccessible=" + (response.ok ? "YES" : "NO HTTP_" + response.status));
} catch (error) {
  console.log("publicMetadataAccessible=NO (" + error.message + ")");
}
try {
  const estimate = await client.estimateContractGas({
    address: registry, abi, functionName: "register", args:[uri], account: wallet
  });
  console.log("estimatedGasUnits=" + estimate);
  const fee = await client.estimateFeesPerGas();
  const maxFee = fee.maxFeePerGas || fee.gasPrice || BigInt(0);
  console.log("estimatedMaxGasCostCelo=" + formatEther(estimate * maxFee));
} catch (error) {
  console.log("gasEstimate=UNAVAILABLE (" + (error.shortMessage || error.message) + ")");
}
console.log("TRANSACTION_SUBMITTED=NO");
