import { act, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ProgressCard } from './progress-card'

let reveal: (() => void) | undefined

class FakeIntersectionObserver {
  private callback: IntersectionObserverCallback
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }
  observe() {
    reveal = () => this.callback([{ isIntersecting: true } as IntersectionObserverEntry], this as never)
  }
  disconnect() {}
}

function shownPercent(): string {
  return document.querySelector('.ring-percent')?.textContent ?? ''
}

function renderCard() {
  render(
    <MemoryRouter>
      <ProgressCard overview={{ percent: 72, to: '/progress' }} stats={[]} badges={[]} />
    </MemoryRouter>,
  )
}

describe('ProgressCard ring', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] })
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
    vi.stubGlobal('matchMedia', () => ({ matches: false }))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    reveal = undefined
  })

  it('waits at 0% until the card is in view, then counts up to the real value', () => {
    renderCard()
    expect(shownPercent()).toBe('0%')

    act(() => reveal?.())
    act(() => vi.advanceTimersByTime(500))
    const midway = Number.parseInt(shownPercent(), 10)
    expect(midway).toBeGreaterThan(0)
    expect(midway).toBeLessThan(72)

    act(() => vi.advanceTimersByTime(1500))
    expect(shownPercent()).toBe('72%')
  })

  it('shows the final value straight away when the user prefers reduced motion', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }))
    renderCard()
    expect(shownPercent()).toBe('72%')
  })
})
