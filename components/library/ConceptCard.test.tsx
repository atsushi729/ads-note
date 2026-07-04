import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConceptCard } from "./ConceptCard";
import type { Concept } from "@/lib/types";
const c = { id: "binary-search-tree", name: "Binary Search Tree", nameJa: "二分探索木",
  kind: "構造", problemNumbers: [701,700,98], complexity: [], note: "", studyNote: "" } as Concept;
describe("ConceptCard", () => {
  it("renders name, japanese name and kind", () => {
    render(<ConceptCard concept={c} />);
    expect(screen.getByText("Binary Search Tree")).toBeInTheDocument();
    expect(screen.getByText("二分探索木")).toBeInTheDocument();
    expect(screen.getByText("構造")).toBeInTheDocument();
  });
});
