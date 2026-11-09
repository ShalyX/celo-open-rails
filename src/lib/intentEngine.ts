import { IntentAnalysisResult, GatewayCapability } from "./types";
import { getLiveCatalog } from "./gateway";
import { inferWithHermes } from "./hermesIntent";

/**
 * Analyzes research objectives and maps them to an authoritative Gateway capability.
 * Supports real AI model reasoning when configured, with honest deterministic fallback.
 */
export async function analyzeIntent(
  objective: string,
  preselectedCapabilityId?: string
): Promise<IntentAnalysisResult> {
  const taskId = `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const catalog = await getLiveCatalog();
  const capabilities = catalog.capabilities;

  // Hermes is the primary, actual reasoning engine. If configured, it
  // FAILS CLOSED instead of quietly relabeling keyword matching as an agent.
  const hermesBase = process.env.HERMES_API_BASE_URL;
  const hermesKey = process.env.HERMES_API_KEY;
  if (hermesBase || hermesKey) {
    if (!hermesBase || !hermesKey) {
      throw new Error("Hermes is only partially configured: API URL and key are both required");
    }
    try {
      return await inferWithHermes(taskId, objective, capabilities, {
        baseUrl: hermesBase,
        apiKey: hermesKey,
        model: process.env.HERMES_MODEL || "hermes-agent",
      }, preselectedCapabilityId);
    } catch (error) {
      if (process.env.HERMES_ALLOW_DETERMINISTIC_FALLBACK !== "true") {
        throw new Error(
          "Hermes reasoning failed. No fallback was used. " +
          (error instanceof Error ? error.message : "Model service unavailable")
        );
      }
      console.warn("Explicitly enabled deterministic fallback after Hermes failure");
    }
  } else if (process.env.HERMES_ALLOW_DETERMINISTIC_FALLBACK !== "true") {
    // Default to honest failure, never silently substitute keyword rules.
    throw new Error("Hermes is required for AI procurement. Configure its private API connection.");
  }

  // Legacy providers exist for opt-in compatibility only when Hermes is absent.
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    try {
      return await callGeminiIntentEngine(taskId, objective, capabilities, geminiKey);
    } catch (err) {
      console.warn("Gemini intent analysis failed, engaging honest deterministic fallback:", err);
    }
  } else if (openaiKey) {
    try {
      return await callOpenAiIntentEngine(taskId, objective, capabilities, openaiKey);
    } catch (err) {
      console.warn("OpenAI intent analysis failed, engaging honest deterministic fallback:", err);
    }
  }

  // Honest deterministic fallback
  return runDeterministicMatcher(taskId, objective, capabilities, preselectedCapabilityId);
}

/**
 * Gemini-powered intent reasoning engine.
 */
async function callGeminiIntentEngine(
  taskId: string,
  objective: string,
  capabilities: GatewayCapability[],
  apiKey: string
): Promise<IntentAnalysisResult> {
  const model = "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const availableCapsSummary = capabilities
    .filter((c) => c.available)
    .map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      platform: c.platform,
      method: c.method,
      url: c.url,
      inputSchema: c.inputSchema,
    }));

  const systemPrompt = `You are the Celo Agent Procurement Desk Reasoning Engine.
Your job is to read the operator's research objective and choose the single best capability from the provided gateway catalog.
Construct the exact JSON request body required by its inputSchema.

Return ONLY a valid JSON object matching this schema:
{
  "selectedCapabilityId": string,
  "reasoning": string,
  "confidenceScore": number between 0 and 1,
  "requestEnvelope": {
    "method": "POST" or "GET",
    "url": string,
    "body": object matching the capability's inputSchema
  }
}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: `${systemPrompt}\n\nAvailable Capabilities:\n${JSON.stringify(availableCapsSummary, null, 2)}\n\nObjective: "${objective}"` },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini API error: HTTP ${res.status}`);
  }

  const data = await res.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error("Empty response from Gemini");
  }

  const parsed = JSON.parse(rawText);
  const matchedCap = capabilities.find((c) => c.id === parsed.selectedCapabilityId) || capabilities[0];

  return {
    taskId,
    objective,
    selectedCapabilityId: matchedCap.id,
    reasoning: parsed.reasoning || `Gemini selected ${matchedCap.title} for this research task.`,
    isAiReasoning: true,
    engineModel: `Google Gemini (${model})`,
    confidenceScore: parsed.confidenceScore || 0.95,
    requestEnvelope: {
      method: matchedCap.method,
      url: matchedCap.url,
      body: parsed.requestEnvelope?.body || { query: objective },
    },
    estimatedPricing: {
      pricingModel: matchedCap.pricingModel || "per_call",
      approximateUsd: matchedCap.price?.usd || "0.005",
      approximateAtomic: matchedCap.price?.atomic || "5000",
    },
  };
}

/**
 * OpenAI-powered intent reasoning engine.
 */
async function callOpenAiIntentEngine(
  taskId: string,
  objective: string,
  capabilities: GatewayCapability[],
  apiKey: string
): Promise<IntentAnalysisResult> {
  const model = "gpt-4o-mini";
  const url = "https://api.openai.com/v1/chat/completions";

  const availableCapsSummary = capabilities
    .filter((c) => c.available)
    .map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      platform: c.platform,
      method: c.method,
      url: c.url,
      inputSchema: c.inputSchema,
    }));

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are the Celo Agent Procurement Desk Reasoning Engine. Return JSON with { selectedCapabilityId, reasoning, confidenceScore, requestEnvelope: { method, url, body } }",
        },
        {
          role: "user",
          content: `Objective: ${objective}\n\nCapabilities: ${JSON.stringify(availableCapsSummary)}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI API error: HTTP ${res.status}`);
  }

  const data = await res.json();
  const parsed = JSON.parse(data.choices[0].message.content);
  const matchedCap = capabilities.find((c) => c.id === parsed.selectedCapabilityId) || capabilities[0];

  return {
    taskId,
    objective,
    selectedCapabilityId: matchedCap.id,
    reasoning: parsed.reasoning || `OpenAI model selected ${matchedCap.title}.`,
    isAiReasoning: true,
    engineModel: `OpenAI (${model})`,
    confidenceScore: parsed.confidenceScore || 0.92,
    requestEnvelope: {
      method: matchedCap.method,
      url: matchedCap.url,
      body: parsed.requestEnvelope?.body || { query: objective },
    },
    estimatedPricing: {
      pricingModel: matchedCap.pricingModel || "per_call",
      approximateUsd: matchedCap.price?.usd || "0.005",
      approximateAtomic: matchedCap.price?.atomic || "5000",
    },
  };
}

/**
 * Honest, rule-based deterministic matcher.
 * Explicitly labeled as fallback to guarantee truth in autonomy claims.
 */
function runDeterministicMatcher(
  taskId: string,
  objective: string,
  capabilities: GatewayCapability[],
  preselectedCapabilityId?: string
): IntentAnalysisResult {
  const lower = objective.toLowerCase();

  // If user preselected or forced a capability
  let target = preselectedCapabilityId
    ? capabilities.find((c) => c.id === preselectedCapabilityId)
    : undefined;

  let rationale = "";

  if (!target) {
    if (lower.includes("sqd") || lower.includes("dataset") || lower.includes("block head") || lower.includes("multi-chain")) {
      target = capabilities.find((c) => c.id === "sqd.datasets");
      rationale = "Selected official free SQD dataset directory for chain discovery; no payment needed.";
    } else if (/\b(x|twitter|tweet|tweets|social|sentiment|minipay)\b/.test(lower)) {
      target = capabilities.find((c) => c.id === "x.posts.search");
      rationale = "Targeted public X posts search based on keywords: 'x', 'twitter', 'tweet', 'celo', or 'sentiment'.";
    } else if (lower.includes("browser") || lower.includes("crawl") || lower.includes("inspect web") || lower.includes("html") || lower.includes("rent")) {
      target = capabilities.find((c) => c.id === "browser.sessions.create");
      rationale = "Matched browser automation based on keywords: 'browser', 'crawl', 'inspect', or 'html'.";
    } else if (lower.includes("reddit") || lower.includes("subreddit") || lower.includes("forum")) {
      target = capabilities.find((c) => c.id.includes("reddit"));
      rationale = "Matched Reddit search based on community keywords: 'reddit', 'subreddit'.";
    } else if (lower.includes("chainstack") || lower.includes("rpc") || lower.includes("batch")) {
      target = capabilities.find((c) => c.id === "chainstack.celo");
      rationale = "Matched Chainstack Celo RPC based on blockchain keywords: 'rpc', 'chainstack', 'batch'.";
    } else if (lower.includes("cencori") || lower.includes("llm") || lower.includes("completion") || lower.includes("chat")) {
      target = capabilities.find((c) => c.id === "cencori.v1.chat.completions");
      rationale = "Matched Cencori inference based on AI keywords: 'llm', 'chat', 'completion'.";
    } else if (lower.includes("instagram") || lower.includes("insta")) {
      target = capabilities.find((c) => c.id.includes("instagram"));
      rationale = "Matched Instagram profile lookups based on keywords.";
    } else if (lower.includes("youtube") || lower.includes("video")) {
      target = capabilities.find((c) => c.id.includes("youtube"));
      rationale = "Matched YouTube video search based on video keywords.";
    } else {
      // Default to premier capability: x.posts.search
      target = capabilities.find((c) => c.id === "x.posts.search") || capabilities[0];
      rationale = "Defaulted to primary general research capability (X Posts Search) for exploratory query.";
    }
  }

  const fallbackCap: GatewayCapability = {
    id: "x.posts.search",
    title: "Search X posts",
    description: "Search public X posts",
    available: true,
    method: "POST",
    url: "https://gateway.usebuy.ai/v1/social/x/posts/search",
    platform: "x",
    price: { atomic: "5000", usd: "0.005", tokens: ["USDC"] },
  };

  const resolvedTarget = target || capabilities[0] || fallbackCap;

  // Build input body complying with capability inputSchema
  let requestBody: Record<string, unknown> = {};

  if (resolvedTarget.id === "sqd.datasets") {
    requestBody = {};
  } else if (resolvedTarget.id === "x.posts.search") {
    // Clean query text
    const cleanQuery = objective.replace(/(search for|find|look up|get|query)\s+/i, "").trim() || "Celo agents";
    requestBody = {
      query: cleanQuery.slice(0, 500),
      type: "latest",
    };
  } else if (resolvedTarget.id === "browser.sessions.create") {
    requestBody = {
      durationMinutes: 1,
    };
  } else if (resolvedTarget.id === "chainstack.celo") {
    requestBody = {
      jsonrpc: "2.0",
      id: 1,
      method: "eth_blockNumber",
      params: [],
    };
  } else if (resolvedTarget.id === "cencori.v1.chat.completions") {
    requestBody = {
      model: "maximo-atlas-1.3",
      max_tokens: 256,
      messages: [{ role: "user", content: objective }],
    };
  } else if (resolvedTarget.inputSchema?.properties?.queryParams) {
    requestBody = {
      queryParams: {
        query: objective,
      },
    };
  } else {
    requestBody = {
      query: objective,
    };
  }

  return {
    taskId,
    objective,
    selectedCapabilityId: resolvedTarget.id,
    reasoning: rationale,
    isAiReasoning: false,
    engineModel: "Deterministic Schema Matcher (Fallback Engine — AI Unverified)",
    confidenceScore: 0.88,
    requestEnvelope: {
      method: resolvedTarget.method,
      url: resolvedTarget.url,
      body: requestBody,
    },
    estimatedPricing: {
      pricingModel: resolvedTarget.pricingModel || "per_call",
      approximateUsd: resolvedTarget.price?.usd || "0.005",
      approximateAtomic: resolvedTarget.price?.atomic || "5000",
    },
  };
}
