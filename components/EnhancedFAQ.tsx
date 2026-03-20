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
    {
      question: "Do I need an account to use Drop?",
      answer: "No. You can upload and share encrypted files without creating an account. However, a free Ciphera ID gives you access to additional features like download tracking, higher file size limits, and file management across all Ciphera services.",
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
      answer: "Your password is hashed client-side using PBKDF2 before being sent to our servers, where it's hashed again with Argon2id. This double-hashing approach means we never see your actual password — not during signup, login, or at any other point.",
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
    {
      question: "What is burn-after-download?",
      answer: "Burn-after-download automatically deletes a shared file from our servers after it has been downloaded once. This ensures sensitive files don't linger online and gives you full control over the lifecycle of your shared data.",
    },
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
