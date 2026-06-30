import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProblemDetail } from "./ProblemDetail";
import type { Problem } from "@/lib/types";

const problem = {
  number: 1,
  title: "Two Sum",
  difficulty: "Easy",
  tags: ["Hash Table"],
  source: "",
  created: "2026-06-30",
  solved: false,
  question: "Find two numbers.",
  steps: [],
  conceptIds: [],
} as Problem;

describe("ProblemDetail", () => {
  it("renders a mobile back link to the problem library", () => {
    render(<ProblemDetail problem={problem} highlights={[]} concepts={[]} />);
    expect(screen.getAllByRole("link", { name: /library/i }).some((link) =>
      link.getAttribute("href") === "/" && link.className.includes("md:hidden")
    )).toBe(true);
  });
});
