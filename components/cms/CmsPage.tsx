import {
  MarketingSection,
  SeoHero,
  FaqBlock,
  RelatedLinks,
  SeoPageCta,
  ProductBanner,
  FeatureSplit,
  FeatureGrid,
  ComparisonCards,
  PackageGrid,
  ContentBlock,
  FaqTabs,
} from '@ciphera-net/facet-sections'
import Breadcrumbs from '@/components/Breadcrumbs'
import { CmsRichText, cmsRichNodes } from './CmsRichText'
import { CmsLink } from './CmsLink'
import type { PageDocument, PageSection } from '@/lib/cms/page-build'
import {
  resolveTrustBadgeIcon,
  resolveFeatureGridIcon,
  resolveOverlayBadgeIcon,
  resolveComparisonIcon,
  resolveChipImage,
  resolveVisual,
  resolveLangIcon,
  resolveRegistryIcon,
  productBackgroundImage,
  featurePhotoImage,
} from '@/lib/cms/product-registries'

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

    // ── Product-page section types (WEB-28 build task §2) ───────────────────────

    case 'product-banner':
      return (
        <ProductBanner
          variant={section.variant}
          label={section.label}
          heading={cmsRichNodes(section.heading)}
          body={cmsRichNodes(section.body)}
          backgroundImage={productBackgroundImage(section.backgroundImage, section.backgroundImageAlt, section.variant === 'hero')}
          badgeStyle={section.badgeStyle}
          trustBadges={section.trustBadges.map((b) => ({ icon: b.icon ? resolveTrustBadgeIcon(b.icon) : undefined, label: b.label }))}
          stats={section.stats}
          primaryButton={
            section.primaryButtonLabel && section.primaryButtonHref
              ? { label: section.primaryButtonLabel, href: section.primaryButtonHref, external: section.primaryButtonExternal }
              : undefined
          }
          secondaryButton={
            section.secondaryButtonLabel && section.secondaryButtonHref
              ? { label: section.secondaryButtonLabel, href: section.secondaryButtonHref, external: section.secondaryButtonExternal }
              : undefined
          }
          footnote={section.footnote ? cmsRichNodes(section.footnote) : undefined}
          LinkComponent={CmsLink}
        />
      )

    case 'feature-split':
      return (
        <FeatureSplit
          label={section.label}
          heading={section.heading}
          text={Array.isArray(section.text) ? section.text.map((p) => cmsRichNodes(p)) : cmsRichNodes(section.text)}
          trailingText={section.trailingText ? cmsRichNodes(section.trailingText) : undefined}
          bullets={section.bullets}
          bulletStyle={section.bulletStyle}
          cta={section.ctaLabel && section.ctaHref ? { label: section.ctaLabel, href: section.ctaHref } : undefined}
          visualSide={section.visualSide}
          visualType={(section.visualType || 'photo') as 'mockup' | 'diagram' | 'code' | 'photo'}
          visual={section.visualType !== 'photo' ? resolveVisual(section.visualKey) : undefined}
          visualCellBordered={section.visualCellBordered}
          mockupCell={section.mockupCell}
          image={section.visualType === 'photo' ? featurePhotoImage(section.image, section.imageAlt) : undefined}
          overlayBadges={section.overlayBadges.map((b) => ({
            icon: b.icon ? resolveOverlayBadgeIcon(b.icon) : undefined,
            title: b.title,
            description: b.description,
          }))}
          overlayBadgeStyle={section.overlayBadgeStyle}
          LinkComponent={CmsLink}
        />
      )

    case 'feature-grid':
      return (
        <FeatureGrid
          label={section.label}
          heading={section.heading}
          dek={section.dek || undefined}
          items={section.items.map((it) => ({ icon: resolveFeatureGridIcon(it.icon), title: it.title, body: it.body, anchor: it.anchor || undefined }))}
          bullets={section.bullets.length > 0 ? section.bullets : undefined}
        />
      )

    case 'comparison-cards':
      return (
        <ComparisonCards
          label={section.label}
          heading={section.heading}
          intro={cmsRichNodes(section.intro)}
          statsStrip={section.statsStrip.length > 0 ? section.statsStrip : undefined}
          ours={{
            icon: resolveComparisonIcon(section.ours.icon, section.ours.name, 'ours'),
            name: section.ours.name,
            tagline: section.ours.tagline,
            highlighted: section.ours.highlighted,
            taglineAccent: section.ours.taglineAccent,
            items: section.ours.items,
          }}
          theirs={{
            icon: resolveComparisonIcon(section.theirs.icon, section.theirs.name, 'theirs'),
            name: section.theirs.name,
            tagline: section.theirs.tagline,
            checkAccent: section.theirs.checkAccent,
            items: section.theirs.items,
          }}
        />
      )

    case 'package-grid':
      return (
        <PackageGrid
          label={section.label}
          heading={section.heading}
          items={section.items.map((it) => ({
            langIcon: resolveLangIcon(it.langIcon),
            lang: it.lang,
            name: it.name,
            role: it.role,
            body: it.body,
            repoHref: it.repoHref,
            registryHref: it.registryHref,
            registryIcon: resolveRegistryIcon(it.registryIcon),
            registryLabel: it.registryLabel,
            registryPkg: it.registryPkg,
          }))}
          LinkComponent={CmsLink}
        />
      )

    case 'content-block': {
      const device =
        section.device === 'diagram'
          ? ({ type: 'diagram', diagram: resolveVisual(section.diagramKey) } as const)
          : section.device === 'credential-table'
            ? ({ type: 'credential-table', title: section.tableTitle, subtitle: section.tableSubtitle, rows: section.rows } as const)
            : section.device === 'chips'
              ? ({ type: 'chips', items: section.chips.map((c) => ({ image: resolveChipImage(c.image), label: c.label, href: c.href })) } as const)
              : ({ type: 'none' } as const)
      return (
        <ContentBlock
          label={section.label}
          heading={section.heading}
          text={cmsRichNodes(section.text)}
          device={device}
          bullets={section.bullets.length > 0 ? section.bullets : undefined}
          note={section.note ? cmsRichNodes(section.note) : undefined}
          noteTight={section.noteTight}
          LinkComponent={CmsLink}
        />
      )
    }

    case 'faq-tabs':
      return section.categories.length > 0 && section.items.length > 0 ? (
        <FaqTabs title={section.title || undefined} subtitle={section.subtitle || undefined} categories={section.categories} items={section.items} />
      ) : null

    default:
      // Unreachable: lib/cms/page-build.ts already drops any section type it does
      // not know about, with a repair, before this component ever sees one.
      return null
  }
}

/**
 * `breadcrumbs`: a migratable product page (build task §3) keeps its OWN
 * SoftwareApplication + BreadcrumbList JSON-LD in code — contract §5: that
 * structured data is "derived" from the product's own identity, not from section
 * content, so it stays exactly as it is whichever version of the page is live
 * (Phase E). Pass `breadcrumbs={false}` there so this component does not also emit
 * a second, generic BreadcrumbList. Defaults to `true` (the catch-all's new pages,
 * which have no coded breadcrumb of their own).
 */
export function CmsPage({ page, breadcrumbs = true }: { page: PageDocument; breadcrumbs?: boolean }) {
  return (
    <>
      {breadcrumbs && <Breadcrumbs items={breadcrumbItemsForPath(page.path)} />}
      {page.sections.map((section, i) => (
        <Section key={`${section.type}-${i}`} section={section} index={i} />
      ))}
    </>
  )
}
