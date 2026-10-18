#!/usr/bin/env python3
"""The OG cards' text metrics (D52; plan §5l): advance widths and pair kerning of the vendored Geist SemiBold (titles)
and Regular (leads), for lib/og/layout.ts to set a card's words exactly as the approved mock's browser did.

Why a table and not the renderer's own text layout: next/og (Satori) positions each word by the sum of its letters'
unkerned widths but draws the word kerned, so every word leaves a gap after it as wide as its own kerning (13 px after
"Migrate" at 100 px, measured 19-10-2026), and its opentype.js stops at the first kerning lookup where Chrome sums them
(872 of 41,209 pairs differ in this font). The mock was drawn by Chrome: letter-spacing after every character, GPOS pair
kerning summed over the kern lookups, no ligatures under letter-spacing. This table holds exactly that, so the layout
can place every glyph where Chrome put it and the renderer only draws glyphs. The leads (28 px, an HTML paragraph in the
mock) had the same gaps, smaller.

Run after changing the font (the test __tests__/og-cards.test.mjs fails until the table matches the font file):
    python3 scripts/og-font-metrics.py
Needs fontTools (`pip install fonttools`); the website build never runs it.
"""
import hashlib
import json
import pathlib

from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
FONTS = [
    (ROOT / 'lib/og/fonts/Geist-SemiBold.ttf', ROOT / 'lib/og/geist-semibold-metrics.json'),
    (ROOT / 'lib/og/fonts/Geist-Regular.ttf', ROOT / 'lib/og/geist-regular-metrics.json'),
]

# What a title can contain: printable ASCII, Latin-1, and the typographic punctuation the site writes. A title with
# anything else is set by the renderer's own text layout instead (lib/og/render.tsx).
CHARS = list(range(0x20, 0x7F)) + list(range(0xA0, 0x100)) + [
    0x2018, 0x2019, 0x201C, 0x201D, 0x2013, 0x2014, 0x2026, 0x2022, 0x20AC, 0x2122,
]


def pair_value(subtable, left, right):
    """One PairPos subtable's x-advance for (left, right), or None when the subtable does not apply (HarfBuzz rules:
    format 1 applies only when the pair is listed; format 2 applies whenever the left glyph is covered)."""
    if left not in subtable.Coverage.glyphs:
        return None
    if subtable.Format == 1:
        pair_set = subtable.PairSet[subtable.Coverage.glyphs.index(left)]
        for record in pair_set.PairValueRecord:
            if record.SecondGlyph == right:
                return (getattr(record.Value1, 'XAdvance', 0) or 0) if record.Value1 is not None else 0
        return None
    class1 = subtable.ClassDef1.classDefs.get(left, 0)
    class2 = subtable.ClassDef2.classDefs.get(right, 0)
    value = subtable.Class1Record[class1].Class2Record[class2].Value1
    return (getattr(value, 'XAdvance', 0) or 0) if value is not None else 0


def build(FONT, OUT):
    font = TTFont(FONT)
    cmap = font.getBestCmap()
    hmtx = font['hmtx']
    gpos = font['GPOS'].table

    # The kern feature of the Latin script's default language system: what Chrome applies to Latin text.
    latn = next(s for s in gpos.ScriptList.ScriptRecord if s.ScriptTag == 'latn').Script.DefaultLangSys
    kern_lookups = sorted(
        index
        for fi in latn.FeatureIndex
        if gpos.FeatureList.FeatureRecord[fi].FeatureTag == 'kern'
        for index in gpos.FeatureList.FeatureRecord[fi].Feature.LookupListIndex
    )
    chars = [c for c in CHARS if c in cmap]
    advance = {chr(c): hmtx[cmap[c]][0] for c in chars}
    kern = {}
    for lc in chars:
        row = {}
        for rc in chars:
            total = 0
            for index in kern_lookups:
                lookup = gpos.LookupList.Lookup[index]
                assert lookup.LookupType == 2, f'kern lookup {index} is type {lookup.LookupType}'
                for subtable in lookup.SubTable:
                    v = pair_value(subtable, cmap[lc], cmap[rc])
                    if v is not None:
                        total += v
                        break
            if total:
                row[chr(rc)] = total
        if row:
            kern[chr(lc)] = row

    out = {
        'font': FONT.name,
        'sha256': hashlib.sha256(FONT.read_bytes()).hexdigest(),
        'unitsPerEm': font['head'].unitsPerEm,
        'kernLookups': kern_lookups,
        'advance': advance,
        'kern': kern,
    }
    OUT.write_text(json.dumps(out, ensure_ascii=False, separators=(',', ':'), sort_keys=True) + '\n')
    pairs = sum(len(r) for r in kern.values())
    print(f'{OUT.relative_to(ROOT)}: {len(advance)} characters, {pairs} kerning pairs, {OUT.stat().st_size} bytes')


if __name__ == '__main__':
    for font_path, out_path in FONTS:
        build(font_path, out_path)
