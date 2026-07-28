import { defineMiddleware } from "astro:middleware";

// Routes that have a markdown source available via the content collections.
// Keep in sync with the lookup table in src/pages/api/md/[...path].ts, and
// with the `prerender = false` exports on those pages — middleware only runs
// at request time for on-demand routes.
const MARKDOWN_ROUTES = [/^\/blog\/[^/]+$/, /^\/deep-dive\/[^/]+$/];

export const onRequest = defineMiddleware((context, next) => {
  const accept = context.request.headers.get("accept") ?? "";
  if (!accept.includes("text/markdown")) return next();

  const { pathname } = context.url;

  // rewrite() rather than next(path): next() does not repopulate params for
  // the target route, so the [...path] rest param arrived empty.
  // Re-entry is safe — /api/md/* matches none of the branches above.
  if (pathname === "/") return context.rewrite("/api/md-root");

  if (MARKDOWN_ROUTES.some((re) => re.test(pathname))) {
    return context.rewrite(`/api/md${pathname}`);
  }

  // Routes without an MDX source fall through to HTML. Lenient by design:
  // an agent that asked for markdown still gets something useful.
  return next();
});
