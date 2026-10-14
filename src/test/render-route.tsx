import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { routes } from '@/app/router'

/** Renders the real route table at `entry` so tests exercise navigation too. */
export function renderRoute(entry: string | { pathname: string; state?: unknown }) {
  const router = createMemoryRouter(routes, { initialEntries: [entry] })
  const user = userEvent.setup()
  const utils = render(<RouterProvider router={router} />)
  return { user, router, ...utils }
}
