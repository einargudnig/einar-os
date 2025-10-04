import { defineCollection, defineConfig, s } from "velite";

// `s` is extended from Zod with some custom schemas,
// you can also import re-exported `z` from `velite` if you don't need these extension schemas.

export default defineConfig({
  collections: {
    posts: {
      name: "Post", // collection type name
      pattern: "posts/**/*.{md,mdx}", // content files glob pattern (support both md and mdx)
      schema: s.object({
        title: s.string().max(99), // Zod primitive type
        slug: s.slug("posts"), // validate format, unique in posts collection
        image: s.image().optional(),
        // date: s.isodate(), // input Date-like string, output ISO Date string.
        // cover: s.image().optional(), // input image relative path, output image object with blurImage.
        // video: s.file().optional(), // input file relative path, output file public path.
        // metadata: s.metadata(), // extract markdown reading-time, word-count, etc.
        // excerpt: s.excerpt(), // excerpt of markdown content
        // content: s.markdown(), // transform markdown to html
        code: s.mdx(), // compile mdx to js code
      }),
      // Add permalink computed field
      transform: (data) => ({ ...data, permalink: `/blog/${data.slug}` }),
    },
  },
});
