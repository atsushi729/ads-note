import type { NextConfig } from "next";

// Deployed to Cloudflare Workers via @opennextjs/cloudflare (not static export),
// so server route handlers like /api/chat (streaming LLM) run on the Worker.
const nextConfig: NextConfig = { images: { unoptimized: true } };
export default nextConfig;

// Make Cloudflare bindings (env.AI, vars) available during `next dev` ONLY.
// During `next build` this must not run: Next builds pages in parallel worker
// processes that each load this config, and each would spin up a workerd/
// miniflare instance against the same .wrangler SQLite state, causing
// "database is locked: SQLITE_BUSY" crashes. Bindings aren't needed at build
// time (content is a generated module; the AI binding is resolved at request
// time via getCloudflareContext on the deployed Worker).
if (process.env.NODE_ENV === "development") {
  import("@opennextjs/cloudflare").then(({ initOpenNextCloudflareForDev }) =>
    initOpenNextCloudflareForDev(),
  );
}
