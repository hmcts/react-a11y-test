import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ErrorMessage, ErrorSummary } from '@/components'
import { setFocus } from '@/utils/setFocus'
import { courtData } from '@/data/courts'

export const JourneySearchByName: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const submittedQuery = searchParams.get('q') ?? ''

  const [searchTerm, setSearchTerm] = useState<string>(submittedQuery)
  const [validationError, setValidationError] = useState<string>('')
  const navigate = useNavigate()
  const errorSummaryRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    // Focus on error summary when validation error occurs
    if (validationError && errorSummaryRef.current) {
      setFocus(errorSummaryRef.current)
    }
  }, [validationError])

  useEffect(() => {
    // Skip on initial mount (e.g. a shared/bookmarked link that already has
    // ?q= set) - only move focus when a submission changes the results
    // while the page is already open, so screen reader and keyboard users
    // get an explicit signal that new content has loaded.
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (submittedQuery && resultsRef.current) {
      setFocus(resultsRef.current)
    }
  }, [submittedQuery])

  const filteredResults = submittedQuery
    ? Object.values(courtData).filter((court) =>
        court.name.toLowerCase().includes(submittedQuery.toLowerCase())
      )
    : []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation: Check if search term is empty
    if (!searchTerm.trim()) {
      setValidationError('Enter a court name, address, town or city')
      return
    }

    // Clear any previous errors
    setValidationError('')

    // Results only update on explicit submission (never as-you-type), and
    // are reflected in the query string so the results page is shareable
    // and works with the browser's back/forward buttons.
    setSearchParams({ q: searchTerm.trim() })
  }

  const handleInputChange = (value: string) => {
    setSearchTerm(value)
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError('')
    }
  }

  const handleResultClick = (courtId: string) => {
    // Passed via router state (not the court page's URL) so the court page
    // can rebuild a back link to this exact search without us needing to
    // trust/re-parse a search term embedded in its own URL.
    navigate(`/court/${courtId}`, { state: { searchQuery: submittedQuery } })
  }

  return (
    <>
      {/* /journey/search-by-name currently only has one way in - answering
          "yes" on /journey/search - so the back link can carry that known
          answer directly, letting that page restore the radio selection
          without a general cross-page state store. */}
      <Link to="/journey/search?know-name=yes" className="govuk-back-link">
        Back
      </Link>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          {validationError && (
            <ErrorSummary
              ref={errorSummaryRef}
              title="There is a problem"
              errorList={[
                {
                  text: validationError,
                  href: '#court-search'
                }
              ]}
            />
          )}

          <h1 className="govuk-heading-xl">
            What is the name or address of the court or tribunal?
          </h1>

          <p className="govuk-body">
            The name of the court or tribunal can be found on a letter, email or text from us.
          </p>

          <form onSubmit={handleSubmit}>
            <div className={`govuk-form-group ${validationError ? 'govuk-form-group--error' : ''}`}>
              <label className="govuk-label" htmlFor="court-search">
                Enter a court name, address, town or city
              </label>
              <div id="court-search-hint" className="govuk-hint">
                For example, 'Manchester Civil Justice Centre' or 'SW1H 9AJ'
              </div>

              {validationError && (
                <ErrorMessage id="court-search-error">
                  {validationError}
                </ErrorMessage>
              )}

              <input
                className={`govuk-input ${validationError ? 'govuk-input--error' : ''}`}
                id="court-search"
                name="court-search"
                type="text"
                value={searchTerm}
                onChange={(e) => handleInputChange(e.target.value)}
                aria-describedby={`court-search-hint${validationError ? ' court-search-error' : ''}`}
              />
            </div>

            <button
              className="govuk-button"
              data-module="govuk-button"
              type="submit"
            >
              Continue
            </button>
          </form>
        </div>
      </div>

      {submittedQuery && (
        <div className="govuk-grid-row govuk-!-margin-top-6">
          <div className="govuk-grid-column-two-thirds">
            {/* The outer div is the focus target (transient tabindex via
                setFocus, see src/utils/setFocus.ts). role="status" lives on
                the nested child, not the focus target, so its full content
                (heading, message, results) is announced as one unit rather
                than just whichever element happens to hold focus - and to
                avoid combining a live region with the focus target on the
                same node (see ErrorSummary.tsx for the same reasoning). */}
            <div ref={resultsRef} className="journey-search-results__container">
              <div role="status">
                <h2 className="govuk-heading-l">
                  Search results
                </h2>

                {filteredResults.length > 0 ? (
                  <>
                    <p className="govuk-body">
                      We found courts or tribunals matching your search for '{submittedQuery}'.
                    </p>
                    <p className="govuk-body">
                      Most relevant results displayed.
                    </p>

                    <hr className="govuk-section-break govuk-section-break--visible" />

                    <div className="journey-search-results">
                      <ul className="govuk-list">
                        {filteredResults.map((court) => (
                          <li key={court.id} className="govuk-!-margin-bottom-2">
                            <a
                              href={`/court/${court.id}`}
                              className="govuk-link govuk-link--no-visited-state"
                              onClick={(e) => {
                                e.preventDefault()
                                handleResultClick(court.id)
                              }}
                            >
                              {court.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="govuk-body">
                      No courts or tribunals found matching your search for '{submittedQuery}'.
                    </p>
                    <p className="govuk-body">
                      Try searching for a different court name, address, town or city.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
