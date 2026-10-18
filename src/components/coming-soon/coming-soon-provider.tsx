import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent, type ReactNode } from 'react'
import { Hourglass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ComingSoonContext } from './coming-soon-context'
import './coming-soon.scss'

/**
 * One shared popup for every feature that is on screen but not built yet.
 * Native <dialog>: focus trap, Escape to close and the backdrop come free,
 * with no extra library.
 */
export function ComingSoonProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  // Each request gets a new id, so asking for the same feature twice still reopens the popup.
  const [request, setRequest] = useState<{ id: number; name: string } | null>(null)
  const openerRef = useRef<Element | null>(null)

  const showComingSoon = useCallback((name: string) => {
    openerRef.current = document.activeElement
    setRequest((previous) => ({ id: (previous?.id ?? 0) + 1, name }))
  }, [])

  // Open after the title has rendered, so screen readers announce the right feature. Works for
  // clicks and for the catch-all route, which asks from an effect (flushSync can't run there).
  useEffect(() => {
    const dialog = dialogRef.current
    // showModal() throws if the popup is already open (e.g. two triggers in a row).
    if (request && dialog && !dialog.open) dialog.showModal()
  }, [request])

  // The control that opened the popup may be gone (the catch-all route swaps the page).
  // Then focus goes to the main content instead of dropping to the top of the document.
  function handleClose() {
    if (openerRef.current?.isConnected) return
    document.getElementById('main')?.focus()
  }

  // A click on the dialog element itself (not the panel) is a click on the backdrop.
  // Both press and release must land there, so a text selection dragged out of the panel doesn't close it.
  const pressedBackdropRef = useRef(false)

  function handleBackdropPress(event: PointerEvent<HTMLDialogElement>) {
    pressedBackdropRef.current = event.target === event.currentTarget
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (pressedBackdropRef.current && event.target === event.currentTarget) dialogRef.current?.close()
  }

  return (
    <ComingSoonContext value={showComingSoon}>
      {children}
      {/* Backdrop click is a mouse convenience; Escape and "Got it" close it from the keyboard. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <dialog
        ref={dialogRef}
        className="coming-soon"
        aria-labelledby="coming-soon-title"
        aria-describedby="coming-soon-text"
        onPointerDown={handleBackdropPress}
        onClick={handleBackdropClick}
        onClose={handleClose}
      >
        <div className="coming-soon-panel">
          <span aria-hidden className="coming-soon-icon">
            <Hourglass />
          </span>
          <h2 id="coming-soon-title" className="coming-soon-title">
            {request?.name} is coming soon
          </h2>
          <p id="coming-soon-text" className="coming-soon-text">
            We are still building this part of FaithLink. It will be ready in a future update.
          </p>
          <form method="dialog">
            <Button type="submit" className="coming-soon-button">
              Got it
            </Button>
          </form>
        </div>
      </dialog>
    </ComingSoonContext>
  )
}
