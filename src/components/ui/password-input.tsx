import { Eye, EyeOff, Lock } from 'lucide-react'
import { useState, type ComponentProps } from 'react'
import { Input } from './input'

type PasswordInputProps = Omit<ComponentProps<typeof Input>, 'type' | 'startIcon' | 'endAdornment'>

/** Password field with a show/hide toggle. The toggle is a real button, 44px hit area. */
export function PasswordInput(props: PasswordInputProps) {
  const [visible, setVisible] = useState(false)
  const label = visible ? 'Hide password' : 'Show password'

  return (
    <Input
      {...props}
      type={visible ? 'text' : 'password'}
      startIcon={Lock}
      endAdornment={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={label}
          aria-pressed={visible}
          className="flex size-11 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-subtle hover:text-fg"
        >
          {/* Icon shows the current state: open eye = visible, slashed eye = hidden. */}
          {visible ? <Eye aria-hidden className="size-5" /> : <EyeOff aria-hidden className="size-5" />}
        </button>
      }
    />
  )
}
