'use client'

import Link from 'next/link'
import Image from 'next/image'
import { GitHubLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons'

const footerLinks = {
  products: [
    { name: 'Drop', href: 'https://drop.ciphera.net', external: true },
    { name: 'Ciphera Auth', href: '/products#auth', external: false },
    { name: 'Ciphera Captcha', href: '/products#captcha', external: false },
    { name: 'Ciphera Relay', href: '/products#relay', external: false },
  ],
  company: [
    { name: 'About', href: '/about', external: false },
    { name: 'Contact', href: '/contact', external: false },
  ],
  resources: [
    { name: 'Documentation', href: '#', external: false },
    { name: 'GitHub', href: 'https://github.com/ciphera-net', external: true },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#', external: false },
    { name: 'Terms of Service', href: '#', external: false },
  ],
}

// * Ciphera website footer - ciphera-ui style with comprehensive content
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full mt-auto border-t border-neutral-100 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
        {/* * Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* * Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 lg:pr-8">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <Image
                src="/ciphera_icon_no_margins.png"
                alt="Ciphera"
                width={36}
                height={36}
                className="w-9 h-9 group-hover:scale-105 transition-transform duration-300"
              />
              <span className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-brand-orange transition-colors duration-300">
                Ciphera
              </span>
            </Link>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
              Privacy-first infrastructure and applications built on zero-knowledge principles.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/ciphera-net"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-brand-orange dark:hover:text-brand-orange hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                aria-label="GitHub"
              >
                <GitHubLogoIcon className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-brand-orange dark:hover:text-brand-orange hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                aria-label="Twitter"
              >
                <TwitterLogoIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* * Products */}
          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">Products</h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* * Company */}
          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* * Resources */}
          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* * Legal */}
          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* * Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-800 to-transparent my-8" />

        {/* * Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            © 2024-{year} Ciphera. All rights reserved.
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Where Privacy Still Exists
          </p>
        </div>
      </div>
    </footer>
  )
}
