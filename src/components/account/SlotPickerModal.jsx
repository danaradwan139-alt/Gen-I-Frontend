import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { Modal } from '@/components/ui/Modal'

const dayLabel = (offset) => {
  if (offset === 1) return 'Tomorrow'
  const d = new Date(Date.now() + offset * 86400000)
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

// Pick a day + time window (delivery slot, trade-in inspection, …). Calls onSave("Tomorrow, 10 AM – 2 PM").
export default function SlotPickerModal({ open, title, times, onSave, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title={title} className="modal-sm">
      <SlotPicker times={times} onSave={onSave} onClose={onClose} />
    </Modal>
  )
}

function SlotPicker({ times, onSave, onClose }) {
  const days = [1, 2, 3, 4].map(dayLabel)
  const [day, setDay] = useState(days[0])
  const [time, setTime] = useState(times[0])
  return (
    <>
      <div className="slot-group">
        <p className="slot-label">Day</p>
        <div className="slot-chips">{days.map((d) => <Chip key={d} active={d === day} onClick={() => setDay(d)}>{d}</Chip>)}</div>
      </div>
      <div className="slot-group">
        <p className="slot-label">Time</p>
        <div className="slot-chips">{times.map((t) => <Chip key={t} active={t === time} onClick={() => setTime(t)}>{t}</Chip>)}</div>
      </div>
      <div className="modal-actions">
        <Button variant="outline-teal" size="md" onClick={onClose}>Cancel</Button>
        <Button size="md" onClick={() => { onSave(`${day}, ${time}`); onClose() }}>Save</Button>
      </div>
    </>
  )
}
