'use client'

import React, { ReactNode } from 'react'

interface LandingLeadingPillProps {
  children: ReactNode
  borderVariant?: 'primary' | 'secondary' | 'accent'
  textVariant?: 'primary' | 'secondary' | 'accent'
  leftComponent?: ReactNode
  className?: string
}

export const LandingLeadingPill: React.FC<LandingLeadingPillProps> = ({
  children,
  borderVariant = 'primary',
  textVariant = 'primary',
  leftComponent,
  className = ''
}) => {
  const borderClasses = {
    primary: 'border-emerald-500/40 bg-emerald-500/10',
    secondary: 'border-purple-500/40 bg-purple-500/10',
    accent: 'border-blue-500/40 bg-blue-500/10'
  }[borderVariant]

  const textClasses = {
    primary: 'text-emerald-300',
    secondary: 'text-purple-300',
    accent: 'text-blue-300'
  }[textVariant]

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${borderClasses} ${textClasses} text-sm font-medium ${className}`}>
      {leftComponent}
      {children}
    </div>
  )
}