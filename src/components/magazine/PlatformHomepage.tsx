'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Users, MessageCircle, ArrowRight, Clock, User, Play, Star, TrendingUp, Heart, Share2, BookOpen, Sparkles, Target, Zap, ChevronDown, Mail, Twitter, Instagram, Youtube, Github, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import ArticleGrid from './ArticleGrid'
import PrimaryNavigation from '../layout/PrimaryNavigation'

// Masculine indigo color scheme
const PLATFORM_COLORS = {
  primary: 'indigo-900',
  secondary: 'indigo-800', 
  accent: 'indigo-600',
  light: 'indigo-100',
  muted: 'slate-600',
  background: 'indigo-950'
}

// Content category definitions with masculine colors
const CONTENT_CATEGORIES = {
  'Original Commentary': { 
    color: 'bg-indigo-600', 
    textColor: 'text-indigo-600',
    gradient: 'from-indigo-500 via-indigo-600 to-indigo-700',
    glowColor: 'shadow-indigo-500/25'
  },
  'Curated Content': { 
    color: 'bg-slate-600', 
    textColor: 'text-slate-600',
    gradient: 'from-slate-500 via-slate-600 to-slate-700',
    glowColor: 'shadow-slate-500/25'
  },
  'Event Coverage': { 
    color: 'bg-blue-600', 
    textColor: 'text-blue-600',
    gradient: 'from-blue-500 via-blue-600 to-blue-700',
    glowColor: 'shadow-blue-500/25'
  },
  'Community Response': { 
    color: 'bg-emerald-600', 
    textColor: 'text-emerald-600',
    gradient: 'from-emerald-500 via-emerald-600 to-emerald-700',
    glowColor: 'shadow-emerald-500/25'
  },
  'Video/Audio/Photo': { 
    color: 'bg-violet-600', 
    textColor: 'text-violet-600',
    gradient: 'from-violet-500 via-violet-600 to-violet-700',
    glowColor: 'shadow-violet-500/25'
  }
}

interface Article {
  id: string
  title: string
  excerpt: string
  author: {
    name: string
    avatar: string
  }
  publishedAt: string
  readTime: number
  category: keyof typeof CONTENT_CATEGORIES
  featured: boolean
  image?: string
  tags: string[]
  likes?: number
  comments?: number
}

// Mock data with engagement metrics
const mockFeaturedArticles: Article[] = [
  {
    id: '1',
    title: 'BUILDING COOPERATIVE OWNERSHIP IN DIGITAL SPACES',
    excerpt: 'How Black queer communities are reimagining platform ownership and digital sovereignty through collective action and radical imagination.',
    author: { name: 'Marcus Johnson', avatar: 'MJ' },
    publishedAt: '2025-01-29',
    readTime: 8,
    category: 'Original Commentary',
    featured: true,
    image: '/images/squared/WELLDEF_SQUARED.png',
    tags: ['Digital Rights', 'Cooperative', 'Liberation'],
    likes: 234,
    comments: 47
  },
  {
    id: '2', 
    title: 'COMMUNITY RESPONSE: MENTAL HEALTH RESOURCES LAUNCH',
    excerpt: 'Community members share their experiences with the new peer support networks and resource accessibility in this collection.',
    author: { name: 'Devon Williams', avatar: 'DW' },
    publishedAt: '2025-01-28',
    readTime: 5,
    category: 'Community Response',
    featured: true,
    image: '/images/squared/BlackSQUARED.png',
    tags: ['Mental Health', 'Community', 'Resources'],
    likes: 189,
    comments: 32
  },
  {
    id: '3', 
    title: 'THE ART OF BLACK JOY: VISUAL STORIES FROM OUR COMMUNITY',
    excerpt: 'A multimedia exploration of how Black joy manifests in everyday moments, celebrations, and acts of resistance across the UK.',
    author: { name: 'Aisha Clarke', avatar: 'AC' },
    publishedAt: '2025-01-27',
    readTime: 6,
    category: 'Video/Audio/Photo',
    featured: true,
    image: '/images/squared/BLKOUT25INV.png',
    tags: ['Black Joy', 'Photography', 'Community'],
    likes: 312,
    comments: 58
  }
]

