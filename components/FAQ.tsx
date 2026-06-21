'use client'

import { useRef, useState } from 'react'
import { PlusIcon } from '@ciphera-net/facet'
import { cn } from '@/lib/utils'

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
        q: 'What is zero-knowledge encryption?',
        a: 'Zero-knowledge encryption means your data is encrypted on your device before it reaches our servers. We cannot decrypt or access your files, even if we wanted to. Only you hold the encryption keys, ensuring complete privacy.',
      },
      {
        q: 'Is Ciphera GDPR compliant?',
        a: 'Yes. Ciphera is built with privacy-by-design principles and is fully GDPR compliant. We collect minimal data, encrypt everything, and you maintain full control over your information.',
      },
      {
        q: 'How is Ciphera different from Google Drive or Dropbox?',
        a: "Unlike traditional cloud storage, Ciphera encrypts your files on your device before upload. We never have access to your data. There's no data mining, no ad targeting, and no third-party access. Privacy isn't a feature we added — it's the foundation.",
      },
    ],
  },
  {
    label: 'Security',
    items: [
      {
        q: 'How secure is end-to-end encryption?',
        a: 'End-to-end encryption uses AES-256-GCM, the same military-grade encryption used by governments worldwide. Your files are encrypted before leaving your device, making interception impossible without your private keys.',
      },
      {
        q: 'Can you access my files?',
        a: 'No. With zero-knowledge architecture, we mathematically cannot access your files. Encryption happens client-side on your device, and only you have the decryption keys. Not even our servers can read your data.',
      },
      {
        q: 'What happens if I lose my encryption key?',
        a: 'Since we use zero-knowledge encryption, we cannot recover your files if you lose your encryption key. This is by design — it ensures that only you have access to your data. We recommend securely storing your keys.',
      },
      {
        q: 'Has Ciphera been independently audited?',
        a: 'Our code is open source, allowing anyone to audit our security implementations. We also conduct regular internal security reviews and penetration testing. All cryptographic implementations use well-established, peer-reviewed libraries.',
      },
      {
        q: 'How does Ciphera handle password storage?',
        a: "Your password is hashed client-side using PBKDF2 before being sent to our servers, where it's hashed again with Argon2id. This double-hashing approach means we never see your actual password — not during signup, login, or at any other point.",
      },
    ],
  },
  {
    label: 'Features',
    items: [
      {
        q: 'Does Pulse use cookies to track visitors?',
        a: 'No. Pulse is our privacy-first analytics tool that works without cookies, fingerprinting, or any form of personal data collection. It gives you meaningful insights like page views, referrers, and visitor counts while being fully GDPR compliant out of the box.',
      },
    ],
  },
  {
    label: 'Technical',
    items: [
      {
        q: 'Which encryption algorithm do you use?',
        a: 'We use AES-256-GCM (Galois/Counter Mode) for file encryption. This authenticated encryption algorithm provides both confidentiality and integrity, ensuring your data cannot be read or tampered with.',
      },
      {
        q: 'Where are the servers located?',
        a: 'All Ciphera services run on Swiss infrastructure. Your data benefits from Swiss data protection laws and stays in a privacy-respecting jurisdiction known for strong privacy regulations.',
      },
      {
        q: 'Is the code open source?',
        a: 'Yes! Our code is open source and available on GitHub. We believe transparency builds trust. Anyone can audit our security implementations and verify our privacy claims.',
      },
      {
        q: 'What happens to my data if Ciphera shuts down?',
        a: "Since your files are encrypted client-side, they remain encrypted and inaccessible on our servers regardless of what happens to the company. Active files can be downloaded by their owners at any time. We'd provide ample notice and migration tools in any shutdown scenario.",
      },
      {
        q: 'Can I self-host Ciphera services?',
        a: "Since our code is open source, you can inspect and run it yourself. However, we don't currently offer official self-hosting documentation or support. Our managed infrastructure ensures you get automatic updates, security patches, and Swiss data residency.",
      },
    ],
  },
]

// Continuous 01–14 numbering across groups — the index aesthetic
let runningIndex = 0
const NUMBERED = GROUPS.map((group) => ({
  ...group,
  items: group.items.map((item) => ({ ...item, n: String(++runningIndex).padStart(2, '0') })),
}))

export default function FAQ() {
  const [activeGroup, setActiveGroup] = useState(NUMBERED[0].label)
  const [openId, setOpenId] = useState<string | null>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  function selectGroup(label: string) {
    setActiveGroup(label)
    setOpenId(null)
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
        <p className="font-mono text-xs text-muted-foreground">
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
                    'flex items-baseline justify-between gap-3 py-1.5 text-left font-mono text-xs transition-colors duration-150 motion-reduce:transition-none',
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

          {/* Active category's rows — global 01–14 numbering preserved */}
          <div
            role="tabpanel"
            id="faq-panel"
            aria-labelledby={`faq-tab-${NUMBERED.findIndex((g) => g.label === activeGroup)}`}
            className="border border-border"
          >
            {group.items.map((item) => {
                const isOpen = openId === item.n
                const answerId = `faq-answer-${item.n}`
                return (
                  <div key={item.n} className="border-b border-border last:border-b-0">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() => setOpenId(isOpen ? null : item.n)}
                      className="flex w-full items-center gap-5 px-5 py-4 text-left transition-colors duration-150 motion-reduce:transition-none hover:bg-accent"
                    >
                      <span className="font-mono text-xs tabular-nums text-muted-foreground">
                        {item.n}
                      </span>
                      <span className="flex-1 text-sm font-medium text-foreground">{item.q}</span>
                      <PlusIcon
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 motion-reduce:transition-none"
                        style={{
                          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                        }}
                      />
                    </button>

                    <div
                      id={answerId}
                      className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
                      style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 pl-[60px] text-sm leading-relaxed text-muted-foreground">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
