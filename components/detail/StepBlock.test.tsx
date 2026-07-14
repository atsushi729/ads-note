import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { StepBlock } from "./StepBlock";
import type { Step } from "@/lib/types";
const step: Step = { index: 1, title: "反復による挿入", thinking: "- BST が前提", codeLang: "python",
  code: "while node:\n  pass", timeComplexity: "O(h)", spaceComplexity: "O(1)", note: undefined };
const hl = { light: "<pre>while node</pre>", dark: "<pre>while node</pre>" };
describe("StepBlock", () => {
  it("collapsed by default shows title and complexity summary", () => {
    const { container } = render(<StepBlock step={step} highlighted={hl} defaultOpen={false} />);
    expect(screen.getByText("反復による挿入")).toBeInTheDocument();
    expect(container.querySelectorAll(".katex").length).toBe(2);
    expect(container.textContent).toContain("O(h)");
    expect(screen.queryByText(/思考/)).toBeNull();
  });
  it("expands on header click", () => {
    render(<StepBlock step={step} highlighted={hl} defaultOpen={false} />);
    fireEvent.click(screen.getByText("反復による挿入"));
    expect(screen.getByText("思考")).toBeInTheDocument();
  });

  it("keeps code horizontally scrollable inside the block", () => {
    const { container } = render(<StepBlock step={step} highlighted={hl} defaultOpen />);
    expect(container.querySelector(".overflow-x-auto")).toBeInTheDocument();
  });
});
