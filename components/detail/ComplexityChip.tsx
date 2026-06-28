"use client";
import { useEffect, useRef } from "react";
import katex from "katex";
export function ComplexityChip({ label, value }: { label: string; value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current && value) katex.render(value, ref.current, { throwOnError: false });
  }, [value]);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-chip border border-line px-2.5 py-1 font-mono text-[12px] text-fg-3">
      {label} <span ref={ref} className="text-fg" />
    </span>
  );
}
