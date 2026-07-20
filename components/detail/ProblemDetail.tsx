"use client";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { Problem, Step } from "@/lib/types";
import { TocRail } from "./TocRail";
import { StepBlock } from "./StepBlock";
import { Markdown } from "@/components/markdown/Markdown";
import { ConceptChips } from "./ConceptChips";
import type { Concept } from "@/lib/types";
const diffClass: Record<string, string> = { Easy: "text-easy", Medium: "text-medium", Hard: "text-hard" };
export function ProblemDetail({ problem, highlights, concepts }: {
  problem: Problem; highlights: { light: string; dark: string }[]; concepts: Concept[];
}) {
  const toc = [
    { id: "question", label: "問題・制約" },
    ...problem.steps.map((s: Step) => ({ id: `step-${s.index}`, label: `Step ${s.index}` })),
  ];
  return (
    <div className="mx-auto flex w-full min-w-0 max-w-[1100px] overflow-x-hidden">
      <div className="hidden md:block"><TocRail backHref="/" backLabel="ライブラリ" items={toc} /></div>
      <article className="min-w-0 max-w-[760px] flex-1 px-5 py-6 md:px-[38px] md:py-[30px]">
        <Link
          href="/"
          className="mb-5 inline-flex items-center rounded-chip border border-line px-3 py-2 text-[13px] font-semibold text-fg-2 hover:text-fg md:hidden"
        >
          ← Back to library
        </Link>
        <div className="mb-3 flex min-w-0 flex-wrap items-center gap-2 font-mono text-[12px] text-fg-3">
          <span className="shrink-0">#{problem.number}</span>
          <span className={`rounded-chip bg-panel-2 px-2 py-0.5 ${diffClass[problem.difficulty]}`}>{problem.difficulty}</span>
          {problem.tags.map((t) => <span key={t}>{t}</span>)}
          <span className="flex items-center gap-2 md:ml-auto">
            <Link
              href={`/chat?problem=${problem.number}`}
              className="inline-flex items-center gap-1 rounded-chip border border-accent/30 bg-accent/10 px-2.5 py-1 font-semibold text-accent-deep transition-colors hover:border-accent hover:bg-accent/20"
            >
              <Sparkles size={12} /> AIに質問
            </Link>
            {problem.source && (
              <a
                href={problem.source}
                className="inline-flex items-center rounded-chip border border-line px-2.5 py-1 text-fg-2 transition-colors hover:border-fg hover:bg-panel-2 hover:text-fg"
              >
                leetcode ↗
              </a>
            )}
          </span>
        </div>
        <h1 className="mb-4 text-[30px] font-extrabold tracking-[-0.025em]" id="question">{problem.title}</h1>
        <Markdown>{problem.question}</Markdown>
        {concepts.length > 0 && <ConceptChips concepts={concepts} />}
        <h2 className="mb-3 mt-8 text-[18px] font-bold">アプローチ</h2>
        {problem.steps.map((s, i) => (
          <div key={s.index} id={`step-${s.index}`}>
            <StepBlock step={s} highlighted={highlights[i]} defaultOpen={i === 0} />
          </div>
        ))}
      </article>
    </div>
  );
}
