import { BlogIndexPage, isCategoryKey } from '@/components/overhaul/blog/BlogIndex'

// 'blog' is a runtime kind (lib/cms/runtime-config.ts): the index reads the content zone per request, as the posts do,
// so a post published in the CMS appears here without a build. ?category= is read per request too.
export const dynamic = 'force-dynamic'

/**
 * The blog index as ruled (D38, plan §5i): the sunrise opening with the RSS link, the categories as jump links, the three
 * newest posts as cards, then each category as rows. `?category=<key>` shows one category as a full grid; an unknown key
 * shows the whole index. The CollectionPage, ItemList and BreadcrumbList data are emitted by the component, through
 * jsonLdHtml().
 */
export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string | string[] }> }) {
  const { category } = await searchParams
  const key = Array.isArray(category) ? category[0] : category
  return <BlogIndexPage variant="f" category={isCategoryKey(key) ? key : null} />
}
