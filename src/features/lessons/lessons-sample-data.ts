import type { LessonSeries } from './lessons-types'

// Mock data until the lessons API exists: swap the contents, keep the shapes.

const WIDTHS = [400, 640, 960]

// `crop` picks the part of the photo kept in the 16:9 frame (imgix focal point).
function photo(id: string, alt: string, crop = 'crop=entropy'): LessonSeries['image'] {
  const url = (w: number) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&${crop}&q=70&w=${w}&h=${Math.round((w * 9) / 16)}`
  return { src: url(640), srcSet: WIDTHS.map((w) => `${url(w)} ${w}w`).join(', '), alt }
}

export const SAMPLE_LESSON_SERIES: readonly LessonSeries[] = [
  {
    id: 'joseph',
    title: 'The Life of Joseph',
    subtitle: 'Trusting God in Every Season',
    lessonCount: 8,
    lessonsDone: 2,
    categories: ['Old Testament', 'Characters'],
    topic: 'Trust',
    image: photo('1677697752978-2741925ea212', 'A lone traveller crossing wide orange sand dunes'),
  },
  {
    id: 'acts',
    title: 'The Book of Acts',
    subtitle: 'The Early Church in Action',
    lessonCount: 10,
    lessonsDone: 0,
    categories: ['New Testament'],
    topic: 'Church',
    image: photo('1552832230-c0197dd311b5', 'The Colosseum in Rome at dusk'),
  },
  {
    id: 'faith-daily',
    title: 'Faith in Daily Life',
    subtitle: 'Practical Christian Living',
    lessonCount: 6,
    lessonsDone: 0,
    categories: ['Life Lessons'],
    topic: 'Faith',
    image: photo('1506905925346-21bda4d32df4', 'Mountain peaks above the clouds at sunrise'),
  },
  {
    id: 'armour',
    title: 'The Armour of God',
    subtitle: 'Standing Strong',
    lessonCount: 5,
    lessonsDone: 0,
    categories: ['New Testament', 'Life Lessons'],
    topic: 'Courage',
    image: photo(
      '1768466588276-7dcf1c3472fb',
      'A shield, helmet and sword resting on the grass',
      'crop=focalpoint&fp-x=0.55&fp-y=0.72',
    ),
  },
  {
    id: 'women',
    title: 'Women in the Bible',
    subtitle: 'Lessons from Their Lives',
    lessonCount: 7,
    lessonsDone: 0,
    categories: ['Characters'],
    topic: 'Courage',
    image: photo('1610390281226-5096e58d39b0', 'The silhouette of a woman against warm light'),
  },
  {
    id: 'parables',
    title: 'Parables of Jesus',
    subtitle: 'Timeless Truths',
    lessonCount: 8,
    lessonsDone: 0,
    categories: ['New Testament', 'Life Lessons'],
    topic: 'Wisdom',
    image: photo('1500382017468-9049fed747ef', 'A wheat field at sunset'),
  },
  {
    id: 'abraham',
    title: 'Abraham, Father of Faith',
    subtitle: 'Trusting God’s Promises',
    lessonCount: 6,
    lessonsDone: 0,
    categories: ['Old Testament', 'Characters'],
    topic: 'Faith',
    image: photo('1519681393784-d120267933ba', 'A sky full of stars over snowy mountains'),
  },
  {
    id: 'psalms',
    title: 'Psalms of Praise',
    subtitle: 'Songs for Every Season',
    lessonCount: 9,
    lessonsDone: 0,
    categories: ['Old Testament'],
    topic: 'Worship',
    image: photo('1490730141103-6cac27aaab94', 'A person with open arms at sunset by the sea'),
  },
]
