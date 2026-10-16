/**
 * Password reset limits (owner): 5 codes per email per day, 3 wrong guesses per code.
 *
 * Counted in this browser's localStorage, so it can be bypassed with another
 * browser; Neon Auth's own rate limits still protect the server. Move these
 * counts to the backend before launch (docs/progress.md).
 */
export const RESET_CODES_PER_DAY = 5
export const WRONG_GUESSES_PER_CODE = 3

const DAY_MS = 24 * 60 * 60 * 1000
const KEY = 'faithlink.resetLimits'

type Entry = { sentAt: number[]; wrongGuesses: number }
type Store = Record<string, Entry>

function read(): Store {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Store
  } catch {
    return {}
  }
}

function write(store: Store): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(store))
  } catch {
    /* storage unavailable: limits fall back to Neon's server-side ones */
  }
}

/** The entry for one email, with sends older than a day dropped. */
function entryFor(store: Store, email: string, now: number): Entry {
  const entry = store[email.toLowerCase()] ?? { sentAt: [], wrongGuesses: 0 }
  return { ...entry, sentAt: entry.sentAt.filter((t) => now - t < DAY_MS) }
}

function update(email: string, change: (entry: Entry) => Entry, now = Date.now()): Entry {
  const store = read()
  const next = change(entryFor(store, email, now))
  store[email.toLowerCase()] = next
  write(store)
  return next
}

/** When the next code may be sent, or null if one can be sent now. */
export function nextResetCodeAt(email: string, now = Date.now()): number | null {
  const { sentAt } = entryFor(read(), email, now)
  if (sentAt.length < RESET_CODES_PER_DAY) return null
  return Math.min(...sentAt) + DAY_MS
}

/** A new code was sent: count it and give the new code a fresh set of guesses. */
export function recordResetCodeSent(email: string, now = Date.now()): void {
  update(email, (e) => ({ sentAt: [...e.sentAt, now], wrongGuesses: 0 }), now)
}

/** A wrong code was entered; returns the guesses left for the current code. */
export function recordWrongGuess(email: string): number {
  return WRONG_GUESSES_PER_CODE - update(email, (e) => ({ ...e, wrongGuesses: e.wrongGuesses + 1 })).wrongGuesses
}

/** The server refused further guesses: treat the current code as used up. */
export function lockCurrentCode(email: string): void {
  update(email, (e) => ({ ...e, wrongGuesses: WRONG_GUESSES_PER_CODE }))
}

export function guessesLeft(email: string): number {
  return Math.max(0, WRONG_GUESSES_PER_CODE - entryFor(read(), email, Date.now()).wrongGuesses)
}

/** "at 4:30 PM" today, or "tomorrow at 4:30 PM". */
export function formatRetryTime(at: number, now = Date.now()): string {
  const time = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(at)
  return new Date(at).toDateString() === new Date(now).toDateString() ? `at ${time}` : `tomorrow at ${time}`
}

/** Shown wherever a code is requested once the daily limit is reached. */
export function dailyLimitMessage(retryAt: number, now = Date.now()): string {
  return `You’ve requested ${RESET_CODES_PER_DAY} codes today. You can request another ${formatRetryTime(retryAt, now)}.`
}
