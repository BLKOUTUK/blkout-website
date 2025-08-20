import React, { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle, XCircle, Loader, RefreshCw } from 'lucide-react'

interface PageLoadingDebugProps {
  pageName: string
  dependencies: string[]
  onDependencyTest?: (dep: string) => Promise<boolean>
}

interface DependencyStatus {
  name: string
  status: 'checking' | 'success' | 'failed'
  error?: string
}

export default function PageLoadingDebug({ 
  pageName, 
  dependencies, 
  onDependencyTest 
}: PageLoadingDebugProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [dependencyStatuses, setDependencyStatuses] = useState<DependencyStatus[]>([])

  useEffect(() => {
    // Initialize dependency statuses
    const initialStatuses = dependencies.map(dep => ({
      name: dep,
      status: 'checking' as const
    }))
    setDependencyStatuses(initialStatuses)

    // Test each dependency
    const testDependencies = async () => {
      for (const dep of dependencies) {
        try {
          let isHealthy = true
          
          // Default tests for common dependencies
          if (dep === 'Supabase') {
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
            const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
            if (!supabaseUrl || !supabaseKey) {
              throw new Error('Missing Supabase environment variables')
            }
            const response = await fetch(`${supabaseUrl}/rest/v1/`, {
              headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
              }
            })
            isHealthy = response.ok
          } else if (dep === 'API Client') {
            // Test API client connection
            const response = await fetch('/api/health').catch(() => ({ ok: false }))
            isHealthy = response.ok
          } else if (onDependencyTest) {
            isHealthy = await onDependencyTest(dep)
          }

          setDependencyStatuses(prev => prev.map(status => 
            status.name === dep 
              ? { ...status, status: isHealthy ? 'success' : 'failed' }
              : status
          ))
        } catch (error) {
          setDependencyStatuses(prev => prev.map(status => 
            status.name === dep 
              ? { 
                  ...status, 
                  status: 'failed',
                  error: error instanceof Error ? error.message : 'Unknown error'
                }
              : status
          ))
        }
      }
    }

    testDependencies()
  }, [dependencies, onDependencyTest])

  const getStatusIcon = (status: DependencyStatus['status']) => {
    switch (status) {
      case 'checking':
        return <Loader className="w-4 h-4 animate-spin text-yellow-500" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
    }
  }

  const hasFailures = dependencyStatuses.some(status => status.status === 'failed')
  const isLoading = dependencyStatuses.some(status => status.status === 'checking')

  if (!hasFailures && !isLoading) {
    return null // Don't show debug panel if everything is working
  }

  return (
    <>
      {/* Debug Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`fixed top-4 left-4 z-50 p-2 rounded-lg shadow-lg transition-all ${
          hasFailures ? 'bg-red-600 text-white' : 'bg-yellow-600 text-white'
        }`}
      >
        {hasFailures ? <AlertTriangle className="w-5 h-5" /> : <Loader className="w-5 h-5 animate-spin" />}
      </button>

      {/* Debug Panel */}
      {isVisible && (
        <div className="fixed top-16 left-4 right-4 md:right-auto md:w-96 bg-white border border-gray-300 rounded-lg shadow-xl z-40 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">
              Debug: {pageName} Loading Issues
            </h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="space-y-3">
            {dependencyStatuses.map((status) => (
              <div key={status.name} className="flex items-center space-x-3">
                {getStatusIcon(status.status)}
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {status.name}
                  </div>
                  {status.error && (
                    <div className="text-xs text-red-600 mt-1">
                      {status.error}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {hasFailures && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <div className="font-medium">Page Loading Issues Detected</div>
                  <div className="mt-1">
                    This page may not function correctly due to dependency failures.
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300"
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </>
  )
}