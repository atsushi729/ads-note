import Link from "next/link";

export function TabBar({ active }: { active: "problems" | "concepts" }) {
  const base = "flex-1 py-3 text-center text-[14px] font-semibold transition-colors border-b-2";
  const activeClass = "text-fg border-accent";
  const inactiveClass = "text-fg-3 hover:text-fg-2 border-transparent";
  return (
    <div className="flex border-b border-line">
      <Link href="/" className={`${base} ${active === "problems" ? activeClass : inactiveClass}`}>
        問題
      </Link>
      <Link href="/concepts" className={`${base} ${active === "concepts" ? activeClass : inactiveClass}`}>
        概念
      </Link>
    </div>
  );
}
