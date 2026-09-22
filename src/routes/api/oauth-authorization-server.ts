import { createFileRoute } from "@tanstack/react-router";
import { CACHE_HEADERS, oauthAuthorizationServer } from "@/lib/discovery";

export const Route = createFileRoute("/api/oauth-authorization-server")({
  server: {
    handlers: {
      GET: () => Response.json(oauthAuthorizationServer(), { headers: CACHE_HEADERS }),
    },
  },
});
