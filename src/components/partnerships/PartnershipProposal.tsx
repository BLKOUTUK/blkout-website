'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, Lock, Eye, EyeOff, Users, Award, TrendingUp, 
  Target, Globe, Sparkles, Camera, Calendar, MapPin,
  Heart, Zap, ArrowRight, Download, ExternalLink,
  BarChart3, PieChart, LineChart, Users2, Building2,
  Handshake, Star, CheckCircle, Phone, Mail, Linkedin
} from 'lucide-react'
import PrimaryNavigationEnhanced from '../layout/PrimaryNavigationEnhanced'
import PlatformFooter from '../layout/PlatformFooter'

interface PartnershipMetrics {
  community_reach: number
  engagement_rate: number
  geographic_spread: number
  partnership_value: string
  roi_projection: string
}

interface PartnershipBenefit {
  id: string
  title: string
  description: string
  icon: any
  value: string
  gradient: string
}

const PARTNERSHIP_BENEFITS: PartnershipBenefit[] = [
  {
    id: 'brand-alignment',
    title: 'Brand Alignment',
    description: 'Associate with authentic Black queer liberation and community empowerment',
    icon: Heart,
    value: 'Authentic Community Connection',
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'audience-reach',
    title: 'Audience Reach',
    description: 'Access engaged QTIPOC+ communities across multiple platforms and regions',
    icon: Users2,
    value: '10K+ Active Community',
    gradient: 'from-violet-500 to-purple-600'
  },
  {
    id: 'content-creation',
    title: 'Content Pipeline',
    description: 'High-quality, diverse visual content for marketing and social media',
    icon: Camera,
    value: '100+ Competition Entries',
    gradient: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'data-insights',
    title: 'Market Insights',
    description: 'Action research data on community engagement and cultural trends',
    icon: BarChart3,
    value: 'Baseline Research Data',
    gradient: 'from-rose-500 to-pink-600'
  },
  {
    id: 'future-pipeline',
    title: 'Future Pipeline',
    description: 'Foundation for 2026 Photography Award and Pride Tour initiatives',
    icon: Star,
    value: '2026 Strategic Partnership',
    gradient: 'from-amber-500 to-orange-600'
  },
  {
    id: 'social-impact',
    title: 'Social Impact',
    description: 'Measurable contribution to Black QTIPOC+ cultural infrastructure',
    icon: Zap,
    value: 'Cultural Infrastructure',
    gradient: 'from-green-500 to-emerald-600'
  }
]

const PARTNERSHIP_TIERS = [
  {
    id: 'community',
    title: 'Community Partner',
    price: '£500-£1,500',
    benefits: [
      'Logo placement on competition page',
      'Social media mentions across platforms',
      'Access to competition photo gallery',
      'Community newsletter feature'
    ],
    gradient: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-400/30'
  },
  {
    id: 'cultural',
    title: 'Cultural Sponsor',
    price: '£2,000-£5,000',
    benefits: [
      'All Community Partner benefits',
      'Dedicated partnership announcement',
      'Category naming rights option',
      'Winner announcement collaboration',
      'Access to baseline research insights'
    ],
    gradient: 'from-violet-500/20 to-purple-500/20',
    border: 'border-violet-400/30',
    featured: true
  },
  {
    id: 'strategic',
    title: 'Strategic Alliance',
    price: '£5,000+',
    benefits: [
      'All Cultural Sponsor benefits',
      '2026 Photography Award partnership',
      'Co-branded content creation',
      'Community advisory board seat',
      'Custom partnership activation',
      'Pride Tour 2026 collaboration'
    ],
    gradient: 'from-rose-500/20 to-pink-500/20',
    border: 'border-rose-400/30'
  }
]

