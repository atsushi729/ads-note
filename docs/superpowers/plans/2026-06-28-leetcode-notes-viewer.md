# LeetCode Notes Viewer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build "algo notes", a Next.js SSG app that browses LeetCode solution notes (Markdown) and concept notes with bidirectional links, ⌘K search, light/dark themes, and mobile support — matching the design handoff screenshots.

**Architecture:** Markdown content in `content/` is parsed at build time (Node) into typed `Problem[]` / `Concept[]`; pages are Server Components rendering static content (SSG), with interactivity (filters, ⌘K palette, step folding, theme) isolated in Client Components. A future LLM chat seam is reserved at `app/api/chat/route.ts`.

**Tech Stack:** Next.js (App Router) + TypeScript, Tailwind CSS (tokens as CSS variables), gray-matter, react-markdown + remark-gfm + remark-math + rehype-katex + rehype-pretty-code (shiki), katex, lucide-react, next/font/google (Hanken Grotesk, JetBrains Mono), Vitest + React Testing Library.

## Global Constraints

- Node version: 20+ (Next.js 15 requirement).
- App lives at repo root. Do **not** edit `design_handoff_leetcode_notes_viewer/` (reference only).
- Design tokens are authoritative — use the values from the spec; never invent colors/spacing. Source: `docs/superpowers/specs/2026-06-28-leetcode-notes-viewer-design.md`.
- Accent orange: `#fb923c` (deep `#bc4c00`). Difficulty/mastery colors per spec section 7.
- Fonts: Hanken Grotesk (UI/body), JetBrains Mono (code/numbers/labels).
- Bidirectional link invariant: `Problem.conceptIds` ↔ `Concept.problemNumbers`.
- Content parsing happens at build time only; clients receive parsed data.
- All work is TDD: write the failing test, see it fail, implement minimally, see it pass, commit.
- Commit message trailer on every commit: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

---

## File Structure

```
package.json, tsconfig.json, next.config.ts, tailwind.config.ts, postcss.config.mjs, vitest.config.ts, vitest.setup.ts
app/
  layout.tsx                 # fonts, ThemeProvider, PaletteProvider, globals
  page.tsx                   # Problem Library (/)
  problems/[number]/page.tsx # Problem Detail
  concepts/page.tsx          # Concept Library
  concepts/[id]/page.tsx     # Concept Detail
  api/chat/route.ts          # future chat stub (501)
components/
  layout/   TopBar.tsx, StatStrip.tsx, Sidebar.tsx, BottomTabBar.tsx, ThemeToggle.tsx, SegmentSwitch.tsx
  library/  ProblemCard.tsx, ConceptCard.tsx, FilterPanel.tsx, LibraryView.tsx, ConceptLibraryView.tsx
  detail/   TocRail.tsx, StepBlock.tsx, ExampleBlock.tsx, ComplexityChip.tsx, ComplexityTable.tsx, RelatedProblems.tsx, ConceptChips.tsx
  search/   CommandPalette.tsx, PaletteProvider.tsx
  markdown/ Markdown.tsx
  theme/    ThemeProvider.tsx
content/
  problems/*.md
  concepts/*.md
lib/
  types.ts, parse-steps.ts, problems.ts, concepts.ts, links.ts, search-index.ts, difficulty.ts
styles/
  globals.css, tokens.css
test/  (Vitest specs colocated as *.test.ts(x) next to source)
```

---

## Task 1: Project scaffold & tooling

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `tailwind.config.ts`, `vitest.config.ts`, `vitest.setup.ts`, `app/layout.tsx`, `app/page.tsx`, `styles/globals.css`
- Test: `lib/smoke.test.ts`

**Interfaces:**
- Produces: a runnable Next.js app + a green Vitest run. `npm run dev`, `npm run build`, `npm run test`, `npm run lint`.

- [ ] **Step 1: Create package.json**

```json
{
  "name": "algo-notes",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "next": "15.1.0",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "gray-matter": "^4.0.3",
    "react-markdown": "^9.0.1",
    "remark-gfm": "^4.0.0",
    "remark-math": "^6.0.0",
    "rehype-katex": "^7.0.1",
    "rehype-pretty-code": "^0.14.0",
    "shiki": "^1.24.0",
    "katex": "^0.16.11",
    "lucide-react": "^0.468.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^3.4.17",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20",
    "vitest": "^2.1.8",
    "@vitejs/plugin-react": "^4.3.4",
    "@testing-library/react": "^16.1.0",
    "@testing-library/jest-dom": "^6.6.3",
    "jsdom": "^25.0.1",
    "eslint": "^9.17.0",
    "eslint-config-next": "15.1.0"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: completes with `node_modules/` populated, no peer-dependency errors that block install.

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "design_handoff_leetcode_notes_viewer"]
}
```

- [ ] **Step 4: Create config files**

`next.config.ts`:
```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = { output: "export", images: { unoptimized: true } };
export default nextConfig;
```

`postcss.config.mjs`:
```js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

`tailwind.config.ts` (theme.extend filled in Task 2):
```ts
import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: { extend: {} },
  plugins: [],
};
export default config;
```

`vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", setupFiles: ["./vitest.setup.ts"], globals: true },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
});
```

`vitest.setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 5: Create minimal app shell**

