import { formatClock } from './use-countdown'
import { clearPendingEmail, getPendingEmail, maskEmail, setPendingEmail } from './pending-email'

describe('formatClock', () => {
  it.each([
    [0, '0:00'],
    [42, '0:42'],
    [60, '1:00'],
    [125, '2:05'],
  ])('%i seconds -> %s', (seconds, expected) => {
    expect(formatClock(seconds)).toBe(expected)
  })
})

describe('maskEmail', () => {
  it('keeps the first letter and the domain', () => {
    expect(maskEmail('alex@gmail.com')).toBe('a***@gmail.com')
  })
  it('returns the input when it is not an address', () => {
    expect(maskEmail('nonsense')).toBe('nonsense')
  })
})

describe('pending email', () => {
  it('round-trips and clears', () => {
    setPendingEmail('alex@gmail.com')
    expect(getPendingEmail()).toBe('alex@gmail.com')
    clearPendingEmail()
    expect(getPendingEmail()).toBeNull()
  })

  it('does not throw when storage is blocked', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(getPendingEmail()).toBeNull()
    spy.mockRestore()
  })
})
