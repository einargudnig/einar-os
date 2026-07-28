import type { APIRoute } from "astro";
import { jsonResponse } from "@/src/lib/site";

// MCP Server Card (SEP-1649, schema still under review in
// modelcontextprotocol PR #2127). This site does not run an MCP server —
// capabilities is deliberately empty to avoid advertising tools that
// don't exist.
export const GET: APIRoute = () =>
  jsonResponse({
    serverInfo: {
      name: "einargudni.com",
      version: "0.0.0",
      description:
        "Personal site of Einar Guðni. No MCP server is hosted here — this card exists for discoverability.",
    },
    transport: {
      type: "none",
      url: null,
    },
    capabilities: {},
  });
