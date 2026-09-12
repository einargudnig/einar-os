# einargudni.com DNS cutover

Moving the zone from Vercel DNS to Cloudflare, then the apps that sit on it.

- **Registrar:** Name.com (expires 2027-01-22)
- **Nameservers today:** `ns1.vercel-dns.com`, `ns2.vercel-dns.com`
- **Worker already live:** <https://einar-os.einargudni.workers.dev>

Two facts make this unusually low-risk: the zone has **no MX records** and **no
TXT records**, so there is no email, SPF, DKIM or domain verification to carry
across.

---

## What is actually live today

A wildcard `*.einargudni.com` points every possible name at Vercel, so
*everything* resolves and only some hosts answer. A ~70-name sweep found four.

| Host | Now | Serves | After cutover |
| --- | --- | --- | --- |
| `einargudni.com` | 307 | Vercel redirect to www | **becomes canonical**, served by the Worker |
| `www` | 200 | the site, on Vercel | **301 → apex** |
| `posture` | 200 | live Vercel project (Astro, static) | stays on Vercel, explicit CNAME |
| `nido` | 200 | live Vercel project (Next.js, SSR) | stays on Vercel, explicit CNAME |
| `sologbjor` | 200 | Cloudflare Pages already | unchanged |
| `*.einargudni.com` | 404 | wildcard → Vercel, answers nothing | **dropped** |

> [!WARNING]
> **Confirm before dropping the wildcard.** The sweep covered ~70 likely names,
> not every possible one. Because the wildcard returns a Vercel 404 rather than
> `NXDOMAIN`, a subdomain with an unguessable name would not show up. Check the
> Vercel dashboard's domain list for `einargudni.com` and confirm it lists
> exactly these five. Anything missed goes dark at cutover.

---

## Why the zone moves before the apps

`nido` is a server-rendered Next.js app, so on Cloudflare it needs a Worker —
and per Cloudflare's docs you **cannot** create a Worker Custom Domain "on a
hostname with an existing CNAME DNS record or on a zone you do not own." It is
structurally blocked until the zone is in the account.

`posture` is static Astro and *could* move to Pages first over external DNS, the
way `sologbjor` already does. But there is no reason to: every record you
flipped would be flipped in Vercel DNS, the system being abandoned. Move the
zone and each app migration becomes one reversible record change in the
dashboard you are keeping.

**Rollback is asymmetric, which is the real argument for this order.** Undoing
the zone move means another nameserver change and another ~24h NS TTL. Undoing
an app migration is a CNAME flip that settles in ~5 minutes at TTL 300. Do the
slow, hard-to-reverse step once and early; make the app moves cheap and
repeatable behind it.

---

## Target record set

| Type | Name | Value | Proxy | Why |
| --- | --- | --- | --- | --- |
| — | `@` | Worker custom domain | Proxied | Created by attaching the Worker |
| — | `www` | Worker custom domain | Proxied | Redirect Rule catches it first; Worker is the harmless fallback |
| CNAME | `posture` | `cname.vercel-dns.com` | **DNS only** | Grey-cloud so Vercel keeps terminating its own TLS |
| CNAME | `nido` | `cname.vercel-dns.com` | **DNS only** | Same |
| CNAME | `sologbjor` | `sol-og-bjor.pages.dev` | Proxied | Better: re-add as a Pages custom domain once the zone is live |
| CAA | `@` | `letsencrypt.org`, `pki.goog`, `sectigo.com` | n/a | Already permits Cloudflare's two issuers — carry across unchanged |

No MX, no TXT, no wildcard.

The CNAME and CAA rows import directly: **DNS → Records → Import** →
[`infra/einargudni.com.zone`](./einargudni.com.zone). Proxy status is the one
thing a zone file cannot carry, so grey-cloud `posture` and `nido` afterwards.

---

## Sequence

Every record must be correct in Cloudflare **before** nameservers change.
During propagation both nameserver sets get queried, and whichever a resolver
picks must serve a working answer.

