import assert from "node:assert/strict";
import test from "node:test";
import { inferWithHermes, verifiedHermesDecision } from "../src/lib/hermesIntent.ts";

const sample = [
  {
    id:"x.posts.search",title:"Search X posts",description:"Recent posts from X",
    available:true,method:"POST",url:"https://gateway.usebuy.ai/v1/social/x/posts/search",
    platform:"x",price:{atomic:"5000",usd:"0.005",tokens:["USDC"]},
    inputSchema:{type:"object",required:["query"],properties:{query:{type:"string"},type:{type:"string"}},additionalProperties:false},
  },
  {
    id:"sqd.datasets",title:"SQD datasets",description:"Free blockchain data",
    available:true,method:"GET",url:"https://gateway.usebuy.ai/sqd/datasets",
    platform:"sqd",price:{atomic:"0",usd:"0",tokens:[]},
    inputSchema:{type:"object",required:[],properties:{},additionalProperties:false},
  },
];
function choice(id="x.posts.search",body={query:"Celo MiniPay",type:"latest"}) {
  return JSON.stringify({selectedCapabilityId:id,reasoning:"The social feed directly answers the research objective.",confidenceScore:0.87,requestBody:body});
}

test("genuine Hermes HTTP response drives a catalog-bound decision, never a payment", async () => {
  let requests=0;
  const result=await inferWithHermes("task-test","Find recent Celo MiniPay posts",sample,{
    baseUrl:"http://127.0.0.1:8642/v1",apiKey:"safe-local-private-test-key",model:"hermes-agent"
  },undefined,async (url,opts)=>{
    requests++;
    assert.equal(url,"http://127.0.0.1:8642/v1/chat/completions");
    assert.match(opts.headers.Authorization,/^Bearer /);
    assert.ok(!JSON.stringify(opts.body).includes("walletPrivateKey"));
    assert.equal(JSON.parse(opts.body).stream,false);
    return new Response(JSON.stringify({model:"hermes-agent",choices:[{message:{content:choice()}}]}),{status:200});
  });
  assert.equal(requests,1);
  assert.equal(result.isAiReasoning,true);
  assert.equal(result.selectedCapabilityId,"x.posts.search");
  assert.equal(result.engineModel,"Hermes Agent (hermes-agent)");
  assert.equal(result.requestEnvelope.url,sample[0].url);
  assert.deepEqual(result.requestEnvelope.body,{query:"Celo MiniPay",type:"latest"});
});

test("model-supplied URL, method and payment values never override catalog",()=>{
  const value=JSON.stringify({...JSON.parse(choice()),requestEnvelope:{url:"http://127.0.0.1:9999/admin",method:"DELETE",body:{query:"Celo MiniPay"}},url:"https://attacker.invalid"});
  const d=verifiedHermesDecision(value,"task","test",sample,"hermes-agent");
  assert.equal(d.requestEnvelope.url,sample[0].url);
  assert.equal(d.requestEnvelope.method,"POST");
});

test("untrusted or unavailable catalog selections reject rather than silently remap",()=>{
  assert.throws(()=>verifiedHermesDecision(choice("nonexistent"),"task","test",sample,"hermes"),/unavailable/);
  assert.throws(()=>verifiedHermesDecision(choice("x.posts.search"),"task","test",sample,"hermes","sqd.datasets"),/ignored operator-selected/);
});
test("required schema and unsupported extra fields reject model output",()=>{
  assert.throws(()=>verifiedHermesDecision(choice("x.posts.search",{}),"task","test",sample,"hermes"),/required/);
  assert.throws(()=>verifiedHermesDecision(choice("x.posts.search",{query:"test",privateKey:"leak"}),"task","test",sample,"hermes"),/unsupported/);
  assert.throws(()=>verifiedHermesDecision(choice("x.posts.search",{query:123}),"task","test",sample,"hermes"),/type mismatch/);
});
test("invalid model data never earns isAiReasoning true",()=>{
  for(const output of ["I selected X","[]","{}",
    JSON.stringify({...JSON.parse(choice()),confidenceScore:2}),
    JSON.stringify({...JSON.parse(choice()),reasoning:"bad"}),
  ])assert.throws(()=>verifiedHermesDecision(output,"task","test",sample,"hermes"));
});
test("Hermes API must only be a private local SSH tunnel",async()=>{
  for(const baseUrl of ["https://evil.example/v1","http://169.254.169.254:8642/v1","http://127.0.0.1:9999/v1","http://localhost:8642/secret"]) {
    await assert.rejects(()=>inferWithHermes("task","test",sample,{baseUrl,apiKey:"safe-local-private-test-key"}),/local SSH tunnel/);
  }
});
test("unavailable Hermes does not silently fake a model result",async()=>{
  await assert.rejects(()=>inferWithHermes("task","test",sample,{
    baseUrl:"http://127.0.0.1:8642/v1",apiKey:"safe-local-private-test-key"
  },undefined,async()=>new Response("unavailable",{status:503})),/HTTP 503/);
});
