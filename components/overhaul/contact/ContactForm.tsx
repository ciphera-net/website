'use client'

/**
 * Round 6 (mock, 17-10-2026): three options for the Contact page's form block (Section id `form`), over the one FORM copy
 * of content.ts. Every visible string is read from it by reference; this file types no prose. The fields, the labels, the
 * validation, the preview line and Facet's Input, Textarea, Button and Captcha are shared, so the three differ in layout
 * and nothing else. Type is Geist sans throughout (nothing here is code). The one digit that shows, in the lead, is set
 * tabular-nums. Square corners, flat, hairlines only; no panel is tinted and no state is a colour.
 *
 * THE FORM SENDS (the overhaul, 18-10-2026). It keeps what today's page had: Facet's Captcha against the real service
 * (env.NEXT_PUBLIC_CAPTCHA_API_URL), whose id, solution and token go with the message and without which nothing is sent;
 * the honeypot field (`website`, off-screen, the backend rejects any value); the page-load stamp the backend checks
 * against implausibly fast submissions; the same rules as before (a name of 2 characters or more, an address that looks
 * like one, a message of 10 to 1000 characters, with a counter); and the POST to website-backend `/api/v1/contact`, with
 * the same analytics events. The result is a line in the live region under the button: FORM.sent or FORM.failed.
 *
 * An error is a line of muted text with a small icon under its field. The field carries aria-invalid and points at the
 * line with aria-describedby, its border goes a step lighter, and focus moves to the first invalid field once the error
 * has rendered. No red, no tint, no panel (FORM.failed and FORM.sent are the build's words and are not drawn in the mock).
 * The submit button is Disclosure's MailButton recipe (h-12, px-6, icon and label) on Facet's Button, in every option.
 *
 * A = the notes beside the form. Two columns from lg: the privacy line and the security note as two short muted
 *     paragraphs on the left, the form on the right in a hairline card (border border-border bg-card, the recipe of the
 *     Trust page's drafted-email card). Both notes come before the form in the reading order, so the security redirect is
 *     read before anyone types. Name and email sit side by side from sm; the subject, the message, the Captcha and the
 *     button are full width. Colour: the one primary button, and links and the focus ring in the same orange.
 *     Reuses Section, Reveal and Disclosure's inline text link.
 * B = the wide card. The form full width in one hairline card, its fields in a grid, the Captcha under them, then ONE row
 *     under that: the button and beside it the two notes as small muted lines (under it on a phone), so the notes are
 *     the card's footer and not a column. The grid is two columns on md, as briefed, and three from lg: name, email and
 *     subject share one row and the message spans it, because three single fields in two columns leave an empty cell
 *     beside the subject. Colour: the one primary button and nothing else; the notes are muted grey. Reuses the same
 *     card, Section, Reveal and text link as A.
 * C = the quietest. No card, no side column: name and email side by side, a tall message box, no subject field, then the
 *     button and the two notes stacked below it, all in a column no wider than the title. The same fields on the bare
 *     page, so nothing frames the form but the hairlines of the fields themselves. Colour: the one primary button and
 *     nothing else. Reuses Section, Reveal and the text link; it is the only option with no card.
 *
 * The Captcha keeps Facet's own colours in all three. Client component: the form has state. Reveal is the homepage's
 * own wrapper (it dims, never hides).
 */
import * as React from 'react'
import { ArrowRight, CaretDown, Info, PaperPlaneTilt, WarningCircle } from '@phosphor-icons/react/dist/ssr'
import { Button, Captcha, Input, Textarea } from '@ciphera-net/facet'
import { cn } from '@/lib/utils'
import { env } from '@/lib/env'
import { track } from '@/lib/pulse'
import { Reveal } from '../home/Reveal'
import { Section } from '../home/Section'
import { FORM } from './content'

type FieldKey = 'name' | 'email' | 'message'
type ValueKey = FieldKey | 'subject'
type Control = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

/** The fields that can be wrong, in the order focus visits them. The subject is a list with a first option, so it cannot be. */
const FIELDS: readonly FieldKey[] = ['name', 'email', 'message']

/** The words of a field error, one line per field (the email line covers an empty field and a malformed address). */
const ERROR_WORDS: Record<FieldKey, string> = FORM.errors

