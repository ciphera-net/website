import type { GlossaryTerm } from './types'

/** Analytics & web terms. */
export const analyticsTerms: GlossaryTerm[] = [
  {
    slug: 'cookieless-analytics',
    term: 'Cookieless analytics',
    category: 'Analytics & web',
    short:
      'Cookieless analytics measures website traffic without setting cookies or any other persistent client-side identifier — counts are derived from request-level signals, not a stored ID that follows a browser over time.',
    paragraphs: [
      'Conventional analytics tools drop a first-party cookie containing a random visitor ID on first page load, then read it back on every subsequent visit to stitch sessions together and recognize returning users. That cookie is what makes the tool subject to consent rules in most jurisdictions: it is a persistent identifier stored on the user’s device, regardless of whether the data behind it is later called "anonymized."',
      'Cookieless tools drop the persistent identifier entirely. Traffic is aggregated from what a request already carries — page URL, referrer, user agent, coarse geolocation from the IP — without writing anything to the browser or building a durable per-visitor profile. The tradeoff is precision: without a stable ID, distinguishing a returning visitor from a new one becomes an estimate rather than a lookup, so cookieless tools favor aggregate trends over individual visitor timelines.',
      'Because there is no cookie and no persistent identifier, this category of tool typically falls outside ePrivacy consent-banner requirements in the EU and needs no cookie disclosure. Ciphera Pulse is built cookieless from the ground up: no cookies, no fingerprinting, and no consent banner required, with metrics aggregated rather than tied to a stored per-visitor record.',
    ],
    related: ['third-party-cookies', 'fingerprinting', 'unique-visitors', 'do-not-track', 'eprivacy-directive'],
    see: [{ label: 'Ciphera Pulse', href: '/products/pulse' }],
  },
  {
    slug: 'third-party-cookies',
    term: 'Third-party cookies',
    category: 'Analytics & web',
    short:
      'A third-party cookie is set by a domain other than the one the user is visiting — typically an ad or analytics vendor embedded via script — letting that vendor recognize the same browser across unrelated sites.',
    paragraphs: [
      'A first-party cookie is set by the site in the address bar and is only ever sent back to that site — a shopping cart or login session, for example. A third-party cookie is set by an embedded resource (an ad tag, a tracking pixel, a "Like" button) on a domain the user never typed into their address bar. Because that same embedded resource appears on thousands of unrelated sites, the vendor can correlate one browser’s visits across all of them, which is the technical basis for cross-site ad retargeting and behavioral profiling.',
      'This is also why third-party cookies attract the most regulatory and browser scrutiny: the user has no direct relationship with the domain doing the tracking, and rarely knows it is happening. Major browsers now block or restrict third-party cookies by default, which has pushed both advertising and analytics vendors toward alternatives — some privacy-preserving (aggregation, on-device processing), others simply harder to see, like fingerprinting.',
      'Ciphera Pulse sets no cookies at all, first-party or third-party — there is no cross-site identifier for Pulse to correlate in the first place.',
    ],
    related: ['cookieless-analytics', 'fingerprinting', 'tracking-pixel', 'do-not-track', 'gdpr'],
  },
  {
    slug: 'fingerprinting',
    term: 'Browser fingerprinting',
    category: 'Analytics & web',
    short:
      'Browser fingerprinting identifies a device by combining device and browser attributes — screen size, installed fonts, GPU details, timezone, and more — into a composite signature, without storing anything on the device.',
    paragraphs: [
      'A fingerprint is built from characteristics the browser exposes to any page it visits: canvas and WebGL rendering quirks, audio stack behavior, installed fonts, screen resolution, timezone, language, and dozens of other data points. No single attribute is unique, but the combination often is — enough entropy to re-identify a specific device across sites and sessions with no cookie required.',
      'This is precisely what makes fingerprinting harder to govern than cookies: there is nothing stored on the device to delete, no consent prompt to decline, and no expiry date. A user who clears cookies, uses private browsing, or rejects a consent banner can still be re-identified on their next visit if the underlying signals have not changed. Regulators increasingly treat fingerprinting as functionally equivalent to a persistent identifier under cookie-consent law, even though no cookie exists.',
      'Ciphera Pulse does not fingerprint devices — it collects no canvas, font, GPU, or other device-attribute signals, and builds no per-device signature.',
    ],
    related: ['cookieless-analytics', 'third-party-cookies', 'do-not-track', 'personal-data'],
  },
  {
    slug: 'tracking-pixel',
    term: 'Tracking pixel',
    category: 'Analytics & web',
    short:
      'A tracking pixel is a tiny, invisible image embedded in a page or email whose load request signals to the hosting server that the content was opened, along with the viewer’s IP and client details.',
    paragraphs: [
      'The mechanism is simple: a 1x1 transparent image tag points at a URL unique to the recipient or session. Loading the page or email triggers an HTTP request for that image, and the mere act of fetching it — not any interaction with visible content — tells the server the content was viewed, when, from what IP, and with what client software. No click or explicit action is required.',
      'On the web, pixels are a common cross-site tracking mechanism, often paired with third-party cookies to build advertising profiles. In email, they are the standard method behind "open tracking": read receipts the recipient never explicitly granted. Because loading remote images can be disabled or blocked, pixel-based tracking is inherently unreliable — but it is also silent, which is what makes it a privacy concern independent of its accuracy.',
      'Ciphera Relay sends transactional email with no tracking pixels and no open tracking of any kind — a delivered message stays a private exchange between sender and recipient, not a telemetry event.',
    ],
    related: ['third-party-cookies', 'open-tracking', 'fingerprinting', 'transactional-email'],
    see: [{ label: 'Ciphera Relay', href: '/products/relay' }],
  },
  {
    slug: 'bounce-rate',
    term: 'Bounce rate',
    category: 'Analytics & web',
    short:
      'Bounce rate is the share of visits in which a user views a single page and leaves without any further interaction or navigation — a rough signal of whether a landing page held attention.',
    paragraphs: [
      'A "bounce" is a single-page session: someone lands on a page and leaves without clicking through to another page or firing a tracked event, regardless of how long they stayed or how much they read. That definition makes bounce rate a blunt instrument — a visitor who reads a full blog post carefully and leaves satisfied looks identical to one who left in half a second, unless the tool also tracks engagement signals like scroll depth or time on page alongside it.',
      'Interpretation is directional, not absolute: bounce rate norms vary hugely by page type. A high bounce rate on a blog post or documentation page can be entirely healthy — the visitor got their answer and left. A high bounce rate on a checkout funnel is a real problem. It is best read alongside referrer and landing-page data, not as a standalone health score.',
      'Ciphera Pulse reports bounce rate as part of its standard aggregate metrics, computed the same way — single-page sessions — without needing a cookie to detect subsequent navigation within the same visit.',
    ],
    related: ['session', 'unique-visitors', 'referrer'],
    see: [{ label: 'Ciphera Pulse', href: '/products/pulse' }],
  },
  {
    slug: 'unique-visitors',
    term: 'Unique visitors',
    category: 'Analytics & web',
    short:
      'Unique visitors counts distinct people (or devices) visiting a site over a period, as opposed to pageviews, which counts every page load — the same visitor loading ten pages is one unique visitor and ten pageviews.',
    paragraphs: [
      'Cookie-based analytics tools count uniqueness by reading back a persistent visitor ID: if the same cookie value shows up twice, it is the same visitor. That approach is precise when the cookie survives, but it fails silently whenever it doesn’t — private browsing, cookie clearing, cross-device visits, or consent rejection all inflate the unique count by turning one real person into several apparent ones.',
      'Cookieless tools cannot read back a stored ID, so they estimate uniqueness from request-level signals over a bounded window instead of maintaining a durable per-visitor profile. This trades some precision for not requiring any persistent identifier — the count is an aggregate estimate, not a guarantee that no two counted visits came from the same person.',
      'Ciphera Pulse reports unique visitor counts using privacy-preserving counting that avoids cookies, fingerprinting, and long-lived per-visitor identifiers.',
    ],
    related: ['cookieless-analytics', 'session', 'bounce-rate', 'fingerprinting'],
    see: [{ label: 'Ciphera Pulse', href: '/products/pulse' }],
  },
  {
    slug: 'session',
    term: 'Session (analytics)',
    category: 'Analytics & web',
    short:
      'In web analytics, a session is a group of interactions — pageviews, events — from one visitor treated as a single continuous visit, typically closed out after a period of inactivity (commonly 30 minutes).',
    paragraphs: [
      'A session groups activity so that "five pageviews in three minutes" reads as one visit rather than five unrelated ones. The grouping logic usually relies on an inactivity timeout: once a set gap passes with no new activity, the next pageview starts a new session, even if it is the same person. Some tools also force a new session at midnight or when a visitor arrives via a new campaign source.',
      'Session count and session duration are foundational inputs to metrics like bounce rate and pages-per-visit, so how a tool defines a session boundary quietly shapes every derived number. Cookie-based tools tie sessions to a stored session ID; cookieless tools infer session boundaries from request timing and other signals without persisting an identifier between visits.',
      'Ciphera Pulse groups activity into sessions to compute bounce rate and session-based metrics without setting a session cookie.',
    ],
    related: ['bounce-rate', 'unique-visitors', 'cookieless-analytics'],
  },
  {
    slug: 'referrer',
    term: 'Referrer',
    category: 'Analytics & web',
    short:
      'The referrer is the URL of the page a visitor was on immediately before arriving at the current one, sent by the browser in the HTTP Referer header (or omitted, per the page’s referrer policy).',
    paragraphs: [
      'Referrer data is how analytics attributes traffic to its source: a search engine results page, a social platform, another site linking in, or an email client. It arrives as a standard (if famously misspelled) HTTP header, Referer, that browsers send on navigation — no cookie or script is required to capture it, which is why referrer breakdowns work equally well in cookieless tools.',
      'Referrer data is also increasingly incomplete by design. Modern browsers default to a Referrer-Policy that strips paths and query strings, or omits the header entirely on cross-origin or HTTPS-to-HTTP navigation, for the visitor’s privacy. Analytics tools generally see only the referring domain, not the specific page or search query that led there — this is a browser privacy feature working as intended, not a tracking gap to be closed.',
      'Ciphera Pulse reports referrer sources as part of its standard traffic breakdown, using the same browser-supplied header available to any analytics tool.',
    ],
    related: ['utm-parameters', 'session', 'cookieless-analytics'],
    see: [{ label: 'Ciphera Pulse', href: '/products/pulse' }],
  },
  {
    slug: 'utm-parameters',
    term: 'UTM parameters',
    category: 'Analytics & web',
    short:
      'UTM parameters are standardized query-string tags (utm_source, utm_medium, utm_campaign, and related fields) appended to a URL so analytics tools can attribute traffic to a specific campaign, channel, or link.',
    paragraphs: [
      'Where the Referer header only tells you the referring domain, UTM parameters let the linking party label the click explicitly — "this came from the July newsletter" or "this came from the LinkedIn paid campaign" — by embedding that label directly in the URL. The analytics tool on the receiving end reads the query string and buckets the visit accordingly, independent of what the browser’s referrer policy allows through.',
      'Because UTM tags are just visible query-string text, they work identically whether the analytics tool uses cookies or not, and they carry no personal data by design — a well-formed UTM link identifies a campaign, not a person. They are also easy to misuse: over-tagging internal links or sharing UTM-tagged URLs publicly can pollute attribution data with noise.',
      'Ciphera Pulse parses standard UTM parameters to attribute traffic to campaigns and sources, the same as any analytics tool — no cookie is needed to read a query string.',
    ],
    related: ['referrer', 'cookieless-analytics', 'session'],
    see: [{ label: 'Ciphera Pulse', href: '/products/pulse' }],
  },
  {
    slug: 'do-not-track',
    term: 'Do Not Track (DNT)',
    category: 'Analytics & web',
    short:
      'Do Not Track was an HTTP header and browser setting, standardized as DNT, that signaled a user’s preference not to be tracked across sites — largely abandoned because sites were never legally required to honor it.',
    paragraphs: [
      'DNT sent a simple header (DNT: 1) with every request, expressing intent rather than enforcing anything technically. It required every receiving site to voluntarily change its behavior, and most advertising-funded sites simply ignored the signal — there was no penalty for non-compliance and no way for the browser to verify a site had complied. Major browsers have since removed the DNT setting or stopped sending it by default, and the W3C working group that standardized it disbanded.',
      'DNT’s failure is the reference case for why its successor, Global Privacy Control, was designed differently: GPC is written into law in several US states, giving it an enforcement mechanism DNT never had. The lesson generalizes beyond browser settings — a privacy signal only changes behavior at a service that is either compelled to honor it or architecturally already compliant, not one that merely promises to.',
      'Ciphera products need no opt-out signal for tracking that never happens: Pulse collects no cookies or fingerprints to opt out of, and Relay sends no tracking pixels to suppress.',
    ],
    related: ['global-privacy-control', 'cookieless-analytics', 'gdpr'],
  },
  {
    slug: 'global-privacy-control',
    term: 'Global Privacy Control (GPC)',
    category: 'Analytics & web',
    short:
      'Global Privacy Control is a browser-sent HTTP signal (Sec-GPC: 1) expressing a user’s opt-out of sale and sharing of personal data — legally binding in California and other US states, unlike Do Not Track.',
    paragraphs: [
      'GPC works mechanically much like Do Not Track: a header attached to outgoing requests, plus a matching JavaScript property (navigator.globalPrivacyControl) sites can read. The difference is legal weight. Under the California Consumer Privacy Act (as amended by the CPRA) and similar laws in states such as Colorado and Connecticut, a business receiving a GPC signal must treat it as a valid opt-out request from that browser, with real enforcement behind it — which is what gave adoption a reason to happen where DNT never did.',
      'For sites that sell or share personal data with third parties for advertising, honoring GPC means suppressing that sharing for the signaling visitor. For sites that never sell or share personal data to begin with, GPC changes nothing to honor, because there is no matching activity to opt out of.',
      'Ciphera Pulse does not sell, share, or use visitor data for advertising, so a GPC signal changes nothing about how Pulse behaves — there is no data-sharing pathway for it to disable.',
    ],
    related: ['do-not-track', 'gdpr', 'cookieless-analytics', 'personal-data'],
    see: [{ label: 'globalprivacycontrol.org', href: 'https://globalprivacycontrol.org/' }],
  },
]
