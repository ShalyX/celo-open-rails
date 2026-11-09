/** Read-only recovery acceptance using the ONE previously authorized payment.
 * Clones a delivered task in memory into an uncertain state. Does not write
 * production ledger, sign, quote, call Buy, or purchase anything.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createPublicClient, http } from "viem";
import { celo } from "viem/chains";
import { reconcileWithoutNewSpend } from "../src/lib/readOnlyRecovery.ts";

const HASH = "0xba529f67e679cfafb1ffeb6749cebd06cf967b0dc43ce6cf79b0255bcec63a61";
const original = JSON.parse(fs.readFileSync(".data/procurements.json","utf8"))
  .find((r) => r.execution?.settlementDetails?.txHash?.toLowerCase() === HASH);
if (!original || original.execution.status !== "delivered") throw new Error("Original paid task missing");
const record = structuredClone(original);
record.execution.status = "settle_uncertain";
delete record.execution.deliveredAt;
delete record.execution.reconciliation;
const cpay = path.join(os.homedir(),".config","cpay");
const receipts = fs.readdirSync(cpay).filter(n=>/^receipts.*\.json$/.test(n))
  .flatMap(n=>JSON.parse(fs.readFileSync(path.join(cpay,n),"utf8")));
const chain = createPublicClient({chain:celo,transport:http("https://forno.celo.org", {timeout:15000})});
const transferSig="0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
let rpcCalls=0;
const verify = async (tx,token,payTo,amount) => {
  rpcCalls++;
  const result=await chain.getTransactionReceipt({hash:tx});
  const confirmed=result.status==="success" && result.logs.some(l=>
    l.address.toLowerCase()===token.toLowerCase() &&
    l.topics[0]?.toLowerCase()===transferSig &&
    l.topics[2]?.slice(-40).toLowerCase()===payTo.toLowerCase().slice(2) &&
    BigInt(l.data)===BigInt(amount));
  return {verified:confirmed,reason:confirmed?"exact USDC Transfer on Celo":"transfer mismatch"};
};
const restored=await reconcileWithoutNewSpend(record,receipts,verify);
if (restored.execution.status!=="delivered" || !restored.execution.reconciliation?.paymentVerified ||
    restored.execution.settlementDetails.txHash.toLowerCase()!==HASH || rpcCalls!==1) {
  throw new Error("Read-only recovery acceptance failed");
}
const unbound=structuredClone(original);
unbound.execution.status="settle_uncertain";
delete unbound.execution.settlementDetails.txHash;
const after=await reconcileWithoutNewSpend(unbound,receipts,verify);
if(after.execution.status!=="settle_uncertain" || rpcCalls!==1)throw new Error("Unbound payment incorrectly recovered");
console.log("READ_ONLY_REAL_CHAIN_RECOVERY_PASS "+JSON.stringify({
task:restored.id,tx:HASH,providerResultRetained:Boolean(restored.execution.resultData),
rpcCalls,correlatedStatus:restored.execution.status,
unboundStatus:after.execution.status,additionalPurchases:0
}));
