import type { Difficulty, Step } from "./types";

function sectionsByHeading(body: string, level: 2 | 3 | 4): { title: string; content: string }[] {
  const marker = "#".repeat(level);
  const re = new RegExp(`^${marker} (?!#)(.+)$`, "gm");
  const out: { title: string; content: string }[] = [];
  const matches = [...body.matchAll(re)];
  matches.forEach((m, i) => {
    const start = m.index! + m[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index! : body.length;
    out.push({ title: m[1].trim(), content: body.slice(start, end).trim() });
  });
  return out;
}

function extractCode(md: string): { codeLang: string; code: string } {
  const m = md.match(/```(\w+)?\n([\s\S]*?)```/);
  return { codeLang: (m?.[1] ?? "text").trim(), code: (m?.[2] ?? "").trimEnd() };
}

function extractComplexity(md: string): { timeComplexity: string; spaceComplexity: string } {
  const time = md.match(/Time complexity\s*:?\s*\$?([^$\n]+?)\$?\s*$/m);
  const space = md.match(/Space complexity\s*:?\s*\$?([^$\n]+?)\$?\s*$/m);
  return { timeComplexity: (time?.[1] ?? "").trim(), spaceComplexity: (space?.[1] ?? "").trim() };
}

export function parseProblemBody(body: string): {
  question: string; difficulty: Difficulty | null; steps: Step[];
} {
  const diffMatch = body.match(/Difficulty:\s*(Easy|Medium|Hard)/i);
  const difficulty = diffMatch
    ? ((diffMatch[1][0].toUpperCase() + diffMatch[1].slice(1).toLowerCase()) as Difficulty)
    : null;

  const level2 = sectionsByHeading(body, 2);
  const question = level2.find((s) => /^Question/i.test(s.title))?.content ?? "";
  const approach = level2.find((s) => /^Approach/i.test(s.title))?.content ?? "";

  const steps: Step[] = sectionsByHeading(approach, 3).map((s, i) => {
    const subs = sectionsByHeading(s.content, 4);
    const get = (re: RegExp) => subs.find((x) => re.test(x.title))?.content ?? "";
    const impl = get(/実装/);
    const perf = get(/パフォーマンス/);
    const noteRaw = get(/注意点/);
    const { codeLang, code } = extractCode(impl);
    const { timeComplexity, spaceComplexity } = extractComplexity(perf);
    return {
      index: i + 1,
      title: s.title.replace(/^Step\s*\d+\s*/i, "").trim() || s.title,
      thinking: get(/思考/),
      codeLang, code, timeComplexity, spaceComplexity,
      note: noteRaw || undefined,
    };
  });

  return { question, difficulty, steps };
}
