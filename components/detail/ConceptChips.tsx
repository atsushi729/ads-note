import Link from "next/link";
import type { Concept } from "@/lib/types";
export function ConceptChips({ concepts }: { concepts: Concept[] }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="text-[11px] font-semibold text-fg-3">使用した概念</span>
      {concepts.map((c) => (
        <Link key={c.id} href={`/concepts/${c.id}`} className="rounded-chip border border-line px-2.5 py-1 text-[12px] text-fg-2 hover:border-accent hover:text-accent">{c.name}</Link>
      ))}
    </div>
  );
}
