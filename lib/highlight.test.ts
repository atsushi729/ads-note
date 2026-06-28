import { describe, it, expect } from "vitest";
import { highlightCode } from "./highlight";

describe("highlightCode", () => {
  it("should escape HTML in fallback when language is invalid", async () => {
    const xssPayload = "<script>alert(1)</script>";
    const result = await highlightCode(xssPayload, "this-is-not-a-real-language-xyz");

    // Should NOT contain raw script tag
    expect(result.light).not.toContain("<script>");
    expect(result.dark).not.toContain("<script>");

    // Should contain escaped version
    expect(result.light).toContain("&lt;script&gt;");
    expect(result.dark).toContain("&lt;script&gt;");
  });
});
