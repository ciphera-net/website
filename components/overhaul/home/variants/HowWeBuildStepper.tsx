/**
 * Round 2d (mock, 16-10): How we build as F's layout, stepped and snapped (see RuleStepper).
 * G = icon tiles · H = plus one proof per rule · I = proof with the providers' brand colours (Round 2d).
 * J = evidence in labelled cards · K = evidence as one ruled band · L = one evidence spotlight (Round 2e, on H).
 * M = one quiet line per rule (Round 2f; ruled D16).
 * No footprint receipt: the owner removed it from this block on 16-10 (D13 reversed); the figure lives on
 * /sustainability.
 */
import { RuleStepper } from './RuleStepper'

function StepperSection({ fill, evidence = 'inline' }: { fill: 'icons' | 'proof' | 'colour'; evidence?: 'inline' | 'cards' | 'band' | 'spotlight' | 'line' }) {
  return (
    <section id="how" data-mock-section="how" className="scroll-mt-24 border-t border-border">
      <RuleStepper fill={fill} evidence={evidence} />
    </section>
  )
}

export const HowWeBuildG = () => <StepperSection fill="icons" />
export const HowWeBuildH = () => <StepperSection fill="proof" />
export const HowWeBuildI = () => <StepperSection fill="colour" />
export const HowWeBuildJ = () => <StepperSection fill="proof" evidence="cards" />
export const HowWeBuildK = () => <StepperSection fill="proof" evidence="band" />
export const HowWeBuildL = () => <StepperSection fill="proof" evidence="spotlight" />
export const HowWeBuildM = () => <StepperSection fill="proof" evidence="line" />
