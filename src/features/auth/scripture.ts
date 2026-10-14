/**
 * Scripture and photography used on the auth screens. King James Version (public domain
 * outside the UK, where it is under Crown patent); change a translation here and nowhere else.
 * Photos live in public/images and come from the Stitch auth designs.
 */
export type Scripture = { text: string; reference: string; translation: string }

export const SIGN_IN_SCRIPTURE: Scripture = {
  text: 'Let no man despise thy youth; but be thou an example of the believers, in word, in conversation, in charity, in spirit, in faith, in purity.',
  reference: '1 Timothy 4:12',
  translation: 'KJV',
}

export const CREATE_ACCOUNT_SCRIPTURE: Scripture = {
  text: 'Being confident of this very thing, that he which hath begun a good work in you will perform it until the day of Jesus Christ.',
  reference: 'Philippians 1:6',
  translation: 'KJV',
}

/** Shortened verse on the create-account photo banner (phone and tablet), as in the Stitch design. */
export const CREATE_ACCOUNT_BANNER_SCRIPTURE: Scripture = {
  ...SIGN_IN_SCRIPTURE,
  text: 'Let no man despise thy youth; but be thou an example of the believers…',
}

/** `position` keeps the people in frame when the landscape photo is cropped to a tall panel. */
export type AuthImage = { src: string; position: string }

export const authImages = {
  signIn: { src: '/images/auth-sign-in.jpg', position: 'object-right' },
  createAccount: { src: '/images/auth-create-account.jpg', position: 'object-center' },
} as const satisfies Record<string, AuthImage>

export const BRAND_LINE = 'A generation rooted in Christ'
export const BRAND_EYEBROW = 'Faith • Fellowship • Purpose'
export const BANNER_TAG = 'FaithLink Fellowship'
