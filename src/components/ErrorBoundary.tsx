'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error Boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center px-4 bg-champagne">
            <div className="text-center max-w-md w-full">
              <div className="mb-6">
                <div className="text-6xl md:text-7xl mb-4">💔</div>
                <h1 className="text-3xl md:text-4xl font-playfair font-bold text-warmbrown mb-2">Oops!</h1>
                <p className="text-base md:text-lg text-rosegold/80">Something went wrong</p>
              </div>
              <p className="text-sm md:text-base text-warmbrown/70 mb-8">We&apos;re sorry for the inconvenience. Please try refreshing the page.</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-mobile-full bg-gradient-to-r from-rosegold to-softgold text-white min-h-12 px-8 py-3 rounded-full hover:shadow-luxury active:scale-98 transition-all font-semibold touch-target"
              >
                🔄 Refresh Page
              </button>
              {this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="text-xs text-rosegold/60 cursor-pointer hover:text-rosegold transition-colors touch-target">
                    Technical details
                  </summary>
                  <pre className="mt-2 text-xs text-warmbrown/60 bg-pearl p-4 rounded-xl overflow-auto max-h-40">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
