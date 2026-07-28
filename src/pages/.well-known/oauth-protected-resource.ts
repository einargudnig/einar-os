import type { APIRoute } from "astro";
import { SITE_URL, jsonResponse } from "@/src/lib/site";

// RFC 9728 — OAuth 2.0 Protected Resource Metadata.
// No protected resources exist on this site. Document is published for
// discoverability: empty authorization_servers and scopes_supported tell
// agents there is nothing here that requires a token.
export const GET: APIRoute = () =>
  jsonResponse({
    resource: SITE_URL,
    authorization_servers: [] as string[],
    scopes_supported: [] as string[],
    bearer_methods_supported: [] as string[],
  });
