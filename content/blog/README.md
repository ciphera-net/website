# `content/blog/` is empty on purpose

The blog moved into the headless CMS on 10-09-2026 (design decision D13,
`Public/docs/plans/10-09-2026-headless-wordpress-cms-design.md` §24.14). Posts are
written at <https://cms.teleport.ciphera.net> → **Blog** and pulled in at build time by
`npm run generate:blog`.

## ⚠️ An `.mdx` file here does not republish a post today (23-10-2026)

`lib/blog.ts` still resolves a post from **either** source, and a slug present in both
is a **build failure**, never a precedence rule. But the post template
(`components/overhaul/blog/BlogPost.tsx`) renders only a WordPress (HTML) body. An
`.mdx` post builds and is listed, and its page shows an **empty article**. The older
template, `components/blog/post-view.tsx` (removed 23-10-2026), rendered MDX, but no
route had used it since the overhaul.

So this directory is not, for now, a way to publish while the CMS is unavailable.
Restoring an MDX branch in the template, or retiring the MDX source, is an open
decision, and `__tests__/blog-seam.test.mjs` pins today's behaviour until then:

- Do not drop a post in here expecting it to render.
- Do not delete `lib/blog.ts`'s MDX branch to "clean up" either. It is about thirty
  lines, and the decision may bring it back into use. The sixteen originals are one
  `git show` away in the history of this directory.
- ⚠️ A post placed here must be **unpublished in WordPress first**, or the build fails
  on the collision, which is the correct, loud outcome.
