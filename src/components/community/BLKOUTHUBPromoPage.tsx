'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, Send, Play, Heart, Shield, Globe, 
  MessageCircle, ArrowRight, CheckCircle, Mail,
  Video, Calendar, BookOpen, Zap
} from 'lucide-react'
import PrimaryNavigationEnhanced from '../layout/PrimaryNavigationEnhanced'
import PlatformFooter from '../layout/PlatformFooter'

// BLKOUTHUB Hero Section with Video
const BLKOUTHUBHero = () => (
  <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-violet-950 via-indigo-900 to-emerald-900 overflow-hidden">
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
            EXCLUSIVE COMMUNITY
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black heading-block leading-none mb-8"
          >
            <span className="bg-gradient-to-r from-emerald-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              BLKOUT
            </span>
            <br />
            <span className="bg-gradient-to-r from-slate-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              HUB
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl md:text-2xl text-indigo-100 leading-relaxed font-light mb-12 max-w-2xl"
          >
            A private community platform where verified Black queer men connect, 
            support each other, and build liberation together through authentic conversations and collective action.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-12 py-4 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-black text-lg hover:from-emerald-500 hover:to-indigo-500 transition-all duration-300 shadow-xl hover:shadow-2xl heading-block uppercase tracking-wide flex items-center justify-center"
            >
              <Users className="w-6 h-6 mr-3" />
              JOIN BLKOUTHUB
            </motion.button>
            <motion.a
              href="https://youtu.be/roUYxYdVigo?si=AVvBicjn7AddNGhr"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-12 py-4 border-2 border-indigo-400 text-indigo-100 font-black text-lg hover:bg-indigo-400 hover:text-indigo-900 transition-all duration-300 heading-block uppercase tracking-wide flex items-center justify-center"
            >
              <Play className="w-6 h-6 mr-3" />
              WATCH ON YOUTUBE
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="aspect-video bg-black border border-indigo-700/50 overflow-hidden">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/roUYxYdVigo?si=AVvBicjn7AddNGhr&autoplay=0&modestbranding=1&rel=0"
              title="BLKOUTHUB Community Introduction"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          
          {/* Video Info */}
          <div className="absolute -bottom-6 left-6 right-6">
            <div className="bg-indigo-950/90 backdrop-blur-sm border border-indigo-700/50 p-4 text-center">
              <p className="text-sm text-indigo-300 font-mono uppercase tracking-wider">
                BLKOUTHUB COMMUNITY TOUR
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
)

// Community Features
const CommunityFeatures = () => (
  <section className="py-24 bg-violet-50/5 backdrop-blur-sm">
    <div className="max-w-6xl mx-auto px-8">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black heading-block mb-6 uppercase"
        >
          <span className="bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
            WHAT MAKES
          </span>
          <span className="bg-gradient-to-r from-indigo-400 to-slate-400 bg-clip-text text-transparent ml-4">
            US DIFFERENT
          </span>
        </motion.h2>
        <p className="text-xl text-indigo-100 font-light leading-relaxed max-w-3xl mx-auto">
          BLKOUTHUB isn't just another social platform - it's a verified community designed for authentic connection and collective action
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            icon: Shield,
            title: 'VERIFIED MEMBERS ONLY',
            description: 'Secure community space exclusively for verified Black queer men',
            gradient: 'from-emerald-500 to-indigo-600'
          },
          {
            icon: Heart,
            title: 'AUTHENTIC CONNECTIONS',
            description: 'Real relationships beyond performative social media interactions',
            gradient: 'from-indigo-500 to-violet-600'
          },
          {
            icon: Zap,
            title: 'COLLECTIVE ACTION',
            description: 'Organize community projects, mutual aid, and liberation work',
            gradient: 'from-violet-500 to-emerald-600'
          },
          {
            icon: MessageCircle,
            title: 'PEER SUPPORT',
            description: 'Safe space for honest conversations about life, challenges, and growth',
            gradient: 'from-slate-500 to-blue-600'
          },
          {
            icon: BookOpen,
            title: 'SHARED RESOURCES',
            description: 'Access exclusive guides, events, and community-created content',
            gradient: 'from-blue-500 to-emerald-600'
          },
          {
            icon: Calendar,
            title: 'COMMUNITY EVENTS',
            description: 'Regular meetups, workshops, and actions both online and offline',
            gradient: 'from-emerald-500 to-violet-600'
          }
        ].map((feature, index) => {
          const IconComponent = feature.icon
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 p-8 hover:bg-indigo-900/50 transition-all duration-500 text-center group"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-black heading-block mb-4 uppercase">
                <span className={`bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                  {feature.title}
                </span>
              </h3>
              
              <p className="text-indigo-100 leading-relaxed font-light">
                {feature.description}
              </p>
            </motion.div>
          )
        })}
      </div>
    </div>
  </section>
)

// Signup Section
const SignupSection = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Connect to real signup API
    setSubmitted(true)
  }

  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-8">
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
            {!submitted ? (
              <>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-6xl mb-8"
                >
                  🚀
                </motion.div>
                
                <h2 className="text-4xl md:text-5xl font-black text-white heading-block mb-6 uppercase">
                  READY TO JOIN
                  <br />
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    THE HUB?
                  </span>
                </h2>
                
                <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
                  BLKOUTHUB launches soon. Join our waitlist to be among the first verified members 
                  and get exclusive updates about community events.
                </p>

                <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/60 font-light text-lg"
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-4 bg-white text-indigo-900 font-black hover:bg-gray-100 transition-all heading-block uppercase flex items-center justify-center"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      JOIN WAITLIST
                    </motion.button>
                  </div>
                </form>

                <p className="text-sm text-white/70 font-light">
                  Plus get notified about BLKOUT events, resources, and community updates
                </p>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-6xl mb-8">✨</div>
                <h3 className="text-3xl font-black text-white heading-block mb-4 uppercase">
                  WELCOME TO THE WAITLIST!
                </h3>
                <p className="text-xl text-white/90 mb-8 font-light">
                  You'll be among the first to know when BLKOUTHUB opens for new members.
                </p>
                <div className="flex items-center justify-center text-emerald-300">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  <span className="font-bold heading-block uppercase">CONFIRMED</span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default function BLKOUTHUBPromoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-indigo-900 to-emerald-900">
      {/* Enhanced Navigation */}
      <PrimaryNavigationEnhanced />
      
      {/* BLKOUTHUB Hero with Video */}
      <BLKOUTHUBHero />
      
      {/* Community Features */}
      <CommunityFeatures />
      
      {/* Signup Section */}
      <SignupSection />
      
      {/* Platform Footer */}
      <PlatformFooter />
    </div>
  )
}