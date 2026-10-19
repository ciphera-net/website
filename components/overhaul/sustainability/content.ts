/**
 * The words of /sustainability (the overhaul, R12; plan §5n): the honest page (D58), its receipt printer (D60) with
 * notes in the margin (D61), the wording round's picks (D63) and a barcode that encodes its text (D64). Every string
 * passed the humanizer. No number is typed here: every figure comes from website-backend's report, formatted by
 * receipt.ts.
 */

export const OPENING = {
  title: 'Receipts, not promises.',
  lead: 'Our estimate of the carbon footprint of the servers we run, with the working shown.',
}

/** The section that holds the printer. */
export const CORE = {
  id: 'estimate',
  eyebrow: 'Our footprint',
  title: 'The estimate and its working.',
  /** D63, W12-4: our own estimate. */
  lead: "We calculate it from the servers we run, a published grid figure and four assumptions of our own. We don't meter any of it.",
  /** When the figures are our host's (its life-cycle report returned a month). */
  hostLead: "These figures come from our host's life-cycle report for the servers we run.",
}

export const PRINTER = {
  place: 'Zurich · CH-DK-2',
  panel: { title: 'Our footprint', estimated: 'Estimated', host: "From our host's report" },
  status: { processing: 'Calculating the estimate', printing: 'Printing the receipt', complete: 'Receipt printed' },
  unavailable: 'The estimate is unavailable right now',
  again: 'Print again',
  receipt: {
    title: 'Footprint receipt',
    groups: { electricity: 'Electricity', embodied: 'Making, shipping and disposing' },
    rows: {
      servers: { label: 'Servers in Zurich', source: 'Our server list' },
      vcpu: { label: 'vCPU', source: 'Our server list' },
      hours: { label: 'Hours', source: (days: number, month: string) => `${days} days in ${month}` },
      watts: { label: 'Power per vCPU', source: 'Our assumption' },
      pue: { label: 'Overhead (PUE)', source: 'Our assumption' },
      energy: { label: 'Energy', source: 'Calculated' },
      /** D63, W12-3: the figure's source, with the year the API says it describes. */
      grid: { label: 'Swiss grid', source: (year: number) => `Power used in Switzerland, ${year} (VSE)` },
      embodiedPerVcpu: { label: 'Per vCPU, over its life', source: 'Our assumption' },
      lifetime: { label: 'Server life', source: 'Our assumption' },
      share: { label: "This month's share", source: 'Calculated' },
      /** The host's report: its phases, each from the report. */
      hostUse: { label: 'Running the servers', source: "Our host's report" },
      hostManufacturing: { label: 'Manufacturing', source: "Our host's report" },
      hostTransport: { label: 'Transport', source: "Our host's report" },
      hostEndOfLife: { label: 'End of life', source: "Our host's report" },
    },
    subtotal: 'Subtotal',
    total: 'Total, estimated',
    hostTotal: 'Total, from our host',
    meta: { period: 'Period', method: 'Method', methodValue: 'Our estimate', hostMethodValue: "Our host's report", updated: 'Updated' },
  },
} as const

/**
 * The notes in the margin (D61), each beside the receipt line it explains; a phone lists them after the printer. Each is
 * true today: the servers line counts only the Exoscale servers (D59); the W and PUE constants are hand-set, and Exoscale
 * publishes no PUE; the grid note is VSE's account of its own 2025 figure, so it prints only while the figure is the 2025
 * one (D63, W12-1); and the embodied note's comparison prints only while it holds (D63, W12-2).
 */
export const NOTES = {
  phoneTitle: 'Notes on the receipt',
  servers: 'Only our servers at Exoscale. The receipt leaves out the Bunny containers that serve this website.',
  watts: 'We picked this number and the overhead under it rather than measuring them.',
  /** The year the grid note was written for; any other year's figure prints without it. */
  gridYear: 2025,
  grid: 'This figure comes largely from imported power. In 2025, low reservoirs and a nuclear plant outage meant more imports, mostly from gas plants.',
  embodiedShare: (percent: number) => `${percent}% of the total.`,
  embodiedOutweighs: 'Making, shipping and disposing of the servers emits more carbon than running them.',
} as const

/** What the estimate counts and what it leaves out (D59's ruled lines, the parentheticals dropped). */
export const COUNTS = {
  id: 'counted',
  eyebrow: 'What it counts',
  title: 'What the estimate covers.',
  countedLabel: 'Counted',
  notCountedLabel: 'Not counted',
  counted: [
    { icon: 'HardDrives', text: 'Compute: our Exoscale servers in Zurich' },
    { icon: 'ArrowsClockwise', text: 'All four lifecycle phases of our servers (modelled, not metered)' },
  ],
  notCounted: [
    { icon: 'GlobeHemisphereWest', text: 'Bunny: the CDN, and the containers that serve this website, docs, help and status' },
    { icon: 'Database', text: 'Object storage and backups (Exoscale, Infomaniak)' },
    { icon: 'Lightning', text: 'Office electricity' },
    { icon: 'AirplaneTilt', text: 'Employee travel' },
  ],
} as const

/** Where it runs (D59's ruled hosting line, verbatim). */
export const WHERE = {
  id: 'where',
  eyebrow: 'Where it runs',
  title: 'Where our servers are.',
  rows: [
    { mark: 'exoscale', name: 'Exoscale', text: 'Our servers run on Exoscale in Zurich (CH-DK-2).', place: 'Zurich, Switzerland', flag: 'ch' },
    { mark: 'bunnydotnet', name: 'bunny.net', text: 'This website is served by bunny.net from servers worldwide.', place: 'Worldwide', flag: null },
  ],
} as const

/** What we don't do (today's commitments, shortened). */
export const COMMITMENTS = {
  id: 'commitments',
  eyebrow: 'Commitments',
  title: "What we don't do.",
  items: [
    { icon: 'Certificate', text: 'We buy no carbon offsets.' },
    { icon: 'Tree', text: 'We plant no trees for publicity.' },
    { icon: 'Leaf', text: 'We make no claim to be carbon neutral.' },
  ],
} as const

/** The closing: words and buttons, no arc and no photo (D23: an arc never sits at both ends of a page). */
export const CLOSING = {
  title: 'Questions about this estimate?',
  primary: { label: 'See how we build', href: '/trust' },
  secondary: { label: 'Contact', href: '/contact' },
} as const
