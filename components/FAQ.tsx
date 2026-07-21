'use client'

import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import FAQAccordion from '@/components/FAQAccordion'

interface FAQItem {
  q: string
  a: string
}

interface FAQGroup {
  label: string
  items: FAQItem[]
}

const GROUPS: FAQGroup[] = [
  {
    label: 'General',
    items: [
      {
        q: 'What is Ciphera?',
        a: 'Ciphera is a privacy platform: Pulse for cookieless web analytics, Ciphera ID for zero-knowledge authentication, Ciphera Captcha for bot protection without tracking, and Ciphera Relay for transactional email that nobody reads along the way. We’re a Belgian company, and all customer data resides on Swiss infrastructure. Every product is built on the same principle — we shouldn’t have to see your data to serve you.',
      },
      {
        q: 'What does zero-knowledge mean at Ciphera?',
        a: 'Zero-knowledge means the server can verify something without learning it. Ciphera ID proves who you are without ever seeing your password, and your profile lives in a vault encrypted on your device — we authenticate you and store your data without being able to read either. Where zero-knowledge isn’t the right tool, we minimize instead: Pulse never learns who your visitors are, and Relay forgets where it delivered.',
      },
      {
        q: 'Is Ciphera GDPR compliant?',
        a: 'Yes. Ciphera is built with privacy-by-design principles and is fully GDPR compliant. We collect minimal data, store it on Swiss infrastructure, and you keep full control over your information.',
      },
      {
        q: 'How is Ciphera different from Big-Tech alternatives?',
        a: "The business model. Ad-funded tools are free because your users' data is the product. Ciphera products are paid tools with no data resale, no ad targeting, and no third-party access: Pulse gives you traffic insight without tracking individuals, Captcha verifies humans without profiling them, and Relay delivers email without reading it. Privacy isn't a feature we added — it's the foundation.",
      },
    ],
  },
  {
    label: 'Security',
    items: [
      {
        q: 'How does Ciphera handle password storage?',
        a: "Your password never leaves your device. We use OPAQUE (RFC 9807), a password-authenticated key exchange: your password is stretched on your device with Argon2id and proven to our servers without ever being sent. We store only an opaque credential record, so we never see your actual password — not during signup, login, or at any other point.",
      },
      {
        q: 'Can Ciphera see my personal data?',
        a: 'Your Ciphera ID profile — name, display name, email — lives in a vault that is encrypted on your device before it reaches us. An operator with full access to our database sees a UUID, an opaque credential record, and encrypted bytes: no name, no email, no profile. We publish a full accounting of what we can and cannot see on our blog.',
      },
      {
        q: 'What if I forget my password?',
        a: 'We can’t send it to you or reset it for you — we never have it. Account recovery uses your 24-word recovery phrase, generated when you create your Ciphera ID and never stored by us. Zero-knowledge cuts both ways: the same design that keeps us out of your data means there is no back door for anyone else either.',
      },
      {
        q: 'How does Captcha block bots without tracking people?',
        a: 'Ciphera Captcha runs a stateless, HMAC-signed challenge: your browser does a small proof-of-work in the background, and the server verifies its own signature instead of looking you up in a database. No cookies, no cross-site tracking, no behavioral profiling — it proves you are human without learning who you are.',
      },
      {
        q: 'Has Ciphera been independently audited?',
        a: 'Our cryptographic core is open source, allowing anyone to audit the code that handles your password. We also conduct regular internal security reviews and penetration testing. All cryptographic implementations use well-established, peer-reviewed libraries.',
      },
    ],
  },
  {
    label: 'Products',
    items: [
      {
        q: 'Does Pulse use cookies to track visitors?',
        a: 'No. Pulse is our privacy-first analytics tool that works without cookies, fingerprinting, or any form of personal data collection. It gives you meaningful insights like page views, referrers, and visitor counts while being fully GDPR compliant out of the box.',
      },
      {
        q: 'Can Pulse identify individual visitors?',
        a: 'No. Session identifiers rotate every day and are computed from a one-way hash — the same visitor on Monday and Tuesday produces two unlinked sessions. Raw IP addresses are discarded immediately after that computation, and site owners only ever see aggregates. A “show me this visitor’s history” view doesn’t exist because the data model can’t construct it.',
      },
      {
        q: 'What makes Relay different from other email providers?',
        a: 'Relay sends transactional email — password resets, verification codes, security alerts — through self-hosted Swiss infrastructure with no tracking pixels, no open-rate beacons, and no click-tracking redirects. Our delivery log records which template was sent and whether it succeeded; it has no column for the recipient address or the message body.',
      },
      {
        q: 'Do I need a Ciphera ID to use the products?',
        a: 'Yes — one Ciphera ID signs you into every Ciphera product: one password we never see, one encrypted vault. We don’t currently offer Ciphera ID as a standalone identity provider for third-party apps; today it is the identity layer behind the Ciphera platform.',
      },
    ],
  },
  {
    label: 'Technical',
    items: [
      {
        q: 'Which encryption do you use?',
        a: 'AES-256-GCM authenticated encryption for data at rest — including your Ciphera ID vault and stored email addresses — and TLS in transit. Authentication runs OPAQUE (RFC 9807), and the key that unlocks your vault is derived and used on your device, never on our servers.',
      },
      {
        q: 'Where are the servers located?',
        a: 'All Ciphera services run on Exoscale in Switzerland (CH-DK-2). Your data is protected by the Federal Act on Data Protection (FADP) alongside the GDPR.',
      },
      {
        q: 'Is the code open source?',
        a: 'Our cryptographic core is: Tessera, the OPAQUE implementation behind Ciphera ID, is on GitHub under Apache-2.0 — and we are opening more of the platform over time. The code that handles your password is exactly the code anyone can audit.',
      },
      {
        q: 'What happens to my data if Ciphera shuts down?',
        a: "Your vault stays encrypted with a key only you hold, so a shutdown can't expose it. Pulse analytics belong to the site owner and can be exported. In any wind-down we'd provide ample notice and migration tooling — and everything encrypted client-side stays unreadable to whoever ends up with the disks.",
      },
      {
        q: 'Can I self-host Ciphera services?',
        a: 'The open-source pieces — like Tessera, our OPAQUE core — you can run yourself today. The managed platform isn’t offered for self-hosting: running it ourselves is how we guarantee automatic security patches, monitored infrastructure, and Swiss data residency.',
      },
    ],
  },
]

