/**
 * The words the folded legal pages add around the policy and the terms (D51, 18-10-2026; words approved in the wording
 * round, W9b): each page's lead under its title, and one line per section, shown on the closed row. Keyed by section id,
 * which is also the section's anchor (/privacy#your-rights-under-gdpr-and-fadp), so a page cannot render a section
 * without its line.
 */

export const PRIVACY = {
  LEAD: 'How Ciphera handles personal data on this website and in our services.',
  SUMMARIES: {
    'our-commitment-to-privacy': 'Our approach to privacy, and how this policy relates to our terms.',
    'legal-framework': 'Who we are in law, and which laws this policy follows.',
    'data-controller': 'Who is responsible for your data, and how to reach us about privacy.',
    'data-we-collect': 'What each of our services collects, service by service.',
    'data-we-do-not-collect': 'What we do not collect, and the practices we do not use.',
    'ip-address-policy': 'How our servers handle IP addresses.',
    'cookies-and-local-storage': 'The cookies and browser storage our sites and apps use, and for how long.',
    'encryption-and-security-measures': 'How we encrypt and protect your data.',
    'data-storage-and-retention': 'Where your data is stored, and how long we keep each kind.',
    'legal-bases-for-processing': 'The legal grounds for each kind of processing.',
    'third-party-services-and-data-processors': 'The outside services we use, and what each one may process.',
    'international-data-transfers': 'When data may leave Switzerland and the EEA, and on what terms.',
    'open-source-and-transparency': 'Which of our software is open source, and where to find it.',
    'data-disclosure-and-law-enforcement': 'How we answer when authorities ask for user data.',
    'childrens-privacy': "Children's data, and what to do if a child has given us theirs.",
    'automated-decision-making': 'The automated checks our services run.',
    'data-breach-notification': 'What we do if a breach affects personal data.',
    'your-rights-under-gdpr-and-fadp': 'Your rights over your data, and how to use them.',
    'social-media-and-external-links': 'Links to other websites, and whose policy applies there.',
    'changes-to-this-policy': 'How we change this policy, and how we tell you.',
    'contact-us': 'How to reach us about privacy.',
  },
} as const

export const TERMS = {
  LEAD: 'The agreement between you and Ciphera BV when you use our services.',
  SUMMARIES: {
    'acceptance-of-terms': 'What these terms cover, and who they are between.',
    'eligibility': 'Who can use our services.',
    'description-of-services': 'The services these terms cover.',
    'user-accounts': 'Creating your account and keeping it secure.',
    'acceptable-use': 'What you may not use our services for, and how to report illegal content.',
    'encryption-and-zero-knowledge-architecture': 'What our encryption design means for you and your data.',
    'service-specific-terms': 'Terms that apply to each service.',
    'intellectual-property': 'Our trademarks, our open-source software, and your content.',
    'privacy': 'How our privacy policy applies, our role when you use Pulse on your site, and California.',
    'service-availability': 'When our services may be unavailable.',
    'disclaimer-of-warranties': 'What we do not guarantee.',
    'limitation-of-liability': 'The limits of our liability.',
    'indemnification': 'When you cover claims made against us.',
    'termination': 'How you or we can end your use of the services, and what happens then.',
    'modifications-to-these-terms': 'How we change these terms, and how we tell you.',
    'force-majeure': 'Events beyond our control.',
    'governing-law-and-jurisdiction': 'Which law applies, and where disputes are heard.',
    'severability': 'What happens if a court strikes out part of these terms.',
    'assignment': 'Transferring these terms to someone else.',
    'entire-agreement': 'What makes up the whole agreement between us.',
    'contact': 'How to reach us about these terms.',
  },
} as const

export type PrivacySectionId = keyof typeof PRIVACY.SUMMARIES
export type TermsSectionId = keyof typeof TERMS.SUMMARIES

/** The processing agreement (/dpa, 29-10-2026, PUL-37): its lead and one line per row, keyed by row id. */
export const DPA = {
  LEAD: 'How we process personal data for you when you use Pulse, and what we promise about it.',
  SUMMARIES: {
    'how-this-agreement-applies': 'What this agreement is, when it takes effect, and how it relates to our terms.',
    'clause-1': 'What the Clauses are for, and what they cover.',
    'clause-2': 'The Clauses cannot be changed, only completed.',
    'clause-3': 'The Clauses are read with the GDPR’s own definitions.',
    'clause-4': 'The Clauses prevail over any other agreement between us.',
    'clause-5': 'The optional docking clause, which we do not use.',
    'clause-6': 'Where the processing is described.',
    'clause-7': 'Our duties: instructions, security, sub-processors and transfers.',
    'clause-8': 'How we help you answer requests and meet your duties.',
    'clause-9': 'What we do if a personal data breach happens.',
    'clause-10': 'Suspending or ending the processing, and what happens to the data.',
    'annex-i': 'Who the parties are.',
    'annex-ii': 'What data we process for you, why, and for how long.',
    'annex-iii': 'How we protect it.',
    'annex-iv': 'The companies that help us provide Pulse.',
  },
} as const

export type DpaSectionId = keyof typeof DPA.SUMMARIES