// Password Protection Component
const PasswordGate: React.FC<{ onAuthenticated: () => void }> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simple password check - in production, this would be more secure
    if (password === 'blkout2025' || password === 'partnership2025') {
      setTimeout(() => {
        onAuthenticated()
        setLoading(false)
      }, 1000)
    } else {
      setError('Invalid access code. Please contact BLKOUT for partnership access.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-violet-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent)] bg-[radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.15),transparent)]"></div>
      
      {/* Floating Elements */}
      <motion.div 
        animate={{ y: [-20, 20, -20], rotate: [0, 360] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-24 sm:top-28 lg:top-32 right-20 w-8 h-8 border border-emerald-400/30 rounded-full blur-sm"
      ></motion.div>

      <PrimaryNavigationEnhanced />
      
      {/* Main Content Container - Account for sticky nav heights: h-14 sm:h-16 lg:h-20 */}
      <div className="relative z-10 pt-20 sm:pt-24 lg:pt-28 pb-12 min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] lg:min-h-[calc(100vh-6rem)] flex items-center justify-center">
        <div className="max-w-lg mx-auto px-8 py-12 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Lock Icon */}
          <div className="relative mb-12">
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-violet-400 rounded-3xl blur-2xl opacity-40"></div>
              <div className="relative bg-gradient-to-br from-emerald-500/20 to-violet-500/20 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <Shield className="w-16 h-16 text-white" />
                <motion.div
                  animate={{ rotate: [0, -360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Lock className="w-20 h-20 text-emerald-400/30" />
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black font-display uppercase mb-8 tracking-tight">
            <span className="bg-gradient-to-r from-emerald-400 via-white to-violet-400 bg-clip-text text-transparent">
              Partnership
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-rose-400 to-emerald-400 bg-clip-text text-transparent">
              Portal
            </span>
          </h1>
          
          <p className="text-white/70 mb-12 font-light leading-relaxed max-w-md mx-auto">
            Access exclusive partnership proposal for BLKOUT Lens 2025 Photo Competition
          </p>

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-8 max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-white/5 rounded-2xl blur-sm"></div>
              <div className="relative">
                <label className="block text-sm font-semibold font-display uppercase text-white/80 mb-3 tracking-wide">
                  Partnership Access Code
                </label>
                <div className="flex">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter access code"
                    className="flex-1 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-l-2xl text-white/90 placeholder-white/40 focus:border-emerald-400/50 focus:outline-none transition-all duration-300 text-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="px-4 bg-white/5 backdrop-blur-sm border border-l-0 border-white/10 rounded-r-2xl text-white/60 hover:text-white/90 transition-colors flex items-center justify-center"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm font-light"
              >
                {error}
              </motion.div>
            )}
            
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full relative group mt-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-violet-500 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-gradient-to-r from-emerald-500/80 to-violet-500/80 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-5 flex items-center justify-center">
                {loading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-3"></div>
                    <span className="text-white font-bold font-display uppercase tracking-wide text-lg">Authenticating...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-6 h-6 mr-3 text-white" />
                    <span className="text-white font-bold font-display uppercase tracking-wide text-lg">Access Partnership Proposal</span>
                  </>
                )}
              </div>
            </motion.button>
          </form>
          
          <div className="mt-8 space-y-4">
            <p className="text-white/40 text-sm font-light text-center">
              Partnership access code provided during partnership discussions
            </p>
            <div className="border-t border-white/10 pt-6">
              <p className="text-white/60 text-sm font-light text-center mb-4">
                Partnership Inquiry? Contact us directly:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:partnerships@blkout.org.uk"
                  className="inline-flex items-center justify-center px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white/70 hover:text-white/90 transition-all duration-300 text-sm"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  partnerships@blkout.org.uk
                </a>
                <a 
                  href="/photo-competition"
                  className="inline-flex items-center justify-center px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white/70 hover:text-white/90 transition-all duration-300 text-sm"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  View Competition
                </a>
              </div>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  )
}

// Main Partnership Proposal Component
const PartnershipContent: React.FC = () => {
  const [metrics, setMetrics] = useState<PartnershipMetrics>({
    community_reach: 12500,
    engagement_rate: 8.7,
    geographic_spread: 15,
    partnership_value: '£25,000',
    roi_projection: '340%'
  })

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-violet-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(16,185,129,0.1),transparent)] bg-[radial-gradient(circle_at_80%_70%,rgba(139,92,246,0.1),transparent)]"></div>
      
      <PrimaryNavigationEnhanced />
      
      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-20 sm:pt-24 lg:pt-28 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="relative mb-12">
            <motion.div
              animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-violet-400 rounded-3xl blur-2xl opacity-40"></div>
              <div className="relative bg-gradient-to-br from-emerald-500/20 to-violet-500/20 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <Handshake className="w-16 h-16 text-white" />
              </div>
            </motion.div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black font-display uppercase mb-8 tracking-tight">
            <span className="bg-gradient-to-r from-emerald-400 via-white to-violet-400 bg-clip-text text-transparent">
              BLKOUT LENS
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-rose-400 to-emerald-400 bg-clip-text text-transparent">
              PARTNERSHIP
            </span>
          </h1>
          
          <div className="inline-block bg-gradient-to-r from-emerald-500/10 to-violet-500/10 backdrop-blur-sm border border-white/10 rounded-full px-8 py-4 mb-8">
            <span className="text-white/80 font-bold font-display uppercase tracking-widest text-sm">2025 Photo Competition Partnership Proposal</span>
          </div>
          
          <p className="text-2xl md:text-3xl text-white/70 leading-relaxed font-light max-w-5xl mx-auto tracking-wide mb-12">
            Strategic Partnership Opportunity for Community-Powered Cultural Infrastructure
          </p>
          
          <div className="w-32 h-px bg-gradient-to-r from-emerald-400 to-violet-400 mx-auto"></div>
        </motion.div>

        {/* Key Metrics Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black font-display uppercase mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
                Partnership Impact
              </span>
            </h2>
            <p className="text-xl text-white/70 font-light max-w-3xl mx-auto">
              Measurable outcomes and community engagement metrics
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-emerald-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 backdrop-blur-sm border border-emerald-400/20 rounded-3xl p-8 text-center">
                <Users2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <div className="text-4xl font-black font-display text-white mb-2">
                  {metrics.community_reach.toLocaleString()}+
                </div>
                <div className="text-emerald-300 font-bold font-display uppercase text-sm tracking-widest">Community Reach</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-violet-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-gradient-to-br from-violet-500/10 to-violet-600/10 backdrop-blur-sm border border-violet-400/20 rounded-3xl p-8 text-center">
                <TrendingUp className="w-12 h-12 text-violet-400 mx-auto mb-4" />
                <div className="text-4xl font-black font-display text-white mb-2">
                  {metrics.engagement_rate}%
                </div>
                <div className="text-violet-300 font-bold font-display uppercase text-sm tracking-widest">Engagement Rate</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-blue-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm border border-blue-400/20 rounded-3xl p-8 text-center">
                <Globe className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <div className="text-4xl font-black font-display text-white mb-2">
                  {metrics.geographic_spread}
                </div>
                <div className="text-blue-300 font-bold font-display uppercase text-sm tracking-widest">Cities Reached</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-rose-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-gradient-to-br from-rose-500/10 to-rose-600/10 backdrop-blur-sm border border-rose-400/20 rounded-3xl p-8 text-center">
                <BarChart3 className="w-12 h-12 text-rose-400 mx-auto mb-4" />
                <div className="text-4xl font-black font-display text-white mb-2">
                  {metrics.roi_projection}
                </div>
                <div className="text-rose-300 font-bold font-display uppercase text-sm tracking-widest">ROI Projection</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Partnership Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black font-display uppercase mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
                Partnership Benefits
              </span>
            </h2>
            <p className="text-xl text-white/70 font-light max-w-3xl mx-auto">
              Strategic value propositions for organizational partners
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {PARTNERSHIP_BENEFITS.map((benefit, index) => {
              const IconComponent = benefit.icon
              
              return (
                <motion.div
                  key={benefit.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="relative group w-full max-w-sm"
                >
                  <div className="absolute inset-0 bg-white/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative bg-gradient-to-br from-white/5 to-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-500 h-full">
                    <div className={`w-16 h-16 bg-gradient-to-br ${benefit.gradient} flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold font-display uppercase text-white mb-4 tracking-wide">
                      {benefit.title}
                    </h3>
                    
                    <p className="text-white/70 leading-relaxed font-light mb-6">
                      {benefit.description}
                    </p>
                    
                    <div className={`inline-block bg-gradient-to-r ${benefit.gradient} text-white text-xs font-bold font-display uppercase px-3 py-1 rounded-full tracking-wide`}>
                      {benefit.value}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Partnership Tiers */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black font-display uppercase mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
                Partnership Tiers
              </span>
            </h2>
            <p className="text-xl text-white/70 font-light max-w-3xl mx-auto">
              Flexible partnership levels to match organizational capacity and goals
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 justify-items-center max-w-6xl mx-auto">
            {PARTNERSHIP_TIERS.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`relative group w-full max-w-sm ${tier.featured ? 'lg:scale-105 lg:z-10' : ''}`}
              >
                {tier.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs font-bold font-display uppercase px-4 py-2 rounded-full tracking-wide">
                      Recommended
                    </div>
                  </div>
                )}
                
                <div className={`absolute inset-0 ${tier.gradient} rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500`}></div>
                <div className={`relative bg-gradient-to-br from-white/5 to-white/5 backdrop-blur-lg border ${tier.border} rounded-3xl p-8 hover:border-white/20 transition-all duration-500`}>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold font-display uppercase text-white mb-4 tracking-wide">
                      {tier.title}
                    </h3>
                    <div className="text-4xl font-black font-display text-white mb-2">
                      {tier.price}
                    </div>
                    <div className="text-white/60 font-light text-sm">Per partnership agreement</div>
                  </div>
                  
                  <div className="space-y-4">
                    {tier.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <span className="text-white/80 font-light text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-violet-500/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-white/5 to-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-12">
              <h2 className="text-3xl font-bold font-display uppercase text-white mb-8 tracking-wide">
                Ready to Partner with BLKOUT?
              </h2>
              
              <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                Join us in building community-controlled cultural infrastructure that centers Black queer liberation and creates lasting social impact.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
                <motion.a
                  href="mailto:partnerships@blkout.org.uk"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-violet-500 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative bg-gradient-to-r from-emerald-500/80 to-violet-500/80 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-4 flex items-center justify-center">
                    <Mail className="w-5 h-5 mr-3 text-white" />
                    <span className="text-white font-bold font-display uppercase tracking-wide">Contact for Partnership</span>
                  </div>
                </motion.a>
                
                <motion.a
                  href="/photo-competition"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-4 flex items-center justify-center hover:border-white/30 transition-all duration-300">
                    <Camera className="w-5 h-5 mr-3 text-white" />
                    <span className="text-white font-bold font-display uppercase tracking-wide">View Competition</span>
                  </div>
                </motion.a>
              </div>
              
              <div className="flex flex-wrap justify-center gap-8 text-white/50 text-sm font-light">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Competition: Feb-May 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>Partnership ROI: 340%+</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <PlatformFooter />
    </div>
  )
}

export default function PartnershipProposal() {
  const [authenticated, setAuthenticated] = useState(false)

  if (!authenticated) {
    return <PasswordGate onAuthenticated={() => setAuthenticated(true)} />
  }

  return <PartnershipContent />
}