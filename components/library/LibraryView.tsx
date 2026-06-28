"use client";
import { useEffect, useMemo, useState } from "react";
import type { Problem } from "@/lib/types";
import { TopBar } from "@/components/layout/TopBar";
import { ProblemStats } from "@/components/layout/StatStrip";
import { FilterPanel, type Filters } from "./FilterPanel";
import { ProblemCard } from "./ProblemCard";
import { CommandPalette } from "@/components/search/CommandPalette";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
export function LibraryView({ problems }: { problems: Problem[] }) {
  const [filters, setFilters] = useState<Filters>({ difficulty: "すべて", tags: [], kind: "すべて", mastery: "すべて" });
  const [paletteOpen, setPaletteOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPaletteOpen(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const tags = useMemo(() => [...new Set(problems.flatMap((p) => p.tags))], [problems]);
  const filtered = problems.filter((p) =>
    (filters.difficulty === "すべて" || p.difficulty === filters.difficulty) &&
    (filters.tags.length === 0 || filters.tags.every((t) => p.tags.includes(t))));
  return (
    <main className="mx-auto max-w-[1180px] pb-16 md:pb-0">
      <TopBar variant="problems" onSearchClick={() => setPaletteOpen(true)} />
      <ProblemStats problems={problems} />
      <div className="flex">
        <div className="hidden md:block"><FilterPanel variant="problems" tags={tags} filters={filters} onChange={setFilters} /></div>
        <div className="grid flex-1 grid-cols-1 gap-3.5 p-5 md:grid-cols-2">
          {filtered.map((p) => <ProblemCard key={p.number} problem={p} />)}
        </div>
      </div>
      <CommandPalette problems={problems} open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <BottomTabBar active="library" />
    </main>
  );
}
