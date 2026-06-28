// Future seam: Vercel AI SDK streaming chat with a free LLM provider (Groq/Gemini).
// Currently a stub returning 501. See docs/superpowers/specs (section 9).
export async function POST() {
  return new Response(JSON.stringify({ error: "not implemented" }), {
    status: 501,
    headers: { "content-type": "application/json" },
  });
}
