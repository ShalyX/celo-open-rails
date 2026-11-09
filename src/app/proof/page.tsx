import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, FileCheck2, Fingerprint, LockKeyhole, ShieldCheck } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import paidProof from "../../../docs/evidence/paid-task-20261109.json";
import { PaidXResearch } from "@/components/PaidXResearch";

export const metadata: Metadata = {
  title: "Verified paid research proof | Celo Agent Procurement Desk",
  description: "Read-only, reproducible evidence from a genuine 0.005 USDC Buy task on Celo mainnet, with 18 purchased X records and ERC-8004 agent 10059.",
};

const paymentTx = "0xba529f67e679cfafb1ffeb6749cebd06cf967b0dc43ce6cf79b0255bcec63a61";
const registrationTx = "0xbac5c383f43d381d27313694cb4d5141d9d34817f266fdfa54e88eae7d88bd36";
const repo = "https://github.com/ShalyX/celo-open-rails";

const chainSteps = [
  { index: "01", heading: "Task", detail: "An operator requested X research about Celo MiniPay." },
  { index: "02", heading: "Quote", detail: "The gateway returned a genuine HTTP 402 price of 5,000 atomic USDC units." },
  { index: "03", heading: "Approval", detail: "A local operator accepted a 0.005 USDC cap for the exact request." },
  { index: "04", heading: "Buy + deliver", detail: "One charged request returned 18 records, saved with the task and receipt." },
];

