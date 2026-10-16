import {
  formatRetryTime,
  guessesLeft,
  nextResetCodeAt,
  recordResetCodeSent,
  recordWrongGuess,
  RESET_CODES_PER_DAY,
} from './reset-limits'

const email = 'Alex@Gmail.com'

describe('reset limits', () => {
  it('allows five codes a day, then gives the time the oldest one expires', () => {
    const start = Date.UTC(2026, 9, 16, 9)
    for (let i = 0; i < RESET_CODES_PER_DAY; i++) recordResetCodeSent(email, start + i * 1000)
    expect(nextResetCodeAt('alex@gmail.com', start + 10_000)).toBe(start + 24 * 60 * 60 * 1000)
    expect(nextResetCodeAt(email, start + 24 * 60 * 60 * 1000 + 1)).toBeNull()
  })

  it('gives three guesses per code and resets them with a new code', () => {
    recordResetCodeSent(email)
    expect(recordWrongGuess(email)).toBe(2)
    expect(recordWrongGuess(email)).toBe(1)
    expect(recordWrongGuess(email)).toBe(0)
    expect(guessesLeft(email)).toBe(0)
    recordResetCodeSent(email)
    expect(guessesLeft(email)).toBe(3)
  })

  it('says "tomorrow" when the time is on another day', () => {
    const now = new Date(2026, 9, 16, 23, 0).getTime()
    expect(formatRetryTime(now + 30 * 60 * 1000, now)).toMatch(/^at /)
    expect(formatRetryTime(now + 2 * 60 * 60 * 1000, now)).toMatch(/^tomorrow at /)
  })
})
