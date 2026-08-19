import React from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { PhaseBanner } from './PhaseBanner'
import { SkipLink } from './SkipLink'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-container" id="app-container">
      <SkipLink>Skip to main content</SkipLink>
      {/* Persistent, visually-hidden live region announcing route changes.
          Kept separate from the focus target above (see
          useRouteAnnouncer.ts) so the focus event and the live-region
          mutation don't compete for the same accessibility node - the
          same reasoning as ErrorSummary.tsx's nested role="alert". */}
      <div aria-live="polite" id="route-announcer" className="govuk-visually-hidden" />
      <Header />
      <div className="govuk-width-container">
        <PhaseBanner />
        <main className="govuk-main-wrapper app-main" id="main-content" role="main">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}
