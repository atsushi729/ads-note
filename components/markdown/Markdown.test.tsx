import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Markdown } from "./Markdown";
describe("Markdown", () => {
  it("renders paragraphs and inline code", async () => {
    render(<Markdown>{"hello `root` world"}</Markdown>);
    expect(await screen.findByText("root")).toBeInTheDocument();
  });
  it("renders list items", async () => {
    render(<Markdown>{"- one\n- two"}</Markdown>);
    expect(await screen.findByText("one")).toBeInTheDocument();
  });
  it("renders GFM tables with design-system classes", async () => {
    render(<Markdown>{"| a | b |\n| --- | --- |\n| 1 | 2 |"}</Markdown>);
    const table = await screen.findByRole("table");
    expect(table).toHaveClass("border-collapse");
    expect(table.parentElement).toHaveClass("rounded-block", "border", "border-line");
    expect(screen.getByText("a").closest("th")).toHaveClass("text-fg-3");
    expect(screen.getByText("1").closest("td")).toHaveClass("border-t", "border-line");
  });
});
