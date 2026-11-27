import { test, before } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * FAQ answers keep their links (27-11-2026). The CMS FAQ block stores its answer as HTML and writes it into `data-a`
 * with every `&` encoded; `extractFaqs` decodes that once and splits the answer into its plain words (`answer`, read by
 * the FAQPage data and the recovery-copy guards) and, only when markup is left, its sanitised inline HTML
 * (`answerHtml`). Exact strings: the published corpus must not move, and the stored HTML is what the page parses.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, '__tests__', 'render', '.out')
const outFile = join(outDir, 'faq-answer-links.mjs')

const pageOutFile = join(outDir, 'faq-answer-links-page.mjs')
const shim = (name) => join(root, '__tests__', 'render', name)

let result
let pageResult

before(() => {
  mkdirSync(outDir, { recursive: true })
  execFileSync(
    'npx',
    [
      '--yes', 'esbuild',
      join(root, '__tests__', 'render', 'faq-answer-links-entry.tsx'),
      '--bundle', '--platform=node', '--format=esm', '--target=node20',
      `--tsconfig=${join(root, 'tsconfig.json')}`,
      '--packages=external',
      `--alias:next/link=${shim('shim-next-link.tsx')}`,
      `--outfile=${outFile}`,
    ],
    { cwd: root, stdio: ['ignore', 'ignore', 'inherit'] }
  )
  result = JSON.parse(execFileSync('node', [outFile], { cwd: root, encoding: 'utf-8' }))

  // CmsPage reaches the product registries, whose captcha mockup loads lib/env.ts: it refuses to load without the two
  // public URLs. The FAQ render reads neither, so placeholders do.
  execFileSync(
    'npx',
    [
      '--yes', 'esbuild',
      join(root, '__tests__', 'render', 'faq-answer-links-page-entry.tsx'),
      '--bundle', '--platform=node', '--format=esm', '--target=node20',
      `--tsconfig=${join(root, 'tsconfig.json')}`,
      '--packages=external',
      `--alias:next/link=${shim('shim-next-link.tsx')}`,
      `--alias:next/image=${shim('shim-next-image.tsx')}`,
      `--alias:next/navigation=${shim('shim-next-navigation.ts')}`,
      `--outfile=${pageOutFile}`,
    ],
    { cwd: root, stdio: ['ignore', 'ignore', 'inherit'] }
  )
  pageResult = JSON.parse(
    execFileSync('node', [pageOutFile], {
      cwd: root,
      encoding: 'utf-8',
      env: {
        ...process.env,
        NEXT_PUBLIC_WEBSITE_API_URL: 'https://example.invalid',
        NEXT_PUBLIC_CAPTCHA_API_URL: 'https://example.invalid/api/v1',
      },
    })
  )
}, 60_000)

test('a link in an answer is kept as answerHtml, with the plain words in answer', () => {
  assert.deepEqual(result.link, [
    {
      question: 'Q',
      answer: 'Privacy by default is one of the seven principles of privacy by design.',
      answerHtml: 'Privacy by default is one of the <a href="/glossary/privacy-by-design">seven principles of privacy by design</a>.',
    },
  ])
})

test('a tag the editor typed as text stays text: it is never read as markup', () => {
  assert.deepEqual(result.typedTag, [
    {
      question: 'Q',
      answer: 'Wrap it in <code>, then read the docs.',
      answerHtml: 'Wrap it in &#x3C;code>, then read <a href="/docs">the docs</a>.',
    },
  ])
})

test('an answer the CMS wrote before the change (plain text, esc_attr) reads exactly as it did, with no answerHtml', () => {
  assert.deepEqual(result.legacy, [{ question: 'Is it "free"?', answer: "It's free & open, 100% of it." }])
  // The one edge in the published corpus (27-11-2026): a trailing no-break space, kept as it was.
  assert.deepEqual(result.legacyNbsp, [{ question: 'Q', answer: 'Audits with staff training.\u00a0' }])
})

test('a link with an unsafe href is left as its words, and a script goes with its content', () => {
  assert.deepEqual(result.unsafe, [{ question: 'Q', answer: 'Click here now.' }])
  assert.deepEqual(result.script, [{ question: 'Q', answer: 'Safe text.' }])
})

test('tags outside the allowlist are unwrapped with their words kept, and a paragraph break becomes a line break', () => {
  assert.deepEqual(result.unwrap, [
    { question: 'Q', answer: 'One two three. Four five.', answerHtml: 'One two three.<br>Four <strong>five</strong>.' },
  ])
})

test("a new-tab link keeps its target and only the allowed rel tokens", () => {
  assert.deepEqual(result.newTab, [
    {
      question: 'Q',
      answer: 'See the source.',
      answerHtml: 'See <a href="https://example.com/x" target="_blank" rel="nofollow">the source</a>.',
    },
  ])
})

test('decodeEntities decodes once, in one pass, and still decodes every entity WordPress writes into an attribute', () => {
  assert.equal(result.decodeOnce, '&lt;b&gt;')
  assert.equal(result.decodeTag, '<a href="/x">')
  assert.equal(result.decodeQuotes, `It's 'a' 'b' "c" d e`)
})

// ── The page (picked 27-11-2026): an answer's link is the post body's own link ─────────────────────────────
const CUE = '<span class="sr-only select-none"> (opens in a new tab)</span>'

test("an answer's link renders inside the <dd> with the post body's link class, through next/link for a site path", () => {
  assert.equal(result.linkClass, 'post-body-link')
  assert.equal(
    result.renderedLink,
    '<dd>Privacy by default is one of the <a class="post-body-link" href="/glossary/privacy-by-design">seven principles of privacy by design</a>.</dd>'
  )
})

