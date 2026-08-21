import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Content stays at the repo root rather than moving under src/ — the vault and
// capture tooling write into these directories by path.
const contentGlob = (dir: string) => glob({ pattern: "**/*.{md,mdx}", base: `./content/${dir}` });

const posts = defineCollection({
  loader: contentGlob("posts"),
  schema: z.object({
    title: z.string().max(99),
    slug: z.string(),
    image: z.string().optional(),
    date: z.coerce.date(),
    draft: z.boolean().optional().default(false),
  }),
});

const learnings = defineCollection({
  loader: contentGlob("learnings"),
  schema: z.object({
    title: z.string().max(99),
    date: z.coerce.date(),
    topic: z.string().max(50),
    link: z.string().optional(),
    tags: z.array(z.string()).optional(),
    deepDiveSlug: z.string().optional(),
  }),
});

const deepDives = defineCollection({
  loader: contentGlob("deep-dives"),
  schema: z.object({
    title: z.string().max(120),
    slug: z.string(),
    date: z.coerce.date(),
    topic: z.string().max(50).optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional().default(false),
  }),
});

const links = defineCollection({
  loader: contentGlob("links"),
  schema: z.object({
    title: z.string().max(120),
    url: z.string(),
    description: z.string().max(300),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional(),
  }),
});

const quotes = defineCollection({
  loader: contentGlob("quotes"),
  schema: z.object({
    text: z.string().max(500),
    author: z.string().max(100),
    source: z.string().optional(),
    date: z.coerce.date(),
  }),
});

export const collections = { posts, learnings, deepDives, links, quotes };
