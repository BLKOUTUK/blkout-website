'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, Users, Target, TrendingUp, ExternalLink, 
  ArrowRight, Download, PlayCircle, FileText, Globe, 
  Heart, Zap, Shield, ChevronDown
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PrimaryNavigationEnhanced from '../layout/PrimaryNavigationEnhanced'
import PlatformFooter from '../layout/PlatformFooter'

interface Resource {
  id: string
  title: string
  description: string
  type: 'guide' | 'toolkit' | 'report' | 'video' | 'template'
  category: string
  downloadUrl?: string
  previewUrl?: string
  isNew?: boolean
}

interface Principle {
  id: string
  title: string
  description: string
  icon: any
  gradient: string
}

const movementPrinciples: Principle[] = [
  {
    id: '1',
    title: 'COLLECTIVE OWNERSHIP',
    description: 'Economic democracy through shared ownership of the means of production and decision-making power.',
    icon: Users,
    gradient: 'from-emerald-500 to-indigo-600'
  },
  {
    id: '2',
    title: 'RACIAL JUSTICE',
    description: 'Centering Black and Brown liberation in all economic and social transformation work.',
    icon: Heart,
    gradient: 'from-indigo-500 to-violet-600'
  },
  {
    id: '3',
    title: 'QUEER LIBERATION',
    description: 'Building systems that celebrate and protect the full spectrum of gender and sexual identity.',
    icon: Shield,
    gradient: 'from-violet-500 to-emerald-600'
  },
  {
    id: '4',
    title: 'COMMUNITY POWER',
    description: 'Grassroots organizing that builds collective capacity for systemic change.',
    icon: Zap,
    gradient: 'from-slate-500 to-blue-600'
  }
]

const featuredResources: Resource[] = [
  {
    id: '1',
    title: 'STARTING A WORKER COOPERATIVE',
    description: 'Complete guide to forming worker-owned businesses, from legal structures to governance models.',
    type: 'guide',
    category: 'Cooperative Development',
    downloadUrl: '#',
    isNew: true
  },
  {
    id: '2',
    title: 'COMMUNITY LAND TRUST TOOLKIT',
    description: 'Resources for creating community-controlled land ownership and preventing displacement.',
    type: 'toolkit',
    category: 'Housing Justice',
    downloadUrl: '#'
  },
  {
    id: '3',
    title: 'ECONOMIC DEMOCRACY IN ACTION',
    description: 'Video series documenting successful cooperative businesses led by communities of color.',
    type: 'video',
    category: 'Case Studies',
    previewUrl: '#'
  },
  {
    id: '4',
    title: 'MUTUAL AID NETWORK TEMPLATE',
    description: 'Organizational templates and best practices for community support networks.',
    type: 'template',
    category: 'Community Care',
    downloadUrl: '#'
  },
  {
    id: '5',
    title: 'STATE OF THE MOVEMENT 2024',
    description: 'Annual report on cooperative economy growth and impact in Black communities.',
    type: 'report',
    category: 'Research',
    downloadUrl: '#'
  },
  {
    id: '6',
    title: 'FUNDRAISING FOR COOPERATIVES',
    description: 'Alternative funding strategies that maintain community ownership and values.',
    type: 'guide',
    category: 'Finance',
    downloadUrl: '#'
  }
]

