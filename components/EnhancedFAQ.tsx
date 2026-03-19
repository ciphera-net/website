'use client'

import { FAQ } from '@/components/ui/faq-tabs'

const categories: Record<string, string> = {
  general: "General",
  security: "Security",
  features: "Features",
  technical: "Technical",
};

const faqData: Record<string, { question: string; answer: string }[]> = {
  general: [
    {
      question: "What is zero-knowledge encryption?",
      answer: "Zero-knowledge encryption means your data is encrypted on your device before it reaches our servers. We cannot decrypt or access your files, even if we wanted to. Only you hold the encryption keys, ensuring complete privacy.",
    },
    {
      question: "Is Drop free to use?",
      answer: "Yes, Drop is completely free with secure file sharing up to 5GB per file. No credit card required, no hidden fees. Simply upload your encrypted files and share securely.",
    },
    {
      question: "Is Ciphera GDPR compliant?",
      answer: "Yes. Ciphera is built with privacy-by-design principles and is fully GDPR compliant. We collect minimal data, encrypt everything, and you maintain full control over your information.",
    },
  ],
  security: [
    {
      question: "How secure is end-to-end encryption?",
      answer: "End-to-end encryption uses AES-256-GCM, the same military-grade encryption used by governments worldwide. Your files are encrypted before leaving your device, making interception impossible without your private keys.",
    },
    {
      question: "Can you access my files?",
      answer: "No. With zero-knowledge architecture, we mathematically cannot access your files. Encryption happens client-side on your device, and only you have the decryption keys. Not even our servers can read your data.",
    },
    {
      question: "What happens if I lose my encryption key?",
      answer: "Since we use zero-knowledge encryption, we cannot recover your files if you lose your encryption key. This is by design — it ensures that only you have access to your data. We recommend securely storing your keys.",
    },
  ],
  features: [
    {
      question: "What file types can I share securely?",
      answer: "You can securely share any file type with Drop: documents, images, videos, archives, and more. All files are encrypted regardless of format, with support for files up to 5GB.",
    },
    {
      question: "Can I set expiration dates on shared files?",
      answer: "Yes! Drop supports expiring links, allowing you to set custom expiration dates for shared files. Files automatically become inaccessible after the expiration time.",
    },
    {
      question: "Do you support password-protected shares?",
      answer: "Yes. You can add an additional layer of security by password-protecting your file shares. Recipients must enter the correct password to access the encrypted file.",
    },
  ],
  technical: [
    {
      question: "Which encryption algorithm do you use?",
      answer: "We use AES-256-GCM (Galois/Counter Mode) for file encryption. This authenticated encryption algorithm provides both confidentiality and integrity, ensuring your data cannot be read or tampered with.",
    },
    {
      question: "Where are the servers located?",
      answer: "All Ciphera services run on Swiss infrastructure. Your data benefits from Swiss data protection laws and stays in a privacy-respecting jurisdiction known for strong privacy regulations.",
    },
    {
      question: "Is the code open source?",
      answer: "Yes! Our code is open source and available on GitHub. We believe transparency builds trust. Anyone can audit our security implementations and verify our privacy claims.",
    },
  ],
};

export default function EnhancedFAQ() {
  return (
    <FAQ
      title="Frequently Asked Questions"
      subtitle="Find answers to common questions"
      categories={categories}
      faqData={faqData}
    />
  );
}
