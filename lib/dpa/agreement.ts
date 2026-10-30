/**
 * The Data Processing Agreement's own words: how it applies, and Annexes I to IV (29-10-2026, PUL-37). The Clauses
 * themselves are the Commission's, word for word (standard-clauses.ts). Owner rulings: publish ours as drafted (26-10),
 * live now and in force 30 days later with an email to every account, liability under the Terms' cap, CCPA only (29-10).
 * Facts and sources: Public/docs/plans/29-10-2026-dpa-and-ccpa-terms-plan.md §3. Change the Annexes as the processing
 * changes (Clause 2(a) allows that); a new or replaced sub-processor needs 30 days' notice first (Clause 7.7(a)).
 */
import { subprocessors, type Subprocessor } from '@/lib/subprocessors'

export const DPA_PUBLISHED = '30 October 2026'
export const DPA_IN_FORCE = '29 November 2026'

export const PROCESSOR = {
  name: 'Ciphera BV',
  registration: 'KBO/BCE 1013.721.660',
  address: 'De Kleetlaan 2, 1831 Diegem, Belgium',
  contact: 'privacy@ciphera.net',
} as const

/** "How this agreement applies": read before the Clauses. Plain paragraphs. */
export const HOW_IT_APPLIES: string[] = [
  'This Data Processing Agreement applies when you use Pulse to process personal data of other people, such as the people who visit your website. You are the controller of that data and Ciphera BV is your processor. It is made of the European Commission’s standard contractual clauses for controllers and processors (Commission Implementing Decision (EU) 2021/915), set out below word for word with the choices they leave open, and Annexes I to IV, which describe our processing.',
  `It forms part of our Terms of Service (section 9.2) and takes effect on ${DPA_IN_FORCE}. You accept it when you accept the Terms, and no signature is needed: Article 28(9) of the GDPR allows the contract to be in electronic form. Until ${DPA_IN_FORCE}, it applies to you from the day you ask for it at privacy@ciphera.net.`,
  'If anything in our Terms contradicts these Clauses, the Clauses prevail (Clause 4). Liability under this agreement is subject to section 12 of the Terms, except where the law does not allow a limit.',
  'Where the California Consumer Privacy Act applies to you, section 9.3 of the Terms adds the terms it requires of a service provider.',
  'We update the Annexes when our processing changes. We tell you 30 days before we add or replace a sub-processor, and you can object (Clause 7.7(a)).',
]

/** Annex I: the parties. */
export const ANNEX_I = {
  controller: [
    'The customer: the person or organisation that holds the Pulse account, identified by the account’s details.',
    'Contact: the account’s owner, at the email address on the account.',
    'Activities: using Pulse to measure visits to its websites or apps.',
    'Role: controller.',
    'Signature and date: accepting the Terms of Service, on the day of acceptance or on the day this agreement takes effect, whichever is later.',
  ],
  processor: [
    `${PROCESSOR.name}, ${PROCESSOR.registration}, ${PROCESSOR.address}.`,
    `Contact: ${PROCESSOR.contact}.`,
    'Activities: providing Pulse, a web analytics service.',
    'Role: processor.',
    `Signature and date: publishing this agreement, which takes effect on ${DPA_IN_FORCE}.`,
  ],
}

/** Annex II: description of the processing (measured, plan §3 and §5b). */
export const ANNEX_II: { term: string; text: string }[] = [
  {
    term: 'Categories of data subjects',
    text: 'People who visit the controller’s websites or apps where the controller has installed the Pulse script or sends events to Pulse.',
  },
  {
    term: 'Categories of personal data',
    text: 'For each page view or event: the page’s path, keeping only the query parameters the controller allows (or no path at all, where the controller turns paths off), the referring address and campaign (UTM) parameters, the time, how long the page was visible and actively used, and how far it was scrolled; the country, and the region and city only where the controller turns them on, derived from the IP address when the request arrives (the IP address is not stored); device type, browser, operating system, screen size, language and timezone, as the browser reports them (the User-Agent string is not stored); event names, properties and revenue values the controller chooses to send; an identifier for the visit that is valid for one day of the site’s own calendar, a keyed hash of the site’s domain, the IP address and the User-Agent whose random key exists for that day only and is then deleted; and the results of automated-traffic detection (a classification of the browser software, of the network and of the secure connection, interaction signals, a score and a verdict).',
  },
  {
    term: 'Sensitive data',
    text: 'None is intended. The controller does not send special categories of personal data in event properties (Terms, section 9.3).',
  },
  {
    term: 'Nature of the processing',
    text: 'Receiving requests from visitors’ browsers through the content delivery network, deriving the data above, discarding the IP address and the User-Agent string, storing the events, counting them into statistics, showing them to the controller’s team, exporting them or sending reports as the controller sets up, and excluding automated traffic. Detection compares browser settings within one website only.',
  },
  {
    term: 'Purposes',
    text: 'Providing web analytics to the controller, excluding automated traffic from it, and keeping the service secure.',
  },
  {
    term: 'Duration',
    text: 'For as long as the controller uses Pulse. Events are kept for the retention period the controller sets for each site, six months for a new site unless changed, and then deleted. All of a site’s data is deleted when the site or the account is deleted. Deleted data leaves our backups within 90 days. Until then, we use backups only to restore the service and to test that restoring works.',
  },
  {
    term: 'Processing by sub-processors',
    text: 'The same subject matter, nature and duration, limited to the service each sub-processor provides (Annex IV).',
  },
]

