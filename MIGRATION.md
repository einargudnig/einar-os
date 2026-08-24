# Astro / Cloudflare migration — what's left

Branch `migrate/astro`. Preview: https://einar-os-preview.einargudni.workers.dev

Production is untouched — `einargudni.com` still serves the Next.js app from Vercel,
no DNS has been changed, and this branch is not merged to `master`. Delete this file
once the cutover is done.

State as of 2026-08-23: build clean, oxlint clean, `astro check` 0 errors / 0 warnings
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
- [x] ~~**Decide apex vs www.**~~ **Apex wins** (2026-08-24). `astro.config.mjs` already
      sets `site: "https://einargudni.com"`, and a repo-wide search finds *zero*
      `www.einargudni` references — every hardcoded URL (`llms.txt`, `src/lib/site.ts`,
      `scripts/generate-og.mjs`, the `.well-known` docs) is already on the apex. So this
      is a no-op in code; only DNS has to match. Cloudflare's CNAME flattening removes the
      old technical reason to prefer www. `www` gets a redirect to the apex, reversing
      today's direction.
- [ ] **Deploy under the production Worker name.** Everything so far is
      `einar-os-preview`; `wrangler.jsonc` declares `einar-os`.
- [ ] **Merge `migrate/astro` into `master`.**
- [ ] **DNS.** Give this its own session — see §1.7 of `~/CLOUDFLARE_MIGRATION.md`.
      See §5 below; the "registrar Name.com" note that used to live here was wrong.
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

- [x] ~~**No favicon.**~~ Restored from `master` to `public/favicon.ico`, declared in
      `BaseLayout`. Note it is PNG data behind an `.ico` extension — that is what the Next
      site shipped, kept byte-identical for parity, so the `<link>` asserts no `type`.
- [x] ~~**Blog images are no longer optimised.**~~ `CaptionedImage` is now
      `src/components/mdx/CaptionedImage.astro` and takes an `ImageMetadata`; the six
      optimisable images moved to `src/assets/blog/` and posts import them. It still
      accepts a plain string for `tmux.gif`, which optimising would flatten.

      Two things surfaced while fixing this:

      - Every call site hardcoded `width={1042 / 2} height={401 / 2}`, which matched none
        of the six images. Combined with `object-cover` that cropped four of them to a
        200px band and upscaled the `barf` screenshots ~2.6x. Astro infers real dimensions
        from the import, so those posts now render at true aspect ratio — a visible change,
        and the same bug is live on Vercel today.
      - The `keyboard` photos were unresized 3024px iPhone originals, 2.26 MB combined,
        carrying EXIF (device + capture time). Resized to the 1344px display cap and
        stripped: **2.26 MB -> 229 KB**.

- [ ] **`/_image` is a silent passthrough on the on-demand routes.** `imageService:
      "compile"` transforms at build time, which only reaches prerendered pages — and
      `/`, `/blog/[slug]` and `/deep-dive/[slug]` are deliberately `prerender = false` so
      middleware can honour `Accept: text/markdown`. So blog images emit a correct
      `srcset` of WebP variants, and every one of those URLs returns **200 with the
      untouched original** — right markup, no transform, wrong content type. Verified
      against the built Worker. `desk.png` on prerendered `/uses` does become `desk.webp`,
      which is what makes the contrast visible.

      Not urgent now that the sources are display-sized, but it means any large image
      added later silently regresses. Three ways out, none blocking the cutover:

      1. Keep pre-sizing sources by hand (status quo — free, but relies on remembering).
      2. `imageService: "cloudflare"` for real runtime transforms — costs per transform
         and needs Images enabled on the account, which §`astro.config.mjs` deliberately
         avoided.
      3. A prebuild transform step emitting WebP variants, exactly the pattern
         `scripts/generate-og.mjs` already uses to work around workerd's lack of native
         image support. Most consistent with the repo, most work.

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
- [ ] **18 orphaned images, 5.8 MB**, deployed on every build and referenced by nothing in
      `content/`: all of `public/images/blog/obsidian/` (11), `oktoberfest/` (6), and
      `keyboard/IMG_6108.heic`. No post mentions either topic — possibly drafts that never
      landed. Recoverable from git history if deleted.
- [ ] **Next boilerplate still in `public/`** — `next.svg`, `vercel.svg`, `file.svg`,
      `globe.svg`, `window.svg`.

---

## 5. DNS — verified state as of 2026-08-24

Everything here was read from live DNS and the Vercel CLI, not from memory. **Two things
in the previous version of this file were wrong.**

**Vercel is the registrar *and* the DNS host** — not Name.com, as this doc claimed:

```
einargudni.com   Registrar: Vercel   Nameservers: Vercel   Expires: Jan 22 2027
NS               ns1.vercel-dns.com, ns2.vercel-dns.com
```

So there is no third-party registrar panel in this migration; custom nameservers get set
from inside Vercel's domain settings. Consequence for §1: deleting the Vercel *project* is
safe and does not touch the *domain registration*, but it also means the Vercel
relationship doesn't end at cutover — they keep billing for the domain. Leaving entirely
needs a registrar transfer, which carries its own 60-day post-transfer lock. **Separate
decision, deliberately not bundled into the cutover.**

**The zone has four hostnames, not one.** `nido` is a live Vercel deployment unrelated to
this migration and must keep working after the nameservers move:

| host | target | platform |
|------|--------|----------|
| `einargudni.com` | `216.150.1.193` | Vercel |
| `www` | `216.150.16.65` | Vercel (apex 307s here today) |
| `nido` | `216.150.16.1` | Vercel — **separate project, not being migrated** |
| `sologbjor` | `sol-og-bjor.pages.dev` | Cloudflare Pages (already) |

No MX and no TXT records at all, so the "no email to break" claim does hold.

`vercel dns ls einargudni.com` returns *"You don't have permission to list the domain
record"* even though `vercel domains ls` lists the domain under that same scope, so the
zone could not be enumerated from the CLI. **Export the record list from the Vercel
dashboard DNS panel and diff it against Cloudflare's auto-import before flipping
nameservers** — `dig` only finds hostnames you already thought to guess, and a dropped
`nido` record takes a live site dark.

### CAA will block cert issuance as written

Current records authorise `letsencrypt.org`, `pki.goog`, `sectigo.com`. Cloudflare
Universal SSL also issues from **SSL.com**, and `ssl.com` is absent. CAA is an allowlist,
so if Cloudflare routes issuance there the cert simply never provisions — it fails as a
stuck cert, not a clear error. Add `ssl.com`, and re-check the list at cutover since
Cloudflare's docs say it isn't exhaustive.

### Order of operations — two changes, never one

They fail in unrelated ways (bad DNS = nothing resolves; bad Worker route = DNS fine and
the app 500s). Combined, there's no way to tell which is broken while the site is down.

1. **Move DNS, change nothing user-visible.** Add the zone at Cloudflare, let it
   auto-import, diff against the Vercel export. Keep every record **grey-clouded
   (DNS-only)** so Vercel keeps serving and keeps renewing its own certificate —
   orange-clouding at this stage double-proxies and can interfere with Vercel's
   validation. Then set Cloudflare's nameservers in Vercel and wait out propagation.
   The site never moves; any breakage here is unambiguously DNS.
2. **Point the apex at the Worker.** The zone must be active on Cloudflare first, so this
   cannot be reordered. `wrangler.jsonc` has no `routes` yet — the custom domain needs
   wiring. `RESEND_API_KEY` only matters from this step onward. Vercel stays live as the
   rollback for a week.

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
