import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Check, AlertCircle, Users, Heart, Zap, Home } from 'lucide-react'
import { signupForCommunity, validateEmail, validateInterests, type CommunityEmailData } from '../../services/email-service'

interface CommunityEmailCaptureProps {
  source?: 'scrollytelling' | 'homepage' | 'quiz' | 'direct'
  onSuccess?: (trackingId: string) => void
  onError?: (error: string) => void
  className?: string
  variant?: 'full' | 'inline' | 'modal'
  preselectedInterests?: string[]
}

interface Interest {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  priority: 'essential' | 'recommended' | 'optional'
}

const COMMUNITY_INTERESTS: Interest[] = [
  {
    id: 'newsletter',
    label: 'Community Newsletter',
    description: 'Monthly stories, movement updates, and collective wins',
    icon: <Mail className="w-5 h-5" />,
    priority: 'essential'
  },
  {
    id: 'events',
    label: 'Events & Gatherings',
    description: 'Local meetups, workshops, and community celebrations',
    icon: <Users className="w-5 h-5" />,
    priority: 'recommended'
  },
  {
    id: 'movement-updates',
    label: 'Movement Building',
    description: 'Organizing updates, campaign news, and collective actions',
    icon: <Zap className="w-5 h-5" />,
    priority: 'recommended'
  },
  {
    id: 'blkouthub-access',
    label: 'BLKOUTHUB Access',
    description: 'Private community platform for Black queer men (UK-based)',
    icon: <Home className="w-5 h-5" />,
    priority: 'optional'
  },
  {
    id: 'community-resources',
    label: 'Resources & Support',
    description: 'Mental health, legal, housing, and mutual aid resources',
    icon: <Heart className="w-5 h-5" />,
    priority: 'recommended'
  },
  {
    id: 'cooperative-ownership',
    label: 'Cooperative Ownership',
    description: 'Building community wealth and collective economic power',
    icon: <Zap className="w-5 h-5" />,
    priority: 'optional'
  }
]

