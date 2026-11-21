import { Modal } from './Modal'
import { Button } from './Button'

export function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title={title} className="modal-sm">
      <p className="modal-text">{message}</p>
      <div className="modal-actions">
        <Button variant="text" size="md" onClick={onClose}>Keep it</Button>
        <Button size="md" onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  )
}
