export interface ResultDigest {
  headline: string;
  summary: string;
  observations: string[];
  method: "field-extraction" | "raw-only";
}

/**
 * Deterministic, source-backed digest. No fabricated citations, sentiment,
 * interpretation, invented counts or imitation of model reasoning.
 */
export function digestProviderResponse(data: unknown): ResultDigest {
  if (Array.isArray(data)) {
    const datasets = data.filter((v): v is Record<string, unknown> =>
      Boolean(v && typeof v === "object" && !Array.isArray(v) &&
        "dataset" in v && typeof (v as { dataset?: unknown }).dataset === "string")
    );
    if (datasets.length === data.length && data.length > 0) {
      const realtime = datasets.filter((d) => d.real_time === true).length;
      return {
        headline: "Blockchain dataset directory",
        summary: `The live provider returned ${data.length} datasets, including ${realtime} flagged real-time.`,
        observations: datasets.slice(0, 8).map((d) => String(d.dataset)),
        method: "field-extraction"
      };
    }
    return {
      headline: "Provider records delivered",
      summary: `The service returned ${data.length} records. Inspect the exact source payload below.`,
      observations: data.slice(0, 6).map((v, i) =>
        typeof v === "object" && v !== null
          ? String((v as Record<string, unknown>).title ||
              (v as Record<string, unknown>).name ||
              (v as Record<string, unknown>).id || `Record ${i + 1}`).slice(0, 160)
          : String(v).slice(0, 160)),
      method: "field-extraction"
    };
  }
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const choices = Array.isArray(obj.choices) ? obj.choices : [];
    const first = choices[0];
    if (first && typeof first === "object") {
      const msg = (first as Record<string, unknown>).message;
      if (msg && typeof msg === "object" && typeof (msg as Record<string, unknown>).content === "string") {
        return {
          headline: "Provider model response",
          summary: String((msg as Record<string, unknown>).content).slice(0, 2500),
          observations: [],
          method: "field-extraction"
        };
      }
    }
    const output = obj.output;
    if (typeof output === "string" && output.trim()) {
      return {
        headline: "Purchased provider output",
        summary: output.slice(0, 2500),
        observations: [],
        method: "field-extraction"
      };
    }
    if (Array.isArray(output)) {
      return {
        ...digestProviderResponse(output),
        headline: "Purchased provider records"
      };
    }
    if (obj.result !== undefined && obj.result !== null && typeof obj.result !== "object") {
      return {
        headline: "Provider result",
        summary: String(obj.result).slice(0, 2500),
        observations: [],
        method: "field-extraction"
      };
    }
    return {
      headline: "Structured provider data received",
      summary: "The provider returned an object. No supported summary fields were detected; inspect the authentic payload below.",
      observations: Object.keys(obj).slice(0, 8),
      method: "raw-only"
    };
  }
  return {
    headline: "Provider payload received",
    summary: data === null || data === undefined
      ? "The provider response was empty."
      : String(data).slice(0, 2500),
    observations: [],
    method: "raw-only"
  };
}
