import type { GlossaryTerm } from './types'

/**
 * Cryptography & authentication terms. These describe primitives Ciphera
 * ships in production (Tessera / Ciphera ID), so wording is checked against
 * the actual implementation — edit with care.
 */
export const cryptoTerms: GlossaryTerm[] = [
  {
    slug: 'opaque',
    term: 'OPAQUE',
    category: 'Cryptography & authentication',
    short:
      'OPAQUE is an asymmetric password-authenticated key exchange (aPAKE) protocol, standardized in RFC 9807, that lets a server verify a password without ever seeing it — the password never leaves the client, even during registration.',
    paragraphs: [
      'Traditional login forms send your password to the server, which hashes and compares it. Even with TLS and good hashing, the server momentarily holds the plaintext password — so a compromised or malicious server can capture it. OPAQUE removes that exposure entirely: the password is never transmitted in any form, hashed or otherwise.',
      'It works by combining an oblivious pseudorandom function (OPRF) with an authenticated key exchange. During registration, the client and server run the OPRF so the client can derive a strong key from the password without the server learning either the password or the key. The client uses that key to encrypt a small "envelope" of key material, which the server stores alongside its OPRF secret — together called the password file or registration record.',
      'At login, the client re-runs the OPRF against the server, decrypts its envelope locally, and the two sides complete a mutually authenticated key exchange. A wrong password simply fails to decrypt the envelope. The server learns one bit: the login succeeded or it did not.',
      'A breached OPAQUE server yields no passwords, no password hashes in the conventional offline-crackable sense, and no reusable credentials — an attacker who steals the registration record must still perform an online OPRF exchange per guess, which the server can rate-limit. This is the core difference from classic schemes where a stolen database enables unlimited offline cracking.',
      'OPAQUE also produces an export key: a client-side secret, derived from the password, that the server never learns. This is what makes OPAQUE a foundation for zero-knowledge applications — the export key can encrypt user data (a vault key, for example) so the operator is architecturally unable to read it.',
      'Ciphera ID uses OPAQUE for all password authentication, via Tessera — Ciphera’s open-source OPAQUE implementation (Rust core with Go and TypeScript SDKs, Apache-2.0). The export key unwraps each account’s vault master key locally, so credentials and vault contents are unreadable to Ciphera by construction.',
    ],
    related: ['pake', 'oprf', 'zero-knowledge-authentication', 'blind-index', 'srp', 'key-stretching'],
    see: [
      { label: 'RFC 9807 — The OPAQUE Asymmetric PAKE Protocol', href: 'https://www.rfc-editor.org/rfc/rfc9807' },
      { label: 'Tessera — open-source OPAQUE (Rust, Go, TypeScript)', href: 'https://github.com/ciphera-net/tessera' },
      { label: 'Ciphera ID — zero-knowledge authentication', href: '/products/id' },
    ],
    faq: [
      {
        q: 'Is OPAQUE better than SRP?',
        a: 'For new systems, yes. SRP-6a predates modern security proofs, requires the server to store a password-derived verifier that is offline-attackable after a breach, and resists instantiation with modern elliptic curves. OPAQUE has a formal security model, hides the password even from the server during registration, and is the IETF-standardized successor (RFC 9807).',
      },
      {
        q: 'What does a breached OPAQUE server reveal?',
        a: 'The attacker gets per-user registration records and the server’s OPRF key. Passwords cannot be read from them, and offline guessing is not possible without replaying the OPRF per guess — which requires the server’s participation and is rate-limitable. User data encrypted under the export key stays sealed.',
      },
      {
        q: 'Does OPAQUE replace TLS?',
        a: 'No. OPAQUE runs inside a TLS session. TLS protects the transport; OPAQUE removes the need to trust the server with the password itself.',
      },
      {
        q: 'Can I use OPAQUE in production today?',
        a: 'Yes. RFC 9807 was published in 2025 and production implementations exist — Ciphera runs OPAQUE for all sign-ins via Tessera, which is open source under Apache-2.0 with Rust, Go, and TypeScript packages.',
      },
    ],
  },
  {
    slug: 'pake',
    term: 'PAKE (password-authenticated key exchange)',
    category: 'Cryptography & authentication',
    short:
      'A PAKE is a cryptographic protocol in which two parties use a shared password to establish a strong session key — without ever transmitting the password or exposing it to offline guessing from intercepted traffic.',
    paragraphs: [
      'The problem PAKEs solve: passwords are low-entropy secrets, and anything derived from them naively (hashes, simple challenge-responses) can be brute-forced offline once observed. A PAKE binds the password into a key exchange such that an eavesdropper — or an active man-in-the-middle — learns nothing they can grind against a dictionary; each password guess costs a live protocol run.',
      'PAKEs come in two families. In a balanced PAKE, both sides know the password. In an asymmetric or augmented PAKE (aPAKE) — the family relevant to client-server login — the server stores only derived material, never anything password-equivalent, so a database breach does not directly hand the attacker usable credentials. OPAQUE is the modern, IETF-standardized aPAKE; SRP is its widely deployed predecessor.',
    ],
    related: ['opaque', 'srp', 'oprf', 'zero-knowledge-authentication'],
    see: [{ label: 'RFC 9807 (OPAQUE, the standardized aPAKE)', href: 'https://www.rfc-editor.org/rfc/rfc9807' }],
  },
  {
    slug: 'oprf',
    term: 'OPRF (oblivious pseudorandom function)',
    category: 'Cryptography & authentication',
    short:
      'An OPRF is a two-party protocol where a server holding a secret key helps a client evaluate a pseudorandom function on the client’s input — without the server learning the input or the output, and without the client learning the key.',
    paragraphs: [
      'Think of it as a blind keyed hash: the client wants F(key, password) but must not reveal the password; the server owns the key but must not learn what it was applied to. The client blinds its input, the server evaluates on the blinded value, and the client unblinds the result.',
      'OPRFs are the engine inside OPAQUE: they let a client stretch its password into a strong encryption key with the server’s participation, which is what forces password guessing to be an online, rate-limitable event instead of an offline dictionary attack. They also appear in private set intersection and privacy-preserving credential checkers (the "has this password been breached" lookups that never send your password).',
    ],
    related: ['opaque', 'pake', 'key-stretching'],
  },
  {
    slug: 'zero-knowledge',
    term: 'Zero-knowledge',
    category: 'Cryptography & authentication',
    short:
      'In applied privacy engineering, zero-knowledge describes systems designed so the service operator cannot read user data or secrets — verification and storage work without the server ever holding the plaintext.',
    paragraphs: [
      'The term originates in the theory of zero-knowledge proofs, where one party proves a statement is true without revealing why. Product engineering borrows it more broadly: a zero-knowledge service is one where, by architecture rather than policy, the operator holds only ciphertext and derived records it cannot invert.',
      'The distinction that matters is capability versus promise. A privacy policy says the operator will not look; a zero-knowledge design means the operator cannot — a subpoena, an insider, or a full database breach yields nothing readable. That property has to be built in: keys derived and held client-side, encryption before transmission, and authentication protocols that never expose the secret.',
      'Ciphera applies this where the mathematics permits it: OPAQUE authentication (the server never sees passwords), client-side encrypted vaults (unwrapped by a key the server never learns), and blind-indexed lookups. Where zero-knowledge is not the right tool — analytics, email delivery — the honest alternative is data minimization, not the label.',
    ],
    related: ['zero-knowledge-authentication', 'opaque', 'end-to-end-encryption', 'blind-index'],
  },
  {
    slug: 'zero-knowledge-authentication',
    term: 'Zero-knowledge authentication',
    category: 'Cryptography & authentication',
    short:
      'Authentication in which the server verifies you know your password without ever receiving it — during signup or login, in any form. The standard construction today is an aPAKE such as OPAQUE (RFC 9807).',
    paragraphs: [
      'Almost every login form on the web sends the password to the server inside TLS. The server is trusted to hash it and forget it — and that trust is exactly what phishing infrastructure, compromised servers, and malicious insiders exploit. Zero-knowledge authentication removes the transmission entirely: the client proves knowledge of the password through a cryptographic exchange, and the server ends up with a yes/no.',
      'Beyond keeping the password private, the approach yields a second prize: a client-only secret (OPAQUE’s export key) that can seal user data. Login and end-to-end encryption then share one root secret the user already has — their password — without the server ever being able to derive it.',
      'Ciphera ID authenticates every account this way. The password never reaches Ciphera’s servers; what is stored is an OPAQUE registration record plus a vault key wrapped under the client-side export key.',
    ],
    related: ['opaque', 'pake', 'zero-knowledge', 'passkeys'],
    see: [{ label: 'Ciphera ID', href: '/products/id' }],
  },
  {
    slug: 'blind-index',
    term: 'Blind index',
    category: 'Cryptography & authentication',
    short:
      'A blind index is a keyed, deterministic hash of a field (such as an email address) stored in place of the plaintext, so a database can look records up by exact match without holding — or leaking — the value itself.',
    paragraphs: [
      'Encrypting a column normally breaks lookups: two encryptions of the same value differ, so WHERE email = ? stops working. A blind index restores exact-match capability by storing a deterministic derivation of the value — computed with a slow or keyed function — alongside the ciphertext. The database can find the row; nobody browsing the database can read the addresses.',
      'The derivation must resist offline guessing, since email addresses are low-entropy and enumerable. That means a secret key unavailable to the database, an expensive derivation, or both.',
      'Ciphera ID uses a client-side blind index for account lookup: the email address is stretched through PBKDF2 with 1,000,000 iterations in the browser, and only that digest travels to the server as the lookup key. The server can match a returning user without ever storing the address in searchable plaintext.',
    ],
    related: ['key-stretching', 'zero-knowledge', 'opaque'],
  },
  {
    slug: 'key-stretching',
    term: 'Key stretching',
    category: 'Cryptography & authentication',
    short:
      'Key stretching turns a low-entropy secret like a password into a stronger key by making each derivation deliberately expensive — thousands to millions of iterations, or memory-hard computation — so brute-force guessing becomes uneconomical.',
    paragraphs: [
      'A password has perhaps 30–60 bits of real entropy; an attacker with a stolen hash tries billions of guesses per second on GPUs. Stretching inserts a cost multiplier: PBKDF2 iterates a hash, bcrypt adds per-guess work, scrypt and Argon2 add memory-hardness that GPUs and ASICs cannot amortize away.',
      'Stretching appears anywhere a human secret becomes a cryptographic key: password storage, key derivation for encrypted vaults, and lookup-key derivation (Ciphera’s blind index runs PBKDF2 at one million iterations client-side; vault key derivation uses Argon2id in the browser). It complements — never replaces — protocols like OPAQUE that keep the secret off the server entirely.',
    ],
    related: ['argon2id', 'blind-index', 'opaque'],
  },
  {
    slug: 'argon2id',
    term: 'Argon2id',
    category: 'Cryptography & authentication',
    short:
      'Argon2id is the recommended variant of Argon2, winner of the Password Hashing Competition: a memory-hard key-derivation function that makes password guessing expensive on GPUs and custom hardware, while resisting side-channel attacks.',
    paragraphs: [
      'Argon2 comes in three variants: Argon2d (fastest, data-dependent memory access, side-channel sensitive), Argon2i (data-independent access), and Argon2id, which runs the first pass independent and the rest dependent — the practical default recommended by RFC 9106 and OWASP.',
      'Memory-hardness is the point: each guess requires holding tens of megabytes, so an attacker cannot pack thousands of parallel attempts onto a GPU the way they can against SHA-based PBKDF2. Parameters (memory, iterations, parallelism) are tuned to the slowest acceptable legitimate login.',
      'Ciphera ID runs Argon2id client-side when stretching account secrets — the cost is paid in the user’s browser, and what leaves the device is already high-entropy key material.',
    ],
    related: ['key-stretching', 'blind-index'],
    see: [{ label: 'RFC 9106 — Argon2', href: 'https://www.rfc-editor.org/rfc/rfc9106' }],
  },
  {
    slug: 'hkdf',
    term: 'HKDF',
    category: 'Cryptography & authentication',
    short:
      'HKDF (HMAC-based key derivation function, RFC 5869) expands one strong secret into any number of independent, purpose-bound keys via extract-then-expand — the standard way to turn a shared secret into separate encryption, signing, and session keys.',
    paragraphs: [
      'Reusing one key for multiple purposes is a classic protocol flaw. HKDF solves it in two steps: extract compresses input keying material into a uniform pseudorandom key, and expand derives per-purpose keys from it using distinct info labels — so a compromise or misuse of one derived key tells an attacker nothing about its siblings.',
      'HKDF is not for passwords — it assumes its input already has full entropy (a Diffie-Hellman result, an export key, a random master key). Passwords go through key stretching first; HKDF then fans the result out. Protocols like TLS 1.3 and OPAQUE use HKDF internally, and Ciphera uses it to derive purpose-separated keys from vault master secrets.',
    ],
    related: ['key-stretching', 'opaque', 'aes-256-gcm'],
    see: [{ label: 'RFC 5869 — HKDF', href: 'https://www.rfc-editor.org/rfc/rfc5869' }],
  },
  {
    slug: 'end-to-end-encryption',
    term: 'End-to-end encryption (E2EE)',
    category: 'Cryptography & authentication',
    short:
      'End-to-end encryption means data is encrypted on the sender’s device and decrypted only on the recipient’s — every intermediary, including the service operator, handles ciphertext it cannot read.',
    paragraphs: [
      'The phrase draws a line at key possession. Encryption in transit (TLS) protects the wire but terminates at the server, which sees plaintext; encryption at rest protects stolen disks but the operator holds the keys. E2EE keeps the keys exclusively at the endpoints, so the operator’s servers, backups, and staff are outside the trust boundary.',
      'The engineering burden moves to key management: generating keys on-device, exchanging or wrapping them safely, and recovering from device loss without reintroducing a readable copy. Systems that offer operator-assisted password reset for encrypted data are, by definition, not end-to-end encrypted — someone else could decrypt.',
      'At Ciphera, account vaults are E2EE: the vault master key is a non-extractable browser key unwrapped via the OPAQUE export key, so it exists in usable form only on the user’s device.',
    ],
    related: ['zero-knowledge', 'aes-256-gcm', 'opaque'],
  },
  {
    slug: 'aes-256-gcm',
    term: 'AES-256-GCM',
    category: 'Cryptography & authentication',
    short:
      'AES-256-GCM is authenticated encryption: the AES block cipher with 256-bit keys in Galois/Counter Mode, providing confidentiality and integrity in one pass — tampered ciphertext fails authentication instead of decrypting to garbage.',
    paragraphs: [
      'GCM matters because encryption without authentication is exploitable: attackers can flip ciphertext bits and observe how systems react. GCM computes an authentication tag over the ciphertext (and optional associated data), so any modification is detected before a single byte is accepted.',
      'Its critical operational rule is nonce uniqueness — reusing a nonce under the same key is catastrophic for both confidentiality and the ability to forge tags. Correct implementations derive fresh nonces per message (randomly, or via counters) and rotate keys well before birthday bounds.',
      'AES-GCM is hardware-accelerated on effectively all modern CPUs and is the workhorse of TLS 1.3 and client-side encryption, including the vault encryption in Ciphera services.',
    ],
    related: ['end-to-end-encryption', 'hkdf'],
  },
  {
    slug: 'passkeys',
    term: 'Passkeys (WebAuthn / FIDO2)',
    category: 'Cryptography & authentication',
    short:
      'Passkeys are public-key login credentials based on the FIDO2/WebAuthn standards: your device holds a private key and signs a per-site challenge, so there is no shared secret to phish, leak, or reuse across sites.',
    paragraphs: [
      'Each passkey is a keypair scoped to one origin. At login the site sends a random challenge; the authenticator — phone, laptop, or security key — signs it after local user verification (biometric or PIN). The server stores only the public key, which is worthless to steal, and the origin binding defeats phishing: a lookalike domain cannot request a signature valid for the real one.',
      'Because private keys sync through platform keychains or stay on hardware, there is nothing for a user to type and nothing for a breach to expose. The residual risks move to account-recovery design and the security of the platform keychain itself.',
      'Ciphera ID supports passkeys alongside OPAQUE passwords and TOTP — the password path itself is already unphishable-by-server since the server never receives it, and passkeys extend that property against lookalike-site phishing.',
    ],
    related: ['zero-knowledge-authentication', 'totp', 'opaque'],
    see: [{ label: 'Ciphera ID — passkeys & 2FA', href: '/products/id' }],
  },
  {
    slug: 'pkce',
    term: 'PKCE',
    category: 'Cryptography & authentication',
    short:
      'PKCE (Proof Key for Code Exchange, RFC 7636) hardens the OAuth 2.0 authorization-code flow: the client commits to a one-time secret up front, so an intercepted authorization code is useless without it.',
    paragraphs: [
      'The attack PKCE kills: authorization codes travel through browser redirects, and anything that can observe the redirect — a malicious app registered for the same URL scheme, a leaky log — could historically exchange the stolen code for tokens. With PKCE the client sends a hash (the code challenge, S256) when authorization starts and must present the preimage (the code verifier) when redeeming the code. Interceptors hold a code they cannot spend.',
      'Originally designed for mobile apps that cannot keep a client secret, PKCE is now the recommended default for every OAuth client — OAuth 2.1 makes it mandatory. Ciphera ID requires PKCE with S256 on all authorization-code flows; the plain method is rejected.',
    ],
    related: ['jwt', 'zero-knowledge-authentication'],
    see: [{ label: 'RFC 7636 — PKCE', href: 'https://www.rfc-editor.org/rfc/rfc7636' }],
  },
  {
    slug: 'jwt',
    term: 'JWT (JSON Web Token)',
    category: 'Cryptography & authentication',
    short:
      'A JWT is a compact, signed token carrying claims (user ID, expiry, scopes) that services can verify statelessly — any holder of the verification key can check authenticity without a database lookup.',
    paragraphs: [
      'A JWT is three base64url segments: a header naming the algorithm, a claims payload, and a signature over both. Verification is local and fast, which is why JWTs dominate service-to-service auth and API sessions. The cost of statelessness is revocation: a signed token stays valid until expiry, so real systems pair short-lived access tokens with longer-lived, revocable refresh tokens.',
      'The classic implementation mistakes are accepting the token’s own header as the source of truth (the alg=none and key-confusion attacks), putting secrets in the readable payload, and issuing long expiries. Ciphera services verify JWTs statelessly with 15-minute access tokens and 30-day rotating refresh tokens.',
    ],
    related: ['pkce', 'totp'],
  },
  {
    slug: 'totp',
    term: 'TOTP (time-based one-time password)',
    category: 'Cryptography & authentication',
    short:
      'TOTP (RFC 6238) generates six-digit codes from a shared secret and the current time, giving accounts a second factor that changes every 30 seconds and works fully offline in any authenticator app.',
    paragraphs: [
      'Enrollment shares a random secret (the QR code); afterwards both sides compute HMAC(secret, time window) and compare. Because the code is valid for seconds and never travels until the user types it, database leaks of password hashes alone stop being sufficient for account takeover.',
      'TOTP’s limits are worth knowing: codes can be phished in real time by a proxying attacker, and the server must store the shared secret (unlike passkeys, where it stores only a public key). It remains an excellent, vendor-neutral second factor — Ciphera ID offers TOTP alongside passkeys, with rate-limited verification.',
    ],
    related: ['passkeys', 'jwt'],
  },
  {
    slug: 'srp',
    term: 'SRP (Secure Remote Password)',
    category: 'Cryptography & authentication',
    short:
      'SRP is a 1990s password-authenticated key exchange that lets clients log in without sending the password. It was the workhorse aPAKE for two decades and is now superseded by OPAQUE (RFC 9807).',
    paragraphs: [
      'SRP-6a advanced the state of the art enormously: the server stores a verifier rather than the password, and eavesdroppers learn nothing usable. Its age shows in the details — it lacks a modern security proof, leaks the salt to unauthenticated parties (enabling precomputation against a later breach), resists safe instantiation on modern elliptic curves, and its verifier is offline-crackable once stolen.',
      'OPAQUE addresses each of those: proofs in a standard model, no salt disclosure (the OPRF hides it), curve-native operation, and breach resistance that forces per-guess online interaction. Ciphera ID ran SRP-6a historically and completed a full migration to OPAQUE in June 2026; SRP remains in this glossary because so much deployed software still speaks it.',
    ],
    related: ['opaque', 'pake'],
  },
]
