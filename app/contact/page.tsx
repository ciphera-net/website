import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact - Ciphera',
  description: 'Get in touch with the Ciphera team.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400">
            Have questions or want to learn more? We'd love to hear from you.
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-8 md:p-12 rounded-3xl shadow-lg shadow-neutral-200/50 dark:shadow-black/50 border border-neutral-200 dark:border-neutral-800">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                General Inquiries
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                For general questions about Ciphera, our products, or privacy-related inquiries, please reach out through our official channels.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                Security Issues
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                If you've discovered a security vulnerability, please report it responsibly. We take security seriously and will work with you to address any issues.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                Open Source Contributions
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Many components of the Ciphera platform are open source. Check out our GitHub repositories to contribute, report issues, or submit pull requests.
              </p>
            </div>

            <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800">
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                For the most up-to-date contact information, please visit our GitHub organization or check the documentation for specific products.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
