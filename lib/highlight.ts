import { codeToHtml } from "shiki";

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function highlightCode(code: string, lang: string): Promise<{ light: string; dark: string }> {
  const safe = lang || "text";
  const [light, dark] = await Promise.all([
    codeToHtml(code, { lang: safe, theme: "github-light" }).catch(() => `<pre>${escapeHtml(code)}</pre>`),
    codeToHtml(code, { lang: safe, theme: "github-dark" }).catch(() => `<pre>${escapeHtml(code)}</pre>`),
  ]);
  return { light, dark };
}
