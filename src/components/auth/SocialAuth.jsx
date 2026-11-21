import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { signInWithProvider } from '@/services/authService'
import { providerOrder, providers } from './providers'
import SocialSignIn from './SocialSignIn'

// Social buttons under the login / register form. Each opens that provider's own sign-in steps.
export default function SocialAuth({ onError }) {
  const { signIn } = useAuth()
  const [active, setActive] = useState(null)

  async function handleDone(profile) {
    try {
      const session = await signInWithProvider(active, profile)
      setActive(null)
      if (session) signIn(session, { remember: true })
    } catch (error) {
      setActive(null)
      onError(error.message)
    }
  }

  return (
    <>
      <div className="auth-or" role="separator"><span>or</span></div>
      <div className="auth-social">
        {providerOrder.map((id) => {
          const { label, icon } = providers[id]
          return (
            <button key={id} type="button" className={`auth-social-btn is-${id}`} aria-label={label} title={label} onClick={() => setActive(id)}>
              {icon}
            </button>
          )
        })}
      </div>
      <SocialSignIn provider={active ? providers[active] : null} onClose={() => setActive(null)} onDone={handleDone} />
    </>
  )
}
