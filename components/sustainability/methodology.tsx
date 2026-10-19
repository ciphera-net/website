import { BookOpen, ListChecks, Clock } from '@phosphor-icons/react/dist/ssr'
import type { ImpactReport } from './types'

interface MethodologyProps {
  report: ImpactReport
}

// * Not in either computation, whichever path served the report, so they are listed after the
// * report's own exclusions.
const NOT_COUNTED = [
  'Object storage and backups (Exoscale, Infomaniak)',
  'Bunny: the CDN, and the containers that serve this website, docs, help and status',
] as const

/**
 * Section 6 — How we estimate this. Auditor-shaped: narrower column,
 * content-dense, one welded panel (source, what's included, refresh cadence
 * as internal rows). No imagery.
 */
export function Methodology({ report }: MethodologyProps) {
  const blocks = [
    {
      icon: BookOpen,
      title: 'Source of truth',
      body: (
        <>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {report.source === 'exoscale-api' ? (
              <>
                Numbers come from our hosting provider&apos;s
                environmental-impact report, built on{' '}
                <a
                  href="https://boavizta.org"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Boavizta
                </a>
                &apos;s life-cycle method.
              </>
            ) : (
              <>
                Our host&apos;s report has no recent month, so these figures are
                our own estimate.
              </>
            )}{' '}
            Each request is HMAC-signed, and the result is cached for 24 hours.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            If our host&apos;s report is unavailable, we fall back to an
            estimate computed from our server list and Boavizta&apos;s open
            emissions factors. The source badge at the top of this page
            tells you which path served the current numbers — currently:{' '}
            <strong className="text-foreground">
              {report.source === 'exoscale-api'
                ? "Our host's report"
                : 'Computed fallback'}
            </strong>
            .
          </p>
        </>
      ),
    },
    {
      icon: ListChecks,
      title: "What's included (and what isn't)",
      body: (
        <>
          <p className="text-muted-foreground mb-3">We count:</p>
          <ul className="space-y-1.5 text-muted-foreground mb-4">
            <li>✓ Compute: our Exoscale servers in Zurich</li>
            <li>
              ✓ All four lifecycle phases of our servers: manufacturing,
              transport, use and end of life (modelled, not metered)
            </li>
          </ul>
          <p className="text-muted-foreground mb-3">We don&apos;t count:</p>
          <ul className="space-y-1.5 text-muted-foreground">
            {[
              // The backend's own Bunny line is superseded by NOT_COUNTED's, which also names the containers.
              ...report.methodology.excludes.filter((e) => !e.startsWith('Bunny')),
              ...NOT_COUNTED,
            ].map((exclusion) => (
              <li key={exclusion}>✗ {exclusion}</li>
            ))}
          </ul>
        </>
      ),
    },
    {
      icon: Clock,
      title: 'Refresh cadence',
      body: (
        <p className="text-muted-foreground leading-relaxed">
          This page is regenerated every 24 hours. Our provider recomputes its
          report roughly monthly, so the reporting period can lag by weeks or
          months. When no month is available, the page shows our own estimate
          for the current month. The figure's caption always shows the
          month the numbers cover. Our provider&apos;s
          environmental API is in public{' '}
          <span className="text-muted-foreground">BETA</span> — if the schema
          changes or the endpoint is retired, we&apos;ll automatically switch
          to the fallback path without breaking the page.
        </p>
      ),
    },
  ]

  return (
    <section id="methodology" className="py-20 lg:py-32 border-b border-border bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-xs text-muted-foreground">04 · Methodology</p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            How we estimate this
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No magic, no marketing. Here&apos;s exactly where the numbers come
            from.
          </p>
        </div>

        <div className="border border-border bg-card">
          {blocks.map((block, i) => (
            <div
              key={block.title}
              className={
                'p-6 md:p-8 ' + (i > 0 ? 'border-t border-border' : '')
              }
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center border border-border bg-background">
                  <block.icon className="h-5 w-5 text-muted-foreground" weight="duotone" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{block.title}</h3>
              </div>
              <div>{block.body}</div>
            </div>
          ))}
          <div className="border-t border-border px-6 py-4 md:px-8 md:py-5">
            <p className="text-xs text-muted-foreground">
              Factors version: {report.methodology.factorsVersion} · Grid intensity
              source: {report.methodology.gridSource}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