// website-backend's own pattern (internal/api/contact.go), so the form never accepts an address the backend then refuses
// with a line the visitor cannot act on. The mail server still has the last word.
const EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
/** website-backend refuses a name outside 2 to 100 characters. */
const NAME_MAX_LENGTH = 100

/** website-backend rejects a shorter name or message, so the form says so first (the rules today's page enforced). */
export const MESSAGE_MAX_LENGTH = 1000

/** website-backend refuses a page stamp older than 30 minutes; a page open longer is re-stamped when the visitor writes. */
const STAMP_MAX_AGE_MS = 20 * 60 * 1000

function isValid(field: FieldKey, value: string): boolean {
  const v = value.trim()
  if (field === 'email') return EMAIL.test(v)
  if (field === 'name') return v.length >= 2 && v.length <= NAME_MAX_LENGTH
  return v.length >= 10 && value.length <= MESSAGE_MAX_LENGTH
}

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
const LABEL = 'mb-2 block text-sm font-medium text-foreground'
// Facet's Input and Textarea bring ring-1 and their own padding; className wins through tailwind-merge, so the ring is the
// house ring-2. The lighter border on aria-invalid is the field's half of an error (the line under it is the other half).
const CONTROL = `${FOCUS} aria-[invalid=true]:border-muted-foreground`
// The native select, dressed as Facet's Input: same height, border, transparent fill, 16 px on a phone and 14 px from md.
// [border-radius:0] because iOS Safari rounds a bare select; [color-scheme:dark] so the open list is dark with the page
// and not a white sheet under light text.
const SELECT = `block h-11 w-full appearance-none border border-input bg-transparent py-1 pl-3.5 pr-10 text-base text-foreground transition-colors duration-150 [border-radius:0] [color-scheme:dark] md:text-sm ${FOCUS}`
// An inline text link: underlined in a quiet grey, orange on hover. Disclosure's recipe (DisclosureMore.tsx TEXT_LINK).
const TEXT_LINK = `font-medium text-foreground underline decoration-muted-foreground/60 underline-offset-4 transition-colors duration-150 hover:text-primary hover:decoration-primary ${FOCUS}`
// The same link for a whole sentence, so it stays muted and does not read as a bold line.
const SENTENCE_LINK = `text-muted-foreground underline decoration-muted-foreground/60 underline-offset-4 transition-colors duration-150 hover:text-primary hover:decoration-primary [overflow-wrap:anywhere] ${FOCUS}`

const LEAD = <span className="tabular-nums">{FORM.lead}</span>

/* ---------------------------------------------------------------------------------------------------------------- */
/* Shared: state, fields, notes                                                                                       */
/* ---------------------------------------------------------------------------------------------------------------- */

