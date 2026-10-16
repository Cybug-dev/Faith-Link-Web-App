import '@fontsource-variable/caveat'
import { CalendarDays, HandHeart, Heart, Users, type LucideIcon } from 'lucide-react'
import { FadeImage } from '../fade-image'
import { onboardingImages } from '../onboarding-images'
import './community-visual.scss'

const { community: img } = onboardingImages

type Tile = { label: string; icon: LucideIcon; src: string }

/** Two columns, staggered as in the phone design: tall/short on the left, short/tall on the right. */
const COLUMNS: Tile[][] = [
  [
    { label: 'Groups', icon: Users, src: img.groups },
    { label: 'Activities', icon: Heart, src: img.activities },
  ],
  [
    { label: 'Events', icon: CalendarDays, src: img.events },
    { label: 'Serve', icon: HandHeart, src: img.serve },
  ],
]

/** Step 4: photos on a gently curved (concave) panel, the phone design used on every screen size. */
export function CommunityVisual() {
  return (
    <div className="onboarding-community">
      <div className="onboarding-community__grid" aria-hidden>
        {COLUMNS.map((column, c) => (
          <div key={c} className="onboarding-community__column">
            {column.map(({ label, icon: Icon, src }) => (
              <div key={label} className="onboarding-community__tile">
                <FadeImage className="onboarding-community__photo" src={src} alt="" />
                <span className="onboarding-community__chip">
                  <Icon aria-hidden className="onboarding-community__chip-icon" />
                  {label}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="onboarding-community__tagline">
        <Heart aria-hidden className="onboarding-community__tagline-icon" />
        <span className="onboarding-community__tagline-text">
          People. Growth. Purpose.
          <svg aria-hidden viewBox="0 0 120 12" preserveAspectRatio="none" className="onboarding-community__swoosh">
            <path d="M2 10C35 3 80 1 118 4" />
          </svg>
        </span>
      </p>
    </div>
  )
}
