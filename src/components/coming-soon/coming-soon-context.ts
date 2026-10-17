import { createContext, useContext } from 'react'

/** Opens the "coming soon" popup for a feature that is visible but not built yet. */
export type ShowComingSoon = (featureName: string) => void

export const ComingSoonContext = createContext<ShowComingSoon>(() => {})

/** Call the returned function with the feature's name, e.g. `showComingSoon('Live Games')`. */
export function useComingSoon(): ShowComingSoon {
  return useContext(ComingSoonContext)
}
