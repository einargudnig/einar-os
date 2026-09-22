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

# --- explicit records that must survive the move ----------------------------
head_ "Explicit records"

check_a() {  # name expected-ip
  got=$("${DIG[@]}" A "$1.$DOMAIN" | sort | tr '\n' ' ')
  case "$got" in *"$2"*) ok "$1 A -> $2" ;; *) bad "$1 A" "$2" "$got" ;; esac
}
check_cname() {  # name expected-target
  got=$("${DIG[@]}" CNAME "$1.$DOMAIN")
  [ "$got" = "$2" ] && ok "$1 CNAME -> $2" || bad "$1 CNAME" "$2" "$got"
}

check_a     craft     76.76.21.21
check_a     writing   76.76.21.21
check_a     learning  66.241.124.56
check_a     coolify   37.27.184.91
check_cname learnings remix-workbook.fly.dev.
check_cname sologbjor sol-og-bjor.pages.dev.

apex=$("${DIG[@]}" A "$DOMAIN" | tr '\n' ' ')
[ -n "$apex" ] && ok "apex resolves — $apex" || bad "apex has no A record" "an address" "$apex"

# --- email: Resend lives on send.* and resend._domainkey, NOT the apex -------
head_ "Email (Resend)"

mx=$("${DIG[@]}" MX "send.$DOMAIN" | tr '\n' ' ')
case "$mx" in
  *feedback-smtp*) ok "send MX -> $mx" ;;
  *)               bad "send MX" "10 feedback-smtp.us-east-1.amazonses.com." "$mx" ;;
esac

spf=$("${DIG[@]}" TXT "send.$DOMAIN" | tr -d '"')
case "$spf" in
  *"include:amazonses.com"*) ok "send SPF present" ;;
  *)                         bad "send SPF" "v=spf1 include:amazonses.com ~all" "$spf" ;;
esac

dkim=$("${DIG[@]}" TXT "resend._domainkey.$DOMAIN" | tr -d '"')
case "$dkim" in
  *IDAQAB) ok "DKIM present and terminates correctly (${#dkim} chars)" ;;
  "")      bad "DKIM missing" "p=MIGf...IDAQAB" "" ;;
  *)       bad "DKIM looks truncated" "a key ending IDAQAB" "${dkim: -24}" ;;
esac

# --- wildcard-served hosts: must resolve, however they get there ------------
head_ "Wildcard-served hosts (www, posture, nido)"

for host in www posture nido; do
  got=$("${DIG[@]}" A "$host.$DOMAIN" | head -1)
  cn=$("${DIG[@]}" CNAME "$host.$DOMAIN")
  if [ -n "$cn" ]; then ok "$host -> $cn (explicit)"
  elif [ -n "$got" ]; then ok "$host -> $got"
  else bad "$host does not resolve" "an address" "nothing — wildcard dropped without a replacement?"; fi
done

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

  for host in posture nido sologbjor craft writing; do
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
