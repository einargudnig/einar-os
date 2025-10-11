import { defineCollection, defineConfig, s } from "velite";

// `s` is extended from Zod with some custom schemas,
// you can also import re-exported `z` from `velite` if you don't need these extension schemas.

export default defineConfig({
  collections: {
    posts: {
      name: "Post", // collection type name
      pattern: "posts/**/*.{md,mdx}", // content files glob pattern (support both md and mdx)
      schema: s
        .object({
          title: s.string().max(99), // Zod primitive type
          slug: s.slug("posts"), // validate format, unique in posts collection
          image: s.image().optional(),
          date: s.isodate(), // input Date-like string, output ISO Date string.
          // cover: s.image().optional(), // input image relative path, output image object with blurImage.
          metadata: s.metadata(), // extract markdown reading-time, word-count, etc.
          // excerpt: s.excerpt(), // excerpt of markdown content
          code: s.mdx(), // compile mdx to js code
        })
        .transform((data) => ({ ...data, permalink: `/blog/${data.slug}` })),
    },
    // collection for learnings
    learnings: {
      name: "Learning",
      pattern: "learnings/**/*.{md,mdx}",
      schema: s
        .object({
          title: s.string().max(99),
          date: s.isodate(),
          topic: s.string().max(50),
          link: s.string().optional(),
          tags: s.array(s.string()).optional(),
          deepDiveSlug: s.slug().optional(),
          code: s.mdx(),
          metadata: s.metadata(),
        })
        .transform((data) => ({ ...data })),
    },

    // collection for deep dives
    deepDives: {
      name: "DeepDive",
      pattern: "deep-dives/**/*.{md,mdx}",
      schema: s
        .object({
          title: s.string().max(120),
          slug: s.slug("deep-dives"),
          date: s.isodate(),
          topic: s.string().max(50).optional(),
          tags: s.array(s.string()).optional(),
          metadata: s.metadata(),
          code: s.mdx(),
        })
        .transform((data) => ({
          ...data,
          permalink: `/deep-dive/${data.slug}`,
        })),
    },
  },
});