export default function ProofPage() {
  const original = paidProof.record.execution.resultData;
  const rawTimeline = original?.output?.timeline ?? [];
  const timeline = rawTimeline.map((post) => ({
    tweet_id: post.tweet_id,
    screen_name: post.screen_name,
    text: post.text,
    created_at: post.created_at,
    favorites: post.favorites,
    retweets: post.retweets,
    replies: post.replies,
    views: post.views,
  }));
  const data = { output: { timeline } };
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-surface-border">
        <div className="max-w-6xl mx-auto px-5 py-5 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="inline-flex items-center justify-center h-9 w-9 border border-celo-green/40 rounded bg-celo-green/10 text-celo-green">
              <BrandMark className="w-6 h-6" aria-hidden="true"/>
            </span>
            <span className="text-xs sm:text-sm tracking-[0.18em] font-semibold font-mono">CELO PROCUREMENT DESK</span>
          </Link>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-celo-green">MAINNET · 42220</span>
            <Link className="text-foreground/70 underline underline-offset-4 hover:text-foreground" href="/">Operator desk (login)</Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5 py-9 sm:py-14 space-y-10">
        <section className="grid lg:grid-cols-[1.25fr_0.75fr] gap-8 items-end">
          <div className="space-y-5">
            <div className="text-xs tracking-[0.18em] uppercase font-mono text-celo-green">Recorded real transaction · 09 Nov 2026</div>
            <h1 className="text-4xl sm:text-6xl font-semibold tracking-[-0.035em] leading-[1.05]">
              A research question.<br/>
              <span className="text-celo-green">One bounded purchase.</span><br/>
              Evidence you can inspect.
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-foreground/65 max-w-2xl">
              A genuine paid service call using the Celo Buy gateway. The operator approved an exact price,
              received outside data, and preserved a verifiable transaction. This page is a <strong className="text-foreground">recorded result</strong>,
              not a replay or a new payment.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <a href={`https://celoscan.io/tx/${paymentTx}`} rel="noopener noreferrer" target="_blank"
                className="inline-flex items-center gap-2 px-4 py-3 rounded bg-celo-green text-background font-semibold hover:opacity-90">
                Confirm paid transfer <ArrowUpRight className="h-4 w-4" aria-hidden="true"/>
              </a>
              <a href={repo} rel="noopener noreferrer" target="_blank"
                className="inline-flex items-center gap-2 px-4 py-3 rounded border border-surface-border text-foreground/80 hover:border-celo-green/60">
                Inspect source <ArrowUpRight className="h-4 w-4" aria-hidden="true"/>
              </a>
            </div>
          </div>
          <div className="rounded-xl border border-surface-border bg-surface p-5 space-y-5">
            <p className="text-xs font-mono tracking-wider text-foreground/45 uppercase">Chain-verified receipt</p>
            <div className="grid grid-cols-2 gap-4">
              <div><div className="text-3xl font-semibold text-celo-green tabular-nums">18</div><div className="text-xs text-foreground/60">X posts returned</div></div>
              <div><div className="text-3xl font-semibold text-celo-gold tabular-nums">0.005</div><div className="text-xs text-foreground/60">USDC spent</div></div>
              <div><div className="text-xl font-semibold text-foreground tabular-nums">10059</div><div className="text-xs text-foreground/60">Our ERC-8004 agent ID</div></div>
              <div className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-celo-green" aria-hidden="true"/><div className="text-xs text-foreground/65">One paid task<br/>No second charge</div></div>
            </div>
            <div className="border-t border-surface-border pt-4 space-y-2 text-xs font-mono text-foreground/60">
              <div>Task: <span className="text-foreground/90 break-all">{paidProof.taskId}</span></div>
              <div>Block: <span className="text-foreground/90">{paidProof.blockNumber}</span></div>
              <div>Provider: <span className="text-foreground/90">Buy / x.posts.search</span></div>
            </div>
          </div>
        </section>

        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3" aria-label="Verified procurement workflow">
          {chainSteps.map(step => (
            <div key={step.index} className="p-4 rounded-lg border border-surface-border bg-surface space-y-3">
              <div className="text-celo-green text-xs font-mono">{step.index}</div>
              <h2 className="text-lg font-semibold">{step.heading}</h2>
              <p className="text-sm leading-relaxed text-foreground/60">{step.detail}</p>
            </div>
          ))}
        </section>

        <PaidXResearch data={data} objective="Search for Celo MiniPay"/>

        <section className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-surface-border p-5 space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2"><ShieldCheck className="text-celo-green w-5 h-5"/> Verify on Celo</h2>
            <p className="text-sm leading-relaxed text-foreground/65">The Buy payment is linked to this exact task and the public ERC-20 transfer. Our separate agent identity was registered on Celo mainnet as token 10059.</p>
            <div className="space-y-3 text-sm">
              <a className="flex items-center gap-2 text-celo-green hover:underline break-all"
                href={`https://celoscan.io/tx/${paymentTx}`} target="_blank" rel="noopener noreferrer">
                <FileCheck2 className="w-4 h-4 shrink-0"/> Payment transaction <ArrowUpRight className="w-3 h-3 shrink-0"/>
              </a>
              <a className="flex items-center gap-2 text-celo-green hover:underline break-all"
                href={`https://celoscan.io/tx/${registrationTx}`} target="_blank" rel="noopener noreferrer">
                <Fingerprint className="w-4 h-4 shrink-0"/> ERC-8004 registration <ArrowUpRight className="w-3 h-3 shrink-0"/>
              </a>
            </div>
          </div>
          <div className="rounded-xl border border-surface-border p-5 space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2"><LockKeyhole className="text-celo-gold w-5 h-5"/> Important boundaries</h2>
            <p className="text-sm text-foreground/65 leading-relaxed">
              This is recorded evidence from a local authenticated purchase. The live spending engine is currently disabled.
              Results come from one team-owned task, not an independent user study. Capability selection used labeled deterministic routing,
              not a claimed live LLM. External tweets remain source material, not verified facts or sentiment.
            </p>
          </div>
        </section>

        <footer className="border-t border-surface-border pt-6 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-foreground/50">
          <span>CELO PROCUREMENT DESK · REAL EVIDENCE, EXPLICIT LIMITS</span>
          <a href={repo} target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline underline-offset-4">Public code and reproducible proof</a>
        </footer>
      </div>
    </main>
  );
}
