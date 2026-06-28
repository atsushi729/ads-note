import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ComplexityTable } from "./ComplexityTable";
describe("ComplexityTable", () => {
  it("renders headers and operation rows", () => {
    render(<ComplexityTable rows={[{ op: "探索", avg: "O(\\log n)", worst: "O(n)" }]} />);
    expect(screen.getByText("操作")).toBeInTheDocument();
    expect(screen.getByText("平均")).toBeInTheDocument();
    expect(screen.getByText("最悪")).toBeInTheDocument();
    expect(screen.getByText("探索")).toBeInTheDocument();
  });
});
