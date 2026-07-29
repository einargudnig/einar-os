// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import { cacheCloudflare } from "@astrojs/cloudflare/cache";
import tailwindcss from "@tailwindcss/vite";
import { readCollection } from "./scripts/content-meta.mjs";

// Posts and deep-dives render on demand, so @astrojs/sitemap cannot discover
// them by crawling the build output — they have to be listed explicitly.
// Drafts are excluded, matching the old app/sitemap.ts.
const [posts, deepDives] = await Promise.all([
  readCollection("posts"),
  readCollection("deep-dives"),
]);

const contentPages = [
  ...posts.filter((post) => !post.draft).map((post) => `/blog/${post.slug}`),
  ...deepDives.filter((dive) => !dive.draft).map((dive) => `/deep-dive/${dive.slug}`),
].map((path) => `https://einargudni.com${path}`);

export default defineConfig({
  site: "https://einargudni.com",

  // Astro's default 4321 collides with the life-os daemon (and 4322 is taken
  // too). 3000 is where the Next dev server used to live.
  server: { port: 3000 },
  // 'compile' optimises images at build time instead of routing them through
  // the runtime Images binding — every image here is static, so there's no
  // reason to pay for a transform on each request.
  adapter: cloudflare({ imageService: "compile" }),

  // Pages are prerendered by default. `/`, `/blog/[slug]` and
  // `/deep-dive/[slug]` opt out individually so middleware can run at request
  // time and honour `Accept: text/markdown` — a prerendered file can't.
  output: "static",

  // Next served extensionless paths with no trailing slash; keep those URLs
  // exactly so nothing 301s after the cutover.
  trailingSlash: "never",
  build: { format: "file" },

  integrations: [react(), mdx(), sitemap({ customPages: contentPages })],

  // Next served the sitemap at /sitemap.xml; @astrojs/sitemap emits
  // /sitemap-index.xml. Keep the old URL working for anything that has it.
  redirects: {
    "/sitemap.xml": "/sitemap-index.xml",
  },

  // The three on-demand routes are content pages that change only when I
  // publish. Edge-cache them so being on-demand (for Accept negotiation)
  // doesn't mean re-rendering — or, for `/`, re-hitting the GitHub
  // contributions API — on every request.
  cache: { provider: cacheCloudflare() },
  routeRules: {
    "/": { maxAge: 3600, swr: 600 },
    "/blog/[...slug]": { maxAge: 3600, swr: 600 },
    "/deep-dive/[...slug]": { maxAge: 3600, swr: 600 },
  },

  fonts: [
    {
      provider: fontProviders.google(),
      name: "Geist",
      cssVariable: "--font-geist-sans",
    },
    {
      provider: fontProviders.google(),
      name: "Geist Mono",
      cssVariable: "--font-geist-mono",
    },
  ],

  markdown: {
    // Build-time highlighting. The old client-side CodeBlock shipped the whole
    // Shiki runtime to the browser to do this in a useEffect.
    shikiConfig: {
      theme: "catppuccin-mocha",
      wrap: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
