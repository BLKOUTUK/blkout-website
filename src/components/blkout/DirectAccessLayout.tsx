'use client'

import { motion } from 'framer-motion'
import { Calendar, Users, BookOpen, Zap, ArrowRight, Settings } from 'lucide-react'
import { SITE_CONFIG, COMMUNITY_VALUES } from '@/lib/constants'

interface DirectAccessLayoutProps {
  onToggleLayout: () => void
}

const quickAccessItems = [
  {
    title: 'Stories',
    description: 'Personal narratives, analysis, history & creative works',
    icon: BookOpen,
    href: '/stories',
    color: 'from-electric-magenta to-electric-cyan',
    stats: '47 new this week'
  },
  {
    title: 'Community',
    description: 'Live discussions, member spotlights & realness gallery',
    icon: Users,
    href: '/community', 
    color: 'from-electric-cyan to-electric-indigo',
    stats: '127 members active'
  },
  {
    title: 'Events',
    description: 'Workshops, discussions & community gatherings',
    icon: Calendar,
    href: '/events',
    color: 'from-electric-indigo to-electric-green',
    stats: '3 upcoming events'
  },
  {
    title: 'Movement',
    description: 'Cooperative ownership & liberation resources',
    icon: Zap,
    href: '/movement',
    color: 'from-electric-green to-electric-magenta',
    stats: 'New resources added'
  }
]

const whyContent = [
  {
    question: "Why cooperative ownership?",
    answer: "Because individual success in a broken system isn't liberation. We build collective power that can't be taken away."
  },
  {
    question: "Why Black queer men specifically?", 
    answer: "Because our intersectional experience gives us unique insight into building inclusive power structures."
  },
  {
    question: "Why embrace complexity?",
    answer: "Because real change happens in the nuanced spaces between simplistic binaries. We refuse false choices."
  }
]

export default function DirectAccessLayout({ onToggleLayout }: DirectAccessLayoutProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blkout-deep via-zones-liberation-bg to-zones-technology-bg">
      {/* Header with toggle */}
      <div className="relative px-6 pt-8 pb-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <h1 className="text-3xl font-electric text-white">{SITE_CONFIG.name}</h1>
            <span className="text-electric-cyan font-semibold">DIRECT ACCESS</span>
          </motion.div>
          
          <motion.button
            onClick={onToggleLayout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/20 transition-all"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">Experience Full Journey</span>
          </motion.button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Access Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-white mb-8">Jump Into the Conversation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickAccessItems.map((item, index) => {
              const IconComponent = item.icon
              
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group relative p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all cursor-pointer"
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity`} />
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color}`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400 uppercase tracking-wider">Live</div>
                        <div className="text-sm text-electric-cyan font-semibold">{item.stats}</div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-electric-cyan transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center text-electric-cyan text-sm font-semibold">
                      <span>Enter space</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Why Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why We're Here</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              For those ready to go deeper into the questions that matter
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {whyContent.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.5 }}
                className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <h3 className="text-lg font-bold text-electric-cyan mb-3">
                  {item.question}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {item.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Community Pulse */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="p-8 rounded-2xl bg-gradient-to-r from-electric-magenta/20 to-electric-cyan/20 backdrop-blur-sm border border-white/20">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl mb-4"
            >
              💭
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Real Conversations Happening Now
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join 127 members in ongoing dialogues about cooperative ownership, 
              creative expression, and building the future we want to live in.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-electric-magenta text-white font-bold rounded-full hover:bg-electric-cyan transition-colors"
            >
              Enter BLKOUTHUB
            </motion.button>
          </div>
        </motion.section>
      </div>
    </main>
  )
}