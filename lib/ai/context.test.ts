import { describe, it, expect } from "vitest";
import {
  buildSystemPrompt,
  serializeProblemContext,
  serializeConceptContext,
} from "./context";
import type { Problem, Concept } from "../types";

const problem: Problem = {
  number: 701,
  title: "Insert into a Binary Search Tree",
  difficulty: "Medium",
  tags: ["tree", "bst"],
  source: "LeetCode",
  created: "2026-06-01",
  solved: true,
  description: "Insert a value into a BST.",
  question: "Given the root of a BST and a value, insert it.",
  steps: [
    {
      index: 1,
      title: "再帰で挿入位置を探す",
      thinking: "値と現在ノードを比較して左右に降りる。",
      codeLang: "python",
      code: "def insert(root, val): ...",
      timeComplexity: "$O(h)$",
      spaceComplexity: "$O(1)$",
      note: "空の木に注意",
    },
  ],
  conceptIds: ["binary-search-tree"],
};

const concept: Concept = {
  id: "binary-search-tree",
  name: "Binary Search Tree",
  nameJa: "二分探索木",
  kind: "構造",
  note: "",
  studyNote: "左 < 親 < 右 の不変条件を保つ。",
  problemNumbers: [701, 700, 98],
  complexity: [{ op: "search", avg: "O(log n)", worst: "O(n)" }],
};

describe("buildSystemPrompt", () => {
  it("returns a base tutor prompt with no context", () => {
    const out = buildSystemPrompt();
    expect(out).toMatch(/アルゴリズム/);
    expect(out).toMatch(/日本語/);
    expect(out).not.toMatch(/現在ユーザー/);
  });

  it("embeds the provided note context", () => {
    const out = buildSystemPrompt({
      title: "#701 Insert into a BST",
      body: "ノート本文サンプル",
    });
    expect(out).toMatch(/現在ユーザー/);
    expect(out).toContain("#701 Insert into a BST");
    expect(out).toContain("ノート本文サンプル");
  });
});

describe("serializeProblemContext", () => {
  it("includes number, title, question, and step thinking + complexity", () => {
    const out = serializeProblemContext(problem);
    expect(out).toContain("701");
    expect(out).toContain("Insert into a Binary Search Tree");
    expect(out).toContain("insert it");
    expect(out).toContain("再帰で挿入位置を探す");
    expect(out).toContain("値と現在ノード");
    expect(out).toContain("$O(h)$");
  });
});

describe("serializeConceptContext", () => {
  it("includes name, study note, and complexity rows", () => {
    const out = serializeConceptContext(concept);
    expect(out).toContain("Binary Search Tree");
    expect(out).toContain("二分探索木");
    expect(out).toContain("不変条件");
    expect(out).toContain("search");
    expect(out).toContain("O(log n)");
  });
});
