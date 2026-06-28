"use client";
import type { Problem, Step } from "@/lib/types";
import { TocRail } from "./TocRail";
import { StepBlock } from "./StepBlock";
import { Markdown } from "@/components/markdown/Markdown";
import { ConceptChips } from "./ConceptChips";
import type { Concept } from "@/lib/types";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
const diffClass: Record<string, string> = { Easy: "text-easy", Medium: "text-medium", Hard: "text-hard" };
export function ProblemDetail({ problem, highlights, concepts }: {
  problem: Problem; highlights: { light: string; dark: string }[]; concepts: Concept[];
}) {
  const toc = [
    { id: "question", label: "問題・制約" },
    ...problem.steps.map((s: Step) => ({ id: `step-${s.index}`, label: `Step ${s.index}` })),
  ];
  return (
    <div className="mx-auto flex max-w-[1100px] pb-16 md:pb-0">
      <div className="hidden md:block"><TocRail backHref="/" backLabel="ライブラリ" items={toc} /></div>
      <article className="max-w-[760px] flex-1 px-5 py-6 md:px-[38px] md:py-[30px]">
        <div className="mb-3 flex items-center gap-2 font-mono text-[12px] text-fg-3">
          <span>#{problem.number}</span>
          <span className={`rounded-chip bg-panel-2 px-2 py-0.5 ${diffClass[problem.difficulty]}`}>{problem.difficulty}</span>
          {problem.tags.map((t) => <span key={t}>{t}</span>)}
          {problem.source && <a href={problem.source} className="ml-auto text-accent-deep">leetcode ↗</a>}
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
      <BottomTabBar active="library" />
    </div>
  );
}
