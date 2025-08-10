import React from 'react'
import { cn } from '../../lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  children: React.ReactNode
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium'
    
    const variants = {
      default: 'bg-gray-900 text-white',
      secondary: 'bg-gray-100 text-gray-900',
      destructive: 'bg-red-600 text-white',
      outline: 'border border-gray-200 text-gray-900',
    }

    return (
      <div
        className={cn(baseClasses, variants[variant], className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Badge.displayName = 'Badge'