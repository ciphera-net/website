'use client'

import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { AuthMockup } from '@/components/ui/auth-mockup'
import { CaptchaMockup } from '@/components/ui/captcha-mockup'
import { RelayMockup } from '@/components/ui/relay-mockup'
import { PulseMockup } from '@/components/ui/pulse-mockup'
import { pulseIcon, authIcon, captchaIcon, relayIcon, pulseShowcaseBg, authShowcaseBg, captchaShowcaseBg, genA10 } from '@/lib/images'

export default function ProductShowcase() {
  return (
    <section className="py-20 lg:py-32 bg-neutral-950 space-y-28">
      <div className="container mx-auto px-6">
        {/* Pulse block — text left, mockup right */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — text */}
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Analytics without the surveillance.
            </h2>

            <div className="flex items-center gap-3 mb-4">
              <img src={pulseIcon.src} alt="Pulse" className="w-8 h-8 object-contain" />
              <span className="text-lg font-semibold text-white">Pulse</span>
            </div>

            <p className="text-lg text-neutral-400 leading-relaxed mb-8 max-w-lg">
              Privacy-first web analytics that gives you the insights you need without tracking your visitors.
              No cookies, no fingerprinting, no personal data collected. GDPR compliant by design.
            </p>

            <div className="flex flex-row gap-3 flex-wrap">
              <Button size="lg" className="gap-2 bg-brand-orange-button hover:bg-brand-orange-button-hover text-white" asChild>
                <Link href="/products/pulse">
                  Try Pulse <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" className="gap-2 text-neutral-300 hover:text-white" asChild>
                <Link href="/products/pulse">
                  Explore Pulse <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right — mockup */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-8 bg-brand-orange/8 rounded-[2.5rem] blur-3xl" />
              <div className="relative w-[560px] h-[600px] rounded-3xl overflow-hidden border border-white/[0.08] p-10 flex items-center justify-center">
                <img
                  src={pulseShowcaseBg.src}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative">
                  <PulseMockup />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {/* Auth block — text left, mockup right */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — text */}
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              One identity. Every Ciphera service.
            </h2>

            <div className="flex items-center gap-3 mb-4">
              <img src={authIcon.src} alt="Ciphera ID" className="w-8 h-8 object-contain" />
              <span className="text-lg font-semibold text-white">Ciphera ID</span>
            </div>

            <p className="text-lg text-neutral-400 leading-relaxed mb-8 max-w-lg">
              Create a single Ciphera ID to access all services. Your password is hashed on your device
              before it ever reaches our servers — we authenticate you without ever seeing your credentials.
            </p>

            <div className="flex flex-row gap-3 flex-wrap">
              <Button size="lg" className="gap-2 bg-brand-orange-button hover:bg-brand-orange-button-hover text-white" asChild>
                <Link href="/products/id">
                  Get started <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" className="gap-2 text-neutral-300 hover:text-white" asChild>
                <Link href="/products/id">
                  Explore Auth <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right — mockup in rounded container */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-8 bg-brand-orange/8 rounded-[2.5rem] blur-3xl" />
              <div className="relative w-[560px] h-[600px] rounded-3xl overflow-hidden border border-white/[0.08] p-10 flex items-center justify-center">
                <img
                  src={authShowcaseBg.src}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative">
                  <AuthMockup />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6">
        {/* Captcha block — mockup left, text right */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — mockup */}
          <div className="relative flex items-center justify-center lg:justify-start">
            <div className="relative">
              <div className="absolute -inset-8 bg-brand-orange/8 rounded-[2.5rem] blur-3xl" />
              <div className="relative w-[560px] h-[600px] rounded-3xl overflow-hidden border border-white/[0.08] p-10 flex items-center justify-center">
                <img
                  src={captchaShowcaseBg.src}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative">
                  <CaptchaMockup />
                </div>
              </div>
            </div>
          </div>

          {/* Right — text */}
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Bot protection that respects your users.
            </h2>

            <div className="flex items-center gap-3 mb-4">
              <img src={captchaIcon.src} alt="Ciphera Captcha" className="w-8 h-8 object-contain" />
              <span className="text-lg font-semibold text-white">Ciphera Captcha</span>
            </div>

            <p className="text-lg text-neutral-400 leading-relaxed mb-8 max-w-lg">
              Privacy-first bot protection for any website. No cross-site tracking, no cookies, no third-party data collection.
              Verifies humans in under 50ms while keeping their data private.
            </p>

            <div className="flex flex-row gap-3 flex-wrap">
              <Button size="lg" className="gap-2 bg-brand-orange-button hover:bg-brand-orange-button-hover text-white" asChild>
                <Link href="/products/captcha">
                  Get started <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" className="gap-2 text-neutral-300 hover:text-white" asChild>
                <Link href="/products/captcha">
                  Explore Captcha <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6">
        {/* Relay block — text left, mockup right */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — text */}
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Transactional email that just works.
            </h2>

            <div className="flex items-center gap-3 mb-4">
              <img src={relayIcon.src} alt="Ciphera Relay" className="w-8 h-8 object-contain" />
              <span className="text-lg font-semibold text-white">Ciphera Relay</span>
            </div>

            <p className="text-lg text-neutral-400 leading-relaxed mb-8 max-w-lg">
              The email backbone of the Ciphera ecosystem. Security alerts, verification codes, and account
              notifications — delivered in under 2 seconds with DKIM signing and 99.8% deliverability.
            </p>

            <div className="flex flex-row gap-3 flex-wrap">
              <Button size="lg" className="gap-2 bg-brand-orange-button hover:bg-brand-orange-button-hover text-white" asChild>
                <Link href="/products/relay">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" className="gap-2 text-neutral-300 hover:text-white" asChild>
                <Link href="/products/relay">
                  Explore Relay <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right — mockup */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-8 bg-brand-orange/8 rounded-[2.5rem] blur-3xl" />
              <div className="relative w-[560px] h-[600px] rounded-3xl overflow-hidden border border-white/[0.08] p-10 flex items-center justify-center">
                <img
                  src={genA10.src}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative">
                  <RelayMockup />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
