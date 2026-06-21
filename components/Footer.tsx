import Image from 'next/image'
import Link from 'next/link'
import { GithubIcon, ArrowUpRightIcon } from '@ciphera-net/facet'
import { cdnUrl } from '@/lib/cdn'

export default function Footer() {
  return (
    <footer className="border-t border-border">
      {/* Same column as the page rails so the vertical lines run through the footer */}
      <div className="mx-auto w-full max-w-6xl sm:border-x sm:border-border">
      {/* Link grid */}
      <div className="px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2">
              <Image
                src={cdnUrl('/ciphera_icon.png')}
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
              />
              <span className="font-display text-lg font-bold tracking-tight text-foreground">
                Ciphera
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Privacy-first infrastructure and applications built on zero-knowledge principles. Your data is encrypted before it leaves your device.
            </p>
            <a
              href="https://github.com/ciphera-net"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ciphera on GitHub"
              className="mt-6 inline-flex h-9 w-9 items-center justify-center border border-border text-muted-foreground transition-colors duration-fast hover:border-line-hover hover:text-foreground"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-mono text-xs text-muted-foreground">
              Products
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/products/pulse" className="text-sm text-foreground/80 transition-colors duration-fast hover:text-foreground">
                  Pulse
                </Link>
              </li>
              <li>
                <Link href="/products/id" className="text-sm text-foreground/80 transition-colors duration-fast hover:text-foreground">
                  Ciphera ID
                </Link>
              </li>
              <li>
                <Link href="/products/captcha" className="text-sm text-foreground/80 transition-colors duration-fast hover:text-foreground">
                  Ciphera Captcha
                </Link>
              </li>
              <li>
                <Link href="/products/relay" className="text-sm text-foreground/80 transition-colors duration-fast hover:text-foreground">
                  Ciphera Relay
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-mono text-xs text-muted-foreground">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/about" className="text-sm text-foreground/80 transition-colors duration-fast hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-foreground/80 transition-colors duration-fast hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-foreground/80 transition-colors duration-fast hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="text-sm text-foreground/80 transition-colors duration-fast hover:text-foreground">
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-mono text-xs text-muted-foreground">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/privacy" className="text-sm text-foreground/80 transition-colors duration-fast hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-foreground/80 transition-colors duration-fast hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/transparency" className="text-sm text-foreground/80 transition-colors duration-fast hover:text-foreground">
                  Transparency
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/ciphera-net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground/80 transition-colors duration-fast hover:text-foreground"
                >
                  GitHub
                  <ArrowUpRightIcon aria-hidden="true" className="ml-1 inline h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Typographic signature — SVG textLength stretches the line to exactly
          the content width at every viewport (slack becomes letter-spacing) */}
      <div className="px-6 py-4" aria-hidden="true">
        <svg viewBox="0 0 1104 96" className="h-auto w-full select-none" role="presentation">
          <text
            x="0"
            y="90"
            textLength="1104"
            lengthAdjust="spacing"
            fill="transparent"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="1.25"
            style={{ font: '700 118px var(--font-space-grotesk), "Space Grotesk", sans-serif' }}
          >
            BUILT FOR PRIVACY
          </text>
        </svg>
      </div>

      {/* Bottom bar */}
      <div>
        <div className="px-6 py-6">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              &copy; 2024&ndash;{new Date().getFullYear()} Ciphera. All rights reserved.
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              Zero-knowledge &middot; Swiss hosted
            </p>
          </div>
        </div>
      </div>
      </div>
    </footer>
  )
}
