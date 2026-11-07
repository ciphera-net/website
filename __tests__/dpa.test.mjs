// The processing agreement (/dpa, 29-10-2026, PUL-37). The Clauses are the Commission's, word for word: Clause 2(a)
// forbids changing them, so a hand edit is a defect, and only the choices the template leaves open may differ from the
// official text. These checks read the sources as text, like the rest of this suite.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8')

function clauses() {
  const src = read('lib/dpa/standard-clauses.ts')
  const marker = 'export const STANDARD_CLAUSES: ScSection[] = '
  return JSON.parse(src.slice(src.indexOf(marker) + marker.length))
}

test('the Clauses are Sections I to III, Clauses 1 to 10, and Clause 5 (docking) is not used', () => {
  const sections = clauses()
  assert.deepEqual(sections.map((s) => s.number), ['I', 'II', 'III'])
  assert.deepEqual(sections.flatMap((s) => s.clauses.map((c) => c.number)), ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])
  const c5 = sections[0].clauses[4]
  assert.equal(c5.optional, true)
  assert.equal(c5.notUsed, true)
  assert.equal(c5.blocks.length, 0)
})

test('every choice the template leaves open is made, and nothing else of the template remains', () => {
  const text = JSON.stringify(clauses())
  for (const left of ['[OPTION', 'OPTION 1', 'OPTION 2', '[SPECIFY', 'choose relevant option', '[Identity']) {
    assert.ok(!text.includes(left), `the Clauses still carry "${left}"`)
  }
})

test('Clause 2(a) is the official sentence, so a hand edit of the Clauses fails here', () => {
  const c2 = clauses()[0].clauses[1]
  assert.equal(
    c2.blocks[0].text,
    'The Parties undertake not to modify the Clauses, except for adding information to the Annexes or updating information in them.',
  )
})

test('Clause 7.7(a) is general written authorisation with 30 days’ notice (Option 2)', () => {
  const c7 = clauses()[1].clauses.find((c) => c.number === '7')
  const s77 = c7.blocks.find((b) => b.kind === 'sub' && b.number === '7.7')
  const a = s77.blocks.find((b) => b.label === 'a').text
  assert.match(a, /general authorisation/)
  assert.match(a, /at least 30 days in advance/)
})

test('the agreement is in force exactly 30 days after it is published', () => {
  const src = read('lib/dpa/agreement.ts')
  const date = (name) => new Date(`${src.match(new RegExp(`export const ${name} = '([^']+)'`))[1]} UTC`)
  const days = (date('DPA_IN_FORCE') - date('DPA_PUBLISHED')) / 86_400_000
  assert.equal(days, 30, 'Terms §15: 30 days’ notice of a material change')
})

test('Annex IV names only services the published sub-processor list carries', () => {
  const annex = read('lib/dpa/agreement.ts').match(/ANNEX_IV_SERVICES = \[([^\]]+)\]/)[1]
  const listed = read('lib/subprocessors.ts')
  for (const name of annex.match(/'([^']+)'/g).map((s) => s.slice(1, -1))) {
    assert.ok(listed.includes(`service: '${name}'`), `${name} is not in lib/subprocessors.ts`)
  }
})

test('the terms, the policy, the trust page, the footer, the sitemap and llms.txt all point to /dpa', () => {
  const terms = read('app/terms/page.tsx')
  assert.ok(terms.includes('href="/dpa"'), 'terms: no link to /dpa')
  assert.ok(terms.includes('9.3. California (CCPA)'), 'terms: no section 9.3')
  assert.ok(!terms.includes('available upon request at'), 'terms: still offers the agreement on request only')
  assert.ok(read('app/privacy/page.tsx').includes('href="/dpa"'), 'privacy: no link to /dpa')
  assert.ok(read('components/overhaul/trust/content.ts').includes("href: '/dpa'"), 'trust: the review kit does not link /dpa')
  assert.ok(read('components/overhaul/footer/footer-data.tsx').includes("href: '/dpa'"), 'footer: no /dpa')
  assert.ok(read('app/sitemap.ts').includes('/dpa`'), 'sitemap: no /dpa')
  assert.equal(read('scripts/generate-llms.ts').match(/\$\{SITE\}\/dpa/g)?.length, 2, 'llms.txt and llms-full.txt: /dpa')
})

