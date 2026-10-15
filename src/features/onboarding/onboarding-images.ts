/**
 * Onboarding photos in public/images/onboarding. AI-generated in Stitch as
 * placeholders (like the auth photos): replace with licensed photography before launch.
 */
const dir = '/images/onboarding'

export const onboardingImages = {
  hero: `${dir}/hero.webp`,
  lessons: {
    lifeOfJesus: `${dir}/lesson-life-of-jesus.webp`,
    faithDaily: `${dir}/lesson-faith-daily.webp`,
    bibleBasics: `${dir}/lesson-bible-basics.webp`,
    leadership: `${dir}/lesson-leadership.webp`,
  },
  players: [`${dir}/player-1.webp`, `${dir}/player-2.webp`, `${dir}/player-3.webp`, `${dir}/player-4.webp`],
  community: {
    groups: `${dir}/community-groups.webp`,
    events: `${dir}/community-events.webp`,
    activities: `${dir}/community-activities.webp`,
    serve: `${dir}/community-serve.webp`,
  },
} as const
