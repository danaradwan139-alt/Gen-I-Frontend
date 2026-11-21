import { useEffect, useId, useRef } from 'react'
import { CloseIcon } from '@/components/account/icons'
import './Modal.css'

// Accessible modal built on the native <dialog>: focus trap, Esc to close and an inert page behind it.
// Children are only mounted while open, so forms start fresh every time.
// `headless` drops the built-in title bar for dialogs that lay out their own heading (the title
// is still used as the accessible name).
export function Modal({ open, onClose, title, className = '', headless = false, children }) {
  const ref = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className={`modal ${className}`.trim()}
      aria-labelledby={headless ? undefined : titleId}
      aria-label={headless ? title : undefined}
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onMouseDown={(event) => { if (event.target === ref.current) onClose() }}
    >
      {open && (
        <div className="modal-body">
          <span className="modal-sheen" aria-hidden="true" />
          {headless ? (
            <button type="button" className="modal-close modal-close-float" onClick={onClose} aria-label="Close">
              <CloseIcon size={20} />
            </button>
          ) : (
            <header className="modal-head">
              <h2 id={titleId} className="modal-title">{title}</h2>
              <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
                <CloseIcon size={22} />
              </button>
            </header>
          )}
          {children}
        </div>
      )}
    </dialog>
  )
}
