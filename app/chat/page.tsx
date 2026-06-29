import { getAllProblems } from "@/lib/problems";
import { getAllConcepts } from "@/lib/concepts";
import {
  serializeProblemContext,
  serializeConceptContext,
} from "@/lib/ai/context";
import { ChatView, type ContextOption } from "@/components/chat/ChatView";

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ problem?: string; concept?: string }>;
}) {
  const { problem, concept } = await searchParams;

  const contexts: ContextOption[] = [
    ...getAllProblems().map((p) => ({
      ref: `problem:${p.number}`,
      label: `#${p.number} ${p.title}`,
      title: `#${p.number} ${p.title}`,
      body: serializeProblemContext(p),
    })),
    ...getAllConcepts().map((c) => ({
      ref: `concept:${c.id}`,
      label: `${c.name}（${c.nameJa}）`,
      title: `${c.name}（${c.nameJa}）`,
      body: serializeConceptContext(c),
    })),
  ];

  const initialRef = problem
    ? `problem:${problem}`
    : concept
      ? `concept:${concept}`
      : undefined;

  return <ChatView contexts={contexts} initialRef={initialRef} />;
}
