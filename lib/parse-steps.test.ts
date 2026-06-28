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
