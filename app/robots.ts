import type { MetadataRoute } from "next";

const SITE_URL = "https://einargudni.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // TODO 1 — baseline rule for all crawlers (User-agent: *).
      //   Pick what to disallow. Candidates that exist on this site:
      //     /baby         → family content, may be private
      //     /someday      → personal goals
      //     /resolutions  → personal goals
      //     /referrals    → affiliate links, sometimes excluded
      //   Or leave fully open with `disallow: []`. Allow defaults to "/".
      {
        userAgent: "*",
        allow: "/",
        disallow: [],
      },

      // TODO 2 — AI training crawlers. Add one block per bot you want
      // to address explicitly. Common identifiers:
      //   GPTBot           (OpenAI training)
      //   ChatGPT-User     (OpenAI on-demand fetches in ChatGPT)
      //   ClaudeBot        (Anthropic training)
      //   Claude-Web       (Anthropic on-demand fetches)
      //   CCBot            (Common Crawl, feeds many models)
      //   Google-Extended  (gates Gemini training without affecting Search)
      //   PerplexityBot    (Perplexity)
      // To block one: { userAgent: "GPTBot", disallow: "/" }
      // To allow only specific paths: { userAgent: "ClaudeBot", allow: ["/blog/", "/learnings/"], disallow: "/" }
      // Leave this section out entirely to inherit the * rule above.
    ],

    sitemap: `${SITE_URL}/sitemap.xml`,

    host: SITE_URL,
  };
}
