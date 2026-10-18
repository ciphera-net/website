/**
 * Round 6 (mock, 17-10-2026): the Contact page's blocks in outline A's order (D34) and their options. Each block's
 * options live in one file (`Write.tsx`, `ContactForm.tsx`, `Office.tsx`); this map is the only place that knows them
 * all. The opening is not here: it is the decided sunrise (D23), rendered by ContactPage.
 */
import type { ComponentType } from 'react'
import { WriteA, WriteB, WriteC, WriteD } from './Write'
import { FormA, FormB, FormC } from './ContactForm'
import { OfficeA, OfficeB, OfficeC, OfficeD, OfficeE } from './Office'

// Keys double as the route segment (/mock-contact/<key>/<v>) and as the blocks' anchors.
export const ORDER = ['write', 'form', 'office'] as const
export type BlockKey = (typeof ORDER)[number]
export type Variant = 'a' | 'b' | 'c' | 'd' | 'e'
export const VARIANTS = ['a', 'b', 'c', 'd', 'e'] as const

// Owner 17-10 (D35): addresses A, form B, office "A/B but add the office image like before": office D (A with the
// photo) and E (B with the photo).
export const BLOCKS: Record<BlockKey, Record<'a' | 'b' | 'c', ComponentType> & Partial<Record<'d' | 'e', ComponentType>>> = {
  write: { a: WriteA, b: WriteB, c: WriteC, d: WriteD },
  form: { a: FormA, b: FormB, c: FormC },
  office: { a: OfficeA, b: OfficeB, c: OfficeC, d: OfficeD, e: OfficeE },
}
