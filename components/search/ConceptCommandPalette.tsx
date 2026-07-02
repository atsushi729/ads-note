"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { Concept } from "@/lib/types";

export function ConceptCommandPalette({ concepts, open, onClose }: { concepts: Concept[]; open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const searchTargets = useMemo(
    () => concepts.map((c) => ({ concept: c, tokens: `${c.name} ${c.nameJa} ${c.kind} ${c.note}`.toLowerCase() })),
    [concepts],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return searchTargets.map(({ concept }) => concept);
    return searchTargets.filter(({ tokens }) => tokens.includes(q)).map(({ concept }) => concept);
  }, [searchTargets, query]);

  useEffect(() => { setActive(0); }, [results]);

  const resultsRef = useRef(results);
  const activeRef = useRef(active);
  const onCloseRef = useRef(onClose);
  useEffect(() => { resultsRef.current = results; }, [results]);
  useEffect(() => { activeRef.current = active; }, [active]);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onCloseRef.current();
      else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, resultsRef.current.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      else if (e.key === "Enter") {
        const item = resultsRef.current[activeRef.current];
        if (item) { router.push(`/concepts/${item.id}`); onCloseRef.current(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, router]);

  if (!open) return null;

  const navigate = (id: string) => { router.push(`/concepts/${id}`); onClose(); };

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex justify-center" style={{ background: "rgba(6,6,8,.62)", backdropFilter: "blur(4px)" }}>
      <div onClick={(e) => e.stopPropagation()} className="mt-[88px] h-fit w-[560px] overflow-hidden rounded-[14px] border border-line bg-canvas shadow-card">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <Search size={16} className="text-fg-3" />
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="概念を検索" className="flex-1 bg-transparent text-[14px] outline-none" />
          <kbd className="rounded border border-line bg-panel-2 px-1.5 font-mono text-[11px] text-fg-3">esc</kbd>
        </div>
        <div className="max-h-[420px] overflow-y-auto p-2">
          {results.map((c, i) => (
            <button key={c.id} onClick={() => navigate(c.id)}
              className={`flex w-full items-center gap-3 rounded-chip px-2 py-2 text-left ${active === i ? "bg-accent/10" : ""}`}>
              <span className="flex-1 text-[14px] text-fg">{c.nameJa}</span>
              <span className="font-mono text-[11px] text-fg-3">{c.kind}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
