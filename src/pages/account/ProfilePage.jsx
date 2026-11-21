import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DateField from '@/components/account/DateField'
import DevicesModal from '@/components/account/DevicesModal'
import PasswordModal from '@/components/account/PasswordModal'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Switch } from '@/components/ui/Switch'
import { useAccount } from '@/context/AccountContext'
import { useAuth } from '@/context/AuthContext'
import { useConfirm } from '@/context/ConfirmContext'
import { languages } from '@/data/account'
import useForm from '@/hooks/useForm'
import { deleteAccount } from '@/services/authService'
import { formatAgo } from '@/utils/format'
import { validateBirthDate, validateEmail, validateMobile, validateRequired } from '@/utils/validators'

const notificationRows = [
  { key: 'orders', label: 'Order and delivery updates (SMS & email)' },
  { key: 'repairs', label: 'Repair status updates' },
  { key: 'offers', label: 'Offers, new arrivals and price drops' },
  { key: 'whatsapp', label: 'WhatsApp messages from GEN-I' },
]

const validate = ({ firstName, lastName, email, mobile, birthDate }) => ({
  firstName: validateRequired(firstName, 'Enter your first name.'),
  lastName: validateRequired(lastName, 'Enter your last name.'),
  email: validateEmail(email),
  mobile: validateMobile(mobile),
  birthDate: validateBirthDate(birthDate),
})

function PersonalInfo() {
  const { profile, updateProfile } = useAccount()
  const confirm = useConfirm()
  const [saved, setSaved] = useState(false)
  const { values, errors, setValues, submitting, handleChange, handleBlur, handleSubmit } = useForm({
    initialValues: profile,
    validate,
    onSubmit: async (formValues) => {
      const ok = await confirm({
        tone: 'save',
        title: 'Save your changes?',
        message: 'Your name, contact details and preferences will be updated on your GEN-I account.',
        confirmLabel: 'Save changes',
      })
      if (!ok) return
      updateProfile(formValues)
      setSaved(true)
    },
  })

  useEffect(() => {
    if (!saved) return undefined
    const timer = window.setTimeout(() => setSaved(false), 3000)
    return () => window.clearTimeout(timer)
  }, [saved])

  const field = (name) => ({ name, value: values[name], error: errors[name], onChange: handleChange, onBlur: handleBlur, required: true })

  return (
    <form className="pf-card" onSubmit={handleSubmit} noValidate>
      <div className="pf-head">
        <h2 className="pf-title">Personal info</h2>
        <div className="pf-save">
          <span className="pf-saved" role="status">{saved ? 'Changes saved' : ''}</span>
          <Button type="submit" size="md" loading={submitting}>Save changes</Button>
        </div>
      </div>
      <div className="pf-grid">
        <Input label="First name" autoComplete="given-name" {...field('firstName')} />
        <Input label="Last name" autoComplete="family-name" {...field('lastName')} />
        <Input label="Email" type="email" autoComplete="email" {...field('email')} />
        <Input label="Mobile" type="tel" autoComplete="tel" {...field('mobile')} />
        <DateField label="Date of birth" {...field('birthDate')} onValueChange={(birthDate) => setValues((current) => ({ ...current, birthDate }))} />
        <Select label="Preferred language" options={languages} {...field('language')} required />
      </div>
    </form>
  )
}

