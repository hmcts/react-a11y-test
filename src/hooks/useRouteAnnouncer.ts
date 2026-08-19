import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { setFocus } from '@/utils/setFocus'

const SERVICE_NAME = 'GOV.UK Design System'
const NOT_FOUND_TITLE = 'Page not found'

// Gives Safari/VoiceOver time to settle the focus change before the live
// region mutates, rather than both firing in the same instant - VO on
// Safari can miss an aria-live announcement that lands at the same moment
// as a focus change.
const ANNOUNCEMENT_DELAY_MS = 200

export const useRouteAnnouncer = (routeTitles: Record<string, string>) => {
  const { pathname } = useLocation()
  const isFirstRender = useRef(true)

  useEffect(() => {
    const pageTitle = routeTitles[pathname] ?? NOT_FOUND_TITLE
    document.title = `${pageTitle} - ${SERVICE_NAME}`

    // Skip on the initial page load so we don't steal focus from where the
    // browser naturally puts it. On later route changes, moving focus
    // causes screen readers to announce the new page, which document.title
    // alone does not do.
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    // document.body isn't reliably exposed as a distinct, nameable focus
    // target in Safari's accessibility tree - VoiceOver falls back to
    // announcing the generic "web content" area instead of anything
    // specific. #app-container is an ordinary element we control, focused
    // the same way as everywhere else in the app (see setFocus.ts).
    const focusTarget = document.getElementById('app-container')
    if (focusTarget) {
      setFocus(focusTarget)
    }

    const announcer = document.getElementById('route-announcer')
    // Clear first so a repeat announcement of the same title still counts
    // as a genuine mutation for the live region to pick up.
    if (announcer) {
      announcer.textContent = ''
    }

    const timeoutId = window.setTimeout(() => {
      if (announcer) {
        announcer.textContent = `${pageTitle} loaded`
      }
    }, ANNOUNCEMENT_DELAY_MS)

    return () => window.clearTimeout(timeoutId)
  }, [pathname, routeTitles])
}
