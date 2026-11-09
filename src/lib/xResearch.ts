/** Read-only, source-backed presentation of a paid X search response.
 * Never infer sentiment, independence, reach, or market demand from these records.
 */
export interface ObservedXPost {
  id: string;
  handle: string | null;
  text: string;
  createdAt: string | null;
  likes: number | null;
  reposts: number | null;
  replies: number | null;
  views: number | null;
  sourceUrl: string | null;
}

function nonnegativeNumber(value: unknown): number | null {
  if (typeof value !== "number" && typeof value !== "string") return null;
  const num = Number(value);
  return Number.isFinite(num) && num >= 0 && Number.isSafeInteger(num) ? num : null;
}
/** Decode only common provider-escaped entities for readable plain text.
 * React still escapes the resulting string. Raw payload is retained untouched.
 */
function readableText(input: string): string {
  return input.replace(/&(amp|lt|gt|quot|apos|#39);/gi, (match, name: string) => {
    const replacements: Record<string,string> = {
      amp:"&",lt:"<",gt:">",quot:'"',apos:"'", "#39":"'"
    };
    return replacements[name.toLowerCase()] ?? match;
  });
}
function stringField(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
function asObject(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown> : null;
}

export function extractXSearchResults(data: unknown): {
  total: number;
  posts: ObservedXPost[];
  observedLikes: number;
  postDateRange: { earliest: string | null; latest: string | null };
} | null {
  const root = asObject(data);
  const output = asObject(root?.output);
  if (!output || !Array.isArray(output.timeline)) return null;
  const posts: ObservedXPost[] = [];
  for (const entry of output.timeline) {
    const post = asObject(entry);
    if (!post) continue;
    const id = stringField(post.tweet_id) || "";
    const handle = stringField(post.screen_name);
    const validId = /^\d{5,25}$/.test(id);
    const validHandle = Boolean(handle && /^[a-zA-Z0-9_]{1,15}$/.test(handle));
    const text = stringField(post.text);
    if (!text) continue;
    const createdAt = stringField(post.created_at);
    posts.push({
      id,
      handle,
      text: readableText(text),
      createdAt: createdAt && Number.isFinite(Date.parse(createdAt)) ? new Date(createdAt).toISOString() : null,
      likes: nonnegativeNumber(post.favorites),
      reposts: nonnegativeNumber(post.retweets),
      replies: nonnegativeNumber(post.replies),
      views: nonnegativeNumber(post.views),
      sourceUrl: validId && validHandle
        ? `https://x.com/${handle}/status/${id}`
        : null,
    });
  }
  const dates = posts.map(p => p.createdAt).filter((s): s is string => Boolean(s)).sort();
  return {
    total: posts.length,
    posts,
    observedLikes: posts.reduce((sum, post) => sum + (post.likes ?? 0), 0),
    postDateRange: {
      earliest: dates[0] ?? null,
      latest: dates[dates.length - 1] ?? null,
    }
  };
}
