import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

const ConfirmContext = createContext(null)

// App-wide confirmation popup. `const confirm = useConfirm()` then
// `if (await confirm({ title, message, confirmLabel, tone, secondStep })) { ...do it }`.
export function ConfirmProvider({ children }) {
  const [options, setOptions] = useState(null)
  const resolver = useRef(null)

  const confirm = useCallback((next) => new Promise((resolve) => {
    resolver.current?.(false)
    resolver.current = resolve
    setOptions(next)
  }), [])

  const settle = (answer) => {
    resolver.current?.(answer)
    resolver.current = null
    setOptions(null)
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmDialog
        {...(options ?? {})}
        open={Boolean(options)}
        onClose={() => settle(false)}
        onConfirm={() => settle(true)}
      />
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const context = useContext(ConfirmContext)
  if (!context) throw new Error('useConfirm must be used inside ConfirmProvider')
  return context
}
