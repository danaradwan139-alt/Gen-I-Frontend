import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '@/components/auth/AuthLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import useForm from '@/hooks/useForm'
import { requestPasswordReset } from '@/services/authService'
import { validateIdentifier } from '@/utils/validators'

const validate = ({ identifier }) => ({ identifier: validateIdentifier(identifier) })

// "Forgot password?" from the login page: asks for the email / mobile and sends a reset link or code.
export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState('')
  const { values, errors, submitError, submitting, handleChange, handleBlur, handleSubmit } = useForm({
    initialValues: { identifier: '' },
    validate,
    onSubmit: async ({ identifier }) => {
      await requestPasswordReset(identifier.trim())
      setSentTo(identifier.trim())
    },
  })

  if (sentTo) {
    const byEmail = sentTo.includes('@')
    return (
      <AuthLayout title="Check your inbox." subtitle={`We sent a password reset ${byEmail ? 'link' : 'code'} to ${sentTo}. It expires in 30 minutes.`}>
        <div className="auth-form">
          <p className="auth-note">Didn’t get it? Check your spam folder, or try again in a minute.</p>
          <Button size="md" className="auth-submit" to="/login">Back to sign in</Button>
          <button type="button" className="auth-link auth-link-btn" onClick={() => setSentTo('')}>Use a different email or number</button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Forgot your password?" subtitle="Enter the email or mobile number on your account and we’ll send you a link to reset it.">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {submitError && <p className="auth-alert" role="alert">{submitError}</p>}
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
        <Button type="submit" size="md" className="auth-submit" loading={submitting}>Send reset link</Button>
        <Link className="auth-link" to="/login">Back to sign in</Link>
      </form>
    </AuthLayout>
  )
}
