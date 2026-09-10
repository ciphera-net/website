# `content/blog/` is empty on purpose

The blog moved into the headless CMS on 10-09-2026 (design decision D13,
`Public/docs/plans/10-09-2026-headless-wordpress-cms-design.md` §24.14). Posts are
written at <https://cms.ciphera.net> → **Blog** and pulled in at build time by
`npm run generate:blog`.

## This directory is not vestigial — it is the escape hatch

`lib/blog.ts` still resolves a post from **either** source, and a slug present in both
is a **build failure**, never a precedence rule. That is deliberate:

- Dropping an `.mdx` file back in here republishes that post from git, without WordPress
  and without a CMS session. The sixteen originals are one `git show` away in the history
  of this directory.
- ⚠️ The post must be **unpublished in WordPress first**, or the build fails on the
  collision — which is the correct, loud outcome, and the reason there is no silent
  winner.

Do not delete `lib/blog.ts`'s MDX branch to "clean up". It is about thirty lines and it
is the only way to publish a post when the CMS is unavailable.
