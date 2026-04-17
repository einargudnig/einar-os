import type { MetadataRoute } from "next";
import { posts, deepDives } from "@/.velite";

const SITE_URL = "https://einargudni.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries: MetadataRoute.Sitemap = posts
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.date,
    }));

  const deepDiveEntries: MetadataRoute.Sitemap = deepDives
    .filter((entry) => !entry.draft)
    .map((entry) => ({
      url: `${SITE_URL}/deep-dive/${entry.slug}`,
      lastModified: entry.date,
    }));

  // TODO 1 — list the static routes you want indexed.
  //   All static pages on the site:
  //     "/", "/about", "/baby", "/blog", "/learnings", "/notes",
  //     "/now", "/quotes", "/referrals", "/resolutions", "/someday",
  //     "/ts-mini", "/tldr/en", "/tldr/is",
  //     "/uses", "/uses/desk", "/uses/command-line",
  //     "/uses/devices", "/uses/infrastructure", "/uses/keyboard"
  //   Trade-off: sitemap = "please index". Excluding a page here doesn't
  //   block it (that's robots.ts) — it just declines to advertise it.
  //   Common exclusions: family/private pages (/baby), drafts of personal
  //   plans (/someday, /resolutions), and one of the two /tldr locales
  //   if you have a canonical preference.
  const staticPaths: string[] = [
    // fill in
  ];

  // TODO 2 — lastmod strategy for static pages.
  //   Options:
  //     (a) Skip lastmod entirely — let Google use its own crawl signals.
  //         Cleanest. No risk of false freshness signals.
  //     (b) Use a single hand-maintained constant per page, updated when
  //         you actually change content. Most accurate, most manual.
  //     (c) Use build date (`new Date()`). Easy but resets on every deploy
  //         even for unchanged pages — Google will eventually distrust it.
  //   Pick one and apply it in the .map() below.
  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    // lastModified: ...,  ← TODO 2
  }));

  // TODO 3 — changefreq + priority on every entry above.
  //   Google ignores both since 2023. Bing and many smaller bots still read them.
  //   Three coherent stances:
  //     (a) Skip both. Honest signaling, less noise.
  //     (b) Add `priority` only (e.g. 1.0 for /, 0.8 for /blog/*, 0.5 for everything else).
  //     (c) Add both, full protocol coverage.
  //   If you want either, add the fields directly in the three .map() blocks above.

  return [...blogEntries, ...deepDiveEntries, ...staticEntries];
}
