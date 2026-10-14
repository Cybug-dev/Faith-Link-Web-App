import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'

// jsdom doesn't implement elementFromPoint; input-otp calls it to place the caret.
document.elementFromPoint ??= () => null

afterEach(() => {
  sessionStorage.clear()
})