### 01 — Add the zone, nameservers unchanged · **you**

1. Cloudflare → **Add a site** → `einargudni.com` → Free plan.
2. Let it scan and import existing records.
3. Note the two assigned nameservers. **Stop there** — do not touch Name.com.

**Gate:** zone reads *Pending Nameserver Update*. Nothing is live, nothing has
broken; the site is still served entirely by Vercel.

### 02 — Reconcile records and attach the Worker · **you + Claude**

- Delete the imported wildcard and any stale Vercel A records.
- Import `infra/einargudni.com.zone`, then grey-cloud `posture` and `nido`.
- **Claude:** attach the Worker. This needs no dashboard — `custom_domain: true`
  creates both the custom domain and its DNS record:

  ```jsonc
  "routes": [
    { "pattern": "einargudni.com",     "custom_domain": true },
    { "pattern": "www.einargudni.com", "custom_domain": true }
  ]
  ```

- **You:** create the Redirect Rule (Rules → Redirect Rules → Create):

  ```
  When:  http.host eq "www.einargudni.com"
  Then:  Dynamic redirect
         concat("https://einargudni.com", http.request.uri.path)
         Status 301 · Preserve query string ✓
  ```

> [!NOTE]
> Wrangler's OAuth token is Workers-scoped: it cannot create the zone, edit DNS
> records or add redirect rules. A token with `Zone:Edit` + `DNS:Edit` scoped to
> this zone would let Claude do all three.

### 03 — Verify before the flip · **Claude**

```bash
./scripts/verify-dns.sh <cloudflare-nameserver>   # before the NS flip
./scripts/verify-dns.sh                           # after propagation
```

Queries the Cloudflare nameservers directly while the world still resolves via
Vercel, so the new zone is proven correct before any traffic depends on it.
Checks every record, asserts MX stays empty and that an unknown host returns
`NXDOMAIN`, then — once nameservers have moved — the live site, the www
redirect, all three subdomains, markdown negotiation and the well-known
endpoints.

Run against today's DNS it reports `6 passed, 9 failed`, which is the correct
not-yet-cut-over state.

**Gate:** every record resolves as the table says and the nonsense host returns
`NXDOMAIN`. Do not proceed otherwise.

### 04 — Pre-empt Vercel re-verification · **you**

> [!IMPORTANT]
> **The step that usually bites.** Vercel auto-verifies domains that use Vercel
> DNS. The moment nameservers move, `posture` and `nido` become externally
> hosted from Vercel's point of view, and Vercel may demand a `_vercel` TXT
> record before it keeps serving them.

Vercel → each project → Settings → Domains shows the `_vercel` TXT value **even
while the domain is still verified**. Create it in Cloudflare before the flip
and there is no gap at all. No `_vercel` record exists today — Vercel DNS
auto-verifies, which is exactly the crutch being removed.

### 05 — Move Worker secrets · **you**

These live on Vercel and are not in `.env.local`. Everything degrades
gracefully without them, so this is not a blocker — but the contact form is
user-visible.

```bash
bunx wrangler secret put RESEND_API_KEY
bunx wrangler secret put LIFEOS_API_URL
bunx wrangler secret put LIFEOS_WEB_TOKEN
```

| Secret | Missing means |
| --- | --- |
| `RESEND_API_KEY` | Contact form returns 503 with an "email me directly" message |
| `LIFEOS_API_URL` | Whoop numbers serve the committed snapshot |
| `LIFEOS_WEB_TOKEN` | Same |

### 06 — Flip nameservers at Name.com · **you**

1. Name.com → `einargudni.com` → Nameservers.
2. Replace `ns1.vercel-dns.com` / `ns2.vercel-dns.com` with the two Cloudflare
   nameservers from phase 01.
3. Save. Cloudflare emails when it detects the change.

