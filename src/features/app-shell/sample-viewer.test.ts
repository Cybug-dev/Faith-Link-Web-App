import { initialsFrom } from './sample-viewer'

describe('initialsFrom', () => {
  it('returns a question mark for an empty name', () => {
    expect(initialsFrom('  ')).toBe('?')
  })

  it('uses the first two letters for a one-word name', () => {
    expect(initialsFrom('Madonna')).toBe('MA')
  })

  it('uses the first and last initials for a full name', () => {
    expect(initialsFrom('David Michael Johnson')).toBe('DJ')
  })
})
