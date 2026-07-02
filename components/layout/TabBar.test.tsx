import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TabBar } from "./TabBar";

describe("TabBar", () => {
  it("renders both tab links", () => {
    render(<TabBar active="problems" />);
    expect(screen.getByRole("link", { name: "問題" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "概念" })).toBeInTheDocument();
  });

  it("links point to correct hrefs", () => {
    render(<TabBar active="concepts" />);
    expect(screen.getByRole("link", { name: "問題" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "概念" })).toHaveAttribute("href", "/concepts");
  });

  it("applies active class to the active tab only (problems)", () => {
    const { container } = render(<TabBar active="problems" />);
    const links = container.querySelectorAll("a");
    const problemsLink = [...links].find((a) => a.textContent === "問題")!;
    const conceptsLink = [...links].find((a) => a.textContent === "概念")!;
    expect(problemsLink.className).toContain("border-accent");
    expect(conceptsLink.className).not.toContain("border-accent");
  });

  it("applies active class to the active tab only (concepts)", () => {
    const { container } = render(<TabBar active="concepts" />);
    const links = container.querySelectorAll("a");
    const problemsLink = [...links].find((a) => a.textContent === "問題")!;
    const conceptsLink = [...links].find((a) => a.textContent === "概念")!;
    expect(conceptsLink.className).toContain("border-accent");
    expect(problemsLink.className).not.toContain("border-accent");
  });
});
