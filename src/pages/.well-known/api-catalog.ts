import type { APIRoute } from "astro";
import { SITE_URL, jsonResponse } from "@/src/lib/site";

// RFC 9727 — API Catalog. Returns application/linkset+json pointing at the
// handful of real endpoints this site exposes. No OpenAPI spec exists, so
// service-desc references llms.txt as the closest human+machine description.
export const GET: APIRoute = () =>
  jsonResponse(
    {
      linkset: [
        {
          anchor: `${SITE_URL}/api/md`,
          "service-desc": [{ href: `${SITE_URL}/llms.txt`, type: "text/markdown" }],
          "service-doc": [{ href: `${SITE_URL}/llms.txt`, type: "text/markdown" }],
          status: [{ href: `${SITE_URL}/`, type: "text/html" }],
        },
        {
          anchor: `${SITE_URL}/.well-known/agent-skills/index.json`,
          "service-desc": [
            {
              href: "https://agentskills.io/schemas/index/v0.2.0.json",
              type: "application/schema+json",
            },
          ],
          "service-doc": [
            {
              href: "https://github.com/cloudflare/agent-skills-discovery-rfc",
              type: "text/html",
            },
          ],
          status: [{ href: `${SITE_URL}/`, type: "text/html" }],
        },
      ],
    },
    "application/linkset+json",
  );
