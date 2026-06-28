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
