/**
 * WEB-28 — the `id` every `feature-split`/`feature-grid`/`comparison-cards`/
 * `package-grid`/`content-block` section carries in the coded pages (`#proof-of-work`,
 * `#dashboard`, `#comparison`, …), which `@ciphera-net/facet-sections` renders as the
 * section's own anchor (`scroll-mt-20` + a real DOM id) — load-bearing, not cosmetic:
 * the mega-menu (`components/ui/header-3.tsx`) and Pulse's own feature-grid items link
 * to these anchors directly, and `/products/pulse#visitors` 404ing-to-nowhere is a
 * real navigation regression, not a pixel difference.
 *
 * 🔴 NOT ON THE WIRE. None of the five product-page block types' `block.json`
 * (`Infra/CMS/wordpress`'s `mu-plugins/blocks/ciphera-*`) declares an `id`/`anchor`
 * attribute — `ciphera_page_parse_sections()` never emits one. Adding that is a
 * WordPress-repo change, out of this repo's scope; until it lands, these anchors are
 * reconstructed here, in code, same category as the three protocol diagrams and the
 * per-page JSON-LD (contract §5: "derived from the product's own identity, not from
 * section content").
 *
 * 🔑 KEYED BY HEADING TEXT, NOT POSITION. An agency CAN reorder, add, or remove
 * sections in WordPress — a position-indexed table would silently hand the wrong
 * anchor to the wrong section the moment that happens. Keying by the section's own
 * `heading` (exact string match) means a reordered section keeps ITS OWN correct
 * anchor regardless of where it moved to; an unmapped heading (a genuinely new
 * section, or an edited one) degrades to no anchor — a lost deep link, never a wrong
 * one, and never a crash.
 */

const ANCHOR_IDS_BY_PATH: Record<string, Record<string, string>> = {
  '/products/captcha': {
    'Invisible to humans. Expensive for bots.': 'proof-of-work',
    'Everything in Ciphera Captcha.': 'features',
    'No database. No sessions. No state.': 'stateless',
    'Hosted in Switzerland. Zero telemetry.': 'privacy',
    'How Ciphera Captcha compares.': 'comparison',
  },
  '/products/id': {
    'One account for our applications.': 'what-it-is',
    'Your password never leaves your device.': 'zero-knowledge-auth',
    'We do not know your name or your email address.': 'vault',
    'What happens after you sign in.': 'sessions',
    'Hosted in Switzerland. Blind by design.': 'privacy',
  },
  '/products/pulse': {
    'Your traffic, at a glance.': 'dashboard',
    'Everything in Pulse.': 'features',
    "One script tag. That's it.": 'script',
    'Hosted in Switzerland. Discarded at the edge.': 'privacy',
    'How Pulse compares.': 'comparison',
  },
  '/products/relay': {
    'Security-critical emails, handed off fast.': 'alerts',
    'Everything in Ciphera Relay.': 'features',
    'Standard SMTP. Any language.': 'integration',
    'Hosted in Switzerland. Deleted in 30 days.': 'privacy',
    'How Ciphera Relay compares.': 'comparison',
  },
  '/products/tessera': {
    'An OPAQUE library you can read': 'what-it-is',
    'Three packages, one protocol': 'packages',
    'The password never reaches the server': 'why-opaque',
    'It runs in production at Ciphera': 'who-uses-it',
  },
}

/** `undefined` (no `id` prop at all) for any page/heading this table does not know —
 * never a thrown error, never a guessed id. */
export function anchorIdFor(path: string, heading: string): string | undefined {
  return ANCHOR_IDS_BY_PATH[path]?.[heading]
}
