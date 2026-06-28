import { codeToHtml } from "shiki";
export async function highlightCode(code: string, lang: string): Promise<{ light: string; dark: string }> {
  const safe = lang || "text";
  const [light, dark] = await Promise.all([
    codeToHtml(code, { lang: safe, theme: "github-light" }).catch(() => `<pre>${code}</pre>`),
    codeToHtml(code, { lang: safe, theme: "github-dark" }).catch(() => `<pre>${code}</pre>`),
  ]);
  return { light, dark };
}
