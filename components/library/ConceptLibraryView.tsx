"use client";
import { useState } from "react";
import type { Concept } from "@/lib/types";
import { TopBar } from "@/components/layout/TopBar";
import { ConceptStats } from "@/components/layout/StatStrip";
import { FilterPanel, type Filters } from "./FilterPanel";
import { ConceptCard } from "./ConceptCard";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
export function ConceptLibraryView({ concepts }: { concepts: Concept[] }) {
  const [filters, setFilters] = useState<Filters>({ difficulty: "すべて", tags: [], kind: "すべて", mastery: "すべて" });
  const filtered = concepts.filter((c) =>
    (filters.kind === "すべて" || c.kind === filters.kind) &&
    (filters.mastery === "すべて" || c.mastery === filters.mastery));
  return (
    <main className="mx-auto max-w-[1180px] pb-16 md:pb-0">
      <TopBar variant="concepts" onSearchClick={() => {}} />
      <ConceptStats concepts={concepts} />
      <div className="flex">
        <div className="hidden md:block"><FilterPanel variant="concepts" tags={[]} filters={filters} onChange={setFilters} /></div>
        <div className="grid flex-1 grid-cols-1 gap-3.5 p-5 md:grid-cols-2">
          {filtered.map((c) => <ConceptCard key={c.id} concept={c} />)}
        </div>
      </div>
      <BottomTabBar active="library" />
    </main>
  );
}
