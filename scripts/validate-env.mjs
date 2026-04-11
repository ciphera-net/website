#!/usr/bin/env node
/**
 * Build-time env validation for ciphera-website.
 *
 * NEXT_PUBLIC_* values are inlined into the client bundle by `next build`.
 * If any required var is missing or literally the string "undefined" at
 * build time, that wrong value gets baked into the .js files on disk and
 * ships to production — where it's impossible to fix without a rebuild.
 *
 * This script runs as part of the `prebuild` npm hook and hard-fails CI
 * if any required var is missing, so a misconfigured build becomes a loud
 * error immediately instead of a silent 404 that surfaces when a user
 * submits the contact form.
 *
 * Rules:
 * - REQUIRED vars must be non-empty strings that are not literally
 *   "undefined" (catches `${undefined}` template-literal bugs).
 * - OPTIONAL vars may be unset; source code provides sensible defaults.
 * - In `next dev` (NODE_ENV !== 'production'), we only warn on missing
 *   required vars so local development still works from .env.local.
 */

const REQUIRED = [
  'NEXT_PUBLIC_WEBSITE_API_URL',   // website-backend contact form endpoint
  'NEXT_PUBLIC_CAPTCHA_API_URL',   // captcha service for the contact form
]

const OPTIONAL = [
  // app/layout.tsx has safe https fallbacks — bake if set, don't fail if missing.
  // Layout must never throw because it renders every page root.
  'NEXT_PUBLIC_PULSE_SCRIPT_URL',
  'NEXT_PUBLIC_PULSE_API_URL',
]

const isProductionBuild = process.env.NODE_ENV === 'production'

function isBad(value) {
  return value === undefined || value === '' || value === 'undefined'
}

const missing = REQUIRED.filter(key => isBad(process.env[key]))

if (missing.length > 0) {
  const lines = [
    '',
    '\x1b[31m✗ ciphera-website build-time env validation failed\x1b[0m',
    '',
    'The following NEXT_PUBLIC_* variables are required at build time',
    'because Next.js inlines their values into the client JavaScript bundle:',
    '',
    ...missing.map(k => `  - ${k}`),
    '',
    'In CI, set them via `build-args:` in .github/workflows/build-and-push.yml',
    'In local dev, set them in .env.local',
    '',
    'See .env.example for the full list of expected variables.',
    '',
  ]
  const message = lines.join('\n')

  if (isProductionBuild) {
    console.error(message)
    process.exit(1)
  } else {
    console.warn(message)
    console.warn('\x1b[33m⚠ Continuing anyway because NODE_ENV is not production (dev mode).\x1b[0m\n')
  }
}

const allKnown = [...REQUIRED, ...OPTIONAL]
const report = allKnown
  .map(k => {
    const v = process.env[k]
    if (isBad(v)) return `  ${k}=<unset>`
    return `  ${k}=${v}`
  })
  .join('\n')

console.log('\x1b[32m✓ ciphera-website env validation passed. Baking into client bundle:\x1b[0m')
console.log(report)
console.log('')
