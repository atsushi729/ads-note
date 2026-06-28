import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CommandPalette } from "./CommandPalette";
import type { Problem } from "@/lib/types";
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
const problems = [
  { number: 701, title: "Insert into a Binary Search Tree", difficulty: "Medium", tags: ["BST"],
    question: "binary search tree", steps: [{ thinking: "BST が前提" }] },
] as unknown as Problem[];
describe("CommandPalette", () => {
  it("shows nothing when closed", () => {
    const { container } = render(<CommandPalette problems={problems} open={false} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });
  it("filters by query when open", () => {
    render(<CommandPalette problems={problems} open onClose={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/検索/), { target: { value: "binary" } });
    expect(screen.getByText("Insert into a Binary Search Tree")).toBeInTheDocument();
  });
  it("closes on Escape", () => {
    const onClose = vi.fn();
    render(<CommandPalette problems={problems} open onClose={onClose} />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});
