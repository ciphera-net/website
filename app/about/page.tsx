import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About - Ciphera',
  description: 'Learn about Ciphera\'s mission, values, and commitment to privacy-first technology.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-12 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6">
            About Ciphera
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Building the future of privacy-first technology
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Ciphera is dedicated to creating privacy-first infrastructure and applications that put users in control of their data. 
              We believe that privacy is a fundamental right, not a premium feature. Our platform is built on zero-knowledge principles, 
              ensuring that even service providers cannot access user data.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              Our Values
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                  Privacy by Design
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Every component of the Ciphera platform is designed with privacy as the foundation. We use end-to-end encryption, 
                  zero-knowledge architecture, and minimal data collection to protect user privacy.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                  Transparency
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  We believe in open-source principles and transparency. Many of our components are open-source, allowing the community 
                  to verify our security claims and contribute to the platform.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                  User Control
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Users should have complete control over their data. Our platform supports self-hosting options, giving users the 
                  freedom to deploy on their own infrastructure.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              Technology Stack
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              Ciphera is built using modern, secure technologies:
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400">
              <li><strong className="text-neutral-900 dark:text-white">Go (Gin)</strong> - High-performance backend services</li>
              <li><strong className="text-neutral-900 dark:text-white">Next.js</strong> - Modern React framework for frontends</li>
              <li><strong className="text-neutral-900 dark:text-white">PostgreSQL</strong> - Reliable database for metadata</li>
              <li><strong className="text-neutral-900 dark:text-white">AES-256-GCM</strong> - Industry-standard encryption</li>
              <li><strong className="text-neutral-900 dark:text-white">JWT</strong> - Stateless authentication</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              Architecture
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Ciphera follows a microservices architecture with strict separation of concerns. Identity management (Ciphera Auth), 
              application logic (Drop Backend), storage (Ciphera Relay), and bot protection (Ciphera Captcha) are isolated services 
              that work together seamlessly while maintaining security boundaries.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
