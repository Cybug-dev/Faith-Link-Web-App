import { createAccountSchema, emailErrorLabel, signInSchema } from './schemas'

const base = { email: 'alex@example.com', password: 'correct-horse7!', acceptedTerms: true }
const nameError = (name: string) =>
  createAccountSchema.safeParse({ ...base, name }).error?.issues.find((i) => i.path[0] === 'name')?.message

const FIRST_LAST = 'Enter your first and last name, each at least 2 letters.'
const LETTERS_ONLY = 'Use letters only, with a single space, hyphen or apostrophe between names.'

describe('full name rule', () => {
  it.each(['Alex Turner', 'Li Na', 'Mary-Jane O’Neil', "D'Angelo Smith", 'John R. Smith', 'Zoë Ọkafọ́r'])(
    'accepts %s',
    (name) => expect(nameError(name)).toBeUndefined(),
  )

  it('trims surrounding spaces before checking', () => {
    expect(nameError('  Alex Turner  ')).toBeUndefined()
  })

  it.each([
    ['', 'Enter your full name.'],
    ['Alex', FIRST_LAST],
    ['A Smith', FIRST_LAST],
    ['Alex T', FIRST_LAST],
    ['xX_gamer99', LETTERS_ONLY],
    ['Alex  Turner', LETTERS_ONLY],
    ['Alex 🙏', LETTERS_ONLY],
    ['-Alex Turner', LETTERS_ONLY],
    ['Alex--Turner', LETTERS_ONLY],
    ['a'.repeat(101), 'Use 100 characters or fewer.'],
  ])('rejects %j', (name, message) => expect(nameError(name)).toBe(message))
})

describe('email "Invalid syntax" tag', () => {
  const emailIssue = (email: string) =>
    signInSchema.safeParse({ email, password: 'x', rememberMe: true }).error?.issues.find((i) => i.path[0] === 'email')

  it('tags a malformed email', () => {
    expect(emailErrorLabel(emailIssue('alex@gmail')?.code)).toBe('Invalid syntax')
  })

  it('does not tag an empty email, which is a "required" problem', () => {
    expect(emailErrorLabel(emailIssue('')?.code)).toBeUndefined()
  })
})
