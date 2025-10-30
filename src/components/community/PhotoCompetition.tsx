'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Camera, Upload, Eye, Heart, Users, MapPin, Calendar, 
  Award, TrendingUp, Target, ArrowRight, CheckCircle, 
  AlertCircle, Loader, Info, Star, Globe, Aperture,
  Focus, Image, Zap, Sparkles, Layers
} from 'lucide-react'
import PrimaryNavigationEnhanced from '../layout/PrimaryNavigationEnhanced'
import PlatformFooter from '../layout/PlatformFooter'

interface Photographer {
  name: string
  pronouns: string
  age_range: string
  location: string
  instagram_handle: string
  email: string
  experience_level: string
}

interface Submission {
  title: string
  category: string
  description: string
  story: string
  image_file?: File
  technical_details: string
  consent: {
    media_usage: boolean
    social_sharing: boolean
    archive_inclusion: boolean
  }
}

interface EngagementData {
  referral_source: string
  found_competition_how: string
  previous_blkout_engagement: string
  interested_in_future: string
  feedback_on_competition: string
}

const CATEGORIES = [
  {
    id: 'black',
    title: 'BLACK',
    description: 'Celebrating Black identity, culture, and community in all its beautiful forms',
    icon: '🖤',
    examples: 'Cultural heritage, family traditions, community gathering, artistic expression'
  },
  {
    id: 'out', 
    title: 'OUT',
    description: 'Living authentically, being visible, and taking up space as QTIPOC+ individuals',
    icon: '🏳️‍🌈',
    examples: 'Pride moments, authentic self-expression, visibility, breaking barriers'
  },
  {
    id: 'next',
    title: 'NEXT', 
    description: 'Building the future we need - innovation, progress, and collective liberation',
    icon: '🚀',
    examples: 'Future-building, innovation, community organizing, generational change'
  },
  {
    id: 'intersections',
    title: 'INTERSECTIONS',
    description: 'The beautiful complexity of being Black and queer - where identities meet and strengthen',
    icon: '💫',
    examples: 'Identity intersections, community solidarity, chosen family, collective power'
  },
  {
    id: 'liberation',
    title: 'LIBERATION',
    description: 'Moments of freedom, resistance, and joy that fuel our movement forward',
    icon: '✊🏾',
    examples: 'Resistance moments, collective action, community healing, transformative joy'
  }
]

const AGE_RANGES = ['16-24', '25-34', '35-44', '45-54', '55+']
const EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'advanced', 'professional']
const REFERRAL_SOURCES = ['instagram', 'linkedin', 'community', 'friend', 'search', 'other']

