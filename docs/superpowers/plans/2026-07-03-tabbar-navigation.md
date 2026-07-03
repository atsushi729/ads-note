# TabBar Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hidden-on-mobile `SegmentSwitch` + hamburger-menu pattern with a full-width `TabBar` below the TopBar, visible on all screen sizes.

**Architecture:** New `TabBar` component renders two full-width underline-indicator tabs; `TopBar` is stripped to logo + search + theme toggle only; both library views insert `<TabBar>` immediately after `<TopBar>`.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, Vitest + React Testing Library

## Global Constraints

- Tailwind only — no inline styles except CSS variables already in use (`var(--color-*)`)
- Existing design tokens (`border-line`, `text-fg`, `text-fg-3`, `text-accent`, `bg-canvas`, `bg-panel-2`, `rounded-chip`, etc.) — do not introduce new color values
- `npm run test` must pass after every task
- `npm run lint` must pass before final commit

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `components/layout/TabBar.tsx` | **Create** | Renders 問題/概念 tabs with underline-active style |
| `components/layout/TabBar.test.tsx` | **Create** | Unit tests for TabBar |
| `components/layout/TopBar.tsx` | **Modify** | Remove SegmentSwitch center column and hamburger menu |
| `components/layout/TopBar.test.tsx` | **Modify** | Remove obsolete mobile-menu test; keep search/name test |
| `components/layout/SegmentSwitch.tsx` | **Delete** | No longer referenced |
| `components/library/LibraryView.tsx` | **Modify** | Add `<TabBar active="problems" />` after `<TopBar>` |
| `components/library/ConceptLibraryView.tsx` | **Modify** | Add `<TabBar active="concepts" />` after `<TopBar>` |

---

### Task 1: Create `TabBar` component

**Files:**
- Create: `components/layout/TabBar.tsx`
- Create: `components/layout/TabBar.test.tsx`

**Interfaces:**
- Produces: `TabBar({ active: "problems" | "concepts" }): JSX.Element`

- [ ] **Step 1: Write failing tests**

```tsx
// components/layout/TabBar.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TabBar } from "./TabBar";

describe("TabBar", () => {
  it("renders both tab links", () => {
    render(<TabBar active="problems" />);
    expect(screen.getByRole("link", { name: "問題" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "概念" })).toBeInTheDocument();
  });

  it("links point to correct hrefs", () => {
    render(<TabBar active="concepts" />);
    expect(screen.getByRole("link", { name: "問題" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "概念" })).toHaveAttribute("href", "/concepts");
  });

  it("applies active class to the active tab only (problems)", () => {
    const { container } = render(<TabBar active="problems" />);
    const links = container.querySelectorAll("a");
    const problemsLink = [...links].find((a) => a.textContent === "問題")!;
    const conceptsLink = [...links].find((a) => a.textContent === "概念")!;
    expect(problemsLink.className).toContain("border-accent");
    expect(conceptsLink.className).not.toContain("border-accent");
  });

  it("applies active class to the active tab only (concepts)", () => {
    const { container } = render(<TabBar active="concepts" />);
    const links = container.querySelectorAll("a");
    const problemsLink = [...links].find((a) => a.textContent === "問題")!;
    const conceptsLink = [...links].find((a) => a.textContent === "概念")!;
    expect(conceptsLink.className).toContain("border-accent");
    expect(problemsLink.className).not.toContain("border-accent");
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd /Users/atsushihatakeyama/Desktop/ads-note
npm run test -- --reporter=verbose components/layout/TabBar.test.tsx
```

Expected: FAIL — "Cannot find module './TabBar'"

- [ ] **Step 3: Implement `TabBar`**

```tsx
// components/layout/TabBar.tsx
import Link from "next/link";

export function TabBar({ active }: { active: "problems" | "concepts" }) {
  const base = "flex-1 py-3 text-center text-[14px] font-semibold transition-colors border-b-2";
  const activeClass = "text-fg border-accent";
  const inactiveClass = "text-fg-3 hover:text-fg-2 border-transparent";
  return (
    <div className="flex border-b border-line">
      <Link href="/" className={`${base} ${active === "problems" ? activeClass : inactiveClass}`}>
        問題
      </Link>
      <Link href="/concepts" className={`${base} ${active === "concepts" ? activeClass : inactiveClass}`}>
        概念
      </Link>
    </div>
  );
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm run test -- --reporter=verbose components/layout/TabBar.test.tsx
```

Expected: 4 tests PASS

- [ ] **Step 5: Commit**

```bash
git add components/layout/TabBar.tsx components/layout/TabBar.test.tsx
git commit -m "feat: add TabBar navigation component"
```

---

### Task 2: Simplify `TopBar` and update its tests

Remove the `SegmentSwitch` center column and the hamburger button + mobile dropdown. The obsolete mobile-menu test in `TopBar.test.tsx` must also be removed (it asserts buttons that never existed in the current codebase).

**Files:**
- Modify: `components/layout/TopBar.tsx`
- Modify: `components/layout/TopBar.test.tsx`

**Interfaces:**
- Consumes: `TopBar({ variant, onSearchClick })` — signature unchanged
- Produces: Same props; renders logo + search + theme toggle only (no SegmentSwitch, no hamburger)

- [ ] **Step 1: Update TopBar tests first (keep passing test, delete broken one)**

