// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
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
