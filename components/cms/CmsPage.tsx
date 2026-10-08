import { MarketingSection, SeoHero, FaqBlock, RelatedLinks, SeoPageCta } from '@ciphera-net/facet-sections'
import Breadcrumbs from '@/components/Breadcrumbs'
import { CmsRichText } from './CmsRichText'
import { CmsLink } from './CmsLink'
import type { PageDocument, PageSection } from '@/lib/cms/page-build'

/**
 * Renders a published CMS page's sections through the shared Facet section library
 * (WEB-28, §4.2.1). One component per §4.2.1's table — the hero, text-section, faq,
 * related-links and closing-cta blocks `mu-plugins/ciphera-pages.php` restricts the
 * editor to, in the order WordPress stored them.
 *
 * 🔑 STRUCTURED DATA IS DERIVED, NEVER HAND-WRITTEN. `FaqBlock` already emits its own
 * FAQPage JSON-LD (§4.2.1: "the FAQ component already emits it") — there is nothing
 * for this component to add there. BreadcrumbList comes from the path alone, via the
 * same `Breadcrumbs` component every coded page already uses.
 *
 * 🔴 `SeoPageCta`'s OWN defaults are pulse-website's copy ("Try privacy-first
 * analytics free…", "View live demo" → `/demo`) — `@ciphera-net/facet-sections` was
 * promoted FROM pulse-website, so that is what a `closing-cta` section with an empty
 * title/text rendered on ciphera.net until this fix. The §4.2.1 block has no
 * secondary-link fields at all (the agency sets only `title`/`text`), so the
 * secondary action is ALWAYS ours, title/body default to ciphera.net's own standard
 * ending — the homepage's `ClosingCta` copy (`components/ClosingCta.tsx`), condensed
 * to the plain eyebrow/title/body shape this shared section takes — whether or not
 * the agency filled the section in.
 */
const CIPHERA_CLOSING_CTA_TITLE = 'Own your data.'
const CIPHERA_CLOSING_CTA_BODY =
  'One Ciphera ID account signs you in to every product we build. Your password never leaves your device, and we authenticate you without ever seeing your credentials.'
const CIPHERA_CLOSING_CTA_SECONDARY_HREF = '/products'
const CIPHERA_CLOSING_CTA_SECONDARY_LABEL = 'Explore products'

/** "/products/pulse" -> [{label:'Products', href:'/products'}, {label:'Pulse'}] — the
 * last segment carries no `href` (it is the current page, same convention every
 * `<Breadcrumbs items={[{label: 'X'}]}>` call in this codebase already uses). */
function breadcrumbItemsForPath(path: string): { label: string; href?: string }[] {
  const segments = path.split('/').filter(Boolean)
  const humanize = (s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return segments.map((segment, i) => {
    const isLast = i === segments.length - 1
    const href = '/' + segments.slice(0, i + 1).join('/')
    return isLast ? { label: humanize(segment) } : { label: humanize(segment), href }
  })
}

function Section({ section, index }: { section: PageSection; index: number }) {
  switch (section.type) {
    case 'hero':
      return <SeoHero eyebrow={section.label} title={section.title} lede={section.introduction} />

    case 'text-section':
      return (
        <MarketingSection
          id={section.linkName || undefined}
          eyebrowNumber={String(section.number).padStart(2, '0')}
          eyebrowLabel={section.label}
          heading={section.heading}
        >
          <CmsRichText
            html={section.text}
            className="prose prose-invert prose-neutral mt-6 max-w-2xl prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none"
          />
        </MarketingSection>
      )

    case 'faq':
      return section.items.length > 0 ? <FaqBlock items={section.items} /> : null

    case 'related-links':
      return section.items.length > 0 ? (
        <RelatedLinks
          links={section.items.map((it) => ({ label: it.label, description: it.description, href: it.href }))}
          LinkComponent={CmsLink}
        />
      ) : null

    case 'closing-cta':
      return (
        <SeoPageCta
          title={section.title || CIPHERA_CLOSING_CTA_TITLE}
          body={section.text || CIPHERA_CLOSING_CTA_BODY}
          secondaryHref={CIPHERA_CLOSING_CTA_SECONDARY_HREF}
          secondaryLabel={CIPHERA_CLOSING_CTA_SECONDARY_LABEL}
          LinkComponent={CmsLink}
        />
      )

    default:
      // Unreachable: lib/cms/page-build.ts already drops any section type it does
      // not know about, with a repair, before this component ever sees one.
      return null
  }
}

export function CmsPage({ page }: { page: PageDocument }) {
  return (
    <>
      <Breadcrumbs items={breadcrumbItemsForPath(page.path)} />
      {page.sections.map((section, i) => (
        <Section key={`${section.type}-${i}`} section={section} index={i} />
      ))}
    </>
  )
}
