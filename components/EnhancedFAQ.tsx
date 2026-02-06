'use client'

import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { ChevronDownIcon } from '@ciphera-net/ui'
import { track } from '../lib/pulse'

// * Simple search icon component
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

const faqCategories = [
  {
    id: 'general',
    name: 'General',
    faqs: [
      {
        question: 'What is zero-knowledge encryption?',
        answer: 'Zero-knowledge encryption means your data is encrypted on your device before it reaches our servers. We cannot decrypt or access your files, even if we wanted to. Only you hold the encryption keys, ensuring complete privacy.',
      },
      {
        question: 'Is Drop free to use?',
        answer: 'Yes, Drop is completely free with secure file sharing up to 5GB per file. No credit card required, no hidden fees. Simply upload your encrypted files and share securely.',
      },
      {
        question: 'Is Ciphera GDPR compliant?',
        answer: 'Yes. Ciphera is built with privacy-by-design principles and is fully GDPR compliant. We collect minimal data, encrypt everything, and you maintain full control over your information.',
      },
    ],
  },
  {
    id: 'security',
    name: 'Security',
    faqs: [
      {
        question: 'How secure is end-to-end encryption?',
        answer: 'End-to-end encryption uses AES-256-GCM, the same military-grade encryption used by governments worldwide. Your files are encrypted before leaving your device, making interception impossible without your private keys.',
      },
      {
        question: 'Can you access my files?',
        answer: 'No. With zero-knowledge architecture, we mathematically cannot access your files. Encryption happens client-side on your device, and only you have the decryption keys. Not even our servers can read your data.',
      },
      {
        question: 'What happens if I lose my encryption key?',
        answer: 'Since we use zero-knowledge encryption, we cannot recover your files if you lose your encryption key. This is by design—it ensures that only you have access to your data. We recommend securely storing your keys.',
      },
    ],
  },
  {
    id: 'features',
    name: 'Features',
    faqs: [
      {
        question: 'What file types can I share securely?',
        answer: 'You can securely share any file type with Drop: documents, images, videos, archives, and more. All files are encrypted regardless of format, with support for files up to 5GB.',
      },
      {
        question: 'Can I set expiration dates on shared files?',
        answer: 'Yes! Drop supports expiring links, allowing you to set custom expiration dates for shared files. Files automatically become inaccessible after the expiration time.',
      },
      {
        question: 'Do you support password-protected shares?',
        answer: 'Yes. You can add an additional layer of security by password-protecting your file shares. Recipients must enter the correct password to access the encrypted file.',
      },
    ],
  },
  {
    id: 'technical',
    name: 'Technical',
    faqs: [
      {
        question: 'Which encryption algorithm do you use?',
        answer: 'We use AES-256-GCM (Galois/Counter Mode) for file encryption. This authenticated encryption algorithm provides both confidentiality and integrity, ensuring your data cannot be read or tampered with.',
      },
      {
        question: 'Where are the servers located?',
        answer: 'All Ciphera services run on Swiss infrastructure. Your data benefits from Swiss data protection laws and stays in a privacy-respecting jurisdiction known for strong privacy regulations.',
      },
      {
        question: 'Is the code open source?',
        answer: 'Yes! Our code is open source and available on GitHub. We believe transparency builds trust. Anyone can audit our security implementations and verify our privacy claims.',
      },
    ],
  },
]

function FAQItem({ faq, index, categoryIndex }: { faq: { question: string; answer: string }; index: number; categoryIndex: number }) {
  const [isOpen, setIsOpen] = useState(categoryIndex === 0 && index === 0) // * First question open by default

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="border-b border-neutral-200 dark:border-neutral-800"
    >
      <button
        onClick={() => {
          if (!isOpen) track('faq_expand')
          setIsOpen(!isOpen)
        }}
        className="w-full py-6 flex items-center justify-between text-left hover:text-brand-orange transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${categoryIndex}-${index}`}
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
          id={`faq-answer-${categoryIndex}-${index}`}
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

export default function EnhancedFAQ() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // * Filter FAQs based on search and category
  const filteredCategories = useMemo(() => {
    let categories = faqCategories

    // * Filter by category
    if (selectedCategory) {
      categories = categories.filter((cat) => cat.id === selectedCategory)
    }

    // * Filter by search query
    if (searchQuery) {
      categories = categories
        .map((category) => ({
          ...category,
          faqs: category.faqs.filter(
            (faq) =>
              faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((category) => category.faqs.length > 0)
    }

    return categories
  }, [searchQuery, selectedCategory])

  // * Generate JSON-LD schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqCategories.flatMap((category) =>
      category.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      }))
    ),
  }

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
            className="text-center mb-12"
          >
            <span className="badge-primary mb-4 inline-flex">FAQ</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Find answers to common questions about Ciphera's privacy-first products and services.
            </p>
          </motion.div>

          {/* * Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  if (e.target.value) track('faq_search')
                }}
                placeholder="Search questions..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-orange transition-shadow"
              />
            </div>
          </motion.div>

          {/* * Category tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedCategory === null
                  ? 'bg-brand-orange text-white'
                  : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700'
              }`}
            >
              All
            </button>
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-brand-orange text-white'
                    : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>

          {/* * FAQ items */}
          <div className="max-w-3xl mx-auto">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category, categoryIndex) => (
                <div key={category.id} className="mb-8">
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                    {category.name}
                  </h3>
                  {category.faqs.map((faq, index) => (
                    <FAQItem
                      key={`${category.id}-${index}`}
                      faq={faq}
                      index={index}
                      categoryIndex={categoryIndex}
                    />
                  ))}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-neutral-600 dark:text-neutral-400">
                  No questions found matching "{searchQuery}"
                </p>
              </div>
            )}
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
              onClick={() => track('faq_contact_click')}
            >
              Contact us
            </a>
          </motion.div>
        </div>
      </section>
    </>
  )
}
