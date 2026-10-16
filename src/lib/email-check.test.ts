import { isStrictEmail, suggestEmail } from './email-check'

describe('isStrictEmail', () => {
  it.each(['alex@gmail.com', 'mary-jane.o+church@mail.example.org', 'a1@b.co'])('accepts %s', (value) => {
    expect(isStrictEmail(value)).toBe(true)
  })

  it.each(['alex..b@gmail.com', '.alex@gmail.com', 'alex.@gmail.com', 'alex@gmail', 'alex@gmail.c', 'alex@-gmail.com', 'al ex@gmail.com', 'alex@gmail.c0m', 'a"b@gmail.com'])(
    'rejects %s',
    (value) => {
      expect(isStrictEmail(value)).toBe(false)
    },
  )
})

describe('suggestEmail', () => {
  it.each([
    ['lordara@gmai.com', 'lordara@gmail.com'],
    ['alex@gmial.com', 'alex@gmail.com'],
    ['alex@gmail.con', 'alex@gmail.com'],
    ['alex@hotmial.com', 'alex@hotmail.com'],
    ['alex@yaho.com', 'alex@yahoo.com'],
    ['alex@outlok.com', 'alex@outlook.com'],
  ])('suggests a fix for %s', (typo, fixed) => {
    expect(suggestEmail(typo)).toBe(fixed)
  })

  it.each(['alex@gmail.com', 'alex@mychurch.org', 'alex@university.edu'])('leaves %s alone', (value) => {
    expect(suggestEmail(value)).toBeNull()
  })
})
