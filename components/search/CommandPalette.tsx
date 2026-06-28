"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { Problem } from "@/lib/types";
import { buildSearchIndex, searchProblems } from "@/lib/search-index";
const diffClass: Record<string, string> = { Easy: "text-easy", Medium: "text-medium", Hard: "text-hard" };
function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{text}</>;
  return <>{text.slice(0, i)}<span className="text-accent">{text.slice(i, i + q.length)}</span>{text.slice(i + q.length)}</>;
}
export function CommandPalette({ problems, open, onClose }: { problems: Problem[]; open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const index = useMemo(() => buildSearchIndex(problems), [problems]);
  const { titleMatches, bodyMatches } = searchProblems(index, query);
  const flat = [...titleMatches.map((e) => e.number), ...bodyMatches.map((b) => b.entry.number)];
  const [active, setActive] = useState(0);
  useEffect(() => { if (open) { setQuery(""); setActive(0); } }, [open]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, flat.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      else if (e.key === "Enter" && flat[active]) { router.push(`/problems/${flat[active]}`); onClose(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, flat, active, onClose, router]);
  if (!open) return null;
  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex justify-center" style={{ background: "rgba(6,6,8,.62)", backdropFilter: "blur(4px)" }}>
      <div onClick={(e) => e.stopPropagation()} className="mt-[88px] h-fit w-[560px] overflow-hidden rounded-[14px] border border-line bg-canvas shadow-card">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <Search size={16} className="text-fg-3" />
          <input autoFocus value={query} onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            placeholder="問題名・タグ・本文を検索" className="flex-1 bg-transparent text-[14px] outline-none" />
          <kbd className="rounded border border-line bg-panel-2 px-1.5 font-mono text-[11px] text-fg-3">esc</kbd>
        </div>
        <div className="max-h-[420px] overflow-y-auto p-2">
          {titleMatches.length > 0 && <div className="px-2 py-1 text-[11px] font-semibold text-fg-3">問題</div>}
          {titleMatches.map((e) => {
            const isActive = flat[active] === e.number;
            return (
              <button key={e.number} onClick={() => { router.push(`/problems/${e.number}`); onClose(); }}
                className={`flex w-full items-center gap-3 rounded-chip px-2 py-2 text-left ${isActive ? "bg-accent/10" : ""}`}>
                <span className="font-mono text-[12px] text-fg-3">#{e.number}</span>
                <span className="flex-1 text-[14px] text-fg">{e.title}</span>
                <span className={`font-mono text-[11px] ${diffClass[e.difficulty]}`}>{e.difficulty}</span>
              </button>
            );
          })}
          {bodyMatches.length > 0 && <div className="px-2 py-1 text-[11px] font-semibold text-fg-3">本文中に一致</div>}
          {bodyMatches.map((b) => (
            <button key={b.entry.number} onClick={() => { router.push(`/problems/${b.entry.number}`); onClose(); }}
              className="flex w-full items-center gap-3 rounded-chip px-2 py-2 text-left">
              <span className="font-mono text-[12px] text-fg-3">#{b.entry.number}</span>
              <span className="flex-1 text-[13px] text-fg-3"><Highlight text={b.excerpt} q={query} /></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
