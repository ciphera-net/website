'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { HomeIcon, RefreshCwIcon, AlertTriangleIcon } from '@ciphera-net/ui'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // * Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', error)
    }
  }, [error])

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center overflow-hidden relative py-12 sm:py-16">
      {/* * Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-brand-orange/10 rounded-full blur-[128px] opacity-60" />
        <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bg-neutral-500/10 dark:bg-neutral-400/10 rounded-full blur-[128px] opacity-40" />
      </div>

      <div className="section-container w-full">
        <div className="max-w-2xl mx-auto text-center px-4">
          {/* * Error Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-brand-orange/10 dark:bg-brand-orange/20 flex items-center justify-center">
              <AlertTriangleIcon className="w-10 h-10 sm:w-12 sm:h-12 text-brand-orange" />
            </div>
          </div>

          {/* * Error Message */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Something went wrong
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 mb-2 max-w-xl mx-auto leading-relaxed">
            We encountered an unexpected error. Don't worry, our team has been notified.
          </p>
          {error.digest && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8 font-mono">
              Error ID: {error.digest}
            </p>
          )}
          {!error.digest && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">
              {error.message || 'An unexpected error occurred'}
            </p>
          )}

          {/* * Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={reset}
              className="btn-primary inline-flex items-center gap-2"
            >
              <RefreshCwIcon className="w-5 h-5" />
              Try Again
            </button>
            <Link href="/" className="btn-secondary inline-flex items-center gap-2">
              <HomeIcon className="w-5 h-5" />
              Go Home
            </Link>
          </div>

          {/* * Helpful Links */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              Need help? Contact us:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <a
                href="mailto:hello@ciphera.net"
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors"
              >
                hello@ciphera.net
              </a>
              <Link
                href="/contact"
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors"
              >
                Contact Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
