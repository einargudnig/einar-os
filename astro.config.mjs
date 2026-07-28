// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import { cacheCloudflare } from "@astrojs/cloudflare/cache";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://einargudni.com",
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

  integrations: [react(), mdx(), sitemap()],

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