test('Annex II states when deleted data leaves the backups (Art. 28(3)(g), Clause 10(d))', () => {
  const src = read('lib/dpa/agreement.ts')
  assert.match(src, /Deleted data leaves our backups within \d+ days\./)
  assert.ok(!src.includes('on their own schedule'), 'Annex II: the backup expiry is not stated')
})

test('Annex IV names each sub-processor’s contracting company and seat, and Bunny’s row reads as /trust does', () => {
  const src = read('lib/subprocessors.ts')
  for (const [service, entity] of [
    ['Infomaniak', 'Infomaniak Network SA, Geneva'],
    ['Exoscale', 'Akenes SA, Lausanne'],
    ['Bunny', 'BunnyWay, informacijske storitve d.o.o., Ljubljana'],
  ]) {
    assert.ok(src.includes(`service: '${service}',\n    entity: '${entity}',`), `${service}: no entity "${entity}"`)
  }
  assert.match(
    src,
    /service: 'Bunny',[\s\S]*?dataProcessed: 'Every request as it passes through, IP addresses included',\n {4}location: 'Slovenia, servers worldwide',/,
  )
  assert.ok(!src.includes('IP addresses (transient)'), 'Bunny: "transient" understates what its firewall keeps')
  for (const page of ['app/dpa/sections.tsx', 'app/privacy/page.tsx']) {
    assert.ok(read(page).includes('[subprocessorName(s), s.purpose, s.dataProcessed, s.location]'), `${page}: the table drops the company`)
  }
})

test('Annex III names the one store of IP addresses and User-Agent strings: the firewall, for 3 days', () => {
  const src = read('lib/dpa/agreement.ts')
  assert.ok(
    src.includes(
      'used when a request arrives and never stored, except that our content delivery network’s firewall keeps the requests it blocks or flags, with both, for 3 days.',
    ),
    'Annex III: the firewall exception is missing',
  )
  assert.ok(!src.includes('used when a request arrives and never stored. '), 'Annex III: the unqualified "never stored" is back')
})

test('Terms 9.3 item 6 promises only what the providers’ agreements say', () => {
  const src = read('lib/dpa/agreement.ts')
  assert.ok(src.includes('a written contract binds each one to process it only on our instructions and to keep it secure.'))
  assert.ok(!src.includes('binds each one to these terms'), 'item 6: no provider’s agreement mentions the CCPA')
})