Replace the full content of `components/layout/TopBar.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { TopBar } from "./TopBar";

describe("TopBar", () => {
  it("shows app name and triggers search", () => {
    const onSearch = vi.fn();
    render(
      <ThemeProvider>
        <TopBar variant="problems" onSearchClick={onSearch} />
      </ThemeProvider>
    );
    expect(screen.getByText("algo notes")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /search/i }));
    expect(onSearch).toHaveBeenCalled();
  });

  it("does not render a hamburger menu button", () => {
    render(
      <ThemeProvider>
        <TopBar variant="concepts" onSearchClick={vi.fn()} />
      </ThemeProvider>
    );
    expect(screen.queryByRole("button", { name: /open menu/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /close menu/i })).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to see the "does not render hamburger" test fail**

```bash
npm run test -- --reporter=verbose components/layout/TopBar.test.tsx
```

Expected: "does not render a hamburger menu button" FAIL (hamburger still exists)

- [ ] **Step 3: Rewrite `TopBar` body**

Replace the `return (...)` block in `components/layout/TopBar.tsx` with:

```tsx
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
```

Also remove unused imports: `useState`, `Menu`, `X`, `SegmentSwitch`. The full final file:

```tsx
"use client";
import Link from "next/link";
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
      <div className="flex shrink-0 items-center gap-2">
        <div className="grid h-6 w-6 shrink-0 place-items-center rounded-[7px] bg-fg font-mono text-[12px] text-accent">{"{ }"}</div>
        <span className="text-[15px] font-bold tracking-tight">algo notes</span>
      </div>
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
```

- [ ] **Step 4: Run tests to confirm both pass**

```bash
npm run test -- --reporter=verbose components/layout/TopBar.test.tsx
```

Expected: 2 tests PASS

- [ ] **Step 5: Commit**

```bash
git add components/layout/TopBar.tsx components/layout/TopBar.test.tsx
git commit -m "refactor: simplify TopBar — remove SegmentSwitch and hamburger menu"
```

---

### Task 3: Wire `TabBar` into library views + delete `SegmentSwitch`

**Files:**
- Modify: `components/library/LibraryView.tsx`
- Modify: `components/library/ConceptLibraryView.tsx`
- Delete: `components/layout/SegmentSwitch.tsx`

**Interfaces:**
- Consumes: `TabBar` from Task 1

- [ ] **Step 1: Update `LibraryView`**

```tsx
// components/library/LibraryView.tsx
"use client";
import { useMemo, useState } from "react";
import type { Problem } from "@/lib/types";
import { TopBar } from "@/components/layout/TopBar";
import { TabBar } from "@/components/layout/TabBar";
import { FilterPanel, type Filters } from "./FilterPanel";
import { ProblemCard } from "./ProblemCard";
import { CommandPalette } from "@/components/search/CommandPalette";

export function LibraryView({ problems }: { problems: Problem[] }) {
  const [filters, setFilters] = useState<Filters>({ difficulty: "すべて", tags: [], kind: "すべて", mastery: "すべて" });
  const [paletteOpen, setPaletteOpen] = useState(false);
  const tags = useMemo(() => [...new Set(problems.flatMap((p) => p.tags))], [problems]);
  const filtered = problems.filter((p) =>
    (filters.difficulty === "すべて" || p.difficulty === filters.difficulty) &&
    (filters.tags.length === 0 || filters.tags.every((t) => p.tags.includes(t))));
  return (
    <main className="mx-auto max-w-[1180px]">
      <TopBar variant="problems" onSearchClick={() => setPaletteOpen(true)} />
      <TabBar active="problems" />
      <div className="flex">
        <div className="hidden md:block"><FilterPanel variant="problems" tags={tags} filters={filters} onChange={setFilters} /></div>
        <div className="grid flex-1 grid-cols-1 gap-3.5 p-5 md:grid-cols-2">
          {filtered.map((p) => <ProblemCard key={p.number} problem={p} />)}
        </div>
      </div>
      <CommandPalette problems={problems} open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </main>
  );
}
```

- [ ] **Step 2: Update `ConceptLibraryView`**

```tsx
// components/library/ConceptLibraryView.tsx
"use client";
import { useState } from "react";
import type { Concept } from "@/lib/types";
import { TopBar } from "@/components/layout/TopBar";
import { TabBar } from "@/components/layout/TabBar";
import { ConceptStats } from "@/components/layout/StatStrip";
import { FilterPanel, type Filters } from "./FilterPanel";
import { ConceptCard } from "./ConceptCard";
import { ConceptCommandPalette } from "@/components/search/ConceptCommandPalette";

export function ConceptLibraryView({ concepts }: { concepts: Concept[] }) {
  const [filters, setFilters] = useState<Filters>({ difficulty: "すべて", tags: [], kind: "すべて", mastery: "すべて" });
  const [paletteOpen, setPaletteOpen] = useState(false);
  const filtered = concepts.filter((c) =>
    (filters.kind === "すべて" || c.kind === filters.kind) &&
    (filters.mastery === "すべて" || c.mastery === filters.mastery));
  return (
    <main className="mx-auto max-w-[1180px]">
      <TopBar variant="concepts" onSearchClick={() => setPaletteOpen(true)} />
      <TabBar active="concepts" />
      <ConceptStats concepts={concepts} />
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
```

- [ ] **Step 3: Delete `SegmentSwitch.tsx`**

```bash
rm /Users/atsushihatakeyama/Desktop/ads-note/components/layout/SegmentSwitch.tsx
```

- [ ] **Step 4: Run full test suite**

```bash
npm run test
```

Expected: all tests PASS (no SegmentSwitch import anywhere)

- [ ] **Step 5: Run lint**

```bash
npm run lint
```

Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add components/library/LibraryView.tsx components/library/ConceptLibraryView.tsx
git add -u components/layout/SegmentSwitch.tsx
git commit -m "feat: wire TabBar into library views, remove SegmentSwitch"
```
