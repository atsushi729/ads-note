import Link from "next/link";
import type { Problem } from "@/lib/types";
const diffClass: Record<string, string> = { Easy: "text-easy", Medium: "text-medium", Hard: "text-hard" };
export function ProblemCard({ problem: p }: { problem: Problem }) {
  return (
    <Link href={`/problems/${p.number}`}
      className="block rounded-card border border-line bg-canvas p-[18px] shadow-card transition-colors hover:border-fg">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[12px] text-fg-3">#{p.number}</span>
        <span className={`text-[12px] ${p.solved ? "text-easy" : "text-muted"}`}>{p.solved ? "✓ 解答済" : "○ 未着手"}</span>
      </div>
      <h3 className="mb-2 text-[15px] font-semibold text-fg">{p.title}</h3>
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <span className={`rounded-chip bg-panel-2 px-2 py-0.5 font-mono text-[11px] ${diffClass[p.difficulty]}`}>{p.difficulty}</span>
        {p.tags.map((t) => <span key={t} className="rounded-chip bg-panel-2 px-2 py-0.5 text-[11px] text-fg-3">{t}</span>)}
      </div>
      <div className="flex items-center justify-between border-t border-line pt-2 font-mono text-[11px] text-fg-3">
        <span>{p.steps.length} アプローチ</span>
        <span>更新 {p.created.slice(5).replace("-", "/")}</span>
      </div>
    </Link>
  );
}
