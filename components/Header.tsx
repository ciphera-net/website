'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle, MenuIcon, XIcon, ChevronDownIcon } from '@ciphera-net/ui'
import { track } from '../lib/pulse'

const resources = [
  { name: 'Blog', href: '/blog', description: 'Privacy & security insights' },
]

const products = [
  { name: 'Pulse', href: '/products/pulse', description: 'Privacy-first analytics', icon: '/pulse_icon_no_margins.png', iconBg: 'bg-white dark:bg-neutral-800 ring-2 ring-brand-orange/30 dark:ring-brand-orange/40', external: false },
  { name: 'Drop', href: '/products/drop', description: 'Secure file sharing', icon: '/drop_icon_no_margins.png', iconBg: 'bg-white dark:bg-neutral-800 ring-2 ring-brand-orange/30 dark:ring-brand-orange/40', external: false },
  { name: 'Ciphera Auth', href: '/products/auth', description: 'Identity provider', icon: '/auth_icon_no_margins.png', iconBg: 'bg-white dark:bg-neutral-800 ring-2 ring-brand-orange/30 dark:ring-brand-orange/40', external: false },
  { name: 'Ciphera Captcha', href: '/products/captcha', description: 'Bot protection', icon: '/captcha_icon_no_margins.png', iconBg: 'bg-white dark:bg-neutral-800 ring-2 ring-brand-orange/30 dark:ring-brand-orange/40', external: false },
  { name: 'Ciphera Relay', href: '/products/relay', description: 'Email infrastructure', icon: '/relay_icon_no_margins.png', iconBg: 'bg-white dark:bg-neutral-800 ring-2 ring-brand-orange/30 dark:ring-brand-orange/40', external: false },
]

// * Ciphera website header - matches ciphera-ui style
export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProductsOpen, setIsProductsOpen] = useState(false)
  const [isResourcesOpen, setIsResourcesOpen] = useState(false)
  const productsRef = useRef<HTMLDivElement>(null)
  const resourcesRef = useRef<HTMLDivElement>(null)

  // * Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (productsRef.current && !productsRef.current.contains(event.target as Node)) {
        setIsProductsOpen(false)
      }
      if (resourcesRef.current && !resourcesRef.current.contains(event.target as Node)) {
        setIsResourcesOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
              src="/ciphera_icon.png"
              alt="Ciphera - Secure file sharing with zero-knowledge encryption logo"
              width={44}
              height={44}
              priority
              className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
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
            className="nav-link"
          >
            About
          </Link>
          
          {/* * Products dropdown */}
          <div className="relative" ref={productsRef}>
            <button
              onClick={() => {
                setIsProductsOpen(!isProductsOpen)
                if (!isProductsOpen) track('products_dropdown_open')
              }}
              className="nav-link flex items-center gap-1"
            >
              Products
              <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isProductsOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isProductsOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl shadow-neutral-500/20 dark:shadow-black/50 p-2 z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                {products.map((product) => {
                  const Icon = product.icon as unknown as React.ComponentType<{ className?: string }>
                  const content = (
                    <div className="flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                      <div className={`w-10 h-10 rounded-xl ${product.iconBg} flex items-center justify-center shrink-0 p-1.5`}>
                        {typeof product.icon === 'string' ? (
                          <Image 
                            src={product.icon} 
                            alt={product.name} 
                            width={20} 
                            height={20}
                            className="w-full h-full object-contain" 
                          />
                        ) : (
                          <Icon className="w-5 h-5 text-brand-orange" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-neutral-900 dark:text-white text-sm">
                          {product.name}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  )
                  
                  return product.external ? (
                    <a
                      key={product.name}
                      href={product.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        setIsProductsOpen(false)
                        track(`products_dropdown_${product.name.toLowerCase()}`)
                      }}
                    >
                      {content}
                    </a>
                  ) : (
                    <Link
                      key={product.name}
                      href={product.href}
                      onClick={() => {
                        setIsProductsOpen(false)
                        track(`products_dropdown_${product.name.toLowerCase()}`)
                      }}
                    >
                      {content}
                    </Link>
                  )
                })}
                <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-800 to-transparent my-2" />
                <Link
                  href="/products"
                  className="block px-4 py-3 text-sm font-medium text-brand-orange hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors text-center"
                  onClick={() => setIsProductsOpen(false)}
                >
                  View All Products →
                </Link>
              </div>
            )}
          </div>
          
          {/* * Resources dropdown */}
          <div className="relative" ref={resourcesRef}>
            <button
              onClick={() => {
                setIsResourcesOpen(!isResourcesOpen)
                if (!isResourcesOpen) track('resources_dropdown_open')
              }}
              className="nav-link flex items-center gap-1"
            >
              Resources
              <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isResourcesOpen ? 'rotate-180' : ''}`} />
            </button>

            {isResourcesOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl shadow-neutral-500/20 dark:shadow-black/50 p-2 z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                {resources.map((resource) => (
                  <Link
                    key={resource.name}
                    href={resource.href}
                    onClick={() => {
                      setIsResourcesOpen(false)
                      track(`resources_dropdown_${resource.name.toLowerCase()}`)
                    }}
                  >
                    <div className="flex flex-col px-4 py-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                      <div className="font-semibold text-neutral-900 dark:text-white text-sm">
                        {resource.name}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        {resource.description}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className="nav-link"
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
              className="nav-link py-3"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/products"
              className="nav-link py-3"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </Link>
            <div className="px-4 py-2 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Resources</div>
            <Link
              href="/blog"
              className="nav-link py-3 pl-6"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="nav-link py-3"
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
