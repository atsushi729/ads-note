import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { TopBar } from "./TopBar";
describe("TopBar", () => {
  it("shows app name and triggers search", () => {
    const onSearch = vi.fn();
    render(<ThemeProvider><TopBar variant="problems" onSearchClick={onSearch} /></ThemeProvider>);
    expect(screen.getByText("algo notes")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /search/i }));
    expect(onSearch).toHaveBeenCalled();
  });

  it("opens the mobile menu actions", () => {
    render(<ThemeProvider><TopBar variant="concepts" onSearchClick={vi.fn()} /></ThemeProvider>);
    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    const menu = within(screen.getByLabelText("Mobile menu"));
    expect(menu.getByRole("link", { name: "問題" })).toBeInTheDocument();
    expect(menu.getByRole("link", { name: "概念" })).toBeInTheDocument();
    expect(menu.getByRole("button", { name: /並び替え/i })).toBeInTheDocument();
    expect(menu.getByRole("button", { name: /概念追加/i })).toBeInTheDocument();
  });
});
