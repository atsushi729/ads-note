import { describe, it, expect } from "vitest";
import { selectProviderConfig, DEFAULT_MODELS } from "./provider";

describe("selectProviderConfig", () => {
  it("defaults to workers-ai with its default model", () => {
    const cfg = selectProviderConfig({});
    expect(cfg.id).toBe("workers-ai");
    expect(cfg.model).toBe(DEFAULT_MODELS["workers-ai"]);
  });

  it("honours CHAT_MODEL override", () => {
    const cfg = selectProviderConfig({ CHAT_MODEL: "@cf/meta/llama-3.3-70b" });
    expect(cfg.id).toBe("workers-ai");
    expect(cfg.model).toBe("@cf/meta/llama-3.3-70b");
  });

  it("selects google when configured with an API key", () => {
    const cfg = selectProviderConfig({
      CHAT_PROVIDER: "google",
      GOOGLE_GENERATIVE_AI_API_KEY: "key",
    });
    expect(cfg.id).toBe("google");
    expect(cfg.model).toBe(DEFAULT_MODELS.google);
  });

  it("selects groq when configured with an API key", () => {
    const cfg = selectProviderConfig({
      CHAT_PROVIDER: "groq",
      GROQ_API_KEY: "key",
    });
    expect(cfg.id).toBe("groq");
    expect(cfg.model).toBe(DEFAULT_MODELS.groq);
  });

  it("throws when a non-default provider is missing its API key", () => {
    expect(() => selectProviderConfig({ CHAT_PROVIDER: "google" })).toThrow(
      /GOOGLE_GENERATIVE_AI_API_KEY/,
    );
  });

  it("throws on an unknown provider", () => {
    expect(() => selectProviderConfig({ CHAT_PROVIDER: "nope" })).toThrow(
      /unknown/i,
    );
  });
});