// Competition Stats Display - PageAI Style
const CompetitionStats: React.FC<{ stats: any }> = ({ stats }) => (
  <div className="relative mb-20">
    {/* Background Elements */}
    <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/20 to-black/40 rounded-3xl"></div>
    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-violet-500/10 rounded-3xl"></div>
    
    {/* Floating Elements */}
    <motion.div 
      animate={{ y: [-10, 10, -10] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-6 right-6 w-4 h-4 bg-emerald-400/60 rounded-full blur-sm"
    ></motion.div>
    <motion.div 
      animate={{ y: [10, -10, 10] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-6 left-6 w-3 h-3 bg-violet-400/60 rounded-full blur-sm"
    ></motion.div>

    <div className="relative z-10 p-12">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="inline-block p-4 bg-gradient-to-br from-emerald-500/20 to-violet-500/20 rounded-2xl mb-6"
        >
          <Aperture className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className="text-2xl font-light text-white mb-2 tracking-wide">Community Engagement</h3>
        <div className="w-24 h-px bg-gradient-to-r from-emerald-400 to-violet-400 mx-auto"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center group"
        >
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-emerald-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 backdrop-blur-sm border border-emerald-400/20 rounded-2xl p-6">
              <Camera className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <div className="text-4xl font-thin text-white mb-1 tracking-tight">
                {stats?.participation?.total_submissions || 0}
              </div>
            </div>
          </div>
          <div className="text-sm text-emerald-300 font-light uppercase tracking-widest">Submissions</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center group"
        >
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-violet-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-violet-500/10 to-violet-600/10 backdrop-blur-sm border border-violet-400/20 rounded-2xl p-6">
              <Users className="w-6 h-6 text-violet-400 mx-auto mb-2" />
              <div className="text-4xl font-thin text-white mb-1 tracking-tight">
                {stats?.participation?.unique_photographers || 0}
              </div>
            </div>
          </div>
          <div className="text-sm text-violet-300 font-light uppercase tracking-widest">Artists</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center group"
        >
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-blue-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm border border-blue-400/20 rounded-2xl p-6">
              <MapPin className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-4xl font-thin text-white mb-1 tracking-tight">
                {stats?.participation?.geographic_spread ? Object.keys(stats.participation.geographic_spread).length : 0}
              </div>
            </div>
          </div>
          <div className="text-sm text-blue-300 font-light uppercase tracking-widest">Cities</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center group"
        >
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-rose-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-rose-500/10 to-rose-600/10 backdrop-blur-sm border border-rose-400/20 rounded-2xl p-6">
              <Layers className="w-6 h-6 text-rose-400 mx-auto mb-2" />
              <div className="text-4xl font-thin text-white mb-1 tracking-tight">
                {stats?.engagement?.categories_popularity ? Object.keys(stats.engagement.categories_popularity).length : 0}
              </div>
            </div>
          </div>
          <div className="text-sm text-rose-300 font-light uppercase tracking-widest">Categories</div>
        </motion.div>
      </div>
    </div>
  </div>
)

// Category Selection Component - PageAI Style
const CategorySelector: React.FC<{ 
  selectedCategory: string, 
  onSelect: (category: string) => void 
}> = ({ selectedCategory, onSelect }) => (
  <div className="space-y-6">
    <label className="block text-lg font-light text-white/90 tracking-wide">
      Choose Your Category *
    </label>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {CATEGORIES.map((category) => (
        <motion.div
          key={category.id}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className={`relative cursor-pointer group ${
            selectedCategory === category.id ? 'z-10' : 'z-0'
          }`}
          onClick={() => onSelect(category.id)}
        >
          <div className={`absolute inset-0 rounded-2xl blur-xl transition-all duration-500 ${
            selectedCategory === category.id
              ? 'bg-emerald-400/20 group-hover:blur-2xl'
              : 'bg-white/5 group-hover:bg-white/10'
          }`}></div>
          <div className={`relative backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 ${
            selectedCategory === category.id
              ? 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border-emerald-400/30'
              : 'bg-white/5 border-white/10 hover:border-white/20'
          }`}>
            <div className="flex items-start gap-4">
              <div className="text-3xl">{category.icon}</div>
              <div className="flex-1">
                <h3 className="text-lg font-light text-white mb-3 tracking-wide">
                  {category.title}
                </h3>
                <p className="text-white/70 text-sm mb-4 leading-relaxed">
                  {category.description}
                </p>
                <p className="text-xs text-white/50 font-light italic">
                  Examples: {category.examples}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
)

// Form Input Component - PageAI Style
const FormInput: React.FC<{
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  placeholder?: string
  options?: string[]
  maxLength?: number
  rows?: number
}> = ({ label, type = 'text', value, onChange, required = false, placeholder, options, maxLength, rows }) => (
  <div className="space-y-4">
    <label className="block text-lg font-light text-white/90 tracking-wide">
      {label} {required && <span className="text-emerald-400">*</span>}
    </label>
    
    {type === 'select' && options ? (
      <div className="relative">
        <div className="absolute inset-0 bg-white/5 rounded-2xl blur-sm"></div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="relative w-full p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white/90 focus:border-emerald-400/50 focus:outline-none transition-all duration-300 appearance-none"
          required={required}
        >
          <option value="" className="bg-gray-900">Select {label.toLowerCase()}...</option>
          {options.map(option => (
            <option key={option} value={option} className="bg-gray-900">
              {option.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </option>
          ))}
        </select>
      </div>
    ) : type === 'textarea' ? (
      <div className="relative">
        <div className="absolute inset-0 bg-white/5 rounded-2xl blur-sm"></div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={rows || 4}
          className="relative w-full p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white/90 placeholder-white/40 focus:border-emerald-400/50 focus:outline-none transition-all duration-300 resize-vertical"
          required={required}
        />
      </div>
    ) : (
      <div className="relative">
        <div className="absolute inset-0 bg-white/5 rounded-2xl blur-sm"></div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="relative w-full p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white/90 placeholder-white/40 focus:border-emerald-400/50 focus:outline-none transition-all duration-300"
          required={required}
        />
      </div>
    )}
    
    {maxLength && (
      <div className="text-xs text-white/40 text-right font-light">
        {value.length}/{maxLength} characters
      </div>
    )}
  </div>
)

export default function PhotoCompetition() {
  const [currentStep, setCurrentStep] = useState<'intro' | 'form' | 'submitted'>('intro')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [competitionStats, setCompetitionStats] = useState(null)
  
  // Form state
  const [photographer, setPhotographer] = useState<Photographer>({
    name: '',
    pronouns: '',
    age_range: '',
    location: '',
    instagram_handle: '',
    email: '',
    experience_level: ''
  })

  const [submission, setSubmission] = useState<Submission>({
    title: '',
    category: '',
    description: '',
    story: '',
    technical_details: '',
    consent: {
      media_usage: false,
      social_sharing: false,
      archive_inclusion: false
    }
  })

  const [engagementData, setEngagementData] = useState<EngagementData>({
    referral_source: '',
    found_competition_how: '',
    previous_blkout_engagement: '',
    interested_in_future: '',
    feedback_on_competition: ''
  })

  // Load competition stats on mount
  useEffect(() => {
    fetchCompetitionStats()
  }, [])

  const fetchCompetitionStats = async () => {
    try {
      const response = await fetch('/api/photo-competition')
      const data = await response.json()
      setCompetitionStats(data.current_metrics)
    } catch (error) {
      console.error('Failed to load competition stats:', error)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const submissionData = {
        photographer,
        submission,
        engagement_data: engagementData
      }

      const response = await fetch('/api/photo-competition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'submit',
          submissionData
        })
      })

      const result = await response.json()

      if (result.success) {
        setCurrentStep('submitted')
        // Refresh stats
        setCompetitionStats(result.baseline_update)
      } else {
        setError(result.error || 'Submission failed. Please try again.')
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    return photographer.name && photographer.email && photographer.location && 
           submission.title && submission.category && submission.description && 
           submission.story && engagementData.referral_source &&
           submission.consent.media_usage && submission.consent.social_sharing
  }

  // Intro Section - PageAI Style
  if (currentStep === 'intro') {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-violet-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent)] bg-[radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.15),transparent)]"></div>
        
        {/* Floating Elements */}
        <motion.div 
          animate={{ 
            y: [-20, 20, -20],
            rotate: [0, 360]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-20 right-20 w-8 h-8 border border-emerald-400/30 rounded-full blur-sm"
        ></motion.div>
        <motion.div 
          animate={{ 
            y: [20, -20, 20],
            rotate: [360, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute bottom-32 left-16 w-6 h-6 bg-violet-400/20 rounded-full blur-lg"
        ></motion.div>

        <PrimaryNavigationEnhanced />
        
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-32">
          {/* Hero Header */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            {/* Camera Icon Animation */}
            <div className="relative mb-12">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-block relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-violet-400 rounded-3xl blur-2xl opacity-30"></div>
                <div className="relative bg-gradient-to-br from-emerald-500/20 to-violet-500/20 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                  <Aperture className="w-16 h-16 text-white" />
                  <motion.div
                    animate={{ rotate: [0, -360] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Focus className="w-20 h-20 text-emerald-400/50" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
            
            {/* Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl lg:text-9xl font-black font-display uppercase mb-8 tracking-tight"
            >
              <span className="bg-gradient-to-r from-emerald-400 via-white to-violet-400 bg-clip-text text-transparent">
                BLKOUT
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-rose-400 to-emerald-400 bg-clip-text text-transparent font-black font-display uppercase">
                LENS
              </span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-16"
            >
              <div className="inline-block bg-gradient-to-r from-emerald-500/10 to-violet-500/10 backdrop-blur-sm border border-white/10 rounded-full px-8 py-4 mb-8">
                <span className="text-white/80 font-light tracking-widest uppercase text-sm">2025 PILOT COMPETITION</span>
              </div>
              
              <p className="text-2xl md:text-3xl text-white/70 leading-relaxed font-light max-w-5xl mx-auto tracking-wide">
                Community Perspectives Through Photography
              </p>
              
              <div className="w-32 h-px bg-gradient-to-r from-emerald-400 to-violet-400 mx-auto mt-8"></div>
            </motion.div>

            {/* Action Research Box */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative max-w-6xl mx-auto mb-20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-violet-500/5 rounded-3xl blur-xl"></div>
              <div className="relative bg-gradient-to-br from-white/5 to-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-12">
                <div className="flex items-center justify-center mb-8">
                  <Sparkles className="w-8 h-8 text-emerald-400 mr-3" />
                  <h3 className="text-2xl font-light text-white tracking-wide">Action Research Goals</h3>
                  <Sparkles className="w-8 h-8 text-violet-400 ml-3" />
                </div>
                
                <div className="grid md:grid-cols-3 gap-12">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="text-center group"
                  >
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-emerald-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <div className="relative bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-400/20 rounded-2xl p-8">
                        <Target className="w-12 h-12 text-emerald-400 mx-auto" />
                      </div>
                    </div>
                    <h4 className="text-xl font-light text-white mb-4 tracking-wide">Baseline Assessment</h4>
                    <p className="text-white/60 leading-relaxed">Measure community engagement and participation patterns across our network</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="text-center group"
                  >
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-violet-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <div className="relative bg-gradient-to-br from-violet-500/10 to-violet-600/10 border border-violet-400/20 rounded-2xl p-8">
                        <Users className="w-12 h-12 text-violet-400 mx-auto" />
                      </div>
                    </div>
                    <h4 className="text-xl font-light text-white mb-4 tracking-wide">Partnership Mapping</h4>
                    <p className="text-white/60 leading-relaxed">Identify photographers, venues, and organizers for collaborative growth</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="text-center group"
                  >
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-rose-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <div className="relative bg-gradient-to-br from-rose-500/10 to-rose-600/10 border border-rose-400/20 rounded-2xl p-8">
                        <Award className="w-12 h-12 text-rose-400 mx-auto" />
                      </div>
                    </div>
                    <h4 className="text-xl font-light text-white mb-4 tracking-wide">2026 Foundation</h4>
                    <p className="text-white/60 leading-relaxed">Groundwork for comprehensive Photography Award and Pride Tour</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Current Stats */}
          <CompetitionStats stats={competitionStats} />

          {/* Visual Content Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-24"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold font-display uppercase mb-6 tracking-tight">
                <span className="bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
                  Community Perspectives
                </span>
              </h2>
              <div className="w-32 h-px bg-gradient-to-r from-emerald-400 to-violet-400 mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Photocollage Video */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-violet-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative aspect-video overflow-hidden rounded-3xl shadow-2xl">
                  <video
                    src="/images/squared/photo collage Video.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-white font-bold font-display uppercase tracking-wide text-sm mb-2">Community Collage</h3>
                    <p className="text-white/80 text-xs font-light">Capturing our diverse perspectives</p>
                  </div>
                </div>
              </motion.div>
              
              {/* Featured Image */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-emerald-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
                  <img
                    src="/images/blkoutuk.com v3/John Henry.png"
                    alt="Creative expression and community celebration"
                    className="w-full h-full object-contain bg-gradient-to-br from-green-100 to-green-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-white font-bold font-display uppercase tracking-wide text-sm mb-2">Breaking Through</h3>
                    <p className="text-white/80 text-xs font-light">Artistic liberation in action</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Categories Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mb-24"
          >
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black font-display uppercase mb-6 tracking-tight">
                <span className="bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
                  Five Categories
                </span>
              </h2>
              <div className="w-32 h-px bg-gradient-to-r from-emerald-400 to-violet-400 mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {CATEGORIES.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative bg-gradient-to-br from-white/5 to-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-500">
                    <div className="text-4xl mb-6 text-center">{category.icon}</div>
                    <h3 className="text-xl font-light text-white mb-4 tracking-wide text-center">
                      {category.title}
                    </h3>
                    <p className="text-white/60 leading-relaxed text-center text-sm">
                      {category.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentStep('form')}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-violet-500 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-gradient-to-r from-emerald-500 to-violet-500 backdrop-blur-sm border border-white/20 rounded-2xl px-16 py-6 flex items-center justify-center">
                <Camera className="w-6 h-6 mr-4 text-white" />
                <span className="text-xl font-light text-white tracking-wide">Submit Your Vision</span>
                <ArrowRight className="w-6 h-6 ml-4 text-white" />
              </div>
            </motion.button>
            
            <p className="text-white/50 mt-8 max-w-3xl mx-auto font-light leading-relaxed">
              Submissions open December 1st - 31st, 2025. Your participation helps us understand community
              engagement and build toward a comprehensive Photography Award in 2026.
            </p>
          </motion.div>
        </div>
        
        <PlatformFooter />
      </div>
    )
  }

  // Form Section - PageAI Style
  if (currentStep === 'form') {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-violet-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(16,185,129,0.1),transparent)] bg-[radial-gradient(circle_at_80%_70%,rgba(139,92,246,0.1),transparent)]"></div>
        
        {/* Floating Elements */}
        <motion.div 
          animate={{ 
            y: [-15, 15, -15],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-32 right-20 w-6 h-6 border border-emerald-400/20 rounded-full blur-sm"
        ></motion.div>
        <motion.div 
          animate={{ 
            y: [15, -15, 15],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute bottom-40 left-16 w-4 h-4 bg-violet-400/20 rounded-full blur-lg"
        ></motion.div>

        <PrimaryNavigationEnhanced />
        
        <div className="relative z-10 max-w-5xl mx-auto px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            {/* Camera Icon Animation */}
            <div className="relative mb-12">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-block relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-violet-400 rounded-2xl blur-xl opacity-40"></div>
                <div className="relative bg-gradient-to-br from-emerald-500/20 to-violet-500/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <Camera className="w-12 h-12 text-white" />
                </div>
              </motion.div>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-thin mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-emerald-400 via-white to-violet-400 bg-clip-text text-transparent">
                SUBMIT YOUR
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-rose-400 to-emerald-400 bg-clip-text text-transparent font-black font-display uppercase">
                PERSPECTIVE
              </span>
            </h1>
            
            <div className="w-24 h-px bg-gradient-to-r from-emerald-400 to-violet-400 mx-auto mt-8"></div>
          </motion.div>

          {/* Form Container */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/5 rounded-3xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-white/5 to-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-12 space-y-16">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative mb-8"
              >
                <div className="absolute inset-0 bg-red-500/10 rounded-2xl blur-xl"></div>
                <div className="relative bg-gradient-to-br from-red-500/10 to-rose-500/10 backdrop-blur-sm border border-red-400/20 rounded-2xl p-6 flex items-center gap-4">
                  <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                  <span className="text-red-200 font-light">{error}</span>
                </div>
              </motion.div>
            )}

            {/* Photographer Information */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="relative mb-12">
                <div className="absolute inset-0 bg-emerald-400/10 rounded-2xl blur-2xl"></div>
                <div className="relative bg-gradient-to-br from-emerald-500/5 to-emerald-600/5 backdrop-blur-sm border border-emerald-400/20 rounded-2xl p-8">
                  <h2 className="text-3xl font-light text-white mb-2 tracking-wide flex items-center justify-center">
                    <Users className="w-8 h-8 mr-4 text-emerald-400" />
                    About You
                  </h2>
                  <div className="w-16 h-px bg-gradient-to-r from-emerald-400 to-transparent mx-auto"></div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <FormInput
                  label="Your Name"
                  value={photographer.name}
                  onChange={(value) => setPhotographer({...photographer, name: value})}
                  required
                />
                <FormInput
                  label="Pronouns"
                  value={photographer.pronouns}
                  onChange={(value) => setPhotographer({...photographer, pronouns: value})}
                  placeholder="they/them, she/her, he/him, etc."
                />
                <FormInput
                  label="Age Range"
                  type="select"
                  options={AGE_RANGES}
                  value={photographer.age_range}
                  onChange={(value) => setPhotographer({...photographer, age_range: value})}
                  required
                />
                <FormInput
                  label="Location"
                  value={photographer.location}
                  onChange={(value) => setPhotographer({...photographer, location: value})}
                  placeholder="City, Region"
                  required
                />
                <FormInput
                  label="Instagram Handle"
                  value={photographer.instagram_handle}
                  onChange={(value) => setPhotographer({...photographer, instagram_handle: value})}
                  placeholder="@yourhandle (optional)"
                />
                <FormInput
                  label="Experience Level"
                  type="select"
                  options={EXPERIENCE_LEVELS}
                  value={photographer.experience_level}
                  onChange={(value) => setPhotographer({...photographer, experience_level: value})}
                  required
                />
                <div className="md:col-span-2">
                  <FormInput
                    label="Email"
                    type="email"
                    value={photographer.email}
                    onChange={(value) => setPhotographer({...photographer, email: value})}
                    required
                  />
                </div>
              </div>
            </motion.section>

            {/* Photo Submission */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative mb-12">
                <div className="absolute inset-0 bg-violet-400/10 rounded-2xl blur-2xl"></div>
                <div className="relative bg-gradient-to-br from-violet-500/5 to-violet-600/5 backdrop-blur-sm border border-violet-400/20 rounded-2xl p-8">
                  <h2 className="text-3xl font-light text-white mb-2 tracking-wide flex items-center justify-center">
                    <Camera className="w-8 h-8 mr-4 text-violet-400" />
                    Your Photo
                  </h2>
                  <div className="w-16 h-px bg-gradient-to-r from-violet-400 to-transparent mx-auto"></div>
                </div>
              </div>
              
              <div className="space-y-8">
                <CategorySelector 
                  selectedCategory={submission.category}
                  onSelect={(category) => setSubmission({...submission, category})}
                />
                
                <FormInput
                  label="Photo Title"
                  value={submission.title}
                  onChange={(value) => setSubmission({...submission, title: value})}
                  maxLength={100}
                  required
                />
                
                <FormInput
                  label="Photo Description"
                  type="textarea"
                  value={submission.description}
                  onChange={(value) => setSubmission({...submission, description: value})}
                  placeholder="Briefly describe what's happening in this photo..."
                  maxLength={500}
                  rows={3}
                  required
                />
                
                <FormInput
                  label="Your Story"
                  type="textarea"
                  value={submission.story}
                  onChange={(value) => setSubmission({...submission, story: value})}
                  placeholder="What makes this photo meaningful to you? How does it connect to your experience of Black queer liberation?"
                  maxLength={1000}
                  rows={5}
                  required
                />
                
                <FormInput
                  label="Technical Details"
                  value={submission.technical_details}
                  onChange={(value) => setSubmission({...submission, technical_details: value})}
                  placeholder="Camera/phone used, any technical notes (optional)"
                />
                
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-400/5 rounded-2xl blur-xl"></div>
                  <div className="relative bg-gradient-to-br from-blue-500/5 to-blue-600/5 backdrop-blur-sm border border-blue-400/20 rounded-2xl p-8">
                    <Info className="w-6 h-6 text-blue-400 mb-4" />
                    <p className="text-white/80 font-light leading-relaxed">
                      <span className="text-blue-300 font-medium">Photo Submission Note:</span> Due to this being a pilot assessment, photo upload will be handled 
                      via email after form submission. You'll receive detailed submission instructions at the email address provided.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Engagement Research */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative mb-12">
                <div className="absolute inset-0 bg-blue-400/10 rounded-2xl blur-2xl"></div>
                <div className="relative bg-gradient-to-br from-blue-500/5 to-blue-600/5 backdrop-blur-sm border border-blue-400/20 rounded-2xl p-8">
                  <h2 className="text-3xl font-light text-white mb-2 tracking-wide flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 mr-4 text-blue-400" />
                    Engagement Research
                  </h2>
                  <div className="w-16 h-px bg-gradient-to-r from-blue-400 to-transparent mx-auto"></div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <FormInput
                  label="How did you hear about this competition?"
                  type="select"
                  options={REFERRAL_SOURCES}
                  value={engagementData.referral_source}
                  onChange={(value) => setEngagementData({...engagementData, referral_source: value})}
                  required
                />
                
                <FormInput
                  label="Previous BLKOUT engagement"
                  type="select"
                  options={['first_time', 'occasional_follower', 'regular_engagement', 'community_member']}
                  value={engagementData.previous_blkout_engagement}
                  onChange={(value) => setEngagementData({...engagementData, previous_blkout_engagement: value})}
                />
                
                <div className="md:col-span-2">
                  <FormInput
                    label="What specifically made you want to participate?"
                    type="textarea"
                    value={engagementData.found_competition_how}
                    onChange={(value) => setEngagementData({...engagementData, found_competition_how: value})}
                    placeholder="What drew you to this competition?"
                    rows={3}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <FormInput
                    label="Interest in future BLKOUT initiatives"
                    type="textarea"
                    value={engagementData.interested_in_future}
                    onChange={(value) => setEngagementData({...engagementData, interested_in_future: value})}
                    placeholder="Would you be interested in organizing local events, joining a 2026 Photography Award, participating in Pride activities, etc.?"
                    rows={3}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <FormInput
                    label="Feedback on this competition"
                    type="textarea"
                    value={engagementData.feedback_on_competition}
                    onChange={(value) => setEngagementData({...engagementData, feedback_on_competition: value})}
                    placeholder="Any suggestions, concerns, or thoughts about this pilot competition?"
                    rows={3}
                  />
                </div>
              </div>
            </motion.section>

            {/* Consent */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="relative mb-12">
                <div className="absolute inset-0 bg-rose-400/10 rounded-2xl blur-2xl"></div>
                <div className="relative bg-gradient-to-br from-rose-500/5 to-rose-600/5 backdrop-blur-sm border border-rose-400/20 rounded-2xl p-8">
                  <h2 className="text-3xl font-light text-white mb-2 tracking-wide flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 mr-4 text-rose-400" />
                    Permissions
                  </h2>
                  <div className="w-16 h-px bg-gradient-to-r from-rose-400 to-transparent mx-auto"></div>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="relative mt-1">
                    <input
                      type="checkbox"
                      checked={submission.consent.media_usage}
                      onChange={(e) => setSubmission({
                        ...submission, 
                        consent: {...submission.consent, media_usage: e.target.checked}
                      })}
                      className="w-5 h-5 text-emerald-500 bg-white/10 border-white/20 rounded focus:ring-emerald-400 focus:ring-2 focus:ring-offset-0"
                      required
                    />
                  </div>
                  <label className="text-white/90 leading-relaxed font-light">
                    <span className="text-emerald-300 font-medium">Media Usage Permission (Required):</span> I give BLKOUT permission to display my photo 
                    in competition materials, website, and promotional content with proper attribution.
                  </label>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="relative mt-1">
                    <input
                      type="checkbox"
                      checked={submission.consent.social_sharing}
                      onChange={(e) => setSubmission({
                        ...submission, 
                        consent: {...submission.consent, social_sharing: e.target.checked}
                      })}
                      className="w-5 h-5 text-emerald-500 bg-white/10 border-white/20 rounded focus:ring-emerald-400 focus:ring-2 focus:ring-offset-0"
                      required
                    />
                  </div>
                  <label className="text-white/90 leading-relaxed font-light">
                    <span className="text-emerald-300 font-medium">Social Media Sharing (Required):</span> I consent to BLKOUT sharing my photo on social 
                    media platforms with proper attribution and photographer credit.
                  </label>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="relative mt-1">
                    <input
                      type="checkbox"
                      checked={submission.consent.archive_inclusion}
                      onChange={(e) => setSubmission({
                        ...submission, 
                        consent: {...submission.consent, archive_inclusion: e.target.checked}
                      })}
                      className="w-5 h-5 text-emerald-500 bg-white/10 border-white/20 rounded focus:ring-emerald-400 focus:ring-2 focus:ring-offset-0"
                    />
                  </div>
                  <label className="text-white/90 leading-relaxed font-light">
                    <span className="text-violet-300 font-medium">Archive Inclusion (Optional):</span> I consent to my photo being included in BLKOUT's 
                    permanent digital archive of Black QTIPOC+ community perspectives.
                  </label>
                </div>
              </div>
            </motion.section>

            {/* Submit Button */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center pt-12"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={!validateForm() || loading}
                className="relative group"
              >
                <div className={`absolute inset-0 rounded-2xl blur-xl transition-all duration-500 ${
                  validateForm() && !loading
                    ? 'bg-gradient-to-r from-emerald-500 to-violet-500 group-hover:blur-2xl'
                    : 'bg-gray-600/30'
                }`}></div>
                <div className={`relative backdrop-blur-sm border rounded-2xl px-16 py-6 flex items-center justify-center transition-all duration-300 ${
                  validateForm() && !loading
                    ? 'bg-gradient-to-r from-emerald-500/80 to-violet-500/80 border-white/20 text-white'
                    : 'bg-gray-600/50 border-gray-500/30 text-gray-400 cursor-not-allowed'
                }`}>
                  {loading ? (
                    <>
                      <Loader className="w-6 h-6 mr-4 animate-spin" />
                      <span className="text-xl font-light tracking-wide">Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 mr-4" />
                      <span className="text-xl font-light tracking-wide">Submit Your Perspective</span>
                    </>
                  )}
                </div>
              </motion.button>
              
              {!validateForm() && (
                <p className="text-white/50 mt-6 font-light">
                  Please complete all required fields and consent checkboxes
                </p>
              )}
            </motion.div>
          </div>
        </motion.div>
        </div>
        
        <PlatformFooter />
      </div>
    )
  }

  // Success Section - PageAI Style
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-violet-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(16,185,129,0.15),transparent)] bg-[radial-gradient(circle_at_60%_60%,rgba(139,92,246,0.15),transparent)]"></div>
      
      {/* Floating Elements */}
      <motion.div 
        animate={{ 
          y: [-20, 20, -20],
          rotate: [0, 360]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-24 right-24 w-8 h-8 border border-emerald-400/30 rounded-full blur-sm"
      ></motion.div>
      <motion.div 
        animate={{ 
          y: [20, -20, 20],
          rotate: [360, 0]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute bottom-32 left-20 w-6 h-6 bg-violet-400/20 rounded-full blur-lg"
      ></motion.div>

      <PrimaryNavigationEnhanced />
      
      <div className="relative z-10 max-w-5xl mx-auto px-8 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Success Animation */}
          <div className="relative mb-16">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 15, -15, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-block relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-violet-400 rounded-full blur-2xl opacity-50"></div>
              <div className="relative bg-gradient-to-br from-emerald-500/20 to-violet-500/20 backdrop-blur-sm border border-white/10 rounded-full p-12">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
            </motion.div>
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-thin mb-12 tracking-tight"
          >
            <span className="bg-gradient-to-r from-emerald-400 via-white to-violet-400 bg-clip-text text-transparent">
              SUBMISSION
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-rose-400 to-emerald-400 bg-clip-text text-transparent font-light">
              RECEIVED
            </span>
          </motion.h1>
          
          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative max-w-4xl mx-auto mb-16"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-violet-500/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-white/5 to-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-12">
              <div className="flex items-center justify-center mb-8">
                <Sparkles className="w-8 h-8 text-emerald-400 mr-3" />
                <h3 className="text-2xl font-light text-white tracking-wide">Thank You!</h3>
                <Sparkles className="w-8 h-8 text-violet-400 ml-3" />
              </div>
              
              <p className="text-xl text-white/80 mb-8 leading-relaxed font-light">
                Thank you for contributing your perspective to BLKOUT Lens! Your submission helps us 
                assess community engagement and build toward our 2026 Photography Award.
              </p>
              
              <div className="text-left max-w-2xl mx-auto">
                <h4 className="text-lg text-emerald-300 mb-6 font-medium">Next Steps:</h4>
                <div className="space-y-4 text-white/70 font-light">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>You'll receive photo submission instructions via email within 24 hours</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Follow @blkoutuk for competition updates and community highlights</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-rose-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Join BLKOUTHUB for community discussions about the project</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Results and insights will be shared in our newsletter</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid md:grid-cols-2 gap-8 mb-16 max-w-2xl mx-auto"
          >
            <motion.a
              href="https://blkouthub.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-violet-500 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-gradient-to-r from-emerald-500/80 to-violet-500/80 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-4 flex items-center justify-center">
                <Users className="w-5 h-5 mr-3 text-white" />
                <span className="text-white font-light tracking-wide">Join Community</span>
              </div>
            </motion.a>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentStep('intro')}
              className="relative group"
            >
              <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-4 flex items-center justify-center hover:border-white/30 transition-all duration-300">
                <Eye className="w-5 h-5 mr-3 text-white" />
                <span className="text-white font-light tracking-wide">View Competition</span>
              </div>
            </motion.button>
          </motion.div>

          {/* Closing Message */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-white/60 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Your participation contributes to action research that will guide BLKOUT's development 
            of community-controlled cultural infrastructure. Thank you for being part of building 
            the liberation we need.
          </motion.p>
        </motion.div>
      </div>
      
      <PlatformFooter />
    </div>
  )
}