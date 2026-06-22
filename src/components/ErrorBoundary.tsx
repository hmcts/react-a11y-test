import { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from './Button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="govuk-width-container">
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
              <h1 className="govuk-heading-xl">Something went wrong</h1>
              <p className="govuk-body">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
              <Button onClick={this.handleReload}>
                Refresh page
              </Button>
              
              {import.meta.env.DEV && this.state.error && (
                <details className="govuk-details">
                  <summary className="govuk-details__summary">
                    <span className="govuk-details__summary-text">
                      Error details (development only)
                    </span>
                  </summary>
                  <div className="govuk-details__text">
                    <pre className="govuk-body-s">
                      {this.state.error.toString()}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
