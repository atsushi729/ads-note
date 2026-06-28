import { describe, it, expect } from "vitest";
import { conceptsForProblem, problemsForConcept } from "./links";
import type { Problem, Concept } from "./types";

const problem = { number: 701, conceptIds: [] } as unknown as Problem;
const bst = { id: "bst", problemNumbers: [701, 700] } as unknown as Concept;
const other = { id: "dp", problemNumbers: [322] } as unknown as Concept;

describe("links", () => {
  it("finds concepts referencing a problem", () => {
    const result = conceptsForProblem(problem, [bst, other]);
    expect(result.map((c) => c.id)).toEqual(["bst"]);
  });
  it("finds problems referenced by a concept", () => {
    const p700 = { number: 700 } as Problem;
    const p701 = { number: 701 } as Problem;
    const result = problemsForConcept(bst, [p701, p700]);
    expect(result.map((p) => p.number)).toEqual([700, 701]);
  });
});
