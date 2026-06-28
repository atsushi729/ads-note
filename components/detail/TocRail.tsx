import Link from "next/link";
export function TocRail({ backHref, backLabel, items }: {
  backHref: string; backLabel: string; items: { id: string; label: string; active?: boolean }[];
}) {
  return (
    <nav className="w-[218px] shrink-0 bg-panel px-4 py-5 text-[13px]">
      <Link href={backHref} className="mb-4 block text-fg-3 hover:text-fg">← {backLabel}</Link>
      <div className="mb-2 text-[11px] font-semibold text-fg-3">目次</div>
      {items.map((it) => (
        <a key={it.id} href={`#${it.id}`}
          className={`block rounded px-2 py-1 ${it.active ? "border-l-2 border-accent bg-canvas font-semibold text-fg" : "text-fg-3 hover:text-fg"}`}>{it.label}</a>
      ))}
    </nav>
  );
}
