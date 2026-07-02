"use client";
import { useMemo, useState } from "react";
import type { Problem } from "@/lib/types";
import { TopBar } from "@/components/layout/TopBar";
import { FilterPanel, type Filters } from "./FilterPanel";
import { ProblemCard } from "./ProblemCard";
import { CommandPalette } from "@/components/search/CommandPalette";
export function LibraryView({ problems }: { problems: Problem[] }) {
  const [filters, setFilters] = useState<Filters>({ difficulty: "すべて", tags: [], kind: "すべて", mastery: "すべて" });
  const [paletteOpen, setPaletteOpen] = useState(false);
  const tags = useMemo(() => [...new Set(problems.flatMap((p) => p.tags))], [problems]);
  const filtered = problems.filter((p) =>
    (filters.difficulty === "すべて" || p.difficulty === filters.difficulty) &&
    (filters.tags.length === 0 || filters.tags.every((t) => p.tags.includes(t))));
  return (
    <main className="mx-auto max-w-[1180px]">
      <TopBar variant="problems" onSearchClick={() => setPaletteOpen(true)} />
      <div className="flex">
        <div className="hidden md:block"><FilterPanel variant="problems" tags={tags} filters={filters} onChange={setFilters} /></div>
        <div className="grid flex-1 grid-cols-1 gap-3.5 p-5 md:grid-cols-2">
          {filtered.map((p) => <ProblemCard key={p.number} problem={p} />)}
        </div>
      </div>
      <CommandPalette problems={problems} open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </main>
  );
}
