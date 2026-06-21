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
      question: "Is Ciphera GDPR compliant?",
      answer: "Yes. Ciphera is built with privacy-by-design principles and is fully GDPR compliant. We collect minimal data, encrypt everything, and you maintain full control over your information.",
    },
    {
      question: "How is Ciphera different from Google Drive or Dropbox?",
      answer: "Unlike traditional cloud storage, Ciphera encrypts your files on your device before upload. We never have access to your data. There's no data mining, no ad targeting, and no third-party access. Privacy isn't a feature we added — it's the foundation.",
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
    {
      question: "Has Ciphera been independently audited?",
      answer: "Our code is open source, allowing anyone to audit our security implementations. We also conduct regular internal security reviews and penetration testing. All cryptographic implementations use well-established, peer-reviewed libraries.",
    },
    {
      question: "How does Ciphera handle password storage?",
      answer: "Your password never leaves your device. We use OPAQUE (RFC 9807), a password-authenticated key exchange: your password is stretched on your device with Argon2id and proven to our servers without ever being sent. We store only an opaque credential record, so we never see your actual password — not during signup, login, or at any other point.",
    },
  ],
  features: [
    {
      question: "Does Pulse use cookies to track visitors?",
      answer: "No. Pulse is our privacy-first analytics tool that works without cookies, fingerprinting, or any form of personal data collection. It gives you meaningful insights like page views, referrers, and visitor counts while being fully GDPR compliant out of the box.",
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
    {
      question: "What happens to my data if Ciphera shuts down?",
      answer: "Since your files are encrypted client-side, they remain encrypted and inaccessible on our servers regardless of what happens to the company. Active files can be downloaded by their owners at any time. We'd provide ample notice and migration tools in any shutdown scenario.",
    },
    {
      question: "Can I self-host Ciphera services?",
      answer: "Since our code is open source, you can inspect and run it yourself. However, we don't currently offer official self-hosting documentation or support. Our managed infrastructure ensures you get automatic updates, security patches, and Swiss data residency.",
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
