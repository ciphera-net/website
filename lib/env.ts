/**
 * Typed, Zod-validated build-time environment configuration.
 *
 * This file is the SINGLE SOURCE OF TRUTH for every public environment
 * variable ciphera-website consumes. All consumers should `import { env }`
 * and read values from the resulting object — never from `process.env`
 * directly.
 *
 * How it works:
 *
 * 1. `@t3-oss/env-nextjs` wraps a Zod schema and validates `process.env`
 *    at module load time. Any missing or malformed value throws a
 *    structured error listing every problem at once.
 *
 * 2. The `runtimeEnv` object is the ONLY place in the app where
 *    `process.env.NEXT_PUBLIC_*` is read. Every access is a literal
 *    property access, which webpack's DefinePlugin statically replaces
 *    with the build-arg value at compile time.
 *
 * 3. `env.NEXT_PUBLIC_FOO` is typed as `string` (narrowed from the Zod
 *    schema), so TypeScript propagates the non-undefined type everywhere
 *    without manual `requireEnv` helpers or `if (!X) throw` guards.
 *
 * Adding a new NEXT_PUBLIC_* var:
 *   a. Add the Zod field to the `client` schema below.
 *   b. Add the literal `process.env.NEXT_PUBLIC_FOO` entry to `runtimeEnv`.
 *   c. Add the `build-args:` line to .github/workflows/build-and-push.yml.
 *   d. Add the variable to .env.example with a prod value and explanation.
 *   e. Use `env.NEXT_PUBLIC_FOO` anywhere in source.
 */

import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  client: {
    /** website-backend base URL for the contact form POST endpoint. */
    NEXT_PUBLIC_WEBSITE_API_URL: z.string().url(),

    /** Captcha service base URL, includes `/api/v1` suffix. */
    NEXT_PUBLIC_CAPTCHA_API_URL: z.string().url(),

    /**
     * Pulse analytics script URL. Used by app/layout.tsx for dns-prefetch.
     * Has a sensible prod default so the root layout never blocks on a
     * missing var (layout.tsx renders every page root — it must never
     * throw at module load).
     */
    NEXT_PUBLIC_PULSE_SCRIPT_URL: z
      .string()
      .url()
      .default('https://js.ciphera.net/script.js'),

    /** Pulse analytics API URL. Same dns-prefetch story as above. */
    NEXT_PUBLIC_PULSE_API_URL: z
      .string()
      .url()
      .default('https://pulse-api.ciphera.net'),
  },
  /*
   * Every entry here MUST be a literal `process.env.NEXT_PUBLIC_X` access.
   * Do NOT read them indirectly — webpack DefinePlugin only inlines
   * literal reads, and a missed replacement ships an `undefined` value
   * to production. See the 11-04-2026 contact-form outage retrospective.
   */
  runtimeEnv: {
    NEXT_PUBLIC_WEBSITE_API_URL: process.env.NEXT_PUBLIC_WEBSITE_API_URL,
    NEXT_PUBLIC_CAPTCHA_API_URL: process.env.NEXT_PUBLIC_CAPTCHA_API_URL,
    NEXT_PUBLIC_PULSE_SCRIPT_URL: process.env.NEXT_PUBLIC_PULSE_SCRIPT_URL,
    NEXT_PUBLIC_PULSE_API_URL: process.env.NEXT_PUBLIC_PULSE_API_URL,
  },
  emptyStringAsUndefined: true,
})
