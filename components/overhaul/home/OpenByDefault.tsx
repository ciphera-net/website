/**
 * Round 2: Open by default. Measured 16-10-2026 with `gh repo list ciphera-net --visibility public`: 26 public
 * repositories (25 without the org's `.github`), 14 of them platform integrations. 🔴 No star counts: there are 6 in
 * total across all 26, which would read as weak. Copy is a DRAFT.
 */
import { ArrowUpRight, GithubLogo } from '@phosphor-icons/react/dist/ssr'
import { Section } from './Section'
import { Reveal } from './Reveal'

const REPOS = [
  { name: 'This website', repo: 'website', desc: 'The page you are reading, in full.', lang: 'TypeScript · Next.js', licence: 'AGPL-3.0' },
  { name: 'Pulse', repo: 'pulse', desc: 'The analytics dashboard our customers use.', lang: 'TypeScript · Next.js', licence: 'AGPL-3.0' },
  { name: 'Tessera', repo: 'tessera', desc: 'The library behind our sign-in. Your password never reaches us.', lang: 'Rust, Go, TypeScript', licence: 'Apache-2.0' },
  { name: 'Pulse CLI', repo: 'pulse-cli', desc: 'Your analytics from the terminal.', lang: 'Go', licence: 'Apache-2.0' },
  { name: '14 integrations', repo: '?q=pulse-&type=public', desc: 'Astro, Nuxt, Framer, Drupal, Joomla, TYPO3 and more.', lang: 'Many', licence: 'Open source' },
  { name: 'Sigil', repo: 'sigil', desc: 'The favicon service behind our dashboards.', lang: 'Go', licence: 'Apache-2.0' },
]

export function OpenByDefault() {
  return (
    <Section
      id="open"
      eyebrow="Open by default"
      title="Read the code, including this website's."
      lead="25 of our repositories are public. You do not have to take our word for how the software works."
      aside={
        <a href="https://github.com/ciphera-net" className="inline-flex h-11 items-center gap-2 border border-border px-5 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-accent">
          <GithubLogo className="h-4 w-4" aria-hidden="true" /> github.com/ciphera-net
        </a>
      }
    >
      <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {REPOS.map((r, i) => (
          <Reveal key={r.name} delay={(i % 3) * 70} className="bg-background">
            <a href={`https://github.com/ciphera-net/${r.repo.startsWith('?') ? '' : r.repo}${r.repo.startsWith('?') ? r.repo : ''}`} className="group flex h-full flex-col p-7 transition-colors duration-150 hover:bg-card">
              <div className="flex items-center justify-between">
                <GithubLogo className="h-5 w-5 text-foreground/70" aria-hidden="true" />
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors duration-150 group-hover:text-foreground" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">{r.name}</h3>
              <p className="mt-1.5 flex-1 text-[15px] leading-relaxed text-muted-foreground">{r.desc}</p>
              <p className="mt-6 text-[13px] text-muted-foreground">
                {r.lang} · {r.licence}
              </p>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
