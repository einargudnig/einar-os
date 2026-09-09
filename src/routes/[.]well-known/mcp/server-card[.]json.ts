import { createFileRoute } from "@tanstack/react-router";
import { CACHE_HEADERS, mcpServerCard } from "@/lib/discovery";

export const Route = createFileRoute("/.well-known/mcp/server-card.json")({
  server: {
    handlers: {
      GET: () => Response.json(mcpServerCard(), { headers: CACHE_HEADERS }),
    },
  },
});
