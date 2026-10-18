/**
 * Round R3b (mock, 17-10-2026): how an inner page opens, tried on four real pages. Plain titles, as About's (W4b),
 * and one DRAFT lead each, written through the humanizer pass and checked: each page's own wording round decides
 * its real words. No eyebrows (About dropped its own: it repeated the title).
 */
export const SAMPLE_PAGES = {
  trust: {
    title: 'Trust & security',
    // The header menu's line for this page (humanized 17-10).
    lead: 'How we protect your data, and who we work with.',
  },
  contact: {
    title: 'Contact',
    // The contact page has the form; the address is the company's public one.
    lead: 'Write to hello@ciphera.net, or use the form below.',
  },
  sustainability: {
    title: 'Sustainability',
    // The footprint is approximated (Boavizta life-cycle factors), reported per month (fetchImpactReport).
    lead: 'Our carbon footprint, estimated each month from the servers we run.',
  },
  privacy: {
    title: 'Privacy policy',
    // The policy's own date (its metadata: "Last updated 26-09-2026").
    lead: 'Last updated 26 September 2026.',
  },
} as const

export type SamplePage = keyof typeof SAMPLE_PAGES
