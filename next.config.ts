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
      // RFC 9727 — API Catalog
      {
        source: "/.well-known/api-catalog",
        destination: "/api/api-catalog",
      },
      // RFC 8414 — OAuth 2.0 Authorization Server Metadata
      {
        source: "/.well-known/oauth-authorization-server",
        destination: "/api/oauth-authorization-server",
      },
      // OIDC Discovery 1.0 — same document served at the OIDC path.
      {
        source: "/.well-known/openid-configuration",
        destination: "/api/oauth-authorization-server",
      },
      // RFC 9728 — OAuth 2.0 Protected Resource Metadata
      {
        source: "/.well-known/oauth-protected-resource",
        destination: "/api/oauth-protected-resource",
      },
      // MCP Server Card (SEP-1649, schema under review)
      {
        source: "/.well-known/mcp/server-card.json",
        destination: "/api/mcp-server-card",
      },
    ];
  },
};

export default nextConfig;
