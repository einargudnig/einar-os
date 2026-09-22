import { createFileRoute } from "@tanstack/react-router";
import { CACHE_HEADERS, mcpServerCard } from "@/lib/discovery";

export const Route = createFileRoute("/api/mcp-server-card")({
  server: {
    handlers: {
      GET: () => Response.json(mcpServerCard(), { headers: CACHE_HEADERS }),
    },
  },
});
