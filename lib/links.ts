import type { Problem, Concept } from "./types";

export function conceptsForProblem(problem: Problem, all: Concept[]): Concept[] {
  return all.filter(
    (c) => c.problemNumbers.includes(problem.number) || problem.conceptIds.includes(c.id),
  );
}

export function problemsForConcept(concept: Concept, all: Problem[]): Problem[] {
  return all
    .filter((p) => concept.problemNumbers.includes(p.number))
    .sort((a, b) => a.number - b.number);
}
