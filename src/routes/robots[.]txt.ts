import { createFileRoute } from "@tanstack/react-router";
import { CACHE_HEADERS, SITE_URL } from "@/lib/discovery";

const body = [
  "# Content Signals — https://contentsignals.org/",
  "# Opt-in to AI training, RAG/agent retrieval, and search indexing.",
  "Content-Signal: ai-train=yes, search=yes, ai-input=yes",
  "",
  "User-agent: *",
  "Allow: /",
  "",
  `Sitemap: ${SITE_URL}/sitemap.xml`,
  `Host: ${SITE_URL}`,
  "",
].join("\n");

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(body, {
          headers: { "Content-Type": "text/plain; charset=utf-8", ...CACHE_HEADERS },
        }),
    },
  },
});
