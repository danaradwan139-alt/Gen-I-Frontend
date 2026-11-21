import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

export default function DevicesModal({ open, devices, onRevoke, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Signed-in devices" className="modal-sm">
      <ul className="dev-list">
        {devices.map((device) => (
          <li key={device.id} className="dev">
            <div>
              <p className="pf-row-title">{device.name}</p>
              <p className="pf-row-sub">{device.detail}</p>
            </div>
            {!device.current && <Button variant="outline-teal" size="xs" onClick={() => onRevoke(device.id)}>Sign out</Button>}
          </li>
        ))}
      </ul>
      <div className="modal-actions">
        <Button size="md" onClick={onClose}>Done</Button>
      </div>
    </Modal>
  )
}
