"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button aria-label="Toggle theme" onClick={toggle}
      className="rounded-chip border border-line p-2 text-fg-3 hover:text-fg">
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
