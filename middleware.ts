import { NextResponse, type NextRequest } from "next/server";

// Routes that have a markdown source available (via Velite `body`).
// Keep this in sync with the lookup table in app/api/md/[...path]/route.ts.
const MARKDOWN_ROUTES = [/^\/blog\/[^/]+$/, /^\/deep-dive\/[^/]+$/];

export function middleware(req: NextRequest) {
  const accept = req.headers.get("accept") ?? "";
  if (!accept.includes("text/markdown")) return NextResponse.next();

  const { pathname } = req.nextUrl;

  if (MARKDOWN_ROUTES.some((re) => re.test(pathname))) {
    const url = req.nextUrl.clone();
    url.pathname = `/api/md${pathname}`;
    return NextResponse.rewrite(url);
  }

  // TODO 1 — fallback for routes without a markdown source.
  //   The request asked for markdown, but this URL (e.g. "/", "/uses",
  //   "/about") has no .mdx body to serve. Three coherent stances:
  //
  //   (a) Stay quiet — fall through to HTML. Lenient. Browsers and
  //       agents both get something useful. Picked by default below.
  //
  //   (b) Strict 406 Not Acceptable. RFC-correct: the Accept header
  //       is unsatisfiable, so refuse. Tell agents "no markdown here,"
  //       which is honest but unfriendly.
  //         return new NextResponse(null, { status: 406 });
  //
  //   (c) Convert HTML to markdown at runtime. Heavy (needs an HTML
  //       parser + turndown-style converter on every request) and the
  //       output is lossy — JSX-rendered pages don't roundtrip cleanly.
  //
  return NextResponse.next();
}

export const config = {
  matcher: ["/blog/:path*", "/deep-dive/:path*"],
};
