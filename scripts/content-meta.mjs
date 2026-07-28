// Frontmatter reader shared by astro.config.mjs and scripts/generate-og.mjs.
// Both run before Astro's content collections exist, so they read from disk.
import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

export const readCollection = async (dir) => {
  const files = await readdir(join(root, "content", dir));
  return Promise.all(
    files
      .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
      .map(async (file) => matter(await readFile(join(root, "content", dir, file), "utf8")).data),
  );
};
