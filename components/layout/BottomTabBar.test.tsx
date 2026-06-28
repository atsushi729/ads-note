import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BottomTabBar } from "./BottomTabBar";
describe("BottomTabBar", () => {
  it("renders the three tabs with active accent", () => {
    render(<BottomTabBar active="library" />);
    expect(screen.getByText("ライブラリ")).toBeInTheDocument();
    expect(screen.getByText("検索")).toBeInTheDocument();
    expect(screen.getByText("統計")).toBeInTheDocument();
  });
});
