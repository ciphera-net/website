#!/usr/bin/env node
/**
 * One-off extraction: turns the five coded product pages' existing hardcoded copy
 * into WEB-28 migration seeds (build task step 6) — a mechanical read of what each
 * page.tsx ALREADY says via a real JSX/TS parse (@babel/parser), not new copy and
 * not hand-typed JSON. Run once; the five JSON files it writes are the committed
 * artifact, not this script's continued existence. Model: Pulse/pulse-website's
 * scripts/pages-seed/extract-seeds.mjs (regex markers + `new Function` literal
 * eval); this version parses a real AST instead, because the product pages' object
 * literals mix plain strings with IMPORTED ICON COMPONENT identifiers
 * (`{ icon: Lightning, label: 'Adaptive PoW' }`) that `new Function` cannot
 * evaluate — `litValue()` below resolves those identifiers through the same
 * component -> key mapping `lib/cms/product-registries.tsx` uses in reverse, and
 * every classification below (which div is the button row, which overlay-badge
 * style a photo split uses) reads an actual attribute/structure rather than
 * guessing from prose.
 *
 * Output shape (scripts/import-pages.php's contract):
 *   { site, path, title, seo: {...}, blocks: [{ name, attrs }] }
 */
import fs from 'fs'
import path from 'path'
import { parse } from '@babel/parser'
import traverseModule from '@babel/traverse'

const traverse = traverseModule.default ?? traverseModule
const ROOT = path.join(import.meta.dirname, '..', '..')

// ── Icon component identifier -> this site's closed ICON_KEYS select value.
// Mirrors lib/cms/product-registries.tsx's ICON_COMPONENTS table, in reverse.
const ICON_KEY_BY_COMPONENT = {
  PuzzlePiece: 'puzzle-piece',
  ShieldCheck: 'shield-check',
  Lightning: 'lightning',
  EyeSlash: 'eye-slash',
  Timer: 'timer',
  Robot: 'robot',
  Eye: 'eye',
  Key: 'key',
  Vault: 'vault',
  Cookie: 'cookie',
  Code: 'code',
  Globe: 'globe',
  Funnel: 'funnel',
  EnvelopeSimple: 'envelope-simple',
  Lock: 'lock',
  GlobeIcon: 'globe-outline',
  LockIcon: 'lock-outline',
  CheckIcon: 'check',
  XIcon: 'x',
  ArrowRightIcon: 'arrow-right',
  GithubIcon: 'github',
}

