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
});
