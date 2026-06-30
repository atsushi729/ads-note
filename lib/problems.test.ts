import { describe, it, expect } from "vitest";
import { getAllProblems, getProblem } from "./problems";

describe("problem loader", () => {
  it("loads at least the 701 fixture", () => {
    const all = getAllProblems();
    expect(all.length).toBeGreaterThanOrEqual(1);
    expect(all.find((p) => p.number === 701)).toBeTruthy();
  });
  it("returns a problem by number with parsed steps", () => {
    const p = getProblem(701)!;
    expect(p.title).toBe("Insert into a Binary Search Tree");
    expect(p.steps).toHaveLength(3);
    expect(p.difficulty).toBe("Medium");
    expect(p.created).toBe("2026-05-04");
  });
  it("sorts ascending by number", () => {
    const nums = getAllProblems().map((p) => p.number);
    expect([...nums].sort((a, b) => a - b)).toEqual(nums);
  });
});
