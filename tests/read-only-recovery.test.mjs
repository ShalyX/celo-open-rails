import test from "node:test";
import assert from "node:assert/strict";
import { possibleReceipts, reconcileWithoutNewSpend, OLD_SPIKE_TX } from "../src/lib/readOnlyRecovery.ts";

const NEW_TX="0xba529f67e679cfafb1ffeb6749cebd06cf967b0dc43ce6cf79b0255bcec63a61";
const ASSET="0xcebA9300f2b948710d2653dD7B07f33A8B32118C";
const PAYEE="0x20faAca5F980E29639A0FCC6dcA6988E18ed333B";
const URL="https://gateway.usebuy.ai/v1/social/x/posts/search";
function fixture(withOutput=false) {
  return {
    id:"task-2026-recovery",
    objective:"Celo MiniPay research",
    approval:{approvedAt:"2026-11-09T01:00:00Z",approvedBy:"operator",maxAuthorizedSpend:"0.005",authorizedToken:"USDC"},
    quote:{url:URL,selectedOffer:{atomicAmount:"5000",assetContract:ASSET,payTo:PAYEE}},
    execution:{attemptedAt:"2026-11-09T01:02:00Z",status:"settle_uncertain",
      settlementDetails:{txHash:NEW_TX},
      ...(withOutput?{resultData:{output:{timeline:[{text:"real"}]}}}:{})}
  };
}
function receipt(txHash=NEW_TX, stamp="2026-11-09T01:06:00Z") {
  return {txHash,account:"celo-open-rails",url:URL,amount:"5000",asset:ASSET,
    timestamp:stamp,network:"celo",outcome:"confirmed"};
}
test("receipt matching excludes historical spike, stale and wrong amount, deduplicates shards",()=>{
  const r=fixture();
  const items=[
    receipt(OLD_SPIKE_TX),receipt(NEW_TX,"2026-11-08T01:06:00Z"),
    {...receipt(),amount:"8000"},receipt(),receipt()
  ];
  assert.deepEqual(possibleReceipts(r,items).map(x=>x.txHash),[NEW_TX]);
});
test("real chain confirmation plus existing paid result restores delivered without a new call", async()=>{
  const r=fixture(true);
  let calls=0;
  await reconcileWithoutNewSpend(r,[receipt()],async (tx,token,payee,amount)=>{
    calls++;assert.deepEqual([tx,token,payee,amount],[NEW_TX,ASSET,PAYEE,"5000"]);
    return {verified:true,reason:"exact ERC20 Transfer"};
  });
  assert.equal(calls,1);
  assert.equal(r.execution.status,"delivered");
  assert.equal(r.execution.reconciliation.paymentVerified,true);
  assert.equal(r.execution.settlementDetails.txHash,NEW_TX);
});
test("paid without original provider response remains uncertain; never fabricates delivered result",async()=>{
  const r=fixture();
  await reconcileWithoutNewSpend(r,[receipt()],async()=>({verified:true,reason:"ok"}));
  assert.equal(r.execution.status,"settle_uncertain");
  assert.equal(r.execution.reconciliation.paymentVerified,true);
  assert.equal(r.execution.settlementDetails.outcome,"payment_confirmed_response_missing");
  assert.equal(r.execution.resultData,undefined);
});
test("no matching receipt or unverifiable chain remains uncertain without repeat charge",async()=>{
  let called=0;
  const r=fixture();
  await reconcileWithoutNewSpend(r,[],async()=>{called++;return{verified:true,reason:"wrong"}});
  assert.equal(called,0);
  assert.equal(r.execution.status,"settle_uncertain");
  await reconcileWithoutNewSpend(r,[receipt()],async()=>({verified:false,reason:"no receipt"}));
  assert.equal(r.execution.status,"settle_uncertain");
  assert.equal(r.execution.reconciliation.paymentVerified,false);
});
test("already delivered task cannot be reconciled again",async()=>{
  const r=fixture(true);r.execution.status="delivered";
  await assert.rejects(()=>reconcileWithoutNewSpend(r,[receipt()],async()=>({verified:true,reason:"ok"})));
});

test("an unbound matching receipt never proves which task paid", async () => {
  const r=fixture(true);
  delete r.execution.settlementDetails;
  let verified=0;
  await reconcileWithoutNewSpend(r,[receipt()],async()=>{verified++;return {verified:true,reason:"ok"}});
  assert.equal(verified,0);
  assert.equal(r.execution.status,"settle_uncertain");
  assert.equal(r.execution.reconciliation.paymentVerified,false);
  assert.match(r.execution.reconciliation.note,/no persisted exact matching transaction hash/);
});
