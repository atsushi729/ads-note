import type { Problem, Concept } from "@/lib/types";
function Cell({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 border-r border-line px-5 py-4 last:border-r-0">{children}</div>;
}
const label = "text-[11px] text-fg-3 mb-1";
const big = "font-mono text-[26px] font-extrabold leading-none";
export function ProblemStats({ problems }: { problems: Problem[] }) {
  const solved = problems.filter((p) => p.solved).length;
  const e = problems.filter((p) => p.difficulty === "Easy").length;
  const m = problems.filter((p) => p.difficulty === "Medium").length;
  const h = problems.filter((p) => p.difficulty === "Hard").length;
  const total = Math.max(1, e + m + h);
  return (
    <div className="flex border-b border-line">
      <Cell><div className={label}>解いた問題</div><div className={big}>{solved} <span className="text-[15px] text-muted">/ {problems.length}</span></div></Cell>
      <Cell>
        <div className={label}>難易度</div>
        <div className="mb-2 font-mono text-[13px]"><span className="text-easy">易 {e}</span> <span className="text-medium">中 {m}</span> <span className="text-hard">難 {h}</span></div>
        <div className="flex h-1.5 overflow-hidden rounded-full">
          <span className="bg-easy" style={{ width: `${(e/total)*100}%` }} />
          <span className="bg-medium" style={{ width: `${(m/total)*100}%` }} />
          <span className="bg-hard" style={{ width: `${(h/total)*100}%` }} />
        </div>
      </Cell>
      <Cell><div className={label}>今週</div><div className={big}>9 <span className="text-[15px] text-muted">問</span></div></Cell>
      <Cell><div className={label}>連続記録</div><div className={big}>12 <span className="text-[15px] text-muted">日 🔥</span></div></Cell>
    </div>
  );
}
export function ConceptStats({ concepts }: { concepts: Concept[] }) {
  const c = (m: string) => concepts.filter((x) => x.mastery === m).length;
  return (
    <div className="flex gap-4 border-b border-line px-5 py-3 font-mono text-[13px]">
      <span className="font-semibold">{concepts.length} 概念</span>
      <span className="text-easy">習得 {c("習得")}</span>
      <span className="text-medium">復習中 {c("復習中")}</span>
      <span className="text-muted">未学習 {c("未学習")}</span>
    </div>
  );
}
