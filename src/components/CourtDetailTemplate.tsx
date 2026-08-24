import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CourtData } from '@/data/courts/courtData'

interface CourtDetailTemplateProps {
  court: CourtData
}

export const CourtDetailTemplate: React.FC<CourtDetailTemplateProps> = ({ court }) => {
  const location = useLocation()
  const searchQuery = (location.state as { searchQuery?: string } | null)?.searchQuery

  // Only ever used as a query *value*, appended via URLSearchParams (which
  // percent-encodes it) - never as the link's scheme/path - so it can't be
  // used to inject a javascript: URI or otherwise hijack the link, however
  // it's typed on the way in.
  const backLinkTo = searchQuery
    ? `/journey/search-by-name?${new URLSearchParams({ q: searchQuery }).toString()}`
    : '/journey/search-by-name'

  return (
    <>
      <Link to={backLinkTo} className="govuk-back-link">
        Back to search results
      </Link>

      <div className="govuk-grid-row court-tribunal-details">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-l">
            {court.name}
          </h1>
          
          <h2 className="govuk-heading-l">
            Visit or contact us:
          </h2>
          
          <h3 className="govuk-heading-m">
            Address
          </h3>
          
          <p className="govuk-body-m address">
            {court.address.building}<br />
            {court.address.street}<br />
            {court.address.city}<br />
            {court.address.postcode}
          </p>

          <p className="govuk-body-m" id="direction-map">
            <a className="govuk-link" rel="noreferrer noopener" target="_blank" href={`https://maps.google.com/maps?q=${court.coordinates.lat},${court.coordinates.lng}`}>
              Get directions (opens in new tab)
            </a>
          </p>
          <p className="govuk-body-m">
            <a className="govuk-link" rel="noreferrer noopener" target="_blank" href="https://www.gov.uk/guidance/what-to-expect-coming-to-a-court-or-tribunal">
              What to expect coming to a court or tribunal (opens in new tab)
            </a>
          </p>

          <hr className="govuk-section-break govuk-section-break--visible" />

          <div id="additional-info">
            <h3 className="govuk-heading-m">
              Additional information
            </h3>
            <div className="govuk-body-m">
              <p>
                <a href="https://www.gov.uk/government/news/scammers-using-hmcts-telephone-numbers" target="_blank" rel="noopener" className="govuk-link">
                  Scammers are mimicking genuine HMCTS phone numbers and email addresses
                  <span className="govuk-visually-hidden"> - opens in a new tab</span>
                </a>
                . They may demand payment and claim to be from HMRC or enforcement. If you're unsure, do not pay anything and report the scam to{' '}
                <a href="https://www.actionfraud.police.uk/" target="_blank" rel="noopener" className="govuk-link">
                  Action Fraud
                  <span className="govuk-visually-hidden"> - opens in a new tab</span>
                </a>
                .
              </p>
            </div>
          </div>

          <hr className="govuk-section-break govuk-section-break--visible" />

          <div id="opening-times">
            <h3 className="govuk-heading-m">
              Opening times
            </h3>
            <dl className="govuk-summary-list">
              <div className="govuk-summary-list__row">
                <dd className="govuk-summary-list__key">
                  Court open
                </dd>
                <dd className="govuk-summary-list__value">
                  <p className="govuk-body-m">
                    {court.openingTimes.courtOpen}
                  </p>
                </dd>
              </div>
              <div className="govuk-summary-list__row">
                <dd className="govuk-summary-list__key">
                  Counter open
                </dd>
                <dd className="govuk-summary-list__value">
                  <p className="govuk-body-m">
                    {court.openingTimes.counterOpen}
                  </p>
                </dd>
              </div>
            </dl>
          </div>

          <hr className="govuk-section-break govuk-section-break--visible" />

          <div id="emails">
            <h3 className="govuk-heading-m">
              Email
            </h3>
            <dl className="govuk-summary-list">
              {court.emails.map((email, index) => (
                <div key={index} className="govuk-summary-list__row">
                  <dd className="govuk-summary-list__key">
                    {email.type}
                  </dd>
                  <dd className="govuk-summary-list__value">
                    <a className="govuk-link" href={`mailto:${email.address}`}>
                      {email.address}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <hr className="govuk-section-break govuk-section-break--visible" />

          <div id="contacts">
            <h3 className="govuk-heading-m">
              Telephone
            </h3>
            <dl className="govuk-summary-list">
              {court.telephones.map((phone, index) => (
                <div key={index} className="govuk-summary-list__row">
                  <dd className="govuk-summary-list__key">
                    {phone.type}
                  </dd>
                  <dd className="govuk-summary-list__value">
                    <a className="govuk-link" href={`tel:${phone.number}`}>
                      {phone.number}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <hr className="govuk-section-break govuk-section-break--visible" />

          <div id="building-facilities">
            <h3 className="govuk-heading-m">
              Building facilities
            </h3>
            <p className="govuk-body-m">
              If you have a disability and need help coming to a hearing, please contact {court.telephones[0]?.number}.
            </p>

            <dl className="govuk-summary-list">
              {court.facilities.map((facility, index) => (
                <div key={index} className="govuk-summary-list__row">
                  <dd className="govuk-summary-list__key">
                    <h4 className="govuk-heading-s">
                      {facility.title}
                    </h4>
                  </dd>
                  <dd className="govuk-summary-list__value">
                    <p className="govuk-body-m">
                      {facility.description}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>

            <h4 className="govuk-heading-s">
              Translators or Interpreters
            </h4>
            <p className="govuk-body-m">
              <a rel="noreferrer noopener" target="_blank" href="https://www.gov.uk/get-interpreter-at-court-or-tribunal" className="govuk-link">
                Get an interpreter at a court or tribunal. (opens in new tab)
              </a>
            </p>
          </div>
        </div>

        <div className="govuk-grid-column-one-third side-content" style={{ marginTop: '0' }}>
          <div className="govuk-grid-row">
            <img src={court.imagePath} alt="" />
            <p className="govuk-body-s">
              {court.name}
            </p>
          </div>

          <hr className="govuk-section-break govuk-section-break--visible" />

          <div id="areas-of-law">
            <h3 className="govuk-heading-m">
              This location handles
            </h3>
            <ul className="govuk-list">
              {court.caseTypes.map((caseType, index) => (
                <li key={index}>
                  <p>{caseType}</p>
                </li>
              ))}
            </ul>
          </div>

          <hr className="govuk-section-break govuk-section-break--visible" />

          <div>
            <h3 className="govuk-heading-m">
              Make a complaint
            </h3>
            <p className="govuk-body-m">
              <a className="govuk-link" rel="noreferrer noopener" target="_blank" href="https://www.gov.uk/government/organisations/hm-courts-and-tribunals-service/about/complaints-procedure">
                Contact us to make a complaint
              </a>
              <span className="govuk-visually-hidden"> (opens in new tab)</span>
            </p>
          </div>

          <hr className="govuk-section-break govuk-section-break--visible" />

          <div id="location-codes">
            <h3 className="govuk-heading-m">
              Court codes for legal professionals
            </h3>
            <p className="govuk-body-m">
              Crown Court location code: <span className="govuk-body-m">{court.courtCodes.crownCourtCode}</span>
            </p>
            <p className="govuk-body-m dx-number">
              DX: <span className="govuk-body-m">{court.courtCodes.dx}</span>
            </p>
          </div>

          <hr className="govuk-section-break govuk-section-break--visible" />

          <div id="access-scheme">
            <h3 className="govuk-heading-m">
              Professional users' court and tribunal access scheme
            </h3>
            <p className="govuk-body-m">
              This location participates in this scheme
            </p>
            <p>
              <a className="govuk-link govuk-body-m" rel="noreferrer noopener" target="_blank" href="https://www.gov.uk/guidance/professional-users-court-and-tribunal-access-scheme">
                Register for the scheme
              </a>
              <span className="govuk-visually-hidden"> (opens in new tab)</span>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
