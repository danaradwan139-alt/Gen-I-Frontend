import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Switch } from '@/components/ui/Switch'
import { useConfirm } from '@/context/ConfirmContext'
import useForm from '@/hooks/useForm'
import { getAreas, governorates } from '@/data/account'
import { validateMobile, validateRequired } from '@/utils/validators'
import { LocateIcon } from './icons'

const types = ['Home', 'Work', 'Other']

const emptyAddress = { type: 'Home', fullName: '', mobile: '', governorate: 'Cairo', area: '', street: '', floor: '', landmark: '', isDefault: false }

const validate = ({ fullName, mobile, governorate, area, street }) => ({
  fullName: validateRequired(fullName, 'Enter your full name.'),
  mobile: validateMobile(mobile),
  governorate: validateRequired(governorate, 'Select a governorate.'),
  area: validateRequired(area, 'Select an area.'),
  street: validateRequired(street, 'Enter the street and building.'),
})

function MapBanner({ coords, onLocate }) {
  const [message, setMessage] = useState('')

  function locate() {
    if (!navigator.geolocation) {
      setMessage('Location is not supported on this device.')
      return
    }
    setMessage('Finding your location…')
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => { onLocate({ latitude, longitude }); setMessage('') },
      () => setMessage('We couldn’t get your location. Check your browser permission.'),
      { timeout: 10000 }
    )
  }

  return (
    <div className="map">
      <svg className="map-art" viewBox="0 0 560 146" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="560" height="146" fill="#eef0f3" />
        <g stroke="#fff" strokeWidth="9" fill="none" strokeLinecap="round">
          <path d="M-10 40L570 90M-10 118L570 20M120 -10L180 160M330 -10L290 160M450 -10L500 160" />
        </g>
        <g stroke="#dde1e6" strokeWidth="3" fill="none"><path d="M-10 78L570 130M60 -10L90 160M390 -10L410 160" /></g>
        <circle cx="448" cy="62" r="22" fill="#d6ebd8" />
      </svg>
      <button type="button" className="map-btn" onClick={locate}>
        <LocateIcon size={20} />
        {coords ? 'Location added' : 'Use my current location'}
      </button>
      {message && <p className="map-note" role="status">{message}</p>}
    </div>
  )
}

function AddressForm({ address, onSave, onClose, location = false }) {
  const confirm = useConfirm()
  const [coords, setCoords] = useState(address?.coords ?? null)
  const { values, errors, submitError, setValues, submitting, handleChange, handleBlur, handleSubmit } = useForm({
    initialValues: address ?? (location ? { ...emptyAddress, type: '' } : emptyAddress),
    validate: (v) => ({ ...validate(v), ...(location && { type: v.type.trim() ? '' : 'Name this location, e.g. Smart Village HQ.' }) }),
    onSubmit: async (formValues) => {
      const ok = await confirm({
        tone: 'save',
        title: address ? 'Save address changes?' : 'Save this address?',
        message: `${formValues.type || 'This address'} will be ${address ? 'updated in' : 'added to'} your ${location ? 'delivery locations' : 'saved addresses'}.`,
        confirmLabel: 'Save address',
      })
      if (!ok) return
      onSave({ ...formValues, ...(coords && { coords }) })
      onClose()
    },
  })

  const field = (name) => ({ name, value: values[name], error: errors[name], onChange: handleChange, onBlur: handleBlur })

  return (
    <form className="addr-form" onSubmit={handleSubmit} noValidate>
      <MapBanner coords={coords} onLocate={setCoords} />

      {location ? (
        <Input label="Location name" required placeholder="e.g. Smart Village HQ" {...field('type')} />
      ) : (
      <div className="addr-types" role="group" aria-label="Address type">
        {types.map((type) => (
          <Chip key={type} active={values.type === type} onClick={() => setValues((current) => ({ ...current, type }))}>{type}</Chip>
        ))}
      </div>
      )}

      <div className="addr-grid">
        <Input label="Full name" required autoComplete="name" placeholder="Mohamed Ahmed" {...field('fullName')} />
        <Input label="Mobile" required type="tel" autoComplete="tel" placeholder="+20 1XX XXX XXXX" {...field('mobile')} />
        <Select
          label="Governorate" required options={governorates} autoComplete="address-level1" {...field('governorate')}
          onChange={(event) => setValues((current) => ({ ...current, governorate: event.target.value, area: '' }))}
        />
        <Select label="Area" required placeholder="Select area" options={getAreas(values.governorate)} {...field('area')} />
        <Input className="addr-wide" label="Street & building" required autoComplete="street-address" placeholder="Street name, building no." {...field('street')} />
        <Input label="Floor / Apt" placeholder="e.g. 4th floor, Apt 12" {...field('floor')} />
        <Input label="Landmark" placeholder="Optional" {...field('landmark')} />
      </div>

      <Switch
        label="Set as my default delivery address"
        checked={values.isDefault}
        onChange={(event) => setValues((current) => ({ ...current, isDefault: event.target.checked }))}
      />

      {submitError && <p className="auth-alert" role="alert">{submitError}</p>}
      <div className="modal-actions">
        <Button variant="text" size="lg" onClick={onClose}>Cancel</Button>
        <Button type="submit" size="lg" loading={submitting}>Save address</Button>
      </div>
    </form>
  )
}

// `address` set -> edit mode, otherwise "Add a new address".
export default function AddressModal({ open, address, onSave, onClose, location = false }) {
  return (
    <Modal open={open} onClose={onClose} title={address ? (location ? 'Edit location' : 'Edit address') : (location ? 'Add a delivery location' : 'Add a new address')} className="modal-address">
      <AddressForm address={address} onSave={onSave} onClose={onClose} location={location} />
    </Modal>
  )
}
