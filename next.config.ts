import type { NextConfig } from "next";

const isDev = process.argv.indexOf("dev") !== -1;
const isBuild = process.argv.indexOf("build") !== -1;
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = "1";
  import("velite").then((m) => m.build({ watch: isDev, clean: !isDev }));
}

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    viewTransition: true,
  },

  async headers() {
    return [
      {
        // RFC 8288 Link headers for agent discovery.
        // Applied to the homepage only — the skill validator scans `/`.
        source: "/",
        headers: [
          {
            key: "Link",
            value: '</llms.txt>; rel="describedby"; type="text/markdown"',
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      // Agent Skills Discovery RFC v0.2.0 — serve the index at its
      // well-known location while keeping the handler at a normal route.
      {
        source: "/.well-known/agent-skills/index.json",
        destination: "/api/agent-skills",
      },
    ];
  },
};

export default nextConfig;
