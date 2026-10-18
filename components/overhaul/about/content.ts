/**
 * Round 4 (mock, 17-10-2026): every word on the About page, shared by all block options so only pixels differ.
 * Ruled (D18, W4b, W4c in plan §5d): outline A; the opening's headline and lead; the story; the founding date as the only date.
 * Everything else is a DRAFT, checked against today's facts (plan §5d) and passed through the humanizer skill (17-10),
 * and goes to a wording round after the pixels.
 * No hooks and no server-only imports: server and client options can both read it.
 */
import { cdnUrl } from '@/lib/cdn'


export const OPENING = {
  // W4b (ruled 17-10), lead reworded by W4c (humanizer, ruled 17-10): a plain headline, no eyebrow (it would repeat the headline). The definition with "Belgian"
  // beside the name now lives in the questions ("What is Ciphera?") and the record, not in the opening.
  title: 'About Ciphera',
  lead: 'We are a small software company in Belgium. We make privacy-first tools for the web and run them on servers in Switzerland. The one we sell is Pulse Analytics.',
  // Short forms of three RECORD.facts rows, for an option that shows them in one line. Draft.
  // W5-3 (17-10), applied here as its consequence: "your data", not "servers" (this website runs on bunny.net).
  facts: ['Founded 18 September 2024', 'Diegem, Belgium', 'Data stored in Switzerland'],
}

export const STORY = {
  eyebrow: 'Why we exist',
  // W4c (ruled 17-10): the humanizer pass replaced D18's "Architecture, not policy." and its two lists of three.
  // "Much", not "most", of the code is public: the Pulse and ID backends are private. "Your data", never "our servers"
  // (W5-3, ruled 17-10): this website, docs, help and status run on bunny.net, so only the data and its backups are Swiss.
  // Never "everything": the CDN's edges are worldwide and GitHub (US) hosts the code.
  title: 'Why we build it this way',
  body: [
    'Most companies answer “who can see my data?” with a privacy policy, and you have to take their word for it.',
    'We would rather the answer depend on how the software works.',
    'So we run our own sign-in and mail servers.',
    'We store your data in Switzerland, and much of our code is public, including this website.',
  ],
  // Frame labels for an option that sets the two answers side by side. Draft.
  contrast: { policy: 'A privacy policy', built: 'How the software works' },
  // Optional proof points an option may show beside the story. Each is true today (plan §5d); none repeats the
  // homepage's How we build line for line.
  proofs: [
    // `marks`: which logos an option may draw beside the row (Round 4b colour). 'ciphera-id' = the Ciphera ID logo
    // (owner 17-10: "for the sign in logo, use the ciphera id logo"),
    // 'mail' = an envelope glyph, the providers in their brand colours (brand-marks.ts INFRA_MARKS), 'github' white.
    { label: 'Our own sign-in', detail: 'Passwords never reach our servers', href: '/trust#sign-in', marks: ['ciphera-id'] },
    { label: 'Our own mail servers', detail: 'No third-party email service sends our mail', href: '/trust', marks: ['mail'] },
    { label: 'Servers in Switzerland', detail: 'Exoscale in Zurich, backups at Infomaniak', href: '/#where', marks: ['exoscale', 'infomaniak'] },
    { label: '25 public repositories', detail: 'Including this website', href: 'https://github.com/ciphera-net', marks: ['github'] },
  ],
}

export const FOUNDER = {
  eyebrow: 'Who is behind it',
  title: 'Who runs Ciphera',
  name: 'Usman Baig',
  role: 'Founder',
  // W4d (ruled 17-10): today's draft. No product list (D1), no personal claims we cannot show.
  bio: [
    'Usman Baig founded Ciphera BV in September 2024 and leads the company.',
    'Questions about how we work go straight to the founder.',
  ],
  // Owner 19-10: the new photo, black and white and graded down so the wall sits back on the dark page (option B of
  // the founder-photo round), cropped to the same 552 × 579 frame as the photo it replaces. A new name, because the CDN
  // caches /website/* for a year. Shown at most 276 CSS px wide (half its width) so it stays sharp on 2x screens.
  photoSrc: cdnUrl('/overhaul/founder-19-10-2026.jpg'),
  photoW: 552,
  photoH: 579,
  photoAlt: 'Usman Baig, founder of Ciphera',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/usman-baig-79b843238/' },
    { label: 'GitHub', href: 'https://github.com/uz1mani' },
  ],
  // W4d (owner 17-10): "usman@ciphera.net, use that mail". The founder block only; the press contact stays hello@.
  email: 'usman@ciphera.net',
}

export const KBO_URL =
  'https://kbopub.economie.fgov.be/kbopub/toonondernemingps.html?ondernemingsnummer=1013721660&lang=en'

