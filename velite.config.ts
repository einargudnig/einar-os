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
          excerpt: s.excerpt(), // excerpt of markdown content
          draft: s.boolean().optional().default(false),
          code: s.mdx(), // compile mdx to js code
          body: s.raw(), // raw markdown body (served via Accept: text/markdown)
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
          draft: s.boolean().optional().default(false),
          code: s.mdx(),
          body: s.raw(), // raw markdown body (served via Accept: text/markdown)
        })
        .transform((data) => ({
          ...data,
          permalink: `/deep-dive/${data.slug}`,
        })),
    },

    // collection for shared links / bookmarks
    links: {
      name: "Link",
      pattern: "links/**/*.{md,mdx}",
      schema: s
        .object({
          title: s.string().max(120),
          url: s.string(),
          description: s.string().max(300),
          date: s.isodate(),
          tags: s.array(s.string()).optional(),
        })
        .transform((data) => ({ ...data })),
    },

    // collection for interesting stuff -- free-form micro-posts
    interesting: {
      name: "Interesting",
      pattern: "interesting/**/*.{md,mdx}",
      schema: s
        .object({
          title: s.string().max(120),
          date: s.isodate(),
          url: s.string().optional(),
          tags: s.array(s.string()).optional(),
          code: s.mdx(),
          metadata: s.metadata(),
        })
        .transform((data) => ({ ...data })),
    },

    // collection for quotes
    quotes: {
      name: "Quote",
      pattern: "quotes/**/*.{md,mdx}",
      schema: s.object({
        text: s.string().max(500),
        author: s.string().max(100),
        source: s.string().optional(),
        date: s.isodate(),
        code: s.mdx(),
        metadata: s.metadata(),
      }),
    },
  },
});
