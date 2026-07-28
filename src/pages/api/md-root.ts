import type { APIRoute } from "astro";
// Was readFile(process.cwd()/public/llms.txt) — no filesystem on Workers, so
// the file is inlined at build time instead.
import llmsBody from "@/public/llms.txt?raw";

// Rewrite target for on-demand pages, so it must be on-demand too.
export const prerender = false;

// Markdown representation of the homepage — served when "/" is requested
// with Accept: text/markdown. The canonical site map lives in llms.txt.
export const GET: APIRoute = () =>
  new Response(llmsBody, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