`styles/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

`app/layout.tsx`:
```tsx
import "@/styles/globals.css";
export const metadata = { title: "algo notes", description: "LeetCode notes viewer" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
```

`app/page.tsx`:
```tsx
export default function Home() {
  return <main>algo notes</main>;
}
```

- [ ] **Step 6: Write the smoke test**

`lib/smoke.test.ts`:
```ts
import { describe, it, expect } from "vitest";
describe("toolchain", () => {
  it("runs vitest", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 7: Run test and build to verify**

Run: `npm run test`
Expected: PASS (1 test).
Run: `npm run build`
Expected: builds successfully, emits `out/`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js + Tailwind + Vitest"
```

---

## Task 2: Design tokens, fonts & theme toggle

**Files:**
- Create: `styles/tokens.css`, `components/theme/ThemeProvider.tsx`, `components/layout/ThemeToggle.tsx`, `components/theme/ThemeProvider.test.tsx`
- Modify: `styles/globals.css`, `tailwind.config.ts`, `app/layout.tsx`

**Interfaces:**
- Produces: `ThemeProvider` (wraps app, persists theme to localStorage, toggles `<html class="dark">`); `useTheme(): { theme: "light" | "dark"; toggle: () => void }`; `ThemeToggle` button. CSS variables on `:root` and `.dark` consumed by Tailwind tokens (`bg-canvas`, `text-fg`, `border-line`, `text-accent`, etc.).

- [ ] **Step 1: Create tokens.css**

`styles/tokens.css` (values verbatim from spec section 7):
```css
:root {
  --canvas: #ffffff;
  --panel: #fcfbf9;
  --panel-2: #f6f5f2;
  --line: #f1f0ec;
  --line-2: #ededea;
  --fg: #15140f;
  --fg-2: #403d36;
  --fg-3: #6b675e;
  --muted: #a8a39a;
  --muted-2: #b3aea4;
  --accent: #fb923c;
  --accent-deep: #bc4c00;
  --easy: #1a7f37;
  --medium: #bc4c00;
  --hard: #cf222e;
  --mastery-none: #b3aea4;
  --code-bg: #f6f8fa;
  --code-border: #eceef1;
  --shadow-card: 0 1px 3px rgba(0,0,0,.06), 0 12px 40px rgba(0,0,0,.04);
}
.dark {
  --canvas: #0b0b0d;
  --panel: #101013;
  --panel-2: #141417;
  --line: #18181b;
  --line-2: #232329;
  --fg: #ededed;
  --fg-2: #c8c8cc;
  --fg-3: #b6b6bc;
  --muted: #8a8a90;
  --muted-2: #6a6a70;
  --accent: #fb923c;
  --accent-deep: #fb923c;
  --easy: #3fb950;
  --medium: #fb923c;
  --hard: #f85149;
  --mastery-none: #6a6a70;
  --code-bg: #101013;
  --code-border: #1f1f24;
  --shadow-card: 0 1px 3px rgba(0,0,0,.4), 0 18px 50px rgba(0,0,0,.35);
}
```

- [ ] **Step 2: Wire tokens into globals.css and Tailwind**

Prepend to `styles/globals.css` (before `@tailwind` lines): `@import "./tokens.css";`

`tailwind.config.ts` theme.extend:
```ts
theme: {
  extend: {
    colors: {
      canvas: "var(--canvas)", panel: "var(--panel)", "panel-2": "var(--panel-2)",
      line: "var(--line)", "line-2": "var(--line-2)",
      fg: "var(--fg)", "fg-2": "var(--fg-2)", "fg-3": "var(--fg-3)",
      muted: "var(--muted)", "muted-2": "var(--muted-2)",
      accent: "var(--accent)", "accent-deep": "var(--accent-deep)",
      easy: "var(--easy)", medium: "var(--medium)", hard: "var(--hard)",
      "mastery-none": "var(--mastery-none)",
      "code-bg": "var(--code-bg)", "code-border": "var(--code-border)",
    },
    borderRadius: { card: "16px", inner: "13px", block: "11px", chip: "8px" },
    boxShadow: { card: "var(--shadow-card)" },
    fontFamily: { sans: ["var(--font-hanken)", "system-ui", "sans-serif"], mono: ["var(--font-jetbrains)", "monospace"] },
  },
},
```

- [ ] **Step 3: Write the failing ThemeProvider test**

`components/theme/ThemeProvider.test.tsx`:
```tsx
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

beforeEach(() => { localStorage.clear(); document.documentElement.className = ""; });

describe("ThemeProvider", () => {
  it("toggles the dark class and persists", () => {
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: /theme/i }));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npm run test -- ThemeProvider`
Expected: FAIL (modules not found).

- [ ] **Step 5: Implement ThemeProvider and ThemeToggle**

`components/theme/ThemeProvider.tsx`:
```tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
type Theme = "light" | "dark";
const Ctx = createContext<{ theme: Theme; toggle: () => void }>({ theme: "light", toggle: () => {} });
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    const stored = (localStorage.getItem("theme") as Theme) || "light";
    setTheme(stored);
    document.documentElement.classList.toggle("dark", stored === "dark");
  }, []);
  const toggle = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  };
  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>;
}
export const useTheme = () => useContext(Ctx);
```

`components/layout/ThemeToggle.tsx`:
```tsx
"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button aria-label="Toggle theme" onClick={toggle}
      className="rounded-chip border border-line p-2 text-fg-3 hover:text-fg">
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm run test -- ThemeProvider`
Expected: PASS.

- [ ] **Step 7: Wire fonts + ThemeProvider into layout**

`app/layout.tsx`:
```tsx
import "@/styles/globals.css";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
const hanken = Hanken_Grotesk({ subsets: ["latin"], weight: ["400","500","600","700","800"], variable: "--font-hanken" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400","500","600"], variable: "--font-jetbrains" });
export const metadata = { title: "algo notes", description: "LeetCode notes viewer" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${hanken.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html:
          `try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}` }} />
      </head>
      <body className="bg-canvas font-sans text-fg antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: design tokens, fonts, and light/dark theme toggle"
```

---

## Task 3: Domain types & difficulty helpers

**Files:**
- Create: `lib/types.ts`, `lib/difficulty.ts`, `lib/difficulty.test.ts`

**Interfaces:**
- Produces: `Problem`, `Step`, `Concept`, `Difficulty`, `Mastery`, `Kind`, `ConceptComplexityRow` types; `difficultyColorVar(d: Difficulty): string` returning a CSS var name (`"--easy" | "--medium" | "--hard"`); `masteryColorVar(m: Mastery): string`.

- [ ] **Step 1: Create types.ts**

```ts
export type Difficulty = "Easy" | "Medium" | "Hard";
export type Mastery = "習得" | "復習中" | "未学習";
export type Kind = "構造" | "アルゴ";

export interface Step {
  index: number;
  title: string;
  thinking: string;
  codeLang: string;
  code: string;
  timeComplexity: string;
  spaceComplexity: string;
  note?: string;
}
export interface Problem {
  number: number;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  source: string;
  created: string;
  solved: boolean;
  description?: string;
  question: string;
  steps: Step[];
  conceptIds: string[];
}
export interface ConceptComplexityRow { op: string; avg: string; worst: string; }
export interface Concept {
  id: string;
  name: string;
  nameJa: string;
  kind: Kind;
  mastery: Mastery;
  masteryPct: number;
  note: string;
  problemNumbers: number[];
  complexity: ConceptComplexityRow[];
}
```

- [ ] **Step 2: Write failing difficulty test**

`lib/difficulty.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { difficultyColorVar, masteryColorVar } from "./difficulty";
describe("color helpers", () => {
  it("maps difficulty to css var", () => {
    expect(difficultyColorVar("Easy")).toBe("--easy");
    expect(difficultyColorVar("Medium")).toBe("--medium");
    expect(difficultyColorVar("Hard")).toBe("--hard");
  });
  it("maps mastery to css var", () => {
    expect(masteryColorVar("習得")).toBe("--easy");
    expect(masteryColorVar("復習中")).toBe("--medium");
    expect(masteryColorVar("未学習")).toBe("--mastery-none");
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm run test -- difficulty`
Expected: FAIL (module not found).

- [ ] **Step 4: Implement difficulty.ts**

```ts
import type { Difficulty, Mastery } from "./types";
export function difficultyColorVar(d: Difficulty): string {
  return d === "Easy" ? "--easy" : d === "Medium" ? "--medium" : "--hard";
}
export function masteryColorVar(m: Mastery): string {
  return m === "習得" ? "--easy" : m === "復習中" ? "--medium" : "--mastery-none";
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test -- difficulty`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: domain types and color helpers"
```

---

## Task 4: Markdown step parser (most important)

**Files:**
- Create: `lib/parse-steps.ts`, `lib/parse-steps.test.ts`
- Test fixture: copy `design_handoff_leetcode_notes_viewer/701. Insert into a Binary Search Tree.md` to `content/problems/701-insert-into-a-binary-search-tree.md` (also used by Task 10).

**Interfaces:**
- Consumes: raw markdown body (frontmatter already stripped by caller).
- Produces: `parseProblemBody(body: string): { question: string; difficulty: Difficulty | null; steps: Step[] }`. `steps[i]` has `index`, `title`, `thinking`, `codeLang`, `code`, `timeComplexity`, `spaceComplexity`, `note?`.

- [ ] **Step 1: Create the content fixture**

```bash
mkdir -p content/problems
cp "design_handoff_leetcode_notes_viewer/701. Insert into a Binary Search Tree.md" "content/problems/701-insert-into-a-binary-search-tree.md"
```

- [ ] **Step 2: Write the failing parser test**

`lib/parse-steps.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import matter from "gray-matter";
import { parseProblemBody } from "./parse-steps";

const raw = readFileSync("content/problems/701-insert-into-a-binary-search-tree.md", "utf8");
const { content } = matter(raw);
const parsed = parseProblemBody(content);

describe("parseProblemBody", () => {
  it("extracts difficulty", () => {
    expect(parsed.difficulty).toBe("Medium");
  });
  it("captures the Question section", () => {
    expect(parsed.question).toContain("binary search tree");
    expect(parsed.question).toContain("Constraints");
  });
  it("finds three steps", () => {
    expect(parsed.steps).toHaveLength(3);
  });
  it("parses step 1 code and language", () => {
    expect(parsed.steps[0].codeLang).toBe("python");
    expect(parsed.steps[0].code).toContain("insert_into_bst");
  });
  it("extracts complexity for step 1", () => {
    expect(parsed.steps[0].timeComplexity).toBe("O(h)");
    expect(parsed.steps[0].spaceComplexity).toBe("O(1)");
  });
  it("captures thinking and optional note", () => {
    expect(parsed.steps[0].thinking).toContain("BST");
    expect(parsed.steps[2].note).toContain("再帰深度");
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm run test -- parse-steps`
Expected: FAIL (module not found).

- [ ] **Step 4: Implement parse-steps.ts**

```ts
import type { Difficulty, Step } from "./types";

function sectionsByHeading(body: string, level: 2 | 3 | 4): { title: string; content: string }[] {
  const marker = "#".repeat(level);
  const re = new RegExp(`^${marker} (?!#)(.+)$`, "gm");
  const out: { title: string; content: string }[] = [];
  const matches = [...body.matchAll(re)];
  matches.forEach((m, i) => {
    const start = m.index! + m[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index! : body.length;
    out.push({ title: m[1].trim(), content: body.slice(start, end).trim() });
  });
  return out;
}

function extractCode(md: string): { codeLang: string; code: string } {
  const m = md.match(/```(\w+)?\n([\s\S]*?)```/);
  return { codeLang: (m?.[1] ?? "text").trim(), code: (m?.[2] ?? "").trimEnd() };
}

function extractComplexity(md: string): { timeComplexity: string; spaceComplexity: string } {
  const time = md.match(/Time complexity\s*:?\s*\$?([^$\n]+?)\$?\s*$/m);
  const space = md.match(/Space complexity\s*:?\s*\$?([^$\n]+?)\$?\s*$/m);
  return { timeComplexity: (time?.[1] ?? "").trim(), spaceComplexity: (space?.[1] ?? "").trim() };
}

export function parseProblemBody(body: string): {
  question: string; difficulty: Difficulty | null; steps: Step[];
} {
  const diffMatch = body.match(/Difficulty:\s*(Easy|Medium|Hard)/i);
  const difficulty = diffMatch
    ? ((diffMatch[1][0].toUpperCase() + diffMatch[1].slice(1).toLowerCase()) as Difficulty)
    : null;

  const level2 = sectionsByHeading(body, 2);
  const question = level2.find((s) => /^Question/i.test(s.title))?.content ?? "";
  const approach = level2.find((s) => /^Approach/i.test(s.title))?.content ?? "";

  const steps: Step[] = sectionsByHeading(approach, 3).map((s, i) => {
    const subs = sectionsByHeading(s.content, 4);
    const get = (re: RegExp) => subs.find((x) => re.test(x.title))?.content ?? "";
    const impl = get(/実装/);
    const perf = get(/パフォーマンス/);
    const noteRaw = get(/注意点/);
    const { codeLang, code } = extractCode(impl);
    const { timeComplexity, spaceComplexity } = extractComplexity(perf);
    return {
      index: i + 1,
      title: s.title.replace(/^Step\s*\d+\s*/i, "").trim() || s.title,
      thinking: get(/思考/),
      codeLang, code, timeComplexity, spaceComplexity,
      note: noteRaw || undefined,
    };
  });

  return { question, difficulty, steps };
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test -- parse-steps`
Expected: PASS (6 assertions).

> Note: the fixture's step bodies start with a `---` divider line after `### Step N`; `sectionsByHeading` includes it in content harmlessly. The step `title` here is the raw heading ("Step 1"); per-step display titles ("反復による挿入" etc.) come from dummy data in Task 10 where authored, otherwise fall back to "Step N".

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: markdown step parser with TDD against 701 fixture"
```

---

## Task 5: Problem loader

**Files:**
- Create: `lib/problems.ts`, `lib/problems.test.ts`

**Interfaces:**
- Consumes: `parseProblemBody` (Task 4), `Problem` type (Task 3).
- Produces: `getAllProblems(): Problem[]` (reads `content/problems/*.md`, sorted by `number` asc); `getProblem(number: number): Problem | undefined`. Frontmatter may include `number`, `difficulty`, `solved`, `conceptIds`, `stepTitles` (string[] aligning to steps); falls back to parsed difficulty / filename number.

- [ ] **Step 1: Write failing loader test**

`lib/problems.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { getAllProblems, getProblem } from "./problems";

describe("problem loader", () => {
  it("loads at least the 701 fixture", () => {
    const all = getAllProblems();
    expect(all.length).toBeGreaterThanOrEqual(1);
    expect(all.find((p) => p.number === 701)).toBeTruthy();
  });
  it("returns a problem by number with parsed steps", () => {
    const p = getProblem(701)!;
    expect(p.title).toBe("Insert into a Binary Search Tree");
    expect(p.steps).toHaveLength(3);
    expect(p.difficulty).toBe("Medium");
  });
  it("sorts ascending by number", () => {
    const nums = getAllProblems().map((p) => p.number);
    expect([...nums].sort((a, b) => a - b)).toEqual(nums);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- problems`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement problems.ts**

```ts
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Problem, Step } from "./types";
import { parseProblemBody } from "./parse-steps";

const DIR = path.join(process.cwd(), "content/problems");

function loadOne(file: string): Problem {
  const raw = readFileSync(path.join(DIR, file), "utf8");
  const { data, content } = matter(raw);
  const parsed = parseProblemBody(content);
  const numberFromName = parseInt(file.match(/^(\d+)/)?.[1] ?? "0", 10);
  const stepTitles: string[] = Array.isArray(data.stepTitles) ? data.stepTitles : [];
  const steps: Step[] = parsed.steps.map((s, i) => ({
    ...s,
    title: stepTitles[i] ?? (s.title && !/^Step/i.test(s.title) ? s.title : `Step ${s.index}`),
  }));
  return {
    number: typeof data.number === "number" ? data.number : numberFromName,
    title: data.title ?? "",
    difficulty: data.difficulty ?? parsed.difficulty ?? "Medium",
    tags: Array.isArray(data.tags) ? data.tags.filter((t: string) => t !== "leetcode") : [],
    source: data.source ?? "",
    created: data.created ? String(data.created) : "",
    solved: data.solved ?? false,
    description: data.description,
    question: parsed.question,
    steps,
    conceptIds: Array.isArray(data.conceptIds) ? data.conceptIds : [],
  };
}

export function getAllProblems(): Problem[] {
  return readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map(loadOne)
    .sort((a, b) => a.number - b.number);
}
export function getProblem(number: number): Problem | undefined {
  return getAllProblems().find((p) => p.number === number);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- problems`
Expected: PASS. (Step titles will be "Step 1/2/3" until Task 10 adds `stepTitles` to the fixture frontmatter — acceptable.)

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: problem loader from content/problems"
```

---

## Task 6: Concept loader

**Files:**
- Create: `lib/concepts.ts`, `lib/concepts.test.ts`, `content/concepts/binary-search-tree.md`

**Interfaces:**
- Consumes: `Concept`, `ConceptComplexityRow` types.
- Produces: `getAllConcepts(): Concept[]`; `getConcept(id: string): Concept | undefined`. Concept frontmatter: `id, name, nameJa, kind, mastery, masteryPct, problemNumbers, complexity` (array of `{op,avg,worst}`); body = `note`.

- [ ] **Step 1: Create one real concept file**

`content/concepts/binary-search-tree.md`:
```md
---
id: binary-search-tree
name: Binary Search Tree
nameJa: 二分探索木
kind: 構造
mastery: 習得
masteryPct: 100
problemNumbers: [701, 700, 98]
complexity:
  - { op: 探索, avg: O(\log n), worst: O(n) }
  - { op: 挿入, avg: O(\log n), worst: O(n) }
  - { op: 削除, avg: O(\log n), worst: O(n) }
---
各ノードについて **左部分木の全値 < ノード値 < 右部分木の全値** の順序を保つ二分木。この不変条件により、探索・挿入・削除を木の高さ $h$ に比例する手数で行える。挿入は「$None$ に到達するまで降りて葉として付ける」だけ。最悪 $O(n)$ は偏った木（連結リスト状）のとき。実用では平衡木（AVL / 赤黒木）で高さを保証する。
```

- [ ] **Step 2: Write failing concept loader test**

`lib/concepts.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { getAllConcepts, getConcept } from "./concepts";
describe("concept loader", () => {
  it("loads the bst concept", () => {
    const c = getConcept("binary-search-tree")!;
    expect(c.name).toBe("Binary Search Tree");
    expect(c.nameJa).toBe("二分探索木");
    expect(c.kind).toBe("構造");
    expect(c.problemNumbers).toContain(701);
    expect(c.complexity).toHaveLength(3);
    expect(c.complexity[0].avg).toBe("O(\\log n)");
    expect(c.note).toContain("二分木");
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm run test -- concepts`
Expected: FAIL (module not found).

- [ ] **Step 4: Implement concepts.ts**

```ts
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Concept } from "./types";

const DIR = path.join(process.cwd(), "content/concepts");

function loadOne(file: string): Concept {
  const raw = readFileSync(path.join(DIR, file), "utf8");
  const { data, content } = matter(raw);
  return {
    id: data.id ?? file.replace(/\.md$/, ""),
    name: data.name ?? "",
    nameJa: data.nameJa ?? "",
    kind: data.kind ?? "構造",
    mastery: data.mastery ?? "未学習",
    masteryPct: typeof data.masteryPct === "number" ? data.masteryPct : 0,
    note: content.trim(),
    problemNumbers: Array.isArray(data.problemNumbers) ? data.problemNumbers : [],
    complexity: Array.isArray(data.complexity) ? data.complexity : [],
  };
}
export function getAllConcepts(): Concept[] {
  return readdirSync(DIR).filter((f) => f.endsWith(".md")).map(loadOne)
    .sort((a, b) => a.name.localeCompare(b.name));
}
export function getConcept(id: string): Concept | undefined {
  return getAllConcepts().find((c) => c.id === id);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test -- concepts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: concept loader from content/concepts"
```

---

## Task 7: Bidirectional link resolution

**Files:**
- Create: `lib/links.ts`, `lib/links.test.ts`

**Interfaces:**
- Consumes: `Problem`, `Concept`.
- Produces: `conceptsForProblem(problem: Problem, all: Concept[]): Concept[]` (union of `problem.conceptIds` and concepts whose `problemNumbers` include `problem.number`); `problemsForConcept(concept: Concept, all: Problem[]): Problem[]` (problems referenced by `concept.problemNumbers`, sorted asc).

- [ ] **Step 1: Write failing links test**

`lib/links.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { conceptsForProblem, problemsForConcept } from "./links";
import type { Problem, Concept } from "./types";

const problem = { number: 701, conceptIds: [] } as unknown as Problem;
const bst = { id: "bst", problemNumbers: [701, 700] } as unknown as Concept;
const other = { id: "dp", problemNumbers: [322] } as unknown as Concept;

describe("links", () => {
  it("finds concepts referencing a problem", () => {
    const result = conceptsForProblem(problem, [bst, other]);
    expect(result.map((c) => c.id)).toEqual(["bst"]);
  });
  it("finds problems referenced by a concept", () => {
    const p700 = { number: 700 } as Problem;
    const p701 = { number: 701 } as Problem;
    const result = problemsForConcept(bst, [p701, p700]);
    expect(result.map((p) => p.number)).toEqual([700, 701]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- links`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement links.ts**

```ts
import type { Problem, Concept } from "./types";
export function conceptsForProblem(problem: Problem, all: Concept[]): Concept[] {
  return all.filter(
    (c) => c.problemNumbers.includes(problem.number) || problem.conceptIds.includes(c.id),
  );
}
export function problemsForConcept(concept: Concept, all: Problem[]): Problem[] {
  return all
    .filter((p) => concept.problemNumbers.includes(p.number))
    .sort((a, b) => a.number - b.number);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- links`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: bidirectional problem/concept link resolution"
```

---

## Task 8: Search index for ⌘K

**Files:**
- Create: `lib/search-index.ts`, `lib/search-index.test.ts`

**Interfaces:**
- Consumes: `Problem`.
- Produces: `SearchEntry = { number; title; difficulty; tags; snippet }`; `buildSearchIndex(problems: Problem[]): SearchEntry[]`; `searchProblems(index: SearchEntry[], query: string): { titleMatches: SearchEntry[]; bodyMatches: { entry: SearchEntry; excerpt: string }[] }` where excerpt centers on the first match.

- [ ] **Step 1: Write failing search test**

`lib/search-index.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { buildSearchIndex, searchProblems } from "./search-index";
import type { Problem } from "./types";

const problems = [
  { number: 701, title: "Insert into a Binary Search Tree", difficulty: "Medium", tags: ["Tree","BST"],
    question: "binary search tree insertion", steps: [{ thinking: "BSTが前提 node と val を比較" }] },
  { number: 1, title: "Two Sum", difficulty: "Easy", tags: ["Array","Hash"], question: "sum", steps: [] },
] as unknown as Problem[];

describe("search", () => {
  const index = buildSearchIndex(problems);
  it("matches by title", () => {
    const r = searchProblems(index, "binary");
    expect(r.titleMatches.map((e) => e.number)).toContain(701);
  });
  it("matches in body and returns an excerpt", () => {
    const r = searchProblems(index, "BST");
    expect(r.bodyMatches.length).toBeGreaterThan(0);
    expect(r.bodyMatches[0].excerpt).toContain("BST");
  });
  it("matches by tag", () => {
    const r = searchProblems(index, "hash");
    expect(r.titleMatches.map((e) => e.number)).toContain(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- search-index`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement search-index.ts**

```ts
import type { Problem, Difficulty } from "./types";
export interface SearchEntry {
  number: number; title: string; difficulty: Difficulty; tags: string[]; snippet: string;
}
export function buildSearchIndex(problems: Problem[]): SearchEntry[] {
  return problems.map((p) => ({
    number: p.number, title: p.title, difficulty: p.difficulty, tags: p.tags,
    snippet: [p.question, ...p.steps.map((s) => s.thinking)].join(" ").replace(/\s+/g, " ").trim(),
  }));
}
function excerpt(text: string, q: string): string {
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return "";
  const start = Math.max(0, i - 24);
  return (start > 0 ? "…" : "") + text.slice(start, i + q.length + 36).trim() + "…";
}
export function searchProblems(index: SearchEntry[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return { titleMatches: [], bodyMatches: [] as { entry: SearchEntry; excerpt: string }[] };
  const titleMatches = index.filter(
    (e) => e.title.toLowerCase().includes(q) || e.tags.some((t) => t.toLowerCase().includes(q)),
  );
  const titleNums = new Set(titleMatches.map((e) => e.number));
  const bodyMatches = index
    .filter((e) => !titleNums.has(e.number) && e.snippet.toLowerCase().includes(q))
    .map((e) => ({ entry: e, excerpt: excerpt(e.snippet, query) }));
  return { titleMatches, bodyMatches };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- search-index`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: ⌘K search index and query"
```

---

## Task 9: Shared Markdown renderer

**Files:**
- Create: `components/markdown/Markdown.tsx`, `components/markdown/Markdown.test.tsx`
- Modify: `app/layout.tsx` (import `katex/dist/katex.min.css`)

**Interfaces:**
- Produces: `<Markdown>{string}</Markdown>` Client Component rendering markdown with remark-gfm + remark-math + rehype-katex + rehype-pretty-code (shiki dual theme). Inline code styled with mono + subtle bg.

- [ ] **Step 1: Write failing markdown test**

`components/markdown/Markdown.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Markdown } from "./Markdown";
describe("Markdown", () => {
  it("renders paragraphs and inline code", async () => {
    render(<Markdown>{"hello `root` world"}</Markdown>);
    expect(await screen.findByText("root")).toBeInTheDocument();
  });
  it("renders list items", async () => {
    render(<Markdown>{"- one\n- two"}</Markdown>);
    expect(await screen.findByText("one")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- Markdown`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement Markdown.tsx**

```tsx
"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-notes">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ className, children, ...props }) {
            const isBlock = /language-/.test(className ?? "");
            if (isBlock) return <code className={className} {...props}>{children}</code>;
            return (
              <code className="rounded bg-panel-2 px-1.5 py-0.5 font-mono text-[.85em] text-fg-2" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
```

> Note: rehype-pretty-code runs in the build pipeline for fenced code blocks; in this shared inline renderer we keep client-side rendering simple. Full syntax highlighting of `Step.code` is done in `StepBlock` (Task 14) via a build-time highlighter helper to avoid shipping shiki to the client. See Task 14.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- Markdown`
Expected: PASS.

- [ ] **Step 5: Add KaTeX + prose styles**

In `app/layout.tsx` add `import "katex/dist/katex.min.css";` at top.
In `styles/globals.css` add minimal prose rules:
```css
.prose-notes p { line-height: 1.65; margin: 0 0 .75rem; color: var(--fg-2); }
.prose-notes ul { list-style: disc; padding-left: 1.25rem; margin: 0 0 .75rem; }
.prose-notes li { margin: .15rem 0; color: var(--fg-2); }
.prose-notes strong { color: var(--fg); font-weight: 600; }
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: shared Markdown renderer with math + gfm"
```

---

## Task 10: Dummy content (problems + concepts)

**Files:**
- Create: `content/problems/{1,20,200,322,146,98,700}-*.md`, `content/concepts/{stack,hash-table,dynamic-programming,bfs,two-pointers}.md`
- Modify: `content/problems/701-insert-into-a-binary-search-tree.md` (add frontmatter: `number, difficulty, solved, conceptIds, stepTitles`)

**Interfaces:**
- Produces: content matching screenshots. Problems carry `number, title, difficulty, tags, created, solved, conceptIds, stepTitles`. This is a content task; "tests" are the existing loader tests still passing + a build.

- [ ] **Step 1: Enrich the 701 frontmatter**

Add to `content/problems/701-...md` frontmatter:
```yaml
number: 701
difficulty: Medium
solved: true
conceptIds: [binary-search-tree]
stepTitles: [反復による挿入, 条件式を明示的にして整理, 再帰版で実装]
tags: [Tree, BST]
```
(Keep existing `title`, `source`, `created`, `description`.)

- [ ] **Step 2: Author remaining problem files**

Create one `.md` per problem below. Each MUST follow the structure: frontmatter + `## Question` (with an Example fenced block and a `**Constraints:**` list using `$...$`) + `## Approach` with `### Step 1..N`, each containing `#### 思考` (bullets), `#### 実装` (```python block), `#### パフォーマンス` (`Time complexity : $...$` / `Space complexity: $...$`). Use realistic but concise content.

Files & key frontmatter (difficulty/tags/solved/conceptIds per screenshots):
- `1-two-sum.md` — Two Sum, Easy, tags [Array, Hash], solved true, conceptIds [hash-table], stepTitles [ブルートフォース, ハッシュで一回走査]
- `20-valid-parentheses.md` — Valid Parentheses, Easy, tags [Stack], solved true, conceptIds [stack], stepTitles [スタックで対応付け]
- `200-number-of-islands.md` — Number of Islands, Medium, tags [Graph, BFS], solved true, conceptIds [bfs], stepTitles [DFS で塗りつぶし, BFS で塗りつぶし]
- `146-lru-cache.md` — LRU Cache, Hard, tags [Design], solved true, conceptIds [hash-table], stepTitles [OrderedDict, 双方向連結リスト＋ハッシュ]
- `322-coin-change.md` — Coin Change, Medium, tags [DP], solved false, conceptIds [dynamic-programming], stepTitles [トップダウン, ボトムアップ DP]
- `98-validate-bst.md` — Validate Binary Search Tree, Medium, tags [Tree, BST], solved false, conceptIds [binary-search-tree], stepTitles [上下限を渡す再帰]
- `700-search-in-a-bst.md` — Search in a Binary Search Tree, Easy, tags [Tree, BST], solved true, conceptIds [binary-search-tree], stepTitles [反復探索]

Example skeleton (`1-two-sum.md`):
```md
---
number: 1
title: Two Sum
source: https://leetcode.com/problems/two-sum/
created: 2026-05-04
difficulty: Easy
solved: true
tags: [Array, Hash]
conceptIds: [hash-table]
stepTitles: [ブルートフォース, ハッシュで一回走査]
---
# Two Sum
- Difficulty: Easy

## Question
配列 `nums` と整数 `target` が与えられる。和が `target` になる 2 要素の添字を返す。

**Example 1:**
```
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
```

**Constraints:**
 - $2 \leq \text{nums.length} \leq 10^4$
 - $-10^9 \leq \text{nums[i]} \leq 10^9$

## Approach
### Step 1
#### 思考
 - すべての 2 要素の組を試す
#### 実装
```python
class Solution:
    def two_sum(self, nums, target):
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] + nums[j] == target:
                    return [i, j]
```
#### パフォーマンス
 - Time complexity : $O(n^2)$
 - Space complexity: $O(1)$

### Step 2
#### 思考
 - 補数をハッシュに記録して一回走査
#### 実装
```python
class Solution:
    def two_sum(self, nums, target):
        seen = {}
        for i, x in enumerate(nums):
            if target - x in seen:
                return [seen[target - x], i]
            seen[x] = i
```
#### パフォーマンス
 - Time complexity : $O(n)$
 - Space complexity: $O(n)$
```

- [ ] **Step 3: Author remaining concept files**

Create `content/concepts/*.md` for: `stack` (Stack/スタック/構造/習得/100/[20]), `hash-table` (Hash Table/ハッシュ表/構造/復習中/65/[1,146]), `dynamic-programming` (Dynamic Programming/動的計画法/アルゴ/復習中/55/[322]), `bfs` (BFS/幅優先探索/アルゴ/習得/100/[200]), `two-pointers` (Two Pointers/二ポインタ/アルゴ/復習中/60/[]). Each with a `complexity` array and a `note` body (use `$...$` for inline math). Follow the `binary-search-tree.md` format from Task 6.

- [ ] **Step 4: Verify loaders + parser still pass and build**

Run: `npm run test`
Expected: PASS (701 step titles now resolve to authored names).
Run: `npm run build`
Expected: success.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "content: dummy problems and concepts matching screenshots"
```

---

## Task 11: TopBar, SegmentSwitch & shell chrome

**Files:**
- Create: `components/layout/TopBar.tsx`, `components/layout/SegmentSwitch.tsx`, `components/layout/TopBar.test.tsx`

**Interfaces:**
- Consumes: `ThemeToggle` (Task 2).
- Produces: `<TopBar variant="problems" | "concepts" onSearchClick={() => void} />` rendering logo + "algo notes", a search field (shows `⌘K` keycap; clicking triggers `onSearchClick`), the problems/concepts `SegmentSwitch` (links to `/` and `/concepts`), sort button, primary add button, and `ThemeToggle`. `<SegmentSwitch active="problems"|"concepts" />`.

- [ ] **Step 1: Write failing TopBar test**

`components/layout/TopBar.test.tsx`:
```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { TopBar } from "./TopBar";
describe("TopBar", () => {
  it("shows app name and triggers search", () => {
    const onSearch = vi.fn();
    render(<ThemeProvider><TopBar variant="problems" onSearchClick={onSearch} /></ThemeProvider>);
    expect(screen.getByText("algo notes")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /search/i }));
    expect(onSearch).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- TopBar`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement SegmentSwitch then TopBar**

`components/layout/SegmentSwitch.tsx`:
```tsx
import Link from "next/link";
export function SegmentSwitch({ active }: { active: "problems" | "concepts" }) {
  const base = "px-3 py-1 text-[13px] font-semibold rounded-chip transition-colors";
  return (
    <div className="flex gap-1 rounded-chip bg-panel-2 p-1">
      <Link href="/" className={`${base} ${active === "problems" ? "bg-canvas text-fg shadow-sm" : "text-fg-3"}`}>問題</Link>
      <Link href="/concepts" className={`${base} ${active === "concepts" ? "bg-canvas text-fg shadow-sm" : "text-fg-3"}`}>概念</Link>
    </div>
  );
}
```

`components/layout/TopBar.tsx`:
```tsx
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- TopBar`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: top bar with segment switch and search affordance"
```

---

## Task 12: StatStrip

**Files:**
- Create: `components/layout/StatStrip.tsx`, `components/layout/StatStrip.test.tsx`

**Interfaces:**
- Consumes: `Problem` / `Concept` arrays.
- Produces: `<ProblemStats problems={Problem[]} />` showing solved count `X / Y`, difficulty breakdown with a stacked bar, this-week count (static dummy), streak (static dummy); `<ConceptStats concepts={Concept[]} />` showing total/習得/復習中/未学習 counts.

- [ ] **Step 1: Write failing test**

`components/layout/StatStrip.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProblemStats, ConceptStats } from "./StatStrip";
import type { Problem, Concept } from "@/lib/types";
const problems = [
  { number: 1, difficulty: "Easy", solved: true },
  { number: 2, difficulty: "Hard", solved: false },
] as Problem[];
const concepts = [
  { id: "a", mastery: "習得" }, { id: "b", mastery: "復習中" },
] as Concept[];
describe("StatStrip", () => {
  it("shows solved ratio", () => {
    render(<ProblemStats problems={problems} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText(/2/)).toBeInTheDocument();
  });
  it("shows concept totals", () => {
    render(<ConceptStats concepts={concepts} />);
    expect(screen.getByText(/2 概念/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- StatStrip`
Expected: FAIL.

- [ ] **Step 3: Implement StatStrip.tsx**

```tsx
import type { Problem, Concept } from "@/lib/types";
function Cell({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 border-r border-line px-5 py-4 last:border-r-0">{children}</div>;
}
const label = "text-[11px] text-fg-3 mb-1";
const big = "font-mono text-[26px] font-extrabold leading-none";
export function ProblemStats({ problems }: { problems: Problem[] }) {
  const solved = problems.filter((p) => p.solved).length;
  const e = problems.filter((p) => p.difficulty === "Easy").length;
  const m = problems.filter((p) => p.difficulty === "Medium").length;
  const h = problems.filter((p) => p.difficulty === "Hard").length;
  const total = Math.max(1, e + m + h);
  return (
    <div className="flex border-b border-line">
      <Cell><div className={label}>解いた問題</div><div className={big}>{solved} <span className="text-[15px] text-muted">/ {problems.length}</span></div></Cell>
      <Cell>
        <div className={label}>難易度</div>
        <div className="mb-2 font-mono text-[13px]"><span className="text-easy">易 {e}</span> <span className="text-medium">中 {m}</span> <span className="text-hard">難 {h}</span></div>
        <div className="flex h-1.5 overflow-hidden rounded-full">
          <span className="bg-easy" style={{ width: `${(e/total)*100}%` }} />
          <span className="bg-medium" style={{ width: `${(m/total)*100}%` }} />
          <span className="bg-hard" style={{ width: `${(h/total)*100}%` }} />
        </div>
      </Cell>
      <Cell><div className={label}>今週</div><div className={big}>9 <span className="text-[15px] text-muted">問</span></div></Cell>
      <Cell><div className={label}>連続記録</div><div className={big}>12 <span className="text-[15px] text-muted">日 🔥</span></div></Cell>
    </div>
  );
}
export function ConceptStats({ concepts }: { concepts: Concept[] }) {
  const c = (m: string) => concepts.filter((x) => x.mastery === m).length;
  return (
    <div className="flex gap-4 border-b border-line px-5 py-3 font-mono text-[13px]">
      <span className="font-semibold">{concepts.length} 概念</span>
      <span className="text-easy">習得 {c("習得")}</span>
      <span className="text-medium">復習中 {c("復習中")}</span>
      <span className="text-muted">未学習 {c("未学習")}</span>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- StatStrip`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: stat strip for problems and concepts"
```

---

## Task 13: Sidebar / FilterPanel

**Files:**
- Create: `components/library/FilterPanel.tsx`, `components/library/FilterPanel.test.tsx`

**Interfaces:**
- Produces: `<FilterPanel variant="problems" tags={string[]} filters={Filters} onChange={(f: Filters) => void} />`. `Filters = { difficulty: "すべて"|Difficulty; tags: string[]; kind: "すべて"|Kind; mastery: "すべて"|Mastery }`. For `variant="problems"` shows 難易度 (すべて/Easy/Medium/Hard) + tag chips; for `concepts` shows 種別 + 習得度.

- [ ] **Step 1: Write failing test**

`components/library/FilterPanel.test.tsx`:
```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FilterPanel, type Filters } from "./FilterPanel";
const base: Filters = { difficulty: "すべて", tags: [], kind: "すべて", mastery: "すべて" };
describe("FilterPanel", () => {
  it("selects a difficulty", () => {
    const onChange = vi.fn();
    render(<FilterPanel variant="problems" tags={["Tree"]} filters={base} onChange={onChange} />);
    fireEvent.click(screen.getByText("Easy"));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ difficulty: "Easy" }));
  });
  it("toggles a tag", () => {
    const onChange = vi.fn();
    render(<FilterPanel variant="problems" tags={["Tree"]} filters={base} onChange={onChange} />);
    fireEvent.click(screen.getByText("Tree"));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ tags: ["Tree"] }));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- FilterPanel`
Expected: FAIL.

- [ ] **Step 3: Implement FilterPanel.tsx**

```tsx
"use client";
import type { Difficulty, Kind, Mastery } from "@/lib/types";
export interface Filters {
  difficulty: "すべて" | Difficulty;
  tags: string[];
  kind: "すべて" | Kind;
  mastery: "すべて" | Mastery;
}
const row = "block w-full rounded-chip px-3 py-1.5 text-left text-[13px] transition-colors";
function Item({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`${row} ${active ? "bg-panel-2 font-semibold text-fg" : "text-fg-3 hover:text-fg"}`}>{children}</button>;
}
export function FilterPanel({ variant, tags, filters, onChange }: {
  variant: "problems" | "concepts"; tags: string[]; filters: Filters; onChange: (f: Filters) => void;
}) {
  const heading = "mb-2 mt-5 text-[11px] font-semibold text-fg-3 first:mt-0";
  if (variant === "problems") {
    const diffs: ("すべて" | Difficulty)[] = ["すべて", "Easy", "Medium", "Hard"];
    return (
      <aside className="w-[196px] shrink-0 border-r border-line px-3 py-5">
        <div className={heading}>難易度</div>
        {diffs.map((d) => (
          <Item key={d} active={filters.difficulty === d} onClick={() => onChange({ ...filters, difficulty: d })}>{d === "すべて" ? "すべて" : d}</Item>
        ))}
        <div className={heading}>タグ</div>
        <div className="flex flex-wrap gap-1.5 px-1">
          {tags.map((t) => {
            const on = filters.tags.includes(t);
            return (
              <button key={t} onClick={() => onChange({ ...filters, tags: on ? filters.tags.filter((x) => x !== t) : [...filters.tags, t] })}
                className={`rounded-chip border px-2 py-1 text-[12px] ${on ? "border-accent text-accent" : "border-line text-fg-3"}`}>{t}</button>
            );
          })}
        </div>
      </aside>
    );
  }
  const kinds: ("すべて" | Kind)[] = ["すべて", "構造", "アルゴ"];
  const masteries: ("すべて" | Mastery)[] = ["すべて", "習得", "復習中", "未学習"];
  const kindLabel = (k: string) => (k === "構造" ? "データ構造" : k === "アルゴ" ? "アルゴリズム" : "すべて");
  return (
    <aside className="w-[196px] shrink-0 border-r border-line px-3 py-5">
      <div className={heading}>種別</div>
      {kinds.map((k) => <Item key={k} active={filters.kind === k} onClick={() => onChange({ ...filters, kind: k })}>{kindLabel(k)}</Item>)}
      <div className={heading}>習得度</div>
      {masteries.map((m) => <Item key={m} active={filters.mastery === m} onClick={() => onChange({ ...filters, mastery: m })}>{m}</Item>)}
    </aside>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- FilterPanel`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: sidebar filter panel for problems and concepts"
```

---

## Task 14: Problem Library page + ProblemCard + syntax highlighter helper

**Files:**
- Create: `components/library/ProblemCard.tsx`, `components/library/LibraryView.tsx`, `lib/highlight.ts`, `components/library/ProblemCard.test.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `Problem`, `getAllProblems`, `ProblemStats`, `FilterPanel`/`Filters`, `TopBar`.
- Produces: `<ProblemCard problem={Problem} />`; `<LibraryView problems={Problem[]} />` (Client: holds `Filters` + filtered grid + opens palette); `app/page.tsx` Server Component passing `getAllProblems()`. `lib/highlight.ts`: `highlightCode(code: string, lang: string): Promise<{ light: string; dark: string }>` returning shiki HTML for both themes (used by StepBlock in Task 16; defined here so the helper exists before detail tasks).

- [ ] **Step 1: Write failing ProblemCard test**

`components/library/ProblemCard.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProblemCard } from "./ProblemCard";
import type { Problem } from "@/lib/types";
const p = { number: 701, title: "Insert into a Binary Search Tree", difficulty: "Medium",
  tags: ["Tree","BST"], solved: true, created: "2026-05-04", steps: [{},{},{}] } as unknown as Problem;
describe("ProblemCard", () => {
  it("renders number, title, difficulty and step count", () => {
    render(<ProblemCard problem={p} />);
    expect(screen.getByText("#701")).toBeInTheDocument();
    expect(screen.getByText("Insert into a Binary Search Tree")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByText(/3 アプローチ/)).toBeInTheDocument();
    expect(screen.getByText(/解答済/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- ProblemCard`
Expected: FAIL.

- [ ] **Step 3: Implement highlight.ts, ProblemCard, LibraryView, page**

`lib/highlight.ts`:
```ts
import { codeToHtml } from "shiki";
export async function highlightCode(code: string, lang: string): Promise<{ light: string; dark: string }> {
  const safe = lang || "text";
  const [light, dark] = await Promise.all([
    codeToHtml(code, { lang: safe, theme: "github-light" }).catch(() => `<pre>${code}</pre>`),
    codeToHtml(code, { lang: safe, theme: "github-dark" }).catch(() => `<pre>${code}</pre>`),
  ]);
  return { light, dark };
}
```

`components/library/ProblemCard.tsx`:
```tsx
import Link from "next/link";
import type { Problem } from "@/lib/types";
const diffClass: Record<string, string> = { Easy: "text-easy", Medium: "text-medium", Hard: "text-hard" };
export function ProblemCard({ problem: p }: { problem: Problem }) {
  return (
    <Link href={`/problems/${p.number}`}
      className="block rounded-card border border-line bg-canvas p-[18px] shadow-card transition-colors hover:border-fg">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[12px] text-fg-3">#{p.number}</span>
        <span className={`text-[12px] ${p.solved ? "text-easy" : "text-muted"}`}>{p.solved ? "✓ 解答済" : "○ 未着手"}</span>
      </div>
      <h3 className="mb-2 text-[15px] font-semibold text-fg">{p.title}</h3>
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <span className={`rounded-chip bg-panel-2 px-2 py-0.5 font-mono text-[11px] ${diffClass[p.difficulty]}`}>{p.difficulty}</span>
        {p.tags.map((t) => <span key={t} className="rounded-chip bg-panel-2 px-2 py-0.5 text-[11px] text-fg-3">{t}</span>)}
      </div>
      <div className="flex items-center justify-between border-t border-line pt-2 font-mono text-[11px] text-fg-3">
        <span>{p.steps.length} アプローチ</span>
        <span>更新 {p.created.slice(5).replace("-", "/")}</span>
      </div>
    </Link>
  );
}
```

`components/library/LibraryView.tsx`:
```tsx
"use client";
import { useMemo, useState } from "react";
import type { Problem } from "@/lib/types";
import { TopBar } from "@/components/layout/TopBar";
import { ProblemStats } from "@/components/layout/StatStrip";
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
      <ProblemStats problems={problems} />
      <div className="flex">
        <FilterPanel variant="problems" tags={tags} filters={filters} onChange={setFilters} />
        <div className="grid flex-1 grid-cols-2 gap-3.5 p-5">
          {filtered.map((p) => <ProblemCard key={p.number} problem={p} />)}
        </div>
      </div>
      <CommandPalette problems={problems} open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </main>
  );
}
```

`app/page.tsx`:
```tsx
import { getAllProblems } from "@/lib/problems";
import { LibraryView } from "@/components/library/LibraryView";
export default function Home() {
  return <LibraryView problems={getAllProblems()} />;
}
```

> Note: `CommandPalette` is created in Task 18; until then, stub it as `export function CommandPalette() { return null; }` in `components/search/CommandPalette.tsx` so this task builds. Task 18 replaces the stub.

- [ ] **Step 4: Create CommandPalette stub so the page compiles**

`components/search/CommandPalette.tsx`:
```tsx
"use client";
import type { Problem } from "@/lib/types";
export function CommandPalette(_props: { problems: Problem[]; open: boolean; onClose: () => void }) {
  return null;
}
```

- [ ] **Step 5: Run test + build to verify**

Run: `npm run test -- ProblemCard`
Expected: PASS.
Run: `npm run build`
Expected: success; `/` renders the library grid.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: problem library page with cards, filters, stats"
```

---

## Task 15: Concept Library page + ConceptCard

**Files:**
- Create: `components/library/ConceptCard.tsx`, `components/library/ConceptLibraryView.tsx`, `components/library/ConceptCard.test.tsx`
- Modify: `app/concepts/page.tsx` (create)

**Interfaces:**
- Consumes: `Concept`, `getAllConcepts`, `ConceptStats`, `FilterPanel`, `masteryColorVar`.
- Produces: `<ConceptCard concept={Concept} />`; `<ConceptLibraryView concepts={Concept[]} />`; `app/concepts/page.tsx`.

- [ ] **Step 1: Write failing ConceptCard test**

`components/library/ConceptCard.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConceptCard } from "./ConceptCard";
import type { Concept } from "@/lib/types";
const c = { id: "binary-search-tree", name: "Binary Search Tree", nameJa: "二分探索木",
  kind: "構造", mastery: "習得", masteryPct: 100, problemNumbers: [701,700,98], complexity: [], note: "" } as Concept;
describe("ConceptCard", () => {
  it("renders name, japanese name, kind and problem count", () => {
    render(<ConceptCard concept={c} />);
    expect(screen.getByText("Binary Search Tree")).toBeInTheDocument();
    expect(screen.getByText("二分探索木")).toBeInTheDocument();
    expect(screen.getByText("構造")).toBeInTheDocument();
    expect(screen.getByText(/3 問題/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- ConceptCard`
Expected: FAIL.

- [ ] **Step 3: Implement ConceptCard, ConceptLibraryView, page**

`components/library/ConceptCard.tsx`:
```tsx
import Link from "next/link";
import type { Concept } from "@/lib/types";
import { masteryColorVar } from "@/lib/difficulty";
export function ConceptCard({ concept: c }: { concept: Concept }) {
  const color = `var(${masteryColorVar(c.mastery)})`;
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
      <div className="mb-1.5 mt-3 flex items-center justify-between text-[12px]">
        <span style={{ color }}>{c.mastery}</span>
        <span className="font-mono text-fg-3">{c.problemNumbers.length} 問題</span>
      </div>
      <div className="h-[5px] w-full overflow-hidden rounded-full bg-panel-2">
        <span className="block h-full rounded-full" style={{ width: `${c.masteryPct}%`, background: color }} />
      </div>
    </Link>
  );
}
```

`components/library/ConceptLibraryView.tsx`:
```tsx
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
```

`app/concepts/page.tsx`:
```tsx
import { getAllConcepts } from "@/lib/concepts";
import { ConceptLibraryView } from "@/components/library/ConceptLibraryView";
export default function ConceptsPage() {
  return <ConceptLibraryView concepts={getAllConcepts()} />;
}
```

- [ ] **Step 4: Run test + build to verify**

Run: `npm run test -- ConceptCard`
Expected: PASS.
Run: `npm run build`
Expected: success; `/concepts` renders.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: concept library page with mastery cards"
```

---

## Task 16: Problem Detail page (TocRail, ExampleBlock, ComplexityChip, StepBlock)

**Files:**
- Create: `components/detail/TocRail.tsx`, `components/detail/ComplexityChip.tsx`, `components/detail/StepBlock.tsx`, `components/detail/ProblemDetail.tsx`, `components/detail/StepBlock.test.tsx`
- Modify: `app/problems/[number]/page.tsx` (create), `app/page.tsx` (none)

**Interfaces:**
- Consumes: `Problem`, `getProblem`, `getAllProblems`, `Markdown`, `highlightCode`, `conceptsForProblem`, `getAllConcepts`.
- Produces: `<ComplexityChip label="Time"|"Space" value={string} />` (renders value via KaTeX inline); `<StepBlock step={Step} highlighted={{light,dark}} defaultOpen={boolean} />` (collapsible; header shows number badge + title + `O(h) · O(1)` when collapsed); `<TocRail items={{id,label,active?}[]} backHref backLabel />`; `ProblemDetail` client wrapper managing `expandedSteps`. Page is a Server Component generating `generateStaticParams` from all problems and pre-highlighting each step's code.

- [ ] **Step 1: Write failing StepBlock test**

`components/detail/StepBlock.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { StepBlock } from "./StepBlock";
import type { Step } from "@/lib/types";
const step: Step = { index: 1, title: "反復による挿入", thinking: "- BST が前提", codeLang: "python",
  code: "while node:\n  pass", timeComplexity: "O(h)", spaceComplexity: "O(1)", note: undefined };
const hl = { light: "<pre>while node</pre>", dark: "<pre>while node</pre>" };
describe("StepBlock", () => {
  it("collapsed by default shows title and complexity summary", () => {
    render(<StepBlock step={step} highlighted={hl} defaultOpen={false} />);
    expect(screen.getByText("反復による挿入")).toBeInTheDocument();
    expect(screen.getByText(/O\(h\)/)).toBeInTheDocument();
    expect(screen.queryByText(/思考/)).toBeNull();
  });
  it("expands on header click", () => {
    render(<StepBlock step={step} highlighted={hl} defaultOpen={false} />);
    fireEvent.click(screen.getByText("反復による挿入"));
    expect(screen.getByText("思考")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- StepBlock`
Expected: FAIL.

- [ ] **Step 3: Implement ComplexityChip, StepBlock, TocRail, ProblemDetail, page**

`components/detail/ComplexityChip.tsx`:
```tsx
"use client";
import { useEffect, useRef } from "react";
import katex from "katex";
export function ComplexityChip({ label, value }: { label: string; value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current && value) katex.render(value, ref.current, { throwOnError: false });
  }, [value]);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-chip border border-line px-2.5 py-1 font-mono text-[12px] text-fg-3">
      {label} <span ref={ref} className="text-fg" />
    </span>
  );
}
```

`components/detail/StepBlock.tsx`:
```tsx
"use client";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Step } from "@/lib/types";
import { Markdown } from "@/components/markdown/Markdown";
import { ComplexityChip } from "./ComplexityChip";
import { useTheme } from "@/components/theme/ThemeProvider";
export function StepBlock({ step, highlighted, defaultOpen }: {
  step: Step; highlighted: { light: string; dark: string }; defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const { theme } = useTheme();
  return (
    <div className="mb-3 overflow-hidden rounded-inner border border-line">
      <button onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left">
        <span className={`grid h-5 w-5 place-items-center rounded font-mono text-[11px] ${open ? "bg-fg text-canvas" : "bg-panel-2 text-fg-3"}`}>{step.index}</span>
        <span className="flex-1 text-[14px] font-semibold text-fg">{step.title}</span>
        {!open && <span className="font-mono text-[12px] text-fg-3">{step.timeComplexity} · {step.spaceComplexity}</span>}
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {open && (
        <div className="border-t border-line px-4 py-4">
          <div className="mb-2 text-[11px] font-semibold text-fg-3">思考</div>
          <Markdown>{step.thinking}</Markdown>
          <div className="mb-2 mt-4 text-[11px] font-semibold text-fg-3">実装</div>
          <div className="overflow-x-auto rounded-block border border-code-border bg-code-bg p-3 text-[13px] [&_pre]:!bg-transparent"
            dangerouslySetInnerHTML={{ __html: theme === "dark" ? highlighted.dark : highlighted.light }} />
          <div className="mt-4 flex gap-2">
            <ComplexityChip label="Time" value={step.timeComplexity} />
            <ComplexityChip label="Space" value={step.spaceComplexity} />
          </div>
          {step.note && (<><div className="mb-2 mt-4 text-[11px] font-semibold text-fg-3">注意点</div><Markdown>{step.note}</Markdown></>)}
        </div>
      )}
    </div>
  );
}
```

`components/detail/TocRail.tsx`:
```tsx
import Link from "next/link";
export function TocRail({ backHref, backLabel, items }: {
  backHref: string; backLabel: string; items: { id: string; label: string; active?: boolean }[];
}) {
  return (
    <nav className="w-[218px] shrink-0 bg-panel px-4 py-5 text-[13px]">
      <Link href={backHref} className="mb-4 block text-fg-3 hover:text-fg">← {backLabel}</Link>
      <div className="mb-2 text-[11px] font-semibold text-fg-3">目次</div>
      {items.map((it) => (
        <a key={it.id} href={`#${it.id}`}
          className={`block rounded px-2 py-1 ${it.active ? "border-l-2 border-accent bg-canvas font-semibold text-fg" : "text-fg-3 hover:text-fg"}`}>{it.label}</a>
      ))}
    </nav>
  );
}
```

`components/detail/ProblemDetail.tsx`:
```tsx
"use client";
import type { Problem, Step } from "@/lib/types";
import { TocRail } from "./TocRail";
import { StepBlock } from "./StepBlock";
import { Markdown } from "@/components/markdown/Markdown";
import { ConceptChips } from "./ConceptChips";
import type { Concept } from "@/lib/types";
const diffClass: Record<string, string> = { Easy: "text-easy", Medium: "text-medium", Hard: "text-hard" };
export function ProblemDetail({ problem, highlights, concepts }: {
  problem: Problem; highlights: { light: string; dark: string }[]; concepts: Concept[];
}) {
  const toc = [
    { id: "question", label: "問題・制約" },
    ...problem.steps.map((s: Step) => ({ id: `step-${s.index}`, label: `Step ${s.index}` })),
  ];
  return (
    <div className="mx-auto flex max-w-[1100px]">
      <TocRail backHref="/" backLabel="ライブラリ" items={toc} />
      <article className="max-w-[760px] flex-1 px-[38px] py-[30px]">
        <div className="mb-3 flex items-center gap-2 font-mono text-[12px] text-fg-3">
          <span>#{problem.number}</span>
          <span className={`rounded-chip bg-panel-2 px-2 py-0.5 ${diffClass[problem.difficulty]}`}>{problem.difficulty}</span>
          {problem.tags.map((t) => <span key={t}>{t}</span>)}
          {problem.source && <a href={problem.source} className="ml-auto text-accent-deep">leetcode ↗</a>}
        </div>
        <h1 className="mb-4 text-[30px] font-extrabold tracking-[-0.025em]" id="question">{problem.title}</h1>
        <Markdown>{problem.question}</Markdown>
        {concepts.length > 0 && <ConceptChips concepts={concepts} />}
        <h2 className="mb-3 mt-8 text-[18px] font-bold">アプローチ</h2>
        {problem.steps.map((s, i) => (
          <div key={s.index} id={`step-${s.index}`}>
            <StepBlock step={s} highlighted={highlights[i]} defaultOpen={i === 0} />
          </div>
        ))}
      </article>
    </div>
  );
}
```

`app/problems/[number]/page.tsx`:
```tsx
import { notFound } from "next/navigation";
import { getAllProblems, getProblem } from "@/lib/problems";
import { getAllConcepts } from "@/lib/concepts";
import { conceptsForProblem } from "@/lib/links";
import { highlightCode } from "@/lib/highlight";
import { ProblemDetail } from "@/components/detail/ProblemDetail";
export function generateStaticParams() {
  return getAllProblems().map((p) => ({ number: String(p.number) }));
}
export default async function ProblemPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const problem = getProblem(Number(number));
  if (!problem) notFound();
  const highlights = await Promise.all(problem.steps.map((s) => highlightCode(s.code, s.codeLang)));
  const concepts = conceptsForProblem(problem, getAllConcepts());
  return <ProblemDetail problem={problem} highlights={highlights} concepts={concepts} />;
}
```

> Note: `ConceptChips` is created in Task 17; add a stub now: `export function ConceptChips() { return null; }` in `components/detail/ConceptChips.tsx`, replaced in Task 17.

- [ ] **Step 4: Add ConceptChips stub for compilation**

`components/detail/ConceptChips.tsx`:
```tsx
import type { Concept } from "@/lib/types";
export function ConceptChips(_props: { concepts: Concept[] }) { return null; }
```

- [ ] **Step 5: Run test + build to verify**

Run: `npm run test -- StepBlock`
Expected: PASS.
Run: `npm run build`
Expected: success; `/problems/701` renders with Step 1 expanded, highlighted code, complexity chips.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: problem detail page with TOC, steps, highlight, complexity"
```

---

## Task 17: Concept Detail page (ComplexityTable, RelatedProblems, ConceptChips)

**Files:**
- Create: `components/detail/ComplexityTable.tsx`, `components/detail/RelatedProblems.tsx`, `components/detail/ConceptDetail.tsx`, `components/detail/ComplexityTable.test.tsx`
- Modify: `components/detail/ConceptChips.tsx` (replace stub), `app/concepts/[id]/page.tsx` (create)

**Interfaces:**
- Consumes: `Concept`, `Problem`, `getConcept`, `getAllConcepts`, `getAllProblems`, `problemsForConcept`, `conceptsForProblem`.
- Produces: `<ComplexityTable rows={ConceptComplexityRow[]} />` (KaTeX cells); `<RelatedProblems problems={Problem[]} />` (rows linking to `/problems/[n]`); `<ConceptChips concepts={Concept[]} />` (links to `/concepts/[id]`); `ConceptDetail`; page with `generateStaticParams`.

- [ ] **Step 1: Write failing ComplexityTable test**

`components/detail/ComplexityTable.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ComplexityTable } from "./ComplexityTable";
describe("ComplexityTable", () => {
  it("renders headers and operation rows", () => {
    render(<ComplexityTable rows={[{ op: "探索", avg: "O(\\log n)", worst: "O(n)" }]} />);
    expect(screen.getByText("操作")).toBeInTheDocument();
    expect(screen.getByText("平均")).toBeInTheDocument();
    expect(screen.getByText("最悪")).toBeInTheDocument();
    expect(screen.getByText("探索")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- ComplexityTable`
Expected: FAIL.

- [ ] **Step 3: Implement components and page**

`components/detail/ComplexityTable.tsx`:
```tsx
"use client";
import { useEffect, useRef } from "react";
import katex from "katex";
import type { ConceptComplexityRow } from "@/lib/types";
function Tex({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => { if (ref.current) katex.render(value, ref.current, { throwOnError: false }); }, [value]);
  return <span ref={ref} className="font-mono text-[13px]" />;
}
export function ComplexityTable({ rows }: { rows: ConceptComplexityRow[] }) {
  return (
    <table className="my-3 w-full border-collapse overflow-hidden rounded-block border border-line text-left">
      <thead>
        <tr className="bg-panel-2 font-mono text-[12px] text-fg-3">
          <th className="px-4 py-2 font-medium">操作</th><th className="px-4 py-2 font-medium">平均</th><th className="px-4 py-2 font-medium">最悪</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.op} className="border-t border-line text-[14px]">
            <td className="px-4 py-2.5 text-fg-2">{r.op}</td>
            <td className="px-4 py-2.5"><Tex value={r.avg} /></td>
            <td className="px-4 py-2.5"><Tex value={r.worst} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

`components/detail/RelatedProblems.tsx`:
```tsx
import Link from "next/link";
import type { Problem } from "@/lib/types";
const diffClass: Record<string, string> = { Easy: "text-easy", Medium: "text-medium", Hard: "text-hard" };
export function RelatedProblems({ problems }: { problems: Problem[] }) {
  return (
    <div className="my-3 divide-y divide-line rounded-block border border-line">
      {problems.map((p) => (
        <Link key={p.number} href={`/problems/${p.number}`} className="flex items-center gap-3 px-4 py-3 hover:bg-panel">
          <span className="font-mono text-[12px] text-fg-3">#{p.number}</span>
          <span className="flex-1 text-[14px] font-semibold text-fg">{p.title}</span>
          <span className={`rounded-chip bg-panel-2 px-2 py-0.5 font-mono text-[11px] ${diffClass[p.difficulty]}`}>{p.difficulty}</span>
          <span className={`text-[12px] ${p.solved ? "text-easy" : "text-muted"}`}>{p.solved ? "✓ 解答済" : "○ 未着手"}</span>
        </Link>
      ))}
    </div>
  );
}
```

`components/detail/ConceptChips.tsx` (replace stub):
```tsx
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
```

`components/detail/ConceptDetail.tsx`:
```tsx
import type { Concept, Problem } from "@/lib/types";
import { TocRail } from "./TocRail";
import { Markdown } from "@/components/markdown/Markdown";
import { ComplexityTable } from "./ComplexityTable";
import { RelatedProblems } from "./RelatedProblems";
import { masteryColorVar } from "@/lib/difficulty";
export function ConceptDetail({ concept, problems }: { concept: Concept; problems: Problem[] }) {
  const color = `var(${masteryColorVar(concept.mastery)})`;
  return (
    <div className="mx-auto flex max-w-[1100px]">
      <TocRail backHref="/concepts" backLabel="概念ライブラリ" items={[
        { id: "overview", label: "概要" }, { id: "complexity", label: "計算量" },
        { id: "related", label: "関連する問題" }, { id: "note", label: "学習メモ" },
      ]} />
      <article className="max-w-[760px] flex-1 px-[38px] py-[30px]">
        <div className="mb-3 flex items-center gap-2 text-[12px]">
          <span className="rounded-chip bg-panel-2 px-2 py-0.5 text-fg-3">{concept.kind === "構造" ? "データ構造" : "アルゴ"}</span>
          <span style={{ color }}>● {concept.mastery}</span>
          <span className="ml-auto font-mono text-accent-deep">関連 {concept.problemNumbers.length} 問題</span>
        </div>
        <h1 className="text-[30px] font-extrabold tracking-[-0.025em]" id="overview">{concept.name}</h1>
        <p className="mb-4 text-[13px] text-fg-3">{concept.nameJa}</p>
        <div className="mb-2 text-[11px] font-semibold text-fg-3">概要</div>
        <Markdown>{concept.note}</Markdown>
        <h2 className="mb-2 mt-8 text-[18px] font-bold" id="complexity">計算量</h2>
        <ComplexityTable rows={concept.complexity} />
        <h2 className="mb-2 mt-8 text-[18px] font-bold" id="related">関連する問題</h2>
        <RelatedProblems problems={problems} />
        <h2 className="mb-2 mt-8 text-[18px] font-bold" id="note">学習メモ</h2>
        <div className="rounded-block border-l-[3px] border-accent bg-panel px-4 py-3"><Markdown>{concept.note}</Markdown></div>
      </article>
    </div>
  );
}
```

`app/concepts/[id]/page.tsx`:
```tsx
import { notFound } from "next/navigation";
import { getAllConcepts, getConcept } from "@/lib/concepts";
import { getAllProblems } from "@/lib/problems";
import { problemsForConcept } from "@/lib/links";
import { ConceptDetail } from "@/components/detail/ConceptDetail";
export function generateStaticParams() {
  return getAllConcepts().map((c) => ({ id: c.id }));
}
export default async function ConceptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const concept = getConcept(id);
  if (!concept) notFound();
  const problems = problemsForConcept(concept, getAllProblems());
  return <ConceptDetail concept={concept} problems={problems} />;
}
```

- [ ] **Step 4: Run test + build to verify**

Run: `npm run test -- ComplexityTable`
Expected: PASS.
Run: `npm run build`
Expected: success; `/concepts/binary-search-tree` shows table, related problems, note; problem detail now shows concept chips.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: concept detail with complexity table and bidirectional links"
```

---

## Task 18: ⌘K Command Palette

**Files:**
- Modify: `components/search/CommandPalette.tsx` (replace stub)
- Create: `components/search/CommandPalette.test.tsx`

**Interfaces:**
- Consumes: `buildSearchIndex`, `searchProblems` (Task 8), `Problem`.
- Produces: `<CommandPalette problems={Problem[]} open={boolean} onClose={() => void} />`. Opens on ⌘K/Ctrl+K (global listener), closes on Esc / backdrop click. Incremental query; ↑↓ select, ↵ navigate to `/problems/[n]`; renders "問題" group (title matches) and "本文中に一致" group (body matches with highlighted term).

- [ ] **Step 1: Write failing palette test**

`components/search/CommandPalette.test.tsx`:
```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CommandPalette } from "./CommandPalette";
import type { Problem } from "@/lib/types";
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
const problems = [
  { number: 701, title: "Insert into a Binary Search Tree", difficulty: "Medium", tags: ["BST"],
    question: "binary search tree", steps: [{ thinking: "BST が前提" }] },
] as unknown as Problem[];
describe("CommandPalette", () => {
  it("shows nothing when closed", () => {
    const { container } = render(<CommandPalette problems={problems} open={false} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });
  it("filters by query when open", () => {
    render(<CommandPalette problems={problems} open onClose={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/検索/), { target: { value: "binary" } });
    expect(screen.getByText("Insert into a Binary Search Tree")).toBeInTheDocument();
  });
  it("closes on Escape", () => {
    const onClose = vi.fn();
    render(<CommandPalette problems={problems} open onClose={onClose} />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- CommandPalette`
Expected: FAIL (stub returns null; query/Escape behavior absent).

- [ ] **Step 3: Implement CommandPalette.tsx**

```tsx
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
```

- [ ] **Step 4: Add global ⌘K listener in LibraryView**

In `components/library/LibraryView.tsx`, add inside the component:
```tsx
import { useEffect } from "react";
// ...inside component body, after useState declarations:
useEffect(() => {
  const onKey = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPaletteOpen(true); }
  };
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, []);
```

- [ ] **Step 5: Run test + build to verify**

Run: `npm run test -- CommandPalette`
Expected: PASS.
Run: `npm run build`
Expected: success; ⌘K opens palette on `/`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: ⌘K command palette with incremental search"
```

---

## Task 19: Mobile responsiveness & BottomTabBar

**Files:**
- Create: `components/layout/BottomTabBar.tsx`, `components/layout/BottomTabBar.test.tsx`
- Modify: `components/library/LibraryView.tsx`, `components/library/ConceptLibraryView.tsx`, `components/detail/ProblemDetail.tsx`, `components/detail/ConceptDetail.tsx`, `app/layout.tsx`

**Interfaces:**
- Produces: `<BottomTabBar active="library"|"search"|"stats" />` fixed bottom tab bar shown `<768px`. Library grids collapse to 1 column (`grid-cols-1 md:grid-cols-2`); sidebars/TOC rails hide on mobile (`hidden md:block`).

- [ ] **Step 1: Write failing BottomTabBar test**

`components/layout/BottomTabBar.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BottomTabBar } from "./BottomTabBar";
describe("BottomTabBar", () => {
  it("renders the three tabs with active accent", () => {
    render(<BottomTabBar active="library" />);
    expect(screen.getByText("ライブラリ")).toBeInTheDocument();
    expect(screen.getByText("検索")).toBeInTheDocument();
    expect(screen.getByText("統計")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- BottomTabBar`
Expected: FAIL.

- [ ] **Step 3: Implement BottomTabBar + responsive classes**

`components/layout/BottomTabBar.tsx`:
```tsx
import Link from "next/link";
export function BottomTabBar({ active }: { active: "library" | "search" | "stats" }) {
  const item = (key: string, href: string, icon: string, label: string) => (
    <Link href={href} className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] ${active === key ? "text-accent" : "text-fg-3"}`}>
      <span className="text-[16px]">{icon}</span>{label}
    </Link>
  );
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-canvas md:hidden">
      {item("library", "/", "📚", "ライブラリ")}
      {item("search", "/", "⌕", "検索")}
      {item("stats", "/", "📊", "統計")}
    </nav>
  );
}
```

Responsive edits:
- In `LibraryView.tsx` and `ConceptLibraryView.tsx`: change grid to `grid grid-cols-1 gap-3.5 p-5 md:grid-cols-2`; wrap `<FilterPanel ...>` usage with `hidden md:block` via a wrapping `<div className="hidden md:block">` OR add `className` passthrough — simplest: wrap with `<div className="hidden md:flex">` around the sidebar+grid is wrong; instead wrap only FilterPanel: replace `<FilterPanel .../>` with `<div className="hidden md:block"><FilterPanel .../></div>`. Add `<BottomTabBar active="library" />` before closing `</main>` and add `pb-16 md:pb-0` to `<main>`.
- In `ProblemDetail.tsx` and `ConceptDetail.tsx`: wrap `<TocRail .../>` with `<div className="hidden md:block">...</div>`; change article padding to `px-5 py-6 md:px-[38px] md:py-[30px]`; add `<BottomTabBar active="library" />` and `pb-16 md:pb-0` on the outer container.

- [ ] **Step 4: Run test + build + responsive check**

Run: `npm run test -- BottomTabBar`
Expected: PASS.
Run: `npm run build`
Expected: success.
Manual: `npm run dev`, open at 375px width — single column, tab bar visible, rails hidden.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: mobile responsiveness and bottom tab bar"
```

---

## Task 20: Chat API stub (future seam)

**Files:**
- Create: `app/api/chat/route.ts`, `app/api/chat/route.test.ts`

**Interfaces:**
- Produces: `POST /api/chat` returning `501` with a JSON body `{ error: "not implemented" }`. Reserved for future Vercel AI SDK streaming. NOTE: with `output: "export"`, route handlers are not emitted in static export; this stub documents the seam and is used in dev/server mode. Mark the route `export const dynamic = "force-static"` is incompatible; instead keep the file but exclude from static export by documenting it. For the static build to pass, the handler must be present but `next build` with `output: export` will warn/ignore API routes — acceptable as a reserved seam.

- [ ] **Step 1: Write failing route test**

`app/api/chat/route.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { POST } from "./route";
describe("chat route stub", () => {
  it("returns 501", async () => {
    const res = await POST();
    expect(res.status).toBe(501);
    const body = await res.json();
    expect(body.error).toBe("not implemented");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- chat`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement route.ts**

```ts
// Future seam: Vercel AI SDK streaming chat with a free LLM provider (Groq/Gemini).
// Currently a stub returning 501. See docs/superpowers/specs (section 9).
export async function POST() {
  return new Response(JSON.stringify({ error: "not implemented" }), {
    status: 501,
    headers: { "content-type": "application/json" },
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- chat`
Expected: PASS.

- [ ] **Step 5: Reconcile static export**

If `npm run build` errors because API routes are incompatible with `output: "export"`, remove `output: "export"` from `next.config.ts` (switch to default server output; the app still works as SSG for pages and gains a server runtime for the future chat route). Re-run build.

Run: `npm run build`
Expected: success.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: reserve chat API stub for future streaming LLM"
```

---

## Task 21: Final integration pass

**Files:**
- Modify: any visual gaps found against screenshots.

- [ ] **Step 1: Full test run**

Run: `npm run test`
Expected: all green.

- [ ] **Step 2: Full build**

Run: `npm run build`
Expected: success, all routes generated (`/`, `/problems/[number]`, `/concepts`, `/concepts/[id]`).

- [ ] **Step 3: Visual comparison vs screenshots**

Run `npm run dev`. Compare each screen to `design_handoff_leetcode_notes_viewer/screenshots/`:
- 01/03 problem library (light/dark) — top bar, stat strip, sidebar, 2-col cards
- 02/04 problem detail — TOC rail, step expanded with highlight + complexity chips, collapsed steps show `O(h) · O(1)`
- 07/09 concept library — segment switch on concepts, mastery bars
- 08/10 concept detail — complexity table, related problems, note block
- 05/06 mobile — single column, bottom tab bar
- ⌘K palette (per 03) — backdrop, groups, highlighted matches
Fix spacing/color deviations using tokens only (no new values).

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "polish: align screens to screenshot targets"
```

---

## Self-Review Notes (author)

- **Spec coverage:** stack (T1-T2), tokens/theme (T2), types (T3), parser (T4), loaders (T5-T6), links (T7), search (T8), markdown (T9), dummy data (T10), all 6 screens (T11-T17, T19), ⌘K (T18), chat seam (T20), tests throughout, visual check (T21). All spec sections mapped.
- **Type consistency:** `Filters`, `Step`, `Problem`, `Concept`, `SearchEntry`, `highlightCode` signatures are reused verbatim across tasks. Stubs (`CommandPalette`, `ConceptChips`) are introduced before their consumers and replaced in their own tasks.
- **Known acceptable deferrals:** step display titles depend on `stepTitles` frontmatter added in T10; `output: export` vs API route reconciled in T20 Step 5.
```
