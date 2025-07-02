'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, Users, Calendar, Zap, Heart, Mic, 
  Camera, Code, MessageCircle, Trophy, Settings,
  ArrowRight, Play, Star, TrendingUp
} from 'lucide-react'
import RetroImage from './RetroImage'
import RetroVideo from './RetroVideo'

interface BentoSection {
  id: string
  title: string
  subtitle?: string
  description: string
  icon: any
  href: string
  size: 'small' | 'medium' | 'large' | 'wide' | 'tall'
  type: 'feature' | 'media' | 'stats' | 'action'
  media?: {
    type: 'image' | 'video'
    src: string
    alt: string
  }
  stats?: {
    number: string
    label: string
  }
  color: string
  isNew?: boolean
  isPopular?: boolean
}

const bentoSections: BentoSection[] = [
  // Row 1 - Main Features
  {
    id: 'stories',
    title: 'Stories & Analysis',
    subtitle: 'Deep Reads',
    description: 'Personal narratives, cultural analysis, and creative works from our community',
    icon: BookOpen,
    href: '/stories',
    size: 'large',
    type: 'feature',
    media: {
      type: 'image',
      src: '/src/assets/images/facecard.png',
      alt: 'Community stories and identity'
    },
    color: 'from-electric-magenta to-electric-cyan',
    isNew: true
  },
  {
    id: 'community',
    title: 'BLKOUTHUB',
    subtitle: 'Live Discussions',
    description: 'Real conversations happening right now',
    icon: Users,
    href: '/community',
    size: 'medium',
    type: 'stats',
    stats: {
      number: '127',
      label: 'Active Members'
    },
    color: 'from-electric-cyan to-electric-indigo'
  },
  {
    id: 'events',
    title: 'Events',
    subtitle: 'Workshops & Gatherings',
    description: 'Connect IRL and in digital spaces',
    icon: Calendar,
    href: 'http://localhost:5173/',
    size: 'medium',
    type: 'action',
    stats: {
      number: '3',
      label: 'This Week'
    },
    color: 'from-electric-indigo to-electric-green',
    isPopular: true
  },

  // Row 2 - Content & Features
  {
    id: 'movement',
    title: 'Movement Building',
    subtitle: 'Cooperative Power',
    description: 'Resources for economic liberation and collective ownership',
    icon: Zap,
    href: '/movement',
    size: 'wide',
    type: 'feature',
    media: {
      type: 'image',
      src: '/src/assets/images/John Henry.png',
      alt: 'Breaking through systems'
    },
    color: 'from-electric-green to-electric-magenta'
  },
  {
    id: 'realness',
    title: 'Realness Gallery',
    subtitle: 'Authentic Voices',
    description: 'Unfiltered stories from the community',
    icon: Heart,
    href: '/realness',
    size: 'small',
    type: 'media',
    media: {
      type: 'video',
      src: '/src/assets/videos/goldsmile  intro.mp4',
      alt: 'Joy and authenticity'
    },
    color: 'from-electric-magenta to-electric-cyan'
  },

  // Row 3 - Interactive Features
  {
    id: 'podcast',
    title: 'The Complexity Pod',
    subtitle: 'Weekly Conversations',
    description: 'Deep dives into the questions that matter',
    icon: Mic,
    href: '/podcast',
    size: 'medium',
    type: 'feature',
    stats: {
      number: '24',
      label: 'Episodes'
    },
    color: 'from-electric-cyan to-electric-indigo',
    isNew: true
  },
  {
    id: 'visuals',
    title: 'Visual Storytelling',
    subtitle: 'Photography & Art',
    description: 'Community creativity and visual narratives',
    icon: Camera,
    href: '/visuals',
    size: 'small',
    type: 'media',
    media: {
      type: 'image',
      src: '/src/assets/images/ancientlove.png',
      alt: 'Visual storytelling'
    },
    color: 'from-electric-indigo to-electric-green'
  },
  {
    id: 'tech',
    title: 'Open Source',
    subtitle: 'Building Together',
    description: 'Community-driven technology projects',
    icon: Code,
    href: '/tech',
    size: 'medium',
    type: 'feature',
    media: {
      type: 'video',
      src: '/src/assets/videos/cube intro.mp4',
      alt: 'Technology and transformation'
    },
    color: 'from-electric-green to-electric-magenta'
  },
  {
    id: 'forums',
    title: 'Discussion Forums',
    subtitle: 'Threaded Conversations',
    description: 'Ongoing discussions on topics that matter',
    icon: MessageCircle,
    href: '/forums',
    size: 'small',
    type: 'stats',
    stats: {
      number: '89',
      label: 'Active Threads'
    },
    color: 'from-electric-magenta to-electric-cyan'
  },

  // Row 4 - Achievement & Settings
  {
    id: 'achievements',
    title: 'Community Wins',
    subtitle: 'Celebrating Progress',
    description: 'Collective achievements and milestones',
    icon: Trophy,
    href: '/achievements',
    size: 'wide',
    type: 'feature',
    media: {
      type: 'image',
      src: '/src/assets/images/capacity.png',
      alt: 'Community achievements'
    },
    color: 'from-electric-cyan to-electric-indigo'
  },
  {
    id: 'settings',
    title: 'Your Space',
    subtitle: 'Personalize Experience',
    description: 'Customize your BLKOUT journey',
    icon: Settings,
    href: '/settings',
    size: 'small',
    type: 'action',
    color: 'from-electric-indigo to-electric-green'
  }
]

