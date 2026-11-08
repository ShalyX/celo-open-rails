# Engineering Learnings & Operational Insights

## 2026-11-08: HTTP 402 Preflight Challenge Quoting vs CLI Subcommand

### Context & Problem
When attempting an unpaid price quote using `buy quote` with `--data` against `https://gateway.usebuy.ai/v1/social/x/posts/search`, the CLI returned:
```json
{"error":{"code":"unknown","message":"refusing to pay: 4 transfers would each receive the authorization, and only one was challenged","details":{"transfers":4}}}
```
This error occurred despite using the `--quote` flag which is designed not to pay.

### Root Cause
The `buy quote` subcommand in `@celo/buy@0.8.4` evaluates the multi-token payment challenge returned by the gateway (which advertises USDC, USDT, and USAT offers on Celo mainnet, plus Celo Sepolia sandbox offers). When multiple transfer options are present and no specific asset filter is provided, the CLI's internal safety gate halts rather than guessing which asset challenge to authoritatively quote.

### Solution & Better Way
To obtain an authoritative, reliable 402 challenge without triggering wallet signer safety assertions:
Dispatch a standard HTTP request (via Node.js `fetch` or HTTP client) directly to the target gateway endpoint with the intended JSON body and `Content-Type: application/json`, without any payment headers. The gateway responds with HTTP 402:
1. Header `payment-required`: base64-encoded `x402-v2` envelope containing network, asset, and payment parameters.
2. Body: JSON object with `x402Version`, `accepts` array detailing each supported asset (network, atomic `amount` / `maxAmountRequired`, `payTo`, and `extra` metadata).

### Key Takeaway & Prevention
Direct HTTP 402 preflight inspection is completely wallet-independent, zero-cost, immune to keystore assertions, and gives 100% fidelity to upstream pricing requirements.

---

## 2026-11-08: Celo Mainnet USDC Settlement & Nonce Verification

### Context & Problem
Distinguishing between settled transactions, uncertain settlements (`500 settle_uncertain`), and uncharged requests is essential to prevent double-spending and ensure accurate receipts.

### Root Cause
Unlike standard ERC-20 `transfer`, the buy gateway utilizes gasless EIP-3009 `transferWithAuthorization`. The spender signs an off-chain authorization with an explicit `nonce`, `validAfter`, and `validBefore`. If a network timeout occurs after submitting the authorization, the client cannot know from HTTP status alone whether the gateway relayer broadcasted the transaction.

### Solution & Better Way
1. Always store the EIP-3009 `nonce`, `from`, `to`, and `validBefore` alongside the request idempotency token.
2. To resolve ambiguous settlements (`settle_uncertain`), query the Celo RPC (`eth_getTransactionReceipt` or token `authorizationState(authorizer, nonce)`) before ever allowing a retry.
3. For historical audit tracking, verify transaction receipt logs against the Celo canonical USDC contract (`0xcebA9300f2b948710d2653dD7B07f33A8B32118C`) and topic `Transfer(address,address,uint256)`.

### Key Takeaway & Prevention
Never automatically retry a paid call upon timeout. Record the ambiguity and require on-chain nonce state inspection.
