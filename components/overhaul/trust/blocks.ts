/**
 * Round 5 (mock, 17-10-2026): the Trust page's blocks in outline A's order (D27) and their options. Each block's options
 * live in one file (`<Block>.tsx`, exports `<Block>A|B|C`); this map is the only place that knows them all. The
 * opening is not here: it is the decided sunrise (D23), rendered by TrustPage.
 */
import type { ComponentType } from 'react'
import { DataA, DataB, DataC } from './Data'
import { DataD, DataE, DataF, DataG } from './DataMore'
import { ProvidersA, ProvidersB, ProvidersC } from './Providers'
import { SignInA, SignInB, SignInC } from './SignIn'
import { SignInD, SignInE, SignInF, SignInG } from './SignInMore'
import { OpenSourceA, OpenSourceB, OpenSourceC, OpenSourceD } from './OpenSource'
import { DisclosureA, DisclosureB, DisclosureC } from './Disclosure'
import { DisclosureD, DisclosureE, DisclosureF, DisclosureG } from './DisclosureMore'
import { TrustClosingA, TrustClosingB, TrustClosingC } from './TrustClosing'
import { TrustClosingD, TrustClosingE, TrustClosingF, TrustClosingG } from './TrustClosingMore'

// Keys double as the route segment (/mock-trust/<key>/<v>) and match the page's anchors where a block has one.
export const ORDER = ['data', 'providers', 'sign-in', 'open-source', 'disclosure', 'closing'] as const
export type BlockKey = (typeof ORDER)[number]
export type Variant = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g'
export const VARIANTS = ['a', 'b', 'c', 'd', 'e', 'f', 'g'] as const

// Round 5b (owner 17-10: "more options for What we keep block.. more colorfull"): What we keep also has D to G.
// Round 5c (owner 17-10: "provide me more options"): sign-in, disclosure and closing also have D to G.
export const BLOCKS: Record<BlockKey, Record<'a' | 'b' | 'c', ComponentType> & Partial<Record<'d' | 'e' | 'f' | 'g', ComponentType>>> = {
  data: { a: DataA, b: DataB, c: DataC, d: DataD, e: DataE, f: DataF, g: DataG },
  providers: { a: ProvidersA, b: ProvidersB, c: ProvidersC },
  'sign-in': { a: SignInA, b: SignInB, c: SignInC, d: SignInD, e: SignInE, f: SignInF, g: SignInG },
  // Owner 17-10: open source = A's ledger with B's check and no "not public" list, composed as d.
  'open-source': { a: OpenSourceA, b: OpenSourceB, c: OpenSourceC, d: OpenSourceD },
  disclosure: { a: DisclosureA, b: DisclosureB, c: DisclosureC, d: DisclosureD, e: DisclosureE, f: DisclosureF, g: DisclosureG },
  closing: { a: TrustClosingA, b: TrustClosingB, c: TrustClosingC, d: TrustClosingD, e: TrustClosingE, f: TrustClosingF, g: TrustClosingG },
}
