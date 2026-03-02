import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeftIcon } from '@ciphera-net/ui'
import { notFound } from 'next/navigation'

const blogPosts: Record<string, { title: string; description: string; content: string; date: string; category: string; readTime: string }> = {
  'understanding-zero-knowledge-encryption': {
    title: 'Understanding Zero-Knowledge Encryption: A Complete Guide',
    description: 'Learn what zero-knowledge encryption is, how it works, and why it matters for protecting your data. A comprehensive guide from the Ciphera team.',
    category: 'Security',
    date: '2026-03-02',
    readTime: '10 min read',
    content: `
      <p class="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
        In a world where data breaches make headlines weekly and cloud providers face growing pressure from government surveillance requests, the question of who can actually read your data has never been more important. Zero-knowledge encryption offers a definitive answer: nobody but you.
      </p>

      <h2>What Is Zero-Knowledge Encryption?</h2>
      <p>
        Zero-knowledge encryption is an architecture where the service provider has <strong>zero knowledge</strong> of your data's contents. Unlike traditional encryption-at-rest (where the provider holds the keys) or encryption-in-transit (which only protects data on the wire), zero-knowledge encryption means the server never possesses the decryption key. The data arrives encrypted, is stored encrypted, and leaves encrypted. The server is, by design, unable to decrypt it.
      </p>
      <p>
        This is distinct from the cryptographic concept of "zero-knowledge proofs," though the name draws from the same principle: one party proves something to another without revealing the underlying information.
      </p>

      <h2>How It Works: Client-Side Encryption</h2>
      <p>
        The core mechanism is straightforward. All encryption and decryption happens on the client, typically in the browser, before any data reaches the server. The general flow looks like this:
      </p>
      <ul>
        <li><strong>Key generation:</strong> A cryptographic key is generated locally on the user's device. This key never leaves the client in plaintext.</li>
        <li><strong>Encryption:</strong> The data (a file, a message, a note) is encrypted using this key before being transmitted.</li>
        <li><strong>Upload:</strong> Only the encrypted ciphertext is sent to the server. The server stores an opaque blob of bytes it cannot interpret.</li>
        <li><strong>Sharing:</strong> The decryption key is shared out-of-band or embedded in a URL fragment (the part after the <code>#</code>, which browsers do not send to the server).</li>
        <li><strong>Decryption:</strong> The recipient's browser downloads the encrypted blob and decrypts it locally using the key.</li>
      </ul>

      <h2>Key Derivation and Password Protection</h2>
      <p>
        Not every shared file uses a randomly generated key. When you password-protect a file share in Ciphera Drop, the encryption key is <strong>derived from the password</strong> using a key derivation function (KDF). This is where PBKDF2 (Password-Based Key Derivation Function 2) comes in.
      </p>
      <p>
        PBKDF2 takes a user-supplied password and applies a pseudorandom function (typically HMAC-SHA256) repeatedly over many iterations, combined with a random salt. The output is a cryptographic key suitable for AES-256 encryption. The iteration count is deliberately high, often hundreds of thousands of rounds, to make brute-force password guessing computationally expensive. The salt ensures that two users who choose the same password will produce different derived keys.
      </p>
      <p>
        The distinction between the two key modes matters for the threat model:
      </p>
      <ul>
        <li><strong>Random key (default):</strong> A 256-bit key is generated via <code>crypto.getRandomValues()</code> and embedded in the URL fragment. Security depends entirely on the link remaining secret. The key has full 256-bit entropy.</li>
        <li><strong>Password-derived key:</strong> The key is derived from a user-chosen password via PBKDF2. Security depends on password strength and the iteration count. The URL fragment is not needed for decryption; instead, the recipient enters the password. This is useful when you want to share the link over one channel and the password over another.</li>
      </ul>
      <p>
        The PBKDF2 specification is defined in <a href="https://csrc.nist.gov/pubs/sp/800-132/final" target="_blank" rel="noopener noreferrer">NIST SP 800-132</a>, which provides recommendations on salt length, iteration counts, and appropriate use cases for password-based key derivation. Ciphera follows these recommendations, using a 128-bit random salt and a high iteration count calibrated to balance security against browser performance.
      </p>

      <h2>AES-256-GCM: The Cipher Behind It</h2>
      <p>
        Not all encryption algorithms are equal. At Ciphera, we use <strong>AES-256-GCM</strong> (Advanced Encryption Standard with 256-bit keys in Galois/Counter Mode). Here is why this choice matters:
      </p>
      <ul>
        <li><strong><a href="https://en.wikipedia.org/wiki/Advanced_Encryption_Standard" target="_blank" rel="noopener noreferrer">AES-256</a></strong> provides a 256-bit key space, making brute-force attacks computationally infeasible. Even with all the computing power on Earth, breaking a single AES-256 key would take longer than the age of the universe.</li>
        <li><strong>GCM (<a href="https://en.wikipedia.org/wiki/Galois/Counter_Mode" target="_blank" rel="noopener noreferrer">Galois/Counter Mode</a>)</strong> is an authenticated encryption mode. It does not just encrypt your data; it also generates an authentication tag that detects any tampering with the ciphertext. If a single bit is altered in transit or storage, decryption will fail rather than produce corrupted output. GCM is specified in <a href="https://csrc.nist.gov/pubs/sp/800-38d/final" target="_blank" rel="noopener noreferrer">NIST SP 800-38D</a>.</li>
        <li>AES-256-GCM is hardware-accelerated on modern CPUs via AES-NI instructions, making it fast enough for real-time encryption of large files in the browser.</li>
      </ul>

      <h2>Limitations and Threat Model</h2>
      <p>
        Zero-knowledge encryption is powerful, but it is not a silver bullet. Understanding what it does <strong>not</strong> protect against is just as important as understanding what it does. Every security system has a threat model, and being honest about boundaries is what separates genuine security from marketing.
      </p>
      <p>
        Here is what zero-knowledge encryption does not defend against:
      </p>
      <ul>
        <li><strong>Compromised client device:</strong> If malware is running on your computer or phone, it can capture files before encryption or keys after generation. ZKE protects data on the server and in transit, but it cannot protect data on an already-compromised endpoint. Keeping your operating system and browser updated is a prerequisite.</li>
        <li><strong>Key sharing via insecure channels:</strong> If you share a Drop link (which contains the decryption key in the URL fragment) over an unencrypted channel such as SMS or a monitored email account, an adversary who intercepts the link obtains the key. The encryption is only as secure as the channel used to share the key.</li>
        <li><strong>Social engineering:</strong> No cryptographic system can prevent a user from being tricked into handing over a password or sharing a link with the wrong person. Phishing, pretexting, and impersonation remain effective attacks regardless of the encryption layer.</li>
        <li><strong>Malicious client code:</strong> In a browser-based system, you trust that the JavaScript served by the provider is doing what it claims. A compromised or malicious server could theoretically serve altered client code that exfiltrates keys. This is a fundamental limitation of web-based encryption.</li>
      </ul>
      <p>
        The trust boundary in zero-knowledge encryption is the client. You trust the code running on your device; you do not need to trust the server. This is a significant improvement over server-side encryption, where you must trust both the server infrastructure and every person with access to it. But it does mean verifying the client code matters.
      </p>
      <p>
        This is one reason why open source matters for encryption tools. When the client code is publicly available, security researchers and users can audit it to verify that it does what it claims. Ciphera's file-sharing client is open source and available at <a href="https://github.com/ciphera-net/drop" target="_blank" rel="noopener noreferrer">Ciphera's open-source repository</a>. We encourage review, and we consider it a feature, not a risk, that anyone can inspect our encryption implementation.
      </p>

      <h2>How Ciphera Drop Implements Zero-Knowledge Encryption</h2>
      <p>
        When you share a file through <strong>Ciphera Drop</strong>, here is exactly what happens:
      </p>
      <ul>
        <li>You select a file in your browser. A 256-bit AES key and a random initialization vector (IV) are generated using the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API" target="_blank" rel="noopener noreferrer">Web Crypto API</a>'s <code>crypto.getRandomValues()</code>.</li>
        <li>The file is encrypted with AES-256-GCM entirely in your browser. For large files, this happens in streaming chunks to keep memory usage manageable.</li>
        <li>The encrypted blob is uploaded to our servers hosted on Swiss infrastructure. Our backend receives ciphertext that it cannot decrypt.</li>
        <li>You receive a share link in the format <code>drop.ciphera.net/d/fileId#key</code>. The key is in the URL fragment, meaning it is never sent to our servers in any HTTP request.</li>
        <li>When the recipient opens the link, their browser extracts the key from the fragment, downloads the encrypted file, and decrypts it locally.</li>
      </ul>
      <p>
        At no point in this process does our server have access to the plaintext file or the encryption key. Our database contains encrypted blobs and metadata, nothing more.
      </p>

      <h2>Why This Matters</h2>
      <p>
        The practical implications of zero-knowledge encryption are significant:
      </p>
      <ul>
        <li><strong>Server compromise resilience:</strong> If an attacker breaches our servers, they get encrypted data with no way to decrypt it. There are no keys to steal because we never had them.</li>
        <li><strong>Legal protection:</strong> We cannot comply with data access requests for file contents because we technically cannot access them. We can only provide encrypted ciphertext.</li>
        <li><strong>Insider threat mitigation:</strong> No employee, system administrator, or contractor at Ciphera can view your files. The architecture enforces this, not just policy.</li>
        <li><strong>Trust minimization:</strong> You do not need to trust us with your data's confidentiality. The cryptography guarantees it regardless of our intentions.</li>
      </ul>

      <h2>Compared to Traditional Approaches</h2>
      <p>
        Most cloud storage and file-sharing services use <strong>server-side encryption</strong>. The provider encrypts your data on their servers using keys they control. This protects against physical disk theft but does nothing against a compromised server, a rogue employee, or a government subpoena. The provider can always decrypt your data because they hold the keys.
      </p>
      <p>
        Some services offer "end-to-end encryption" but implement it with key escrow or recovery mechanisms that undermine the guarantee. If a service can reset your password and still give you access to your encrypted data, they hold a copy of your key.
      </p>
      <p>
        True zero-knowledge encryption means there is no backdoor, no recovery mechanism controlled by the provider, and no way to comply with decryption requests. If you lose the key, the data is gone. That is not a limitation; it is the point.
      </p>

      <h2>Zero-Knowledge Encryption Providers Compared</h2>
      <p>
        Not all privacy-focused services implement zero-knowledge encryption in the same way, and many mainstream services do not implement it at all. The following table compares how several file-sharing and cloud storage providers handle encryption, transparency, and data access:
      </p>
      <table>
        <thead>
          <tr>
            <th>Provider</th>
            <th>Client-Side Encryption</th>
            <th>Open Source</th>
            <th>Zero-Knowledge</th>
            <th>Max File Size</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ciphera Drop</td>
            <td>Yes</td>
            <td>Yes (client + server)</td>
            <td>Yes</td>
            <td>5 GB</td>
          </tr>
          <tr>
            <td>Proton Drive</td>
            <td>Yes</td>
            <td>Yes (client only)</td>
            <td>Yes</td>
            <td>500 MB - 5 GB</td>
          </tr>
          <tr>
            <td>Tresorit</td>
            <td>Yes</td>
            <td>No</td>
            <td>Yes</td>
            <td>5 - 10 GB</td>
          </tr>
          <tr>
            <td>Google Drive</td>
            <td>No</td>
            <td>No</td>
            <td>No</td>
            <td>5 TB</td>
          </tr>
          <tr>
            <td>Dropbox</td>
            <td>No</td>
            <td>No</td>
            <td>No</td>
            <td>2 GB - 2 TB</td>
          </tr>
        </tbody>
      </table>
      <p>
        A few things stand out. Services like Google Drive and Dropbox encrypt data at rest on their servers, but they hold the keys. This means they can (and do) scan file contents for policy enforcement, respond to legal requests with decrypted data, and theoretically suffer key compromise in a breach. Proton Drive and Tresorit both implement genuine client-side encryption, but differ in transparency: Proton publishes its client code, while Tresorit does not. Ciphera Drop is unique in making both the client and server code open source, allowing full verification of the zero-knowledge claim from end to end.
      </p>

      <h2>Common Misconceptions</h2>
      <p>
        Zero-knowledge encryption is frequently confused with other security concepts, and several common beliefs about data protection turn out to be wrong on closer inspection:
      </p>
      <ul>
        <li><strong>"HTTPS means my files are encrypted."</strong> HTTPS (TLS) encrypts data <em>in transit</em> between your browser and the server. Once the data arrives at the server, TLS encryption ends. The server receives and processes your files in plaintext. HTTPS protects against eavesdropping on the network, but it does nothing to protect your data from the server operator, a breach of the server, or a legal demand served to the provider.</li>
        <li><strong>"The provider says they encrypt my data."</strong> Most providers do encrypt data at rest using server-side encryption. However, server-side encryption means the provider generates, stores, and manages the encryption keys. They can decrypt your data at any time. This protects against physical disk theft from the data center, but not against compromised servers, insider threats, or lawful data requests. If the provider can reset your password and restore access to your encrypted files, they hold a copy of your key.</li>
        <li><strong>"End-to-end encrypted means zero-knowledge."</strong> Not always. Some services advertise end-to-end encryption but implement key escrow, where a copy of your encryption key is stored (often encrypted) on the provider's servers to enable account recovery. If the provider can recover your data when you lose your password, they have access to your key material. True zero-knowledge means the provider cannot recover your data under any circumstances, because they never possessed the key.</li>
      </ul>

      <h2>Getting Started</h2>
      <p>
        Zero-knowledge encryption should not be a premium feature or a niche tool. At Ciphera, we have made it the default for every file shared through Drop. No configuration required, no key management complexity for the user. You share a file, the encryption happens automatically, and only people with the link can decrypt it.
      </p>
      <p>
        If you are evaluating file-sharing tools for your team or organization, ask one question: can the provider read your files? If the answer is yes, or "only in certain circumstances," you do not have zero-knowledge encryption. You have a promise.
      </p>
    `,
  },
  'why-swiss-infrastructure': {
    title: 'Why Swiss Infrastructure Matters for Data Privacy',
    description: 'Discover why Switzerland\'s data protection laws make it the ideal location for privacy-focused infrastructure and how Ciphera leverages Swiss hosting.',
    category: 'Privacy',
    date: '2026-02-28',
    readTime: '12 min read',
    content: `
      <p class="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
        When we tell people that Ciphera runs on Swiss infrastructure, the most common response is "why does server location matter?" It is a fair question. In a world of globally distributed cloud services, the physical location of a server might seem like a relic of an older era. But it is not. Here is why.
      </p>

      <h2>Switzerland's Data Protection Framework</h2>
      <p>
        Switzerland operates under the <strong>Federal Act on Data Protection (FADP)</strong>, which was substantially revised in September 2023 to align with modern privacy standards. The FADP is enforced by the Federal Data Protection and Information Commissioner (FDPIC), an independent authority that operates outside political influence.
      </p>
      <p>
        What makes the FADP distinctive is not just its strictness, but its <strong>independence from EU and US jurisdictions</strong>. Switzerland is not an EU member state, which means EU regulations do not directly apply. At the same time, the FADP meets or exceeds EU adequacy standards, which is why the European Commission has recognized Switzerland as providing adequate data protection under GDPR.
      </p>
      <p>
        The practical result: data stored in Switzerland benefits from strong legal protections without being subject to the jurisdictional overreach that affects EU and US-hosted data.
      </p>

      <h2>Key Legal Frameworks Compared</h2>
      <p>
        To understand why jurisdiction matters, it helps to compare the major data protection and surveillance frameworks side by side. Each operates under different assumptions about government access to private data, and the differences are significant.
      </p>
      <table>
        <thead>
          <tr>
            <th>Framework</th>
            <th>Jurisdiction</th>
            <th>Key Provisions</th>
            <th>Data Access Mechanisms</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><a href="https://www.fedlex.admin.ch/eli/cc/2022/491/en" target="_blank" rel="noopener noreferrer"><strong>Swiss FADP</strong></a></td>
            <td>Switzerland</td>
            <td>Revised in 2023 to strengthen individual rights. Requires purpose limitation, data minimization, and privacy by design. Enforced by the independent FDPIC.</td>
            <td>Requires judicial authorization and dual criminality for international requests via MLAT process. Mass surveillance is prohibited. No equivalent to National Security Letters.</td>
          </tr>
          <tr>
            <td><a href="https://gdpr-info.eu/" target="_blank" rel="noopener noreferrer"><strong>EU GDPR</strong></a></td>
            <td>European Union</td>
            <td>Comprehensive data protection regulation with strong individual rights including right to erasure, data portability, and explicit consent requirements. Fines up to 4% of global annual revenue.</td>
            <td>National security exemptions allow member states broad surveillance powers. Each member state retains its own intelligence framework. ePrivacy derogations permit bulk data retention for national security purposes.</td>
          </tr>
          <tr>
            <td><a href="https://en.wikipedia.org/wiki/CLOUD_Act" target="_blank" rel="noopener noreferrer"><strong>US CLOUD Act</strong></a></td>
            <td>United States (global reach)</td>
            <td>Enacted in 2018. Compels US-based companies to produce data regardless of where it is physically stored. Creates bilateral executive agreements for streamlined cross-border data requests.</td>
            <td>US law enforcement can obtain warrants for data stored abroad by US companies. Executive agreements with partner nations bypass the traditional MLAT process entirely. No dual criminality requirement for domestic warrants.</td>
          </tr>
          <tr>
            <td><strong>US FISA Section 702</strong></td>
            <td>United States (targets non-US persons)</td>
            <td>Authorizes warrantless surveillance of non-US persons reasonably believed to be located outside the United States. Reauthorized and expanded in April 2024.</td>
            <td>The NSA can compel US providers, including cloud, email, and social media companies, to provide data on foreign targets without individual warrants. Incidental collection of US persons' communications is permitted and routinely occurs at scale.</td>
          </tr>
        </tbody>
      </table>
      <p>
        The contrast is stark. Swiss law requires judicial oversight and prohibits mass surveillance. US law enables extraterritorial data seizure and warrantless collection on a massive scale. For anyone storing sensitive data, whether personal documents, business records, or confidential communications, these are not abstract legal distinctions. They determine whether a foreign government can access your files without your knowledge or consent.
      </p>

      <h2>The Problem with US and EU Hosting</h2>
      <p>
        <strong>United States:</strong> US law enforcement and intelligence agencies have broad data access powers. The CLOUD Act (2018) compels US-based companies to produce data stored anywhere in the world when served with a valid warrant, regardless of where the data is physically located. Section 702 of FISA allows warrantless surveillance of non-US persons' data held by US providers. If your data is hosted by a US company, it is subject to US jurisdiction, full stop.
      </p>
      <p>
        <strong>European Union:</strong> The GDPR provides strong data protection rights, but EU member states still have national security exceptions. Intelligence agencies in France, Germany, and other member states retain significant surveillance capabilities. The EU also faces ongoing tensions between data protection and law enforcement access, as seen in the repeated debates over chat control and client-side scanning proposals.
      </p>
      <p>
        <strong>Switzerland:</strong> Swiss authorities can request data, but the process is governed by strict procedural requirements and judicial oversight. Mass surveillance programs are prohibited. International requests for data must go through mutual legal assistance treaties (MLATs), which are slow and require dual criminality, meaning the alleged offense must be a crime in both the requesting country and Switzerland.
      </p>

      <h2>Real-World Implications: Case Studies</h2>
      <p>
        The tensions between data protection laws and government surveillance are not theoretical. Several landmark legal cases have shaped the current landscape and demonstrate exactly why jurisdiction matters in practice.
      </p>
      <p>
        <strong>Microsoft Ireland Case (2013-2018):</strong> In 2013, the US Department of Justice issued a warrant under the Stored Communications Act demanding that Microsoft produce emails stored on servers in Dublin, Ireland. Microsoft refused, arguing that US warrants should not have extraterritorial reach. The case escalated through the courts for five years, with Microsoft winning at the Second Circuit Court of Appeals. However, rather than let the Supreme Court resolve the issue, Congress passed the <a href="https://en.wikipedia.org/wiki/CLOUD_Act" target="_blank" rel="noopener noreferrer">CLOUD Act</a> in 2018, which explicitly grants US law enforcement the power to compel US companies to produce data regardless of where it is stored. The case that began as a challenge to government overreach ended with legislation that codified that very overreach.
      </p>
      <p>
        <strong>Schrems II Decision (2020):</strong> In a case brought by Austrian privacy activist Max Schrems, the Court of Justice of the European Union <a href="https://en.wikipedia.org/wiki/Data_Protection_Commissioner_v_Facebook_Ireland_and_Maximillian_Schrems" target="_blank" rel="noopener noreferrer">invalidated the EU-US Privacy Shield</a>, the legal framework that had allowed transatlantic data transfers. The court found that US surveillance laws, particularly FISA Section 702, were fundamentally incompatible with EU data protection rights. The ruling threw thousands of businesses into legal uncertainty overnight and demonstrated that even negotiated international agreements cannot resolve the core conflict between US surveillance powers and European privacy expectations. The subsequent EU-US Data Privacy Framework, adopted in 2023, faces similar legal challenges and may yet be struck down.
      </p>
      <p>
        <strong>Switzerland's EU Adequacy Decision:</strong> Despite not being an EU member, Switzerland has received an <strong>adequacy decision</strong> from the European Commission, meaning the EU formally recognizes that Swiss data protection law provides a level of protection essentially equivalent to that of the GDPR. This is significant because it means data can flow freely between the EU and Switzerland without additional legal safeguards, while the same cannot be said for EU-US data transfers, which remain legally contentious. Switzerland's adequacy status reflects the strength and independence of the FADP framework and reinforces its position as a trustworthy jurisdiction for data storage.
      </p>

      <h2>Why Physical Server Location Still Matters</h2>
      <p>
        In theory, encryption should make server location irrelevant. In practice, it does not, for several reasons:
      </p>
      <ul>
        <li><strong>Metadata:</strong> Even with encrypted payloads, servers generate metadata: IP addresses, access timestamps, file sizes, user agents. The jurisdiction where this metadata is stored determines who can legally compel its disclosure.</li>
        <li><strong>Legal compulsion:</strong> A court order in the server's jurisdiction can compel the hosting provider to hand over data, install monitoring equipment, or modify software. Swiss law imposes higher barriers to such orders than most jurisdictions.</li>
        <li><strong>Physical access:</strong> Law enforcement in the server's jurisdiction can physically seize hardware. Switzerland's strong property rights and procedural requirements make this significantly more difficult than in other countries.</li>
        <li><strong>Gag orders:</strong> Some jurisdictions (notably the US via National Security Letters) can compel providers to hand over data while prohibiting them from disclosing that they have done so. Swiss law does not have an equivalent mechanism for foreign requests.</li>
      </ul>

      <h2>Swiss Neutrality and Data Sovereignty</h2>
      <p>
        Switzerland's political neutrality is not just a diplomatic tradition; it has practical implications for data hosting. Switzerland is not a member of NATO, the EU, or the Five Eyes intelligence alliance. It does not participate in the intelligence-sharing agreements that allow signatory nations to circumvent their own domestic surveillance restrictions by requesting data from partner agencies.
      </p>
      <p>
        This neutrality extends to data sovereignty. Swiss law treats data stored on Swiss soil as subject to Swiss law first, regardless of the nationality of the data owner or the origin of the data. Foreign legal requests are filtered through Swiss legal standards before any data is disclosed.
      </p>

      <h2>Switzerland and the Five Eyes Alliance</h2>
      <p>
        One of the most important and least understood aspects of global surveillance is the network of intelligence-sharing alliances that allow member nations to pool their surveillance capabilities and, in some cases, circumvent their own domestic legal restrictions.
      </p>
      <p>
        The <a href="https://en.wikipedia.org/wiki/Five_Eyes" target="_blank" rel="noopener noreferrer"><strong>Five Eyes (FVEY)</strong></a> alliance is the core of this network. Comprising the United States, the United Kingdom, Canada, Australia, and New Zealand, Five Eyes dates back to a post-World War II signals intelligence agreement. Member nations share intercepted communications and intelligence data with each other extensively. The practical implication is significant: if one member nation's domestic law restricts surveillance of its own citizens, it can request a partner agency to conduct that surveillance instead, effectively bypassing domestic legal protections.
      </p>
      <p>
        Beyond Five Eyes, there are expanded alliances. The <strong>Nine Eyes</strong> adds Denmark, France, the Netherlands, and Norway. The <strong>Fourteen Eyes</strong> (formally known as SIGINT Seniors Europe, or SSEUR) further includes Germany, Belgium, Italy, Spain, and Sweden. While these outer rings involve less deeply integrated intelligence sharing than the core Five Eyes, member nations still participate in coordinated surveillance programs and data exchange agreements.
      </p>
      <p>
        <strong>Switzerland is not a member of any of these alliances.</strong> It is not part of Five Eyes, Nine Eyes, or Fourteen Eyes. This is not an accident of geography but a deliberate consequence of Switzerland's longstanding policy of political and military neutrality. Swiss intelligence services operate under Swiss law exclusively and are not party to the mutual surveillance agreements that characterize these alliances.
      </p>
      <p>
        Why does this matter for data hosting? If your data is stored in a Fourteen Eyes country, the intelligence agencies of up to fourteen nations may have legal or practical pathways to access it through their cooperative agreements. A request that would be denied under one nation's domestic law might be fulfilled by a partner agency operating under more permissive rules. Hosting data in Switzerland removes your information from this entire network of agreements. Swiss authorities will only disclose data pursuant to Swiss law, through Swiss judicial processes, with no obligation to share intelligence with foreign agencies.
      </p>

      <h2>How Ciphera Uses Swiss Infrastructure</h2>
      <p>
        Ciphera is a Belgian company that deliberately chose Swiss infrastructure for data storage and processing. Our servers are hosted in Swiss data centers that meet ISO 27001 standards and are operated by Swiss entities subject exclusively to Swiss law.
      </p>
      <p>
        Combined with our zero-knowledge encryption architecture, this means:
      </p>
      <ul>
        <li>File contents are encrypted before they leave your browser and stored as ciphertext on Swiss servers. Even a lawful Swiss data request would yield only encrypted blobs.</li>
        <li>Metadata is minimized by design. We collect the minimum necessary for service operation and store it under Swiss jurisdiction.</li>
        <li>We comply with both <strong>GDPR</strong> (as a Belgian company serving EU users) and the <strong>FADP</strong> (as an operator of Swiss infrastructure). Users get the strongest protections from both frameworks.</li>
      </ul>

      <h2>What to Look for in Privacy-Focused Hosting</h2>
      <p>
        If you are evaluating hosting providers or online services with privacy in mind, not all claims of "privacy" or "security" are equal. The following checklist covers the key factors that determine whether a service can genuinely protect your data:
      </p>
      <ul>
        <li><strong>Server jurisdiction outside Five Eyes:</strong> The legal jurisdiction where servers are physically located determines which governments can compel data disclosure. Choose providers hosted in countries that are not members of the Five Eyes, Nine Eyes, or Fourteen Eyes intelligence alliances. Switzerland, Iceland, and Norway are strong options, though each has different legal nuances.</li>
        <li><strong>Data center operator nationality:</strong> It is not enough for servers to be in a privacy-friendly country. The entity operating the data center must also be subject exclusively to local law. A US-owned data center in Switzerland can still be compelled under the CLOUD Act. Verify that the data center operator is a domestic company in the hosting jurisdiction.</li>
        <li><strong>Encryption at rest and in transit:</strong> At minimum, data should be encrypted both when stored on disk (at rest) and when transmitted between your device and the server (in transit via TLS). However, if the provider manages the encryption keys, they can still access your data. This is a baseline, not a sufficient guarantee.</li>
        <li><strong>Zero-knowledge architecture:</strong> The strongest protection is a zero-knowledge design where the provider cannot decrypt your data under any circumstances. Encryption and decryption happen exclusively on the client side, and the server never possesses the keys. This protects against server breaches, insider threats, and legal compulsion simultaneously.</li>
        <li><strong>Open-source code for verification:</strong> Privacy claims that cannot be independently verified require trust. Open-source client code allows security researchers and users to confirm that encryption is implemented correctly, that no data leaks to the server, and that no backdoors exist. Open-source server code provides even stronger assurance.</li>
        <li><strong>ISO 27001 or SOC 2 certification:</strong> These certifications indicate that the hosting provider follows recognized information security management practices. ISO 27001 is an international standard for security management systems, while SOC 2 focuses on controls relevant to security, availability, processing integrity, confidentiality, and privacy. Certification does not guarantee privacy, but its absence should raise questions about operational security practices.</li>
      </ul>
      <p>
        No single factor on this list is sufficient on its own. A zero-knowledge architecture hosted in a Five Eyes country still exposes metadata to surveillance. A Swiss-hosted service with server-side encryption still gives the provider access to your data. The goal is to find services that check as many of these boxes as possible, creating layered defenses that do not depend on any single protection holding.
      </p>

      <h2>Location Is a Feature, Not a Detail</h2>
      <p>
        Choosing where to host infrastructure is a privacy decision, not just a performance optimization. When you use Ciphera's services, your encrypted data resides in a jurisdiction with some of the strongest data protection standards in the world, operated by a company that has architected its systems so that even it cannot access your data.
      </p>
      <p>
        Server location alone is not sufficient for privacy. And encryption alone is not sufficient either. But the combination of Swiss hosting, zero-knowledge encryption, and minimal data collection creates a defense-in-depth approach that no single measure can provide on its own.
      </p>
    `,
  },
  'building-privacy-first-analytics': {
    title: 'Building Privacy-First Analytics: How Pulse Works Without Cookies',
    description: 'How we built Pulse, a privacy-first analytics platform that provides meaningful insights without cookies, fingerprinting, or personal data collection.',
    category: 'Engineering',
    date: '2026-02-25',
    readTime: '12 min read',
    content: `
      <p class="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
        When we set out to build analytics for Ciphera's own websites, we faced a dilemma familiar to every privacy-focused company: how do you understand your users without surveilling them? The answer became Pulse, our analytics platform that provides meaningful product insights without cookies, fingerprinting, or personal data collection.
      </p>

      <h2>The Problem with Traditional Analytics</h2>
      <p>
        Google Analytics is installed on over 28 million websites. It is powerful, free, and deeply invasive. When a visitor lands on a site running GA4, here is what happens: a tracking cookie is set, a unique client ID is generated, and every subsequent page view, scroll, click, and form interaction is tied to that identifier. Google aggregates this data across every site running GA to build comprehensive behavioral profiles.
      </p>
      <p>
        This creates two problems. First, the <strong>legal burden</strong>: under GDPR, cookies that are not strictly necessary require informed consent. This is why every website in Europe greets you with a consent banner. If a user declines, you get no data at all. Studies show that 30-50% of European users reject analytics cookies, creating a massive blind spot in your data.
      </p>
      <p>
        Second, the <strong>ethical burden</strong>: most website operators do not need to know that User #48291 visited three pages, scrolled 73% of page two, came from a LinkedIn ad, uses an iPhone 15 Pro, and is located in Zurich. They need to know that their pricing page has a high bounce rate.
      </p>

      <h2>The Privacy Analytics Landscape</h2>
      <p>
        The good news is that awareness of these problems has grown, and a new generation of privacy-focused analytics tools has emerged. Google Analytics is installed on over 28 million websites according to <a href="https://www.builtwith.com/analytics/Google-Analytics" target="_blank" rel="noopener noreferrer">BuiltWith data</a>, but a growing number of site operators are actively seeking alternatives that respect user privacy. Meanwhile, studies from <a href="https://www.cookiebot.com/en/google-consent-mode-report/" target="_blank" rel="noopener noreferrer">Cookiebot</a> show that 30-50% of European users reject analytics cookies, meaning cookie-dependent platforms are giving you an incomplete picture by default.
      </p>
      <p>
        Here is how the major privacy-focused analytics platforms compare:
      </p>
      <table>
        <thead>
          <tr>
            <th>Platform</th>
            <th>Cookies</th>
            <th>Open Source</th>
            <th>Script Size</th>
            <th>Self-Hostable</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Pulse</strong></td>
            <td>No</td>
            <td>Yes</td>
            <td>~2KB</td>
            <td>Yes</td>
            <td>Free</td>
          </tr>
          <tr>
            <td><strong>Plausible</strong></td>
            <td>No</td>
            <td>Yes</td>
            <td>~1KB</td>
            <td>Yes</td>
            <td>From $9/mo</td>
          </tr>
          <tr>
            <td><strong>Fathom</strong></td>
            <td>No</td>
            <td>No</td>
            <td>~2KB</td>
            <td>No</td>
            <td>From $14/mo</td>
          </tr>
          <tr>
            <td><strong>Umami</strong></td>
            <td>No</td>
            <td>Yes</td>
            <td>~2KB</td>
            <td>Yes</td>
            <td>Free/self-hosted</td>
          </tr>
          <tr>
            <td><strong>Google Analytics</strong></td>
            <td>Yes</td>
            <td>No</td>
            <td>~45KB</td>
            <td>No</td>
            <td>Free</td>
          </tr>
        </tbody>
      </table>
      <p>
        All of the privacy-focused options in this table share a common philosophy: you do not need to track individuals to understand how your product is performing. Where they differ is in hosting model, pricing, and the specific technical approach to counting visitors without persistent identifiers. Pulse differentiates itself by being completely free, open source, and designed from the ground up to integrate with the Ciphera ecosystem.
      </p>

      <h2>What Pulse Collects vs. What It Does Not</h2>
      <p>
        Pulse was designed around a simple principle: <strong>collect the minimum data necessary to answer product questions, and nothing more.</strong>
      </p>
      <p>
        <strong>What Pulse collects:</strong>
      </p>
      <ul>
        <li>Page URL and referrer (where traffic comes from)</li>
        <li>Viewport size and device type (desktop, tablet, mobile)</li>
        <li>Country-level geolocation derived from IP at the edge, then the IP is discarded</li>
        <li>Page load performance metrics</li>
        <li>Aggregated event counts (button clicks, form submissions)</li>
        <li>Session duration (computed without persistent identifiers)</li>
      </ul>
      <p>
        <strong>What Pulse does not collect:</strong>
      </p>
      <ul>
        <li>Cookies of any kind (no first-party, no third-party)</li>
        <li>IP addresses (hashed or otherwise; they are used for geo lookup and immediately discarded)</li>
        <li>Browser fingerprints (no canvas fingerprinting, no WebGL hashing, no font enumeration)</li>
        <li>User identifiers or cross-session tracking</li>
        <li>Precise location (city-level or more specific)</li>
        <li>Personal data as defined by GDPR Article 4</li>
      </ul>

      <h2>The Technical Approach</h2>
      <p>
        Building analytics without persistent identifiers requires rethinking how you define core metrics. Here is how we approach it:
      </p>
      <h3>No Cookies, No Problem</h3>
      <p>
        Pulse's tracking script does not set any cookies. It does not use <code>localStorage</code>, <code>sessionStorage</code>, or <code>IndexedDB</code>. Each page view is an independent event. This means Pulse is exempt from GDPR cookie consent requirements, so you can remove your consent banner entirely (for analytics, at least).
      </p>
      <h3>Sessions Without Identifiers</h3>
      <p>
        Traditional analytics define a "session" by linking multiple page views to a cookie-based identifier. Pulse instead uses a combination of the referrer chain and temporal proximity to group page views into logical sessions. If two page views from the same country and device type arrive within 30 minutes via internal navigation, they are grouped. This is not perfect, but it is accurate enough for product decisions and collects zero personal data.
      </p>
      <h3>Country-Level Geolocation Only</h3>
      <p>
        When a request reaches our edge servers, we perform a GeoIP lookup to determine the country, then immediately discard the IP address from the event payload before it reaches our Go backend or PostgreSQL database. The raw IP is never stored, logged, or written to disk. You see "Belgium: 142 visits" in your dashboard, not "192.168.1.1 from Brussels."
      </p>

      <h3>Lightweight Script</h3>
      <p>
        The Pulse tracking script is under 2KB gzipped. Compare that to Google Analytics at ~45KB or Segment at ~70KB. A lighter script means faster page loads and less bandwidth consumption for your users. It loads asynchronously and never blocks rendering.
      </p>

      <h2>Implementation Guide</h2>
      <p>
        Adding Pulse to your website requires a single line of HTML. There is no npm package to install, no build step to configure, and no JavaScript framework dependency. Just add the following snippet to your page's <code>&lt;head&gt;</code> section:
      </p>
      <pre><code>&lt;script defer data-domain="yoursite.com" src="https://pulse.ciphera.net/script.js"&gt;&lt;/script&gt;</code></pre>
      <p>
        Replace <code>yoursite.com</code> with your actual domain. The <code>defer</code> attribute ensures the script loads without blocking page rendering, and the <code>data-domain</code> attribute tells Pulse which site this traffic belongs to.
      </p>
      <p>
        That is it. One line of HTML and you have privacy-first analytics running on your site. No configuration files, no environment variables, no API keys to manage.
      </p>
      <p>
        Pulse works with any framework or platform: static HTML sites, React, Next.js, Vue, Svelte, WordPress, Hugo, Jekyll, or any other tool that produces HTML. If your site renders a <code>&lt;head&gt;</code> tag, Pulse can run on it. For single-page applications, Pulse automatically detects client-side navigation via the History API, so page views are tracked correctly even without full page reloads.
      </p>

      <h2>Being Our Own First Customer</h2>
      <p>
        Ciphera runs Pulse on all of its own properties: ciphera.net, drop.ciphera.net, and our documentation. This is not just a statement of confidence; it is our primary feedback loop. Every limitation we encounter, every dashboard we wish existed, every metric that does not quite capture what we need -- these become features and fixes in the next release.
      </p>
      <p>
        Dogfooding Pulse has taught us that privacy-first analytics requires a mindset shift. You stop asking "what did this specific user do?" and start asking "what patterns do users collectively exhibit?" The latter question is almost always the one that actually drives product decisions.
      </p>

      <h2>What You See in the Dashboard</h2>
      <p>
        The Pulse dashboard is designed to surface the metrics that actually drive product decisions, without overwhelming you with data you do not need. Here is what you get:
      </p>
      <p>
        <strong>Key metrics available:</strong>
      </p>
      <ul>
        <li><strong>Page views:</strong> Total page loads across your site, broken down by page path</li>
        <li><strong>Unique visitors:</strong> Estimated daily unique visitors, computed without persistent identifiers</li>
        <li><strong>Bounce rate:</strong> Percentage of sessions with only a single page view</li>
        <li><strong>Session duration:</strong> Average time visitors spend on your site per session</li>
        <li><strong>Top pages:</strong> Your most visited pages, ranked by view count</li>
        <li><strong>Referrer sources:</strong> Where your traffic comes from (search engines, social media, direct, other sites)</li>
        <li><strong>Countries:</strong> Geographic distribution of your visitors at the country level</li>
        <li><strong>Devices:</strong> Desktop, tablet, and mobile breakdown</li>
        <li><strong>Browsers:</strong> Which browsers your visitors use (Chrome, Firefox, Safari, etc.)</li>
      </ul>
      <p>
        <strong>What is intentionally NOT shown:</strong>
      </p>
      <ul>
        <li>Individual user journeys or click paths</li>
        <li>Click heatmaps or scroll depth per user</li>
        <li>Session recordings or screen replays</li>
        <li>User IDs, email addresses, or any personal identifiers</li>
      </ul>
      <p>
        You get the metrics that drive product decisions without the surveillance that drives privacy concerns. This is a deliberate design choice, not a limitation. If you find yourself needing to watch individual session recordings to improve your product, the problem is usually with your product's information architecture, not with your analytics tool.
      </p>

      <h2>GDPR Compliance by Design</h2>
      <p>
        Most analytics tools try to be GDPR-compliant through configuration: anonymize IPs, reduce cookie duration, add consent flows. Pulse is GDPR-compliant <strong>by architecture</strong>. Since we never collect personal data as defined by the regulation, most GDPR obligations simply do not apply:
      </p>
      <ul>
        <li>No consent banners required (no cookies, no personal data processing)</li>
        <li>No Data Processing Agreements needed with Pulse (we do not process personal data on your behalf)</li>
        <li>No data subject access requests to fulfill (we cannot identify individuals in our dataset)</li>
        <li>No data breach notification obligations for analytics data (there is no personal data to breach)</li>
      </ul>
      <p>
        This is what "privacy by design" actually means in practice. It is not about adding privacy controls to a surveillance architecture. It is about building an architecture where surveillance is not possible in the first place.
      </p>

      <h2>Frequently Asked Questions</h2>
      <h3>Does Pulse comply with GDPR?</h3>
      <p>
        Yes, by architecture rather than by configuration. Pulse does not process personal data as defined by GDPR Article 4. Since no personal data is collected, stored, or processed, most GDPR obligations simply do not apply. You do not need a Data Processing Agreement (DPA) to use Pulse, because there is no personal data being processed on your behalf. This is a fundamentally different approach from tools that collect personal data and then try to handle it in a GDPR-compliant way.
      </p>
      <h3>Can I use Pulse without a cookie banner?</h3>
      <p>
        Yes. Pulse uses no cookies of any kind -- no first-party cookies, no third-party cookies, no session cookies, no persistent cookies. Because Pulse sets no cookies, no consent is required under the <a href="https://gdpr-info.eu/issues/cookies/" target="_blank" rel="noopener noreferrer">ePrivacy Directive</a> (the EU "cookie law"). You can remove your analytics-related cookie consent banner entirely. If you use other tools that do set cookies (such as advertising scripts or chat widgets), you may still need a banner for those, but Pulse itself will never be the reason you need one.
      </p>
      <h3>How does Pulse count unique visitors without cookies?</h3>
      <p>
        Pulse uses a combination of referrer chains and temporal proximity to estimate unique visitors, rather than persistent identifiers like cookies or fingerprints. When page views arrive from the same country and device type within a short time window via internal navigation, they are grouped into a logical session. This approach deliberately trades perfect accuracy for complete privacy. In practice, the margin of error is small enough to be useful for product decisions, which is the entire point of analytics. You may see slightly different numbers than a cookie-based tool would report, but the trends and patterns, which are what actually inform decisions, remain reliable.
      </p>

      <h2>Try Pulse</h2>
      <p>
        If you are running a website and want analytics that respect your users, Pulse provides the product insights you need without the privacy trade-offs you have been told are unavoidable. No cookies, no consent banners, no personal data. Just the metrics that matter.
      </p>
    `,
  },
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts[slug]

  if (!post) {
    return {
      title: 'Post Not Found | Ciphera Blog',
    }
  }

  return {
    title: `${post.title} | Ciphera Blog`,
    description: post.description,
    alternates: {
      canonical: `https://ciphera.net/blog/${slug}`,
    },
    openGraph: {
      title: `${post.title} | Ciphera Blog`,
      description: post.description,
      url: `https://ciphera.net/blog/${slug}`,
      siteName: 'Ciphera',
      type: 'article',
      locale: 'en_US',
      images: [{ url: '/ciphera_logo_no_margins.png', width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Ciphera Blog`,
      description: post.description,
      images: ['/ciphera_logo_no_margins.png'],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogPosts[slug]

  if (!post) {
    notFound()
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: 'https://ciphera.net/ciphera_logo_no_margins.png',
    datePublished: post.date,
    dateModified: post.date,
    wordCount: post.content.split(/\s+/).length,
    articleSection: post.category,
    author: {
      '@type': 'Organization',
      name: 'Ciphera',
      url: 'https://ciphera.net',
      logo: 'https://ciphera.net/ciphera_logo_no_margins.png',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ciphera',
      url: 'https://ciphera.net',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ciphera.net/ciphera_logo_no_margins.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://ciphera.net/blog/${slug}`,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ciphera.net' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://ciphera.net/blog' },
      { '@type': 'ListItem', position: 3, name: post.title },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema, breadcrumbSchema]) }} />
      {/* * Hero */}
      <section className="section-padding pt-32">
        <div className="section-container max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-brand-orange transition-colors mb-8"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="flex items-center gap-3 mb-6 text-sm">
            <span className="badge-neutral">{post.category}</span>
            <span className="text-neutral-500 dark:text-neutral-400">{post.readTime}</span>
            <span className="text-neutral-500 dark:text-neutral-400">
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-12">
            {post.title}
          </h1>

          <div
            className="prose prose-neutral dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-12 pt-12 border-t border-neutral-200 dark:border-neutral-800">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-brand-orange hover:underline"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to all posts
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }))
}
