'use client'

import { useEffect, useState } from 'react'
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote'
import {
  BlogBarChart,
  BlogAreaChart,
  BlogLineChart,
  BlogLollipopChart,
  BlogComparisonMatrix,
  BlogRadarChart,
} from '@/components/blog/charts'
import { BlogImage } from '@/components/blog/blog-image'
import { BlogBlockquote } from '@/components/blog/blog-blockquote'

const mdxComponents = {
  BlogBarChart,
  BlogAreaChart,
  BlogLineChart,
  BlogLollipopChart,
  BlogComparisonMatrix,
  BlogRadarChart,
  BlogImage,
  BlogBlockquote,
}

export function BlogMDXRenderer({ compiledSource, scope, frontmatter }: { compiledSource: string; scope: Record<string, unknown>; frontmatter: Record<string, unknown> }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="prose prose-invert max-w-none" />

  return (
    <div className="prose prose-invert max-w-none">
      <MDXRemote compiledSource={compiledSource} scope={scope} frontmatter={frontmatter} components={mdxComponents} />
    </div>
  )
}
