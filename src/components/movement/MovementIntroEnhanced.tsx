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

// Resources will be populated from real backend data
// Removed fake resources to maintain content authenticity
const featuredResources: Resource[] = []

// Movement Hero Section
const MovementHero = () => (
  <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-yellow-950 via-yellow-900 to-amber-900 overflow-hidden">
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
          <div className="bg-yellow-500 text-black p-2 text-center mb-4 font-bold rounded">
            🟡 ENHANCED MovementIntroEnhanced.tsx FILE (YELLOW)
          </div>
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
            <a 
              href="https://blkouthub.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-12 py-4 bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-black text-lg hover:from-yellow-500 hover:to-amber-500 transition-all duration-300 shadow-xl hover:shadow-2xl heading-block uppercase tracking-wide flex items-center justify-center"
            >
              <Users className="w-6 h-6 mr-3" />
              JOIN THE HUB
            </a>
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
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/40 via-transparent to-transparent"></div>
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
  <section className="py-24 bg-yellow-50/5 backdrop-blur-sm">
    <div className="max-w-6xl mx-auto px-8">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black heading-block mb-6 uppercase"
        >
          <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
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
              className="bg-yellow-900/30 backdrop-blur-sm border border-yellow-700/30 p-8 hover:bg-yellow-900/50 transition-all duration-500 text-center group"
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

// Resources In Development Section - Authentic messaging
const ResourcesSection = () => {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black heading-block mb-6 uppercase"
          >
            <span className="bg-gradient-to-r from-slate-400 to-indigo-400 bg-clip-text text-transparent">
              RESOURCES IN
            </span>
            <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent ml-4">
              DEVELOPMENT
            </span>
          </motion.h2>
          <p className="text-xl text-indigo-100 font-light leading-relaxed max-w-3xl mx-auto mb-8">
            We're actively building a comprehensive library of tools, guides, and resources 
            for cooperative movement building. Our community is developing authentic content 
            rooted in real organizing experience.
          </p>
        </div>

        {/* Development Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-indigo-900/20 backdrop-blur-sm border border-indigo-700/20 p-8 text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-black heading-block mb-4 uppercase text-emerald-400">
              ORGANIZING GUIDES
            </h3>
            <p className="text-indigo-100 leading-relaxed font-light">
              Community-tested strategies for building cooperative power
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-indigo-900/20 backdrop-blur-sm border border-indigo-700/20 p-8 text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-emerald-600 flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-black heading-block mb-4 uppercase text-violet-400">
              PRACTICAL TOOLKITS
            </h3>
            <p className="text-indigo-100 leading-relaxed font-light">
              Ready-to-use templates and frameworks from successful cooperatives
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-indigo-900/20 backdrop-blur-sm border border-indigo-700/20 p-8 text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-indigo-600 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-black heading-block mb-4 uppercase text-slate-400">
              IMPACT REPORTS
            </h3>
            <p className="text-indigo-100 leading-relaxed font-light">
              Data and stories from cooperative movements worldwide
            </p>
          </motion.div>
        </div>

        {/* Community Contribution CTA */}
        <div className="bg-gradient-to-br from-yellow-600/20 to-amber-600/20 border border-yellow-500/30 p-12 text-center">
          <h3 className="text-3xl font-black heading-block mb-6 uppercase">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              BUILD WITH US
            </span>
          </h3>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto leading-relaxed font-light">
            Have organizing experience to share? Resources from your cooperative? 
            We're building this library together with input from practitioners doing the work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/community"
              className="px-8 py-4 bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-black hover:from-yellow-500 hover:to-amber-500 transition-all heading-block uppercase flex items-center justify-center"
            >
              <Users className="w-5 h-5 mr-3" />
              CONTRIBUTE RESOURCES
            </Link>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 border-2 border-indigo-400 text-indigo-100 font-black hover:bg-indigo-400 hover:text-indigo-900 transition-all heading-block uppercase flex items-center justify-center"
            >
              <Globe className="w-5 h-5 mr-3" />
              GET UPDATES
            </motion.button>
          </div>
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
        className="bg-gradient-to-br from-yellow-600 via-amber-600 to-orange-600 p-16 text-center relative overflow-hidden"
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
            <span className="bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-950 via-yellow-900 to-amber-900">
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