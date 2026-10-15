import {
  Award,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  CircleHelp,
  HandHeart,
  Heart,
  Sun,
  TrendingUp,
  Trophy,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { onboardingImages } from './onboarding-images'
import { CommunityVisual } from './visuals/community-visual'
import { HeroVisual } from './visuals/hero-visual'
import { LessonsVisual } from './visuals/lessons-visual'
import { QuizVisual } from './visuals/quiz-visual'

export type StepVisualProps = { onNext: () => void }

type Feature = { icon: LucideIcon; title: string; detail?: string }

export type OnboardingStep = {
  id: string
  title: string
  body: string
  /** Shown on desktop only; phones keep just the title, body and illustration. */
  features: Feature[]
  Visual: ComponentType<StepVisualProps>
  /** Phones: the illustration runs edge to edge and down to the bottom of the screen (step 1 photo). */
  bleed?: boolean
  /** Photos the illustration uses, preloaded one step ahead so slow connections don't show empty frames. */
  images: readonly string[]
}

const { hero, lessons, players, community } = onboardingImages

/** Non-empty by type, so a lookup can always fall back to the first step. */
export const ONBOARDING_STEPS: [OnboardingStep, ...OnboardingStep[]] = [
  {
    id: 'welcome',
    title: 'You’re in the right place',
    body: 'FaithLink is a community to learn, grow, and make a real impact, together in Christ. Meet believers your age, ask honest questions and build a faith that lasts.',
    features: [
      { icon: Users, title: 'Real connections', detail: 'with like-minded people' },
      { icon: BookOpen, title: 'Resources to strengthen', detail: 'your faith' },
      { icon: HandHeart, title: 'Opportunities to serve', detail: 'and make a difference' },
    ],
    Visual: HeroVisual,
    bleed: true,
    images: [hero],
  },
  {
    id: 'learn',
    title: 'Learn and grow in your faith',
    body: 'Explore Bible lessons, devotionals and practical resources designed to help you grow every day. Go at your own pace and pick up right where you left off.',
    features: [
      { icon: BookOpen, title: 'Bible lessons', detail: 'for every stage' },
      { icon: Sun, title: 'Daily devotionals', detail: 'to guide your walk' },
      { icon: CalendarCheck, title: 'Reading plans', detail: 'to build good habits' },
      { icon: TrendingUp, title: 'Track your progress', detail: 'and stay consistent' },
    ],
    Visual: LessonsVisual,
    images: Object.values(lessons),
  },
  {
    id: 'play',
    title: 'Play, learn and compete',
    body: 'Join quizzes and challenges, earn points and achievements, and see how you grow. Test what you’ve learned with friends and celebrate every step forward.',
    features: [
      { icon: CircleHelp, title: 'Live and practice quizzes', detail: 'for all ages' },
      { icon: Award, title: 'Earn points and badges' },
      { icon: Trophy, title: 'Leaderboards and friendly', detail: 'competition' },
      { icon: TrendingUp, title: 'Track your progress', detail: 'over time' },
    ],
    Visual: QuizVisual,
    images: players,
  },
  {
    id: 'connect',
    title: 'Connect and make an impact',
    body: 'Join groups, attend events, take part in activities and be part of a supportive community that shares your values. Serve together and put your faith into action.',
    features: [
      { icon: Users, title: 'Join church groups', detail: 'and communities' },
      { icon: CalendarDays, title: 'Discover and attend events' },
      { icon: Heart, title: 'Participate in activities', detail: 'and outreach' },
      { icon: HandHeart, title: 'Make a difference', detail: 'through service' },
    ],
    Visual: CommunityVisual,
    images: Object.values(community),
  },
]
