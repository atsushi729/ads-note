import Link from "next/link";
export function SegmentSwitch({ active }: { active: "problems" | "concepts" }) {
  const base = "px-3 py-1 text-[13px] font-semibold rounded-chip transition-colors";
  return (
    <div className="flex gap-1 rounded-chip bg-panel-2 p-1">
      <Link href="/" className={`${base} ${active === "problems" ? "bg-canvas text-fg shadow-sm" : "text-fg-3"}`}>問題</Link>
      <Link href="/concepts" className={`${base} ${active === "concepts" ? "bg-canvas text-fg shadow-sm" : "text-fg-3"}`}>概念</Link>
    </div>
  );
}
