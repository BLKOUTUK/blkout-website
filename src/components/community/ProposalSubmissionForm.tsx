// Proposal Submission Form for BLKOUT's Community Governance
// Allows community members to submit governance proposals with guidance and validation

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Scale, BarChart3, GitBranch, Users, Heart, 
  AlertCircle, CheckCircle, Info, Lightbulb, Target,
  Clock, User, Tag, MessageSquare, Send, X,
  HelpCircle, BookOpen, Shield
} from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'
import { COMMUNITY_VALUES } from '../../lib/constants'

interface ProposalCategory {
  id: string
  label: string
  description: string
  icon: React.ElementType
  color: string
  examples: string[]
  impact: 'low' | 'medium' | 'high' | 'critical'
  minDiscussionDays: number
}

interface ValidationError {
  field: string
  message: string
}

interface ProposalSubmissionFormProps {
  onSubmit: (proposal: any) => void
  onCancel: () => void
  isOpen: boolean
}

const ProposalSubmissionForm: React.FC<ProposalSubmissionFormProps> = ({
  onSubmit,
  onCancel,
  isOpen
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    justification: '',
    expectedImpact: '',
    implementationPlan: '',
    resourcesRequired: '',
    communityBenefit: '',
    potentialConcerns: '',
    proposerName: '',
    proposerRole: '',
    supportingMembers: [] as string[],
    urgency: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    estimatedTimeframe: '',
    successMetrics: []
  })

  const proposalCategories: ProposalCategory[] = [
    {
      id: 'policy',
      label: 'Community Policy',
      description: 'Changes to community guidelines, moderation policies, or behavioral standards',
      icon: Scale,
      color: 'text-purple-400',
      examples: [
        'Updating community guidelines',
        'Moderation policy changes',
        'Code of conduct revisions',
        'Conflict resolution processes'
      ],
      impact: 'high',
      minDiscussionDays: 7
    },
    {
      id: 'budget',
      label: 'Budget & Resources',
      description: 'Financial decisions, resource allocation, and funding proposals',
      icon: BarChart3,
      color: 'text-emerald-400',
      examples: [
        'Community fund allocation',
        'Platform development funding',
        'Event and program budgets',
        'Infrastructure investments'
      ],
      impact: 'critical',
      minDiscussionDays: 10
    },
    {
      id: 'platform',
      label: 'Platform Development',
      description: 'Technical changes, new features, and platform improvements',
      icon: GitBranch,
      color: 'text-blue-400',
      examples: [
        'New platform features',
        'User interface changes',
        'Technical infrastructure',
        'Accessibility improvements'
      ],
      impact: 'medium',
      minDiscussionDays: 5
    },
    {
      id: 'community',
      label: 'Community Programs',
      description: 'New initiatives, events, programs, and community-building activities',
      icon: Users,
      color: 'text-amber-400',
      examples: [
        'New community programs',
        'Educational initiatives',
        'Social events and gatherings',
        'Mentorship programs'
      ],
      impact: 'medium',
      minDiscussionDays: 5
    },
    {
      id: 'values',
      label: 'Values & Governance',
      description: 'Changes to fundamental values, mission, or governance structure',
      icon: Heart,
      color: 'text-rose-400',
      examples: [
        'Mission statement updates',
        'Core values modifications',
        'Governance structure changes',
        'Democratic process improvements'
      ],
      impact: 'critical',
      minDiscussionDays: 14
    }
  ]

  const steps = [
    { id: 1, title: 'Category & Basic Info', description: 'Choose proposal type and provide basic details' },
    { id: 2, title: 'Detailed Description', description: 'Explain your proposal thoroughly' },
    { id: 3, title: 'Impact & Implementation', description: 'Describe the expected impact and how it will be implemented' },
    { id: 4, title: 'Review & Submit', description: 'Review your proposal before submission' }
  ]

  const validateCurrentStep = (): boolean => {
    const errors: ValidationError[] = []
    
    switch (currentStep) {
      case 1:
        if (!formData.title.trim()) {
          errors.push({ field: 'title', message: 'Title is required' })
        } else if (formData.title.length < 10) {
          errors.push({ field: 'title', message: 'Title must be at least 10 characters' })
        }
        if (!formData.category) {
          errors.push({ field: 'category', message: 'Please select a category' })
        }
        if (!formData.proposerName.trim()) {
          errors.push({ field: 'proposerName', message: 'Proposer name is required' })
        }
        break
      case 2:
        if (!formData.description.trim()) {
          errors.push({ field: 'description', message: 'Description is required' })
        } else if (formData.description.length < 100) {
          errors.push({ field: 'description', message: 'Description must be at least 100 characters' })
        }
        if (!formData.justification.trim()) {
          errors.push({ field: 'justification', message: 'Justification is required' })
        }
        break
      case 3:
        if (!formData.expectedImpact.trim()) {
          errors.push({ field: 'expectedImpact', message: 'Expected impact is required' })
        }
        if (!formData.implementationPlan.trim()) {
          errors.push({ field: 'implementationPlan', message: 'Implementation plan is required' })
        }
        break
    }
    
    setValidationErrors(errors)
    return errors.length === 0
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
    setValidationErrors([])
  }

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return
    
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const proposal = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        status: 'draft',
        created_at: new Date().toISOString(),
        discussion_count: 0,
        votes_for: 0,
        votes_against: 0,
        votes_abstain: 0
      }
      
      onSubmit(proposal)
    } catch (error) {
      console.error('Submission failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFieldError = (field: string) => {
    return validationErrors.find(error => error.field === field)?.message
  }

  const selectedCategory = proposalCategories.find(cat => cat.id === formData.category)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-indigo-900 border border-indigo-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-indigo-900 border-b border-indigo-700 p-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Submit New Proposal</h2>
                <p className="text-indigo-300 mt-1">
                  Help shape our community through democratic participation
                </p>
              </div>
              <button
                onClick={onCancel}
                className="p-2 text-indigo-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      currentStep >= step.id 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-indigo-800 text-indigo-400'
                    }`}>
                      {currentStep > step.id ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-20 h-1 transition-all ${
                        currentStep > step.id ? 'bg-purple-600' : 'bg-indigo-800'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <p className="text-white font-medium">{steps[currentStep - 1].title}</p>
                <p className="text-sm text-indigo-300">{steps[currentStep - 1].description}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Category & Basic Info */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-lg font-bold text-white mb-4">
                      Proposal Category *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {proposalCategories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: category.id })}
                          className={`p-4 text-left border transition-all ${
                            formData.category === category.id
                              ? 'border-purple-500 bg-purple-900/20'
                              : 'border-indigo-700/30 bg-indigo-800/20 hover:bg-indigo-800/30'
                          }`}
                        >
                          <div className="flex items-center mb-2">
                            <category.icon className={`w-6 h-6 ${category.color} mr-3`} />
                            <span className="font-bold text-white">{category.label}</span>
                          </div>
                          <p className="text-sm text-indigo-200 mb-2">{category.description}</p>
                          <div className="text-xs text-indigo-400">
                            Min. discussion period: {category.minDiscussionDays} days
                          </div>
                        </button>
                      ))}
                    </div>
                    {getFieldError('category') && (
                      <p className="text-red-400 text-sm mt-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {getFieldError('category')}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="title" className="block text-lg font-bold text-white mb-2">
                      Proposal Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter a clear, descriptive title for your proposal"
                      className="w-full bg-indigo-900/30 border border-indigo-700/30 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {getFieldError('title') && (
                      <p className="text-red-400 text-sm mt-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {getFieldError('title')}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="proposerName" className="block text-lg font-bold text-white mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="proposerName"
                        value={formData.proposerName}
                        onChange={(e) => setFormData({ ...formData, proposerName: e.target.value })}
                        placeholder="Enter your name or organization"
                        className="w-full bg-indigo-900/30 border border-indigo-700/30 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      {getFieldError('proposerName') && (
                        <p className="text-red-400 text-sm mt-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {getFieldError('proposerName')}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="proposerRole" className="block text-lg font-bold text-white mb-2">
                        Your Role
                      </label>
                      <select
                        id="proposerRole"
                        value={formData.proposerRole}
                        onChange={(e) => setFormData({ ...formData, proposerRole: e.target.value })}
                        className="w-full bg-indigo-900/30 border border-indigo-700/30 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select your role</option>
                        <option value="member">Community Member</option>
                        <option value="moderator">Moderator</option>
                        <option value="council">Council Member</option>
                        <option value="working-group">Working Group</option>
                        <option value="organization">Partner Organization</option>
                      </select>
                    </div>
                  </div>

                  {selectedCategory && (
                    <div className="bg-blue-900/20 border border-blue-600/30 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-blue-200 mb-2">
                            {selectedCategory.label} Proposals
                          </h4>
                          <p className="text-sm text-blue-200 mb-3">
                            {selectedCategory.description}
                          </p>
                          <div className="text-sm text-blue-300">
                            <p className="font-medium mb-1">Common examples:</p>
                            <ul className="list-disc list-inside space-y-1">
                              {selectedCategory.examples.map((example, index) => (
                                <li key={index}>{example}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Detailed Description */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label htmlFor="description" className="block text-lg font-bold text-white mb-2">
                      Detailed Description *
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Provide a comprehensive description of your proposal. What exactly are you proposing?"
                      rows={6}
                      className="w-full bg-indigo-900/30 border border-indigo-700/30 text-white p-3 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <div className="flex justify-between items-center mt-2">
                      {getFieldError('description') ? (
                        <p className="text-red-400 text-sm flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {getFieldError('description')}
                        </p>
                      ) : (
                        <p className="text-indigo-400 text-sm">
                          {formData.description.length}/100 characters minimum
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="justification" className="block text-lg font-bold text-white mb-2">
                      Why is this needed? *
                    </label>
                    <textarea
                      id="justification"
                      value={formData.justification}
                      onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                      placeholder="Explain why this proposal is necessary. What problem does it solve or opportunity does it create?"
                      rows={4}
                      className="w-full bg-indigo-900/30 border border-indigo-700/30 text-white p-3 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {getFieldError('justification') && (
                      <p className="text-red-400 text-sm mt-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {getFieldError('justification')}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="communityBenefit" className="block text-lg font-bold text-white mb-2">
                      Community Benefit
                    </label>
                    <textarea
                      id="communityBenefit"
                      value={formData.communityBenefit}
                      onChange={(e) => setFormData({ ...formData, communityBenefit: e.target.value })}
                      placeholder="How will this benefit the community? Who will be positively impacted?"
                      rows={4}
                      className="w-full bg-indigo-900/30 border border-indigo-700/30 text-white p-3 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="potentialConcerns" className="block text-lg font-bold text-white mb-2">
                      Potential Concerns & Mitigation
                    </label>
                    <textarea
                      id="potentialConcerns"
                      value={formData.potentialConcerns}
                      onChange={(e) => setFormData({ ...formData, potentialConcerns: e.target.value })}
                      placeholder="What concerns or challenges might arise? How can they be addressed?"
                      rows={4}
                      className="w-full bg-indigo-900/30 border border-indigo-700/30 text-white p-3 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Impact & Implementation */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label htmlFor="expectedImpact" className="block text-lg font-bold text-white mb-2">
                      Expected Impact *
                    </label>
                    <textarea
                      id="expectedImpact"
                      value={formData.expectedImpact}
                      onChange={(e) => setFormData({ ...formData, expectedImpact: e.target.value })}
                      placeholder="What specific impact do you expect this proposal to have?"
                      rows={4}
                      className="w-full bg-indigo-900/30 border border-indigo-700/30 text-white p-3 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {getFieldError('expectedImpact') && (
                      <p className="text-red-400 text-sm mt-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {getFieldError('expectedImpact')}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="implementationPlan" className="block text-lg font-bold text-white mb-2">
                      Implementation Plan *
                    </label>
                    <textarea
                      id="implementationPlan"
                      value={formData.implementationPlan}
                      onChange={(e) => setFormData({ ...formData, implementationPlan: e.target.value })}
                      placeholder="How will this proposal be implemented? What are the concrete steps?"
                      rows={4}
                      className="w-full bg-indigo-900/30 border border-indigo-700/30 text-white p-3 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {getFieldError('implementationPlan') && (
                      <p className="text-red-400 text-sm mt-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {getFieldError('implementationPlan')}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="resourcesRequired" className="block text-lg font-bold text-white mb-2">
                        Resources Required
                      </label>
                      <textarea
                        id="resourcesRequired"
                        value={formData.resourcesRequired}
                        onChange={(e) => setFormData({ ...formData, resourcesRequired: e.target.value })}
                        placeholder="What resources (time, money, people) are needed?"
                        rows={3}
                        className="w-full bg-indigo-900/30 border border-indigo-700/30 text-white p-3 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="estimatedTimeframe" className="block text-lg font-bold text-white mb-2">
                        Estimated Timeframe
                      </label>
                      <select
                        id="estimatedTimeframe"
                        value={formData.estimatedTimeframe}
                        onChange={(e) => setFormData({ ...formData, estimatedTimeframe: e.target.value })}
                        className="w-full bg-indigo-900/30 border border-indigo-700/30 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select timeframe</option>
                        <option value="immediate">Immediate (1-2 weeks)</option>
                        <option value="short">Short term (1-3 months)</option>
                        <option value="medium">Medium term (3-6 months)</option>
                        <option value="long">Long term (6+ months)</option>
                        <option value="ongoing">Ongoing process</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-white mb-2">
                      Urgency Level
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: 'low', label: 'Low', color: 'bg-green-900/20 border-green-600/30 text-green-300' },
                        { value: 'normal', label: 'Normal', color: 'bg-blue-900/20 border-blue-600/30 text-blue-300' },
                        { value: 'high', label: 'High', color: 'bg-amber-900/20 border-amber-600/30 text-amber-300' },
                        { value: 'urgent', label: 'Urgent', color: 'bg-red-900/20 border-red-600/30 text-red-300' }
                      ].map((urgency) => (
                        <button
                          key={urgency.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, urgency: urgency.value as any })}
                          className={`p-3 border text-center transition-all ${urgency.color} ${
                            formData.urgency === urgency.value ? 'ring-2 ring-purple-500' : ''
                          }`}
                        >
                          {urgency.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-emerald-900/20 border border-emerald-600/30 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <CheckCircle className="w-6 h-6 text-emerald-400 mr-3" />
                      Review Your Proposal
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold text-emerald-200 mb-1">Title:</h4>
                        <p className="text-white">{formData.title}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-emerald-200 mb-1">Category:</h4>
                        <p className="text-white">{proposalCategories.find(cat => cat.id === formData.category)?.label}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-emerald-200 mb-1">Description:</h4>
                        <p className="text-white line-clamp-3">{formData.description}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-emerald-200 mb-1">Expected Impact:</h4>
                        <p className="text-white line-clamp-2">{formData.expectedImpact}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-bold text-emerald-200 mb-1">Proposer:</h4>
                          <p className="text-white">{formData.proposerName}</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-emerald-200 mb-1">Urgency:</h4>
                          <p className="text-white capitalize">{formData.urgency}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-600/30 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-blue-200 mb-2">What happens next?</h4>
                        <ul className="text-sm text-blue-200 space-y-1">
                          <li>• Your proposal will be reviewed by moderators within 24 hours</li>
                          <li>• Once approved, it enters a {selectedCategory?.minDiscussionDays}-day discussion period</li>
                          <li>• After discussion, the community votes on the proposal</li>
                          <li>• You'll be notified at each stage of the process</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-900/20 border border-amber-600/30 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Lightbulb className="w-5 h-5 text-amber-400 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-amber-200 mb-2">Community Values Check</h4>
                        <p className="text-sm text-amber-200 mb-2">
                          Please confirm that your proposal aligns with our community values:
                        </p>
                        <div className="space-y-1 text-xs text-amber-200">
                          {COMMUNITY_VALUES.map((value, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircle className="w-3 h-3 text-amber-400" />
                              <span>{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-indigo-900 border-t border-indigo-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex space-x-3">
                {currentStep > 1 && (
                  <button
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="bg-red-600/20 hover:bg-red-600/30 text-red-300 px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>

              <div>
                {currentStep < 4 ? (
                  <button
                    onClick={handleNext}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" color="white" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Submit Proposal</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ProposalSubmissionForm