import type { GlossaryTerm } from './types'

/** Privacy & regulation terms. */
export const privacyTerms: GlossaryTerm[] = [
  {
    slug: 'gdpr',
    term: 'GDPR',
    category: 'Privacy & regulation',
    short:
      'The GDPR (General Data Protection Regulation, EU 2016/679) is the European Union’s data protection law, in force since 25 May 2018, governing how personal data of people in the EU/EEA is collected, processed, and transferred.',
    paragraphs: [
      'The GDPR applies to any organization that processes the personal data of people in the EU/EEA, regardless of where the organization itself is based — a US or Swiss company with EU users is in scope. It sets out principles (lawfulness, purpose limitation, data minimization, storage limitation), a set of legal bases for processing (consent, contract, legitimate interest, and others), and individual rights including access, rectification, erasure, portability, and objection.',
      'Organizations that determine why and how data is processed are data controllers; those processing on a controller’s behalf are data processors, and the regulation requires a data processing agreement between them. Cross-border transfers outside the EU/EEA need a safeguard — an adequacy decision, standard contractual clauses, or a certified framework such as the EU-US Data Privacy Framework. Fines can reach 4% of global annual turnover or €20 million, whichever is higher.',
      'Ciphera processes personal data under GDPR for EU/EEA users and stores it on Swiss infrastructure (Exoscale, Zurich), which the European Commission recognizes as offering adequate protection — so no additional transfer mechanism is needed for that flow.',
    ],
    related: ['data-controller', 'data-processor', 'data-processing-agreement', 'standard-contractual-clauses', 'personal-data'],
    see: [
      { label: 'EUR-Lex — Regulation (EU) 2016/679 (GDPR)', href: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj' },
      { label: 'Ciphera privacy policy', href: '/privacy' },
    ],
  },
  {
    slug: 'fadp',
    term: 'FADP / nFADP',
    category: 'Privacy & regulation',
    short:
      'The FADP (Federal Act on Data Protection) is Switzerland’s national data protection law; its fully revised version (nFADP) took effect 1 September 2023, modernizing Swiss law to align closely — though not identically — with the GDPR.',
    paragraphs: [
      'Switzerland is not an EU member state, so the GDPR does not apply there directly; the FADP is the domestic statute that plays the equivalent role, enforced by the Federal Data Protection and Information Commissioner (FDPIC). The original FADP dated to 1992. The revised version, adopted by the Swiss Parliament in 2020 and brought into force on 1 September 2023, is what’s meant by nFADP — the "n" for "new" is a common shorthand rather than part of the law’s official name.',
      'The revision brought Swiss law closer to the GDPR in structure: it introduced explicit data protection impact assessments for high-risk processing, a breach-notification duty to the FDPIC, an expanded definition of sensitive personal data (adding genetic and biometric data), privacy-by-design and privacy-by-default obligations, and criminal liability provisions for individuals rather than only companies. It also formalizes the requirement for a representative in Switzerland for foreign controllers processing Swiss residents’ data under certain conditions.',
      'Notable differences from the GDPR remain. The nFADP does not include a direct equivalent to the GDPR’s 4%-of-turnover administrative fines — Swiss sanctions instead target responsible individuals with criminal fines up to CHF 250,000 for willful violations of specific duties. The nFADP also has no general "legitimate interest" balancing test framed the same way, and its territorial scope, while extraterritorial in effect (it applies wherever processing affects people in Switzerland), is drawn slightly differently than Article 3 GDPR. The European Commission has recognized Switzerland as providing an adequate level of protection for data transfers from the EU/EEA, a status that predates the revision and continues to hold.',
      'Ciphera BV is a Belgian company, but Ciphera’s infrastructure runs on Exoscale in Zurich (availability zone CH-DK-2) specifically to keep data under Swiss jurisdiction and the nFADP’s protections — a data residency choice independent of where the company itself is incorporated.',
    ],
    related: ['gdpr', 'data-residency', 'data-sovereignty', 'data-controller', 'personal-data'],
    see: [
      { label: 'Fedlex — Federal Act on Data Protection (FADP)', href: 'https://www.fedlex.admin.ch/eli/cc/2022/491/en' },
      { label: 'admin.ch — FDPIC', href: 'https://www.edoeb.admin.ch/en' },
      { label: 'Ciphera privacy policy', href: '/privacy' },
    ],
    faq: [
      {
        q: 'How does the FADP differ from the GDPR?',
        a: 'The nFADP shares the GDPR’s general structure — lawful processing, data subject rights, breach notification, privacy by design — but its sanctions fall on responsible individuals as criminal fines (up to CHF 250,000) rather than the GDPR’s administrative fines of up to 4% of global turnover on the company. Its legal-basis framework and territorial-scope wording also differ in detail, and it does not carry a direct GDPR-style "legitimate interest" balancing article by the same name.',
      },
      {
        q: 'Who does the FADP apply to?',
        a: 'It applies to private individuals and companies, as well as federal government bodies, that process the personal data of natural persons in a way that affects people in Switzerland — including foreign organizations processing Swiss residents’ data, similar in effect to the GDPR’s extraterritorial reach.',
      },
      {
        q: 'What changed in the 2023 revision?',
        a: 'The revised FADP (in force 1 September 2023) added mandatory data protection impact assessments for high-risk processing, a duty to notify the FDPIC of data breaches, an expanded category of sensitive personal data including genetic and biometric data, explicit privacy-by-design and privacy-by-default obligations, a requirement for a Swiss representative for certain foreign controllers, and criminal — rather than purely administrative — liability for individuals who willfully violate specific duties.',
      },
    ],
  },
  {
    slug: 'eprivacy-directive',
    term: 'ePrivacy Directive',
    category: 'Privacy & regulation',
    short:
      'The ePrivacy Directive (2002/58/EC, amended 2009) is the EU law governing confidentiality of electronic communications, including the cookie-consent rule: storing or reading anything on a user’s device requires prior consent unless it is strictly necessary.',
    paragraphs: [
      'Where the GDPR sets general rules for personal data, the ePrivacy Directive is a more specific, older instrument (first adopted 2002, amended by the 2009 "Cookie Directive" amendment) covering electronic communications: cookies and similar device storage, unsolicited marketing communications, and confidentiality of traffic and location data from telecom and online services. Its cookie provision, Article 5(3), is the actual legal basis for the consent banners seen across the web — not the GDPR itself, which is a common misconception.',
      'The rule is technology-neutral: it covers cookies, local storage, device fingerprinting, and any similar technique used to store or access information on a user’s terminal equipment. An exemption exists for storage that is strictly necessary to provide a service the user requested (a session cookie for a shopping cart, for instance) or for the sole purpose of carrying out the transmission — analytics and advertising cookies do not qualify, which is why they trigger a consent banner.',
      'A long-planned ePrivacy Regulation intended to replace the Directive and align its enforcement with the GDPR has been in negotiation for years without adoption, so the 2002/2009 Directive, as implemented into each member state’s national law, remains the operative rule. Ciphera’s own site uses Pulse, which does not set cookies or store anything on your device, so no consent banner is needed under Article 5(3)’s strictly-necessary logic — that Article turns on storing or accessing information on terminal equipment, which Pulse does not do.',
    ],
    related: ['consent-banner', 'gdpr', 'personal-data'],
    see: [
      { label: 'EUR-Lex — Directive 2002/58/EC (ePrivacy)', href: 'https://eur-lex.europa.eu/eli/dir/2002/58/oj' },
      { label: 'Pulse — cookieless analytics', href: '/products/pulse' },
    ],
  },
  {
    slug: 'consent-banner',
    term: 'Consent banner',
    category: 'Privacy & regulation',
    short:
      'A consent banner is the on-page prompt asking a visitor to accept or decline non-essential cookies and tracking, required under the EU ePrivacy Directive whenever a site stores or reads anything on the visitor’s device that isn’t strictly necessary.',
    paragraphs: [
      'The legal trigger for a consent banner isn’t the GDPR directly — it’s Article 5(3) of the ePrivacy Directive, which requires prior, informed consent before storing or accessing information on a user’s device, with an exception for storage strictly necessary to deliver a service the user asked for. Analytics cookies, advertising pixels, and cross-site tracking identifiers don’t fall under that exception, so a site using them needs a valid consent mechanism before those scripts fire — not just a banner that displays but one that actually blocks the tracking until consent is given.',
      'Regulators across the EU have increasingly penalized "dark pattern" banners — an obvious "Accept" button paired with a buried or multi-click "Reject" — treating that asymmetry as invalid consent under GDPR’s requirement that consent be freely given and as easy to withdraw as to give. A compliant banner needs equally prominent accept and reject options, granular choices by purpose, and no pre-ticked boxes.',
      'The banner itself is a symptom of a technical choice, not a legal requirement in isolation: a site that doesn’t use cookies or persistent identifiers for tracking has nothing to gate consent on. Ciphera’s own site runs Pulse for analytics, which identifies sessions without cookies or device storage, so ciphera.net does not show a cookie consent banner.',
    ],
    related: ['eprivacy-directive', 'gdpr', 'personal-data'],
    see: [{ label: 'Pulse — cookieless analytics', href: '/products/pulse' }],
  },
  {
    slug: 'data-processing-agreement',
    term: 'DPA (data processing agreement)',
    category: 'Privacy & regulation',
    short:
      'A data processing agreement (DPA) is the contract required by GDPR Article 28 between a data controller and a data processor, setting out the scope, purpose, and security obligations governing the processor’s handling of personal data on the controller’s behalf.',
    paragraphs: [
      'Whenever a controller hands personal data to another organization to process on its behalf — a hosting provider, an email-delivery service, an analytics vendor that processes identifiable data — GDPR Article 28 requires a written contract, not just a verbal understanding or a line in a terms-of-service page. The DPA has to specify the subject matter and duration of processing, its nature and purpose, the categories of data and data subjects involved, and the controller’s and processor’s respective obligations.',
      'Substantively, a compliant DPA commits the processor to act only on the controller’s documented instructions, to impose confidentiality on anyone processing the data, to implement appropriate technical and organizational security measures, to assist the controller with data-subject rights requests and breach notifications, to delete or return data at the end of the engagement, and to flow the same obligations down to any sub-processor it engages — which is why sub-processor lists and consent mechanisms appear as DPA annexes.',
      'A DPA is a contractual layer, distinct from a transfer mechanism like standard contractual clauses: a DPA governs the relationship and duties between controller and processor, while SCCs (when needed) govern the legal basis for moving data across a border. The two often accompany each other in the same document set when a processor is outside the EU/EEA.',
    ],
    related: ['data-controller', 'data-processor', 'sub-processor', 'standard-contractual-clauses', 'gdpr'],
    see: [{ label: 'EUR-Lex — GDPR Article 28', href: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj' }],
  },
  {
    slug: 'sub-processor',
    term: 'Sub-processor',
    category: 'Privacy & regulation',
    short:
      'A sub-processor is a third party a data processor engages to help process personal data on a controller’s behalf — a cloud host, for example. GDPR requires the controller’s prior authorization and a flow-down contract.',
    paragraphs: [
      'Processors rarely operate in isolation: a SaaS vendor acting as processor for its customer (the controller) typically relies on infrastructure providers, backup services, or specialized tooling that also touch personal data. Each of those is a sub-processor, and GDPR Article 28(2) and 28(4) require the primary processor to obtain either specific or general written authorization from the controller before engaging one, and to bind the sub-processor to data-protection obligations at least as protective as those in the original DPA.',
      'Where general authorization is used — common in SaaS contracts — the processor must give the controller a mechanism to object to new sub-processors, usually via advance notice and a published, kept-current list. This is why many vendors maintain a public sub-processor page: it satisfies the transparency obligation without requiring bespoke sign-off for every new one.',
      'Liability doesn’t evaporate down the chain — the primary processor remains responsible to the controller for a sub-processor’s compliance, which is why the flow-down contractual terms matter as much as the notification process itself.',
    ],
    related: ['data-processing-agreement', 'data-processor', 'data-controller', 'standard-contractual-clauses'],
  },
  {
    slug: 'standard-contractual-clauses',
    term: 'SCCs (standard contractual clauses)',
    category: 'Privacy & regulation',
    short:
      'Standard contractual clauses (SCCs) are European Commission-approved contract templates that legalize personal-data transfers from the EU/EEA to countries without an adequacy decision by extending GDPR-equivalent protections.',
    paragraphs: [
      'GDPR restricts moving personal data outside the EU/EEA unless the destination offers an adequate level of protection. Where the European Commission hasn’t issued an adequacy decision for that country, organizations need an alternative safeguard, and SCCs are the most widely used one: a standardized contract, published by the Commission (the current set dates to June 2021), that the exporting and importing parties sign to bind the importer to GDPR-equivalent obligations regardless of local law.',
      'The 2021 SCCs use a modular structure covering four transfer scenarios — controller to controller, controller to processor, processor to processor, and processor to controller — so one template set fits most real-world data flows. Since the Schrems II ruling, using SCCs alone isn’t automatically sufficient: exporters are expected to conduct a transfer impact assessment considering whether the importing country’s government surveillance laws could override the contractual protections, and to layer on supplementary technical measures (such as encryption the recipient cannot break) where warranted.',
      'SCCs are one of several transfer mechanisms alongside adequacy decisions and certified frameworks like the EU-US Data Privacy Framework — organizations pick whichever applies to a given transfer, and a DPA will often reference SCCs by annex when the processor sits outside an adequate jurisdiction.',
    ],
    related: ['gdpr', 'eu-us-data-privacy-framework', 'data-processing-agreement', 'data-residency'],
    see: [{ label: 'European Commission — standard contractual clauses', href: 'https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/standard-contractual-clauses-scc_en' }],
  },
  {
    slug: 'eu-us-data-privacy-framework',
    term: 'EU-US Data Privacy Framework',
    category: 'Privacy & regulation',
    short:
      'The EU-US Data Privacy Framework (DPF) is a 2023 adequacy decision permitting personal-data transfers to US companies that self-certify to its principles — successor to the invalidated Privacy Shield and Safe Harbor.',
    paragraphs: [
      'US companies aren’t covered by an EU adequacy decision by default, since US law lacks a GDPR-equivalent federal privacy statute and has broader government surveillance powers than the EU considers acceptable. The DPF, which the European Commission adopted on 10 July 2023, addresses this for companies that opt in: a US organization self-certifies to the Department of Commerce that it will follow DPF principles — purpose limitation, data minimization, individual rights, onward-transfer accountability — and, once certified, can receive personal data from the EU/EEA as if the destination were adequate.',
      'The DPF is the third iteration of this mechanism. Its predecessor, Privacy Shield, was struck down by the Court of Justice of the EU in the 2020 Schrems II ruling over concerns that US surveillance law gave intelligence agencies disproportionate access to transferred data without adequate redress for EU citizens; Safe Harbor, the version before that, was invalidated in 2015 for similar reasons. The DPF tries to address the Schrems II concerns with new limits on US signals-intelligence collection and a redress mechanism — a Data Protection Review Court — for EU individuals, though its durability against a future legal challenge is not settled.',
      'Because certification is company-specific and voluntary, a DPF-transfer path only exists if the specific US recipient is on the certified list; otherwise, exporters fall back to SCCs or another safeguard.',
    ],
    related: ['standard-contractual-clauses', 'gdpr', 'data-residency', 'data-sovereignty'],
    see: [{ label: 'European Commission — EU-US Data Privacy Framework adequacy decision', href: 'https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/eu-us-data-privacy-framework_en' }],
  },
  {
    slug: 'data-residency',
    term: 'Data residency',
    category: 'Privacy & regulation',
    short:
      'Data residency is the physical or jurisdictional location where an organization’s data is stored — a deliberate infrastructure choice, distinct from data sovereignty, which concerns whose laws govern that data regardless of where it sits.',
    paragraphs: [
      'Residency is an operational fact: which country or region the servers and backups physically live in. Organizations choose residency for latency, regulatory alignment, or customer expectation — a company promising EU data residency commits to keeping storage and processing within EU/EEA borders, which simplifies GDPR cross-border-transfer analysis because there’s no border being crossed for that data flow.',
      'Residency alone doesn’t fully answer where legal authority reaches; a server physically located in one country can still be subject to another country’s law if the operating company is headquartered elsewhere and subject to extraterritorial legal process — that broader question is data sovereignty. Residency is nonetheless the practical lever most organizations can control directly, since it’s a hosting decision rather than a matter of corporate domicile.',
      'Ciphera hosts its infrastructure on Exoscale in Zurich, Switzerland (availability zone CH-DK-2) — data residency chosen specifically for Switzerland’s data protection regime (the FADP) and the EU’s adequacy recognition of it, independent of Ciphera BV’s own incorporation in Belgium.',
    ],
    related: ['data-sovereignty', 'fadp', 'gdpr', 'standard-contractual-clauses'],
    see: [{ label: 'Ciphera privacy policy', href: '/privacy' }],
  },
  {
    slug: 'data-sovereignty',
    term: 'Data sovereignty',
    category: 'Privacy & regulation',
    short:
      'Data sovereignty is the principle that data is subject to the laws of the jurisdiction that governs it — broader than data residency, since a legal claim can reach across borders regardless of where servers physically sit.',
    paragraphs: [
      'The distinction from residency matters in practice: a server in Switzerland is subject to Swiss law by residency, but if the company operating it is a US-headquartered entity, US laws with extraterritorial reach — the CLOUD Act being the frequently cited example — can potentially compel disclosure of data the company controls, wherever it’s stored. Sovereignty asks who can lawfully compel access to the data, not merely where the disks are.',
      'This is why sovereignty-conscious organizations look past the marketing claim of "data stored in country X" to ask which legal entity controls the infrastructure, what jurisdiction that entity is incorporated and headquartered in, and what legal process could reach it. A jurisdiction with strong statutory protections and no extraterritorial-reach conflicts is a stronger sovereignty position than residency alone provides.',
      'Ciphera’s infrastructure runs on Exoscale, a Swiss-headquartered cloud provider, hosted in Zurich — aligning both residency and the operating entity’s jurisdiction with Switzerland’s FADP regime, rather than relying on residency in a jurisdiction whose data could still be reached through a foreign parent company’s legal obligations.',
    ],
    related: ['data-residency', 'fadp', 'gdpr'],
  },
  {
    slug: 'privacy-by-design',
    term: 'Privacy by design',
    category: 'Privacy & regulation',
    short:
      'Privacy by design is the principle — codified as a legal obligation in GDPR Article 25 — that data protection must be built into a system’s architecture from the outset, not added afterward as a policy or a configuration toggle.',
    paragraphs: [
      'The term predates GDPR, originating with Ontario privacy commissioner Ann Cavoukian in the 1990s as a set of design principles: proactive rather than reactive, privacy as the default setting, embedded into design, full functionality without unnecessary trade-offs, end-to-end security, visibility and transparency, and respect for user privacy. GDPR Article 25 turned the core of this into a legal requirement — "data protection by design and by default" — obliging controllers to implement appropriate technical and organizational measures, such as pseudonymization and data minimization, at the time of determining the means of processing, not after launch.',
      'In practice, privacy by design shows up as architectural decisions rather than policy statements: collecting only the fields a feature actually needs, defaulting new accounts to the most private setting rather than requiring opt-out, choosing authentication protocols that never transmit a password rather than merely promising not to log it, and encrypting data such that even the operator cannot read it where the product doesn’t require them to. It’s the difference between a company saying it protects data and a company built so that mishandling it is architecturally difficult.',
      'Ciphera treats this as a build-time constraint: Ciphera ID uses OPAQUE so passwords never reach the server in any form, and Pulse is architected to run without cookies or persistent identifiers rather than collecting them and promising restraint.',
    ],
    related: ['personal-data', 'pseudonymization', 'gdpr', 'zero-knowledge'],
    see: [{ label: 'EUR-Lex — GDPR Article 25', href: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj' }],
  },
  {
    slug: 'data-controller',
    term: 'Data controller',
    category: 'Privacy & regulation',
    short:
      'A data controller is the natural or legal person that determines the purposes and means of processing personal data — under GDPR, the controller bears primary responsibility for lawful processing and for honoring data subjects’ rights.',
    paragraphs: [
      'The controller/processor split is the organizing structure of GDPR accountability: whoever decides why data is being processed and how — what fields to collect, what the data will be used for, how long to keep it — is the controller, regardless of whether that organization does the technical processing itself or outsources it. A retailer deciding to run an email marketing campaign and collecting addresses for it is the controller even if it uses a third-party service to actually send the emails.',
      'Controller status carries the heaviest compliance burden: establishing a lawful basis for processing, providing privacy notices, honoring access/erasure/portability requests, conducting data protection impact assessments where required, and — if using a processor — putting a compliant DPA in place. Two organizations can also be joint controllers when they jointly determine the purposes and means of the same processing, which requires its own arrangement clarifying respective responsibilities.',
      'For most of Ciphera’s products, the customer organization using Ciphera ID or Pulse to manage its own end users is typically the controller for that end-user data, with Ciphera acting as processor — the relationship a DPA is meant to formalize.',
    ],
    related: ['data-processor', 'data-processing-agreement', 'personal-data', 'gdpr'],
    see: [{ label: 'EUR-Lex — GDPR Article 4(7)', href: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj' }],
  },
  {
    slug: 'data-processor',
    term: 'Data processor',
    category: 'Privacy & regulation',
    short:
      'A data processor is the natural or legal person that processes personal data on behalf of, and under the instructions of, a data controller — without independently deciding why or how that data is used.',
    paragraphs: [
      'The processor’s defining trait under GDPR Article 4(8) is following instructions: it acts on the controller’s documented directions rather than setting its own purposes for the data. A cloud hosting provider, an email-delivery service, or an analytics vendor operating on a customer’s behalf are typical processors — they handle the mechanics of storage, transmission, or computation without deciding what the data is collected for in the first place.',
      'GDPR Article 28 imposes direct obligations on processors, not just controllers: implementing appropriate security measures, assisting the controller with data-subject rights and breach notifications, not engaging a sub-processor without authorization, and deleting or returning data when the engagement ends. A processor that starts determining its own purposes for the data — repurposing it beyond the controller’s instructions — risks being reclassified as a controller (or joint controller) for that processing, with the fuller compliance burden that implies.',
      'Where Ciphera runs infrastructure that a customer uses to manage its own end users’ data — Ciphera ID for authentication, Pulse for analytics — Ciphera typically sits in the processor role, bound by the DPA the customer relationship establishes.',
    ],
    related: ['data-controller', 'sub-processor', 'data-processing-agreement', 'gdpr'],
    see: [{ label: 'EUR-Lex — GDPR Article 4(8)', href: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj' }],
  },
  {
    slug: 'personal-data',
    term: 'Personal data',
    category: 'Privacy & regulation',
    short:
      'Personal data, under GDPR, is any information relating to an identified or identifiable natural person — a deliberately broad definition covering not just names and IDs but anything that can be linked back to someone, directly or in combination with other data.',
    paragraphs: [
      'GDPR Article 4(1) defines an identifiable person as one who can be identified, directly or indirectly, by reference to an identifier — a name, ID number, location data, an online identifier, or factors specific to physical, physiological, genetic, mental, economic, cultural, or social identity. That "indirectly" and "in combination" language is what makes the definition wide: an IP address, a device fingerprint, or a hashed identifier can all be personal data if they can realistically be linked to a person, even if the organization holding them doesn’t itself know the name behind it.',
      'A narrower subcategory, "special category" or sensitive personal data, covers information revealing racial or ethnic origin, political opinions, religious beliefs, trade union membership, genetic or biometric data used for identification, health data, or data about sex life or sexual orientation — processing these requires a higher bar than ordinary personal data, generally explicit consent or another narrowly defined legal basis.',
      'Techniques like pseudonymization reduce risk but don’t remove data from GDPR’s scope, since the data remains re-identifiable with additional information held elsewhere; only true anonymization — where re-identification is no longer reasonably possible — takes data outside the definition entirely.',
    ],
    related: ['pseudonymization', 'anonymization', 'gdpr', 'data-controller'],
    see: [{ label: 'EUR-Lex — GDPR Article 4(1)', href: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj' }],
  },
  {
    slug: 'pseudonymization',
    term: 'Pseudonymization',
    category: 'Privacy & regulation',
    short:
      'Pseudonymization is processing personal data so it can no longer be attributed to a specific person without additional information, which is kept separately and secured — a GDPR-recognized risk-reduction measure, but the data remains personal data in scope.',
    paragraphs: [
      'GDPR Article 4(5) defines pseudonymization specifically: replacing identifying fields with an artificial identifier (a token, a hash, a reference number) and keeping the mapping between the two separately, under technical and organizational controls that prevent re-attribution. A customer database with names replaced by tokens, where a separate, access-restricted table holds the token-to-name mapping, is a canonical example.',
      'The key legal point is that pseudonymized data is still personal data under GDPR — because the possibility of re-identification exists, even if it’s access-controlled, the regulation continues to apply in full. What pseudonymization buys is risk reduction (a leak of the pseudonymized dataset alone doesn’t directly expose identities) and it’s explicitly named in Article 25 and Article 32 as an appropriate technical measure for privacy by design and for security of processing — but it is not a substitute for anonymization when an organization actually wants data to fall outside GDPR’s scope.',
      'A blind index is a form of pseudonymization applied to a specific problem — search over encrypted data — where the "additional information" needed for re-identification is the encryption key or the original plaintext value, held separately from the searchable token itself.',
    ],
    related: ['anonymization', 'personal-data', 'gdpr', 'blind-index'],
    see: [{ label: 'EUR-Lex — GDPR Article 4(5)', href: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj' }],
  },
  {
    slug: 'anonymization',
    term: 'Anonymization',
    category: 'Privacy & regulation',
    short:
      'Anonymization is processing data such that the individual it once related to can no longer be identified by any means reasonably likely to be used — done correctly, the result falls entirely outside GDPR’s scope, unlike pseudonymized data.',
    paragraphs: [
      'The GDPR standard, drawn from Recital 26, is demanding: data counts as anonymous only if re-identification is not "reasonably likely" using any means available to the controller or a third party, accounting for cost, time, available technology, and technological development. This is a higher bar than simply removing names — direct identifiers can be stripped while enough quasi-identifiers (age, postcode, employer, rare combinations of attributes) remain to re-identify a person through cross-referencing with other datasets, a repeatedly demonstrated failure mode in supposedly anonymized releases.',
      'Genuine anonymization techniques include aggregation (reporting statistics over groups rather than individual records), generalization (broadening precise values like exact age into ranges), k-anonymity and differential-privacy approaches (mathematically bounding how much any single record influences an output), and irreversible deletion of the linking data needed to re-identify pseudonymized records. The test is outcome-based, not method-based: a technique claimed as "anonymization" that still permits realistic re-identification is legally pseudonymization at best.',
      'Because true anonymization is hard to achieve and verify, organizations often rely on pseudonymization plus access controls and legal safeguards instead — and stay within GDPR’s scope as a result, rather than claiming an anonymization exemption they can’t defend.',
    ],
    related: ['pseudonymization', 'personal-data', 'gdpr'],
    see: [{ label: 'EUR-Lex — GDPR Recital 26', href: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj' }],
  },
  {
    slug: 'warrant-canary',
    term: 'Warrant canary',
    category: 'Privacy & regulation',
    short:
      'A warrant canary is a regularly published statement that an organization has not received a secret government order — its disappearance warns users implicitly, since a gag order would forbid saying so directly.',
    paragraphs: [
      'The mechanism exploits a legal gap: many government orders that compel data disclosure come with a gag provision making it a crime to reveal the order’s existence — but courts in some jurisdictions have held that compelling an organization to keep affirmatively publishing a false statement ("we have received no such order") is a step beyond merely forbidding disclosure, and may not be enforceable the same way. A warrant canary is published on a fixed schedule; as long as it keeps being renewed, no such order has arrived. If it quietly stops updating, that silence is the signal — without anyone having stated the forbidden fact directly.',
      'The legal reliability of warrant canaries is genuinely contested and untested in many jurisdictions — there’s no guarantee a court would treat forced silence (rather than forced speech) as protected, and the mechanism gives no warning at all if the canary’s operator is compelled to keep publishing it falsely. It functions best as a transparency commitment and an operational signal, not a guaranteed legal shield.',
      'Ciphera publishes a GPG-signed warrant canary monthly, with the current statement and a public archive of past ones, at /trust/canary.',
    ],
    related: ['data-sovereignty', 'end-to-end-encryption'],
    see: [{ label: 'Ciphera trust hub — warrant canary', href: '/trust/canary' }],
  },
]
