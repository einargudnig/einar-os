#!/usr/bin/env bash
# Verify the einargudni.com cutover.
#
#   ./scripts/verify-dns.sh <cloudflare-nameserver>   # BEFORE flipping NS
#   ./scripts/verify-dns.sh                           # AFTER, against public DNS
#
# Passing a nameserver queries Cloudflare directly while the world still
# resolves through Vercel, so the new zone can be proven correct before any
# traffic depends on it.

set -uo pipefail

DOMAIN=einargudni.com
NS="${1:-}"
DIG=(dig +short)
[ -n "$NS" ] && DIG=(dig +short "@$NS")

pass=0; fail=0
ok()   { printf "  \033[32m✓\033[0m %s\n" "$1"; pass=$((pass+1)); }
bad()  { printf "  \033[31m✗\033[0m %s\n     expected: %s\n     got:      %s\n" "$1" "$2" "${3:-<empty>}"; fail=$((fail+1)); }
head_() { printf "\n\033[1m%s\033[0m\n" "$1"; }

if [ -n "$NS" ]; then
  head_ "Querying $NS directly (pre-cutover check)"
else
  head_ "Querying public DNS (post-cutover check)"
fi

# --- records ---------------------------------------------------------------
head_ "DNS records"

apex=$("${DIG[@]}" A "$DOMAIN" | tr '\n' ' ')
[ -n "$apex" ] && ok "apex resolves — $apex" || bad "apex has no A record" "Cloudflare anycast IPs" "$apex"

for host in posture nido; do
  target=$("${DIG[@]}" CNAME "$host.$DOMAIN")
  case "$target" in
    cname.vercel-dns.com.) ok "$host → Vercel (not migrated yet)" ;;
    "")                    bad "$host has no CNAME" "cname.vercel-dns.com." "" ;;
    *)                     ok "$host → $target (migrated)" ;;
  esac
done

sob=$("${DIG[@]}" CNAME "sologbjor.$DOMAIN")
[ -n "$sob" ] && ok "sologbjor → $sob" || bad "sologbjor has no CNAME" "sol-og-bjor.pages.dev." ""

# --- things that must NOT exist -------------------------------------------
head_ "Absences"

mx=$("${DIG[@]}" MX "$DOMAIN" | tr '\n' ' ')
[ -z "$mx" ] && ok "no MX records (correct — there is no email on this domain)" \
             || bad "unexpected MX records appeared" "nothing" "$mx"

wild=$("${DIG[@]}" A "definitely-not-real-$RANDOM.$DOMAIN" | tr '\n' ' ')
[ -z "$wild" ] && ok "wildcard is gone — unknown hosts return NXDOMAIN" \
               || bad "a wildcard is still answering" "NXDOMAIN" "$wild"

# --- live HTTP (only meaningful once NS has propagated) --------------------
if [ -z "$NS" ]; then
  head_ "Live HTTP"

  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "https://$DOMAIN/" || echo 000)
  [ "$code" = "200" ] && ok "apex serves the site (200)" || bad "apex" "200" "$code"

  redir=$(curl -s -o /dev/null -w '%{redirect_url}' --max-time 10 "https://www.$DOMAIN/" || echo "")
  case "$redir" in
    "https://$DOMAIN/"*) ok "www redirects to apex — $redir" ;;
    "")                  bad "www does not redirect" "301 to https://$DOMAIN/" "no redirect (Redirect Rule missing?)" ;;
    *)                   bad "www redirects somewhere unexpected" "https://$DOMAIN/" "$redir" ;;
  esac

  for host in posture nido sologbjor; do
    c=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "https://$host.$DOMAIN/" || echo 000)
    [ "$c" = "200" ] && ok "$host serves (200)" || bad "$host" "200" "$c"
  done

  md=$(curl -s -o /dev/null -w '%{content_type}' --max-time 10 -H 'Accept: text/markdown' "https://$DOMAIN/blog/tmux" || echo "")
  case "$md" in
    text/markdown*) ok "Accept: text/markdown negotiation works" ;;
    *)              bad "markdown negotiation" "text/markdown" "$md" ;;
  esac

  for p in /robots.txt /sitemap.xml /.well-known/api-catalog; do
    c=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "https://$DOMAIN$p" || echo 000)
    [ "$c" = "200" ] && ok "$p (200)" || bad "$p" "200" "$c"
  done
fi

printf "\n\033[1m%d passed, %d failed\033[0m\n" "$pass" "$fail"
[ "$fail" -eq 0 ] || exit 1
