import { type FormEvent, useId, useState } from 'react'
import { ArrowRight, KeyRound } from 'lucide-react'
import { useComingSoon } from '@/components/coming-soon/coming-soon-context'
import './passcode-card.scss'

/** Stitch "Join via church passcode". Codes aren't in the backend yet, so joining opens the coming-soon popup. */
export function PasscodeCard() {
  const showComingSoon = useComingSoon()
  const inputId = useId()
  const [code, setCode] = useState('')
  const canPaste = typeof navigator !== 'undefined' && Boolean(navigator.clipboard?.readText)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    showComingSoon('Joining with a code')
  }

  async function paste() {
    try {
      setCode((await navigator.clipboard.readText()).trim().slice(0, 8).toUpperCase())
    } catch {
      // Clipboard permission refused: the person can still type the code.
    }
  }

  return (
    <section aria-labelledby="passcode-heading" className="passcode-card">
      <div className="passcode-head">
        <span aria-hidden className="passcode-icon">
          <KeyRound />
        </span>
        <div>
          <h2 id="passcode-heading" className="passcode-title">
            Join with a church code
          </h2>
          <p className="passcode-subtitle">Instant access from your church leader</p>
        </div>
      </div>
      <p className="passcode-text">
        Have an invitation code from your home cell, campus group or pastor? Enter the 6-character code below:
      </p>
      <form className="passcode-form" onSubmit={handleSubmit}>
        <label htmlFor={inputId} className="passcode-label">
          Invitation code
        </label>
        <div className="passcode-field">
          <input
            id={inputId}
            className="passcode-input"
            placeholder="e.g. FL-8820"
            autoComplete="off"
            maxLength={8}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
          {canPaste && (
            <button type="button" className="passcode-paste" onClick={paste}>
              Paste
            </button>
          )}
        </div>
        <button type="submit" className="passcode-submit">
          Join church
          <ArrowRight aria-hidden className="passcode-submit-icon" />
        </button>
      </form>
    </section>
  )
}
