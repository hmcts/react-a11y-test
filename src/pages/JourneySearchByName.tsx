import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ErrorMessage, ErrorSummary } from '@/components'
import { setFocus } from '@/utils/setFocus'

export const JourneySearchByName: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [validationError, setValidationError] = useState<string>('')
  const [hasSearched, setHasSearched] = useState<boolean>(false)
  const navigate = useNavigate()
  const errorSummaryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Focus on error summary when validation error occurs
    if (validationError && errorSummaryRef.current) {
      setFocus(errorSummaryRef.current)
    }
  }, [validationError])

  // Mock search results - in a real app this would come from an API
  const allResults = [
    { id: 1, name: 'Manchester Crown Court (Minshull St)', url: '/court/manchester-crown-court', keywords: ['manchester'] },
    { id: 2, name: 'Birmingham Crown Court', url: '/court/birmingham-crown-court', keywords: ['birmingham'] },
    { id: 3, name: 'Inner London Crown Court', url: '/court/inner-london-crown-court', keywords: ['london', 'inner london'] }
  ]

  // Filter results based on search term
  const getFilteredResults = () => {
    if (!searchTerm.trim()) {
      return []
    }

    const searchLower = searchTerm.toLowerCase().trim()
    return allResults.filter(result => 
      result.keywords.some(keyword => keyword.includes(searchLower)) ||
      result.name.toLowerCase().includes(searchLower)
    )
  }

  const filteredResults = getFilteredResults()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation: Check if search term is empty
    if (!searchTerm.trim()) {
      setValidationError('Enter a court name, address, town or city')
      setHasSearched(false)
      return
    }

    // Clear any previous errors
    setValidationError('')
    setHasSearched(true)
    console.log('Searching for:', searchTerm)
  }

  const handleInputChange = (value: string) => {
    setSearchTerm(value)
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError('')
    }
  }

  const handleResultClick = (courtId: number) => {
    // Navigate to court details page
    if (courtId === 1) {
      navigate('/court/manchester-crown-court')
    } else if (courtId === 2) {
      navigate('/court/birmingham-crown-court')
    } else if (courtId === 3) {
      navigate('/court/inner-london-crown-court')
    }
  }

  return (
    <>
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

      {hasSearched && filteredResults.length > 0 && (
        <>
      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-two-thirds">
          <p className="govuk-body">
            We found courts or tribunals matching your search for '{searchTerm}'.
          </p>
          <p className="govuk-body">
            Most relevant results displayed.
          </p>
          
          <hr className="govuk-section-break govuk-section-break--visible" />
        </div>
      </div>

      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">Search results</h2>
          
          <div className="journey-search-results">
            <ul className="govuk-list">
                  {filteredResults.map((result) => (
                <li key={result.id} className="govuk-!-margin-bottom-2">
                  <a
                    href="#"
                    className="govuk-link govuk-link--no-visited-state"
                    onClick={(e) => {
                      e.preventDefault()
                      handleResultClick(result.id)
                    }}
                  >
                    {result.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
        </>
      )}

      {hasSearched && filteredResults.length === 0 && (
        <div className="govuk-grid-row govuk-!-margin-top-6">
          <div className="govuk-grid-column-two-thirds">
            <p className="govuk-body">
              No courts or tribunals found matching your search for '{searchTerm}'.
            </p>
            <p className="govuk-body">
              Try searching for a different court name, address, town or city.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
