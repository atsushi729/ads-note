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
