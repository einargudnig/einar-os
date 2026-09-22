import { createFileRoute } from "@tanstack/react-router";
import { CACHE_HEADERS, agentSkills } from "@/lib/discovery";

export const Route = createFileRoute("/api/agent-skills")({
  server: {
    handlers: {
      GET: () => Response.json(agentSkills(), { headers: CACHE_HEADERS }),
    },
  },
});