// `lib/images.ts`'s own `export const NAME = cdnUrl('/path')` pairs, read mechanically
// from that file rather than hand-copied — the one thing this script trusts is already
// correct because it is the published source of truth these pages themselves import.
function loadImagePaths() {
  const src = fs.readFileSync(path.join(ROOT, 'lib', 'images.ts'), 'utf-8')
  const map = {}
  for (const m of src.matchAll(/export const (\w+) = cdnUrl\('([^']+)'\)/g)) map[m[1]] = m[2]
  return map
}
const IMAGE_PATHS = loadImagePaths()

// ── Babel plumbing ──────────────────────────────────────────────────────────────────

function parseFile(file) {
  const src = fs.readFileSync(file, 'utf-8')
  const ast = parse(src, { sourceType: 'module', plugins: ['jsx', 'typescript'] })
  CURRENT_AST = ast
  return ast
}

/** A literal JS value from an AST node. Strings/numbers/booleans directly, arrays and
 * objects recursively, an Identifier resolved through the icon-component map or the
 * image-path map, `cdnUrl('/x')` resolved to its argument (cdnUrl is the identity
 * function with no CDN env var set — this script's own environment, and the parity
 * test's), and a JSXElement reduced through richInline. Anything else throws rather
 * than silently producing wrong data. */
function litValue(node) {
  if (!node) return ''
  switch (node.type) {
    case 'StringLiteral':
      return node.value
    case 'NumericLiteral':
      return node.value
    case 'BooleanLiteral':
      return node.value
    case 'TemplateLiteral':
      if (node.expressions.length === 0) return node.quasis.map((q) => q.value.cooked).join('')
      break
    case 'Identifier':
      if (ICON_KEY_BY_COMPONENT[node.name]) return ICON_KEY_BY_COMPONENT[node.name]
      if (IMAGE_PATHS[node.name] !== undefined) return IMAGE_PATHS[node.name]
      break
    case 'ArrayExpression':
      return node.elements.map((el) => litValue(el))
    case 'ObjectExpression': {
      const obj = {}
      for (const p of node.properties) {
        const key = p.key.name ?? p.key.value
        obj[key] = litValue(p.value)
      }
      return obj
    }
    case 'CallExpression':
      if (node.callee.name === 'cdnUrl' && node.arguments[0]?.type === 'StringLiteral') {
        return node.arguments[0].value
      }
      break
    case 'JSXElement':
      return richInline(node.children)
    default:
      break
  }
  throw new Error(`litValue: cannot resolve ${node.type} at line ${node.loc?.start.line}`)
}

/** JSX whitespace collapse, matching what the JSX transform itself does: a text run
 * with no newline is kept byte-exact (it may carry a meaningful leading/trailing space
 * next to an inline sibling, e.g. "OPAQUE</Link> (RFC 9807)..."); a multi-line run
 * keeps line 1's leading content and the last line's trailing content as-is (trimming
 * only the incidental side that faces a tag boundary), trims both sides of any interior
 * line, drops lines that become empty, and joins what remains with a single space. */
function normalizeJsxText(raw) {
  const lines = raw.split('\n')
  if (lines.length === 1) return raw
  const cleaned = lines.map((line, i) => {
    if (i === 0) return line.replace(/\s+$/, '')
    if (i === lines.length - 1) return line.replace(/^\s+/, '')
    return line.trim()
  })
  return cleaned.filter((l) => l !== '').join(' ')
}

function jsxAttrNode(el, name) {
  const attr = el.openingElement.attributes.find((a) => a.type === 'JSXAttribute' && a.name.name === name)
  return attr?.value ?? null
}
function jsxAttrString(el, name) {
  const v = jsxAttrNode(el, name)
  if (v == null) return ''
  if (v.type === 'StringLiteral') return v.value
  if (v.type === 'JSXExpressionContainer') return litValue(v.expression)
  return ''
}
function jsxHasAttr(el, name) {
  return el.openingElement.attributes.some((a) => a.type === 'JSXAttribute' && a.name.name === name)
}
function tagName(el) {
  if (el.type !== 'JSXElement') return null
  const n = el.openingElement.name
  return n.type === 'JSXIdentifier' ? n.name : null
}
/** Direct JSXElement children of a container, in document order. */
function elementChildren(el) {
  return el.children.filter((c) => c.type === 'JSXElement')
}

/** The inline-markup HTML this site's richtext allowlist supports (`p` excluded on
 * purpose — every product-page section places this inside its OWN `<p>`/heading, so a
 * nested `<p>` would double-wrap). `Link`/`a` -> `<a href>`, `br` -> `<br>` (with
 * `class` preserved — the one hero-heading case that needs it), `strong`/`em`/`code`
 * passed through, anything else (a decorative icon) contributes nothing. */
function richInline(children) {
  let out = ''
  for (const node of children) {
    if (node.type === 'JSXText') {
      out += normalizeJsxText(node.value)
    } else if (node.type === 'JSXExpressionContainer') {
      const e = node.expression
      if (e.type === 'StringLiteral') out += e.value
      else if (e.type === 'JSXEmptyExpression') continue
      else throw new Error(`richInline: unexpected expression ${e.type} at line ${node.loc?.start.line}`)
    } else if (node.type === 'JSXElement') {
      const tag = tagName(node)
      if (tag === 'a' || tag === 'Link') {
        const href = jsxAttrString(node, 'href')
        out += `<a href="${href}">${richInline(node.children)}</a>`
      } else if (tag === 'br') {
        const cls = jsxAttrString(node, 'className')
        out += cls ? `<br class="${cls}">` : '<br>'
      } else if (tag === 'strong' || tag === 'em' || tag === 'code') {
        out += `<${tag}>${richInline(node.children)}</${tag}>`
      } // else: a decorative inline icon component — contributes no text.
    }
  }
  return out
}

/** Plain visible text only — throws if it finds any markup (use richInline instead
 * where markup is possible). Used for labels/eyebrows that are never rich. */
function plainText(children) {
  for (const node of children) {
    if (node.type === 'JSXElement') throw new Error(`plainText: unexpected element <${tagName(node)}> at line ${node.loc?.start.line}`)
  }
  return richInline(children)
}

/** The first DESCENDANT with this tag — never matches `el` itself, even when `el`'s
 * own tag happens to equal `tag` (e.g. `firstByTag(aDiv, 'div')` must find the first
 * INNER div, not report `aDiv` back unchanged). */
/** Visits every descendant of `node` (never `node` itself) via a GENERIC property
 * walk — not just `.children` — because a `.map()`-rendered list's JSX template
 * lives inside the arrow function's `.body`/`.expression`, not reachable through
 * `.children` alone. Every "find X inside this subtree" helper below is built on
 * this one walk so that class of bug (found once, in `firstByTag` and in what is
 * now `findAllByTag`) cannot recur a third time in a different helper. */
function walkDescendants(node, visit) {
  function walk(n) {
    if (!n || typeof n !== 'object' || typeof n.type !== 'string') return
    if (n !== node) visit(n)
    for (const key of Object.keys(n)) {
      if (key === 'loc' || key === 'start' || key === 'end' || key === 'range' || key === 'leadingComments' || key === 'trailingComments') continue
      const v = n[key]
      if (Array.isArray(v)) v.forEach(walk)
      else if (v && typeof v === 'object' && typeof v.type === 'string') walk(v)
    }
  }
  for (const key of Object.keys(node)) {
    if (key === 'loc' || key === 'start' || key === 'end' || key === 'range' || key === 'leadingComments' || key === 'trailingComments') continue
    const v = node[key]
    if (Array.isArray(v)) v.forEach(walk)
    else if (v && typeof v === 'object' && typeof v.type === 'string') walk(v)
  }
}

function firstByTag(el, tag) {
  let found = null
  walkDescendants(el, (n) => {
    if (!found && n.type === 'JSXElement' && tagName(n) === tag) found = n
  })
  return found
}

function findAllByTag(el, tag) {
  const found = []
  walkDescendants(el, (n) => {
    if (n.type === 'JSXElement' && tagName(n) === tag) found.push(n)
  })
  return found
}

/** The nearest ArrayExpression textually inside `node` (any AST node) — used to find
 * the array literal driving a `{[...].map(...)}` list render. `null` if none exists
 * (distinguishes a data-driven list from hand-written literal JSX siblings). */
/** `ast` for the page currently being extracted — set once per page by `setSource()`,
 * so `firstArrayExpression` can resolve a `{MODULE_CONST.map(...)}` list (Captcha/
 * Pulse/Relay's feature grids all reference a top-level const, not an inline array)
 * without threading the AST through every call site. */
let CURRENT_AST = null

function firstArrayExpression(node) {
  let found = null
  let identName = null
  function walk(n) {
    if (found || !n || typeof n !== 'object' || typeof n.type !== 'string') return
    if (n.type === 'ArrayExpression') {
      found = n
      return
    }
    if (!identName && n.type === 'CallExpression' && n.callee.type === 'MemberExpression' && n.callee.property.name === 'map' && n.callee.object.type === 'Identifier') {
      identName = n.callee.object.name
    }
    for (const key of Object.keys(n)) {
      if (key === 'loc' || key === 'start' || key === 'end' || key === 'range' || key === 'leadingComments' || key === 'trailingComments') continue
      const v = n[key]
      if (Array.isArray(v)) v.forEach(walk)
      else if (v && typeof v === 'object' && typeof v.type === 'string') walk(v)
    }
  }
  walk(node)
  if (found) return found
  if (identName && CURRENT_AST) {
    let resolved = null
    traverse(CURRENT_AST, {
      VariableDeclarator(p) {
        if (resolved || p.node.id.name !== identName) return
        let init = p.node.init
        while (init.type === 'TSAsExpression' || init.type === 'TSTypeAssertion') init = init.expression
        if (init.type === 'ArrayExpression') resolved = init
      },
    })
    return resolved
  }
  return null
}

function findSectionById(ast, id) {
  let found = null
  traverse(ast, {
    JSXOpeningElement(node) {
      if (found) return
      const idAttr = node.node.attributes.find((a) => a.type === 'JSXAttribute' && a.name.name === 'id')
      if (!idAttr) return
      const val = idAttr.value?.type === 'StringLiteral' ? idAttr.value.value : null
      if (val === id) found = node.parentPath.node
    },
  })
  if (!found) throw new Error(`findSectionById: no element with id="${id}"`)
  return found
}

/** The `<section>` elements returned by `functionName`'s JSX fragment, in order —
 * covers the hero and closing-CTA band, neither of which carries an `id`.
 *
 * 🔑 Every one of these pages has TWO `return (<>...)` statements once Phase E
 * wiring landed: the early `if (cms) { return (...) }` branch (just the schema
 * script + `<CmsPage>`, no `<section>`s) and the real coded fallback below it. This
 * takes the LAST JSXFragment return found in the function, never the first. */
function topLevelSections(ast, functionName) {
  let sections = null
  traverse(ast, {
    Function(fnPath) {
      const id = fnPath.node.id
      if (!id || id.name !== functionName) return
      fnPath.traverse({
        ReturnStatement(ret) {
          const arg = ret.node.argument
          if (arg?.type === 'JSXFragment') {
            sections = elementChildren(arg).filter((c) => tagName(c) === 'section')
          }
        },
      })
    },
  })
  if (!sections || sections.length === 0) throw new Error(`topLevelSections: could not find function ${functionName}'s coded fallback fragment`)
  return sections
}

// ── SEO metadata (generateMetadata's seoForAsync(path, {...}) call) ────────────────

function extractMetadata(ast) {
  let result = null
  traverse(ast, {
    CallExpression(node) {
      if (result) return
      const callee = node.node.callee
      if (callee.type !== 'Identifier' || callee.name !== 'seoForAsync') return
      const objArg = node.node.arguments[1]
      if (!objArg || objArg.type !== 'ObjectExpression') return
      const get = (obj, key) => obj?.properties.find((p) => (p.key.name ?? p.key.value) === key)?.value
      const title = litValue(get(objArg, 'title'))
      const description = litValue(get(objArg, 'description'))
      const canonical = litValue(get(get(objArg, 'alternates'), 'canonical'))
      const og = get(objArg, 'openGraph')
      const tw = get(objArg, 'twitter')
      result = {
        title,
        description,
        canonical,
        ogTitle: litValue(get(og, 'title')),
        ogDescription: litValue(get(og, 'description')),
        twitterTitle: litValue(get(tw, 'title')),
        twitterDescription: litValue(get(tw, 'description')),
      }
    },
  })
  if (!result) throw new Error('extractMetadata: no seoForAsync(...) call found')
  return result
}

const TITLE_TEMPLATE = (() => {
  const layout = fs.readFileSync(path.join(ROOT, 'app', 'layout.tsx'), 'utf-8')
  const m = layout.match(/template:\s*'([^']*%s[^']*)'/)
  if (!m) throw new Error('app/layout.tsx: no title template found')
  return m[1]
})()

// ── product-banner (hero or band) ───────────────────────────────────────────────────

function isLinkEl(el) {
  const t = tagName(el)
  return t === 'a' || t === 'Link'
}

/** `external` means "render through a raw `<a target=_blank rel=noopener>`, never
 * through LinkComponent" — ProductBannerButton's own two paths. Pulse's hero
 * secondary button is coded as `<Link target="_blank" rel="noopener noreferrer">`
 * (Next's `Link` forwards unknown props straight to the `<a>` it renders), which
 * produces the SAME bytes as the external path — so this keys on the `target`
 * attribute's presence, never on the JSX tag name (`a` vs `Link`). */
function extractButton(el) {
  if (!el) return { label: '', href: '', external: false }
  return {
    label: richInline(el.children),
    href: jsxAttrString(el, 'href'),
    external: jsxHasAttr(el, 'target'),
  }
}

/** Dots style: `{[{icon,label}|string, ...].map(...)}`. Bars style (Ciphera ID): hand-
 * written literal `<span>` badges interleaved with empty divider spans — no array. */
function extractBadges(div) {
  const arr = firstArrayExpression(div)
  if (arr) {
    const items = arr.elements.map((el) => {
      if (el.type === 'ObjectExpression') {
        const icon = el.properties.find((p) => (p.key.name ?? p.key.value) === 'icon')
        const label = el.properties.find((p) => (p.key.name ?? p.key.value) === 'label')
        return { icon: icon ? litValue(icon.value) : '', label: litValue(label.value) }
      }
      return { icon: '', label: litValue(el) }
    })
    return { badgeStyle: 'dots', trustBadges: items }
  }
  const spans = elementChildren(div).filter((s) => tagName(s) === 'span' && s.children.length > 0)
  const trustBadges = spans.map((span) => {
    const iconEl = elementChildren(span)[0] ?? null
    const icon = iconEl ? ICON_KEY_BY_COMPONENT[tagName(iconEl)] ?? '' : ''
    return { icon, label: richInline(span.children) }
  })
  return { badgeStyle: 'bars', trustBadges }
}

function productBanner(sectionEl, variant) {
  const divs = elementChildren(sectionEl).filter((c) => tagName(c) === 'div')
  const contentDiv = divs[divs.length - 1]
  const kids = elementChildren(contentDiv)

  const label = plainText(kids[0].children)
  const heading = richInline(kids[1].children)
  const body = richInline(kids[2].children)

  let badgeStyle = 'dots'
  let trustBadges = []
  let stats = []
  let buttonDiv = null
  let footnote = ''

  for (let i = 3; i < kids.length; i++) {
    const k = kids[i]
    const t = tagName(k)
    if (t === 'div' && !buttonDiv && elementChildren(k).some(isLinkEl)) {
      buttonDiv = k
    } else if (t === 'div' && !buttonDiv) {
      ;({ badgeStyle, trustBadges } = extractBadges(k))
    } else if (t === 'dl') {
      stats = (firstArrayExpression(k)?.elements ?? []).map((el) => litValue(el))
    } else if (t === 'p') {
      footnote = richInline(k.children)
    }
  }

  const buttons = buttonDiv ? elementChildren(buttonDiv).filter(isLinkEl) : []
  const primaryButton = extractButton(buttons[0])
  const secondaryButton = extractButton(buttons[1])

  const bgEl = elementChildren(sectionEl).find((c) => tagName(c) === 'Image' || tagName(c) === 'img')
  const backgroundImage = bgEl ? jsxAttrString(bgEl, 'src') : ''
  const backgroundImageAlt = bgEl ? jsxAttrString(bgEl, 'alt') : ''

  return {
    name: 'ciphera/product-banner',
    attrs: {
      variant,
      label,
      heading,
      body,
      backgroundImage,
      backgroundImageAlt,
      badgeStyle,
      trustBadges,
      stats,
      primaryButtonLabel: primaryButton.label,
      primaryButtonHref: primaryButton.href,
      primaryButtonExternal: primaryButton.external,
      secondaryButtonLabel: secondaryButton.label,
      secondaryButtonHref: secondaryButton.href,
      secondaryButtonExternal: secondaryButton.external,
      footnote,
    },
  }
}

// ── feature-split ───────────────────────────────────────────────────────────────────

/** `bullets`' real WordPress block attrs shape is a repeater: `[{text: '...'}]`, never
 * a bare string array — `ciphera_page_normalize_list($attrs['bullets'], ['text'], ['text'])`
 * reads it that way, and `array_column(...)`s it to a flat string array downstream. */
function bulletListOf(ulEl) {
  const arr = firstArrayExpression(ulEl)
  const bulletStyle = /mt-\[0\.6rem\] h-px w-4/.test(require_text(ulEl)) ? 'dash' : 'check'
  return { items: (arr?.elements ?? []).map((el) => ({ text: litValue(el) })), bulletStyle }
}
// Minimal source-text probe for the one structural signal that isn't itself a
// litValue-able node: which bullet glyph a <ul> uses (check icon vs a plain dash span).
// Reads straight off the AST's own range via the ORIGINAL source string set by setSource().
let CURRENT_SRC = ''
function require_text(node) {
  return CURRENT_SRC.slice(node.start, node.end)
}

/** `overlayBadgeStyle` — read directly off the description <p>'s own className
 * (never guessed): 'default' (`text-[11px] text-muted-foreground`), 'tabular' (adds
 * `tabular-nums`), 'detailed' (title drops `font-semibold`, description grows to
 * `text-sm` + `text-foreground`). */
/** The overlay badges are THEMSELVES a `.map()` over a `{icon,title,desc}` array, so
 * only ONE badge `<div>`/`<p>` pair exists literally in the AST (the map callback's
 * template) — the DATA comes from the array literal (read via `litValue`, which
 * resolves each `icon` identifier through the icon-component map already), and the
 * STYLE comes from that one template's own `<p>` classNames. */
function overlayBadgeBlock(photoAbsDiv) {
  const arr = firstArrayExpression(photoAbsDiv)
  if (!arr) return { overlayBadges: [], overlayBadgeStyle: 'default' }
  const overlayBadges = arr.elements.map((el) => {
    const raw = litValue(el)
    return { icon: raw.icon ?? '', title: raw.title, description: raw.desc ?? raw.description }
  })
  // The badge <p>s are a `.map()` TEMPLATE, nested inside the JSXExpressionContainer's
  // `.expression` (a CallExpression's arrow-function body) — NOT reachable through
  // `.children` alone, hence `findAllByTag`'s generic walk, not a JSX-children-only one.
  const ps = findAllByTag(photoAbsDiv, 'p')
  let overlayBadgeStyle = 'default'
  if (ps.length >= 2) {
    const titleClass = jsxAttrString(ps[0], 'className')
    const descClass = jsxAttrString(ps[1], 'className')
    if (!titleClass.includes('font-semibold')) overlayBadgeStyle = 'detailed'
    else if (descClass.includes('tabular-nums')) overlayBadgeStyle = 'tabular'
  }
  return { overlayBadges, overlayBadgeStyle }
}

function featureSplit(sectionEl) {
  const grid = firstByTag(sectionEl, 'div') // the `grid lg:grid-cols-2` row
  const cols = elementChildren(grid)

  // Identify the photo column (contains an Image/img with `fill`) vs the copy column
  // (contains the label <p> + h2) vs the mockup/diagram/code visual column.
  const hasImage = (col) => elementChildren(col).some((c) => (tagName(c) === 'Image' || tagName(c) === 'img') && jsxHasAttr(c, 'fill'))
  const hasHeading = (col) => !!firstByTag(col, 'h2')
  const photoCol = cols.find(hasImage)
  const copyCol = cols.find(hasHeading)
  const visualCol = cols.find((c) => c !== photoCol && c !== copyCol)

  const copyKids = elementChildren(copyCol)
  let i = 0
  const label = plainText(copyKids[i].children); i++
  const heading = richInline(copyKids[i].children); i++
  // Real WP attrs shape: a repeater `[{text:'...'}]`, collapsed to a scalar/array of
  // strings only by ciphera_page_parse_sections() downstream — see page-build.ts's
  // featureSplitText() for the mirrored collapse on this site's own read side.
  const textParas = []
  while (copyKids[i] && tagName(copyKids[i]) === 'p') {
    textParas.push({ text: richInline(copyKids[i].children) })
    i++
  }
  let bullets = []
  let bulletStyle = 'check'
  if (copyKids[i] && tagName(copyKids[i]) === 'ul') {
    const b = bulletListOf(copyKids[i])
    bullets = b.items
    bulletStyle = b.bulletStyle
    i++
  }
  // trailingText/cta/note, in whatever order/combination is present. A lone
  // trailing <p> is ambiguous by POSITION alone (ID's "#what-it-is" has only
  // trailingText, no cta, no note; its "#zero-knowledge-auth" has only note, no
  // trailingText, no cta — identical shape, different field) — disambiguated by
  // the authored className instead: FeatureSplit's `trailingText` is always
  // `text-lg` (full-size, same as `text`), `note` is always `text-sm` (deliberately
  // smaller). Reading the real class, never guessing from position.
  let trailingText = ''
  let ctaLabel = ''
  let ctaHref = ''
  let note = ''
  while (copyKids[i] && (tagName(copyKids[i]) === 'p' || tagName(copyKids[i]) === 'div')) {
    const node = copyKids[i]
    if (tagName(node) === 'div') {
      const link = elementChildren(node).find(isLinkEl)
      if (link) {
        ctaLabel = richInline(link.children)
        ctaHref = jsxAttrString(link, 'href')
      }
    } else {
      const cls = jsxAttrString(node, 'className')
      const text = richInline(node.children)
      if (cls.includes('text-sm')) note = text
      else trailingText = text
    }
    i++
  }

  const visualSide = cols.indexOf(photoCol ?? visualCol) === 0 ? 'left' : 'right'

  let visualType = ''
  let visualKey = ''
  let image = ''
  let imageAlt = ''
  let overlayBadges = []
  let overlayBadgeStyle = 'default'
  let visualCellBordered = false
  let mockupCell = false

  if (photoCol) {
    visualType = 'photo'
    const imgEl = elementChildren(photoCol).find((c) => tagName(c) === 'Image' || tagName(c) === 'img')
    image = jsxAttrString(imgEl, 'src')
    imageAlt = jsxAttrString(imgEl, 'alt')
    const overlayWrap = elementChildren(photoCol).find((c) => c !== imgEl)
    if (overlayWrap) {
      const r = overlayBadgeBlock(overlayWrap)
      overlayBadges = r.overlayBadges
      overlayBadgeStyle = r.overlayBadgeStyle
    }
  } else if (visualCol) {
    const cls = jsxAttrString(visualCol, 'className')
    visualCellBordered = /min-w-0 overflow-hidden/.test(cls) && visualSide === 'left'
    mockupCell = cls.includes('mockup-cell')
    const inner = firstByTag(visualCol, 'div') // the `w-full max-w-md min-w-0` wrapper
    const innerKid = inner ? elementChildren(inner)[0] : elementChildren(visualCol)[0]
    const compName = innerKid ? tagName(innerKid) : null
    const COMPONENT_VISUAL_KEY = {
      CaptchaMockup: 'mockup-captcha',
      AuthMockup: 'mockup-auth',
      RelayMockup: 'mockup-relay',
      PulseMockupTall: 'mockup-pulse-tall',
      IdZeroKnowledgeDiagram: 'diagram-id-zero-knowledge',
      CaptchaStatelessDiagram: 'diagram-captcha-stateless',
      RelaySmtpEnvCode: 'code-relay-smtp-env',
      PulseScriptTagCode: 'code-pulse-script-tag',
    }
    visualKey = COMPONENT_VISUAL_KEY[compName] ?? ''
    visualType = visualKey.startsWith('mockup') ? 'mockup' : visualKey.startsWith('diagram') ? 'diagram' : visualKey.startsWith('code') ? 'code' : ''
  }

  return {
    name: 'ciphera/feature-split',
    attrs: {
      label,
      heading,
      text: textParas,
      trailingText,
      bullets,
      bulletStyle,
      ctaLabel,
      ctaHref,
      visualSide,
      visualType,
      visualKey,
      visualCellBordered,
      mockupCell,
      image,
      imageAlt,
      overlayBadges,
      overlayBadgeStyle,
      note,
    },
  }
}

// ── feature-grid ─────────────────────────────────────────────────────────────────────

function featureGrid(sectionEl) {
  const outer = firstByTag(sectionEl, 'div')
  const kids = elementChildren(outer)
  let i = 0
  const label = plainText(kids[i].children); i++
  const heading = richInline(kids[i].children); i++
  let dek = ''
  if (kids[i] && tagName(kids[i]) === 'p') {
    dek = richInline(kids[i].children)
    i++
  }
  const grid = kids[i]; i++ // the `grid gap-px border...` items row
  // Items are a `.map()` over a DATA array (sometimes a top-level const — Captcha/
  // Pulse/Relay; sometimes inline — Ciphera ID's "Sessions") — never literal per-card
  // JSX, so the array IS the source of truth (icon/title/body/anchor all live there).
  const itemsArr = firstArrayExpression(grid)
  const items = itemsArr.elements.map((el) => {
    const raw = litValue(el)
    return { icon: raw.icon ?? '', title: raw.title, body: raw.body, anchor: raw.anchor ?? '' }
  })
  let bullets = []
  if (kids[i] && tagName(kids[i]) === 'ul') {
    bullets = bulletListOf(kids[i]).items
  }
  return { name: 'ciphera/feature-grid', attrs: { label, heading, dek, items, bullets } }
}

// ── comparison-cards ─────────────────────────────────────────────────────────────────

function cardIconKey(iconHolder) {
  // Either a <Icon .../> phosphor/facet component, an <Image src={X}/>, or a raw <img src={X}/>.
  const t = tagName(iconHolder)
  if (t === 'Image' || t === 'img') return jsxAttrString(iconHolder, 'src')
  return ICON_KEY_BY_COMPONENT[t] ?? ''
}

function comparisonCards(sectionEl) {
  const outer = firstByTag(sectionEl, 'div')
  const kids = elementChildren(outer)
  let i = 0
  const label = plainText(kids[i].children); i++
  const heading = richInline(kids[i].children); i++
  const intro = richInline(kids[i].children); i++
  let statsStrip = []
  if (kids[i] && tagName(kids[i]) === 'dl') {
    statsStrip = (firstArrayExpression(kids[i])?.elements ?? []).map((el) => litValue(el))
    i++
  }
  const cardsGrid = kids[i]
  const [oursCard, theirsCard] = elementChildren(cardsGrid)

  function cardHeader(card) {
    const headerDiv = elementChildren(card)[jsxHasAttr(card, 'className') && /relative/.test(jsxAttrString(card, 'className')) ? 1 : 0]
    const iconWrap = elementChildren(headerDiv)[0]
    const iconHolder = elementChildren(iconWrap)[0]
    const textWrap = elementChildren(headerDiv)[1]
    const nameEl = firstByTag(textWrap, 'h3')
    const taglineEl = firstByTag(textWrap, 'p')
    return {
      icon: cardIconKey(iconHolder),
      name: richInline(nameEl.children),
      tagline: richInline(taglineEl.children),
      taglineClass: jsxAttrString(taglineEl, 'className'),
    }
  }

  const oursHeader = cardHeader(oursCard)
  const oursHighlighted = jsxAttrString(oursCard, 'className').includes('relative') || elementChildren(oursCard).some((c) => jsxAttrString(c, 'className').includes('absolute top-0 left-0 right-0'))
  const oursTaglineAccent = oursHeader.taglineClass.includes('text-primary')
  const oursUl = firstByTag(oursCard, 'ul')
  // "ours" items are a `.map()` over a plain string array (no literal <li>s in the AST,
  // same device as bulletListOf). Real WP attrs shape:
  // `ciphera_page_normalize_list($attrs['oursItems'], ['text'], ['text'])`.
  const oursArr = firstArrayExpression(oursUl)
  const oursItems = oursArr.elements.map((el) => ({ text: litValue(el) }))

  const theirsHeader = cardHeader(theirsCard)
  const theirsUl = firstByTag(theirsCard, 'ul')
  // "theirs" items are either a plain array of strings (checkmarks only, no `has`) or
  // `{feature,has}` objects in the SOURCE (all three pages that have one name the key
  // `feature`) — read straight from the <ul>'s own data array, same device as
  // bulletListOf, renamed to the real WordPress attrs shape (`{text,has}`).
  const theirsArr = firstArrayExpression(theirsUl)
  const theirsItems = theirsArr.elements.map((el) => {
    if (el.type === 'ObjectExpression') {
      const v = litValue(el)
      return { text: v.feature ?? v.text, has: v.has }
    }
    return { text: litValue(el), has: false }
  })
  // checkAccent: the list is itself a `.map()` TEMPLATE (one `<li>` in the AST, not one
  // per item), so read the template's own CheckIcon className directly — same device as
  // overlayBadgeBlock's style detection, not an iteration over (non-existent) literal <li>s.
  const theirsCheckIcon = findAllByTag(theirsUl, 'CheckIcon')[0]
  const theirsCheckAccent = theirsCheckIcon ? jsxAttrString(theirsCheckIcon, 'className').includes('text-foreground') : false

  return {
    name: 'ciphera/comparison-cards',
    attrs: {
      label,
      heading,
      intro,
      statsStrip,
      oursIcon: oursHeader.icon,
      oursName: oursHeader.name,
      oursTagline: oursHeader.tagline,
      oursHighlighted,
      oursTaglineAccent,
      oursItems,
      theirsIcon: theirsHeader.icon,
      theirsName: theirsHeader.name,
      theirsTagline: theirsHeader.tagline,
      theirsCheckAccent,
      theirsItems: theirsItems.map(({ text, has }) => ({ text, has })),
    },
  }
}

// ── package-grid (Tessera only) ──────────────────────────────────────────────────────

const LANG_ICON_KEY_BY_NAME = { Rust: 'rust', Go: 'go', TypeScript: 'ts' }
const REGISTRY_ICON_KEY_BY_LABEL = { 'crates.io': 'crates-io', 'pkg.go.dev': 'go-pkg', npm: 'npm' }

function packageGrid(sectionEl, packagesArrayNode) {
  const outer = firstByTag(sectionEl, 'div')
  const kids = elementChildren(outer)
  const label = plainText(kids[0].children)
  const heading = richInline(kids[1].children)
  const raw = packagesArrayNode.elements.map((el) => litValue(el))
  const items = raw.map((p) => ({
    langIcon: LANG_ICON_KEY_BY_NAME[p.lang] ?? '',
    lang: p.lang,
    name: p.name,
    role: p.role,
    body: p.body,
    repoHref: p.repo,
    registryHref: p.registry,
    registryIcon: REGISTRY_ICON_KEY_BY_LABEL[p.registryLabel] ?? '',
    registryLabel: p.registryLabel,
    registryPkg: p.pkg,
  }))
  return { name: 'ciphera/package-grid', attrs: { label, heading, items } }
}

// ── content-block ────────────────────────────────────────────────────────────────────

function contentBlockNone(sectionEl) {
  const outer = firstByTag(sectionEl, 'div')
  const kids = elementChildren(outer)
  let i = 0
  const label = plainText(kids[i].children); i++
  const heading = richInline(kids[i].children); i++
  const text = richInline(kids[i].children); i++
  let bullets = []
  let bulletStyle = 'check'
  if (kids[i] && tagName(kids[i]) === 'ul') {
    const b = bulletListOf(kids[i])
    bullets = b.items
    bulletStyle = b.bulletStyle
    i++
  }
  let note = ''
  if (kids[i] && tagName(kids[i]) === 'p') note = richInline(kids[i].children)
  return { label, heading, text, device: 'none', bullets, bulletStyle, note }
}

function contentBlockCredentialTable(sectionEl) {
  const outer = firstByTag(sectionEl, 'div')
  const kids = elementChildren(outer)
  const label = plainText(kids[0].children)
  const heading = richInline(kids[1].children)
  const text = richInline(kids[2].children)
  const tableDiv = kids[3]
  const tableKids = elementChildren(tableDiv)
  const headerDiv = tableKids[0]
  const headerPs = elementChildren(headerDiv)
  const tableTitle = richInline(headerPs[0].children)
  const tableSubtitle = richInline(headerPs[1].children)
  const dl = tableKids[1]
  const rowsArr = firstArrayExpression(dl)
  const rawRows = rowsArr.elements.map((el) => litValue(el))
  const rows = rawRows.map((r) => ({ key: r.k, value: r.v, note: r.note }))
  let note = ''
  if (kids[4] && tagName(kids[4]) === 'p') note = richInline(kids[4].children)
  return { label, heading, text, device: 'credential-table', tableTitle, tableSubtitle, rows, note }
}

/** Tessera's `#why-opaque`: `text`, a `<div className="mt-10 max-w-xl"><DiagramComp /></div>`,
 * bullets, then a note with an inline link. */
function contentBlockDiagram(sectionEl) {
  const outer = firstByTag(sectionEl, 'div')
  const kids = elementChildren(outer)
  let i = 0
  const label = plainText(kids[i].children); i++
  const heading = richInline(kids[i].children); i++
  const text = richInline(kids[i].children); i++
  const diagramWrap = kids[i]; i++
  const diagramComp = elementChildren(diagramWrap)[0]
  const COMPONENT_DIAGRAM_KEY = { TesseraOpaqueHandshakeDiagram: 'diagram-tessera-opaque-handshake' }
  const diagramKey = COMPONENT_DIAGRAM_KEY[tagName(diagramComp)] ?? ''
  let bullets = []
  let bulletStyle = 'check'
  if (kids[i] && tagName(kids[i]) === 'ul') {
    const b = bulletListOf(kids[i])
    bullets = b.items
    bulletStyle = b.bulletStyle
    i++
  }
  let note = ''
  if (kids[i] && tagName(kids[i]) === 'p') note = richInline(kids[i].children)
  return { label, heading, text, device: 'diagram', diagramKey, bullets, bulletStyle, note }
}

/** Tessera's `#who-uses-it`: `text`, a chips row (`<Link>` wrapping an `<Image>` + label,
 * data-driven from an array of `{image, label, href}`), then a note. */
function contentBlockChips(sectionEl) {
  const outer = firstByTag(sectionEl, 'div')
  const kids = elementChildren(outer)
  const label = plainText(kids[0].children)
  const heading = richInline(kids[1].children)
  const text = richInline(kids[2].children)
  const chipsWrap = kids[3]
  const arr = firstArrayExpression(chipsWrap)
  const rawChips = arr.elements.map((el) => litValue(el))
  const IMAGE_CONST_TO_ICON_KEY = { authIcon: 'logo-id', pulseIcon: 'logo-pulse' }
  // litValue resolved `image` through IMAGE_PATHS already (a raw CDN path) — recover the
  // ORIGINAL identifier name from the AST directly, since the chip select is a closed
  // product-logo key, not a path.
  const chipProps = arr.elements.map((el) => el.properties.find((p) => (p.key.name ?? p.key.value) === 'image').value.name)
  const chips = rawChips.map((c, idx) => ({ image: IMAGE_CONST_TO_ICON_KEY[chipProps[idx]] ?? '', label: c.label, href: c.href }))
  let note = ''
  if (kids[4] && tagName(kids[4]) === 'p') note = richInline(kids[4].children)
  return { label, heading, text, device: 'chips', chips, note }
}

// ── faq-tabs (Pulse only) ────────────────────────────────────────────────────────────

function faqTabsFromPulseFaqComponent() {
  const ast = parseFile(path.join(ROOT, 'components', 'PulseFAQ.tsx'))
  let categoriesObj = null
  let faqDataObj = null
  let title = ''
  let subtitle = ''
  traverse(ast, {
    VariableDeclarator(node) {
      const name = node.node.id.name
      if (name === 'categories') categoriesObj = litValue(node.node.init)
      if (name === 'faqData') faqDataObj = litValue(node.node.init)
    },
    JSXOpeningElement(node) {
      if (node.node.name.name !== 'FAQ') return
      for (const attr of node.node.attributes) {
        const key = attr.name.name
        if (key !== 'title' && key !== 'subtitle') continue
        const val = attr.value.type === 'StringLiteral' ? attr.value.value : litValue(attr.value.expression)
        if (key === 'title') title = val
        if (key === 'subtitle') subtitle = val
      }
    },
  })
  const categories = Object.entries(categoriesObj).map(([key, label]) => ({ key, label }))
  const items = []
  for (const [key, qs] of Object.entries(faqDataObj)) {
    for (const q of qs) items.push({ categoryKey: key, question: q.question, answer: q.answer })
  }
  return { name: 'ciphera/faq-tabs', attrs: { title, subtitle, categories, items } }
}

// ── per-page assembly ────────────────────────────────────────────────────────────────

function setSource(file) {
  CURRENT_SRC = fs.readFileSync(file, 'utf-8')
}

function buildCaptchaSeed() {
  const file = path.join(ROOT, 'app', 'products', 'captcha', 'page.tsx')
  setSource(file)
  const ast = parseFile(file)
  const seo = extractMetadata(ast)
  const sections = topLevelSections(ast, 'CipheraCaptchaPage')
  const blocks = []
  blocks.push(productBanner(sections[0], 'hero'))
  blocks.push(featureSplit(findSectionById(ast, 'proof-of-work')))
  blocks.push(featureGrid(findSectionById(ast, 'features')))
  blocks.push(featureSplit(findSectionById(ast, 'stateless')))
  blocks.push(featureSplit(findSectionById(ast, 'privacy')))
  blocks.push(comparisonCards(findSectionById(ast, 'comparison')))
  blocks.push(productBanner(sections[sections.length - 1], 'band'))
  return { site: 'ciphera-net', path: '/products/captcha', title: seo.title, seo, blocks }
}

function buildIdSeed() {
  const file = path.join(ROOT, 'app', 'products', 'id', 'page.tsx')
  setSource(file)
  const ast = parseFile(file)
  const seo = extractMetadata(ast)
  const sections = topLevelSections(ast, 'CipheraIDPage')
  const blocks = []
  blocks.push(productBanner(sections[0], 'hero'))
  blocks.push(featureSplit(findSectionById(ast, 'what-it-is')))
  blocks.push(featureSplit(findSectionById(ast, 'zero-knowledge-auth')))
  const vault = contentBlockCredentialTable(findSectionById(ast, 'vault'))
  blocks.push({ name: 'ciphera/content-block', attrs: { ...contentBlockDefaults(), ...vault } })
  blocks.push(featureGrid(findSectionById(ast, 'sessions')))
  blocks.push(featureSplit(findSectionById(ast, 'privacy')))
  blocks.push(productBanner(sections[sections.length - 1], 'band'))
  return { site: 'ciphera-net', path: '/products/id', title: seo.title, seo, blocks }
}

function buildPulseSeed() {
  const file = path.join(ROOT, 'app', 'products', 'pulse', 'page.tsx')
  setSource(file)
  const ast = parseFile(file)
  const seo = extractMetadata(ast)
  const sections = topLevelSections(ast, 'PulsePage')
  const blocks = []
  blocks.push(productBanner(sections[0], 'hero'))
  blocks.push(featureSplit(findSectionById(ast, 'dashboard')))
  blocks.push(featureGrid(findSectionById(ast, 'features')))
  blocks.push(featureSplit(findSectionById(ast, 'script')))
  blocks.push(featureSplit(findSectionById(ast, 'privacy')))
  blocks.push(comparisonCards(findSectionById(ast, 'comparison')))
  blocks.push(faqTabsFromPulseFaqComponent())
  blocks.push(productBanner(sections[sections.length - 1], 'band'))
  return { site: 'ciphera-net', path: '/products/pulse', title: seo.title, seo, blocks }
}

function buildRelaySeed() {
  const file = path.join(ROOT, 'app', 'products', 'relay', 'page.tsx')
  setSource(file)
  const ast = parseFile(file)
  const seo = extractMetadata(ast)
  const sections = topLevelSections(ast, 'CipheraRelayPage')
  const blocks = []
  blocks.push(productBanner(sections[0], 'hero'))
  blocks.push(featureSplit(findSectionById(ast, 'alerts')))
  blocks.push(featureGrid(findSectionById(ast, 'features')))
  blocks.push(featureSplit(findSectionById(ast, 'integration')))
  blocks.push(featureSplit(findSectionById(ast, 'privacy')))
  blocks.push(comparisonCards(findSectionById(ast, 'comparison')))
  blocks.push(productBanner(sections[sections.length - 1], 'band'))
  return { site: 'ciphera-net', path: '/products/relay', title: seo.title, seo, blocks }
}

function contentBlockDefaults() {
  return { diagramKey: '', rows: [], tableTitle: '', tableSubtitle: '', chips: [], bullets: [], bulletStyle: 'check', note: '', noteTight: false }
}

function buildTesseraSeed() {
  const file = path.join(ROOT, 'app', 'products', 'tessera', 'page.tsx')
  setSource(file)
  const ast = parseFile(file)
  const seo = extractMetadata(ast)
  const sections = topLevelSections(ast, 'TesseraPage')
  let packagesArrayNode = null
  traverse(ast, {
    VariableDeclarator(node) {
      if (node.node.id.name !== 'packages') return
      let init = node.node.init
      while (init.type === 'TSAsExpression' || init.type === 'TSTypeAssertion') init = init.expression
      packagesArrayNode = init
    },
  })
  const blocks = []
  blocks.push(productBanner(sections[0], 'hero'))
  blocks.push({ name: 'ciphera/content-block', attrs: { ...contentBlockDefaults(), ...contentBlockNone(findSectionById(ast, 'what-it-is')) } })
  blocks.push(packageGrid(findSectionById(ast, 'packages'), packagesArrayNode))
  const why = contentBlockDiagram(findSectionById(ast, 'why-opaque'))
  blocks.push({ name: 'ciphera/content-block', attrs: { ...contentBlockDefaults(), ...why } })
  const who = contentBlockChips(findSectionById(ast, 'who-uses-it'))
  blocks.push({ name: 'ciphera/content-block', attrs: { ...contentBlockDefaults(), ...who, noteTight: true } })
  blocks.push(productBanner(sections[sections.length - 1], 'band'))
  return { site: 'ciphera-net', path: '/products/tessera', title: seo.title, seo, blocks }
}

// ── main ──────────────────────────────────────────────────────────────────────────

const PAGES = [
  { slug: 'captcha', build: buildCaptchaSeed },
  { slug: 'id', build: buildIdSeed },
  { slug: 'pulse', build: buildPulseSeed },
  { slug: 'relay', build: buildRelaySeed },
  { slug: 'tessera', build: buildTesseraSeed },
]

for (const { slug, build } of PAGES) {
  const result = build()
  const seo = {
    title: TITLE_TEMPLATE.replace('%s', result.seo.title),
    description: result.seo.description,
    canonical: result.seo.canonical,
    ogTitle: result.seo.ogTitle,
    ogDescription: result.seo.ogDescription,
    twitterTitle: result.seo.twitterTitle,
    twitterDescription: result.seo.twitterDescription,
  }
  const seed = { site: result.site, path: result.path, title: result.title, seo, blocks: result.blocks }
  const outPath = path.join(ROOT, 'scripts', 'pages-seed', `${slug}.json`)
  fs.writeFileSync(outPath, JSON.stringify(seed, null, 2) + '\n', 'utf-8')
  console.log(`wrote ${outPath}`)
}
