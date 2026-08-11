import React from 'react'
import { Link } from 'react-router-dom'

export const Journey: React.FC = () => {
  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-xl">
            Find a court or tribunal
          </h1>
          
          <p className="govuk-body">
            Use this service to find a court or tribunal in England and Wales.
          </p>
          
          <p className="govuk-body">
            You can search for:
          </p>
          
          <ul className="govuk-list govuk-list--bullet">
            <li>address</li>
            <li>contact details</li>
            <li>opening times</li>
            <li>building information e.g. disabled access or parking</li>
            <li>to help me get an update</li>
          </ul>
          
          <div className="govuk-!-margin-top-6">
            <Link 
              to="/journey/search" 
              className="govuk-button govuk-button--start"
              role="button"
              aria-label="Start Find a Court or Tribunal Service journey"
            >
              Start journey
              <svg 
                className="govuk-button__start-icon" 
                xmlns="http://www.w3.org/2000/svg" 
                width="17.5" 
                height="19" 
                viewBox="0 0 33 40" 
                aria-hidden="true" 
                focusable="false"
              >
                <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">Before you search</h2>
          
          <p className="govuk-body">
            The online service is also available in Welsh (Cymraeg).
          </p>
          
          <p className="govuk-body">
            You cannot use this service if you live in Northern Ireland. Contact the{' '}
            <a 
              href="https://www.nicourts.gov.uk/" 
              className="govuk-link" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Northern Ireland Courts and Tribunals (opens in new tab)
            </a>
            {' '}for help.
          </p>
          
          <p className="govuk-body">
            You cannot use this service to pay court fees.
          </p>
          
          <p className="govuk-body">
            This service is limited in Scotland to:
          </p>
          
          <ul className="govuk-list govuk-list--bullet">
            <li>Immigration appeals</li>
            <li>Benefit appeals</li>
            <li>Employment claims appeals</li>
          </ul>
          
          <p className="govuk-body">
            Contact the{' '}
            <a 
              href="https://www.scotcourts.gov.uk/" 
              className="govuk-link" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Scottish Courts and Tribunals (opens in new tab)
            </a>
            {' '}for other services.
          </p>
        </div>
      </div>
    </>
  )
}
