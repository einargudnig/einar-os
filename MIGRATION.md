# Astro / Cloudflare migration — what's left

Branch `migrate/astro`. Preview: https://einar-os-preview.einargudni.workers.dev

Production is untouched — `einargudni.com` still serves the Next.js app from Vercel,
no DNS has been changed, and this branch is not merged to `master`. Delete this file
once the cutover is done.

State as of 2026-08-21: build clean, oxlint clean, `astro check` 0 errors / 0 warnings
across 96 files. All routes verified 200 against the preview and diffed against the
live Vercel site.

---

## 1. Blocking the cutover

- [ ] **Set `RESEND_API_KEY`** on the Worker. Without it the contact form returns its
      503 path. The route itself is verified wired up — validation, honeypot and 503
      branches all behave correctly. Optionally `CONTACT_TO_EMAIL` and
      `CONTACT_FROM_EMAIL` (defaults: `einargudnig@gmail.com`, `onboarding@resend.dev`,
      the latter only delivering to the Resend account owner).
      `wrangler secret put RESEND_API_KEY --name <worker>`
- [ ] **Decide apex vs www.** `astro.config.mjs` sets `site: "https://einargudni.com"`,
      but production serves from **www** — the apex 307s to it. This decides every
      canonical, `og:url` and sitemap URL the build emits, and the DNS shape. The Next
      site emitted no canonical at all, so this is a new decision, not a regression.
- [ ] **Deploy under the production Worker name.** Everything so far is
      `einar-os-preview`; `wrangler.jsonc` declares `einar-os`.
- [ ] **Merge `migrate/astro` into `master`.**
- [ ] **DNS.** Give this its own session — see §1.7 of `~/CLOUDFLARE_MIGRATION.md`.
      `einargudni.com` is the low-risk one: registrar Name.com, no MX records, so no
      email to break.
- [ ] **Delete the Vercel project** only after Cloudflare has served real traffic for
      about a week. It costs nothing idle and it's the rollback.

Optional, not blocking — the site works without them and falls back to the committed
snapshot in `data/whoop/latest.json`:

- [ ] `LIFEOS_API_URL` + `LIFEOS_WEB_TOKEN` for live Whoop numbers on `/`.

## 2. Decisions — visible changes vs the Next site

- [ ] **No theme toggle exists.** The site defaults to dark and honours a stored
      `theme` key, but nothing in the UI can set it. `next-themes` and
      `theme-provider.tsx` were dropped in the port and never replaced. Build one, or
      accept dark-only.
- [ ] **Smart quotes.** Astro 7's markdown processor renders `doesn't` as `doesn’t`
      across every MDX post; Next emitted a straight apostrophe. Cosmetic, but it's
      all posts at once.
- [ ] **`convex-export`, `convex-export-new`, `convex-export-data/`** are still tracked
      — the votes people submitted to the retired `/baby` experiment. Data, not code.
      Keep as a memento or delete.
- [ ] **Sitemap scope changed.** The old `app/sitemap.ts` listed *only* posts. The new
      one also advertises `/someday`, `/resolutions` and `/referrals` — pages `llms.txt`
      explicitly marks as personal. Decide whether they should be indexed.
- [ ] **OG image URLs moved** — `/blog/foo/opengraph-image` → `/og/blog-foo.png`.
      Anything that previously scraped a card will refetch. Nothing to fix, just expect it.

## 3. Regressions to fix

- [ ] **No favicon.** `master` had `app/favicon.ico`; nothing replaced it, so every page
      logs a 404 for `/favicon.ico`. Drop one in `public/`.
- [ ] **Blog images are no longer optimised.** `CaptionedImage` receives runtime string
      paths into `public/`, which `astro:assets` can't process. The fix is moving images
      beside their content so they can be referenced relatively.

## 4. Cleanup — none of it blocking

- [ ] `maplibre-gl` is an unused dependency, and `src/styles/globals.css` still carries
      two dead `.maplibregl-*` popup rules. `ui/map.tsx` was deleted in the port — and
      was already dead code on `master`, imported by nothing.
- [ ] `README.md` is still create-next-app boilerplate describing `next/font` and
      deploying to Vercel.
- [ ] **64 files fail `oxfmt --check`**, repo-wide and pre-existing. `components/project-icons.tsx`
      alone wants ~218 insertions. Worth one deliberate formatting commit rather than
      letting it ride along with unrelated work.
- [ ] **Delete the `migrate/cloudflare-workers` branch** — the OpenNext attempt, fully
      superseded by this one.

---

## Already done

- All 23 routes ported, verified 200, and content-diffed against the live site. The only
  real delta was `/baby`, now removed.
- 26 commits of `master` drift merged in: contact form, `/interesting` → `/notes`,
  prop-driven Whoop, lint fixes.
- Worker is ~0.39 MiB gzipped vs 3.12 MiB under OpenNext, so the $5/mo Workers plan
  is **not** required.
- Fixed: canonical/`og:url` emitted `/blog.html`, a URL that only 307s to `/blog`.
- Fixed: `ClientRouter` dropped the `dark` class on every client-side navigation, so
  the site went light after one click and stayed there.
- Removed `/baby` and its Convex backend, dependency and docs.
- Dropped `package-lock.json`; bun is the one package manager here.
