import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Dropdown } from '@/components/ui/Dropdown'
import { Modal } from '@/components/ui/Modal'
import { PlusIcon, TrashIcon } from '@/components/account/icons'

// Figma "popup · Change items": ask the account manager for a new version with different quantities / items.
export default function ChangeItemsModal({ open, quote, onSend, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title={`Request changes to version ${quote?.version ?? 1}`} className="modal-sm">
      {quote && <ChangeItemsForm quote={quote} onSend={onSend} onClose={onClose} />}
    </Modal>
  )
}

function ChangeItemsForm({ quote, onSend, onClose }) {
  const options = (quote.lines ?? []).map((l) => ({ value: l.id, label: l.name }))
  const [rows, setRows] = useState(() => (quote.lines ?? []).slice(0, 1).map((l) => ({ item: l.id, qty: String(l.qty + 5) })))
  const [note, setNote] = useState('')
  const update = (i, patch) => setRows((r) => r.map((row, j) => (j === i ? { ...row, ...patch } : row)))
  const valid = rows.length > 0 && rows.every((r) => r.item && Number(r.qty) > 0)

  return (
    <form className="bz-change" onSubmit={(e) => { e.preventDefault(); if (valid) { onSend({ rows, note }); onClose() } }}>
      {rows.map((row, i) => (
        <div key={i} className="bz-change-row">
          <label className="field">
            <span className="field-label">Item</span>
            <Dropdown value={row.item} options={options} placeholder="Choose an item" onChange={(e) => update(i, { item: e.target.value })} aria-label="Item" />
          </label>
          <label className="field">
            <span className="field-label">New quantity</span>
            <input className="field-input" inputMode="numeric" value={row.qty} onChange={(e) => update(i, { qty: e.target.value.replace(/\D/g, '') })} />
          </label>
          {rows.length > 1 && (
            <button type="button" className="bz-icon-btn" aria-label="Remove this line" onClick={() => setRows((r) => r.filter((_, j) => j !== i))}><TrashIcon size={18} /></button>
          )}
        </div>
      ))}
      {rows.length < options.length && (
        <button type="button" className="bz-add-line" onClick={() => setRows((r) => [...r, { item: '', qty: '' }])}><PlusIcon size={14} /> Add item</button>
      )}
      <label className="field">
        <span className="field-label">Note for your account manager (optional)</span>
        <textarea className="field-input bz-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Can Maadi be delivered first?" />
      </label>
      <div className="modal-actions">
        <Button variant="text" size="md" onClick={onClose}>Cancel</Button>
        <Button type="submit" size="md" disabled={!valid}>Send request</Button>
      </div>
    </form>
  )
}
