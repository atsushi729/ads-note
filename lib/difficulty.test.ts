import { describe, it, expect } from "vitest";
import { difficultyColorVar } from "./difficulty";
describe("color helpers", () => {
  it("maps difficulty to css var", () => {
    expect(difficultyColorVar("Easy")).toBe("--easy");
    expect(difficultyColorVar("Medium")).toBe("--medium");
    expect(difficultyColorVar("Hard")).toBe("--hard");
  });
});
