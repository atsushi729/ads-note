import type { NextConfig } from "next";
const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  ...(isGitHubPages
    ? {
        basePath: "/ads-note",
        assetPrefix: "/ads-note",
      }
    : {}),
};

export default nextConfig;