function useContactForm() {
  const uid = React.useId()
  const [values, setValues] = React.useState<Record<ValueKey, string>>({
    name: '',
    email: '',
    subject: FORM.subjects[0].value,
    message: '',
  })
  const [invalid, setInvalid] = React.useState<Record<FieldKey, boolean>>({ name: false, email: false, message: false })
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'sent' | 'failed' | 'captcha'>('idle')
  const [focusRequest, setFocusRequest] = React.useState<{ field: FieldKey; n: number } | null>(null)
  // The captcha's answer, as the auth pages keep it: an id and a solution, or a token.
  const [captcha, setCaptcha] = React.useState({ id: '', solution: '', token: '' })
  // Real people never touch the honeypot; automation that fills every input does. A ref, so automation that sets
  // input.value directly (and never fires React's onChange) is caught too.
  const honeypotRef = React.useRef<HTMLInputElement>(null)
  // Taken on mount and sent with the message: the backend rejects a submission faster than 2 seconds, and a stamp older
  // than 30 minutes. A ref, because a page left open that long is re-stamped when the visitor starts writing, and again
  // after a refusal (the next attempt needs a new security check, which takes longer than the 2 seconds).
  const pageLoadedAt = React.useRef<number>(0)
  React.useEffect(() => {
    pageLoadedAt.current = Date.now()
  }, [])
  // The captcha widget keeps its "verified" state after a send, but its answer is single-use: a new key remounts it, so a
  // second message, or a retry after a refusal, starts a fresh check.
  const [captchaKey, setCaptchaKey] = React.useState(0)

  // Focus goes to the first invalid field AFTER the error state has rendered, so a screen reader reads the field with its
  // aria-invalid and its error line already attached. `n` makes a second press on the same field ask again.
  React.useEffect(() => {
    if (focusRequest) document.getElementById(`${uid}-${focusRequest.field}`)?.focus()
  }, [focusRequest, uid])

  function change(field: ValueKey) {
    return (e: React.ChangeEvent<Control>) => {
      const value = e.target.value
      if (Date.now() - pageLoadedAt.current > STAMP_MAX_AGE_MS) pageLoadedAt.current = Date.now()
      setValues((v) => ({ ...v, [field]: value }))
      // A field that has been flagged re-checks as you type, so its line goes the moment the problem is fixed.
      if (field !== 'subject' && invalid[field]) setInvalid((s) => ({ ...s, [field]: !isValid(field, value) }))
    }
  }

  function verify(id: string, solution: string, token?: string) {
    setCaptcha({ id, solution, token: token || '' })
    // The widget calls this from an earlier render, so the status is read at update time, not from the closure.
    setStatus((s) => (s === 'captcha' ? 'idle' : s))
    track('contact_captcha_verified')
  }

  /** The answer was spent on a request: clear it and remount the widget for the next one. */
  function freshCaptcha() {
    setCaptcha({ id: '', solution: '', token: '' })
    setCaptchaKey((k) => k + 1)
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'sending') return
    const next: Record<FieldKey, boolean> = {
      name: !isValid('name', values.name),
      email: !isValid('email', values.email),
      message: !isValid('message', values.message),
    }
    setInvalid(next)
    const first = FIELDS.find((f) => next[f])
    if (first) {
      setStatus('idle')
      setFocusRequest((r) => ({ field: first, n: (r?.n ?? 0) + 1 }))
      return
    }
    if (!captcha.token && (!captcha.id || !captcha.solution)) {
      setStatus('captcha')
      return
    }
    setStatus('sending')
    try {
      const response = await fetch(`${env.NEXT_PUBLIC_WEBSITE_API_URL}/api/v1/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          subject: values.subject,
          message: values.message,
          captcha_id: captcha.id,
          captcha_solution: captcha.solution,
          captcha_token: captcha.token,
          website: honeypotRef.current?.value || '',
          page_loaded_at: pageLoadedAt.current,
        }),
      })
      freshCaptcha()
      if (!response.ok) {
        // 403: the security check failed or expired (website-backend contact.go), so the visitor redoes it. Anything else
        // keeps the general line, which names the email address as the way round. A 400 can be the page stamp: re-stamp.
        pageLoadedAt.current = Date.now()
        setStatus(response.status === 403 ? 'captcha' : 'failed')
        track('contact_form_submit_error')
        return
      }
      setStatus('sent')
      setValues({ name: '', email: '', subject: FORM.subjects[0].value, message: '' })
      track('contact_form_submit_success')
    } catch {
      setStatus('failed')
      track('contact_form_submit_error')
    }
  }

  return { uid, values, invalid, status, change, submit, verify, honeypotRef, captchaKey }
}

type MockForm = ReturnType<typeof useContactForm>

function FieldError({ id, text }: { id: string; text: string }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-pretty text-sm text-muted-foreground">
      <WarningCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      {text}
    </p>
  )
}

/** Name and email: a label tied to its Facet Input, and the error line the input points at while it is wrong. */
function TextField({
  form,
  field,
  type,
  autoComplete,
  className,
}: {
  form: MockForm
  field: 'name' | 'email'
  type: 'text' | 'email'
  autoComplete: string
  className?: string
}) {
  const id = `${form.uid}-${field}`
  const errorId = `${id}-error`
  const bad = form.invalid[field]
  return (
    <div className={cn('min-w-0', className)}>
      <label htmlFor={id} className={LABEL}>
        {FORM.fields[field]}
      </label>
      <Input
        id={id}
        name={field}
        type={type}
        autoComplete={autoComplete}
        required
        value={form.values[field]}
        onChange={form.change(field)}
        placeholder={FORM.placeholders[field]}
        aria-invalid={bad || undefined}
        aria-describedby={bad ? errorId : undefined}
        className={CONTROL}
      />
      {bad && <FieldError id={errorId} text={ERROR_WORDS[field]} />}
    </div>
  )
}

/** The subject: a native select (so a phone shows its own picker) drawn like the Input, with a caret that is only a picture. */
function SubjectField({ form, className }: { form: MockForm; className?: string }) {
  const id = `${form.uid}-subject`
  return (
    <div className={cn('min-w-0', className)}>
      <label htmlFor={id} className={LABEL}>
        {FORM.fields.subject}
      </label>
      <div className="relative">
        <select id={id} name="subject" value={form.values.subject} onChange={form.change('subject')} className={SELECT}>
          {FORM.subjects.map((s) => (
            <option key={s.value} value={s.value} className="bg-card text-foreground">
              {s.label}
            </option>
          ))}
        </select>
        <CaretDown
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

function MessageField({ form, rows, className }: { form: MockForm; rows: number; className?: string }) {
  const id = `${form.uid}-message`
  const errorId = `${id}-error`
  const countId = `${id}-count`
  const bad = form.invalid.message
  return (
    <div className={cn('min-w-0', className)}>
      <label htmlFor={id} className={LABEL}>
        {FORM.fields.message}
      </label>
      <Textarea
        id={id}
        name="message"
        rows={rows}
        required
        value={form.values.message}
        onChange={form.change('message')}
        placeholder={FORM.placeholders.message}
        aria-invalid={bad || undefined}
        aria-describedby={bad ? `${countId} ${errorId}` : countId}
        maxLength={MESSAGE_MAX_LENGTH}
        className={cn('resize-none px-3.5 py-2.5', CONTROL)}
      />
      {/* Not a live region: announced with the field, not after every keystroke. */}
      <p id={countId} className="mt-2 text-right text-xs tabular-nums text-muted-foreground">
        {form.values.message.length} / {MESSAGE_MAX_LENGTH}
      </p>
      {bad && <FieldError id={errorId} text={ERROR_WORDS.message} />}
    </div>
  )
}

/** Facet's Captcha against the real service, props as today's page passed them. */
function CaptchaBox({ form, className }: { form: MockForm; className?: string }) {
  return <Captcha key={form.captchaKey} onVerify={form.verify} apiUrl={env.NEXT_PUBLIC_CAPTCHA_API_URL} action="contact" className={className} />
}

/** The honeypot: off-screen, out of the tab order, hidden from assistive technology. */
function Honeypot({ form }: { form: MockForm }) {
  return (
    <input
      ref={form.honeypotRef}
      type="text"
      name="website"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      defaultValue=""
      style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }}
    />
  )
}

/** The one filled action. Disclosure's MailButton recipe (h-12, px-6, icon and label) on Facet's Button. */
function SubmitButton({ form }: { form: MockForm }) {
  return (
    <Button type="submit" disabled={form.status === 'sending'} aria-busy={form.status === 'sending' || undefined} className={`h-12 w-full gap-2.5 px-6 hover:bg-[#E54E00] sm:w-auto ${FOCUS}`}>
      <PaperPlaneTilt className="h-4 w-4" aria-hidden="true" />
      {FORM.submit}
    </Button>
  )
}

/**
 * The result line. The live region is always in the page and only its content comes and goes, because a region that
 * appears already full is not announced. Muted text with a small icon, like an error: not a success panel (no state is
 * a colour on this page).
 */
function Status({ form }: { form: MockForm }) {
  const words =
    form.status === 'sent' ? `${FORM.sent.title} ${FORM.sent.line}` :
    form.status === 'failed' ? `${FORM.failed.title} ${FORM.failed.line}` :
    form.status === 'captcha' ? FORM.captchaFirst :
    form.status === 'sending' ? FORM.sending :
    null
  return (
    <div role="status">
      {words && (
        <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {words}
        </p>
      )}
    </div>
  )
}

/** FORM.privacy: the sentence, then its link. The size and colour come from the container. */
function PrivacyNote() {
  const { text, linkLabel, href } = FORM.privacy
  return (
    <p>
      {text}{' '}
      <a href={href} className={`whitespace-nowrap ${TEXT_LINK}`}>
        {linkLabel}
      </a>
    </p>
  )
}

/** FORM.securityNote: the whole sentence is the link (to the disclosure policy), with the quiet arrow of Disclosure's record line. */
function SecurityNote() {
  const { text, href } = FORM.securityNote
  return (
    <p>
      <a href={href} className={SENTENCE_LINK}>
        {text}
        <ArrowRight className="ml-1 inline h-3.5 w-3.5 align-[-2px]" aria-hidden="true" />
      </a>
    </p>
  )
}

/* ---------------------------------------------------------------------------------------------------------------- */
/* A: the notes beside the form                                                                                       */
/* ---------------------------------------------------------------------------------------------------------------- */

export function FormA() {
  const form = useContactForm()
  return (
    <Section id={FORM.id} eyebrow={FORM.eyebrow} title={FORM.title} lead={LEAD}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <Reveal className="min-w-0">
          {/* lg:pt-7: the first line shares a baseline with the first row of labels inside the card (its p-8, less the label's leading). */}
          <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground lg:pt-7">
            <PrivacyNote />
            <SecurityNote />
          </div>
        </Reveal>
        <Reveal delay={90} className="min-w-0">
          <form noValidate onSubmit={form.submit} className="relative border border-border bg-card p-6 sm:p-8">
            <Honeypot form={form} />
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField form={form} field="name" type="text" autoComplete="name" />
                <TextField form={form} field="email" type="email" autoComplete="email" />
              </div>
              <SubjectField form={form} />
              <MessageField form={form} rows={6} />
              <CaptchaBox form={form} />
            </div>
            <div className="mt-8">
              <SubmitButton form={form} />
              <Status form={form} />
            </div>
          </form>
        </Reveal>
      </div>
    </Section>
  )
}

/* ---------------------------------------------------------------------------------------------------------------- */
/* B: the wide card                                                                                                   */
/* ---------------------------------------------------------------------------------------------------------------- */

export function FormB() {
  const form = useContactForm()
  return (
    <Section id={FORM.id} eyebrow={FORM.eyebrow} title={FORM.title} lead={LEAD}>
      <Reveal>
        <form noValidate onSubmit={form.submit} className="relative border border-border bg-card p-6 sm:p-8">
            <Honeypot form={form} />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <TextField form={form} field="name" type="text" autoComplete="name" />
            <TextField form={form} field="email" type="email" autoComplete="email" />
            <SubjectField form={form} className="md:col-span-2 lg:col-span-1" />
            <MessageField form={form} rows={6} className="md:col-span-2 lg:col-span-3" />
          </div>
          <CaptchaBox form={form} className="mt-5 max-w-md" />
          {/* items-start: in a column the button keeps its own width from sm (w-full still fills a phone); from lg the row centres. */}
          <div className="mt-8 flex flex-col items-start gap-5 lg:flex-row lg:items-center lg:gap-8">
            <SubmitButton form={form} />
            <div className="space-y-1 text-sm text-muted-foreground">
              <PrivacyNote />
              <SecurityNote />
            </div>
          </div>
          <Status form={form} />
        </form>
      </Reveal>
    </Section>
  )
}

/* ---------------------------------------------------------------------------------------------------------------- */
/* C: the quietest                                                                                                    */
/* ---------------------------------------------------------------------------------------------------------------- */

export function FormC() {
  const form = useContactForm()
  // No subject field in this option. The mock sends nothing; the BUILD sends subject "General Inquiry" (FORM.subjects[0].value,
  // which website-backend's allowedSubjects accepts) with every message from this form.
  return (
    <Section id={FORM.id} eyebrow={FORM.eyebrow} title={FORM.title} lead={LEAD}>
      <Reveal>
        <form noValidate onSubmit={form.submit} className="relative max-w-3xl">
          <Honeypot form={form} />
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField form={form} field="name" type="text" autoComplete="name" />
              <TextField form={form} field="email" type="email" autoComplete="email" />
            </div>
            <MessageField form={form} rows={10} />
            <CaptchaBox form={form} />
          </div>
          <div className="mt-8">
            <SubmitButton form={form} />
            <Status form={form} />
          </div>
          <div className="mt-8 space-y-1.5 text-sm text-muted-foreground">
            <PrivacyNote />
            <SecurityNote />
          </div>
        </form>
      </Reveal>
    </Section>
  )
}
