import { describe, it, expect } from "vitest";
import { difficultyColorVar, masteryColorVar } from "./difficulty";
describe("color helpers", () => {
  it("maps difficulty to css var", () => {
    expect(difficultyColorVar("Easy")).toBe("--easy");
    expect(difficultyColorVar("Medium")).toBe("--medium");
    expect(difficultyColorVar("Hard")).toBe("--hard");
  });
  it("maps mastery to css var", () => {
    expect(masteryColorVar("習得")).toBe("--easy");
    expect(masteryColorVar("復習中")).toBe("--medium");
    expect(masteryColorVar("未学習")).toBe("--mastery-none");
  });
});
