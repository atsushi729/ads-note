import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createChatModel, type ChatEnv } from "@/lib/ai/provider";
import { buildSystemPrompt, type ChatContext } from "@/lib/ai/context";

// Streaming chat. Runs as a Cloudflare Worker route (via OpenNext) and reads the
// AI binding / provider config from the Worker env. Provider is swappable in
// lib/ai/provider.ts; defaults to Workers AI (CHAT_PROVIDER=workers-ai).
export const maxDuration = 30;

interface ChatRequestBody {
  messages?: UIMessage[];
  context?: ChatContext | null;
}

export async function POST(req: Request): Promise<Response> {
  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return Response.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const { messages, context } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "messages are required" }, { status: 400 });
  }

  try {
    const { env } = getCloudflareContext();
    const model = createChatModel(env as ChatEnv);
    const result = streamText({
      model,
      system: buildSystemPrompt(context ?? undefined),
      messages: await convertToModelMessages(messages),
    });
    return result.toUIMessageStreamResponse();
  } catch (err) {
    const message = err instanceof Error ? err.message : "chat failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
