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
