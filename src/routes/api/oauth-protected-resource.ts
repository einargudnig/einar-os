import { createFileRoute } from "@tanstack/react-router";
import { CACHE_HEADERS, oauthProtectedResource } from "@/lib/discovery";

export const Route = createFileRoute("/api/oauth-protected-resource")({
  server: {
    handlers: {
      GET: () => Response.json(oauthProtectedResource(), { headers: CACHE_HEADERS }),
    },
  },
});
