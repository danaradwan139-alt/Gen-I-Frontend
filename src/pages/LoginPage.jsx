import { Link } from 'react-router-dom'
import AuthLayout from '@/components/auth/AuthLayout'
import SocialAuth from '@/components/auth/SocialAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/context/AuthContext'
import useForm from '@/hooks/useForm'
import { login } from '@/services/authService'
import { validateIdentifier, validatePassword } from '@/utils/validators'

const initialValues = { identifier: '', password: '', remember: true }

const validate = ({ identifier, password }) => ({
  identifier: validateIdentifier(identifier),
  password: validatePassword(password),
})

export default function LoginPage() {
  const { signIn } = useAuth()
  const { values, errors, submitError, setSubmitError, submitting, handleChange, handleBlur, handleSubmit } = useForm({
    initialValues,
    validate,
    onSubmit: async ({ identifier, password, remember }) => {
      const session = await login({ identifier: identifier.trim(), password })
      signIn(session, { remember })
    },
  })

  return (
    <AuthLayout title="Welcome back." subtitle="Sign in to track orders, book repairs and check out faster.">
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
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          value={values.password}
          error={errors.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <div className="auth-row">
          <label className="check">
            <input type="checkbox" name="remember" checked={values.remember} onChange={handleChange} />
            <span className="check-box"><svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.5 6.5l2.2 2.2 4.8-5" /></svg></span>
            Remember me
          </label>
          <Link className="auth-link" to="/forgot-password">Forgot password?</Link>
        </div>
        <Button type="submit" size="md" className="auth-submit" loading={submitting}>Sign in</Button>
      </form>
      <SocialAuth onError={setSubmitError} />
    </AuthLayout>
  )
}
