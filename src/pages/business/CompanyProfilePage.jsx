import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useBusiness } from '@/context/BusinessContext'
import { useConfirm } from '@/context/ConfirmContext'
import { businessCountries } from '@/data/business'
import useForm from '@/hooks/useForm'
import { validateConfirmPassword, validateEmail, validatePassword, validateRequired } from '@/utils/validators'

const notificationRows = [
  ['quotations', 'Email me when a quotation is issued or changes'],
  ['approvals', 'Email approvers when a quote needs approval'],
  ['offers', 'Business offers and news (optional)'],
]

// Figma "04.5 Company Profile": business information, account security, notifications.
export default function CompanyProfilePage() {
  const { company, updateCompany, notifications, setNotification } = useBusiness()
  const confirm = useConfirm()
  const [saved, setSaved] = useState(false)
  const { values, errors, setValues, submitting, handleChange, handleBlur, handleSubmit } = useForm({
    initialValues: { ...company, password: '', confirmPassword: '' },
    validate: (v) => ({
      name: validateRequired(v.name, 'Enter your company name.'),
      email: validateEmail(v.email),
      phone: v.phone.replace(/\D/g, '').length >= 8 ? '' : 'Enter a valid phone number.',
      registration: validateRequired(v.registration, 'Enter your commercial registration number.'),
      password: v.password ? validatePassword(v.password, { enforceLength: true }) : '',
      confirmPassword: v.password ? validateConfirmPassword(v.confirmPassword, v.password) : '',
    }),
    onSubmit: async ({ password, confirmPassword, ...rest }) => {
      const ok = await confirm({ tone: 'save', title: 'Save company profile?', message: `${rest.name}’s details${password ? ' and password' : ''} will be updated for everyone on this account.`, confirmLabel: 'Save changes' })
      if (!ok) return
      updateCompany(rest)
      setValues((v) => ({ ...v, password: '', confirmPassword: '' }))
      setSaved(true)
    },
  })

  useEffect(() => {
    if (!saved) return undefined
    const t = window.setTimeout(() => setSaved(false), 3000)
    return () => window.clearTimeout(t)
  }, [saved])

  const field = (name) => ({ name, value: values[name], error: errors[name], onChange: handleChange, onBlur: handleBlur })

  return (
    <form className="pf" onSubmit={handleSubmit} noValidate>
      <section className="pf-card">
        <div className="pf-head">
          <h2 className="pf-title">Business Information</h2>
          <div className="pf-save">
            <span className="pf-saved" role="status">{saved ? 'Changes saved' : ''}</span>
            <Button type="submit" size="md" loading={submitting}>Save changes</Button>
          </div>
        </div>
        <div className="pf-grid">
          <Input label="Company / Business Name" required autoComplete="organization" placeholder="Enter company / business name" {...field('name')} />
          <Input label="Business Email" required type="email" autoComplete="email" placeholder="Enter business email" {...field('email')} />
          <Input label="Business Phone Number" type="tel" autoComplete="tel" placeholder="Enter business phone number" {...field('phone')} />
          <Input label="Commercial Registration Number" required placeholder="Enter commercial registration number" {...field('registration')} />
          <Select label="Country" placeholder="Choose" options={businessCountries} {...field('country')} />
          <Input label="Business Type" placeholder="Enter business type" {...field('type')} />
        </div>
      </section>

      <section className="pf-card">
        <h2 className="pf-title">Account Security</h2>
        <div className="pf-grid">
          <Input label="New password" type="password" autoComplete="new-password" placeholder="Leave blank to keep the current one" {...field('password')} />
          <Input label="Confirm Password" type="password" autoComplete="new-password" placeholder="Repeat the new password" {...field('confirmPassword')} />
        </div>
      </section>

      <section className="pf-card">
        <h2 className="pf-title">Notifications</h2>
        <ul className="bz-checks">
          {notificationRows.map(([key, label]) => (
            <li key={key}>
              <label className="check">
                <input type="checkbox" checked={notifications[key]} onChange={(e) => setNotification(key, e.target.checked)} />
                <span className="check-box"><svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.5 6.5l2.2 2.2 4.8-5" /></svg></span>
                {label}
              </label>
            </li>
          ))}
        </ul>
      </section>
    </form>
  )
}
