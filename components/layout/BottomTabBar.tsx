import Link from "next/link";
export function BottomTabBar({ active }: { active: "library" | "search" | "stats" | "ai" }) {
  const item = (key: string, href: string, icon: string, label: string) => (
    <Link href={href} className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] ${active === key ? "text-accent" : "text-fg-3"}`}>
      <span className="text-[16px]">{icon}</span>{label}
    </Link>
  );
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-canvas md:hidden">
      {item("library", "/", "📚", "ライブラリ")}
      {item("ai", "/chat", "✨", "AI")}
      {item("search", "/", "⌕", "検索")}
      {item("stats", "/", "📊", "統計")}
    </nav>
  );
}
