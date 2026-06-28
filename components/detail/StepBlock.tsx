"use client";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Step } from "@/lib/types";
import { Markdown } from "@/components/markdown/Markdown";
import { ComplexityChip } from "./ComplexityChip";
import { useTheme } from "@/components/theme/ThemeProvider";
export function StepBlock({ step, highlighted, defaultOpen }: {
  step: Step; highlighted: { light: string; dark: string }; defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const { theme } = useTheme();
  return (
    <div className="mb-3 overflow-hidden rounded-inner border border-line">
      <button onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left">
        <span className={`grid h-5 w-5 place-items-center rounded font-mono text-[11px] ${open ? "bg-fg text-canvas" : "bg-panel-2 text-fg-3"}`}>{step.index}</span>
        <span className="flex-1 text-[14px] font-semibold text-fg">{step.title}</span>
        {!open && <span className="font-mono text-[12px] text-fg-3">{step.timeComplexity} · {step.spaceComplexity}</span>}
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {open && (
        <div className="border-t border-line px-4 py-4">
          <div className="mb-2 text-[11px] font-semibold text-fg-3">思考</div>
          <Markdown>{step.thinking}</Markdown>
          <div className="mb-2 mt-4 text-[11px] font-semibold text-fg-3">実装</div>
          <div className="overflow-x-auto rounded-block border border-code-border bg-code-bg p-3 text-[13px] [&_pre]:!bg-transparent"
            dangerouslySetInnerHTML={{ __html: theme === "dark" ? highlighted.dark : highlighted.light }} />
          <div className="mt-4 flex gap-2">
            <ComplexityChip label="Time" value={step.timeComplexity} />
            <ComplexityChip label="Space" value={step.spaceComplexity} />
          </div>
          {step.note && (<><div className="mb-2 mt-4 text-[11px] font-semibold text-fg-3">注意点</div><Markdown>{step.note}</Markdown></>)}
        </div>
      )}
    </div>
  );
}
