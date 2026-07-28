import type { APIRoute } from "astro";
import llmsBody from "@/public/llms.txt?raw";
import { SITE_URL, jsonResponse } from "@/src/lib/site";

// Web Crypto rather than node:crypto — prerendering runs inside workerd.
const sha256 = async (input: string) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
};

export const GET: APIRoute = async () =>
  jsonResponse({
    $schema: "https://agentskills.io/schemas/index/v0.2.0.json",
    skills: [
      {
        name: "site-overview",
        type: "llms-txt",
        description:
          "Human-curated site map and agent guidance for einargudni.com. Covers writing, about pages, and preferred citation targets.",
        url: `${SITE_URL}/llms.txt`,
        sha256: await sha256(llmsBody),
      },
      {
        name: "markdown-negotiation",
        type: "content-negotiation",
        description:
          "Blog posts and deep-dives return their MDX source as text/markdown when requested via Accept: text/markdown.",
        url: `${SITE_URL}/blog`,
      },
    ],
  });
