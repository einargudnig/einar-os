import { NextResponse, type NextRequest } from "next/server";

// Routes that have a markdown source available (via Velite `body`).
// Keep this in sync with the lookup table in app/api/md/[...path]/route.ts.
const MARKDOWN_ROUTES = [/^\/blog\/[^/]+$/, /^\/deep-dive\/[^/]+$/];

export function middleware(req: NextRequest) {
  const accept = req.headers.get("accept") ?? "";
  if (!accept.includes("text/markdown")) return NextResponse.next();

  const { pathname } = req.nextUrl;

  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/api/md-root";
    return NextResponse.rewrite(url);
  }

  if (MARKDOWN_ROUTES.some((re) => re.test(pathname))) {
    const url = req.nextUrl.clone();
    url.pathname = `/api/md${pathname}`;
    return NextResponse.rewrite(url);
  }

  // Routes without an MDX source fall through to HTML. Lenient by design:
  // an agent that asked for markdown still gets something useful.
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/blog/:path*", "/deep-dive/:path*"],
};
