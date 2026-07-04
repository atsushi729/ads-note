"use client";
import { useState } from "react";
import type { Concept } from "@/lib/types";
import { TopBar } from "@/components/layout/TopBar";
import { TabBar } from "@/components/layout/TabBar";
import { FilterPanel, type Filters } from "./FilterPanel";
import { ConceptCard } from "./ConceptCard";
import { ConceptCommandPalette } from "@/components/search/ConceptCommandPalette";

export function ConceptLibraryView({ concepts }: { concepts: Concept[] }) {
  const [filters, setFilters] = useState<Filters>({ difficulty: "すべて", tags: [], kind: "すべて" });
  const [paletteOpen, setPaletteOpen] = useState(false);
  const filtered = concepts.filter((c) => filters.kind === "すべて" || c.kind === filters.kind);
  return (
    <main className="mx-auto max-w-[1180px]">
      <TopBar variant="concepts" onSearchClick={() => setPaletteOpen(true)} />
      <TabBar active="concepts" />
      <div className="flex">
        <div className="hidden md:block"><FilterPanel variant="concepts" tags={[]} filters={filters} onChange={setFilters} /></div>
        <div className="grid flex-1 grid-cols-1 gap-3.5 p-5 md:grid-cols-2">
          {filtered.map((c) => <ConceptCard key={c.id} concept={c} />)}
        </div>
      </div>
      <ConceptCommandPalette concepts={concepts} open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </main>
  );
}
