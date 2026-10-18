/**
 * Round 4 (mock, 17-10-2026): the About page's six blocks (D18, outline A) and their options. Each block's options live
 * in one file (`<Block>.tsx`, exports `<Block>A|B|C`, plus `<Block>D` from Round 4b except Questions); this map is the
 * only place that knows them all.
 */
import type { ComponentType } from 'react'
import { OpeningA, OpeningB, OpeningC, OpeningD, OpeningE } from './Opening'
import { StoryA, StoryB, StoryC, StoryD } from './Story'
import { FounderA, FounderB, FounderC, FounderD } from './Founder'
import { RecordA, RecordB, RecordC, RecordD } from './Record'
import { QuestionsA, QuestionsB, QuestionsC } from './Questions'
import { PressA, PressB, PressC, PressD } from './Press'

export const ORDER = ['opening', 'story', 'founder', 'record', 'questions', 'press'] as const
export type BlockKey = (typeof ORDER)[number]
export type Variant = 'a' | 'b' | 'c' | 'd' | 'e'

// Round 4b (17-10, owner: "missing colors", "not really cool like the landing page"): option D per block, drawn from
// the homepage's vocabulary. Questions has no D: it stays text.
export const BLOCKS: Record<BlockKey, Record<'a' | 'b' | 'c', ComponentType> & { d?: ComponentType; e?: ComponentType }> = {
  opening: { a: OpeningA, b: OpeningB, c: OpeningC, d: OpeningD, e: OpeningE },
  story: { a: StoryA, b: StoryB, c: StoryC, d: StoryD },
  founder: { a: FounderA, b: FounderB, c: FounderC, d: FounderD },
  record: { a: RecordA, b: RecordB, c: RecordC, d: RecordD },
  questions: { a: QuestionsA, b: QuestionsB, c: QuestionsC },
  press: { a: PressA, b: PressB, c: PressC, d: PressD },
}
