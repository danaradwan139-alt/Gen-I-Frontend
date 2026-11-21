// Social sign-in providers and the steps each one walks the user through.
// Field kinds: email | identifier (email or mobile) | code | consent

export const providers = {
  google: {
    id: 'google',
    name: 'Google',
    label: 'Continue with Google',
    color: '#4285f4',
    colorDeep: '#1a56c4',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#ea4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285f4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#fbbc05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <path fill="#34a853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      </svg>
    ),
    steps: [
      {
        id: 'account', kind: 'email', short: 'Account',
        title: 'Sign in with Google',
        sub: 'Choose the Google account you want to use with GEN-I.',
        label: 'Email or Gmail address', placeholder: 'name@gmail.com', cta: 'Next',
      },
      {
        id: 'verify', kind: 'code', short: 'Verify',
        title: 'Verify it’s you',
        sub: (v) => `Google sent a 6-digit verification code to ${v.identifier}.`,
        cta: 'Verify',
      },
      {
        id: 'consent', kind: 'consent', short: 'Allow',
        title: 'GEN-I wants to access your Google Account',
        sub: (v) => v.identifier,
        scopes: [
          { id: 'profile', label: 'See your name and profile picture', required: true },
          { id: 'email', label: 'See your primary email address', required: true },
        ],
        cta: 'Allow',
      },
    ],
  },

  facebook: {
    id: 'facebook',
    name: 'Facebook',
    label: 'Continue with Facebook',
    color: '#1877f2',
    colorDeep: '#0c5bc7',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="12" fill="#1877f2" />
        <path fill="#fff" d="M16.67 15.47l.53-3.47h-3.33V9.75c0-.95.47-1.87 1.96-1.87h1.51V4.92s-1.37-.23-2.68-.23c-2.74 0-4.53 1.66-4.53 4.67V12H7.08v3.47h3.05V24a12.1 12.1 0 003.74 0v-8.53h2.8z" />
      </svg>
    ),
    steps: [
      {
        id: 'account', kind: 'identifier', short: 'Log in',
        title: 'Log in with Facebook',
        sub: 'Enter the email or mobile number linked to your Facebook account.',
        label: 'Email or mobile number', placeholder: 'name@email.com or 01xxxxxxxxx', cta: 'Log in',
      },
      {
        id: 'verify', kind: 'code', short: 'Code',
        title: 'Enter your login code',
        sub: (v) => `We sent a 6-digit login code to ${v.identifier}.`,
        cta: 'Continue',
      },
      {
        id: 'consent', kind: 'consent', short: 'Permissions',
        title: (v) => `Continue as ${v.name}?`,
        sub: 'GEN-I is requesting access to:',
        scopes: [
          { id: 'profile', label: 'Name and profile picture', required: true },
          { id: 'email', label: 'Email address', required: false },
        ],
        cta: (v) => `Continue as ${v.name}`,
        note: 'This doesn’t let GEN-I post to Facebook.',
      },
    ],
  },

  apple: {
    id: 'apple',
    name: 'Apple',
    label: 'Continue with Apple',
    color: '#1d1d1f',
    colorDeep: '#000',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#3b4655" d="M12.15 6.9c-.95 0-2.42-1.08-3.96-1.04-2.04.03-3.91 1.18-4.96 3.01-2.12 3.68-.55 9.1 1.52 12.09 1.01 1.45 2.21 3.09 3.79 3.04 1.52-.07 2.09-.99 3.94-.99 1.83 0 2.35.99 3.96.95 1.64-.03 2.68-1.48 3.68-2.95 1.16-1.69 1.64-3.33 1.66-3.42-.04-.01-3.18-1.22-3.22-4.86-.03-3.04 2.48-4.49 2.6-4.56-1.43-2.09-3.62-2.32-4.39-2.38-2-.16-3.68 1.09-4.61 1.09zm3.38-3.07c.84-1.01 1.4-2.43 1.25-3.83-1.21.05-2.66.8-3.53 1.82-.78.9-1.45 2.34-1.27 3.71 1.34.1 2.72-.69 3.55-1.7z" />
      </svg>
    ),
    steps: [
      {
        id: 'account', kind: 'identifier', short: 'Apple ID',
        title: 'Sign in with Apple ID',
        sub: 'Use your Apple ID email or phone number.',
        label: 'Apple ID', placeholder: 'name@icloud.com', cta: 'Continue',
      },
      {
        id: 'verify', kind: 'code', short: 'Two-factor',
        title: 'Two-factor authentication',
        sub: 'A verification code was sent to your trusted Apple devices.',
        cta: 'Verify',
      },
      {
        id: 'consent', kind: 'apple-share', short: 'Share',
        title: 'Create your GEN-I account',
        sub: 'Choose what you share with GEN-I.',
        cta: 'Continue',
      },
    ],
  },
}

export const providerOrder = ['facebook', 'apple', 'google']
