# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website built with Next.js 16, featuring a blog and content management system. The site uses Velite for content processing and MDX for rich blog posts. It's deployed on Vercel with analytics and speed insights enabled.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production (runs Velite first to process content, then Next.js build)
npm run build

# Start production server
npm start

# Lint code with oxlint
npm run lint

# Format code with oxfmt
npm run format
```

## Architecture

### Content Management System

The project uses **Velite** as a content processing pipeline that transforms Markdown/MDX files into type-safe data:

1. **Content Collections** (defined in `velite.config.ts`):
   - `posts` - Blog posts in `content/posts/` directory
   - `learnings` - Short-form learning notes in `content/learnings/`
   - `deepDives` - In-depth technical articles in `content/deep-dives/`

2. **Velite Build Process**:
   - Runs automatically before Next.js dev/build (via `next.config.ts`)
   - Processes MDX files and generates type-safe outputs in `.velite/` directory
   - Creates `@/.velite` module with typed exports for content collections
   - Compiles MDX to executable JavaScript code stored in the `code` property

3. **MDX Content Rendering**:
   - MDX is NOT rendered directly by Next.js
   - Instead, Velite compiles MDX to JS code strings
   - `components/mdx-content.tsx` uses `new Function()` to execute compiled code
   - Custom components are injected via the `sharedComponents` object
   - This approach gives full control over component rendering

### Styling and UI

- **Tailwind CSS v4** with custom PostCSS integration
- **Radix UI** primitives for accessible components
- **next-themes** for dark mode support (default: dark theme)
- Custom blog components in `components/blog/` for rich content (callouts, code blocks, video embeds, etc.)
- UI components in `components/ui/` follow shadcn/ui patterns

### Code Quality

- **oxlint** for linting and **oxfmt** for formatting (from the oxc project)
- **TypeScript** with strict mode enabled
- Path alias `@/*` maps to project root

### Application Structure

- **App Router** (Next.js 16 App Directory)
- **Route Structure**:
  - `/` - Homepage with work experience and latest post
  - `/blog` - List of all blog posts
  - `/blog/[slug]` - Individual blog posts (static generation)
  - `/deep-dive/[slug]` - In-depth articles (static generation)
  - `/learnings` - Learning notes collection
  - `/notes` - Notes page
  - `/about`, `/now`, `/someday` - Static pages
  - `/uses/*` - Tech stack and setup pages

- **Layout Hierarchy**:
  - Root layout (`app/layout.tsx`) provides global navbar, theme provider, fonts (Geist Sans/Mono)
  - Nested layouts like `app/uses/layout.tsx` for section-specific structure

### Dynamic Pages

Blog posts and deep dives use:
- `generateStaticParams()` for build-time static generation
- Content fetched from Velite-processed collections
- MDX rendered via `<MDXContent code={post.code} />` component

## Important Implementation Details

### Adding New Blog Posts

1. Create `.mdx` file in appropriate directory:
   - `content/posts/` for blog posts
   - `content/learnings/` for learning notes
   - `content/deep-dives/` for technical deep dives

2. Include required frontmatter:
   - Posts: `title`, `slug`, `date`, `draft` (optional)
   - Learnings: `title`, `date`, `topic`, `link` (optional), `tags` (optional)
   - Deep Dives: `title`, `slug`, `date`, `topic` (optional), `tags` (optional), `draft` (optional)

3. Velite automatically processes on next dev/build

### Custom MDX Components

To add new custom components for use in MDX:
1. Create component in `components/blog/`
2. Import and add to `sharedComponents` object in `components/mdx-content.tsx`
3. Component will be available in all MDX files

### Type Safety with Velite

- Velite generates TypeScript types in `.velite/index.d.ts`
- Import collections: `import { posts, learnings, deepDives } from '@/.velite'`
- All content is fully typed with metadata, slugs, dates, etc.

## Deployment Notes

- Site is optimized for Vercel deployment
- Uses `@vercel/analytics` and `@vercel/speed-insights`
- Static generation via `generateStaticParams()` ensures fast page loads
- Velite runs at build time, so `.velite/` directory must be generated before deployment
