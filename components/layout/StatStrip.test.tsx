import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProblemStats, ConceptStats } from "./StatStrip";
import type { Problem, Concept } from "@/lib/types";
const problems = [
  { number: 1, difficulty: "Easy", solved: true },
  { number: 2, difficulty: "Hard", solved: false },
] as Problem[];
const concepts = [
  { id: "a", mastery: "習得" }, { id: "b", mastery: "復習中" },
] as Concept[];
describe("StatStrip", () => {
  it("shows solved ratio", () => {
    render(<ProblemStats problems={problems} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText(/\/ 2/)).toBeInTheDocument();
  });
  it("shows concept totals", () => {
    render(<ConceptStats concepts={concepts} />);
    expect(screen.getByText(/2 概念/)).toBeInTheDocument();
  });
});
