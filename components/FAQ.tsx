'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronDownIcon } from '@ciphera-net/ui'

const faqs = [
  {
    question: 'What is zero-knowledge encryption?',
    answer: 'Zero-knowledge encryption means your data is encrypted on your device before it reaches our servers. We cannot decrypt or access your files, even if we wanted to. Only you hold the encryption keys, ensuring complete privacy.',
  },
  {
    question: 'Is Drop free to use?',
    answer: 'Yes, Drop is completely free with secure file sharing up to 5GB per file. No credit card required, no hidden fees. Simply upload your encrypted files and share securely.',
  },
  {
    question: 'How secure is end-to-end encryption?',
    answer: 'End-to-end encryption uses AES-256-GCM, the same military-grade encryption used by governments worldwide. Your files are encrypted before leaving your device, making interception impossible without your private keys.',
  },
  {
    question: 'Can you access my files?',
    answer: 'No. With zero-knowledge architecture, we mathematically cannot access your files. Encryption happens client-side on your device, and only you have the decryption keys. Not even our servers can read your data.',
  },
  {
    question: 'Is Ciphera GDPR compliant?',
    answer: 'Yes. Ciphera is built with privacy-by-design principles and is fully GDPR compliant. We collect minimal data, encrypt everything, and you maintain full control over your information.',
  },
  {
    question: 'What file types can I share securely?',
    answer: 'You can securely share any file type with Drop: documents, images, videos, archives, and more. All files are encrypted regardless of format, with support for files up to 5GB.',
  },
]

// * JSON-LD FAQ Schema for rich snippets
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="border-b border-neutral-200 dark:border-neutral-800"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-brand-orange transition-colors"
      >
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white pr-4">
          {faq.question}
        </h3>
        <ChevronDownIcon
          className={`w-5 h-5 text-neutral-500 shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="pb-6"
        >
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {faq.answer}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default function FAQ() {
  return (
    <>
      {/* * JSON-LD FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <section className="section-padding bg-neutral-50 dark:bg-neutral-900/50">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="badge-primary mb-4 inline-flex">FAQ</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
              Frequently asked questions
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Learn more about zero-knowledge encryption, file security, and how Ciphera protects your privacy.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <FAQItem key={index} faq={faq} index={index} />
            ))}
          </div>

          {/* * CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-12"
          >
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Still have questions?
            </p>
            <a
              href="/contact"
              className="btn-secondary inline-flex"
            >
              Contact us
            </a>
          </motion.div>
        </div>
      </section>
    </>
  )
}
