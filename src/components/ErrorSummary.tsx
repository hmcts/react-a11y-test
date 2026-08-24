import React from 'react'
import { clsx } from 'clsx'

interface ErrorSummaryItem {
  text: string
  href?: string
  to?: string
}

interface ErrorSummaryProps {
  title?: string
  description?: string
  errorList: ErrorSummaryItem[]
  className?: string
}

export const ErrorSummary = React.forwardRef<HTMLDivElement, ErrorSummaryProps>(
  ({ title = 'There is a problem', description, errorList, className }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('govuk-error-summary', className)}
        data-module="govuk-error-summary"
      >
        {/* role="alert" is nested below the focus target, not on it, so
            screen readers don't announce it twice (once for the live
            region, once for the focus move landing on the same node).
            The outer container deliberately has no accessible name of
            its own - all announcement content comes from this alert.
            tabindex is applied transiently by setFocus() on the outer
            container, not statically here - see src/utils/setFocus.ts. */}
        <div role="alert">
          <h2 className="govuk-error-summary__title">
            {title}
          </h2>

          <div className="govuk-error-summary__body">
            {description && <p>{description}</p>}

            <ul className="govuk-list govuk-error-summary__list">
              {errorList.map((error, index) => (
                <li key={index}>
                  {error.href ? (
                    <a href={error.href} className="govuk-link">
                      {error.text}
                    </a>
                  ) : error.to ? (
                    <a href={error.to} className="govuk-link">
                      {error.text}
                    </a>
                  ) : (
                    <span>{error.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }
)

ErrorSummary.displayName = 'ErrorSummary'
