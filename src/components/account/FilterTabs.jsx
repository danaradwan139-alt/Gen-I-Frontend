import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import './records.css'

// Filter chips on the left and an optional primary link-button on the right.
// `label` names the chip group for screen readers; `action` is { label, to }.
export default function FilterTabs({ filters, value, onChange, label, action }) {
  return (
    <div className="acct-filter">
      <div className="acct-filter-chips" role="group" aria-label={label}>
        {filters.map(({ id, label: text }) => (
          <Chip key={id} active={value === id} onClick={() => onChange(id)}>{text}</Chip>
        ))}
      </div>
      {action && <Button size="md" className="acct-btn" to={action.to}>{action.label}</Button>}
    </div>
  )
}