> [!WARNING]
> **Expect a long tail, not an instant switch.** The registry NS TTL is
> ~85,795s (≈24h) and cannot be shortened in advance. Resolvers will use
> *either* nameserver set for up to two days — which is exactly why phases
> 02–03 come first. Record TTLs are short (~1,200s now, 300s after import), so
> the records themselves settle quickly once a resolver has switched.

### 07 — Confirm the apps survived · **you**

- `posture` and `nido` still return 200 over HTTPS.
- Neither Vercel project shows an invalid-configuration warning.

### 08 — Enable Image Transformations · **you**

1. Cloudflare → the zone → **Images** → enable **Transformations**.
2. Set `VITE_CF_IMAGES=1` and redeploy.

Order matters and the flag exists precisely for this: with transformations off,
every `/cdn-cgi/image/` URL is a 404. Until the flag flips, images are served
untransformed — slower, never broken.

### 09 — Migrate `posture` → Cloudflare Pages · **Claude**

Astro, statically served (`x-vercel-cache: HIT` with `must-revalidate`). Same
shape as `sologbjor`, which already runs on Pages, so this is the easy one.

1. Build and deploy the Astro output to a Pages project.
2. Add `posture.einargudni.com` as a Pages custom domain.
3. Flip the CNAME from `cname.vercel-dns.com` to the Pages target.

Reversible: Vercel keeps serving until the record changes, and pointing the
CNAME back restores it within the record TTL — about five minutes, not a day.

### 10 — Migrate `nido` → Workers · **Claude**

Next.js with `cache-control: private, no-cache, no-store` and
`x-vercel-cache: MISS` — server-rendered on every request. This is a real
project, not a record change, and deserves its own session.

1. Port with `@opennextjs/cloudflare`, or rewrite the way this site was — the
   right call depends on how much of Next it actually leans on.
2. Attach `nido.einargudni.com` as a Worker Custom Domain. This is the step that
   was impossible before the zone moved.

---

## Rollback

Set the nameservers at Name.com back to `ns1.vercel-dns.com` and
`ns2.vercel-dns.com`. Vercel DNS keeps the zone as it is today, so this restores
the current state exactly — subject to the same ~24h NS TTL.

Because rollback is slow, **do not delete the Vercel projects** until the new
setup has run clean for a week. It costs nothing to leave them deployed, and
they are what rollback depends on.

---

## Checklist

- [ ] Confirm Vercel's domain list shows exactly: `www`, `posture`, `nido`, `sologbjor`
- [ ] Add `einargudni.com` to Cloudflare, record the two assigned nameservers
- [ ] Delete imported wildcard and stale Vercel A records
- [ ] Import `infra/einargudni.com.zone`, grey-cloud `posture` and `nido`
- [ ] Attach apex + www as Worker Custom Domains (Claude)
- [ ] Add Redirect Rule: `www` → apex, 301
- [ ] Copy `_vercel` TXT values from Vercel into Cloudflare **before** the flip
- [ ] `./scripts/verify-dns.sh <ns>` passes
- [ ] Put `RESEND_API_KEY`, `LIFEOS_API_URL`, `LIFEOS_WEB_TOKEN` as Worker secrets
- [ ] Change nameservers at Name.com
- [ ] After propagation: `./scripts/verify-dns.sh` passes, apps still 200
- [ ] Enable Image Transformations, set `VITE_CF_IMAGES=1`, redeploy
- [ ] Migrate `posture` to Pages
- [ ] Migrate `nido` to Workers via OpenNext
- [ ] One week clean — then retire the Vercel projects

---

## Reference

| | |
| --- | --- |
| Branch | `migrate/tanstack` (PR #39) |
| Worker | `einar-os` → <https://einar-os.einargudni.workers.dev> |
| Zone file | [`infra/einargudni.com.zone`](./einargudni.com.zone) |
| Verify | [`scripts/verify-dns.sh`](../scripts/verify-dns.sh) |
| Canonical host | apex `einargudni.com` — `SITE_URL` in `lib/discovery.ts` |
