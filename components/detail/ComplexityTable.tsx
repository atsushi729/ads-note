"use client";
import { useEffect, useRef } from "react";
import katex from "katex";
import type { ConceptComplexityRow } from "@/lib/types";
function Tex({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => { if (ref.current) katex.render(value, ref.current, { throwOnError: false }); }, [value]);
  return <span ref={ref} className="font-mono text-[13px]" />;
}
export function ComplexityTable({ rows }: { rows: ConceptComplexityRow[] }) {
  return (
    <table className="my-3 w-full border-collapse overflow-hidden rounded-block border border-line text-left">
      <thead>
        <tr className="bg-panel-2 font-mono text-[12px] text-fg-3">
          <th className="px-4 py-2 font-medium">操作</th><th className="px-4 py-2 font-medium">平均</th><th className="px-4 py-2 font-medium">最悪</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.op} className="border-t border-line text-[14px]">
            <td className="px-4 py-2.5 text-fg-2">{r.op}</td>
            <td className="px-4 py-2.5"><Tex value={r.avg} /></td>
            <td className="px-4 py-2.5"><Tex value={r.worst} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
