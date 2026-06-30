"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, Plus, ChevronDown, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { SegmentSwitch } from "./SegmentSwitch";
export function TopBar({ variant, onSearchClick }: { variant: "problems" | "concepts"; onSearchClick: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className="relative flex h-16 items-center gap-2 border-b border-line px-3 md:gap-3 md:px-5">
      <div className="flex min-w-0 items-center gap-2">
        <div className="grid h-6 w-6 shrink-0 place-items-center rounded-[7px] bg-fg font-mono text-[12px] text-accent">{"{ }"}</div>
        <span className="truncate text-[15px] font-bold tracking-tight">algo notes</span>
      </div>
      <div className="hidden md:block">
        <SegmentSwitch active={variant} />
      </div>
      <button aria-label="Search" onClick={onSearchClick}
        className="ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-chip border border-line bg-panel text-muted md:ml-2 md:flex md:h-auto md:w-auto md:max-w-[380px] md:flex-1 md:items-center md:gap-2 md:px-3 md:py-2 md:text-left md:text-[13px]">
        <Search size={14} />
        <span className="hidden flex-1 md:block">{variant === "problems" ? "問題名・タグ・本文を検索" : "概念を検索"}</span>
        <kbd className="hidden rounded border border-line bg-panel-2 px-1.5 font-mono text-[11px] md:block">⌘K</kbd>
      </button>
      <button className="hidden items-center gap-1 rounded-chip border border-line px-3 py-2 text-[13px] text-fg-2 md:flex">
        並び替え <ChevronDown size={14} />
      </button>
      <button className="hidden items-center gap-1 rounded-chip bg-fg px-3 py-2 text-[13px] font-semibold text-canvas md:flex">
        <Plus size={14} /> {variant === "problems" ? "ノート追加" : "概念追加"}
      </button>
      <div className="shrink-0">
        <ThemeToggle />
      </div>
      <button
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-chip border border-line text-fg-3 hover:text-fg md:hidden"
      >
        {menuOpen ? <X size={16} /> : <Menu size={16} />}
      </button>
      {menuOpen && (
        <div
          aria-label="Mobile menu"
          className="absolute right-3 top-[calc(100%+8px)] z-50 w-[min(calc(100vw-1.5rem),18rem)] rounded-[8px] border border-line bg-canvas p-2 shadow-lg md:hidden"
        >
          <div className="grid grid-cols-2 gap-1 rounded-chip bg-panel-2 p-1">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className={`rounded-chip px-3 py-2 text-center text-[13px] font-semibold ${variant === "problems" ? "bg-canvas text-fg shadow-sm" : "text-fg-3"}`}
            >
              問題
            </Link>
            <Link
              href="/concepts"
              onClick={() => setMenuOpen(false)}
              className={`rounded-chip px-3 py-2 text-center text-[13px] font-semibold ${variant === "concepts" ? "bg-canvas text-fg shadow-sm" : "text-fg-3"}`}
            >
              概念
            </Link>
          </div>
          <div className="mt-2 grid gap-1">
            <button className="flex w-full items-center justify-between rounded-[6px] px-3 py-2 text-left text-[13px] text-fg-2 hover:bg-panel">
              並び替え <ChevronDown size={14} />
            </button>
            <button className="flex w-full items-center justify-between rounded-[6px] bg-fg px-3 py-2 text-left text-[13px] font-semibold text-canvas">
              {variant === "problems" ? "ノート追加" : "概念追加"} <Plus size={14} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
