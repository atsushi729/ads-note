import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: "var(--canvas)", panel: "var(--panel)", "panel-2": "var(--panel-2)",
        line: "var(--line)", "line-2": "var(--line-2)",
        fg: "var(--fg)", "fg-2": "var(--fg-2)", "fg-3": "var(--fg-3)",
        muted: "var(--muted)", "muted-2": "var(--muted-2)",
        accent: "var(--accent)", "accent-deep": "var(--accent-deep)",
        easy: "var(--easy)", medium: "var(--medium)", hard: "var(--hard)",
        "mastery-none": "var(--mastery-none)",
        "code-bg": "var(--code-bg)", "code-border": "var(--code-border)",
      },
      borderRadius: { card: "16px", inner: "13px", block: "11px", chip: "8px" },
      boxShadow: { card: "var(--shadow-card)" },
      fontFamily: { sans: ["var(--font-hanken)", "system-ui", "sans-serif"], mono: ["var(--font-jetbrains)", "monospace"] },
    },
  },
  plugins: [],
};
export default config;
