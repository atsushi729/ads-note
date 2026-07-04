import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FilterPanel, type Filters } from "./FilterPanel";
const base: Filters = { difficulty: "すべて", tags: [], kind: "すべて" };
describe("FilterPanel", () => {
  it("selects a difficulty", () => {
    const onChange = vi.fn();
    render(<FilterPanel variant="problems" tags={["Tree"]} filters={base} onChange={onChange} />);
    fireEvent.click(screen.getByText("Easy"));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ difficulty: "Easy" }));
  });
  it("toggles a tag", () => {
    const onChange = vi.fn();
    render(<FilterPanel variant="problems" tags={["Tree"]} filters={base} onChange={onChange} />);
    fireEvent.click(screen.getByText("Tree"));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ tags: ["Tree"] }));
  });
});
