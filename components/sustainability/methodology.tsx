import { BookOpen, ListChecks, Clock } from '@phosphor-icons/react/dist/ssr'
import type { ImpactReport } from './types'

interface MethodologyProps {
  report: ImpactReport
}

/**
 * Section 6 — How we measure this. Auditor-shaped: narrower column,
 * content-dense, three stacked blocks (source, what's included, refresh
 * cadence). No imagery.
 */
export function Methodology({ report }: MethodologyProps) {
  const blocks = [
    {
      icon: BookOpen,
      title: 'Source of truth',
      body: (
        <>
          <p className="text-neutral-400 leading-relaxed mb-3">
            Numbers come directly from the Exoscale APIv2{' '}
            <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded">
              /v2/env-impact/{report.period.label.toLowerCase().replace(' ', '-')}
            </code>{' '}
            endpoint, accessed via a dedicated read-only API key scoped to the
            Exoscale organization service only — no compute, storage, or IAM
            access. Every request is HMAC-signed, logged, and cached for 24
            hours.
          </p>
          <p className="text-neutral-400 leading-relaxed">
            If the Exoscale API is unavailable, we fall back to numbers
            computed from our published instance inventory using{' '}
            <a
              href="https://boavizta.org"
              className="text-brand-orange hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Boavizta
            </a>{' '}
            open emissions factors. The source badge at the top of this page
            tells you which path served the current numbers — currently:{' '}
            <strong className="text-white">
              {report.source === 'exoscale-api'
                ? 'Exoscale API'
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
          <p className="text-neutral-400 mb-3">We count:</p>
          <ul className="space-y-1.5 text-neutral-400 mb-4">
            <li>✓ Compute — all {report.totals.instances} VMs across all zones</li>
            <li>✓ Object storage — DB backups, Docker registry, MTA-STS</li>
            <li>✓ All four lifecycle phases: manufacturing, transport, use, end-of-life</li>
          </ul>
          <p className="text-neutral-400 mb-3">We don&apos;t count:</p>
          <ul className="space-y-1.5 text-neutral-400">
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
        <p className="text-neutral-400 leading-relaxed">
          This page is regenerated every 24 hours. Exoscale&apos;s environmental
          API itself recomputes roughly monthly, so the reporting period may lag
          3–5 days behind the current date. The badge at the top always shows the
          month the numbers cover. The Exoscale env-impact API is in public{' '}
          <span className="text-brand-orange">BETA</span> — if the schema changes
          or the endpoint is retired, we&apos;ll automatically switch to the
          fallback path without breaking the page.
        </p>
      ),
    },
  ]

  return (
    <section id="methodology" className="py-20 lg:py-32 bg-neutral-950">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            How we measure this
          </h2>
          <p className="text-lg text-neutral-400">
            No magic, no marketing. Here&apos;s exactly where the numbers come
            from.
          </p>
        </div>

        <div className="space-y-4">
          {blocks.map((block) => (
            <div
              key={block.title}
              className="rounded-2xl border border-white/[0.08] bg-neutral-900/80 p-6 md:p-8 backdrop-blur-sm"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange/10">
                  <block.icon className="h-5 w-5 text-brand-orange" weight="duotone" />
                </div>
                <h3 className="text-xl font-semibold text-white">{block.title}</h3>
              </div>
              <div>{block.body}</div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-neutral-600">
          Factors version: {report.methodology.factorsVersion} · Grid intensity
          source: {report.methodology.gridSource}
        </p>
      </div>
    </section>
  )
}
