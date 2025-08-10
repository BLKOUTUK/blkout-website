'use client'

import React, { ReactNode } from 'react'

interface LandingProductTourListProps {
  children: ReactNode
  className?: string
}

export const LandingProductTourList: React.FC<LandingProductTourListProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`flex flex-wrap gap-4 justify-center mb-8 ${className}`}>
      {children}
    </div>
  )
}