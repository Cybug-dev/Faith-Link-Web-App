import type { Church } from './church-types'

// Mock data until the church API exists: swap the contents, keep the shapes.

function unsplash(id: string, width: number): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70&w=${width}`
}

// Square, face-centred crops for the round avatars.
function portrait(id: string): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces&q=70&w=160&h=160`
}

const COVER_PHOTO = '1477672680933-0287a151330e'

export const SAMPLE_CHURCH: Church = {
  name: 'Prayer Charge Teens Church',
  tagline: 'Raising a generation that knows God',
  about:
    'Prayer Charge Teens Church is a community of young people passionate about God, Bible truth, and making a difference in our world. We learn, pray, grow and serve together.',
  coverVerse: { text: 'Let your light so shine before others.', reference: 'Matthew 5:16' },
  aboutVerse: { text: 'Ye are the light of the world.', reference: 'Matthew 5:14' },
  cover: {
    src: unsplash(COVER_PHOTO, 1200),
    srcSet: [640, 1200, 1800].map((w) => `${unsplash(COVER_PHOTO, w)} ${w}w`).join(', '),
    alt: 'A church building with a cross against a blue sky',
  },
  stats: [
    { id: 'members', value: '128', label: 'Members' },
    { id: 'leaders', value: '12', label: 'Leaders' },
    { id: 'groups', value: '6', label: 'Active Groups' },
    { id: 'founded', value: 'Est. 2022', label: 'Lagos, Nigeria' },
  ],
  leaders: [
    { id: 'l1', name: 'Pastor Daniel', role: 'Church Pastor', photo: portrait('1531384441138-2736e62e0919') },
    { id: 'l2', name: 'Sister Grace', role: 'Youth Leader', photo: portrait('1531123897727-8f129e1688ce') },
    { id: 'l3', name: 'Bro. James', role: 'Assistant Leader', photo: portrait('1522529599102-193c0d76b5b6') },
    { id: 'l4', name: 'Sister Ruth', role: 'Teens Coordinator', photo: portrait('1611432579699-484f7990b127') },
    { id: 'l5', name: 'Bro. Samuel', role: 'Music Director', photo: portrait('1506277886164-e25aa3f4ef7f') },
  ],
}