/** Annex III: technical and organisational measures (plan §5c; only claims that hold for all they cover). */
export const ANNEX_III: { term: string; text: string }[] = [
  {
    term: 'Minimisation by design',
    text: 'No cookies and no browser storage for analytics. The IP address and the User-Agent string are used when a request arrives and never stored. The visit identifier lasts one day of the site’s calendar, and its key is then deleted. Region and city are off unless the controller turns them on.',
  },
  {
    term: 'Separation',
    text: 'Every query that serves a customer is limited to that customer’s site. Staging uses its own databases and credentials.',
  },
  {
    term: 'Encryption in transit',
    text: 'Every request to Pulse uses HTTPS. The secure connection ends at the content delivery network, which reaches our servers over a second secure connection that checks our certificate.',
  },
  {
    term: 'Access control',
    text: 'Staff reach production only through an access gateway with multi-factor authentication and certificates that expire after twelve hours, and only staff who need it have that access. Secrets are kept in a dedicated secrets manager, not in code.',
  },
  {
    term: 'Availability and recovery',
    text: 'Backups every day, with a second copy in another data centre, and restore tests every month.',
  },
  {
    term: 'Monitoring',
    text: 'Availability, backup and security alerts, with checks from inside our cluster and from a separate server outside it.',
  },
  {
    term: 'Personal data breaches',
    text: 'We tell the controller without undue delay, with the information Clause 9.2 lists, at the email address on the account.',
  },
  {
    term: 'Requests from data subjects',
    text: 'We pass on any request that reaches us and help the controller answer it (Clause 8). Pulse holds no name or contact detail of a visitor, so a request can only be matched where the controller can point to a site and a time.',
  },
  {
    term: 'Vulnerability reports',
    text: 'Our disclosure policy and security.txt on ciphera.net.',
  },
]

/** Annex IV: the sub-processors that process the controller's personal data, from the one list Privacy renders. */
const ANNEX_IV_SERVICES = ['Infomaniak', 'Exoscale', 'Bunny'] as const

export const ANNEX_IV: Subprocessor[] = ANNEX_IV_SERVICES.map((name) => {
  const row = subprocessors.find((s) => s.service === name)
  if (!row) throw new Error(`Annex IV names ${name}, which lib/subprocessors.ts no longer lists`)
  return row
})

/**
 * Terms 9.3: the CCPA's service-provider terms, one per item (draft (c) of the 25-10 investigation, put through the
 * house rules). Each maps to Civ. Code §1798.140(ag)(1)(A)–(D) and §1798.100(d)(1)–(5), and the Regulations §7051(a)(1)–(9)
 * and (b): Pulse/docs/data/25-10-2026-privacy-hardening-investigation/legal.md (b).
 */
export const CCPA_TERMS: string[] = [
  'You give us this information only so we can provide Pulse: counting and reporting visits, storing and showing them, exporting or sending them as you set up, excluding automated traffic, keeping Pulse secure, fixing errors, and answering your support requests.',
  'We do not sell or share it (as the CCPA defines those words). We do not keep, use or disclose it for any other purpose, another commercial purpose included, or outside our direct business relationship with you. We do not combine it with personal information from other customers or from our own contact with a visitor, except where the CCPA allows it, such as detecting security incidents or fraud.',
  'We follow the CCPA’s rules for service providers, give the information the same level of privacy protection the CCPA requires of you, and keep it secure.',
  'You may take reasonable and appropriate steps to check how we use it, including an audit once a year. If we decide we can no longer meet our obligations under the CCPA, we tell you, and you may then take reasonable and appropriate steps to stop and remedy any unauthorized use.',
  'We pass on or redirect any request from a visitor that reaches us, and we act on the requests you tell us about.',
  'We tell you before we add or replace a subcontractor, and a written contract binds each one to these terms.',
  'You decide what Pulse collects, you give your visitors the notices the law requires, and you do not send us sensitive personal information in event properties.',
]

