import type { APIRoute } from "astro";
import { SITE_URL } from "@/src/lib/site";

const body = [
  "# Content Signals — https://contentsignals.org/",
  "# Opt-in to AI training, RAG/agent retrieval, and search indexing.",
  "Content-Signal: ai-train=yes, search=yes, ai-input=yes",
  "",
  "User-agent: *",
  "Allow: /",
  "",
  `Sitemap: ${SITE_URL}/sitemap-index.xml`,
  `Host: ${SITE_URL}`,
  "",
].join("\n");

export const GET: APIRoute = () =>
  new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
