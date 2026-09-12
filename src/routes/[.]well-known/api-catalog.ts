import { createFileRoute } from "@tanstack/react-router";
import { CACHE_HEADERS, apiCatalog } from "@/lib/discovery";

export const Route = createFileRoute("/.well-known/api-catalog")({
  server: {
    handlers: {
      GET: () =>
        new Response(JSON.stringify(apiCatalog()), {
          headers: { "Content-Type": "application/linkset+json", ...CACHE_HEADERS },
        }),
    },
  },
});
