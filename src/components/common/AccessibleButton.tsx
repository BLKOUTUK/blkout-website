// Accessible Button Component for BLKOUTNXT Platform
// Provides consistent, accessible button components with proper ARIA attributes

import React, { forwardRef, ButtonHTMLAttributes } from 'react'
import { motion, MotionProps } from 'framer-motion'
import { Loader } from 'lucide-react'

export interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  animate?: boolean
  motionProps?: MotionProps
  'aria-label'?: string
  'aria-describedby'?: string
}

const variantClasses = {
  primary: 'bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-500 text-white',
  secondary: 'bg-emerald-600 hover:bg-emerald-500 focus:ring-emerald-500 text-white',
  outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white focus:ring-indigo-500',
  ghost: 'text-indigo-600 hover:bg-indigo-100 focus:ring-indigo-500',
  danger: 'bg-red-600 hover:bg-red-500 focus:ring-red-500 text-white'
}

const sizeClasses = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl'
}

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  animate = false,
  motionProps = {},
  disabled,
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}, ref) => {
  const baseClasses = [
    'inline-flex items-center justify-center font-semibold rounded-lg',
    'transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ')

  const buttonContent = (
    <>
      {loading && (
        <Loader 
          className={`animate-spin ${size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} ${leftIcon || children ? 'mr-2' : ''}`}
          aria-hidden="true"
        />
      )}
      {!loading && leftIcon && (
        <span className={`${children ? 'mr-2' : ''}`} aria-hidden="true">
          {leftIcon}
        </span>
      )}
      {children && <span>{children}</span>}
      {!loading && rightIcon && (
        <span className={`${children ? 'ml-2' : ''}`} aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </>
  )

  const buttonProps = {
    ref,
    className: baseClasses,
    disabled: disabled || loading,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-busy': loading,
    ...props
  }

  if (animate) {
    return (
      <motion.button
        {...buttonProps}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        {...motionProps}
      >
        {buttonContent}
      </motion.button>
    )
  }

  return (
    <button {...buttonProps}>
      {buttonContent}
    </button>
  )
})

AccessibleButton.displayName = 'AccessibleButton'

export default AccessibleButton