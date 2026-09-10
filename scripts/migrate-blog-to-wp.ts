/**
 * migrate-blog-to-wp.ts — convert content/blog/*.mdx to Gutenberg block markup.
 *
 * Design: Public/docs/plans/10-09-2026-headless-wordpress-cms-design.md §24.14 (D13)
 *
 * 🔴 THIS IS RUN BY A HUMAN, ONCE, AND NEVER BY CI. It writes a JSON file; a separate
 * PHP importer in the WordPress pod creates the posts. Two steps on purpose — the
 * conversion is reviewable as a diff before anything is written, and no API user needs
 * write capabilities to run it.
 *
 * 🔴 SEO IS SEEDED FROM THE SERVED HTML, NEVER FROM THE FRONTMATTER OR A METADATA
 * OBJECT. §21.2 is emphatic and was learned the hard way in Phase 1: the two differ,
 * and the difference is invisible in source. /about renders "… | Ciphera" and
 * /products/pulse renders no suffix, from declarations that look identical — the
 * difference emerges from Next\'s template inheritance. Seeding from source would
 * silently change 16 live titles.
 *
 * ⚠️ ACCEPTANCE IS A RENDERED-HTML DIFF OF ALL SIXTEEN, BY EYE. This script is the
 * starting point for that review, not a substitute for it. Do not automate the review.
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog')
const OUT = path.join(process.cwd(), 'migration.json')
const LIVE = process.env.LIVE_SITE ?? 'https://ciphera.net'

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
function escAttr(s: string): string {
  return esc(s).replace(/"/g, '&quot;')
}

/**
 * Markdown inline -> HTML.
 *
 * 🔑 CODE SPANS ARE EXTRACTED FIRST AND PUT BACK LAST. Otherwise a `**` inside a code
 * span becomes <strong>, and the corpus is full of code spans containing markdown
 * metacharacters: --max-old-space-size, *.mdx, s-maxage=31536000.
 */
