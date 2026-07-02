"use client";
import { useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function TopBar({ variant, onSearchClick }: { variant: "problems" | "concepts"; onSearchClick: () => void }) {
  const onSearchClickRef = useRef(onSearchClick);
  useEffect(() => { onSearchClickRef.current = onSearchClick; }, [onSearchClick]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); onSearchClickRef.current(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="relative flex h-16 items-center border-b border-line px-4 md:px-6">
      {/* Left: Logo */}
      <div className="flex shrink-0 items-center gap-2">
        <div className="grid h-6 w-6 shrink-0 place-items-center rounded-[7px] bg-fg font-mono text-[12px] text-accent">{"{ }"}</div>
        <span className="text-[15px] font-bold tracking-tight">algo notes</span>
      </div>

      {/* Right: Search + ThemeToggle */}
      <div className="ml-auto flex items-center gap-2">
        <button aria-label="Search" onClick={onSearchClick}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-chip border border-line bg-panel text-muted md:flex md:h-auto md:w-auto md:max-w-[260px] md:items-center md:gap-2 md:px-3 md:py-2 md:text-left md:text-[13px]">
          <Search size={14} />
          <span className="hidden flex-1 md:block">{variant === "problems" ? "問題・タグを検索" : "概念を検索"}</span>
          <kbd className="hidden rounded border border-line bg-panel-2 px-1.5 font-mono text-[11px] md:block">⌘K</kbd>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
