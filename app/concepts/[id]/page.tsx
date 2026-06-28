import { notFound } from "next/navigation";
import { getAllConcepts, getConcept } from "@/lib/concepts";
import { getAllProblems } from "@/lib/problems";
import { problemsForConcept } from "@/lib/links";
import { ConceptDetail } from "@/components/detail/ConceptDetail";
export function generateStaticParams() {
  return getAllConcepts().map((c) => ({ id: c.id }));
}
export default async function ConceptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const concept = getConcept(id);
  if (!concept) notFound();
  const problems = problemsForConcept(concept, getAllProblems());
  return <ConceptDetail concept={concept} problems={problems} />;
}
