'use client'

import React from 'react'

interface LandingCurvedLinesCtaBgProps {
  variant?: 'primary' | 'secondary' | 'accent'
  className?: string
}

export const LandingCurvedLinesCtaBg: React.FC<LandingCurvedLinesCtaBgProps> = ({
  variant = 'primary',
  className = ''
}) => {
  const colorClass = {
    primary: 'text-emerald-500/20',
    secondary: 'text-purple-500/20',
    accent: 'text-blue-500/20'
  }[variant]

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <svg
        className={`absolute inset-0 w-full h-full ${colorClass}`}
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Curved Lines Background Pattern */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.05" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.03" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        
        {/* Large Curved Shapes */}
        <path
          d="M0,300 C200,200 400,400 600,300 C800,200 1000,400 1000,300 L1000,0 L0,0 Z"
          fill="url(#gradient1)"
        />
        <path
          d="M0,700 C200,600 400,800 600,700 C800,600 1000,800 1000,700 L1000,1000 L0,1000 Z"
          fill="url(#gradient2)"
        />
        
        {/* Smaller Accent Lines */}
        <path
          d="M0,150 C250,100 500,200 750,150 C875,125 1000,175 1000,150 L1000,0 L0,0 Z"
          fill="currentColor"
          fillOpacity="0.03"
        />
        <path
          d="M0,850 C250,800 500,900 750,850 C875,825 1000,875 1000,850 L1000,1000 L0,1000 Z"
          fill="currentColor"
          fillOpacity="0.03"
        />
      </svg>
      
      {/* Additional Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-current rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-current rounded-full opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-current rounded-full opacity-25 animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-current rounded-full opacity-35 animate-pulse" style={{animationDelay: '0.5s'}}></div>
    </div>
  )
}