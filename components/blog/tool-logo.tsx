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
 */
export function ToolLogo({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={cdnUrl(src)}
      alt=""
      aria-hidden="true"
      loading="lazy"
      width={20}
      height={20}
      // my-0 defeats the typography plugin's `.prose img` 2em vertical margins
      // (prose selectors are :where()-wrapped, so utilities win on specificity)
      className="my-0 mr-1.5 inline-block h-5 w-5 rounded-none object-contain align-[-0.2em]"
    />
  )
}
