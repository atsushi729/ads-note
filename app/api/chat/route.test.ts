import { describe, it, expect } from "vitest";
import { POST } from "./route";
describe("chat route stub", () => {
  it("returns 501", async () => {
    const res = await POST();
    expect(res.status).toBe(501);
    const body = await res.json();
    expect(body.error).toBe("not implemented");
  });
});
