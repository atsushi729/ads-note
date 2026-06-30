import type { Concept } from "@/lib/types";

export function ConceptStats({ concepts }: { concepts: Concept[] }) {
  const c = (m: string) => concepts.filter((x) => x.mastery === m).length;
  return (
    <div className="flex gap-4 border-b border-line px-5 py-3 font-mono text-[13px]">
      <span className="font-semibold">{concepts.length} 概念</span>
      <span className="text-easy">習得 {c("習得")}</span>
      <span className="text-medium">復習中 {c("復習中")}</span>
      <span className="text-muted">未学習 {c("未学習")}</span>
    </div>
  );
}
