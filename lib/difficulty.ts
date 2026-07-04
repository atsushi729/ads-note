import type { Difficulty } from "./types";
export function difficultyColorVar(d: Difficulty): string {
  return d === "Easy" ? "--easy" : d === "Medium" ? "--medium" : "--hard";
}
