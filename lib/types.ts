export type Difficulty = "Easy" | "Medium" | "Hard";
export type Kind = "構造" | "アルゴ";

export interface Step {
  index: number;
  title: string;
  thinking: string;
  codeLang: string;
  code: string;
  timeComplexity: string;
  spaceComplexity: string;
  note?: string;
}
export interface Problem {
  number: number;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  source: string;
  created: string;
  solved: boolean;
  description?: string;
  question: string;
  steps: Step[];
  conceptIds: string[];
}
export interface ConceptComplexityRow { op: string; avg: string; worst: string; }
export interface Concept {
  id: string;
  name: string;
  nameJa: string;
  kind: Kind;
  note: string;
  studyNote: string;
  problemNumbers: number[];
  complexity: ConceptComplexityRow[];
}
