/**
 * Round 6 (mock, 17-10-2026): every word on the Contact page, shared by all block options so only pixels differ.
 * Ruled (D34): outline A (the addresses, the form, the office), the phone kept and fixed, no business hours, business@
 * kept. Everything else is a DRAFT for the wording round (W6), written from the content review (plan §5h) and passed
 * through the humanizer. Straight apostrophes, as the rest of the overhaul copy. No hooks and no server-only imports.
 */

export const META = {
  title: 'Contact',
  description:
    'How to reach Ciphera: email addresses for questions, security reports, privacy and partnerships, a contact form, and our registered office in Belgium.',
}

// R3b drafted "Write to hello@ciphera.net, or use the form below."; the addresses block now sits right under the
// opening and names every address, so the lead no longer repeats one.
export const OPENING = {
  title: 'Contact',
  lead: 'Email us, or use the form below.',
}

/**
 * The addresses (D34: business@ kept). Each one delivers: `RCPT TO` answered 250 for all four on 17-10 (privacy@ and
 * business@ since OPS-18 that evening). One reply time for all four, the Trust page's 3 business days (D33), said once as
 * the block's lead (W6-1 A, D36). `icon`: the Phosphor name an option may draw in a tile. security@ points at the
 * disclosure policy on Trust.
 */
export const WRITE = {
  id: 'write',
  eyebrow: 'Email',
  title: 'Pick the address that fits.',
  lead: 'We reply within 3 business days.',
  items: [
    { key: 'hello', term: 'Questions and support', address: 'hello@ciphera.net', icon: 'ChatCircleText' },
    {
      key: 'security',
      term: 'Security reports',
      address: 'security@ciphera.net',
      icon: 'ShieldCheck',
      link: { label: 'How we handle reports', href: '/trust#disclosure' },
    },
    { key: 'privacy', term: 'Privacy and data protection', address: 'privacy@ciphera.net', icon: 'Scales' },
    { key: 'business', term: 'Partnerships', address: 'business@ciphera.net', icon: 'Handshake' },
  ],
  copy: { label: 'Copy', done: 'Copied', failed: "Couldn't copy" },
}

/**
 * The form. It sends to hello@ (website-backend `CONTACT_RECIPIENT`, read from the live Secret 17-10), behind a honeypot,
 * a dwell-time check and Ciphera Captcha. `subjects`: `value` is what website-backend's `allowedSubjects` accepts today
 * (unchanged), `label` is what people read. "Security Issue" is not offered: security reports go to security@ (the
 * Trust page's disclosure route), and the form goes to hello@. The privacy policy covers the form (contact form
 * submissions, consent); nothing here claims more than "we use it to reply".
 */
export const FORM = {
  id: 'form',
  eyebrow: 'Or use the form',
  title: 'Send us a message.',
  // W6-1 A (D36): the reply time is said once, in the addresses block above, so the form's lead names only where it goes.
  lead: 'Your message goes to hello@ciphera.net.',
  fields: { name: 'Name', email: 'Email', subject: 'Subject', message: 'Message' },
  placeholders: { name: 'Your name', email: 'you@example.com', message: 'How can we help?' },
  subjects: [
    { value: 'General Inquiry', label: 'Question' },
    { value: 'Technical Support', label: 'Support' },
    { value: 'Business Partnership', label: 'Partnership' },
    { value: 'Feature Request', label: 'Feature request' },
    { value: 'Other', label: 'Something else' },
  ],
  submit: 'Send message',
  sending: 'Sending…',
  sent: { title: 'Message sent.', line: "We'll reply within 3 business days." },
  failed: { title: "We couldn't send your message.", line: 'Please try again, or email hello@ciphera.net.' },
  // The build only (the mock does not require the captcha, because it sends nothing): when the box is not ticked.
  captchaMissing: 'Tick "I am human" before you send.',
  // Under a field after pressing send (W6 drafts, humanized). One email line for an empty field and a malformed address.
  errors: { name: 'Enter your name.', email: 'Enter an email address we can reply to.', message: 'Write your message.' },
  privacy: { text: 'We use your message to reply to you.', linkLabel: 'Privacy policy', href: '/privacy' },
  securityNote: { text: 'Found a security problem? Email security@ciphera.net instead.', href: '/trust#disclosure' },
  // MOCK ONLY: the mock never sends (the dev server points at production APIs). Shown when someone presses send here.
  // Sent before the security check has passed (18-10-2026, the build).
  captchaFirst: 'Complete the security check, then send again.',
}

/**
 * The office (D34: the phone kept and fixed: +32 78 48 07 10, dialled as +3278480710, as the privacy policy and today's
 * JSON-LD have it; no business hours). The address and the company number are About's record (`about/content.ts`).
 * The photo is back by the owner's ruling (D35, 17-10): today's image, a property agent's marketing photo of the shared
 * building (plan §5h item 2), shown as the live page shows it. `alt` names the building, never a "headquarters".
 */
export const OFFICE = {
  id: 'office',
  eyebrow: 'Where we are',
  title: 'Our registered office.',
  rows: [
    // W6-3 A (D36): "Address" (the title already says registered office) and About's own label and number.
    { key: 'office', term: 'Address', detail: 'De Kleetlaan 2, 1831 Diegem, Belgium', place: 'be' },
    { key: 'phone', term: 'Phone', detail: '+32 78 48 07 10', href: 'tel:+3278480710' },
    { key: 'company', term: 'Enterprise number (KBO/BCE)', detail: '1013.721.660' },
  ],
  aboutLink: { label: 'More about the company', href: '/about' },
  photo: { alt: 'The office building at De Kleetlaan 2 in Diegem.' },
}
