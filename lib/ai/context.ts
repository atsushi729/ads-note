import type { Problem, Concept } from "../types";

/** A note attached to the chat as grounding context. */
export interface ChatContext {
  title: string;
  body: string;
}

const BASE_PROMPT = [
  "あなたは LeetCode / データ構造・アルゴリズムの学習を助ける丁寧なチューターです。",
  "ユーザーは自作の解答ノートを読みながら質問します。",
  "回答は必ず日本語で、簡潔かつ正確に。コードは Markdown のコードブロックで、計算量は $O(...)$ 形式で示してください。",
  "答えを丸写しさせるのではなく、考え方・前提・落とし穴を説明して理解を助けてください。",
].join("\n");

/** Build the system prompt, optionally grounding it in the note the user is viewing. */
export function buildSystemPrompt(context?: ChatContext | null): string {
  if (!context) return BASE_PROMPT;
  return [
    BASE_PROMPT,
    "",
    "---",
    `現在ユーザーは次のノートを見ています。質問はこの文脈に沿って答えてください。`,
    "",
    `## ${context.title}`,
    "",
    context.body,
  ].join("\n");
}

/** Serialize a problem note into a compact text block for grounding. */
export function serializeProblemContext(problem: Problem): string {
  const lines: string[] = [
    `# #${problem.number} ${problem.title} (${problem.difficulty})`,
  ];
  if (problem.description) lines.push(problem.description);
  lines.push("", "## Question", problem.question);
  lines.push("", "## Approach");
  for (const step of problem.steps) {
    lines.push(
      "",
      `### Step ${step.index}: ${step.title}`,
      step.thinking,
      `Time complexity: ${step.timeComplexity} / Space complexity: ${step.spaceComplexity}`,
    );
    if (step.note) lines.push(`注意点: ${step.note}`);
  }
  return lines.join("\n");
}

/** Serialize a concept note into a compact text block for grounding. */
export function serializeConceptContext(concept: Concept): string {
  const lines: string[] = [
    `# ${concept.name}（${concept.nameJa}） [${concept.kind}]`,
    "",
    "## 学習メモ",
    concept.studyNote,
  ];
  if (concept.complexity.length) {
    lines.push("", "## 計算量", "| 操作 | 平均 | 最悪 |", "| --- | --- | --- |");
    for (const row of concept.complexity) {
      lines.push(`| ${row.op} | ${row.avg} | ${row.worst} |`);
    }
  }
  return lines.join("\n");
}
