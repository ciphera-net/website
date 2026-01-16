'use client'

import { ArrowLeftIcon } from '@radix-ui/react-icons'

export function BackButton() {
  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/'
    }
  }

  return (
    <button
      onClick={handleBack}
      className="btn-secondary inline-flex items-center gap-2"
    >
      <ArrowLeftIcon className="w-5 h-5" />
      Go Back
    </button>
  )
}
