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
    readTime: '8 min read',
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

      <h2>AES-256-GCM: The Cipher Behind It</h2>
      <p>
        Not all encryption algorithms are equal. At Ciphera, we use <strong>AES-256-GCM</strong> (Advanced Encryption Standard with 256-bit keys in Galois/Counter Mode). Here is why this choice matters:
      </p>
      <ul>
        <li><strong>AES-256</strong> provides a 256-bit key space, making brute-force attacks computationally infeasible. Even with all the computing power on Earth, breaking a single AES-256 key would take longer than the age of the universe.</li>
        <li><strong>GCM (Galois/Counter Mode)</strong> is an authenticated encryption mode. It does not just encrypt your data; it also generates an authentication tag that detects any tampering with the ciphertext. If a single bit is altered in transit or storage, decryption will fail rather than produce corrupted output.</li>
        <li>AES-256-GCM is hardware-accelerated on modern CPUs via AES-NI instructions, making it fast enough for real-time encryption of large files in the browser.</li>
      </ul>

      <h2>How Ciphera Drop Implements Zero-Knowledge Encryption</h2>
      <p>
        When you share a file through <strong>Ciphera Drop</strong>, here is exactly what happens:
      </p>
      <ul>
        <li>You select a file in your browser. A 256-bit AES key and a random initialization vector (IV) are generated using the Web Crypto API's <code>crypto.getRandomValues()</code>.</li>
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
    readTime: '6 min read',
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
    readTime: '7 min read',
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

      <h2>Being Our Own First Customer</h2>
      <p>
        Ciphera runs Pulse on all of its own properties: ciphera.net, drop.ciphera.net, and our documentation. This is not just a statement of confidence; it is our primary feedback loop. Every limitation we encounter, every dashboard we wish existed, every metric that does not quite capture what we need -- these become features and fixes in the next release.
      </p>
      <p>
        Dogfooding Pulse has taught us that privacy-first analytics requires a mindset shift. You stop asking "what did this specific user do?" and start asking "what patterns do users collectively exhibit?" The latter question is almost always the one that actually drives product decisions.
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
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Ciphera Blog`,
      description: post.description,
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
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: 'Ciphera',
      url: 'https://ciphera.net',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ciphera',
      url: 'https://ciphera.net',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://ciphera.net/blog/${slug}`,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
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
