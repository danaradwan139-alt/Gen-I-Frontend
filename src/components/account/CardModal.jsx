import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Switch } from '@/components/ui/Switch'
import { useConfirm } from '@/context/ConfirmContext'
import useForm from '@/hooks/useForm'
import { cardBrand, digitsOnly, formatCardNumber, formatExpiry, validateCardNumber, validateCvv, validateExpiry } from '@/utils/cards'
import { validateRequired } from '@/utils/validators'
import { CalendarIcon } from './icons'

const initialValues = { holder: '', number: '', expiry: '', cvv: '', isDefault: true }

const validate = ({ holder, number, expiry, cvv }) => ({
  holder: validateRequired(holder, 'Enter the name on the card.'),
  number: validateCardNumber(number),
  expiry: validateExpiry(expiry),
  cvv: validateCvv(cvv, cardBrand(number)),
})

function CardForm({ onSave, onClose }) {
  const confirm = useConfirm()
  const { values, errors, setValues, submitting, handleChange, handleBlur, handleSubmit } = useForm({
    initialValues,
    validate,
    // Only display data is kept: the full number and CVV are dropped here.
    onSubmit: async ({ holder, number, expiry, isDefault }) => {
      const ok = await confirm({
        tone: 'save',
        title: 'Save this card?',
        message: `${cardBrand(number)} card ending in ${digitsOnly(number).slice(-4)} will be added to your payment methods${isDefault ? ' as your default' : ''}.`,
        confirmLabel: 'Save card',
      })
      if (!ok) return
      onSave({ brand: cardBrand(number), last4: digitsOnly(number).slice(-4), holder: holder.trim(), expiry, isDefault })
      onClose()
    },
  })

  const set = (name, format) => (event) => setValues((current) => ({ ...current, [name]: format(event.target.value) }))
  const field = (name) => ({ name, value: values[name], error: errors[name], onBlur: handleBlur })

  return (
    <form className="addr-form" onSubmit={handleSubmit} noValidate>
      <div className="addr-grid">
        <Input label="Cardholder Name" required autoComplete="cc-name" placeholder="name as shown on card" {...field('holder')} onChange={handleChange} />
        <Input label="card number" required inputMode="numeric" autoComplete="cc-number" placeholder="0000 0000 0000 0000" {...field('number')} onChange={set('number', formatCardNumber)} />
        <Input
          label="Expiry Date" required inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" maxLength={5}
          adornment={<CalendarIcon size={20} />} {...field('expiry')} onChange={set('expiry', formatExpiry)}
        />
        <Input label="CVV" required inputMode="numeric" autoComplete="cc-csc" placeholder="123" maxLength={4} {...field('cvv')} onChange={set('cvv', (v) => digitsOnly(v).slice(0, 4))} />
      </div>
      <Switch
        label="Set as default payment method"
        checked={values.isDefault}
        onChange={(event) => setValues((current) => ({ ...current, isDefault: event.target.checked }))}
      />
      <div className="modal-actions">
        <Button variant="text" size="lg" onClick={onClose}>Cancel</Button>
        <Button type="submit" size="lg" loading={submitting}>Save Card</Button>
      </div>
    </form>
  )
}

export default function CardModal({ open, onSave, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Add new card" className="modal-address">
      <CardForm onSave={onSave} onClose={onClose} />
    </Modal>
  )
}
