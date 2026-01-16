import Link from 'next/link'
import { HomeIcon, ArrowLeftIcon } from '@radix-ui/react-icons'
import { BackButton } from './not-found-client'

export const metadata = {
  title: '404 - Page Not Found | Ciphera',
  description: 'The page you are looking for could not be found.',
}

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center overflow-hidden relative py-12 sm:py-16">
      {/* * Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-brand-orange/10 rounded-full blur-[128px] opacity-60" />
        <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bg-neutral-500/10 dark:bg-neutral-400/10 rounded-full blur-[128px] opacity-40" />
      </div>

      <div className="section-container w-full">
        <div className="max-w-2xl mx-auto text-center px-4">
          {/* * 404 Number */}
          <div className="mb-8">
            <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-bold text-neutral-900 dark:text-white leading-none">
              <span className="gradient-text">404</span>
            </h1>
          </div>

          {/* * Message */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-xl mx-auto leading-relaxed">
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
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              You might be looking for:
            </p>
            <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <Link
                href="/about"
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors"
              >
                About
              </Link>
              <Link
                href="/products"
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors"
              >
                Products
              </Link>
              <Link
                href="/contact"
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors"
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