const mockRecentArticles: Article[] = [
  {
    id: '4',
    title: 'EVENT COVERAGE: BLACK HISTORY MONTH PLANNING SESSION',
    excerpt: 'Key highlights from the community planning session for BHM 2025 celebrations.',
    author: { name: 'Jordan Clarke', avatar: 'JC' },
    publishedAt: '2025-01-27',
    readTime: 4,
    category: 'Event Coverage',
    featured: false,
    tags: ['Events', 'Black History Month'],
    likes: 156,
    comments: 23
  },
  {
    id: '5',
    title: 'CURATED: POLICY CHANGES AFFECTING QTIPOC+ COMMUNITIES',
    excerpt: 'Analysis of recent policy developments and their impact on Black queer communities.',
    author: { name: 'Alex Thompson', avatar: 'AT' },
    publishedAt: '2025-01-26',
    readTime: 6,
    category: 'Curated Content',
    featured: false,
    tags: ['Policy', 'QTIPOC', 'Rights'],
    likes: 203,
    comments: 41
  }
]

// Platform Hero Section
const PlatformHero = () => (
  <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 overflow-hidden">
    {/* Background geometric pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-slate-500 rounded-full blur-3xl"></div>
    </div>
    
    <div className="relative z-10 max-w-7xl mx-auto px-8 py-32 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Platform Identity */}
        <div className="mb-12">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-indigo-300 text-xl font-mono uppercase tracking-widest mb-4"
          >
            BLKOUT PLATFORM
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black text-white heading-block leading-none mb-8"
          >
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
              COMMUNITY
            </span>
            <br />
            <span className="bg-gradient-to-r from-slate-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              LIBERATION
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl md:text-2xl text-indigo-100 max-w-4xl mx-auto leading-relaxed font-light"
          >
            Stories, resources, and connections for Black queer men building liberation together.
            Your community platform for authentic voices, collective action, and radical imagination.
          </motion.p>
        </div>

        {/* Platform Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-3 gap-8 mb-16 max-w-2xl mx-auto"
        >
          {[
            { label: 'STORIES SHARED', value: '1,247' },
            { label: 'COMMUNITY MEMBERS', value: '3,890' },
            { label: 'RESOURCES FOUND', value: '567' }
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

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <Link 
            to="/stories"
            className="px-12 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold text-lg rounded-none hover:from-indigo-500 hover:to-indigo-600 transition-all duration-300 shadow-xl hover:shadow-2xl heading-block uppercase tracking-wide"
          >
            EXPLORE STORIES
          </Link>
          <Link 
            to="/community"
            className="px-12 py-4 border-2 border-indigo-400 text-indigo-100 font-bold text-lg rounded-none hover:bg-indigo-400 hover:text-indigo-900 transition-all duration-300 heading-block uppercase tracking-wide"
          >
            JOIN COMMUNITY
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center text-indigo-300"
        >
          <span className="text-sm font-mono uppercase tracking-wider mb-2">SCROLL</span>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </div>
  </section>
)

// Sidebar Widgets with masculine styling
const EventsWidget = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="bg-indigo-900/50 backdrop-blur-sm rounded-none border border-indigo-700/30 p-8 hover:bg-indigo-900/70 transition-all duration-300"
  >
    <div className="mb-8">
      <h3 className="text-2xl font-black heading-block mb-3 uppercase">
        <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          UPCOMING EVENTS
        </span>
      </h3>
      <p className="text-indigo-200 font-light">Community gatherings & activities</p>
    </div>
    
    <div className="space-y-6 mb-8">
      {[
        { title: 'COMMUNITY HEALING CIRCLE', date: 'FEB 2', time: '7:00 PM', attendees: 23 },
        { title: 'DIGITAL RIGHTS WORKSHOP', date: 'FEB 5', time: '6:30 PM', attendees: 45 },
        { title: 'BLACK JOY CELEBRATION', date: 'FEB 8', time: '3:00 PM', attendees: 67 }
      ].map((event, index) => (
        <motion.div 
          key={index}
          whileHover={{ x: 4 }}
          className="flex justify-between items-start p-4 border border-indigo-700/20 hover:border-indigo-500/50 transition-all"
        >
          <div className="flex-1">
            <p className="font-bold text-white text-sm heading-block mb-1">{event.title}</p>
            <div className="flex items-center text-xs text-indigo-300 space-x-3">
              <span>{event.time}</span>
              <span className="text-emerald-400">{event.attendees} attending</span>
            </div>
          </div>
          <div className="text-right">
            <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1">{event.date}</span>
          </div>
        </motion.div>
      ))}
    </div>
    
    <button className="w-full px-6 py-3 bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-colors heading-block uppercase">
      VIEW ALL EVENTS
    </button>
  </motion.div>
)

const IVORWidget = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.1 }}
    className="bg-slate-900/50 backdrop-blur-sm rounded-none border border-slate-700/30 p-8 hover:bg-slate-900/70 transition-all duration-300"
  >
    <div className="mb-8">
      <h3 className="text-2xl font-black heading-block mb-3 uppercase">
        <span className="bg-gradient-to-r from-violet-400 to-slate-400 bg-clip-text text-transparent">
          I.V.O.R. RESOURCES
        </span>
      </h3>
      <p className="text-slate-200 font-light">AI-powered community support</p>
    </div>
    
    <p className="text-slate-100 mb-8 leading-relaxed font-light">
      Get personalized support and community resources tailored to your needs through our AI assistant.
    </p>
    
    <div className="space-y-4 mb-8">
      {[
        { label: 'MENTAL HEALTH SUPPORT', color: 'bg-emerald-500', count: '47 resources' },
        { label: 'HOUSING RESOURCES', color: 'bg-blue-500', count: '23 resources' },
        { label: 'LEGAL ASSISTANCE', color: 'bg-violet-500', count: '15 resources' }
      ].map((item, index) => (
        <motion.div 
          key={index}
          whileHover={{ x: 4 }}
          className="flex items-center justify-between p-4 border border-slate-700/20 hover:border-slate-500/50 transition-all"
        >
          <div className="flex items-center">
            <div className={`w-3 h-3 ${item.color} mr-4`}></div>
            <span className="text-slate-100 font-bold text-sm heading-block">{item.label}</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">{item.count}</span>
        </motion.div>
      ))}
    </div>
    
    <button className="w-full px-6 py-3 bg-slate-600 text-white font-bold hover:bg-slate-500 transition-colors heading-block uppercase">
      GET HELP NOW
    </button>
  </motion.div>
)

const CommunityWidget = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="bg-indigo-900/50 backdrop-blur-sm rounded-none border border-indigo-700/30 p-8 hover:bg-indigo-900/70 transition-all duration-300"
  >
    <div className="mb-8">
      <h3 className="text-2xl font-black heading-block mb-3 uppercase">
        <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
          COMMUNITY PULSE
        </span>
      </h3>
      <p className="text-indigo-200 font-light">Real-time engagement</p>
    </div>
    
    <div className="space-y-6 mb-8">
      {[
        { label: 'ACTIVE DISCUSSIONS', value: '127', trend: '+12', color: 'text-indigo-400' },
        { label: 'NEW MEMBERS THIS WEEK', value: '23', trend: '+5', color: 'text-emerald-400' },
        { label: 'STORIES SHARED', value: '45', trend: '+8', color: 'text-violet-400' }
      ].map((stat, index) => (
        <motion.div 
          key={index}
          className="flex items-center justify-between p-4 border border-indigo-700/20"
        >
          <span className="text-indigo-100 font-bold text-sm heading-block">{stat.label}</span>
          <div className="text-right">
            <span className={`text-xl font-black heading-block ${stat.color}`}>{stat.value}</span>
            <span className="text-xs text-emerald-400 ml-2">{stat.trend}</span>
          </div>
        </motion.div>
      ))}
    </div>
    
    <div className="p-6 bg-amber-900/30 border border-amber-700/30">
      <p className="text-sm text-amber-100 font-bold heading-block">
        💡 HUB MEMBERS DISCOVERED 7 NEW RESOURCES THIS WEEK
      </p>
    </div>
  </motion.div>
)

// Platform Footer
const PlatformFooter = () => (
  <footer className="relative bg-gradient-to-br from-indigo-950 via-slate-950 to-indigo-900 border-t border-indigo-800/30">
    {/* Background pattern */}
    <div className="absolute inset-0 opacity-5">
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-indigo-500 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/3 w-48 h-48 bg-violet-500 rounded-full blur-3xl"></div>
    </div>
    
    <div className="relative max-w-7xl mx-auto px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Section */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-black text-white heading-block mb-4 uppercase">
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                BLKOUT
              </span>
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent ml-2">
                PLATFORM
              </span>
            </h3>
            <p className="text-lg text-indigo-200 mb-8 leading-relaxed font-light max-w-md">
              Building liberation together through authentic community spaces, 
              radical storytelling, and collective action for Black queer men.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Twitter, label: 'Twitter', href: '#' },
                { icon: Instagram, label: 'Instagram', href: '#' },
                { icon: Youtube, label: 'YouTube', href: '#' },
                { icon: Github, label: 'GitHub', href: '#' }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-12 h-12 bg-indigo-800/50 hover:bg-indigo-700/70 border border-indigo-600/30 flex items-center justify-center transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-indigo-300" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Platform Links */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-black text-white heading-block mb-6 uppercase">
              <span className="bg-gradient-to-r from-slate-400 to-indigo-400 bg-clip-text text-transparent">
                PLATFORM
              </span>
            </h4>
            <ul className="space-y-4">
              {[
                { label: 'Stories', href: '/stories' },
                { label: 'Community', href: '/community' },
                { label: 'Events', href: '/events' },
                { label: 'I.V.O.R. Resources', href: '/ivor' },
                { label: 'Newsroom', href: '/newsroom' }
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-indigo-200 hover:text-white font-medium transition-colors duration-300 flex items-center group"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
        
        {/* Community Links */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-black text-white heading-block mb-6 uppercase">
              <span className="bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
                COMMUNITY
              </span>
            </h4>
            <ul className="space-y-4">
              {[
                { label: 'Join BLKOUTHUB', href: '/community' },
                { label: 'Newsletter', href: '#newsletter' },
                { label: 'Support', href: '#support' },
                { label: 'Governance', href: '/governance' },
                { label: 'Privacy Policy', href: '#privacy' }
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-indigo-200 hover:text-white font-medium transition-colors duration-300 flex items-center group"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
      
      {/* Newsletter Signup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="border-t border-indigo-800/30 pt-12 mb-12"
      >
        <div className="max-w-2xl mx-auto text-center">
          <h4 className="text-2xl font-black text-white heading-block mb-4 uppercase">
            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              STAY CONNECTED
            </span>
          </h4>
          <p className="text-indigo-200 mb-8 font-light">
            Get the latest stories, resources, and community updates delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 bg-indigo-900/50 border border-indigo-700/50 text-white placeholder-indigo-300 focus:outline-none focus:border-indigo-500 font-light"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold hover:from-indigo-500 hover:to-violet-500 transition-all heading-block uppercase flex items-center justify-center"
            >
              <Mail className="w-4 h-4 mr-2" />
              SUBSCRIBE
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="border-t border-indigo-800/30 pt-8 flex flex-col md:flex-row justify-between items-center"
      >
        <div className="text-indigo-300 text-sm font-light mb-4 md:mb-0">
          © 2025 BLKOUT Platform. Building liberation together.
        </div>
        <div className="flex items-center space-x-6 text-sm">
          {[
            { label: 'Terms', href: '#terms' },
            { label: 'Privacy', href: '#privacy' },
            { label: 'Accessibility', href: '#accessibility' },
            { label: 'Contact', href: '#contact' }
          ].map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="text-indigo-300 hover:text-white transition-colors font-light"
            >
              {link.label}
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  </footer>
)

// Main component
export default function PlatformHomepage() {
  const [currentFeatured, setCurrentFeatured] = useState(0)

  // Auto-rotate featured articles every 12 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatured((prev) => (prev + 1) % mockFeaturedArticles.length)
    }, 12000)
    return () => clearInterval(interval)
  }, [])

  const featuredArticle = mockFeaturedArticles[currentFeatured]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900">
      {/* Primary Navigation */}
      <PrimaryNavigation />
      
      {/* Platform Hero */}
      <PlatformHero />
      
      {/* Main Content Section */}
      <div className="relative bg-indigo-50/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Main Content Area - 8 columns */}
            <main className="lg:col-span-8">
              
              {/* Featured Stories Section */}
              <section className="mb-24">
                <div className="mb-16 text-center lg:text-left">
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-6xl font-black heading-block mb-6 uppercase leading-none"
                  >
                    <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                      FEATURED
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                      STORIES
                    </span>
                  </motion.h2>
                  <p className="text-xl text-indigo-100 font-light leading-relaxed max-w-2xl">
                    Bold narratives and community voices that shape our liberation movement.
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFeatured}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.8 }}
                    className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 overflow-hidden hover:bg-indigo-900/50 transition-all duration-500"
                  >
                    {featuredArticle.image && (
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={featuredArticle.image}
                          alt={featuredArticle.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    )}
                    
                    <div className="p-12">
                      <div className="flex items-center mb-6">
                        <div className={`w-4 h-4 bg-gradient-to-r ${CONTENT_CATEGORIES[featuredArticle.category].gradient} mr-4`}></div>
                        <span className="text-indigo-300 font-mono uppercase tracking-wider text-sm">
                          {featuredArticle.category}
                        </span>
                      </div>
                      
                      <h3 className="text-3xl md:text-4xl font-black heading-block mb-6 leading-tight">
                        <span className={`bg-gradient-to-r ${CONTENT_CATEGORIES[featuredArticle.category].gradient} bg-clip-text text-transparent`}>
                          {featuredArticle.title}
                        </span>
                      </h3>
                      
                      <p className="text-lg text-indigo-100 mb-8 leading-relaxed font-light">
                        {featuredArticle.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 bg-gradient-to-br ${CONTENT_CATEGORIES[featuredArticle.category].gradient} flex items-center justify-center`}>
                              <span className="text-white font-bold">
                                {featuredArticle.author.avatar}
                              </span>
                            </div>
                            <div>
                              <p className="font-bold text-white heading-block">
                                {featuredArticle.author.name}
                              </p>
                              <div className="flex items-center text-sm text-indigo-300 space-x-3">
                                <span>{featuredArticle.publishedAt}</span>
                                <span>{featuredArticle.readTime} min read</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <button className="px-8 py-3 bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-colors heading-block uppercase flex items-center">
                          READ STORY
                          <ArrowRight className="w-4 h-4 ml-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {/* Story indicator */}
                <div className="flex justify-center mt-12 space-x-4">
                  {mockFeaturedArticles.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentFeatured(index)}
                      className={`w-4 h-4 transition-all duration-300 ${
                        index === currentFeatured 
                          ? 'bg-indigo-400' 
                          : 'bg-indigo-800 hover:bg-indigo-600'
                      }`}
                    />
                  ))}
                </div>
              </section>

              {/* Recent Stories Section */}
              <section>
                <div className="mb-16 text-center lg:text-left">
                  <h2 className="text-4xl md:text-5xl font-black heading-block mb-4 uppercase">
                    <span className="bg-gradient-to-r from-slate-400 to-indigo-400 bg-clip-text text-transparent">
                      RECENT
                    </span>
                    <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent ml-4">
                      STORIES
                    </span>
                  </h2>
                  <p className="text-lg text-indigo-100 font-light">
                    The latest from our community contributors
                  </p>
                </div>
                
                <div className="space-y-8">
                  {mockRecentArticles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-indigo-900/20 backdrop-blur-sm border border-indigo-700/20 p-8 hover:bg-indigo-900/40 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-center mb-4">
                        <div className={`w-3 h-3 bg-gradient-to-r ${CONTENT_CATEGORIES[article.category].gradient} mr-4`}></div>
                        <span className="text-indigo-300 font-mono uppercase tracking-wider text-sm">
                          {article.category}
                        </span>
                        <span className="mx-4 text-indigo-600">•</span>
                        <span className="text-sm text-indigo-400">{article.publishedAt}</span>
                      </div>
                      
                      <h3 className="text-xl md:text-2xl font-black heading-block mb-4 leading-tight">
                        <span className={`bg-gradient-to-r ${CONTENT_CATEGORIES[article.category].gradient} bg-clip-text text-transparent`}>
                          {article.title}
                        </span>
                      </h3>
                      
                      <p className="text-indigo-100 mb-6 leading-relaxed font-light">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 bg-gradient-to-br ${CONTENT_CATEGORIES[article.category].gradient} flex items-center justify-center`}>
                              <span className="text-white text-sm font-bold">
                                {article.author.avatar}
                              </span>
                            </div>
                            <div>
                              <p className="font-bold text-white heading-block text-sm">
                                {article.author.name}
                              </p>
                              <p className="text-xs text-indigo-400">
                                {article.readTime} min read
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-indigo-300">
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {article.likes}
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {article.comments}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </main>

            {/* Enhanced Sidebar - 4 columns */}
            <aside className="lg:col-span-4">
              <div className="space-y-12 lg:sticky lg:top-24">
                <EventsWidget />
                <IVORWidget />
                <CommunityWidget />
              </div>
            </aside>
          </div>
        </div>
        
        {/* Platform Footer */}
        <PlatformFooter />
      </div>
    </div>
  )
}