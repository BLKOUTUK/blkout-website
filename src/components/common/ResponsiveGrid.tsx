// Responsive Grid Component for BLKOUTNXT Platform
// Provides consistent, accessible grid layouts with proper responsive behavior

import React from 'react'
import { motion } from 'framer-motion'

export interface ResponsiveGridProps {
  children: React.ReactNode
  columns?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: number | string
  className?: string
  animate?: boolean
  staggerChildren?: number
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 4 },
  gap = 6,
  className = '',
  animate = false,
  staggerChildren = 0.1
}) => {
  const gridClasses = [
    'grid',
    `gap-${gap}`,
    columns.xs && `grid-cols-${columns.xs}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
    className
  ].filter(Boolean).join(' ')

  if (animate) {
    return (
      <motion.div
        className={gridClasses}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.6,
          staggerChildren
        }}
      >
        {React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: index * staggerChildren
            }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    )
  }

  return (
    <div className={gridClasses}>
      {children}
    </div>
  )
}

// Specialized grids for common use cases
export const ArticleGrid: React.FC<{
  children: React.ReactNode
  className?: string
  animate?: boolean
}> = ({ children, className = '', animate = false }) => (
  <ResponsiveGrid
    columns={{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }}
    gap={8}
    className={className}
    animate={animate}
    staggerChildren={0.1}
  >
    {children}
  </ResponsiveGrid>
)

export const EventGrid: React.FC<{
  children: React.ReactNode
  className?: string
  animate?: boolean
}> = ({ children, className = '', animate = false }) => (
  <ResponsiveGrid
    columns={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }}
    gap={6}
    className={className}
    animate={animate}
    staggerChildren={0.1}
  >
    {children}
  </ResponsiveGrid>
)

export const StatsGrid: React.FC<{
  children: React.ReactNode
  className?: string
  animate?: boolean
}> = ({ children, className = '', animate = false }) => (
  <ResponsiveGrid
    columns={{ xs: 1, sm: 2, md: 4, lg: 4, xl: 4 }}
    gap={6}
    className={className}
    animate={animate}
    staggerChildren={0.05}
  >
    {children}
  </ResponsiveGrid>
)

export default ResponsiveGrid