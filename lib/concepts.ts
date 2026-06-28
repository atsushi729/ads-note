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