test('a change to the legal pages moves every date that says when they last changed', () => {
  const sitemap = read('app/sitemap.ts')
  for (const name of ['privacy', 'terms']) {
    const src = read(`app/${name}/page.tsx`)
    const iso = src.match(/dateModified: '(\d{4}-\d{2}-\d{2})'/)[1]
    const shown = src.match(/Last updated: <time dateTime="(\d{4}-\d{2}-\d{2})">(\d{2})-(\d{2})-(\d{4})<\/time>/)
    assert.ok(shown, `${name}: no "Last updated" line`)
    assert.equal(shown[1], iso, `${name}: dateModified and the shown date differ`)
    assert.equal(`${shown[4]}-${shown[3]}-${shown[2]}`, iso, `${name}: the shown date and its dateTime differ`)
    const site = sitemap.match(new RegExp(`/${name}\`,\\n\\s+lastModified: '(\\d{4}-\\d{2}-\\d{2})'`))[1]
    assert.equal(site, iso, `${name}: the sitemap's lastModified differs`)
  }
  const privacy = read('app/privacy/page.tsx')
  const meta = privacy.match(/Last updated (\d{2})-(\d{2})-(\d{4})\.'/)
  assert.equal(`${meta[3]}-${meta[2]}-${meta[1]}`, privacy.match(/dateModified: '(\d{4}-\d{2}-\d{2})'/)[1], 'privacy: the meta description carries another date')
})

test('the privacy policy, the Terms and the README claim only what holds about IP addresses and logs (02-11-2026)', () => {
  const privacy = read('app/privacy/page.tsx')
  for (const gone of ['not by us, not by anyone', 'Only transient connection data', 'an exhaustive breakdown of every category', 'retained only as long as necessary']) {
    assert.ok(!privacy.includes(gone), `privacy still says "${gone}"`)
  }
  assert.ok(privacy.includes('cannot be recovered from anything we store.'))
  assert.match(privacy, /Our own logs keep no IP addresses of visitors or users and are deleted within <span[^>]*>30 days<\/span>/)
  assert.match(privacy, /its firewall keeps the requests it blocks or flags for <span[^>]*>3 days<\/span>/)
  const terms = read('app/terms/page.tsx')
  assert.ok(!terms.includes('only aggregated, anonymous data'), 'terms: Pulse keeps per-visit data, which the DPA lists as personal data')
  assert.ok(terms.includes('Pulse sets no cookies and never stores the IP addresses of website visitors.'))
  assert.ok(!read('README.md').includes('No tracking or analytics by default'), 'README: the site runs its own Pulse tag')
  for (const f of ['scripts/pages-seed/pulse.json', 'components/PulseFAQ.tsx']) {
    assert.ok(!/never logged|written to disk|0 seconds — discarded/.test(read(f)), `${f}: an absolute the CDN's firewall contradicts`)
  }
})

test('the privacy policy says a display name also lives in encrypted team copies, in the three places that describe the vault (07-11-2026)', () => {
  const privacy = read('app/privacy/page.tsx')
  const bullet = (label) => {
    const m = privacy.match(new RegExp(`<li><strong>${label}</strong>(.*?)</li>`))
    assert.ok(m, `privacy: no "${label}" bullet`)
    return m[1]
  }
  for (const gone of ['stored only inside your client-encrypted', 'live only inside your account vault']) {
    assert.ok(!privacy.includes(gone), `privacy still says "${gone}"`)
  }
  const name = bullet('Display name')
  for (const claim of [
    'it is stored inside your client-encrypted account vault and never held on our servers in readable form.',
    'If you are in a Pulse team, your browser also encrypts it separately for each teammate,',
    'which we never hold; our servers keep those encrypted copies without being able to read them.',
    'The copies made for a teammate are deleted from the live database when that teammate leaves the team.',
    'after you leave, so the team&rsquo;s activity log can still show who did what, and are deleted earlier if you clear your display name or delete your account.',
  ]) {
    assert.ok(name.includes(claim), `privacy, display name: missing "${claim}"`)
  }
  assert.match(name, /kept for up to <span[^>]*>twelve months<\/span> after you leave/)
  const vault = bullet('Stored in your vault, not on our servers:')
  assert.ok(vault.includes('They live inside your account vault, which is encrypted on your device under a key we never hold; if you are in a Pulse team, your display name also lives in encrypted copies for each teammate that only their browsers can open.'))
  // The mail service's copy of the email address (section 4.5) shares these two bullets with the team copies:
  // an edit made from an older base must not drop either claim.
  assert.ok(vault.includes('Our mail service keeps a separately encrypted copy of your email address so it can email you (section 4.5).'))
  const breach = bullet('What a database breach would expose:')
  assert.ok(breach.includes('Only encrypted vaults, encrypted team copies of display names, your encrypted team key, public keys that identify nothing, keyed hashes, your OPAQUE credential record and the mail service&rsquo;s encrypted copy of your email address'))
})

test('the trust page\'s "Who can read what" names the Pulse teammates who read a display name, and nothing else of theirs (07-11-2026)', () => {
  const trust = read('components/overhaul/trust/content.ts')
  const rows = [...trust.matchAll(/\{ who: '([^']+)', can: \[(true|false), (true|false), (true|false)\] \}/g)].map((m) => [m[1], m.slice(2, 5).join(',')])
  assert.ok(trust.includes("columns: ['Your password', 'Your name', 'Your email address']"), 'trust: the columns moved, so the can order below means something else')
  assert.deepEqual(rows, [
    ['You, in your browser', 'true,true,true'],
    ['Your Pulse teammates, in their browsers', 'false,true,false'],
    ['Our mail service', 'false,false,true'],
    ['Our sign-in server', 'false,false,false'],
  ])
})
