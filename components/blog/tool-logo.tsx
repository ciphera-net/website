import { cdnUrl } from '@/lib/cdn'

/**
 * Small inline tool/company mark rendered before a tool's heading text in
 * roundup posts (e.g. open-source-privacy-tools-2026).
 *
 * Decorative by contract: the adjacent heading text names the tool, so the
 * image carries an empty alt and is hidden from assistive tech — screen
 * readers hear the heading once, not "Signal logo, Signal".
 *
 * Sovereignty rule: marks are self-hosted on cdn.ciphera.net (uploaded via
 * scripts/cdn-upload.sh, prefix website/blog/tools/) — never hotlinked, so
 * reading the post pings no third-party host.
 *
 * Asset contract (normalized 19-07-2026): 128×128 transparent PNG, glyph
 * trimmed and centered with its longest side at 110px (~86% coverage). The
 * box here is fixed h-6/w-6 with object-contain, so any padding baked into a
 * source file shrinks that mark relative to its neighbors — normalize new
 * marks to this contract before upload or they will visibly mismatch.
 */
export function ToolLogo({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={cdnUrl(src)}
      alt=""
      aria-hidden="true"
      loading="lazy"
      width={24}
      height={24}
      // my-0 defeats the typography plugin's `.prose img` 2em vertical margins
      // (prose selectors are :where()-wrapped, so utilities win on specificity)
      className="my-0 mr-2 inline-block h-6 w-6 rounded-none object-contain align-[-0.25em]"
    />
  )
}
