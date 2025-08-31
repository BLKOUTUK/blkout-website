/**
 * Story Disclaimer Banner
 * Clear notification that beta stories are fictional demonstrations
 */

import React, { useState } from 'react'

interface StoryDisclaimerBannerProps {
  onDismiss?: () => void
  persistent?: boolean
}

const StoryDisclaimerBanner: React.FC<StoryDisclaimerBannerProps> = ({ 
  onDismiss,
  persistent = false 
}) => {
  const [isDismissed, setIsDismissed] = useState(false)

  const handleDismiss = () => {
    setIsDismissed(true)
    if (onDismiss) onDismiss()
  }

  if (isDismissed && !persistent) return null

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Beta Demonstration Content
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p className="mb-2">
              <strong>⚠️ These stories are FICTIONAL</strong> and created for beta testing purposes only. 
              They are NOT real news events or actual organizing victories.
            </p>
            <p className="mb-2">
              <strong>Purpose:</strong> To demonstrate BLKOUT's platform capabilities and inspire real community organizing.
            </p>
            <p>
              <strong>Real Implementation:</strong> Would feature actual community stories with full consent and community editorial control.
            </p>
          </div>
          {!persistent && (
            <div className="mt-4">
              <button
                onClick={handleDismiss}
                className="text-sm font-medium text-yellow-800 underline hover:text-yellow-600"
              >
                Dismiss for this session
              </button>
            </div>
          )}
        </div>
        {!persistent && (
          <div className="flex-shrink-0 ml-4">
            <button
              onClick={handleDismiss}
              className="inline-flex text-yellow-400 hover:text-yellow-600"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default StoryDisclaimerBanner