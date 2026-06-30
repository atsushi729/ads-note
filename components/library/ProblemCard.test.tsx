import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProblemCard } from "./ProblemCard";
import type { Problem } from "@/lib/types";
const p = { number: 701, title: "Insert into a Binary Search Tree", difficulty: "Medium",
  tags: ["Tree","BST"], solved: true, created: "2026-05-04", steps: [{},{},{}] } as unknown as Problem;
describe("ProblemCard", () => {
  it("renders number, title, difficulty and step count", () => {
    render(<ProblemCard problem={p} />);
    expect(screen.getByText("#701")).toBeInTheDocument();
    expect(screen.getByText("Insert into a Binary Search Tree")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByText(/3 アプローチ/)).toBeInTheDocument();
    expect(screen.getByText("Updated")).toBeInTheDocument();
    expect(screen.getByText("2026.05.04")).toBeInTheDocument();
    expect(screen.getByText(/解答済/)).toBeInTheDocument();
  });
});
