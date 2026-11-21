import { useRef } from 'react'
import { Input } from '@/components/ui/Input'
import { formatBirthDateInput } from '@/utils/validators'
import { CalendarIcon } from './icons'

const toDisplay = (iso) => iso.split('-').reverse().join(' / ')

// "DD / MM / YYYY" text field with a calendar button that opens the native date picker.
export default function DateField({ value, onValueChange, ...rest }) {
  const pickerRef = useRef(null)

  function openPicker() {
    const picker = pickerRef.current
    if (picker?.showPicker) picker.showPicker()
  }

  return (
    <>
      <Input
        {...rest}
        value={value}
        inputMode="numeric"
        autoComplete="bday"
        placeholder="DD / MM / YYYY"
        maxLength={14}
        onChange={(event) => onValueChange(formatBirthDateInput(event.target.value))}
        adornment={
          <button type="button" className="field-toggle field-calendar" onClick={openPicker} aria-label="Open calendar">
            <CalendarIcon size={20} />
          </button>
        }
      />
      <input
        ref={pickerRef}
        type="date"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        max={new Date().toISOString().slice(0, 10)}
        onChange={(event) => event.target.value && onValueChange(toDisplay(event.target.value))}
      />
    </>
  )
}
