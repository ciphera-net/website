import Image from 'next/image'
import Link from 'next/link'
import { ArrowRightIcon, ArrowUpRightIcon, Button } from '@ciphera-net/facet'
import { cdnUrl } from '@/lib/cdn'
import { cn } from '@/lib/utils'
import { PulseMockup } from '@/components/ui/pulse-mockup'
import { AuthMockup } from '@/components/ui/auth-mockup'
import { CaptchaMockup } from '@/components/ui/captcha-mockup'
import { RelayMockup } from '@/components/ui/relay-mockup'

interface ProductRowProps {
  icon: string
  chip: string
  heading: string
  body: string
  primaryLabel: string
  primaryHref: string
  /** Optional — rows with a single destination render only the primary CTA */
  secondaryLabel?: string
  secondaryHref?: string
  mockup: React.ReactNode
  /** When true the mockup column sits on the left (lg:order-first) */
  mockupLeft?: boolean
  divider?: boolean
}

function ProductRow({
  icon,
  chip,
  heading,
  body,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  mockup,
  mockupLeft = false,
  divider = false,
}: ProductRowProps) {
  return (
    <div className={divider ? 'border-t border-border' : undefined}>
      <div className="grid items-center gap-12 px-6 py-20 sm:py-28 lg:grid-cols-2">
        {/* Text column */}
        <div className={mockupLeft ? 'lg:order-last' : undefined}>
          {/* Product chip */}
          <div className="flex items-center gap-2.5">
            <Image
              src={icon}
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
            />
            <span className="text-xs text-muted-foreground">
              {chip}
            </span>
          </div>

          <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[40px] lg:leading-[1.1]">
            {heading}
          </h2>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {body}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Button asChild>
              <Link href={primaryHref}>
                {primaryLabel}
                <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            {secondaryLabel && secondaryHref && (
              <Link
                href={secondaryHref}
                className="flex items-center gap-1 text-sm text-foreground transition-colors duration-fast hover:text-foreground/80"
              >
                {secondaryLabel}
                <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>

        {/* Mockup column — the real product UI recreations, sharp-framed.
            The mockup is already a self-framed panel — no second card around it.
            min-w-0 stops the mockups' min-content width from propagating up and
            stretching the page on narrow viewports. */}
        <div className={cn('min-w-0', mockupLeft && 'lg:order-first')}>
          {mockup}
        </div>
      </div>
    </div>
  )
}

export default function ProductShowcase() {
  return (
    <section id="products" className="scroll-mt-16 border-b border-border">
      <div className="border-b border-border px-6 py-5">
        <p className="text-xs text-muted-foreground">
          02 · Products
        </p>
      </div>

      <ProductRow
        icon={cdnUrl('/pulse_icon_no_margins.png')}
        chip="Pulse"
        heading="Analytics without the surveillance."
        body="Privacy-first web analytics that gives you the insights you need without tracking your visitors. No cookies, no fingerprinting, no personal data collected. GDPR compliant by design."
        primaryLabel="Try Pulse"
        primaryHref="/products/pulse"
        secondaryLabel="Explore Pulse"
        secondaryHref="/products/pulse"
        mockup={<PulseMockup />}
      />

      <ProductRow
        icon={cdnUrl('/id_icon_no_margins.png')}
        chip="Ciphera ID"
        heading="One identity. Every Ciphera service."
        body="Create a single Ciphera ID to access all services. Your password never leaves your device — we authenticate you without ever seeing your credentials."
        primaryLabel="Explore ID"
        primaryHref="/products/id"
        mockup={<AuthMockup />}
        divider
      />

      <ProductRow
        icon={cdnUrl('/captcha_icon_no_margins.png')}
        chip="Ciphera Captcha"
        heading="Bot protection that respects your users."
        body="Privacy-first bot protection for any website. No cross-site tracking, no cookies, no third-party data collection. Verifies humans in under 50ms while keeping their data private."
        primaryLabel="Get started"
        primaryHref="/products/captcha"
        secondaryLabel="Explore Captcha"
        secondaryHref="/products/captcha"
        mockup={<CaptchaMockup />}
        mockupLeft
        divider
      />

      <ProductRow
        icon={cdnUrl('/relay_icon_no_margins.png')}
        chip="Ciphera Relay"
        heading="Transactional email that just works."
        body="The email backbone of the Ciphera ecosystem. Security alerts, verification codes, and account notifications — handed straight to the mail server, with DKIM signing and no tracking of any kind."
        primaryLabel="Learn more"
        primaryHref="/products/relay"
        secondaryLabel="Explore Relay"
        secondaryHref="/products/relay"
        mockup={<RelayMockup />}
        divider
      />
    </section>
  )
}