// Movement Hero Section
const MovementHero = () => (
  <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 overflow-hidden">
    {/* Background pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500 rounded-full blur-3xl"></div>
    </div>
    
    <div className="relative z-10 max-w-7xl mx-auto px-8 py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-indigo-300 text-xl font-mono uppercase tracking-widest mb-6"
          >
            MOVEMENT BUILDING
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black heading-block leading-none mb-8"
          >
            <span className="bg-gradient-to-r from-emerald-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              COOPERATIVE
            </span>
            <br />
            <span className="bg-gradient-to-r from-slate-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              ECONOMY
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl md:text-2xl text-indigo-100 leading-relaxed font-light mb-12 max-w-2xl"
          >
            The future we need won't emerge from individual success in broken systems. 
            It requires collective ownership, shared power, and economic democracy that 
            centers racial and queer liberation.
          </motion.p>

          {/* Movement CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <Link 
              to="/community"
              className="px-12 py-4 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-black text-lg hover:from-emerald-500 hover:to-indigo-500 transition-all duration-300 shadow-xl hover:shadow-2xl heading-block uppercase tracking-wide flex items-center justify-center"
            >
              <Users className="w-6 h-6 mr-3" />
              JOIN THE HUB
            </Link>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-12 py-4 border-2 border-indigo-400 text-indigo-100 font-black text-lg hover:bg-indigo-400 hover:text-indigo-900 transition-all duration-300 heading-block uppercase tracking-wide flex items-center justify-center"
            >
              <BookOpen className="w-6 h-6 mr-3" />
              BROWSE RESOURCES
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="aspect-[4/3] overflow-hidden relative"
        >
          <img
            src="/images/blkoutuk.com v3/John Henry.png"
            alt="Breaking through systemic barriers together"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-8 left-8 right-8">
            <div className="bg-indigo-900/90 backdrop-blur-sm border border-indigo-700/50 p-6">
              <h3 className="text-xl font-black text-white heading-block mb-2 uppercase">
                BREAKING THROUGH SYSTEMS
              </h3>
              <p className="text-indigo-100 font-light">
                Every barrier becomes a doorway when we build together
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center text-indigo-300"
        >
          <span className="text-sm font-mono uppercase tracking-wider mb-2">EXPLORE</span>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </div>
  </section>
)

// Movement Principles Section
const MovementPrinciples = () => (
  <section className="py-24 bg-indigo-50/5 backdrop-blur-sm">
    <div className="max-w-6xl mx-auto px-8">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black heading-block mb-6 uppercase"
        >
          <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
            OUR
          </span>
          <span className="bg-gradient-to-r from-violet-400 to-slate-400 bg-clip-text text-transparent ml-4">
            FOUNDATION
          </span>
        </motion.h2>
        <p className="text-xl text-indigo-100 font-light leading-relaxed max-w-3xl mx-auto">
          The principles that guide our work toward economic democracy and collective liberation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {movementPrinciples.map((principle, index) => {
          const IconComponent = principle.icon
          
          return (
            <motion.div
              key={principle.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 p-8 hover:bg-indigo-900/50 transition-all duration-500 text-center group"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${principle.gradient} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-black heading-block mb-4 uppercase">
                <span className={`bg-gradient-to-r ${principle.gradient} bg-clip-text text-transparent`}>
                  {principle.title}
                </span>
              </h3>
              
              <p className="text-indigo-100 leading-relaxed font-light">
                {principle.description}
              </p>
            </motion.div>
          )
        })}
      </div>
    </div>
  </section>
)

// Enhanced Resources Section
const ResourcesSection = () => {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'guide': return BookOpen
      case 'toolkit': return Target
      case 'report': return FileText
      case 'video': return PlayCircle
      case 'template': return Download
      default: return FileText
    }
  }

  const getResourceGradient = (type: string) => {
    switch (type) {
      case 'guide': return 'from-indigo-500 to-violet-600'
      case 'toolkit': return 'from-emerald-500 to-blue-600'
      case 'report': return 'from-slate-500 to-indigo-600'
      case 'video': return 'from-violet-500 to-emerald-600'
      case 'template': return 'from-blue-500 to-slate-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex items-center justify-between mb-16">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black heading-block mb-4 uppercase"
            >
              <span className="bg-gradient-to-r from-slate-400 to-indigo-400 bg-clip-text text-transparent">
                ESSENTIAL
              </span>
              <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent ml-4">
                RESOURCES
              </span>
            </motion.h2>
            <p className="text-indigo-200 font-light text-lg">
              Tools and guides for building cooperative power in your community
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-bold hover:from-emerald-500 hover:to-indigo-500 transition-all heading-block uppercase flex items-center"
          >
            FULL LIBRARY
            <ExternalLink className="w-4 h-4 ml-2" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredResources.map((resource, index) => {
            const IconComponent = getResourceIcon(resource.type)
            const gradient = getResourceGradient(resource.type)
            
            return (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -3 }}
                className="bg-indigo-900/20 backdrop-blur-sm border border-indigo-700/20 p-8 hover:bg-indigo-900/40 transition-all duration-500 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  {resource.isNew && (
                    <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold heading-block uppercase">
                      NEW
                    </span>
                  )}
                </div>

                <span className="px-3 py-1 bg-indigo-800/50 text-indigo-200 text-xs font-bold heading-block uppercase mb-4 inline-block">
                  {resource.category}
                </span>

                <h3 className="text-xl font-black heading-block mb-4 leading-tight uppercase">
                  <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                    {resource.title}
                  </span>
                </h3>

                <p className="text-indigo-100 mb-6 leading-relaxed font-light">
                  {resource.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-indigo-400 uppercase tracking-wide font-bold heading-block">
                    {resource.type}
                  </span>
                  
                  <div className="flex items-center space-x-3">
                    {resource.previewUrl && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-indigo-400 hover:text-white transition-colors"
                      >
                        <PlayCircle className="w-5 h-5" />
                      </motion.button>
                    )}
                    
                    {resource.downloadUrl && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-indigo-400 hover:text-white transition-colors"
                      >
                        <Download className="w-5 h-5" />
                      </motion.button>
                    )}
                    
                    <ArrowRight className="w-5 h-5 text-indigo-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Enhanced BLKOUTHUB CTA
const BlkoutHubCTA = () => (
  <section className="py-24">
    <div className="max-w-5xl mx-auto px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-br from-emerald-600 via-indigo-600 to-violet-600 p-16 text-center relative overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative z-10">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-6xl mb-8"
          >
            🚀
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-black text-white heading-block mb-6 uppercase">
            TAKE ACTION IN
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              BLKOUTHUB
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            These resources come alive in practice. Join ongoing projects, start new initiatives, 
            and connect with others building the cooperative economy in their communities.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/community"
              className="px-12 py-4 bg-white text-indigo-900 font-black text-lg hover:bg-gray-100 transition-colors heading-block uppercase flex items-center justify-center"
            >
              <Users className="w-6 h-6 mr-3" />
              JOIN ACTIVE PROJECTS
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-12 py-4 border-2 border-white text-white font-black text-lg hover:bg-white hover:text-indigo-900 transition-colors heading-block uppercase flex items-center justify-center"
            >
              <Target className="w-6 h-6 mr-3" />
              SHARE YOUR PROJECT
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
)

export default function MovementIntroEnhanced() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900">
      {/* Enhanced Navigation */}
      <PrimaryNavigationEnhanced />
      
      {/* Movement Hero */}
      <MovementHero />
      
      {/* Movement Principles */}
      <MovementPrinciples />
      
      {/* Resources Section */}
      <ResourcesSection />
      
      {/* BLKOUTHUB CTA */}
      <BlkoutHubCTA />
      
      {/* Platform Footer */}
      <PlatformFooter />
    </div>
  )
}