import {
  useEffect,
  useRef,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import './modal.scss'

export type ModalProps = {
  open: boolean
  onClose: () => void
  title?: ReactNode
  description?: ReactNode
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'full-mobile'
  hideCloseButton?: boolean
  className?: string
  panelClassName?: string
}

/**
 * Generic, accessible, and responsive Modal dialog for FaithLink.
 * Uses native <dialog> with focus trap, backdrop dismissal, Escape key, and smooth entrance.
 * Mobile-first: gracefully fills mobile screens while staying elegantly centered on desktop.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  hideCloseButton = false,
  className,
  panelClassName,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const pressedBackdropRef = useRef(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      if (!dialog.open) {
        dialog.showModal()
      }
    } else {
      if (dialog.open) {
        dialog.close()
      }
    }
  }, [open])

  function handleBackdropPress(event: PointerEvent<HTMLDialogElement>) {
    pressedBackdropRef.current = event.target === event.currentTarget
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (pressedBackdropRef.current && event.target === event.currentTarget) {
      onClose()
    }
  }

  function handleCancel(event: React.SyntheticEvent<HTMLDialogElement, Event>) {
    event.preventDefault()
    onClose()
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      className={cn('faithlink-modal', `modal-${size}`, className)}
      onPointerDown={handleBackdropPress}
      onClick={handleBackdropClick}
      onCancel={handleCancel}
      onClose={onClose}
      aria-labelledby={title ? 'modal-dialog-title' : undefined}
      aria-describedby={description ? 'modal-dialog-description' : undefined}
    >
      <div className={cn('modal-panel', panelClassName)}>
        {!hideCloseButton && (
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X aria-hidden className="modal-close-icon" />
          </button>
        )}

        {(title || description) && (
          <div className="modal-header">
            {title && (
              <h2 id="modal-dialog-title" className="modal-title">
                {title}
              </h2>
            )}
            {description && (
              <p id="modal-dialog-description" className="modal-description">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="modal-body">{children}</div>
      </div>
    </dialog>
  )
}
