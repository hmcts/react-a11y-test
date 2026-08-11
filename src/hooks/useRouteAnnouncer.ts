import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const SERVICE_NAME = 'GOV.UK Design System'
const NOT_FOUND_TITLE = 'Page not found'

export const useRouteAnnouncer = (routeTitles: Record<string, string>) => {
  const { pathname } = useLocation()
  const isFirstRender = useRef(true)

  useEffect(() => {
    const pageTitle = routeTitles[pathname] ?? NOT_FOUND_TITLE
    document.title = `${pageTitle} - ${SERVICE_NAME}`

    // Skip on the initial page load so we don't steal focus from where the
    // browser naturally puts it. On later route changes, moving focus to
    // the top of the document (mirroring a fresh page load in a
    // server-rendered GOV.UK service) causes screen readers to announce
    // the new page, which document.title alone does not do.
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    document.body.focus()
  }, [pathname, routeTitles])
}
