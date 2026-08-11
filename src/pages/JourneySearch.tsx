import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ErrorMessage, ErrorSummary } from '@/components'
import { setFocus } from '@/utils/setFocus'

export const JourneySearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  // Restores the radio selection when arriving back from
  // /journey/search-by-name, which links back here with ?know-name=yes.
  const [selectedOption, setSelectedOption] = useState<string>(
    searchParams.get('know-name') ?? ''
  )
  const [validationError, setValidationError] = useState<string>('')
  const navigate = useNavigate()
  const errorSummaryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Focus on error summary when validation error occurs
    if (validationError && errorSummaryRef.current) {
      setFocus(errorSummaryRef.current)
    }
  }, [validationError])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation: Check if an option is selected
    if (!selectedOption) {
      setValidationError('Select whether you know the name of the court or tribunal')
      return
    }

    // Clear any previous errors
    setValidationError('')

    // Navigate based on selection
    if (selectedOption === 'yes') {
      navigate('/journey/search-by-name')
    } else if (selectedOption === 'no') {
      navigate('/journey/search-by-location')
    }
  }

  const handleRadioChange = (value: string) => {
    setSelectedOption(value)
    // Reflect the selection in this page's own URL (replacing, not
    // pushing, so radio clicks don't pile up browser history entries) so
    // that navigating away and back - e.g. via the 404 page's "Go back" -
    // restores whichever option was actually selected, not just "yes".
    setSearchParams({ 'know-name': value }, { replace: true })
    // Clear validation error when user makes a selection
    if (validationError) {
      setValidationError('')
    }
  }

  return (
    <>
      <Link to="/journey" className="govuk-back-link">
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
                  href: '#know-name-yes'
                }
              ]}
            />
          )}

          <h1 className="govuk-heading-xl">
            Do you know the name of the court or tribunal
          </h1>
          
          <p className="govuk-body">
            The name of the court or tribunal can be found on a letter, email or text from us.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className={`govuk-form-group ${validationError ? 'govuk-form-group--error' : ''}`}>
              <fieldset className="govuk-fieldset" aria-describedby={validationError ? 'know-name-error' : undefined}>
                <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                  <h2 className="govuk-fieldset__heading">
                    Choose one of the following options:
                  </h2>
                </legend>
                
                {validationError && (
                  <ErrorMessage id="know-name-error">
                    {validationError}
                  </ErrorMessage>
                )}
                
                <div className="govuk-radios" data-module="govuk-radios">
                  <div className="govuk-radios__item">
                    <input 
                      className="govuk-radios__input" 
                      id="know-name-yes" 
                      name="know-name" 
                      type="radio" 
                      value="yes"
                      checked={selectedOption === 'yes'}
                      onChange={(e) => handleRadioChange(e.target.value)}
                    />
                    <label className="govuk-label govuk-radios__label" htmlFor="know-name-yes">
                      I have the name
                    </label>
                  </div>
                  
                  <div className="govuk-radios__item">
                    <input 
                      className="govuk-radios__input" 
                      id="know-name-no" 
                      name="know-name" 
                      type="radio" 
                      value="no"
                      checked={selectedOption === 'no'}
                      onChange={(e) => handleRadioChange(e.target.value)}
                    />
                    <label className="govuk-label govuk-radios__label" htmlFor="know-name-no">
                      I do not have the name
                    </label>
                  </div>
                </div>
              </fieldset>
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
    </>
  )
}
