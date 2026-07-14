"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import katex from "katex";
import type { Step } from "@/lib/types";
import { Markdown } from "@/components/markdown/Markdown";
import { ComplexityChip } from "./ComplexityChip";
import { useTheme } from "@/components/theme/ThemeProvider";
function Tex({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => { if (ref.current && value) katex.render(value, ref.current, { throwOnError: false }); }, [value]);
  return <span ref={ref} />;
}
export function StepBlock({ step, highlighted, defaultOpen }: {
  step: Step; highlighted: { light: string; dark: string }; defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const { theme } = useTheme();
  return (
    <div className="mb-3 min-w-0 overflow-hidden rounded-inner border border-line">
      <button onClick={() => setOpen((o) => !o)}
        className="flex w-full min-w-0 items-center gap-3 px-4 py-3 text-left">
        <span className={`grid h-5 w-5 shrink-0 place-items-center rounded font-mono text-[11px] ${open ? "bg-fg text-canvas" : "bg-panel-2 text-fg-3"}`}>{step.index}</span>
        <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-fg">{step.title}</span>
        {!open && (
          <span className="flex shrink-0 items-center gap-1 font-mono text-[12px] text-fg-3">
            <Tex value={step.timeComplexity} /> · <Tex value={step.spaceComplexity} />
          </span>
        )}
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {open && (
        <div className="min-w-0 border-t border-line px-4 py-4">
          <div className="mb-2 text-[11px] font-semibold text-fg-3">思考</div>
          <Markdown>{step.thinking}</Markdown>
          <div className="mb-2 mt-4 text-[11px] font-semibold text-fg-3">実装</div>
          <div className="max-w-full overflow-x-auto rounded-block border border-code-border bg-code-bg p-3 text-[13px] [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:min-w-max"
            dangerouslySetInnerHTML={{ __html: theme === "dark" ? highlighted.dark : highlighted.light }} />
          <div className="mt-4 flex flex-wrap gap-2">
            <ComplexityChip label="Time" value={step.timeComplexity} />
            <ComplexityChip label="Space" value={step.spaceComplexity} />
          </div>
          {step.note && (<><div className="mb-2 mt-4 text-[11px] font-semibold text-fg-3">注意点</div><Markdown>{step.note}</Markdown></>)}
        </div>
      )}
    </div>
  );
}
