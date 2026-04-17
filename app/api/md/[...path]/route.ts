import { posts, deepDives } from "@/.velite";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const [type, slug] = path;

  const body = lookup(type, slug);
  if (!body) {
    return new Response("Not found", { status: 404 });
  }

  const headers: HeadersInit = {
    "Content-Type": "text/markdown; charset=utf-8",
  };

  return new Response(body, { status: 200, headers });
}

const lookup = (type: string | undefined, slug: string | undefined): string | undefined => {
  if (!type || !slug) return undefined;

  if (type === "blog") {
    return posts.find((p) => p.slug === slug && !p.draft)?.body;
  }
  if (type === "deep-dive") {
    return deepDives.find((d) => d.slug === slug && !d.draft)?.body;
  }
  return undefined;
};
