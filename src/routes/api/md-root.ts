import { createFileRoute } from "@tanstack/react-router";
import { CACHE_HEADERS, llmsBody } from "@/lib/discovery";

// Markdown representation of the homepage — served when "/" is requested
// with Accept: text/markdown. The canonical site map lives in llms.txt.
export const Route = createFileRoute("/api/md-root")({
  server: {
    handlers: {
      GET: () =>
        new Response(llmsBody, {
          headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            ...CACHE_HEADERS,
          },
        }),
    },
  },
});
