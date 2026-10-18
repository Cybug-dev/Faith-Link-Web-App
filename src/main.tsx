import '@fontsource-variable/plus-jakarta-sans'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router'
import { routes } from '@/app/router'
import { preloadOnboarding } from '@/features/onboarding/preload-onboarding'
import './index.css'

const root = document.getElementById('root')
if (!root) throw new Error('Root element #root not found')

// Created here, not in router.tsx: creating it runs the route loaders (session check), and tests
// import the route table without wanting that.
const router = createBrowserRouter(routes)

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

preloadOnboarding()