function inline(md: string): string {
  // 🔴 TWO THINGS MUST SURVIVE esc(): code spans and ToolLogo. Both are extracted to
  // placeholders first and restored last.
  //
  // The ToolLogo case cost a round trip to find, and the way it failed is the lesson:
  // substituting the <span> BEFORE esc() produced `&lt;span data-ciphera-block=
  // "tool-logo"…`, which still CONTAINS the string a naive grep counts. The check said
  // 54 spans present; every one of them was escaped and would have rendered as visible
  // markup in the middle of a sentence.
  const codes: string[] = []
  const logos: string[] = []

  let s = md.replace(/HOLDCODE|HOLDLOGO/g, (m) => m + '_LITERAL')
  s = s.replace(/<ToolLogo\s+src="([^"]+)"\s*\/>/g, (_m, src: string) => {
    logos.push(src)
    return `HOLDLOGO${logos.length - 1}END`
  })
  s = s.replace(/`([^`]+)`/g, (_m, c: string) => {
    codes.push(c)
    return `HOLDCODE${codes.length - 1}END`
  })

  s = esc(s)
  // Links before emphasis: a link's TEXT may itself contain emphasis.
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, t: string, href: string) =>
    `<a href="${escAttr(href)}">${t}</a>`
  )
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  // ⚠️ `[^*\n]+` was too strict: the corpus writes *a phrase with **bold** inside*, and
  // an em that stops at the first asterisk swallowed the wrapper and dropped four <em>s
  // in one post. Allow an inner ** pair, and require a non-space at each boundary so a
  // bare `2 * 3` is left alone.
  s = s.replace(/(^|[^*\w])\*(\S(?:[^*\n]|\*\*)*?\S|\S)\*(?![*\w])/g, '$1<em>$2</em>')

  s = s.replace(/HOLDCODE(\d+)END/g, (_m, i: string) => `<code>${esc(codes[Number(i)])}</code>`)
  s = s.replace(/HOLDLOGO(\d+)END/g, (_m, i: string) =>
    `<span data-ciphera-block="tool-logo" data-src="${escAttr(logos[Number(i)])}"></span>`)
  return s.replace(/(HOLDCODE|HOLDLOGO)_LITERAL/g, '$1')
}

interface Faq { question: string; answer: string }

function blocksFor(body: string): { blocks: string[]; problems: string[] } {
  const problems: string[] = []
  const out: string[] = []
  const lines = body.split('\n')
  let i = 0
  let para: string[] = []

  const endPara = () => {
    // ⚠️ `  \n` is a markdown hard break. Joining on a space silently deletes it, and
    // the corpus uses it for address-style stacked lines.
    const text = para.join(' ').replace(/ {2,}\u0000/g, '<br/>').trim()
    para = []
    if (text) out.push(`<!-- wp:paragraph -->\n<p>${inline(text)}</p>\n<!-- /wp:paragraph -->`)
  }

  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) { endPara(); i++; continue }

    const bq = line.match(/^<BlogBlockquote(?:\s+variant="([^"]+)")?\s*>/)
    if (bq) {
      endPara()
      const variant = bq[1] ?? 'default'
      const inner: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('</BlogBlockquote>')) { inner.push(lines[i]); i++ }
      i++
      const paras = inner.join('\n').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
      const attr = variant === 'tldr' ? ' {"className":"is-style-tldr"}' : ''
      const cls = variant === 'tldr' ? ' is-style-tldr' : ''
      out.push(
        `<!-- wp:quote${attr} -->\n<blockquote class="wp-block-quote${cls}">` +
          paras.map((p) => `<!-- wp:paragraph --><p>${inline(p.replace(/\n/g, ' '))}</p><!-- /wp:paragraph -->`).join('') +
          `</blockquote>\n<!-- /wp:quote -->`
      )
      continue
    }

    const h = line.match(/^(#{2,4})\s+(.*)$/)
    if (h) {
      endPara()
      const level = h[1].length
      const attr = level === 2 ? '' : ` {"level":${level}}`
      out.push(`<!-- wp:heading${attr} -->\n<h${level} class="wp-block-heading">${inline(h[2])}</h${level}>\n<!-- /wp:heading -->`)
      i++
      continue
    }

    // A markdown blockquote. One in the corpus, and without this branch it fell
    // through to the paragraph accumulator and lost its <blockquote> entirely.
    if (/^>\s?/.test(line)) {
      endPara()
      const quoted: string[] = []
      while (i < lines.length && /^>\s?/.test(lines[i])) { quoted.push(lines[i].replace(/^>\s?/, '')); i++ }
      const paras = quoted.join('\n').split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean)
      out.push(
        '<!-- wp:quote -->\n<blockquote class="wp-block-quote">' +
          paras.map((x) => `<!-- wp:paragraph --><p>${inline(x.replace(/\n/g, ' '))}</p><!-- /wp:paragraph -->`).join('') +
          '</blockquote>\n<!-- /wp:quote -->'
      )
      continue
    }

    if (/^---+\s*$/.test(line)) {
      endPara()
      out.push('<!-- wp:separator -->\n<hr class="wp-block-separator"/>\n<!-- /wp:separator -->')
      i++
      continue
    }

    if (line.startsWith('```')) {
      endPara()
      const code: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) { code.push(lines[i]); i++ }
      i++
      out.push(`<!-- wp:code -->\n<pre class="wp-block-code"><code>${esc(code.join('\n'))}</code></pre>\n<!-- /wp:code -->`)
      continue
    }

    if (line.trim().startsWith('|')) {
      endPara()
      const rows: string[][] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const cells = lines[i].trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim())
        if (!cells.every((c) => /^:?-{2,}:?$/.test(c))) rows.push(cells)
        i++
      }
      const head = rows[0] ?? []
      const bodyRows = rows.slice(1)
      out.push(
        '<!-- wp:table -->\n<figure class="wp-block-table"><table><thead><tr>' +
          head.map((c) => `<th>${inline(c)}</th>`).join('') +
          '</tr></thead><tbody>' +
          bodyRows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('') +
          '</tbody></table></figure>\n<!-- /wp:table -->'
      )
      continue
    }

    const ulRe = /^[-*]\s+/
    const olRe = /^\d+\.\s+/
    if (ulRe.test(line) || olRe.test(line)) {
      endPara()
      const ordered = olRe.test(line)
      const re = ordered ? olRe : ulRe
      const items: string[] = []
      while (i < lines.length && (re.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
        if (re.test(lines[i])) items.push(lines[i].replace(re, ''))
        else items[items.length - 1] += ' ' + lines[i].trim()
        i++
      }
      const tag = ordered ? 'ol' : 'ul'
      const attr = ordered ? ' {"ordered":true}' : ''
      out.push(
        `<!-- wp:list${attr} -->\n<${tag} class="wp-block-list">` +
          items.map((it) => `<!-- wp:list-item --><li>${inline(it)}</li><!-- /wp:list-item -->`).join('') +
          `</${tag}>\n<!-- /wp:list -->`
      )
      continue
    }

    // 🔴 ANYTHING STILL LOOKING LIKE JSX IS A COMPONENT WE HAVE NOT MAPPED, and the
    // script exits non-zero rather than dropping it. A silently discarded component is
    // a hole in a published page that only a human reading all sixteen would catch.
    // ⚠️ ToolLogo is EXCLUDED: it is handled inline (see inline()), and 6 of its 60
    // uses begin a line. Without this exclusion the guard fired first and dropped the
    // whole paragraph — a component that IS mapped, reported as unmapped.
    if (/^<[A-Z]/.test(line.trim()) && !/^<ToolLogo\b/.test(line.trim())) {
      problems.push(`unmapped component: ${line.trim().slice(0, 80)}`)
      i++
      continue
    }

    para.push(/ {2}$/.test(line) ? line.trim() + '\u0000' : line.trim())
    i++
  }
  endPara()
  return { blocks: out, problems }
}

