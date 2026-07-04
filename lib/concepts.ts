import matter from "gray-matter";
import type { Concept } from "./types";
import { conceptFiles } from "./content-data";

function loadOne(file: string, raw: string): Concept {
  const { data, content } = matter(raw);
  return {
    id: data.id ?? file.replace(/\.md$/, ""),
    name: data.name ?? "",
    nameJa: data.nameJa ?? "",
    kind: data.kind ?? "構造",
    note: content.trim(),
    studyNote: typeof data.studyNote === "string" ? data.studyNote : "",
    problemNumbers: Array.isArray(data.problemNumbers) ? data.problemNumbers : [],
    complexity: Array.isArray(data.complexity) ? data.complexity : [],
  };
}
export function getAllConcepts(): Concept[] {
  return Object.entries(conceptFiles)
    .map(([file, raw]) => loadOne(file, raw))
    .sort((a, b) => a.name.localeCompare(b.name));
}
export function getConcept(id: string): Concept | undefined {
  return getAllConcepts().find((c) => c.id === id);
}