test("a new-tab link in an answer keeps the editor's nofollow first, adds noopener and noreferrer, and the hidden cue", () => {
  assert.equal(
    result.renderedNewTab,
    `<dd>Read <a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj" target="_blank" rel="nofollow noopener noreferrer" class="post-body-link">the regulation${CUE}</a>.</dd>`
  )
})

test('an answer without markup renders as its words, escaped by React, exactly as before', () => {
  assert.equal(result.renderedPlain, '<dd>It&#x27;s free &amp; open, 100% of it.</dd>')
  assert.equal(result.renderedNoHtml, '<dd>Words only.</dd>')
})

test("the FAQ link and the post body's link are ONE rule in styles/globals.css, so they cannot drift", () => {
  const css = readFileSync(join(root, 'styles', 'globals.css'), 'utf-8')
  assert.match(css, /\.prose a,\s*a\.post-body-link\s*\{[^}]*text-brand-orange[^}]*text-decoration-color:\s*rgba\(253, 94, 15, 0\.3\)/)
  assert.match(css, /\.prose a:hover,\s*a\.post-body-link:hover\s*\{\s*text-decoration-color:\s*#fd5e0f;/)
  assert.match(css, /a\.post-body-link\s*\{\s*font-weight:\s*500;\s*\}/)
})

// ── Page FAQ sections (27-11-2026): CmsPage, through the page build, with Facet's FaqBlock and FaqTabs ────────────
const blockRow = (inner) => `<p class="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">${inner}</p>`
const tabsRow = (inner) => `<p class="pb-4 text-muted-foreground">${inner}</p>`
/** The FAQPage data a page emits, parsed (JSON.parse reads the <-style escapes jsonLdHtml writes). */
const faqPageOf = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)]
    .map((m) => JSON.parse(m[1]))
    .find((d) => d['@type'] === 'FAQPage')
const answersOf = (html) => faqPageOf(html).mainEntity.map((q) => q.acceptedAnswer.text)
const FADP_LINK = (cls) => `Swiss law has its own act, the <a class="${cls}" href="/glossary/fadp">FADP</a>.`

test("a page FAQ answer's link renders in its row with the page's own link class, and the FAQPage data holds the words", () => {
  const { sections, repairs, html } = pageResult.faqLink
  assert.deepEqual(sections, [
    {
      type: 'faq',
      items: [
        {
          question: 'Does Swiss law apply?',
          answer: 'Swiss law has its own act, the FADP.',
          answerHtml: 'Swiss law has its own act, the <a href="/glossary/fadp">FADP</a>.',
        },
      ],
    },
  ])
  assert.deepEqual(repairs, [])
  assert.ok(html.includes(blockRow(FADP_LINK('text-primary hover:underline'))), html)
  assert.deepEqual(answersOf(html), ['Swiss law has its own act, the FADP.'])
})

test("on Tessera's page the answer's link keeps that page's always-underlined link", () => {
  const { html } = pageResult.faqLinkTessera
  assert.ok(html.includes(blockRow(FADP_LINK('text-primary underline'))), html)
  assert.deepEqual(answersOf(html), ['Swiss law has its own act, the FADP.'])
})

test('a page FAQ answer without markup, and a tag the editor typed as text, render as words exactly as before', () => {
  assert.equal(pageResult.faqPlain.sections[0].items[0].answerHtml, undefined)
  assert.ok(pageResult.faqPlain.html.includes(blockRow('It&#x27;s free &amp; open, 100% of it.')))
  assert.deepEqual(answersOf(pageResult.faqPlain.html), ["It's free & open, 100% of it."])
  assert.deepEqual(pageResult.faqTypedTag.sections[0].items, [{ question: 'Does Swiss law apply?', answer: 'Wrap it in <code> first.' }])
  assert.ok(pageResult.faqTypedTag.html.includes(blockRow('Wrap it in &lt;code&gt; first.')))
  assert.deepEqual(answersOf(pageResult.faqTypedTag.html), ['Wrap it in <code> first.'])
})

test("a tabbed FAQ answer's link renders in its row with the page's link class", () => {
  const { sections, repairs, html } = pageResult.tabsLink
  assert.deepEqual(sections[0].items, [
    {
      categoryKey: 'general',
      question: 'Question 1',
      answer: 'Swiss law has its own act, the FADP.',
      answerHtml: 'Swiss law has its own act, the <a href="/glossary/fadp">FADP</a>.',
    },
    { categoryKey: 'general', question: 'Question 2', answer: 'Words only.' },
  ])
  assert.deepEqual(repairs, [])
  assert.ok(html.includes(tabsRow(FADP_LINK('text-primary hover:underline'))), html)
  assert.ok(html.includes(tabsRow('Words only.')))
})

test('a tabbed FAQ answer with markup and no words counts as no answer: the item is dropped, and a section left empty', () => {
  assert.deepEqual(
    pageResult.tabsWordless.sections[0].items.map((i) => i.question),
    ['Question 2']
  )
  assert.deepEqual(pageResult.tabsWordless.repairs, ['faq-tabs repaired: dropped 1 FAQ item(s) whose answer has no words'])
  assert.deepEqual(pageResult.tabsAllWordless.sections, [])
  assert.equal(pageResult.tabsAllWordless.repairs[1], 'faq-tabs skipped: dropped the whole section — it has no categories or no questions')
})
