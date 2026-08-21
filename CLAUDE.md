# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website built with Astro 7, featuring a blog and content management system. Content is Markdown/MDX in `content/`, loaded through Astro content collections. Interactive pieces are React islands. It deploys to Cloudflare Workers via `@astrojs/cloudflare`.

## Development Commands

```bash
# Start the dev server
npm run dev

# Build for production (generates OG images, then builds)
npm run build

# Build and serve the real Worker locally
npm run preview

# Regenerate Open Graph images only
npm run og

# Deploy to Cloudflare
npm run deploy

# Lint with oxlint / format with oxfmt
npm run lint
npm run format
```

## Architecture

### Content Management System

Content lives in `content/` at the repo root (not `src/content/`) because vault and capture tooling writes there by path. Collections are declared in `src/content.config.ts`:

- `posts` — blog posts, `content/posts/`
- `learnings` — short-form notes, `content/learnings/`
- `deepDives` — long-form articles, `content/deep-dives/`
- `links` — bookmarks, `content/links/`
- `quotes` — quotes, `content/quotes/`

Query with `getCollection()` and render MDX with `render(entry)`. Frontmatter dates are parsed into `Date` objects via `z.coerce.date()`.

### Rendering model

Everything is prerendered **except** three routes that set `export const prerender = false`: `/`, `/blog/[slug]` and `/deep-dive/[slug]`. They must be on-demand so `src/middleware.ts` can honour `Accept: text/markdown` — a prerendered page is served straight from Cloudflare's asset binding and never reaches middleware or `src/fetch.ts`. Those three are edge-cached through `routeRules` in `astro.config.mjs`.

Because they are on-demand, `@astrojs/sitemap` cannot discover them; they are listed explicitly via `customPages`.

### MDX components

Custom components available inside MDX are mapped in `src/components/mdx-components.ts` and passed to `<Content components={mdxComponents} />`. Anything interactive needs a client directive, which the `components` prop cannot express, so those get a thin `.astro` wrapper in `src/components/mdx/` that applies `client:*`.

Code blocks are highlighted at build time by Astro's Shiki (`catppuccin-mocha`); `src/components/mdx/Pre.astro` only adds the surrounding chrome and a vanilla-JS copy button.

### Styling and UI

- **Tailwind CSS v4** via `@tailwindcss/vite` (no PostCSS config)
- **Radix UI** primitives, shadcn-style components in `components/ui/`
- Dark by default, applied by an inline script in `src/layouts/BaseLayout.astro` before paint
- Fonts come from `astro:fonts` (`<Font />` in the layout)

### Code Quality

- **oxlint** for linting and **oxfmt** for formatting
- **TypeScript** strict, `@/*` maps to the repo root

### Application Structure

- Pages in `src/pages/`, layouts in `src/layouts/`, `.astro` components in `src/components/`
- React components stay in `components/` at the root and render statically unless given a `client:*` directive
- `.well-known/*` documents are real prerendered endpoints under `src/pages/.well-known/` — there are no rewrites

## Important Implementation Details

### Adding New Blog Posts

1. Create an `.mdx` file in `content/posts/`, `content/learnings/` or `content/deep-dives/`
2. Include the frontmatter required by `src/content.config.ts` (posts need `title`, `slug`, `date`; `draft` optional)
3. OG images are generated from frontmatter by `scripts/generate-og.mjs` on the next build

### Custom MDX Components

1. Create the component in `components/blog/`
2. Add it to `mdxComponents` in `src/components/mdx-components.ts`
3. If it is interactive, wrap it in `src/components/mdx/<Name>.astro` with a client directive

### Open Graph images

`scripts/generate-og.mjs` renders every OG image with satori + resvg into `public/og/` before `astro build`. It is a Node prebuild step rather than an Astro endpoint because the Cloudflare adapter prerenders inside workerd, where `@resvg/resvg-js` (a native addon) cannot load. Geist TTFs are vendored in `src/assets/fonts/`.

## Deployment Notes

- Deploys to Cloudflare Workers; `@astrojs/cloudflare` writes `dist/server/wrangler.json` with `main` and `assets` filled in, and the root `wrangler.jsonc` supplies the rest
- Images are optimised at build time (`imageService: "compile"`), not per request
- Cloudflare rejects any single asset over 25 MiB — keep large media transcoded

## Agent skills

### Issue tracker

Issues live in GitHub Issues at `einargudnig/einar-os` via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default canonical labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
