/**
 * Writes `scripts/menus-seed/{header,footer}.json` — the import-menus seed WordPress
 * imports to create ciphera.net's two `ciphera_menu` rows (M2, §4.2.2).
 *
 * 🔑 MECHANICAL, NOT A HAND COPY. Both files are produced by walking
 * `lib/cms/menu-seed.ts`'s `buildHeaderMenuDocument()` / `buildFooterMenuDocument()` —
 * the SAME functions the request-time seam falls back to — into the block-import shape
 * (`{"site","location","title","blocks":[{"name","attrs"}]}`). There is no second,
 * separately maintained description of today's navigation anywhere in this repo.
 *
 * Run: `npx tsx scripts/generate-menus-seed.ts`. One-off, not wired into `prebuild` —
 * re-run it by hand if `menu-seed.ts`'s content ever changes and the import files need
 * to catch up (same device as `scripts/generate-seo.ts` being a manual, not a prebuild,
 * step for the pieces that have no live-site build dependency).
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildHeaderMenuDocument, buildFooterMenuDocument } from '../lib/cms/menu-seed'
import type { MenuDocument, MenuGroup } from '../lib/cms/menu-build'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(root, 'scripts', 'menus-seed')

function groupToBlock(g: MenuGroup) {
  return {
    name: 'ciphera/menu-group',
    attrs: {
      label: g.label,
      source: g.source,
      noteText: g.note?.text ?? '',
      noteHref: g.note?.href ?? '',
      items: g.items.map((it) => ({ label: it.label, href: it.href, description: it.description, media: it.media })),
    },
  }
}

function brandToBlock(doc: MenuDocument) {
  if (!doc.brand) return null
  return {
    name: 'ciphera/menu-brand',
    attrs: { name: doc.brand.name, blurb: doc.brand.blurb, social: doc.brand.social },
  }
}

function toImportFormat(site: string, title: string, doc: MenuDocument) {
  const blocks = [brandToBlock(doc), ...doc.groups.map(groupToBlock)].filter((b) => b !== null)
  return { site, location: doc.location, title, blocks }
}

function main(): void {
  mkdirSync(OUT_DIR, { recursive: true })

  const header = toImportFormat('ciphera-net', 'Header', buildHeaderMenuDocument())
  const footer = toImportFormat('ciphera-net', 'Footer', buildFooterMenuDocument())

  writeFileSync(join(OUT_DIR, 'header.json'), JSON.stringify(header, null, 2) + '\n')
  writeFileSync(join(OUT_DIR, 'footer.json'), JSON.stringify(footer, null, 2) + '\n')

  console.log(`wrote ${join(OUT_DIR, 'header.json')} (${header.blocks.length} blocks)`)
  console.log(`wrote ${join(OUT_DIR, 'footer.json')} (${footer.blocks.length} blocks)`)
}

main()
