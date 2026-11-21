import { useEffect, useId, useRef } from 'react'
import { CloseIcon } from '@/components/account/icons'
import './Modal.css'

// Accessible modal built on the native <dialog>: focus trap, Esc to close and an inert page behind it.
// Children are only mounted while open, so forms start fresh every time.
export function Modal({ open, onClose, title, className = '', children }) {
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
      aria-labelledby={titleId}
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onMouseDown={(event) => { if (event.target === ref.current) onClose() }}
    >
      {open && (
        <div className="modal-body">
          <header className="modal-head">
            <h2 id={titleId} className="modal-title">{title}</h2>
            <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
              <CloseIcon size={24} />
            </button>
          </header>
          {children}
        </div>
      )}
    </dialog>
  )
}
