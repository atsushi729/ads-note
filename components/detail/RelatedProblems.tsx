import Link from "next/link";
import type { Problem } from "@/lib/types";
const diffClass: Record<string, string> = { Easy: "text-easy", Medium: "text-medium", Hard: "text-hard" };
export function RelatedProblems({ problems }: { problems: Problem[] }) {
  return (
    <div className="my-3 divide-y divide-line rounded-block border border-line">
      {problems.map((p) => (
        <Link key={p.number} href={`/problems/${p.number}`} className="flex items-center gap-3 px-4 py-3 hover:bg-panel">
          <span className="font-mono text-[12px] text-fg-3">#{p.number}</span>
          <span className="flex-1 text-[14px] font-semibold text-fg">{p.title}</span>
          <span className={`rounded-chip bg-panel-2 px-2 py-0.5 font-mono text-[11px] ${diffClass[p.difficulty]}`}>{p.difficulty}</span>
          <span className={`text-[12px] ${p.solved ? "text-easy" : "text-muted"}`}>{p.solved ? "✓ 解答済" : "○ 未着手"}</span>
        </Link>
      ))}
    </div>
  );
}
