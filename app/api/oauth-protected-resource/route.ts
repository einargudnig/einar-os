const SITE_URL = "https://einargudni.com";

// RFC 9728 — OAuth 2.0 Protected Resource Metadata.
// No protected resources exist on this site. Document is published for
// discoverability: empty authorization_servers and scopes_supported tell
// agents there is nothing here that requires a token.
export function GET() {
  const body = {
    resource: SITE_URL,
    authorization_servers: [] as string[],
    scopes_supported: [] as string[],
    bearer_methods_supported: [] as string[],
  };

  return Response.json(body, {
    headers: { "Cache-Control": "public, max-age=3600" },
  });
}
