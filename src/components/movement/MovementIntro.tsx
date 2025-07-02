'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, Users, Target, TrendingUp, ExternalLink, 
  ArrowRight, Download, PlayCircle, FileText, Globe, 
  Heart, Zap, Shield
} from 'lucide-react'
import MagazineLayout from '../magazine/MagazineLayout'
import RetroImage from '../blkout/RetroImage'

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
  color: string
}

const movementPrinciples: Principle[] = [
  {
    id: '1',
    title: 'Collective Ownership',
    description: 'Economic democracy through shared ownership of the means of production and decision-making power.',
    icon: Users,
    color: 'from-electric-magenta to-electric-cyan'
  },
  {
    id: '2',
    title: 'Racial Justice',
    description: 'Centering Black and Brown liberation in all economic and social transformation work.',
    icon: Heart,
    color: 'from-electric-cyan to-electric-indigo'
  },
  {
    id: '3',
    title: 'Queer Liberation',
    description: 'Building systems that celebrate and protect the full spectrum of gender and sexual identity.',
    icon: Shield,
    color: 'from-electric-indigo to-electric-green'
  },
  {
    id: '4',
    title: 'Community Power',
    description: 'Grassroots organizing that builds collective capacity for systemic change.',
    icon: Zap,
    color: 'from-electric-green to-electric-magenta'
  }
]

const featuredResources: Resource[] = [
  {
    id: '1',
    title: 'Starting a Worker Cooperative',
    description: 'Complete guide to forming worker-owned businesses, from legal structures to governance models.',
    type: 'guide',
    category: 'Cooperative Development',
    downloadUrl: '#',
    isNew: true
  },
  {
    id: '2',
    title: 'Community Land Trust Toolkit',
    description: 'Resources for creating community-controlled land ownership and preventing displacement.',
    type: 'toolkit',
    category: 'Housing Justice',
    downloadUrl: '#'
  },
  {
    id: '3',
    title: 'Economic Democracy in Action',
    description: 'Video series documenting successful cooperative businesses led by communities of color.',
    type: 'video',
    category: 'Case Studies',
    previewUrl: '#'
  },
  {
    id: '4',
    title: 'Mutual Aid Network Template',
    description: 'Organizational templates and best practices for community support networks.',
    type: 'template',
    category: 'Community Care',
    downloadUrl: '#'
  },
  {
    id: '5',
    title: 'State of the Movement 2024',
    description: 'Annual report on cooperative economy growth and impact in Black communities.',
    type: 'report',
    category: 'Research',
    downloadUrl: '#'
  },
  {
    id: '6',
    title: 'Fundraising for Cooperatives',
    description: 'Alternative funding strategies that maintain community ownership and values.',
    type: 'guide',
    category: 'Finance',
    downloadUrl: '#'
  }
]

export default function MovementIntro() {
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

  const getResourceColor = (type: string) => {
    switch (type) {
      case 'guide': return 'bg-electric-magenta'
      case 'toolkit': return 'bg-electric-cyan'
      case 'report': return 'bg-electric-indigo'
      case 'video': return 'bg-electric-green'
      case 'template': return 'bg-purple-600'
      default: return 'bg-gray-600'
    }
  }

  return (
    <MagazineLayout
      title="Movement Building"
      subtitle="Resources for economic democracy and cooperative power"
    >
      <div className="py-8">
        {/* Hero Section with Retro Image */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Building the Cooperative Economy
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                The future we need won't emerge from individual success in broken systems. 
                It requires collective ownership, shared power, and economic democracy that 
                centers racial and queer liberation.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-electric-magenta text-white rounded-lg hover:bg-electric-cyan transition-colors font-semibold"
                >
                  <span>Join the Hub</span>
                  <ExternalLink className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-electric-magenta text-electric-magenta rounded-lg hover:bg-electric-magenta hover:text-white transition-colors font-semibold"
                >
                  <span>Browse Resources</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            <div className="aspect-[4/3] rounded-xl overflow-hidden">
              <RetroImage
                src="/src/assets/images/John Henry.png"
                alt="Breaking through systemic barriers together"
                vcrIntensity="medium"
                className="w-full h-full"
                overlayContent={
                  <div className="text-center p-6 bg-black/60 backdrop-blur-sm rounded-lg border border-white/20">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Breaking Through Systems
                    </h3>
                    <p className="text-gray-200">
                      Every barrier becomes a doorway when we build together
                    </p>
                  </div>
                }
              />
            </div>
          </div>
        </motion.section>

        {/* Movement Principles */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Foundation</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide our work toward economic democracy and collective liberation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {movementPrinciples.map((principle, index) => {
              const IconComponent = principle.icon
              
              return (
                <motion.div
                  key={principle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all text-center group"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${principle.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {principle.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {principle.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Featured Resources */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Essential Resources</h2>
              <p className="text-gray-600">Tools and guides for building cooperative power in your community</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-electric-magenta text-white rounded-lg hover:bg-electric-cyan transition-colors"
            >
              <span>Full Library</span>
              <ExternalLink className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredResources.map((resource, index) => {
              const IconComponent = getResourceIcon(resource.type)
              
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  whileHover={{ scale: 1.02, y: -3 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2 rounded-lg ${getResourceColor(resource.type)}`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    
                    {resource.isNew && (
                      <span className="px-2 py-1 bg-electric-green text-white text-xs rounded-full font-semibold">
                        NEW
                      </span>
                    )}
                  </div>

                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {resource.category}
                  </span>

                  <h3 className="text-lg font-semibold text-gray-900 mt-3 mb-2 group-hover:text-electric-magenta transition-colors">
                    {resource.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {resource.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                      {resource.type}
                    </span>
                    
                    <div className="flex items-center space-x-2">
                      {resource.previewUrl && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 text-gray-400 hover:text-electric-cyan transition-colors"
                        >
                          <PlayCircle className="w-4 h-4" />
                        </motion.button>
                      )}
                      
                      {resource.downloadUrl && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 text-gray-400 hover:text-electric-magenta transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      )}
                      
                      <ArrowRight className="w-4 h-4 text-electric-magenta group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* BLKOUTHUB CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-electric-indigo to-electric-magenta rounded-2xl p-12 text-white">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-5xl mb-6"
            >
              🚀
            </motion.div>
            
            <h2 className="text-3xl font-bold mb-4">
              Take Action in BLKOUTHUB
            </h2>
            
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              These resources come alive in practice. Join ongoing projects, start new initiatives, 
              and connect with others building the cooperative economy in their communities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center space-x-2 px-8 py-4 bg-white text-electric-indigo rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                <span>Join Active Projects</span>
                <ExternalLink className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center space-x-2 px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-electric-indigo transition-colors font-semibold"
              >
                <span>Share Your Project</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.section>
      </div>
    </MagazineLayout>
  )
}