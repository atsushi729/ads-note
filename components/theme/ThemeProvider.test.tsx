import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

beforeEach(() => { localStorage.clear(); document.documentElement.className = ""; });

describe("ThemeProvider", () => {
  it("toggles the dark class and persists", () => {
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: /theme/i }));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
  });
});
