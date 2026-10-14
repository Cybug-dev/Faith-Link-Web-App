/**
 * Scripture and photography used on the auth screens. World English Bible
 * (public domain); change a translation here and nowhere else.
 * Photos live in public/images and come from the Stitch auth designs.
 */
export type Scripture = { text: string; reference: string; translation: string }

export const SIGN_IN_SCRIPTURE: Scripture = {
  text: 'Let no man despise your youth; but be an example to those who believe, in word, in your way of life, in love, in faith, and in purity.',
  reference: '1 Timothy 4:12',
  translation: 'WEB',
}

export const CREATE_ACCOUNT_SCRIPTURE: Scripture = {
  text: 'Being confident of this very thing, that he who began a good work in you will complete it until the day of Jesus Christ.',
  reference: 'Philippians 1:6',
  translation: 'WEB',
}

/** Verse on the create-account photo banner (phone and tablet), as in the Stitch design. */
export const CREATE_ACCOUNT_BANNER_SCRIPTURE = SIGN_IN_SCRIPTURE

/** `position` keeps the people in frame when the landscape photo is cropped to a tall panel. */
export type AuthImage = { src: string; position: string }

export const authImages = {
  signIn: { src: '/images/auth-sign-in.jpg', position: 'object-right' },
  createAccount: { src: '/images/auth-create-account.jpg', position: 'object-center' },
} as const satisfies Record<string, AuthImage>

export const BRAND_LINE = 'A generation rooted in Christ'
