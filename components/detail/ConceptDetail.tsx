import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { Concept, Problem } from "@/lib/types";
import { TocRail } from "./TocRail";
import { Markdown } from "@/components/markdown/Markdown";
import { ComplexityTable } from "./ComplexityTable";
import { RelatedProblems } from "./RelatedProblems";
export function ConceptDetail({
  concept,
  problems,
}: {
  concept: Concept;
  problems: Problem[];
}) {
  return (
    <div className="mx-auto flex max-w-[1100px]">
      <div className="hidden md:block">
        <TocRail
          backHref="/concepts"
          backLabel="概念ライブラリ"
          items={[
            { id: "overview", label: "概要" },
            { id: "complexity", label: "計算量" },
            { id: "related", label: "関連する問題" },
            ...(concept.studyNote ? [{ id: "note", label: "学習メモ" }] : []),
          ]}
        />
      </div>
      <article className="max-w-[760px] flex-1 px-5 py-6 md:px-[38px] md:py-[30px]">
        <Link
          href="/concepts"
          className="mb-5 inline-flex items-center rounded-chip border border-line px-3 py-2 text-[13px] font-semibold text-fg-2 hover:text-fg md:hidden"
        >
          ← Back to library
        </Link>
        <div className="mb-3 flex items-center gap-2 text-[12px]">
          <span className="rounded-chip bg-panel-2 px-2 py-0.5 text-fg-3">
            {concept.kind === "構造" ? "データ構造" : "アルゴ"}
          </span>
          <span className="ml-auto flex items-center gap-3">
            <Link
              href={`/chat?concept=${concept.id}`}
              className="flex items-center gap-1 text-accent-deep"
            >
              <Sparkles size={12} /> AIに質問
            </Link>
            <span className="font-mono text-accent-deep">
              関連 {concept.problemNumbers.length} 問題
            </span>
          </span>
        </div>
        <h1
          className="text-[30px] font-extrabold tracking-[-0.025em]"
          id="overview"
        >
          {concept.name}
        </h1>
        <p className="mb-4 text-[13px] text-fg-3">{concept.nameJa}</p>
        <div className="mb-2 text-[11px] font-semibold text-fg-3">概要</div>
        <Markdown>{concept.note}</Markdown>
        <h2 className="mb-2 mt-8 text-[18px] font-bold" id="complexity">
          計算量
        </h2>
        <ComplexityTable rows={concept.complexity} />
        <h2 className="mb-2 mt-8 text-[18px] font-bold" id="related">
          関連する問題
        </h2>
        <RelatedProblems problems={problems} />
        {concept.studyNote && (
          <>
            <h2 className="mb-2 mt-8 text-[18px] font-bold" id="note">
              学習メモ
            </h2>
            <div className="rounded-block border-l-[3px] border-accent bg-panel px-4 py-3">
              <Markdown>{concept.studyNote}</Markdown>
            </div>
          </>
        )}
      </article>
    </div>
  );
}
