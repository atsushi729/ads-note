import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConceptDetail } from "./ConceptDetail";
import type { Concept } from "@/lib/types";

const concept = {
  id: "binary-search-tree",
  name: "Binary Search Tree",
  nameJa: "二分探索木",
  kind: "構造",
  mastery: "習得",
  masteryPct: 100,
  note: "木構造の探索を効率化する。",
  studyNote: "",
  problemNumbers: [],
  complexity: [{ op: "探索", avg: "O(\\log n)", worst: "O(n)" }],
} as Concept;

describe("ConceptDetail", () => {
  it("renders a mobile back link to the concept library", () => {
    render(<ConceptDetail concept={concept} problems={[]} />);
    expect(screen.getAllByRole("link", { name: /library/i }).some((link) =>
      link.getAttribute("href") === "/concepts" && link.className.includes("md:hidden")
    )).toBe(true);
  });
});
