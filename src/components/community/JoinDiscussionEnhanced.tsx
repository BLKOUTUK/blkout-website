'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, Users, Send, Plus, Hash, Clock, 
  TrendingUp, ArrowRight, Heart, Reply, Share2,
  ChevronDown, Filter, Search, Eye, Pin
} from 'lucide-react'
import PrimaryNavigationEnhanced from '../layout/PrimaryNavigationEnhanced'
import PlatformFooter from '../layout/PlatformFooter'

// Discussion types and topics
const discussionCategories = {
  'Community Building': {
    gradient: 'from-emerald-500 to-indigo-600',
    color: 'text-emerald-400',
    topics: ['Mutual Aid', 'Local Organizing', 'Skill Sharing', 'Community Events']
  },
  'Economic Justice': {
    gradient: 'from-indigo-500 to-violet-600',
    color: 'text-indigo-400',
    topics: ['Worker Cooperatives', 'Community Land Trusts', 'Alternative Economics', 'Policy Reform']
  },
  'Liberation Praxis': {
    gradient: 'from-violet-500 to-emerald-600',
    color: 'text-violet-400',
    topics: ['Anti-Racism', 'Queer Liberation', 'Intersectionality', 'Radical Imagination']
  },
  'Tech & Digital': {
    gradient: 'from-slate-500 to-blue-600',
    color: 'text-slate-400',
    topics: ['Platform Cooperatives', 'Digital Rights', 'Tech Ethics', 'Community Tech']
  }
}

// Mock discussion data
const activeDiscussions = [
  {
    id: '1',
    title: 'Building a Community Kitchen: Lessons from Sheffield',
    category: 'Community Building',
    author: 'Marcus Johnson',
    avatar: 'MJ',
    replies: 23,
    likes: 67,
    lastActivity: '2 hours ago',
    isPinned: true,
    excerpt: 'Sharing our experience starting a community kitchen that serves 200+ people weekly. What worked, what didn\'t, and how we sustained it through COVID.',
    tags: ['Mutual Aid', 'Food Justice', 'Community Spaces']
  },
  {
    id: '2',
    title: 'Worker Cooperative Legal Structures in UK - Need Advice',
    category: 'Economic Justice',
    author: 'Sarah Chen',
    avatar: 'SC',
    replies: 31,
    likes: 89,
    lastActivity: '4 hours ago',
    isPinned: false,
    excerpt: 'Starting a tech cooperative with 6 members. Looking for advice on legal structures, profit sharing, and governance models that work.',
    tags: ['Worker Cooperatives', 'Legal', 'Tech']
  },
  {
    id: '3',
    title: 'Decolonizing Mental Health Support in Black Communities',
    category: 'Liberation Praxis',
    author: 'Dr. Amara Okafor',
    avatar: 'AO',
    replies: 45,
    likes: 134,
    lastActivity: '6 hours ago',
    isPinned: false,
    excerpt: 'How do we create culturally grounded mental health support that doesn\'t reproduce colonial frameworks? Sharing research and lived experience.',
    tags: ['Mental Health', 'Decolonization', 'Community Care']
  },
  {
    id: '4',
    title: 'Platform Cooperative Model for Freelance Creative Workers',
    category: 'Tech & Digital',
    author: 'Jordan Clarke',
    avatar: 'JC',
    replies: 18,
    likes: 52,
    lastActivity: '8 hours ago',
    isPinned: false,
    excerpt: 'Exploring how platform cooperatives could help freelance creative workers own their digital infrastructure and share resources.',
    tags: ['Platform Cooperatives', 'Creative Work', 'Freelancing']
  },
  {
    id: '5',
    title: 'Community Land Trust Success Story: Preserving Affordability',
    category: 'Economic Justice',
    author: 'Devon Williams',
    avatar: 'DW',
    replies: 27,
    likes: 76,
    lastActivity: '12 hours ago',
    isPinned: false,
    excerpt: 'Our CLT just completed its third affordable housing project. Sharing the journey, challenges overcome, and lessons for other communities.',
    tags: ['Community Land Trust', 'Housing', 'Affordability']
  }
]

