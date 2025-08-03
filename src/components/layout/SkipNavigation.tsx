import React from 'react'

const SkipNavigation: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-indigo-600 text-white px-4 py-2 rounded-md font-medium z-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
    >
      Skip to main content
    </a>
  )
}

export default SkipNavigation