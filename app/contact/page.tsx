import { ContactPage } from '@/components/overhaul/contact/ContactPage'

/**
 * Contact (the overhaul, 18-10-2026): outline A (D34) as ruled (D35, D36): the email addresses A (lit cards), the form B
 * (the wide card, sending to website-backend as before: components/overhaul/contact/ContactForm.tsx), the office D (the
 * ledger with the office photo). The page carries its ContactPage and BreadcrumbList data.
 */
export default function Page() {
  return <ContactPage picks={{ write: 'a', form: 'b', office: 'd' }} />
}
