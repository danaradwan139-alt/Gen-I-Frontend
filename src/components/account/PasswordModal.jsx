import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useAuth } from '@/context/AuthContext'
import { useConfirm } from '@/context/ConfirmContext'
import useForm from '@/hooks/useForm'
import { changePassword } from '@/services/authService'
import { validateConfirmPassword, validatePassword } from '@/utils/validators'

const initialValues = { currentPassword: '', newPassword: '', confirmPassword: '' }

const validate = ({ currentPassword, newPassword, confirmPassword }) => ({
  currentPassword: validatePassword(currentPassword),
  newPassword: validatePassword(newPassword, { enforceLength: true }),
  confirmPassword: validateConfirmPassword(confirmPassword, newPassword),
})

function PasswordForm({ onChanged, onClose }) {
  const { session } = useAuth()
  const confirm = useConfirm()
  const { values, errors, submitError, submitting, handleChange, handleBlur, handleSubmit } = useForm({
    initialValues,
    validate,
    onSubmit: async ({ currentPassword, newPassword }) => {
      const ok = await confirm({
        tone: 'save',
        icon: 'shield',
        title: 'Update your password?',
        message: 'You’ll use the new password the next time you sign in on any device.',
        confirmLabel: 'Update password',
      })
      if (!ok) return
      await changePassword({ currentPassword, newPassword }, session?.token)
      onChanged()
      onClose()
    },
  })

  const field = (name) => ({ name, type: 'password', required: true, value: values[name], error: errors[name], onChange: handleChange, onBlur: handleBlur })

  return (
    <form className="addr-form" onSubmit={handleSubmit} noValidate>
      {submitError && <p className="auth-alert" role="alert">{submitError}</p>}
      <Input label="Current password" autoComplete="current-password" {...field('currentPassword')} />
      <Input label="New password" autoComplete="new-password" {...field('newPassword')} />
      <Input label="Confirm new password" autoComplete="new-password" {...field('confirmPassword')} />
      <div className="modal-actions">
        <Button variant="text" size="lg" onClick={onClose}>Cancel</Button>
        <Button type="submit" size="lg" loading={submitting}>Update password</Button>
      </div>
    </form>
  )
}

export default function PasswordModal({ open, onChanged, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Change password" className="modal-sm">
      <PasswordForm onChanged={onChanged} onClose={onClose} />
    </Modal>
  )
}
