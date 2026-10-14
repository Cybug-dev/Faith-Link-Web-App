import { useEffect } from 'react'

const APP_NAME = 'FaithLink'

/** Sets the tab title per screen so screen readers announce where the user is. */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = `${title} | ${APP_NAME}`
  }, [title])
}
