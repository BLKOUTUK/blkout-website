// Error Handling Hook for BLKOUTNXT Platform
// Provides consistent error handling and user feedback across components

import { useState, useCallback } from 'react'

export interface ErrorState {
  hasError: boolean
  message: string
  details?: string
  code?: string
  retryable?: boolean
}

export interface ErrorHandlerConfig {
  showToast?: boolean
  logToConsole?: boolean
  retryable?: boolean
  fallbackMessage?: string
}

const DEFAULT_CONFIG: ErrorHandlerConfig = {
  showToast: true,
  logToConsole: true,
  retryable: true,
  fallbackMessage: 'An unexpected error occurred. Please try again.'
}

export const useErrorHandler = (config: ErrorHandlerConfig = {}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  
  const [error, setError] = useState<ErrorState | null>(null)

  const handleError = useCallback((
    error: Error | string | any,
    context?: string
  ) => {
    let errorState: ErrorState

    if (error instanceof Error) {
      errorState = {
        hasError: true,
        message: error.message || finalConfig.fallbackMessage!,
        details: error.stack,
        retryable: finalConfig.retryable
      }
    } else if (typeof error === 'string') {
      errorState = {
        hasError: true,
        message: error,
        retryable: finalConfig.retryable
      }
    } else if (error?.message) {
      // Handle API errors or custom error objects
      errorState = {
        hasError: true,
        message: error.message || finalConfig.fallbackMessage!,
        code: error.code || error.status,
        details: error.details || JSON.stringify(error),
        retryable: error.retryable ?? finalConfig.retryable
      }
    } else {
      errorState = {
        hasError: true,
        message: finalConfig.fallbackMessage!,
        details: JSON.stringify(error),
        retryable: finalConfig.retryable
      }
    }

    // Log to console if enabled
    if (finalConfig.logToConsole) {
      const logContext = context ? `[${context}]` : '[Error]'
      console.error(`${logContext}:`, error)
    }

    // Set error state
    setError(errorState)

    // Show toast notification if enabled (you could integrate with a toast library)
    if (finalConfig.showToast) {
      // For now, we'll just log the toast message
      console.warn('Toast notification:', errorState.message)
    }

    return errorState
  }, [finalConfig])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const retry = useCallback((retryFn: () => void | Promise<void>) => {
    if (error?.retryable) {
      clearError()
      try {
        const result = retryFn()
        if (result instanceof Promise) {
          result.catch((err) => handleError(err, 'Retry failed'))
        }
      } catch (err) {
        handleError(err, 'Retry failed')
      }
    }
  }, [error, clearError, handleError])

  // Specialized error handlers for common scenarios
  const handleAPIError = useCallback((error: any, endpoint?: string) => {
    const context = endpoint ? `API Error - ${endpoint}` : 'API Error'
    
    // Common API error patterns
    if (error?.response?.status === 401) {
      return handleError('Authentication required. Please sign in.', context)
    }
    
    if (error?.response?.status === 403) {
      return handleError('Access denied. You do not have permission for this action.', context)
    }
    
    if (error?.response?.status === 404) {
      return handleError('The requested resource was not found.', context)
    }
    
    if (error?.response?.status === 429) {
      return handleError('Too many requests. Please wait a moment and try again.', context)
    }
    
    if (error?.response?.status >= 500) {
      return handleError('Server error. Please try again later.', context)
    }
    
    if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('fetch')) {
      return handleError('Network connection error. Please check your internet connection.', context)
    }
    
    return handleError(error, context)
  }, [handleError])

  const handleSupabaseError = useCallback((error: any, operation?: string) => {
    const context = operation ? `Supabase Error - ${operation}` : 'Supabase Error'
    
    // Supabase-specific error patterns
    if (error?.code === '23505') {
      return handleError('This item already exists.', context)
    }
    
    if (error?.code === '23503') {
      return handleError('Cannot perform this action due to related data.', context)
    }
    
    if (error?.code === '42501') {
      return handleError('Insufficient permissions for this operation.', context)
    }
    
    if (error?.message?.includes('JWT')) {
      return handleError('Authentication expired. Please sign in again.', context)
    }
    
    return handleError(error, context)
  }, [handleError])

  const handleFormValidationError = useCallback((errors: Record<string, string>) => {
    const firstError = Object.values(errors)[0]
    return handleError(firstError || 'Please check your input and try again.', 'Form Validation')
  }, [handleError])

  return {
    error,
    hasError: !!error,
    handleError,
    handleAPIError,
    handleSupabaseError,
    handleFormValidationError,
    clearError,
    retry
  }
}

// Utility function for async error handling
export const withErrorHandling = async <T>(
  asyncFn: () => Promise<T>,
  errorHandler: (error: any) => void,
  context?: string
): Promise<T | null> => {
  try {
    return await asyncFn()
  } catch (error) {
    errorHandler(error)
    return null
  }
}

// Error boundary hook for functional components
export const useErrorBoundary = () => {
  const [error, setError] = useState<Error | null>(null)

  const captureError = useCallback((error: Error) => {
    setError(error)
  }, [])

  const resetError = useCallback(() => {
    setError(null)
  }, [])

  // Throw error to be caught by error boundary
  if (error) {
    throw error
  }

  return { captureError, resetError }
}

export default useErrorHandler