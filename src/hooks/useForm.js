import { useState } from 'react'

// Controlled form state with touched-based inline errors and an async submit lifecycle.
// `validate(values)` returns { fieldName: 'message' } with '' (or nothing) for valid fields.
export default function useForm({ initialValues, validate, onSubmit }) {
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const allErrors = validate(values)
  const errors = Object.fromEntries(
    Object.entries(allErrors).filter(([name, message]) => message && touched[name])
  )

  function handleChange(event) {
    const { name, type, checked, value } = event.target
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    setSubmitError('')
  }

  function handleBlur(event) {
    const { name } = event.target
    setTouched((current) => ({ ...current, [name]: true }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting) return

    const form = event.currentTarget
    setTouched(Object.fromEntries(Object.keys(initialValues).map((name) => [name, true])))

    if (Object.values(allErrors).some(Boolean)) {
      window.requestAnimationFrame(() => form.querySelector('[aria-invalid="true"]')?.focus())
      return
    }

    setSubmitting(true)
    setSubmitError('')
    try {
      await onSubmit(values)
    } catch (error) {
      setSubmitError(error.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return { values, setValues, errors, submitError, setSubmitError, submitting, handleChange, handleBlur, handleSubmit }
}
