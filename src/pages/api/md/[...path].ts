import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

// Rewrite target for on-demand pages, so it must be on-demand too.
export const prerender = false;

// Serves the raw markdown source behind a post. Reached two ways: directly,
// or via the middleware rewrite when a client sends Accept: text/markdown.
export const GET: APIRoute = async ({ params }) => {
  const [type, slug] = (params.path ?? "").split("/");

  const body = await lookup(type, slug);
  if (!body) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};

const lookup = async (type?: string, slug?: string): Promise<string | undefined> => {
  if (!type || !slug) return undefined;

  if (type === "blog") {
    const posts = await getCollection("posts");
    return posts.find((p) => p.data.slug === slug && !p.data.draft)?.body;
  }
  if (type === "deep-dive") {
    const deepDives = await getCollection("deepDives");
    return deepDives.find((d) => d.data.slug === slug && !d.data.draft)?.body;
  }
  return undefined;
};
