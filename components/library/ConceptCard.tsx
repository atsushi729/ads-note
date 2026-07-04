import Link from "next/link";
import type { Concept } from "@/lib/types";
export function ConceptCard({ concept: c }: { concept: Concept }) {
  return (
    <Link href={`/concepts/${c.id}`}
      className="block rounded-card border border-line bg-canvas p-[18px] shadow-card transition-colors hover:border-fg">
      <div className="mb-1 flex items-start justify-between">
        <div>
          <h3 className="text-[15px] font-semibold text-fg">{c.name}</h3>
          <p className="text-[12px] text-fg-3">{c.nameJa}</p>
        </div>
        <span className="rounded-chip bg-panel-2 px-2 py-0.5 text-[11px] text-fg-3">{c.kind}</span>
      </div>
    </Link>
  );
}
