import { render, screen } from '@testing-library/react'
import { FormField } from './form-field'
import { Input } from './input'

describe('FormField', () => {
  it('associates the label with the control', () => {
    render(<FormField label="Email">{(c) => <Input {...c} />}</FormField>)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('shows the hint and points the control at it', () => {
    render(
      <FormField label="Password" hint="Use at least 8 characters.">
        {(c) => <Input {...c} />}
      </FormField>,
    )
    const input = screen.getByLabelText('Password')
    expect(input).toHaveAccessibleDescription('Use at least 8 characters.')
    expect(input).not.toHaveAttribute('aria-invalid')
  })

  it('replaces the hint with the error and marks the control invalid', () => {
    render(
      <FormField label="Password" hint="Use at least 8 characters." error="Enter your password.">
        {(c) => <Input {...c} />}
      </FormField>,
    )
    const input = screen.getByLabelText('Password')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Enter your password.')
    expect(screen.queryByText('Use at least 8 characters.')).not.toBeInTheDocument()
  })

  it('can hide the label visually without removing it', () => {
    render(
      <FormField label="Verification code" hideLabel>
        {(c) => <Input {...c} />}
      </FormField>,
    )
    expect(screen.getByLabelText('Verification code')).toBeInTheDocument()
  })
})
