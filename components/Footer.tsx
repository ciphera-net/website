'use client'

import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full py-8 mt-auto border-t border-neutral-100 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            © {year} Ciphera. All rights reserved.
          </span>
        </div>
        
        <nav className="flex items-center gap-6">
          <Link 
            href="/about" 
            className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors"
          >
            About
          </Link>
          <Link 
            href="/products" 
            className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors"
          >
            Products
          </Link>
          <Link 
            href="/contact" 
            className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  )
}
