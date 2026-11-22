// Personal / Business switch on the login and sign-up forms.
export default function AccountTypeToggle({ value, onChange }) {
  return (
    <div className="auth-type" role="radiogroup" aria-label="Account type">
      {[['personal', 'Personal'], ['business', 'Business']].map(([id, label]) => (
        <button key={id} type="button" role="radio" aria-checked={value === id} className={`auth-type-btn ${value === id ? 'is-on' : ''}`} onClick={() => onChange(id)}>
          {label}
        </button>
      ))}
    </div>
  )
}