/** The SERVED head — the only honest source for what a page's SEO currently is. */
async function servedSeo(slug: string) {
  const res = await fetch(`${LIVE}/blog/${slug}`)
  if (!res.ok) throw new Error(`${slug}: live page returned HTTP ${res.status}`)
  const html = await res.text()
  const pick = (re: RegExp) => (html.match(re)?.[1] ?? '').trim()
  return {
    title: pick(/<title>([^<]*)<\/title>/),
    description: pick(/<meta name="description" content="([^"]*)"/),
    canonical: pick(/<link rel="canonical" href="([^"]*)"/),
    ogTitle: pick(/<meta property="og:title" content="([^"]*)"/),
    ogDescription: pick(/<meta property="og:description" content="([^"]*)"/),
    ogImage: pick(/<meta property="og:image" content="([^"]*)"/),
    twitterTitle: pick(/<meta name="twitter:title" content="([^"]*)"/),
    twitterDescription: pick(/<meta name="twitter:description" content="([^"]*)"/),
  }
}

async function main() {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx')).sort()
  const posts = []
  let problemCount = 0

  for (const filename of files) {
    const slug = filename.replace(/\.mdx$/, '')
    const { data, content } = matter(fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf-8'))
    const { blocks, problems } = blocksFor(content)

    const faqs: Faq[] = data.faqs ?? []
    for (const f of faqs) {
      blocks.push(`<!-- wp:ciphera/faq {"question":"${escAttr(f.question)}","answer":"${escAttr(f.answer)}"} /-->`)
    }

    const seo = await servedSeo(slug)
    if (problems.length) {
      problemCount += problems.length
      console.error(`  ⚠️  ${slug}: ${problems.join('; ')}`)
    }

    posts.push({
      slug,
      title: data.title,
      excerpt: data.description,
      date: data.date,
      dateModified: data.dateModified || data.date,
      category: data.category,
      readTime: data.readTime,
      cta: data.cta ?? null,
      content: blocks.join('\n\n'),
      seo,
    })
    console.log(`  ${slug}: ${blocks.length} blocks, ${faqs.length} faqs`)
  }

  fs.writeFileSync(OUT, JSON.stringify(posts, null, 2), 'utf-8')
  console.log(`\nWrote ${posts.length} posts -> migration.json`)
  if (problemCount) {
    console.error(`\n🔴 ${problemCount} unmapped construct(s). Fix the converter before importing.`)
    process.exit(1)
  }
}

main()
