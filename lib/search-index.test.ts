import { describe, it, expect } from "vitest";
import { buildSearchIndex, searchProblems } from "./search-index";
import type { Problem } from "./types";

const problems = [
  { number: 701, title: "Insert into a Binary Search Tree", difficulty: "Medium", tags: ["Tree"],
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
