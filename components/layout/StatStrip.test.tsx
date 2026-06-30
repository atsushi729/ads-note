import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConceptStats } from "./StatStrip";
import type { Concept } from "@/lib/types";
const concepts = [
  { id: "a", mastery: "習得" }, { id: "b", mastery: "復習中" },
] as Concept[];
describe("StatStrip", () => {
  it("shows concept totals", () => {
    render(<ConceptStats concepts={concepts} />);
    expect(screen.getByText(/2 概念/)).toBeInTheDocument();
  });
});
