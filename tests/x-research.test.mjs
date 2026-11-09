import test from "node:test";
import assert from "node:assert/strict";
import { extractXSearchResults } from "../src/lib/xResearch.ts";

test("actual paid X schema renders source-backed count, texts, fields, safe source links", () => {
  const payload = { output: { timeline: [
    { tweet_id:"1234567890123", screen_name:"celo_dev", text:"MiniPay wallets are active",
      favorites:7, retweets:2, replies:1, views:"120", created_at:"2026-11-08T12:00:00Z" },
    { tweet_id:"1234567890124", screen_name:"someone", text:"Celo and MiniPay update",
      favorites:3, retweets:0, replies:0, views:"45", created_at:"2026-11-09T12:00:00Z" }
  ]}};
  const r = extractXSearchResults(payload);
  assert.equal(r?.total, 2);
  assert.equal(r?.observedLikes, 10);
  assert.equal(r?.posts[0].sourceUrl, "https://x.com/celo_dev/status/1234567890123");
  assert.equal(r?.posts[0].text, "MiniPay wallets are active");
  assert.equal(r?.postDateRange.earliest, "2026-11-08T12:00:00.000Z");
});
test("untrusted X handle/id cannot create unsafe or injected links", () => {
  const payload={ output:{timeline:[
    {tweet_id:"javascript:alert(1)",screen_name:"bad",text:"Test"},
    {tweet_id:"1234567890123",screen_name:"a/b@fake",text:"Test 2"},
    {tweet_id:"1234567890123",screen_name:"safe",text:"Test 3"}
  ]}};
  const r=extractXSearchResults(payload);
  assert.equal(r?.total,3);
  assert.equal(r?.posts[0].sourceUrl,null);
  assert.equal(r?.posts[1].sourceUrl,null);
  assert.equal(r?.posts[2].sourceUrl,"https://x.com/safe/status/1234567890123");
});
test("unrelated or malformed response is not presented as X research", () => {
  assert.equal(extractXSearchResults({output:"fake"}),null);
  assert.equal(extractXSearchResults({items:[{text:"hello"}]}),null);
  assert.equal(extractXSearchResults(null),null);
  const bad=extractXSearchResults({output:{timeline:[{},null,{tweet_id:"1",text:""}]}});
  assert.equal(bad?.total,0);
});
