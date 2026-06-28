"use client";
import { Search, Plus, ChevronDown } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { SegmentSwitch } from "./SegmentSwitch";
export function TopBar({ variant, onSearchClick }: { variant: "problems" | "concepts"; onSearchClick: () => void }) {
  return (
    <header className="flex h-16 items-center gap-3 border-b border-line px-5">
      <div className="flex items-center gap-2">
        <div className="grid h-6 w-6 place-items-center rounded-[7px] bg-fg font-mono text-[12px] text-accent">{"{ }"}</div>
        <span className="text-[15px] font-bold tracking-tight">algo notes</span>
      </div>
      <SegmentSwitch active={variant} />
      <button aria-label="Search" onClick={onSearchClick}
        className="ml-2 flex max-w-[380px] flex-1 items-center gap-2 rounded-chip border border-line bg-panel px-3 py-2 text-left text-[13px] text-muted">
        <Search size={14} />
        <span className="flex-1">{variant === "problems" ? "問題名・タグ・本文を検索" : "概念を検索"}</span>
        <kbd className="rounded border border-line bg-panel-2 px-1.5 font-mono text-[11px]">⌘K</kbd>
      </button>
      <button className="flex items-center gap-1 rounded-chip border border-line px-3 py-2 text-[13px] text-fg-2">
        並び替え <ChevronDown size={14} />
      </button>
      <button className="flex items-center gap-1 rounded-chip bg-fg px-3 py-2 text-[13px] font-semibold text-canvas">
        <Plus size={14} /> {variant === "problems" ? "ノート追加" : "概念追加"}
      </button>
      <ThemeToggle />
    </header>
  );
}
