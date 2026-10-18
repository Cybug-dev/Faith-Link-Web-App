import { screen, within } from '@testing-library/react'
import { fakeSession } from '@/test/fake-auth-client'
import { LAZY_ROUTE } from '@/test/lazy-route'
import { renderRoute } from '@/test/render-route'
import { SAMPLE_LESSON_SERIES } from './lessons-sample-data'

async function openLessons() {
  const view = renderRoute('/lessons')
  await screen.findByRole('heading', { level: 1, name: 'Bible Learning' }, LAZY_ROUTE)
  return view
}

const series = () => within(screen.getByRole('list', { name: 'Lesson series' })).getAllByRole('listitem')

describe('Bible Learning page', () => {
  beforeAll(() => Promise.all([import('@/features/app-shell/app-shell'), import('./lessons-page')]), 60000)
  beforeEach(() => fakeSession.signIn())

  it('shows every lesson series with its progress', async () => {
    await openLessons()
    expect(series()).toHaveLength(SAMPLE_LESSON_SERIES.length)
    expect(screen.getByRole('button', { name: /The Life of Joseph.*25% complete/ })).toBeInTheDocument()
  })

  it('filters by category chip and marks the chosen chip', async () => {
    const { user } = await openLessons()
    const chip = within(screen.getByRole('group', { name: 'Category' })).getByRole('button', { name: 'Characters' })
    await user.click(chip)
    expect(chip).toHaveAttribute('aria-pressed', 'true')
    const expected = SAMPLE_LESSON_SERIES.filter((item) => item.categories.includes('Characters'))
    expect(series()).toHaveLength(expected.length)
  })

  it('filters by topic and by search text', async () => {
    const { user } = await openLessons()
    await user.selectOptions(screen.getByRole('combobox', { name: 'Topic' }), 'Faith')
    expect(series()).toHaveLength(SAMPLE_LESSON_SERIES.filter((item) => item.topic === 'Faith').length)
    await user.type(screen.getByRole('searchbox', { name: 'Search lessons' }), 'abraham')
    expect(series()).toHaveLength(1)
  })

  it('explains an empty result and clears the filters', async () => {
    const { user } = await openLessons()
    await user.type(screen.getByRole('searchbox', { name: 'Search lessons' }), 'zzzz')
    expect(screen.getByRole('status')).toHaveTextContent(/No lessons match/)
    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(series()).toHaveLength(SAMPLE_LESSON_SERIES.length)
  })

  it('opens coming soon for a series', async () => {
    const { user } = await openLessons()
    await user.click(screen.getByRole('button', { name: /Parables of Jesus/ }))
    expect(await screen.findByRole('heading', { name: 'Parables of Jesus is coming soon' })).toBeInTheDocument()
  })
})
