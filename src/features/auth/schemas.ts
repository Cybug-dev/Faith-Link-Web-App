import { z } from 'zod'

/** Mirrors the backend's Zod-at-the-boundary rule; messages say what to do next. */
const email = z
  .string()
  .trim()
  .min(1, 'Enter your email.')
  .email('Enter a valid email address, like name@example.com.')

export const signInSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password.'),
})
export type SignInValues = z.infer<typeof signInSchema>

export const MIN_PASSWORD_LENGTH = 8

export const createAccountSchema = z
  .object({
    name: z.string().trim().min(1, 'Enter your name.').max(100, 'Use 100 characters or fewer.'),
    email,
    password: z
      .string()
      .min(MIN_PASSWORD_LENGTH, `Use at least ${MIN_PASSWORD_LENGTH} characters.`)
      .regex(/\d/, 'Add at least one number.')
      .regex(/[^A-Za-z0-9]/, 'Add at least one symbol, like ! or #.'),
    // Undefined until the confirmation field is shown (after the first submit).
    confirmPassword: z.string().optional(),
    acceptedTerms: z.boolean().refine((v) => v, {
      message: 'Agree to the Terms of Service and Privacy Policy to continue.',
    }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword === undefined) return
    if (confirmPassword === '') {
      ctx.addIssue({ code: 'custom', path: ['confirmPassword'], message: 'Re-enter your password.' })
    } else if (confirmPassword !== password) {
      ctx.addIssue({ code: 'custom', path: ['confirmPassword'], message: 'Passwords don’t match. Re-enter it.' })
    }
  })
export type CreateAccountValues = z.infer<typeof createAccountSchema>

export const OTP_LENGTH = 6

export const verifyEmailSchema = z.object({
  otp: z.string().regex(new RegExp(`^\\d{${OTP_LENGTH}}$`), `Enter the ${OTP_LENGTH}-digit code.`),
})
export type VerifyEmailValues = z.infer<typeof verifyEmailSchema>
