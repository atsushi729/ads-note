"use client";
import { useState } from "react";
import type { Concept } from "@/lib/types";
import { TopBar } from "@/components/layout/TopBar";
import { ConceptStats } from "@/components/layout/StatStrip";
import { FilterPanel, type Filters } from "./FilterPanel";
import { ConceptCard } from "./ConceptCard";
export function ConceptLibraryView({ concepts }: { concepts: Concept[] }) {
  const [filters, setFilters] = useState<Filters>({ difficulty: "すべて", tags: [], kind: "すべて", mastery: "すべて" });
  const filtered = concepts.filter((c) =>
    (filters.kind === "すべて" || c.kind === filters.kind) &&
    (filters.mastery === "すべて" || c.mastery === filters.mastery));
  return (
    <main className="mx-auto max-w-[1180px]">
      <TopBar variant="concepts" onSearchClick={() => {}} />
      <ConceptStats concepts={concepts} />
      <div className="flex">
        <FilterPanel variant="concepts" tags={[]} filters={filters} onChange={setFilters} />
        <div className="grid flex-1 grid-cols-2 gap-3.5 p-5">
          {filtered.map((c) => <ConceptCard key={c.id} concept={c} />)}
        </div>
      </div>
    </main>
  );
}
