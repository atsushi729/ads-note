import type { NextConfig } from "next";

// Deployed to Cloudflare Workers via @opennextjs/cloudflare (not static export),
// so server route handlers like /api/chat (streaming LLM) run on the Worker.
const nextConfig: NextConfig = { images: { unoptimized: true } };
export default nextConfig;

// Make Cloudflare bindings (env.AI, vars) available during `next dev`.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
