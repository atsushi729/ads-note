import { createWorkersAI } from "workers-ai-provider";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import type { LanguageModel } from "ai";

/**
 * Swappable chat providers. Start on Cloudflare Workers AI (no external key,
 * runs in the same Worker); switch by setting CHAT_PROVIDER + the matching key.
 */
export type ChatProviderId = "workers-ai" | "google" | "groq";

export interface ProviderConfig {
  id: ChatProviderId;
  model: string;
}

/** Runtime bindings/vars the chat route reads from the Cloudflare env. */
export interface ChatEnv {
  AI?: unknown; // Workers AI binding (only present on the Worker)
  CHAT_PROVIDER?: string;
  CHAT_MODEL?: string;
  GOOGLE_GENERATIVE_AI_API_KEY?: string;
  GROQ_API_KEY?: string;
}

export const DEFAULT_MODELS: Record<ChatProviderId, string> = {
  "workers-ai": "@cf/meta/llama-3.1-8b-instruct",
  google: "gemini-2.5-flash",
  groq: "llama-3.3-70b-versatile",
};

/** Env var that must be present for each external provider. */
const REQUIRED_KEY: Record<ChatProviderId, keyof ChatEnv | null> = {
  "workers-ai": null,
  google: "GOOGLE_GENERATIVE_AI_API_KEY",
  groq: "GROQ_API_KEY",
};

/**
 * Pure provider selection: decides which provider + model to use from env,
 * and validates that any required API key is present. Throws on misconfig.
 */
export function selectProviderConfig(env: ChatEnv): ProviderConfig {
  const id = (env.CHAT_PROVIDER ?? "workers-ai") as ChatProviderId;
  if (!(id in DEFAULT_MODELS)) {
    throw new Error(`unknown chat provider: ${id}`);
  }
  const requiredKey = REQUIRED_KEY[id];
  if (requiredKey && !env[requiredKey]) {
    throw new Error(
      `CHAT_PROVIDER=${id} requires ${requiredKey} to be set in the environment`,
    );
  }
  return { id, model: env.CHAT_MODEL || DEFAULT_MODELS[id] };
}

/**
 * Instantiate the AI SDK language model for the selected provider.
 * This is the single seam to swap providers — callers stay provider-agnostic.
 */
export function createChatModel(env: ChatEnv): LanguageModel {
  const { id, model } = selectProviderConfig(env);
  switch (id) {
    case "workers-ai": {
      if (!env.AI) {
        throw new Error("Workers AI binding (env.AI) is not available");
      }
      const workersai = createWorkersAI({ binding: env.AI as never });
      return workersai(model as never);
    }
    case "google":
      return createGoogleGenerativeAI({
        apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
      })(model);
    case "groq":
      return createGroq({ apiKey: env.GROQ_API_KEY })(model);
  }
}
