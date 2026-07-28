export const SITE_URL = "https://einargudni.com";

export const jsonResponse = (body: unknown, contentType = "application/json") =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
