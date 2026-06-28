import { notFound } from "next/navigation";
import { getAllProblems, getProblem } from "@/lib/problems";
import { getAllConcepts } from "@/lib/concepts";
import { conceptsForProblem } from "@/lib/links";
import { highlightCode } from "@/lib/highlight";
import { ProblemDetail } from "@/components/detail/ProblemDetail";
export function generateStaticParams() {
  return getAllProblems().map((p) => ({ number: String(p.number) }));
}
export default async function ProblemPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const problem = getProblem(Number(number));
  if (!problem) notFound();
  const highlights = await Promise.all(problem.steps.map((s) => highlightCode(s.code, s.codeLang)));
  const concepts = conceptsForProblem(problem, getAllConcepts());
  return <ProblemDetail problem={problem} highlights={highlights} concepts={concepts} />;
}