const CommunityEmailCapture: React.FC<CommunityEmailCaptureProps> = ({
  source = 'direct',
  onSuccess,
  onError,
  className = '',
  variant = 'full',
  preselectedInterests = ['newsletter', 'events']
}) => {
  const [email, setEmail] = useState('')
  const [selectedInterests, setSelectedInterests] = useState<string[]>(preselectedInterests)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [showInterestDetails, setShowInterestDetails] = useState(false)
  const emailInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (variant === 'modal' && emailInputRef.current) {
      emailInputRef.current.focus()
    }
  }, [variant])

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interestId)) {
        return prev.filter(id => id !== interestId)
      } else {
        return [...prev, interestId]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return

    // Validate email
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      setErrorMessage(emailValidation.message || 'Please enter a valid email')
      setSubmitState('error')
      return
    }

    // Validate interests
    const interestsValidation = validateInterests(selectedInterests)
    if (!interestsValidation.valid) {
      setErrorMessage(interestsValidation.message || 'Please select at least one interest')
      setSubmitState('error')
      return
    }

    setIsSubmitting(true)
    setSubmitState('idle')
    setErrorMessage('')

    try {
      const communityData: CommunityEmailData = {
        email: email.trim(),
        interests: selectedInterests,
        source,
        timestamp: new Date().toISOString(),
        blkouthubInterest: selectedInterests.includes('blkouthub-access'),
        location: 'UK', // Could be enhanced with geolocation
        referrer: document.referrer || 'direct'
      }

      const response = await signupForCommunity(communityData)

      if (response.success) {
        setSubmitState('success')
        setSuccessMessage(response.message)
        onSuccess?.(response.trackingId || '')
        
        // Clear form after successful submission
        setTimeout(() => {
          setEmail('')
          setSelectedInterests(['newsletter'])
          setSubmitState('idle')
        }, 3000)
      } else {
        setSubmitState('error')
        setErrorMessage(response.message)
        onError?.(response.error || 'Submission failed')
      }
    } catch (error) {
      setSubmitState('error')
      setErrorMessage('Something went wrong. Please try again.')
      onError?.(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'inline':
        return 'bg-transparent'
      case 'modal':
        return 'bg-white text-black rounded-2xl p-8 max-w-2xl mx-auto'
      default:
        return 'bg-gradient-to-br from-blkout-deep/80 to-blkout-accent/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20'
    }
  }

  const textColorClass = variant === 'modal' ? 'text-black' : 'text-white'
  const inputBgClass = variant === 'modal' ? 'bg-gray-100 text-black' : 'bg-white/10 text-white placeholder-white/60'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`${getVariantClasses()} ${className}`}
    >
      <AnimatePresence mode="wait">
        {submitState === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Check className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className={`text-2xl font-bold ${textColorClass} mb-4`}>
              Welcome to the Movement!
            </h3>
            <p className={`${textColorClass} opacity-90 leading-relaxed`}>
              {successMessage}
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6"
            >
              <p className={`text-sm ${textColorClass} opacity-70`}>
                Check your email for next steps and community resources.
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-2xl md:text-3xl font-bold ${textColorClass} mb-3`}
              >
                Join Our Community
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`${textColorClass} opacity-90`}
              >
                Building bridges, not walls. Cooperative ownership for collective liberation.
              </motion.p>
            </div>

            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <label htmlFor="community-email" className={`block text-sm font-medium ${textColorClass}`}>
                Email Address
              </label>
              <input
                ref={emailInputRef}
                type="email"
                id="community-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className={`w-full px-4 py-3 rounded-xl ${inputBgClass} border border-white/20 focus:border-blkout-secondary focus:outline-none focus:ring-2 focus:ring-blkout-secondary/50 transition-all`}
                required
                disabled={isSubmitting}
              />
            </motion.div>

            {/* Interest Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <label className={`block text-sm font-medium ${textColorClass}`}>
                  How would you like to stay connected?
                </label>
                <button
                  type="button"
                  onClick={() => setShowInterestDetails(!showInterestDetails)}
                  className={`text-xs ${textColorClass} opacity-70 hover:opacity-100 transition-opacity underline`}
                >
                  {showInterestDetails ? 'Hide details' : 'Show details'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {COMMUNITY_INTERESTS.map((interest, index) => (
                  <motion.div
                    key={interest.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className={`relative rounded-lg border transition-all cursor-pointer ${
                      selectedInterests.includes(interest.id)
                        ? 'border-blkout-secondary bg-blkout-secondary/20'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                    onClick={() => handleInterestToggle(interest.id)}
                  >
                    <div className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`mt-1 ${selectedInterests.includes(interest.id) ? 'text-blkout-secondary' : `${textColorClass} opacity-60`}`}>
                          {interest.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className={`font-medium ${textColorClass}`}>
                              {interest.label}
                            </span>
                            {interest.priority === 'essential' && (
                              <span className="text-xs bg-blkout-primary text-white px-2 py-1 rounded-full">
                                Essential
                              </span>
                            )}
                          </div>
                          <AnimatePresence>
                            {showInterestDetails && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`text-sm ${textColorClass} opacity-80 mt-1`}
                              >
                                {interest.description}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedInterests.includes(interest.id)}
                          onChange={() => handleInterestToggle(interest.id)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          selectedInterests.includes(interest.id)
                            ? 'border-blkout-secondary bg-blkout-secondary'
                            : 'border-white/40'
                        }`}>
                          {selectedInterests.includes(interest.id) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {submitState === 'error' && errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center space-x-2 text-red-400 bg-red-400/10 px-4 py-3 rounded-lg border border-red-400/20"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <button
                type="submit"
                disabled={isSubmitting || selectedInterests.length === 0}
                className={`w-full bg-blkout-primary hover:bg-blkout-warm text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  isSubmitting ? 'animate-pulse' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center space-x-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Joining Community...</span>
                  </span>
                ) : (
                  'Join the Movement'
                )}
              </button>
            </motion.div>

            {/* Privacy Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <p className={`text-xs ${textColorClass} opacity-60 leading-relaxed`}>
                We respect your privacy and will never sell your data. 
                Community-controlled technology for collective liberation.
                <br />
                <span className="underline">Your information stays within our community.</span>
              </p>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default CommunityEmailCapture