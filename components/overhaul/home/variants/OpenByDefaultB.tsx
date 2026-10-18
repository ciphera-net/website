/**
 * Option B for "Open by default": one code-window object (title bar, file tree, install
 * command, repo index) instead of option A's grid of six identical cards. The device IS
 * the artifact — something you could have typed into — not a tile layout. Mono stays
 * reserved for what is actually literal here (the file tree, the command, each repo's
 * GitHub slug); names, descriptions, language and licence stay sans.
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

const TREE = ['app/', 'components/', 'lib/', 'public/', 'package.json']

export function OpenByDefaultB() {
  return (
    <Section
      id="open"
      eyebrow="Open by default"
      title="Read the code. Even this website's."
      lead="25 of our repositories are public. You do not have to take our word for how the software works."
      aside={
        <a
          href="https://github.com/ciphera-net"
          className="inline-flex h-11 items-center gap-2 border border-border px-5 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-accent"
        >
          <GithubLogo className="h-4 w-4" aria-hidden="true" /> github.com/ciphera-net
        </a>
      }
    >
      <Reveal>
        <div className="border border-white/[0.08] bg-card">
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
            <span className="font-mono text-xs text-muted-foreground">ciphera-net/website</span>
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/25" />
              <span className="h-2 w-2 rounded-full bg-muted-foreground/25" />
              <span className="h-2 w-2 rounded-full bg-muted-foreground/25" />
            </div>
          </div>

          <div className="grid lg:grid-cols-[200px_1fr]">
            <div className="flex flex-col gap-1.5 border-b border-border px-5 py-5 font-mono text-[13px] leading-relaxed text-muted-foreground lg:border-b-0 lg:border-r">
              {TREE.map((entry) => (
                <span key={entry}>{entry}</span>
              ))}
            </div>

            <div className="px-5 py-5">
              <p className="break-all font-mono text-[13px] text-foreground sm:break-normal">
                <span className="text-muted-foreground">$</span> brew install ciphera-net/tap/pulse
              </p>
              <div className="mt-6 divide-y divide-border border-t border-border">
                {REPOS.map((r) => (
                  <a
                    key={r.name}
                    href={repoHref(r.repo)}
                    className="group flex flex-col gap-1.5 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                  >
                    <div className="flex items-baseline gap-2.5 sm:w-40 sm:shrink-0">
                      {r.repo.startsWith('?') ? (
                        <span className="text-[13px] font-medium text-foreground">14 integrations</span>
                      ) : (
                        <span className="font-mono text-[13px] text-foreground">{r.repo}</span>
                      )}
                      <ArrowUpRight
                        className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="flex-1 text-[14px] leading-relaxed text-muted-foreground">{r.desc}</p>
                    <p className="shrink-0 text-[13px] text-muted-foreground sm:w-44 sm:text-right">
                      {r.lang} · {r.licence}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
