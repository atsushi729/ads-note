import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { TopBar } from "./TopBar";

describe("TopBar", () => {
  it("shows app name and triggers search", () => {
    const onSearch = vi.fn();
    render(
      <ThemeProvider>
        <TopBar variant="problems" onSearchClick={onSearch} />
      </ThemeProvider>
    );
    expect(screen.getByText("algo notes")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /search/i }));
    expect(onSearch).toHaveBeenCalled();
  });

  it("does not render a hamburger menu button", () => {
    render(
      <ThemeProvider>
        <TopBar variant="concepts" onSearchClick={vi.fn()} />
      </ThemeProvider>
    );
    expect(screen.queryByRole("button", { name: /open menu/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /close menu/i })).toBeNull();
  });
});
