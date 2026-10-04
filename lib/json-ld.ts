/**
 * Safely serialise a value for `<script type="application/ld+json">`.
 *
 * Ported from pulse-website@fa3d590 (PULSE-243): post-view.tsx wrote
 * `JSON.stringify(...)` straight into a `dangerouslySetInnerHTML` script, and every
 * field in that object is CMS-authored (title, description, category, FAQ
 * question/answer). ciphera-website's own post-view.tsx had the identical shape.
 *
 * `JSON.stringify` alone is not safe to drop into `dangerouslySetInnerHTML` inside a
 * `<script>` element: the HTML parser does not know it is looking at JSON, so it still
 * watches for the literal three characters `</script` (case-insensitively) and for an
 * HTML comment opener `<!--` INSIDE the script's text content — either one closes (or,
 * for a comment, suspends) the script element early, and whatever text follows in the
 * source becomes ordinary page markup. A blog post is CMS-authored (title, description,
 * category, FAQ question/answer), so a title containing `</script><script>…` or an FAQ
 * answer containing `<!-- ` is CMS content, not developer-controlled — and would break
 * out of the script tag it was meant to sit inside.
 *
 * The fix escapes every character that could start one of those sequences as a JSON
 * unicode escape. JSON parsers decode a `\uXXXX` escape back to the literal character,
 * so the DECODED value — the structured data a crawler reads — is byte-identical; only
 * the SERIALISED text that sits inside the `<script>` tag changes, in exactly the
 * places needed to stop an HTML parser from ever seeing `<`, `>` or `&` there.
 *
 * The LINE SEPARATOR / PARAGRAPH SEPARATOR characters are escaped too — not an HTML
 * concern, but `JSON.stringify` passes them through literally and they are valid
 * JavaScript string characters that some historical JSON-in-`<script>` tooling (and
 * strict-mode `eval`) treat as a line terminator, which breaks pages that read this
 * script with something other than `JSON.parse`.
 *
 * Built from character codes (String.fromCharCode) rather than typed as an inline
 * escape sequence or a raw character: a RegExp literal cannot contain a raw
 * LineTerminator at all (ECMAScript forbids it, full stop), and a source file carrying
 * the bare separator character itself is exactly the kind of invisible, easy-to-mangle
 * byte this module exists to keep out of this project's own text.
 */
const LINE_SEPARATOR = String.fromCharCode(0x2028)
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029)

const UNSAFE_CHARS = new RegExp('[<>&' + LINE_SEPARATOR + PARAGRAPH_SEPARATOR + ']', 'g')

const ESCAPES: Record<string, string> = {
  '<': '\\u003c',
  '>': '\\u003e',
  '&': '\\u0026',
}
ESCAPES[LINE_SEPARATOR] = '\\u2028'
ESCAPES[PARAGRAPH_SEPARATOR] = '\\u2029'

export function jsonLdHtml(value: unknown): string {
  return JSON.stringify(value).replace(UNSAFE_CHARS, (c) => ESCAPES[c])
}
