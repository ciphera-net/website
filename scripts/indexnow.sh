#!/bin/bash
# IndexNow post-deploy script for ciphera.net
# Notifies Bing, Yandex, Naver, and other participating engines of updated URLs.
#
# Usage:
#   ./scripts/indexnow.sh                          # Submit all sitemap URLs
#   ./scripts/indexnow.sh https://ciphera.net/blog/my-new-post  # Submit specific URLs

set -euo pipefail

HOST="ciphera.net"
KEY="7e3edc16b58611cf3c414e73669fb2b9"
KEY_LOCATION="https://${HOST}/${KEY}.txt"
ENDPOINT="https://api.indexnow.org/IndexNow"

# Build URL list: use arguments if provided, otherwise submit all sitemap URLs
if [ $# -gt 0 ]; then
  URLS=("$@")
else
  URLS=(
    # Core pages (/products is a section on the homepage, not a route — do not add it)
    "https://ciphera.net"
    "https://ciphera.net/about"
    "https://ciphera.net/contact"

    # Product pages
    "https://ciphera.net/products/pulse"
    "https://ciphera.net/products/id"
    "https://ciphera.net/products/captcha"
    "https://ciphera.net/products/relay"

    # Legal pages
    "https://ciphera.net/privacy"
    "https://ciphera.net/terms"

    # Trust hub (absorbed /security and /transparency, 19-07-2026)
    "https://ciphera.net/trust"
    "https://ciphera.net/trust/canary"
    "https://ciphera.net/trust/report"

    # Blog (survivors of the 19-07-2026 corpus purge — keep in sync with content/blog/)
    "https://ciphera.net/blog"
    "https://ciphera.net/blog/what-we-see-about-you-what-we-dont"
    "https://ciphera.net/blog/why-swiss-infrastructure-matters-for-data-privacy"
    "https://ciphera.net/blog/why-privacy-cant-be-an-afterthought"
    "https://ciphera.net/blog/pulse-vs-google-analytics-plausible-fathom"
    "https://ciphera.net/blog/eu-us-data-privacy-framework-executive-order"
    "https://ciphera.net/blog/eu-ai-act-compliance-guide-2026"
    "https://ciphera.net/blog/open-source-privacy-tools-2026"
    "https://ciphera.net/blog/zero-knowledge-encryption-guide"
    "https://ciphera.net/blog/why-we-chose-bunnycdn"
    "https://ciphera.net/blog/ciphera-id-vs-auth0-vs-clerk"
    "https://ciphera.net/blog/ciphera-captcha-vs-recaptcha-vs-turnstile"
    "https://ciphera.net/blog/do-you-need-a-cookie-banner-for-analytics"
    "https://ciphera.net/blog/is-your-analytics-gdpr-compliant"
  )
fi

# Build JSON array of URLs
URL_JSON=$(printf '%s\n' "${URLS[@]}" | jq -R . | jq -s .)

PAYLOAD=$(jq -n \
  --arg host "$HOST" \
  --arg key "$KEY" \
  --arg keyLocation "$KEY_LOCATION" \
  --argjson urlList "$URL_JSON" \
  '{host: $host, key: $key, keyLocation: $keyLocation, urlList: $urlList}')

echo "Submitting ${#URLS[@]} URLs to IndexNow..."

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

case $RESPONSE in
  200) echo "OK — URLs submitted successfully." ;;
  202) echo "Accepted — URLs accepted, will be processed." ;;
  400) echo "Error 400 — Bad request. Check payload format." >&2; exit 1 ;;
  403) echo "Error 403 — Key not valid or key file not found at ${KEY_LOCATION}" >&2; exit 1 ;;
  422) echo "Error 422 — URLs don't belong to host ${HOST}" >&2; exit 1 ;;
  429) echo "Error 429 — Rate limited. Try again later." >&2; exit 1 ;;
  *)   echo "Unexpected response: HTTP ${RESPONSE}" >&2; exit 1 ;;
esac
