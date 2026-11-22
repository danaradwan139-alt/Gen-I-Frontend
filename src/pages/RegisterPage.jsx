import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AccountTypeToggle from '@/components/auth/AccountTypeToggle'
import AuthLayout from '@/components/auth/AuthLayout'
import SocialAuth from '@/components/auth/SocialAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/context/AuthContext'
import useForm from '@/hooks/useForm'
import { register } from '@/services/authService'
import { validateConfirmPassword, validateIdentifier, validatePassword } from '@/utils/validators'

const initialValues = { company: '', identifier: '', password: '', confirmPassword: '' }

const validate = ({ identifier, password, confirmPassword }) => ({
  identifier: validateIdentifier(identifier),
  password: validatePassword(password, { enforceLength: true }),
  confirmPassword: validateConfirmPassword(confirmPassword, password),
})

export default function RegisterPage() {
  const { signIn } = useAuth()
  const [params] = useSearchParams()
  const [accountType, setAccountType] = useState(params.get('type') === 'business' ? 'business' : 'personal')
  const { values, errors, submitError, setSubmitError, submitting, handleChange, handleBlur, handleSubmit } = useForm({
    initialValues,
    validate: (v) => ({ ...validate(v), company: accountType === 'business' && !v.company.trim() ? 'Enter your company name.' : '' }),
    onSubmit: async ({ identifier, password, company }) => {
      const session = await register({ identifier: identifier.trim(), password, accountType, company })
      signIn(session)
    },
  })

  return (
    <AuthLayout title="Create your account." subtitle="Sign up to track orders, book repairs and checkout faster.">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <AccountTypeToggle value={accountType} onChange={setAccountType} />
        {submitError && <p className="auth-alert" role="alert">{submitError}</p>}
        {accountType === 'business' && (
          <Input label="Company name" name="company" autoComplete="organization" placeholder="Nile Logistics" required value={values.company} error={errors.company} onChange={handleChange} onBlur={handleBlur} />
        )}
        <Input
          label="Email or mobile number"
          name="identifier"
          autoComplete="username"
          placeholder="name@email.com"
          required
          value={values.identifier}
          error={errors.identifier}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          required
          value={values.password}
          error={errors.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          required
          value={values.confirmPassword}
          error={errors.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Button type="submit" size="md" className="auth-submit" loading={submitting}>Create account</Button>
      </form>
      {accountType === 'personal' && <SocialAuth onError={setSubmitError} />}
    </AuthLayout>
  )
}
