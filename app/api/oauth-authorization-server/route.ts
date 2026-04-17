const SITE_URL = "https://einargudni.com";

// RFC 8414 — OAuth 2.0 Authorization Server Metadata.
// This site operates no authorization server. The document is published for
// discoverability only: empty grant_types_supported tells agents there is
// nothing to authenticate against.
export function GET() {
  const body = {
    issuer: SITE_URL,
    grant_types_supported: [] as string[],
    response_types_supported: [] as string[],
    token_endpoint_auth_methods_supported: [] as string[],
  };

  return Response.json(body, {
    headers: { "Cache-Control": "public, max-age=3600" },
  });
}
