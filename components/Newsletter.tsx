'use client'

import { NewsletterSection } from '@/components/ui/newsletter-section'
import { track } from '@/lib/pulse'

async function handleSubscribe(email: string) {
  track('newsletter_signup_attempt')

  // TODO: replace with actual newsletter API
  await new Promise(resolve => setTimeout(resolve, 1000))

  track('newsletter_signup_success')
  return { success: true }
}

export default function Newsletter() {
  return (
    <NewsletterSection
      title="New article every week. No spam, no tracking — obviously."
      onSubscribe={handleSubscribe}
    />
  )
}
