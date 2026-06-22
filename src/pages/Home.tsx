import React from 'react'
import { JourneyStarter } from '@/components/JourneyStarter'

export const Home: React.FC = () => {
  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-xl">
            React Single-page Application (SPA) Proof of Concept
          </h1>
          <p className="govuk-body-l">
            Welcome to this React single-page application built with the GOV.UK and MoJ Design Systems. The FaCT journey starts below.
          </p>
        </div>
      </div>

      <JourneyStarter />
    </>
  )
}
