"use client";

import { useState } from "react";
import { ExternalLink, MessageCircle, Repeat2, Heart, ListFilter } from "lucide-react";
import { extractXSearchResults } from "@/lib/xResearch";

function compact(value: number | null): string {
  if (value === null) return "—";
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}
function readableDate(value: string | null): string {
  if (!value) return "Date not reported";
  return new Date(value).toLocaleDateString("en", { dateStyle: "medium" });
}

export function PaidXResearch({ data, objective }: { data: unknown; objective: string }) {
  const result = extractXSearchResults(data);
  const [showAll, setShowAll] = useState(false);
  if (!result) return null;
  const shown = showAll ? result.posts : result.posts.slice(0, 6);
  return (
    <section className="scroll-mt-20 rounded-xl border border-celo-green/30 bg-[#101d1b] p-4 sm:p-6 space-y-5" aria-label="Paid research results">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase font-mono text-celo-green">
            <ListFilter className="w-4 h-4" aria-hidden="true" /> Purchased source material
          </div>
          <h3 className="text-xl font-semibold tracking-tight text-foreground">X research results</h3>
          <p className="text-sm leading-relaxed text-foreground/75">{objective}</p>
        </div>
        <div className="rounded-lg border border-celo-green/30 bg-celo-green/10 px-4 py-3 text-right">
          <div className="text-3xl font-semibold tabular-nums text-celo-green">{result.total}</div>
          <div className="text-[10px] tracking-wide uppercase font-mono text-foreground/60">Posts returned</div>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-foreground/60">
        These are actual records returned by the paid provider, with links to their original posts when available.
        Counts are observations from the returned sample—not proof of sentiment, reach, user demand, or completeness.
        {result.postDateRange.earliest && result.postDateRange.latest
          ? ` Observed post dates: ${readableDate(result.postDateRange.earliest)} – ${readableDate(result.postDateRange.latest)}.`
          : ""}
      </p>
      {shown.length === 0 ? (
        <div className="border border-dashed border-surface-border rounded-lg p-6 text-sm text-foreground/60">
          No readable posts were found in this provider response. The original JSON is retained below.
        </div>
      ) : (
        <ol className="space-y-3">
          {shown.map((post, index) => (
            <li key={post.id || index} className="rounded-lg border border-surface-border bg-surface p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-medium text-sm text-foreground">
                  {post.handle ? `@${post.handle}` : "Unidentified source"}
                  <span className="text-xs font-normal font-mono text-foreground/45 ml-3">{readableDate(post.createdAt)}</span>
                </div>
                {post.sourceUrl && (
                  <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs inline-flex items-center gap-1 text-celo-green hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-celo-green">
                    Source post <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                )}
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap break-words">{post.text}</p>
              <div className="flex flex-wrap gap-5 text-[11px] font-mono text-foreground/55">
                <span className="inline-flex items-center gap-1"><Heart className="w-3 h-3" aria-hidden="true" /> {compact(post.likes)} likes</span>
                <span className="inline-flex items-center gap-1"><Repeat2 className="w-3 h-3" aria-hidden="true" /> {compact(post.reposts)} reposts</span>
                <span className="inline-flex items-center gap-1"><MessageCircle className="w-3 h-3" aria-hidden="true" /> {compact(post.replies)} replies</span>
                <span>{compact(post.views)} reported views</span>
              </div>
            </li>
          ))}
        </ol>
      )}
      {result.posts.length > 6 && (
        <button type="button" onClick={() => setShowAll(!showAll)}
          className="w-full rounded-md border border-surface-border bg-surface-subtle px-4 py-3 text-sm font-medium hover:border-celo-green/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-celo-green">
          {showAll ? "Show first 6 posts" : `Show all ${result.total} returned posts`}
        </button>
      )}
      <div className="text-[11px] text-foreground/45">
        Source data is preserved for verification. This view extracts fields; it does not claim model-generated analysis.
      </div>
    </section>
  );
}
