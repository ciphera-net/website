import Link from 'next/link'
import { HomeIcon, ArrowLeftIcon } from '@ciphera-net/facet'
import { BackButton } from './not-found-client'

export const metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for could not be found.',
}

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 sm:py-16">
      <div className="w-full">
        <div className="max-w-2xl mx-auto text-center px-4">
          {/* * 404 Number */}
          <div className="mb-8">
            <h1 className="font-display text-8xl sm:text-9xl md:text-[12rem] font-bold text-muted-foreground leading-none">
              <span className="gradient-text">404</span>
            </h1>
          </div>

          {/* * Message */}
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Page Not Found
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>

          {/* * Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/" className="btn-primary inline-flex items-center gap-2">
              <HomeIcon className="w-5 h-5" />
              Go Home
            </Link>
            <BackButton />
          </div>

          {/* * Helpful Links */}
          <div className="border-t border-border pt-8">
            <p className="text-sm text-muted-foreground mb-4">
              You might be looking for:
            </p>
            <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                About
              </Link>
              <Link
                href="/products/pulse"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Pulse
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
