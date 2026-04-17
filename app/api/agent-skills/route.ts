import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

const SITE_URL = "https://einargudni.com";

const sha256 = (input: string) => createHash("sha256").update(input).digest("hex");

export async function GET() {
  const llmsPath = path.join(process.cwd(), "public", "llms.txt");
  const llmsBody = await readFile(llmsPath, "utf8");

  const body = {
    $schema: "https://agentskills.io/schemas/index/v0.2.0.json",
    skills: [
      {
        name: "site-overview",
        type: "llms-txt",
        description:
          "Human-curated site map and agent guidance for einargudni.com. Covers writing, about pages, and preferred citation targets.",
        url: `${SITE_URL}/llms.txt`,
        sha256: sha256(llmsBody),
      },
      {
        name: "markdown-negotiation",
        type: "content-negotiation",
        description:
          "Blog posts and deep-dives return their MDX source as text/markdown when requested via Accept: text/markdown.",
        url: `${SITE_URL}/blog`,
      },
    ],
  };

  return Response.json(body, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