export const RECORD = {
  eyebrow: 'On the record',
  title: 'Ciphera BV, as registered.',
  // Humanizer pass 17-10 also caught a false claim here: the register does not hold the Law or data rows.
  lead: 'You can check the company details in the Belgian enterprise register.',
  // Values are names and numbers for people, not code: Geist with tabular-nums, never font-mono.
  // `place` (Round 4b colour): the country a row is about, for an option that marks it with its flag.
  facts: [
    { term: 'Legal name', detail: 'Ciphera BV' },
    { term: 'Legal form', detail: 'Private limited company (besloten vennootschap)' },
    { term: 'Enterprise number (KBO/BCE)', detail: '1013.721.660' },
    { term: 'VAT number', detail: 'BE1013721660' },
    { term: 'Founded', detail: '18 September 2024' },
    // Postal name. The register's seat line reads "1831 Machelen (Brab.)": same place (plan §5d item 8).
    { term: 'Registered office', detail: 'De Kleetlaan 2, 1831 Diegem, Belgium', place: 'be' },
    // NIS2 dropped (plan §5d item 9).
    { term: 'Law', detail: 'Belgian law and the GDPR', place: 'be' },
    { term: 'Where data lives', detail: 'Servers and backups in Switzerland, under the Swiss FADP', place: 'ch' },
  ],
  registerLabel: 'Look us up in the Belgian enterprise register',
  registerHref: KBO_URL,
  // Brand-entity plan 27-07, Lever 2: name the colliders. Re-checked live 17-10 (cipheravpn.com dropped: it now serves
  // another product). Names only, no links, in the mock; whether to link is a wording-round choice.
  notUs: {
    label: 'Not to be confused with',
    intro: 'Other companies and projects share the name. We are not affiliated with any of them:',
    names: [
      'ciphera.co, a security consultancy',
      'ciphera.org, a crypto transaction firewall',
      'Ciphera Ltd (ciphera.uk), recruiting software in the UK',
      'the research paper “Ciphera: A Decentralised Biometric Identity Framework”',
      'the Ciphera apps on the App Store and Google Play',
    ],
    outro: 'ciphera.net is us.',
  },
}

export const QUESTIONS = {
  eyebrow: 'Questions',
  title: 'About the company.',
  // Draft. Five or six questions the homepage FAQ does not ask, except the definition, which belongs here. Rendered
  // visibly and mirrored into FAQPage JSON-LD (the page that /what-is-ciphera redirects to keeps its schema).
  items: [
    {
      q: 'What is Ciphera?',
      a: 'Ciphera BV is a Belgian software company, founded in 2024 and based in Diegem, near Brussels. It builds privacy-first tools for the web and runs them on Swiss infrastructure. Its product is Pulse Analytics.',
    },
    {
      q: 'Is Ciphera a company or a product?',
      a: 'A company. Ciphera BV is registered in Belgium (KBO/BCE 1013.721.660). Its product is called Pulse Analytics.',
    },
    {
      q: 'Where is Ciphera based, and where is data stored?',
      a: 'The company is in Diegem, Belgium, so Belgian law and the GDPR apply. We store your data in Switzerland, backups included, under the Swiss data protection act.',
    },
    {
      q: 'Does Ciphera make anything besides Pulse?',
      a: 'We run our own sign-in, bot protection and email for our own apps, but we do not sell them. Tessera, the library behind our sign-in, is open source.',
    },
    {
      q: 'Is Ciphera related to other companies called Ciphera?',
      a: 'No. We are not affiliated with ciphera.co, ciphera.org, Ciphera Ltd (ciphera.uk) or the Ciphera apps. ciphera.net is us.',
    },
    {
      q: 'Who founded Ciphera?',
      a: 'Usman Baig, in September 2024.',
    },
  ],
}

export const PRESS = {
  id: 'press',
  eyebrow: 'Press',
  title: 'Writing about Ciphera?',
  lead: 'You can use the description below as it is. Our logos and a press contact are under it.',
  boilerplateLabel: 'Company description',
  // Draft, rewritten to W1 (plan §5d): no zero-knowledge claim, no retired products.
  boilerplate:
    'Ciphera BV is a Belgian software company founded in 2024. It builds privacy-first tools for the web and runs them on Swiss infrastructure. Its product, Pulse Analytics, measures website traffic without cookies and without following visitors. Ciphera is based in Diegem, Belgium. ciphera.net',
  // Three of the six marks /press offers today (D1). PNG only: no vector exists anywhere yet (plan §5d).
  // Pixel sizes measured 17-10; logo files are not square (render h-* w-auto).
  assets: [
    { label: 'Ciphera logo', note: 'Wordmark, transparent PNG', file: '/ciphera_logo_no_margins.png', w: 3987, h: 1272 },
    { label: 'Ciphera icon', note: 'Mark only, transparent PNG', file: '/ciphera_icon.png', w: 1207, h: 1272 },
    { label: 'Pulse icon', note: 'Product mark, transparent PNG', file: '/pulse_icon_no_margins.png', w: 1891, h: 2806 },
  ],
  usage: 'Use the name and marks to refer to Ciphera and Pulse. Please do not change their colours or proportions.',
  // Facet's tokens (UI/facet/packages/tokens/src/tokens.ts), for an option that shows the brand colours.
  coloursLabel: 'Brand colours',
  colours: [
    { name: 'Brand orange', hex: '#FD5E0F' },
    { name: 'Background', hex: '#0A0A0A' },
    { name: 'Text', hex: '#F4F4F4' },
  ],
  contactLabel: 'Press contact',
  email: 'hello@ciphera.net',
}

// Round 4b (17-10): an optional closing band before the footer, in the homepage closing's warm horizon. Humanized.
export const CLOSING = {
  title: 'Questions about Ciphera?',
  lead: 'Write to hello@ciphera.net. If you want to see what we make, Pulse is free to try on one site.',
  primary: { label: 'Contact us', href: '/contact' },
  secondary: { label: 'Try Pulse free', href: 'https://pulse.ciphera.net/signup' },
}
