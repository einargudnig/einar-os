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
    // TODO 2 — x-markdown-tokens (optional per the skill).
    //   The skill says "include if available." It's a token count of
    //   the markdown body, used by agents to budget context.
    //
    //   The honest version requires a tokenizer (tiktoken, gpt-tokenizer,
    //   or similar) — adds a runtime dependency for a header most clients
    //   ignore.
    //
    //   Pragmatic version: a word-count proxy.
    //     "x-markdown-tokens": String(Math.ceil(body.split(/\s+/).length * 1.3)),
    //
    //   Skip entirely: leave this commented out. The skill still passes.
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
