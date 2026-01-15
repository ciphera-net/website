import { Metadata } from 'next'
import ContactForm from '../../components/ContactForm'
import { EnvelopeClosedIcon, MobileIcon, HomeIcon } from '@radix-ui/react-icons'

export const metadata: Metadata = {
  title: 'Contact - Ciphera',
  description: 'Get in touch with the Ciphera team. Where Privacy Still Exists.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-12 pb-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto font-medium">
            Where Privacy Still Exists. Have questions about our ecosystem or want to report a security issue? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* * Contact Information */}
          <div className="order-1 space-y-8">
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-lg shadow-neutral-200/50 dark:shadow-black/50 border border-neutral-200 dark:border-neutral-800">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
                Contact Information
              </h2>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/50 shadow-sm">
                    <EnvelopeClosedIcon className="w-6 h-6 text-neutral-900 dark:text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-1">Email</p>
                    <p className="text-lg font-medium text-neutral-900 dark:text-white">hello@ciphera.net</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/50 shadow-sm">
                    <MobileIcon className="w-6 h-6 text-neutral-900 dark:text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-lg font-medium text-neutral-900 dark:text-white">+32 078 480 710</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/50 shadow-sm">
                    <HomeIcon className="w-6 h-6 text-neutral-900 dark:text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-1">Address</p>
                    <p className="text-lg font-medium text-neutral-900 dark:text-white leading-relaxed">
                      The Antwerp Tower<br />
                      Frankrijklei 5/401<br />
                      2000 Antwerp
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* * Contact Form */}
          <div className="order-2 lg:mt-0">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
