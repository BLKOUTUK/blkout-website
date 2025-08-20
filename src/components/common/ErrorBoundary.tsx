// Error Boundary Component with BLKOUTNXT Design System
// Catches JavaScript errors and provides user-friendly error handling

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  handleReportError = () => {
    const errorReport = {
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }
    
    // Log error for debugging
    console.error('Error Report:', errorReport)
    
    // You could send this to an error reporting service
    alert('Error report logged to console. Please contact support if the issue persists.')
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-950 via-red-900 to-gray-900 flex items-center justify-center px-4">
          <motion.div
            className="max-w-2xl w-full bg-red-900/30 backdrop-blur-sm border border-red-700/30 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="bg-red-800/30 px-8 py-6 border-b border-red-700/30">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-red-600/30 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white heading-block uppercase">
                    Something Went Wrong
                  </h1>
                  <p className="text-red-200 mt-1">
                    The application encountered an unexpected error
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-3">What happened?</h2>
                  <div className="bg-red-800/20 border border-red-600/30 rounded-lg p-4">
                    <p className="text-red-200 text-sm font-mono">
                      {this.state.error?.message || 'An unknown error occurred'}
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white mb-3">What can you do?</h2>
                  <ul className="text-red-200 space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Try refreshing the page or retrying the action</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Check your internet connection</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Contact support if the problem persists</span>
                    </li>
                  </ul>
                </div>

                {/* Development Mode Details */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-3">Development Details</h2>
                    <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-4 max-h-48 overflow-y-auto">
                      <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-red-700/30">
                <motion.button
                  onClick={this.handleRetry}
                  className="flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Try Again
                </motion.button>
                
                <motion.button
                  onClick={this.handleGoHome}
                  className="flex items-center justify-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Home className="w-5 h-5 mr-2" />
                  Go Home
                </motion.button>
                
                <motion.button
                  onClick={this.handleReportError}
                  className="flex items-center justify-center px-6 py-3 bg-transparent border border-red-600/50 hover:bg-red-600/10 text-red-300 font-semibold rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Bug className="w-5 h-5 mr-2" />
                  Report Issue
                </motion.button>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-red-700/30 text-center">
                <p className="text-red-300 text-sm">
                  If this error persists, please contact the BLKOUT technical team
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}

// Higher-order component for functional components
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  return (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )
}

export default ErrorBoundary