// Discussion Hero Section
const DiscussionHero = () => (
  <section className="relative py-24 bg-gradient-to-br from-red-950 via-red-900 to-rose-900 overflow-hidden">
    {/* Background pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-violet-500 rounded-full blur-3xl"></div>
    </div>
    
    <div className="relative z-10 max-w-6xl mx-auto px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-indigo-300 text-xl font-mono uppercase tracking-widest mb-6"
        >
          COMMUNITY DISCUSSIONS
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black heading-block leading-none mb-8"
        >
          <span className="bg-gradient-to-r from-emerald-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            JOIN THE
          </span>
          <br />
          <span className="bg-gradient-to-r from-slate-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
            CONVERSATION
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-xl md:text-2xl text-indigo-100 max-w-4xl mx-auto leading-relaxed font-light mb-12"
        >
          Connect with community members building liberation together. Share experiences, 
          ask questions, and collaborate on projects that create real change.
        </motion.p>

        {/* Community Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12"
        >
          {[
            { label: 'ACTIVE DISCUSSIONS', value: '247' },
            { label: 'COMMUNITY MEMBERS', value: '1.2K' },
            { label: 'SOLUTIONS SHARED', value: '89' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-white heading-block mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-indigo-300 font-mono uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.button 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-12 py-4 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-black text-lg hover:from-emerald-500 hover:to-indigo-500 transition-all duration-300 shadow-xl hover:shadow-2xl heading-block uppercase tracking-wide flex items-center mx-auto"
        >
          <Plus className="w-6 h-6 mr-3" />
          START NEW DISCUSSION
        </motion.button>
      </motion.div>
    </div>
  </section>
)

// Discussion Categories
const DiscussionCategories = ({ selectedCategory, onCategorySelect }: {
  selectedCategory: string
  onCategorySelect: (category: string) => void
}) => (
  <section className="py-16 bg-indigo-50/5 backdrop-blur-sm border-y border-indigo-800/30">
    <div className="max-w-6xl mx-auto px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black heading-block mb-4 uppercase">
          <span className="bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
            DISCUSSION
          </span>
          <span className="bg-gradient-to-r from-indigo-400 to-slate-400 bg-clip-text text-transparent ml-4">
            CATEGORIES
          </span>
        </h2>
        <p className="text-indigo-200 font-light text-lg">
          Explore conversations organized by focus areas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(discussionCategories).map(([category, { gradient, topics }]) => (
          <motion.button
            key={category}
            onClick={() => onCategorySelect(category)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`p-6 text-left transition-all duration-300 ${
              selectedCategory === category
                ? `bg-gradient-to-br ${gradient} text-white shadow-xl`
                : 'bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 hover:bg-indigo-900/50 text-indigo-100'
            }`}
          >
            <h3 className="font-black text-lg heading-block mb-3 uppercase">
              {category}
            </h3>
            <div className="space-y-1">
              {topics.slice(0, 3).map((topic, index) => (
                <div key={index} className="flex items-center text-sm">
                  <Hash className="w-3 h-3 mr-2 opacity-60" />
                  {topic}
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs opacity-75 font-mono uppercase tracking-wider">
              {topics.length} TOPICS
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  </section>
)

// Discussion List
const DiscussionList = ({ selectedCategory }: { selectedCategory: string }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recent')

  const filteredDiscussions = activeDiscussions.filter(discussion => 
    selectedCategory === 'All' || discussion.category === selectedCategory
  )

  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-8">
        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400" />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-indigo-950/50 border border-indigo-700/50 text-white placeholder-indigo-300 focus:outline-none focus:border-indigo-500 font-light"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-indigo-300 font-mono uppercase tracking-wider text-sm">
              SORT BY:
            </span>
            {['Recent', 'Popular', 'Replies'].map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option.toLowerCase())}
                className={`px-4 py-2 font-bold text-sm transition-all heading-block uppercase ${
                  sortBy === option.toLowerCase()
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-800/30 text-indigo-300 hover:bg-indigo-700/50 hover:text-white'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Discussion Cards */}
        <div className="space-y-6">
          {filteredDiscussions.map((discussion, index) => {
            const categoryData = discussionCategories[discussion.category as keyof typeof discussionCategories]
            
            return (
              <motion.div
                key={discussion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-indigo-900/20 backdrop-blur-sm border border-indigo-700/20 p-8 hover:bg-indigo-900/40 transition-all duration-500 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    {discussion.isPinned && (
                      <Pin className="w-5 h-5 text-emerald-400" />
                    )}
                    <div className={`w-3 h-3 bg-gradient-to-r ${categoryData.gradient}`}></div>
                    <span className="text-indigo-300 font-mono uppercase tracking-wider text-sm">
                      {discussion.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-indigo-300">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      <span className="font-mono">1.2K</span>
                    </div>
                    <div className="flex items-center">
                      <Reply className="w-4 h-4 mr-1" />
                      <span className="font-mono">{discussion.replies}</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      <span className="font-mono">{discussion.likes}</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-black heading-block mb-3 leading-tight group-hover:text-white transition-colors">
                  <span className={`bg-gradient-to-r ${categoryData.gradient} bg-clip-text text-transparent group-hover:text-white`}>
                    {discussion.title}
                  </span>
                </h3>

                <p className="text-indigo-100 mb-4 leading-relaxed font-light">
                  {discussion.excerpt}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {discussion.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-indigo-800/50 text-indigo-200 text-xs font-bold heading-block uppercase"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${categoryData.gradient} flex items-center justify-center`}>
                      <span className="text-white text-sm font-bold">
                        {discussion.avatar}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-white heading-block text-sm">
                        {discussion.author}
                      </p>
                      <div className="flex items-center text-xs text-indigo-400">
                        <Clock className="w-3 h-3 mr-1" />
                        {discussion.lastActivity}
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ x: 5 }}
                    className="flex items-center text-indigo-400 hover:text-white transition-colors font-bold heading-block uppercase text-sm"
                  >
                    JOIN DISCUSSION
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-12 py-4 bg-indigo-800/30 text-indigo-100 font-bold hover:bg-indigo-700/50 hover:text-white transition-all heading-block uppercase"
          >
            LOAD MORE DISCUSSIONS
          </motion.button>
        </div>
      </div>
    </section>
  )
}

// BLKOUTHUB Promotion Section
const BLKOUTHUBPromotion = () => (
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
            READY TO JOIN
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              BLKOUTHUB?
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            These conversations happen live in our private community platform. Join authentic discussions, 
            peer support, and collective action with verified Black queer men.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-12 py-4 bg-white text-indigo-900 font-black text-lg hover:bg-gray-100 transition-colors heading-block uppercase flex items-center justify-center"
            >
              <Users className="w-6 h-6 mr-3" />
              JOIN BLKOUTHUB
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-12 py-4 border-2 border-white text-white font-black text-lg hover:bg-white hover:text-indigo-900 transition-colors heading-block uppercase flex items-center justify-center"
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              LEARN MORE
            </motion.button>
          </div>

          {/* Newsletter Signup */}
          <div className="border-t border-white/20 pt-12">
            <h4 className="text-2xl font-black text-white heading-block mb-4 uppercase">
              STAY UPDATED
            </h4>
            <p className="text-white/90 mb-8 font-light">
              Get notified when BLKOUTHUB opens for new members and community updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/60 font-light"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white font-bold hover:bg-white/30 transition-all heading-block uppercase flex items-center justify-center"
              >
                <Send className="w-4 h-4 mr-2" />
                SUBSCRIBE
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
)

export default function JoinDiscussionEnhanced() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-red-900 to-rose-900">
      {/* Enhanced Navigation */}
      <PrimaryNavigationEnhanced />
      
      {/* Discussion Hero */}
      <DiscussionHero />
      
      {/* BLKOUTHUB Promotion */}
      <BLKOUTHUBPromotion />
      
      {/* Discussion Categories */}
      <DiscussionCategories 
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      
      {/* Discussion List */}
      <DiscussionList selectedCategory={selectedCategory} />
      
      {/* Platform Footer */}
      <PlatformFooter />
    </div>
  )
}