import { z } from 'zod'
import { isStrictEmail, suggestEmail } from '@/lib/email-check'

const INVALID_EMAIL = 'Enter a valid email address, like name@example.com.'

/**
 * Mirrors the backend's Zod-at-the-boundary rule; messages say what to do next.
 * Stricter than Zod's .email(): no doubled dots or stray symbols, a real-looking
 * TLD, and typos of big providers are caught ("gmai.com" → "Did you mean …gmail.com?").
 */
const email = z
  .string()
  .trim()
  .min(1, 'Enter your email.')
  .email(INVALID_EMAIL)
  .superRefine((value, ctx) => {
    if (!isStrictEmail(value)) {
      // Same code as .email() so the field still shows Stitch's "Invalid syntax" tag.
      ctx.addIssue({ code: z.ZodIssueCode.invalid_string, validation: 'email', message: INVALID_EMAIL })
      return
    }
    const suggestion = suggestEmail(value)
    if (suggestion) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Check the spelling. Did you mean ${suggestion}?` })
  })

/** Stitch's "Invalid syntax" tag: only for a malformed email, not an empty one (Zod code 'invalid_string'). */
export function emailErrorLabel(errorType: string | undefined): string | undefined {
  return errorType === 'invalid_string' ? 'Invalid syntax' : undefined
}

export const signInSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password.'),
  rememberMe: z.boolean(),
})
export type SignInValues = z.infer<typeof signInSchema>

export const MIN_PASSWORD_LENGTH = 8
/** Letters required in the first and in the last name ("Li Na" passes; "A Smith" doesn't). */
export const MIN_NAME_PART_LETTERS = 2
const MAX_NAME_LENGTH = 100

/**
 * A real person's name: letters from any language (incl. accents), with single
 * spaces, hyphens or apostrophes between parts and an optional period after a
 * letter ("Mary-Jane O'Neil", "John R. Smith"). Rejects digits, symbols, emoji,
 * handles like "xX_gamer99", and doubled separators.
 */
const NAME_PATTERN = /^\p{L}[\p{L}\p{M}]*(?:\.?[ '’-]?\p{L}[\p{L}\p{M}]*)*\.?$/u

const letterCount = (part: string) => part.match(/\p{L}/gu)?.length ?? 0

/** "Full name" means first and last: at least two words, the first and last each with 2+ letters. */
function hasFirstAndLastName(name: string): boolean {
  const parts = name.split(' ')
  return (
    parts.length >= 2 &&
    letterCount(parts.at(0) ?? '') >= MIN_NAME_PART_LETTERS &&
    letterCount(parts.at(-1) ?? '') >= MIN_NAME_PART_LETTERS
  )
}

const fullName = z
  .string()
  .trim()
  .min(1, 'Enter your full name.')
  .max(MAX_NAME_LENGTH, `Use ${MAX_NAME_LENGTH} characters or fewer.`)
  .regex(NAME_PATTERN, 'Use letters only, with a single space, hyphen or apostrophe between names.')
  .refine(
    hasFirstAndLastName,
    `Enter your first and last name, each at least ${MIN_NAME_PART_LETTERS} letters.`,
  )

/** One password rule for create account and reset password. */
const newPassword = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `Use at least ${MIN_PASSWORD_LENGTH} characters.`)
  .regex(/\d/, 'Add at least one number.')
  .regex(/[^A-Za-z0-9]/, 'Add at least one symbol, like ! or #.')

export const createAccountSchema = z
  .object({
    name: fullName,
    email,
    password: newPassword,
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

const otp = z.string().regex(new RegExp(`^\\d{${OTP_LENGTH}}$`), `Enter the ${OTP_LENGTH}-digit code.`)

export const verifyEmailSchema = z.object({ otp })
export type VerifyEmailValues = z.infer<typeof verifyEmailSchema>

export const forgotPasswordSchema = z.object({ email })
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

/** Reset password, step 1: the emailed code. */
export const resetCodeSchema = z.object({ otp })
export type ResetCodeValues = z.infer<typeof resetCodeSchema>

/** Reset password, step 2 (only after the code is confirmed): the new password. */
export const resetPasswordSchema = z
  .object({
    password: newPassword,
    confirmPassword: z.string().min(1, 'Re-enter your new password.'),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords don’t match. Re-enter it.',
  })
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>