// Continuous 01–18 numbering across groups — the index aesthetic
let runningIndex = 0
const NUMBERED = GROUPS.map((group) => ({
  ...group,
  items: group.items.map((item) => ({ ...item, n: String(++runningIndex).padStart(2, '0') })),
}))

export default function FAQ() {
  const [activeGroup, setActiveGroup] = useState(NUMBERED[0].label)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  function selectGroup(label: string) {
    setActiveGroup(label)
  }

  // Roving tabindex: arrow keys move both selection and focus along the category list
  function handleTabKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = NUMBERED.length - 1
    let next: number | null = null
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = index === last ? 0 : index + 1
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = index === 0 ? last : index - 1
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = last
    if (next === null) return
    e.preventDefault()
    selectGroup(NUMBERED[next].label)
    tabRefs.current[next]?.focus()
  }

  const group = NUMBERED.find((g) => g.label === activeGroup) ?? NUMBERED[0]

  return (
    <section id="faq" className="border-b border-border">
      <div className="px-6 py-16 sm:py-20">
        <p className="text-xs text-muted-foreground">
          04 · FAQ
        </p>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Frequently Asked Questions
        </h2>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[200px_1fr]">
          {/* Category selector — horizontal row on mobile, vertical rail on desktop */}
          <div
            role="tablist"
            aria-label="FAQ categories"
            aria-orientation="vertical"
            className="flex flex-wrap gap-x-6 gap-y-2 lg:flex-col lg:gap-y-1"
          >
            {NUMBERED.map((g, i) => {
              const isActive = g.label === activeGroup
              return (
                <button
                  key={g.label}
                  ref={(el) => { tabRefs.current[i] = el }}
                  type="button"
                  role="tab"
                  id={`faq-tab-${i}`}
                  tabIndex={isActive ? 0 : -1}
                  aria-selected={isActive}
                  aria-controls={isActive ? 'faq-panel' : undefined}
                  onClick={() => selectGroup(g.label)}
                  onKeyDown={(e) => handleTabKeyDown(e, i)}
                  className={cn(
                    'flex items-baseline justify-between gap-3 py-1.5 text-left text-xs transition-colors duration-150 motion-reduce:transition-none',
                    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {g.label}
                  <span className="tabular-nums text-muted-foreground">
                    {String(g.items.length).padStart(2, '0')}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Active category's rows — global 01–18 numbering preserved via startIndex;
              key remounts the accordion on group switch so open state resets */}
          <div
            role="tabpanel"
            id="faq-panel"
            aria-labelledby={`faq-tab-${NUMBERED.findIndex((g) => g.label === activeGroup)}`}
          >
            <FAQAccordion
              key={group.label}
              idPrefix="faq-home"
              items={group.items.map(({ q, a }) => ({ q, a }))}
              startIndex={NUMBERED.slice(0, NUMBERED.findIndex((g) => g.label === group.label))
                .reduce((sum, g) => sum + g.items.length, 0)}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
