/**
 * Option C for "Open by default": one large statement built on the "25" figure, then
 * every repository as a single dense, all-text index — no card grid (option A), no
 * window chrome (variant B), nothing boxed at all. Repo names stay sans (they are
 * prose); only each repo's actual GitHub slug is set in mono, the same rule the rest
 * of the site uses for a literal path or package name.
 */
import { ArrowUpRight, GithubLogo } from '@phosphor-icons/react/dist/ssr'
import { Section } from '../Section'
import { Reveal } from '../Reveal'

const REPOS = [
  { name: 'This website', repo: 'website', desc: 'The page you are reading, in full.', lang: 'TypeScript · Next.js', licence: 'AGPL-3.0' },
  { name: 'Pulse', repo: 'pulse', desc: 'The analytics dashboard our customers use.', lang: 'TypeScript · Next.js', licence: 'AGPL-3.0' },
  { name: 'Tessera', repo: 'tessera', desc: 'Our sign-in protocol: your password never reaches us.', lang: 'Rust, Go, TypeScript', licence: 'Apache-2.0' },
  { name: 'Pulse CLI', repo: 'pulse-cli', desc: 'Your analytics from the terminal.', lang: 'Go', licence: 'Apache-2.0' },
  { name: '14 integrations', repo: '?q=pulse-&type=public', desc: 'Astro, Nuxt, Framer, Drupal, Joomla, TYPO3 and more.', lang: 'Many', licence: 'Open source' },
  { name: 'Sigil', repo: 'sigil', desc: 'The favicon service behind our dashboards.', lang: 'Go', licence: 'Apache-2.0' },
] as const

function repoHref(repo: string) {
  return repo.startsWith('?') ? `https://github.com/ciphera-net${repo}` : `https://github.com/ciphera-net/${repo}`
}

export function OpenByDefaultC() {
  return (
    <Section
      id="open"
      eyebrow="Open by default"
      title="Read the code. Even this website's."
      lead="You do not have to take our word for how the software works."
      aside={
        <div className="flex flex-col gap-1 lg:items-end">
          <p className="font-display text-7xl font-semibold leading-none tracking-tight tabular-nums text-foreground">25</p>
          <p className="text-sm text-muted-foreground lg:text-right">
            public repositories,
            <br />
            including this page
          </p>
        </div>
      }
    >
      <Reveal>
        <ul className="border-t border-border">
          {REPOS.map((r) => (
            <li key={r.name} className="border-b border-border">
              <a
                href={repoHref(r.repo)}
                className="group flex flex-col gap-2 py-7 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 sm:w-64 sm:shrink-0">
                  <h3 className="text-xl font-semibold tracking-tight text-foreground transition-colors duration-150 group-hover:text-primary">
                    {r.name}
                  </h3>
                  {!r.repo.startsWith('?') && <span className="font-mono text-[13px] text-muted-foreground">{r.repo}</span>}
                </div>
                <p className="flex-1 text-[15px] leading-relaxed text-muted-foreground">{r.desc}</p>
                <div className="flex shrink-0 items-center gap-3 text-[13px] text-muted-foreground sm:w-48 sm:justify-end">
                  <span>
                    {r.lang} · {r.licence}
                  </span>
                  <ArrowUpRight
                    className="h-3.5 w-3.5 text-muted-foreground transition-colors duration-150 group-hover:text-foreground"
                    aria-hidden="true"
                  />
                </div>
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <a
            href="https://github.com/ciphera-net"
            className="inline-flex h-11 items-center gap-2 border border-border px-5 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-accent"
          >
            <GithubLogo className="h-4 w-4" aria-hidden="true" /> github.com/ciphera-net
          </a>
        </div>
      </Reveal>
    </Section>
  )
}
