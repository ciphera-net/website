import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * R11 (D67) — the phone menu is a modal. Source-level, same as the rest of this suite; the behaviour (the page inert and
 * still, a tap outside pressing nothing, Tab kept in the header, Escape, the fade on close, each page once) is measured
 * in Chromium by Public/docs/data/19-10-2026-r11-round/menu-check.mjs.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
function code(p) {
  return readFileSync(join(root, p), 'utf-8')
    .replace(/\/\*(?!\.)[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}
const src = code('components/overhaul/OverhaulHeader.tsx')
const menu = src.slice(src.indexOf('function MobileMenu('), src.indexOf('function useScrolled('))

test('while open, the page beside the header is inert and does not scroll', () => {
  assert.match(menu, /for \(const el of behind\) el\.inert = true/)
  assert.match(menu, /for \(const el of behind\) el\.inert = false/)
  assert.match(menu, /root\.style\.overflow = 'hidden'/)
  // Every level up to <body>, so a wrapper around the page cannot leave it reachable.
  assert.match(menu, /node && node !== document\.body; node = node\.parentElement/)
})

test('a tap outside closes on the scrim’s click, never on pointerdown (which let the tap fall through)', () => {
  assert.match(menu, /data-menu-scrim=""[\s\S]{0,80}onClick=\{close\}/)
  assert.doesNotMatch(menu, /pointerdown/)
})

test('Escape closes and returns focus to the button; closing fades, and cannot leave a panel over the page', () => {
  assert.match(menu, /e\.key === 'Escape'[\s\S]{0,60}close\(\)[\s\S]{0,40}buttonRef\.current\?\.focus\(\)/)
  assert.match(menu, /'pointer-events-none animate-out fade-out fill-mode-forwards'/)
  assert.match(menu, /window\.setTimeout\(\(\) => setClosing\(false\), 400\)/)
})

test('each page once on the phone: Documentation under Products, Contact only as the button', () => {
  assert.match(src, /\['Company', COMPANY\.filter\(\(it\) => it\.href !== '\/contact'\)\]/)
  assert.match(src, /\['Resources', RESOURCES\.filter\(\(it\) => it\.href !== 'https:\/\/docs\.ciphera\.net'\)\]/)
  assert.match(menu, /PHONE_GROUPS\.map/)
})
