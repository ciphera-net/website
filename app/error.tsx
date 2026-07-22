'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { HomeIcon, RefreshCwIcon, AlertTriangleIcon } from '@ciphera-net/facet'

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
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 sm:py-16">
      <div className="w-full">
        <div className="max-w-2xl mx-auto text-center px-4">
          {/* * Error Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 border border-border bg-card flex items-center justify-center">
              <AlertTriangleIcon className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
            </div>
          </div>

          {/* * Error Message */}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Something went wrong
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-2 max-w-xl mx-auto leading-relaxed">
            We encountered an unexpected error. Don't worry, our team has been notified.
          </p>
          {error.digest && (
            <p className="text-sm text-muted-foreground mb-8 font-mono">
              Error ID: {error.digest}
            </p>
          )}
          {!error.digest && (
            <p className="text-sm text-muted-foreground mb-8">
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
          <div className="border-t border-border pt-8">
            <p className="text-sm text-muted-foreground mb-4">
              Need help? Contact us:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <a
                href="mailto:hello@ciphera.net"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                hello@ciphera.net
              </a>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
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
