const SITE_URL = "https://einargudni.com";

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

export function GET() {
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
