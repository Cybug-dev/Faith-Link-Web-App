/** Navigation state reset password hands to sign in, so sign in can confirm the change. */
export const PASSWORD_RESET_STATE = { passwordReset: true } as const

export function cameFromPasswordReset(state: unknown): boolean {
  return (state as Partial<typeof PASSWORD_RESET_STATE> | null)?.passwordReset === true
}
