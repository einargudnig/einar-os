import { readFile } from "node:fs/promises";
import path from "node:path";

// Markdown representation of the homepage — served when "/" is requested
// with Accept: text/markdown. The canonical site map lives in llms.txt.
export async function GET() {
  const body = await readFile(path.join(process.cwd(), "public", "llms.txt"), "utf8");
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
