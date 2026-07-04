"use client";
import type { Difficulty, Kind } from "@/lib/types";
export interface Filters {
  difficulty: "すべて" | Difficulty;
  tags: string[];
  kind: "すべて" | Kind;
}
const row = "block w-full rounded-chip px-3 py-1.5 text-left text-[13px] transition-colors";
function Item({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`${row} ${active ? "bg-panel-2 font-semibold text-fg" : "text-fg-3 hover:text-fg"}`}>{children}</button>;
}
export function FilterPanel({ variant, tags, filters, onChange }: {
  variant: "problems" | "concepts"; tags: string[]; filters: Filters; onChange: (f: Filters) => void;
}) {
  const heading = "mb-2 mt-5 text-[11px] font-semibold text-fg-3 first:mt-0";
  if (variant === "problems") {
    const diffs: ("すべて" | Difficulty)[] = ["すべて", "Easy", "Medium", "Hard"];
    return (
      <aside className="w-[196px] shrink-0 border-r border-line px-3 py-5">
        <div className={heading}>難易度</div>
        {diffs.map((d) => (
          <Item key={d} active={filters.difficulty === d} onClick={() => onChange({ ...filters, difficulty: d })}>{d === "すべて" ? "すべて" : d}</Item>
        ))}
        <div className={heading}>タグ</div>
        <div className="flex flex-wrap gap-1.5 px-1">
          {tags.map((t) => {
            const on = filters.tags.includes(t);
            return (
              <button key={t} onClick={() => onChange({ ...filters, tags: on ? filters.tags.filter((x) => x !== t) : [...filters.tags, t] })}
                className={`rounded-chip border px-2 py-1 text-[12px] ${on ? "border-accent text-accent" : "border-line text-fg-3"}`}>{t}</button>
            );
          })}
        </div>
      </aside>
    );
  }
  const kinds: ("すべて" | Kind)[] = ["すべて", "構造", "アルゴ"];
  const kindLabel = (k: string) => (k === "構造" ? "データ構造" : k === "アルゴ" ? "アルゴリズム" : "すべて");
  return (
    <aside className="w-[196px] shrink-0 border-r border-line px-3 py-5">
      <div className={heading}>種別</div>
      {kinds.map((k) => <Item key={k} active={filters.kind === k} onClick={() => onChange({ ...filters, kind: k })}>{kindLabel(k)}</Item>)}
    </aside>
  );
}