function Security() {
  const { security, devices, setTwoStep, markPasswordChanged, revokeDevice } = useAccount()
  const confirm = useConfirm()

  async function handleTwoStep(event) {
    const enable = event.target.checked
    if (!enable) {
      const ok = await confirm({
        tone: 'warning',
        title: 'Turn off two-step verification?',
        message: 'Anyone with your password could sign in to your account without an SMS code.',
        confirmLabel: 'Turn off',
        cancelLabel: 'Keep it on',
      })
      if (!ok) return
    }
    setTwoStep(enable)
  }

  async function handleRevoke(device) {
    const ok = await confirm({
      tone: 'warning',
      icon: 'logout',
      title: `Sign out ${device.name}?`,
      message: 'That device will need your password to get back into your account.',
      confirmLabel: 'Sign out device',
    })
    if (ok) revokeDevice(device.id)
  }
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [devicesOpen, setDevicesOpen] = useState(false)
  const others = devices.length - 2
  const summary = devices.slice(0, 2).map((device) => device.name).join(' · ') + (others > 0 ? ` · ${others} more` : '')

  return (
    <section className="pf-card" aria-labelledby="pf-security">
      <h2 className="pf-title" id="pf-security">Security</h2>
      <ul className="pf-list">
        <li className="pf-row">
          <div>
            <p className="pf-row-title">Password</p>
            <p className="pf-row-sub">Last changed {formatAgo(security.passwordChangedAt)}</p>
          </div>
          <Button variant="outline-teal" size="md" onClick={() => setPasswordOpen(true)}>Change password</Button>
        </li>
        <li className="pf-row">
          <div>
            <p className="pf-row-title">Two-step verification</p>
            <p className="pf-row-sub">Get a code by SMS when you sign in</p>
          </div>
          <Switch aria-label="Two-step verification" checked={security.twoStep} onChange={handleTwoStep} />
        </li>
        <li className="pf-row">
          <div>
            <p className="pf-row-title">Signed-in devices</p>
            <p className="pf-row-sub">{summary || 'No other devices'}</p>
          </div>
          <Button variant="outline-teal" size="md" onClick={() => setDevicesOpen(true)}>Manage</Button>
        </li>
      </ul>
      <PasswordModal open={passwordOpen} onChanged={markPasswordChanged} onClose={() => setPasswordOpen(false)} />
      <DevicesModal open={devicesOpen} devices={devices} onRevoke={handleRevoke} onClose={() => setDevicesOpen(false)} />
    </section>
  )
}

function Notifications() {
  const { notifications, setNotification } = useAccount()

  return (
    <section className="pf-card" aria-labelledby="pf-notifications">
      <h2 className="pf-title" id="pf-notifications">Notifications</h2>
      <ul className="pf-list">
        {notificationRows.map(({ key, label }) => (
          <li key={key} className="pf-row pf-row-sm">
            <span className="pf-row-label">{label}</span>
            <Switch aria-label={label} checked={notifications[key]} onChange={(event) => setNotification(key, event.target.checked)} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function DeleteAccount() {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState('')

  async function handleDelete() {
    try {
      await deleteAccount(session?.token)
      signOut()
      navigate('/', { replace: true })
    } catch (failure) {
      setConfirming(false)
      setError(failure.message)
    }
  }

  return (
    <section className="pf-delete" aria-labelledby="pf-delete">
      <div>
        <h2 className="pf-delete-title" id="pf-delete">Delete account</h2>
        <p className="pf-row-sub">Permanently remove your account and personal data.</p>
        {error && <p className="field-error" role="alert">{error}</p>}
      </div>
      <Button variant="outline-teal" size="md" onClick={() => setConfirming(true)}>Delete</Button>
      <ConfirmDialog
        open={confirming}
        title="Delete your account?"
        message="This permanently removes your account and personal data. This can’t be undone."
        confirmLabel="Delete account"
        cancelLabel="Keep my account"
        secondStep={{
          title: 'Final step: delete forever',
          message: 'Your orders, repairs, trade-ins, saved items and payment methods will be erased.',
          confirmLabel: 'Delete my account',
          requireText: 'DELETE',
        }}
        onClose={() => setConfirming(false)}
        onConfirm={handleDelete}
      />
    </section>
  )
}

export default function ProfilePage() {
  return (
    <div className="pf">
      <PersonalInfo />
      <Security />
      <Notifications />
      <DeleteAccount />
    </div>
  )
}
