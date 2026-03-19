'use client'

import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { ChevronDownIcon } from '@ciphera-net/ui'
import { track } from '../lib/pulse'

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
      className="border-b border-neutral-800"
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
        <h3 className="heading-3 pr-4">
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
          <p className="text-neutral-400 leading-relaxed">
            {faq.answer}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default function EnhancedFAQ() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // * Filter FAQs based on category
  const filteredCategories = useMemo(() => {
    if (selectedCategory) {
      return faqCategories.filter((cat) => cat.id === selectedCategory)
    }
    return faqCategories
  }, [selectedCategory])

  return (
    <>

      <section className="section-padding">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="badge-primary mb-4 inline-flex">FAQ</span>
            <h2 className="heading-2 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Find answers to common questions about Ciphera's privacy-first products and services.
            </p>
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
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-300 hover:bg-neutral-700'
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
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-300 hover:bg-neutral-700'
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
                  <h3 className="heading-3 mb-4">
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
                <p className="text-neutral-400">
                  No questions found for this category.
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
            <p className="text-neutral-400 mb-4">
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
