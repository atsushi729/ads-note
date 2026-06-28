import type { Difficulty, Mastery } from "./types";
export function difficultyColorVar(d: Difficulty): string {
  return d === "Easy" ? "--easy" : d === "Medium" ? "--medium" : "--hard";
}
export function masteryColorVar(m: Mastery): string {
  return m === "習得" ? "--easy" : m === "復習中" ? "--medium" : "--mastery-none";
}