interface BentoBoxLayoutProps {
  onToggleLayout: () => void
}

export default function BentoBoxLayout({ onToggleLayout }: BentoBoxLayoutProps) {
  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'small': return 'col-span-1 row-span-1'
      case 'medium': return 'col-span-1 row-span-2 md:col-span-2 md:row-span-1'
      case 'large': return 'col-span-2 row-span-2'
      case 'wide': return 'col-span-2 row-span-1 md:col-span-3'
      case 'tall': return 'col-span-1 row-span-3'
      default: return 'col-span-1 row-span-1'
    }
  }

  const handleSectionClick = (section: BentoSection) => {
    if (section.href.startsWith('http')) {
      window.open(section.href, '_blank')
    } else {
      // Handle internal navigation
      console.log('Navigate to:', section.href)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blkout-deep via-zones-liberation-bg to-zones-technology-bg">
      {/* Header */}
      <div className="relative px-6 pt-8 pb-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <h1 className="text-3xl font-electric text-white">BLKOUT</h1>
            <span className="text-electric-cyan font-semibold">EXPLORE ALL</span>
          </motion.div>
          
          <motion.button
            onClick={onToggleLayout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/20 transition-all"
          >
            <Play className="w-4 h-4" />
            <span className="text-sm">Experience Journey</span>
          </motion.button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-fr"
        >
          {bentoSections.map((section, index) => {
            const IconComponent = section.icon
            
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`
                  group relative p-4 rounded-2xl bg-white/10 backdrop-blur-sm 
                  border border-white/20 hover:border-white/40 transition-all 
                  cursor-pointer overflow-hidden ${getSizeClasses(section.size)}
                `}
                onClick={() => handleSectionClick(section)}
              >
                {/* Background Media */}
                {section.media && (
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                    {section.media.type === 'image' ? (
                      <RetroImage
                        src={section.media.src}
                        alt={section.media.alt}
                        vcrIntensity="light"
                        className="w-full h-full object-cover"
                        scrollReveal={false}
                      />
                    ) : (
                      <RetroVideo
                        webmSrc=""
                        mp4Src={section.media.src}
                        autoplay={false}
                        loop={true}
                        muted={true}
                        vcrIntensity="light"
                        className="w-full h-full object-cover"
                        scrollTriggered={false}
                      />
                    )}
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-20 transition-opacity rounded-2xl`} />
                
                {/* Content */}
                <div className="relative h-full flex flex-col justify-between">
                  {/* Header */}
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${section.color}`}>
                        <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </div>
                      
                      {/* Badges */}
                      <div className="flex space-x-1">
                        {section.isNew && (
                          <div className="px-2 py-1 bg-electric-magenta rounded-full">
                            <span className="text-xs text-white font-bold">NEW</span>
                          </div>
                        )}
                        {section.isPopular && (
                          <div className="px-2 py-1 bg-electric-cyan rounded-full">
                            <Star className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold text-white mb-1 group-hover:text-electric-cyan transition-colors">
                      {section.title}
                    </h3>
                    
                    {section.subtitle && (
                      <p className="text-sm text-electric-cyan font-semibold mb-2">
                        {section.subtitle}
                      </p>
                    )}
                    
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {section.description}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-4">
                    {section.stats ? (
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-2xl font-bold text-white">
                            {section.stats.number}
                          </div>
                          <div className="text-xs text-gray-400 uppercase tracking-wide">
                            {section.stats.label}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-electric-cyan group-hover:translate-x-1 transition-transform" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-400 uppercase tracking-wide">
                          {section.type === 'feature' ? 'Explore' : 'Enter'}
                        </div>
                        <ArrowRight className="w-4 h-4 text-electric-cyan group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="p-8 rounded-2xl bg-gradient-to-r from-electric-magenta/20 to-electric-cyan/20 backdrop-blur-sm border border-white/20">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl mb-4"
            >
              🌟
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to dive deeper?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Experience the full scrollytelling journey or continue exploring individual sections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={onToggleLayout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-electric-magenta text-white font-bold rounded-full hover:bg-electric-cyan transition-colors"
              >
                Experience Full Journey
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 border-2 border-electric-cyan text-electric-cyan font-bold rounded-full hover:bg-electric-cyan hover:text-white transition-colors"
              >
                Join Community
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}