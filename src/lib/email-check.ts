/**
 * Stricter-than-RFC email checks for sign-up and sign-in forms. No form can prove
 * an inbox exists (only the emailed code does), but these catch the mistakes
 * people actually make: bad punctuation, and typos of the big providers
 * ("gmai.com", "gmial.com", "hotmial.com", "gmail.con").
 */

const MAX_EMAIL_LENGTH = 254

/**
 * local part: letters, digits and . _ % + -, starting and ending with a letter or digit;
 * domain: dot-separated labels (letters, digits, inner hyphens) ending in a 2–24 letter TLD.
 * Consecutive dots are rejected separately.
 */
const STRICT_EMAIL = /^[a-z0-9](?:[a-z0-9._%+-]{0,62}[a-z0-9])?@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/i

export function isStrictEmail(value: string): boolean {
  return value.length <= MAX_EMAIL_LENGTH && !value.includes('..') && STRICT_EMAIL.test(value)
}

/** Providers most sign-ups use; a domain one or two typos away from these is almost certainly a mistake. */
const COMMON_DOMAINS = [
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.co.uk',
  'ymail.com',
  'outlook.com',
  'hotmail.com',
  'hotmail.co.uk',
  'live.com',
  'msn.com',
  'icloud.com',
  'me.com',
  'aol.com',
  'protonmail.com',
  'proton.me',
  'gmx.com',
  'mail.com',
  'zoho.com',
]

/** Typos allowed between a domain and a known provider before it counts as a different domain. */
const MAX_TYPOS = 2

/** Edit distance where swapping two neighbouring letters counts as one typo ("gmial" → "gmail"). */
function typoDistance(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) d[0]![j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      let best = Math.min(d[i - 1]![j]! + 1, d[i]![j - 1]! + 1, d[i - 1]![j - 1]! + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) best = Math.min(best, d[i - 2]![j - 2]! + 1)
      d[i]![j] = best
    }
  }
  return d[a.length]![b.length]!
}

/** "lordara@gmai.com" → "lordara@gmail.com"; null when the domain looks deliberate. */
export function suggestEmail(value: string): string | null {
  const at = value.lastIndexOf('@')
  if (at < 1) return null
  const domain = value.slice(at + 1).toLowerCase()
  if (COMMON_DOMAINS.includes(domain)) return null

  let best: { domain: string; distance: number } | null = null
  for (const known of COMMON_DOMAINS) {
    const distance = typoDistance(domain, known)
    if (distance <= MAX_TYPOS && (!best || distance < best.distance)) best = { domain: known, distance }
  }
  return best ? `${value.slice(0, at)}@${best.domain}` : null
}
