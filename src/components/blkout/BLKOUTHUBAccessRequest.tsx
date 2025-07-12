import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Users, Heart, Shield, Check, AlertCircle, MapPin } from 'lucide-react'

interface BLKOUTHUBAccessData {
  email: string
  name: string
  location: string
  ageVerification: boolean
  identityAffirmation: string[]
  connectionReason: string
  communityGuidelines: boolean
  referralSource: string
  timestamp: string
}

interface BLKOUTHUBAccessRequestProps {
  onSuccess?: (data: BLKOUTHUBAccessData) => void
  onCancel?: () => void
  className?: string
}

const IDENTITY_OPTIONS = [
  'I identify as Black/African/Caribbean/African-American',
  'I identify as queer/gay/bisexual/pansexual',
  'I identify as male/man/masculine-aligned',
  'I am 18 years or older',
  'I am based in the UK'
]

const REFERRAL_SOURCES = [
  'BLKOUT website/scrollytelling',
  'Friend or community member',
  'Social media (Instagram, Twitter, etc.)',
  'Event or workshop',
  'Partner organization',
  'Search engine',
  'Other'
]

const BLKOUTHUBAccessRequest: React.FC<BLKOUTHUBAccessRequestProps> = ({
  onSuccess,
  onCancel,
  className = ''
}) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    location: '',
    ageVerification: false,
    identityAffirmation: [] as string[],
    connectionReason: '',
    communityGuidelines: false,
    referralSource: ''
  })
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const totalSteps = 4

  const handleIdentityToggle = (identity: string) => {
    setFormData(prev => ({
      ...prev,
      identityAffirmation: prev.identityAffirmation.includes(identity)
        ? prev.identityAffirmation.filter(i => i !== identity)
        : [...prev.identityAffirmation, identity]
    }))
  }

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return formData.email && formData.name && formData.location
      case 2:
        return formData.identityAffirmation.length >= 4 && formData.ageVerification
      case 3:
        return formData.connectionReason.trim().length >= 50 && formData.referralSource
      case 4:
        return formData.communityGuidelines
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceedToNextStep() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!canProceedToNextStep()) return

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const accessData: BLKOUTHUBAccessData = {
        ...formData,
        timestamp: new Date().toISOString()
      }

      // In production, this would send to secure backend
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Store request locally as backup
      const requests = JSON.parse(localStorage.getItem('blkouthub-requests') || '[]')
      requests.push({
        ...accessData,
        status: 'pending',
        submitted_at: new Date().toISOString()
      })
      localStorage.setItem('blkouthub-requests', JSON.stringify(requests))

      setSubmitState('success')
      onSuccess?.(accessData)
    } catch (error) {
      setSubmitState('error')
      setErrorMessage('Something went wrong. Please try again or contact us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep1 = () => (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blkout-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-blkout-primary" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Basic Information</h2>
        <p className="text-gray-300">Let's start with the basics so we can connect with you</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="your.email@example.com"
            className="w-full px-4 py-3 bg-white/10 text-white placeholder-white/60 rounded-xl border border-white/20 focus:border-blkout-secondary focus:outline-none focus:ring-2 focus:ring-blkout-secondary/50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Name or Preferred Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="How would you like to be addressed?"
            className="w-full px-4 py-3 bg-white/10 text-white placeholder-white/60 rounded-xl border border-white/20 focus:border-blkout-secondary focus:outline-none focus:ring-2 focus:ring-blkout-secondary/50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Location (City/Region) *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-white/60" />
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="London, Birmingham, Manchester, etc."
              className="w-full pl-12 pr-4 py-3 bg-white/10 text-white placeholder-white/60 rounded-xl border border-white/20 focus:border-blkout-secondary focus:outline-none focus:ring-2 focus:ring-blkout-secondary/50"
              required
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            We ask for location to help connect you with local community members and events
          </p>
        </div>
      </div>
    </motion.div>
  )

  const renderStep2 = () => (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blkout-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-blkout-secondary" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Community Belonging</h2>
        <p className="text-gray-300">BLKOUTHUB is specifically for Black queer men in the UK</p>
      </div>

      <div className="space-y-4">
        <p className="text-white font-medium">Please confirm that the following apply to you:</p>
        
        {IDENTITY_OPTIONS.map((option, index) => (
          <motion.div
            key={option}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border transition-all cursor-pointer ${
              formData.identityAffirmation.includes(option)
                ? 'border-blkout-secondary bg-blkout-secondary/20'
                : 'border-white/20 hover:border-white/40'
            }`}
            onClick={() => handleIdentityToggle(option)}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                formData.identityAffirmation.includes(option)
                  ? 'border-blkout-secondary bg-blkout-secondary'
                  : 'border-white/40'
              }`}>
                {formData.identityAffirmation.includes(option) && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="text-white">{option}</span>
            </div>
          </motion.div>
        ))}

        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blkout-accent mt-1" />
            <div>
              <h4 className="text-white font-medium mb-2">Why we ask</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                BLKOUTHUB is a private, safer space designed specifically for Black queer men to connect, 
                support each other, and build community power. These criteria help us maintain the focus 
                and safety of our community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const renderStep3 = () => (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blkout-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-blkout-accent" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Tell Us About Yourself</h2>
        <p className="text-gray-300">Help us understand how you'd like to engage with the community</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            What brings you to BLKOUTHUB? What are you hoping to find or contribute? *
          </label>
          <textarea
            value={formData.connectionReason}
            onChange={(e) => setFormData(prev => ({ ...prev, connectionReason: e.target.value }))}
            placeholder="Share what you're looking for - community, support, collaboration, friendship, organizing opportunities, etc. Be as detailed as you'd like."
            rows={4}
            className="w-full px-4 py-3 bg-white/10 text-white placeholder-white/60 rounded-xl border border-white/20 focus:border-blkout-secondary focus:outline-none focus:ring-2 focus:ring-blkout-secondary/50 resize-none"
            required
          />
          <p className="text-xs text-gray-400 mt-2">
            {formData.connectionReason.length}/50 characters minimum
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            How did you hear about BLKOUTHUB? *
          </label>
          <select
            value={formData.referralSource}
            onChange={(e) => setFormData(prev => ({ ...prev, referralSource: e.target.value }))}
            className="w-full px-4 py-3 bg-white/10 text-white rounded-xl border border-white/20 focus:border-blkout-secondary focus:outline-none focus:ring-2 focus:ring-blkout-secondary/50"
            required
          >
            <option value="" disabled>Select how you found us</option>
            {REFERRAL_SOURCES.map(source => (
              <option key={source} value={source} className="bg-gray-800 text-white">
                {source}
              </option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  )

  const renderStep4 = () => (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blkout-warm/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-blkout-warm" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Community Guidelines</h2>
        <p className="text-gray-300">Ensuring our space remains safe and supportive for everyone</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-4">BLKOUTHUB Community Principles</h3>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li className="flex items-start space-x-2">
              <span className="text-blkout-secondary">•</span>
              <span>Center Black queer men's experiences and wisdom</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blkout-secondary">•</span>
              <span>Respect confidentiality and privacy of community members</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blkout-secondary">•</span>
              <span>No discrimination based on class, HIV status, immigration status, religion, etc.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blkout-secondary">•</span>
              <span>Engage in good faith - we're here to build each other up</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blkout-secondary">•</span>
              <span>Practice consent and respect boundaries</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blkout-secondary">•</span>
              <span>Contribute to collective care and mutual aid when able</span>
            </li>
          </ul>
        </div>

        <motion.div
          className={`p-4 rounded-lg border transition-all cursor-pointer ${
            formData.communityGuidelines
              ? 'border-blkout-secondary bg-blkout-secondary/20'
              : 'border-white/20 hover:border-white/40'
          }`}
          onClick={() => setFormData(prev => ({ ...prev, communityGuidelines: !prev.communityGuidelines }))}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              formData.communityGuidelines
                ? 'border-blkout-secondary bg-blkout-secondary'
                : 'border-white/40'
            }`}>
              {formData.communityGuidelines && (
                <Check className="w-3 h-3 text-white" />
              )}
            </div>
            <span className="text-white">
              I agree to follow these community guidelines and contribute to creating a safer space for all members
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )

  const renderSuccess = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
        className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <Check className="w-10 h-10 text-white" />
      </motion.div>
      
      <h2 className="text-3xl font-bold text-white mb-4">Request Submitted!</h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        Thank you for your interest in BLKOUTHUB. Our community team will review your request 
        and get back to you within 48 hours via email.
      </p>
      
      <div className="bg-white/5 rounded-lg p-6 border border-white/10 mb-6">
        <h3 className="text-white font-semibold mb-3">What happens next?</h3>
        <ul className="space-y-2 text-gray-300 text-sm text-left">
          <li className="flex items-start space-x-2">
            <span className="text-blkout-secondary mt-1">1.</span>
            <span>We'll review your request within 48 hours</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blkout-secondary mt-1">2.</span>
            <span>If approved, you'll receive an invitation link via email</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blkout-secondary mt-1">3.</span>
            <span>You'll be connected with community onboarding support</span>
          </li>
        </ul>
      </div>
      
      <p className="text-xs text-gray-400">
        Questions? Email us at hub@blkoutuk.com
      </p>
    </motion.div>
  )

  if (submitState === 'success') {
    return (
      <div className={`bg-gradient-to-br from-blkout-deep/80 to-blkout-accent/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 ${className}`}>
        {renderSuccess()}
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-br from-blkout-deep/80 to-blkout-accent/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 ${className}`}>
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-300">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm text-gray-300">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blkout-primary to-blkout-secondary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 text-red-400 bg-red-400/10 px-4 py-3 rounded-lg border border-red-400/20 mt-6"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8">
        <div className="flex space-x-3">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
            >
              Back
            </button>
          )}
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        {currentStep < totalSteps ? (
          <button
            onClick={handleNext}
            disabled={!canProceedToNextStep()}
            className="px-8 py-3 bg-blkout-primary hover:bg-blkout-warm text-white font-semibold rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canProceedToNextStep() || isSubmitting}
            className={`px-8 py-3 bg-blkout-primary hover:bg-blkout-warm text-white font-semibold rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
              isSubmitting ? 'animate-pulse' : ''
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Submitting...</span>
              </span>
            ) : (
              'Submit Request'
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default BLKOUTHUBAccessRequest