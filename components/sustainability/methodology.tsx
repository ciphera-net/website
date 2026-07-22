import { BookOpen, ListChecks, Clock } from '@phosphor-icons/react/dist/ssr'
import type { ImpactReport } from './types'

interface MethodologyProps {
  report: ImpactReport
}

/**
 * Section 6 — How we measure this. Auditor-shaped: narrower column,
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
            Numbers come directly from our hosting provider&apos;s LCA
            measurement API, which implements the{' '}
            <a
              href="https://boavizta.org"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Boavizta
            </a>{' '}
            life-cycle assessment framework. Every request is HMAC-signed,
            logged, and cached for 24 hours.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            If the measurement API is unavailable, we fall back to numbers
            computed from our published instance inventory using Boavizta&apos;s
            open emissions factors. The source badge at the top of this page
            tells you which path served the current numbers — currently:{' '}
            <strong className="text-foreground">
              {report.source === 'exoscale-api'
                ? 'Live measurement API'
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
            <li>✓ Compute — all {report.totals.instances} VMs across all zones</li>
            <li>✓ Object storage — DB backups, Docker registry, MTA-STS</li>
            <li>✓ All four lifecycle phases: manufacturing, transport, use, end-of-life</li>
          </ul>
          <p className="text-muted-foreground mb-3">We don&apos;t count:</p>
          <ul className="space-y-1.5 text-muted-foreground">
            {report.methodology.excludes.map((exclusion) => (
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
          This page is regenerated every 24 hours. Our provider&apos;s
          environmental API itself recomputes roughly monthly, so the reporting
          period may lag 3–5 days behind the current date. The badge at the top
          always shows the month the numbers cover. Our provider&apos;s
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
            How we measure this
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
