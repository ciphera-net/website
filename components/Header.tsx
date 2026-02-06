'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle, MenuIcon, XIcon } from '@ciphera-net/ui'
import { track } from '../lib/pulse'

// * Ciphera website header - matches ciphera-ui style
export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 pt-4 sm:pt-6 transition-transform duration-300 translate-y-0"
    >
      <div className="flex w-full max-w-6xl items-center justify-between rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white/70 dark:bg-neutral-900/70 px-4 sm:px-8 py-3.5 shadow-xl shadow-neutral-500/10 dark:shadow-black/20 backdrop-blur-2xl transition-all duration-300 supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-neutral-900/50 hover:shadow-2xl hover:shadow-neutral-500/15 dark:hover:shadow-black/30">
        {/* * Logo Section */}
        <Link 
          href="/" 
          className="flex items-center gap-3 group relative focus:outline-none focus:ring-2 focus:ring-brand-orange focus:rounded"
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center shrink-0">
            <Image 
              src="/ciphera_icon_no_margins.png"
              alt="Ciphera - Secure file sharing with zero-knowledge encryption logo"
              width={44}
              height={44}
              priority
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 transform-gpu will-change-transform [backface-visibility:hidden]"
            />
          </div>
          <span className="text-lg sm:text-xl md:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight group-hover:text-brand-orange transition-colors duration-300">
            Ciphera
          </span>
        </Link>

        {/* * Navigation Links - Hidden on mobile */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/about"
            className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-xl hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
          >
            About
          </Link>
          <Link
            href="/products"
            className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-xl hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
          >
            Products
          </Link>
          <Link
            href="/companies"
            className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-xl hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
          >
            For Companies
          </Link>
          <Link
            href="/contact"
            className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-xl hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
          >
            Contact
          </Link>
        </nav>

        {/* * Right Side Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {/* * Mobile Menu Toggle */}
          <button
            className="md:hidden p-2.5 -mr-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand-orange"
            onClick={() => {
              if (!isMobileMenuOpen) track('mobile_menu_open')
              setIsMobileMenuOpen(!isMobileMenuOpen)
            }}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      {/* * Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="absolute top-full left-0 right-0 p-3 sm:p-4 md:hidden animate-in slide-in-from-top-2 fade-in duration-200 mt-2">
          <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl shadow-xl p-2 flex flex-col gap-1">
            <Link
              href="/about"
              className="px-4 py-3 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-xl hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/products"
              className="px-4 py-3 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-xl hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/companies"
              className="px-4 py-3 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-xl hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              For Companies
            </Link>
            <Link
              href="/contact"
              className="px-4 py-3 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-xl hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
