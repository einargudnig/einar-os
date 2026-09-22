import { createFileRoute } from "@tanstack/react-router";
import { apiCatalog, CACHE_HEADERS } from "@/lib/discovery";

export const Route = createFileRoute("/api/api-catalog")({
  server: {
    handlers: {
      GET: () =>
        new Response(JSON.stringify(apiCatalog()), {
          headers: {
            "Content-Type": "application/linkset+json",
            ...CACHE_HEADERS,
          },
        }),
    },
  },
});
