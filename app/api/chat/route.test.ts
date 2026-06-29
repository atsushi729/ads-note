import { describe, it, expect } from "vitest";
import { POST } from "./route";

function post(body: unknown) {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("chat route validation", () => {
  it("returns 400 when messages are missing", async () => {
    const res = await POST(post({}));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/messages/i);
  });

  it("returns 400 when messages is empty", async () => {
    const res = await POST(post({ messages: [] }));
    expect(res.status).toBe(400);
  });

  it("returns 400 on invalid JSON", async () => {
    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{not json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
