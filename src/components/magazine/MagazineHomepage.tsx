'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, MessageCircle, ArrowRight, Clock, User } from 'lucide-react'
import ArticleGrid from './ArticleGrid'
import PrimaryNavigation from '../layout/PrimaryNavigation'

// Content category definitions
const CONTENT_CATEGORIES = {
  'Original Commentary': { color: 'bg-purple-600', textColor: 'text-purple-600' },
  'Curated Content': { color: 'bg-pink-600', textColor: 'text-pink-600' },
  'Event Coverage': { color: 'bg-orange-600', textColor: 'text-orange-600' },
  'Community Response': { color: 'bg-green-600', textColor: 'text-green-600' },
  'Video/Audio/Photo': { color: 'bg-blue-600', textColor: 'text-blue-600' }
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
}

// Mock data for demonstration
const mockFeaturedArticles: Article[] = [
  {
    id: '1',
    title: 'Building Cooperative Ownership in Digital Spaces',
    excerpt: 'How Black queer communities are reimagining platform ownership and digital sovereignty through collective action.',
    author: { name: 'Marcus Johnson', avatar: 'MJ' },
    publishedAt: '2025-01-29',
    readTime: 8,
    category: 'Original Commentary',
    featured: true,
    image: '/images/squared/WELLDEF_SQUARED.png',
    tags: ['Digital Rights', 'Cooperative', 'Liberation']
  },
  {
    id: '2', 
    title: 'Community Response: Mental Health Resources Launch',
    excerpt: 'Community members share their experiences with the new peer support networks and resource accessibility.',
    author: { name: 'Devon Williams', avatar: 'DW' },
    publishedAt: '2025-01-28',
    readTime: 5,
    category: 'Community Response',
    featured: true,
    image: '/images/squared/BlackSQUARED.png',
    tags: ['Mental Health', 'Community', 'Resources']
  }
]

const mockRecentArticles: Article[] = [
  {
    id: '3',
    title: 'Event Coverage: Black History Month Planning Session',
    excerpt: 'Key highlights from the community planning session for BHM 2025 celebrations.',
    author: { name: 'Jordan Clarke', avatar: 'JC' },
    publishedAt: '2025-01-27',
    readTime: 4,
    category: 'Event Coverage',
    featured: false,
    tags: ['Events', 'Black History Month']
  },
  {
    id: '4',
    title: 'Curated: Policy Changes Affecting QTIPOC+ Communities',
    excerpt: 'Analysis of recent policy developments and their impact on Black queer communities.',
    author: { name: 'Alex Thompson', avatar: 'AT' },
    publishedAt: '2025-01-26',
    readTime: 6,
    category: 'Curated Content',
    featured: false,
    tags: ['Policy', 'QTIPOC', 'Rights']
  }
]

// Sidebar Widgets
const EventsWidget = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
      <Calendar className="w-5 h-5 text-gray-500" />
    </div>
    <div className="space-y-3">
      {[
        { title: 'Community Healing Circle', date: 'Feb 2', time: '7:00 PM' },
        { title: 'Digital Rights Workshop', date: 'Feb 5', time: '6:30 PM' },
        { title: 'Black Joy Celebration', date: 'Feb 8', time: '3:00 PM' }
      ].map((event, index) => (
        <div key={index} className="flex justify-between items-start">
          <div>
            <p className="font-medium text-sm text-gray-900">{event.title}</p>
            <p className="text-xs text-gray-500">{event.time}</p>
          </div>
          <span className="text-xs font-medium text-blkout-primary">{event.date}</span>
        </div>
      ))}
    </div>
    <button className="w-full mt-4 text-sm text-blkout-primary hover:text-blkout-warm transition-colors">
      View All Events →
    </button>
  </div>
)

const IVORWidget = () => (
  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">I.V.O.R. Resources</h3>
      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
        <span className="text-white text-xs font-bold">AI</span>
      </div>
    </div>
    <p className="text-sm text-gray-700 mb-4">
      Get personalized support and community resources tailored to your needs.
    </p>
    <div className="space-y-2 mb-4">
      <div className="flex items-center text-sm text-gray-600">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
        Mental Health Support
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
        Housing Resources
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
        Legal Assistance
      </div>
    </div>
    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
      Get Help Now
    </button>
  </div>
)

const CommunityActivityWidget = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Community Activity</h3>
      <Users className="w-5 h-5 text-gray-500" />
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Active discussions</span>
        <span className="text-sm font-medium text-blkout-primary">127</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">New members this week</span>
        <span className="text-sm font-medium text-green-600">+23</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Stories shared</span>
        <span className="text-sm font-medium text-purple-600">45</span>
      </div>
    </div>
    <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
      <p className="text-xs text-orange-800 font-medium">
        💡 HUB members saw 3 new resources first this week
      </p>
    </div>
  </div>
)

const MembershipWidget = () => (
  <div className="bg-gradient-to-br from-blkout-primary/10 to-blkout-warm/10 rounded-lg border border-blkout-primary/20 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Join the Discussion</h3>
    <p className="text-sm text-gray-700 mb-4">
      Connect with Black queer men building liberation together.
    </p>
    <div className="space-y-2 mb-4">
      <div className="flex items-center text-sm text-gray-600">
        <MessageCircle className="w-4 h-4 mr-2 text-blkout-primary" />
        Private community spaces
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <Users className="w-4 h-4 mr-2 text-blkout-primary" />
        Peer support networks
      </div>
    </div>
    <button className="w-full bg-blkout-primary hover:bg-blkout-warm text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
      Request Access
    </button>
  </div>
)

const ContentCategoryKey = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Types</h3>
    <div className="space-y-3">
      {Object.entries(CONTENT_CATEGORIES).map(([category, { color, textColor }]) => (
        <div key={category} className="flex items-center">
          <div className={`w-3 h-3 rounded-full ${color} mr-3`}></div>
          <span className="text-sm text-gray-700">{category}</span>
        </div>
      ))}
    </div>
  </div>
)

// Main component
export default function MagazineHomepage() {
  const [currentFeatured, setCurrentFeatured] = useState(0)

  // Auto-rotate featured articles every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatured((prev) => (prev + 1) % mockFeaturedArticles.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const featuredArticle = mockFeaturedArticles[currentFeatured]

  const getCategoryIndicator = (category: keyof typeof CONTENT_CATEGORIES) => {
    const { color } = CONTENT_CATEGORIES[category]
    return <div className={`w-2 h-2 rounded-full ${color} mr-2`}></div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Primary Navigation */}
      <PrimaryNavigation />
      
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area - 8 columns */}
          <main className="lg:col-span-8">
            
            {/* Featured Story Hero */}
            <section className="mb-12">
              <motion.div
                key={currentFeatured}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200"
              >
                {featuredArticle.image && (
                  <div className="aspect-video md:aspect-[2/1] overflow-hidden">
                    <img
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    {getCategoryIndicator(featuredArticle.category)}
                    <span className="text-sm font-medium text-gray-600">
                      {featuredArticle.category}
                    </span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-sm text-gray-500">Featured Story</span>
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    {featuredArticle.title}
                  </h1>
                  
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blkout-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {featuredArticle.author.avatar}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {featuredArticle.author.name}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 space-x-2">
                            <span>{featuredArticle.publishedAt}</span>
                            <span>•</span>
                            <span>{featuredArticle.readTime} min read</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button className="bg-blkout-primary hover:bg-blkout-warm text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                        Read Story
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                      <button className="text-blkout-primary hover:text-blkout-warm text-sm font-medium">
                        Go Deeper →
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Featured story indicator dots */}
              <div className="flex justify-center mt-6 space-x-2">
                {mockFeaturedArticles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeatured(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentFeatured ? 'bg-blkout-primary' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </section>

            {/* Recent Stories Section */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Recent Stories</h2>
                <button className="text-blkout-primary hover:text-blkout-warm font-medium text-sm">
                  View All Stories →
                </button>
              </div>
              
              {/* Use existing ArticleGrid component for consistency */}
              <ArticleGrid articles={mockRecentArticles} />
            </section>
          </main>

          {/* Sidebar - 4 columns */}
          <aside className="lg:col-span-4">
            <div className="space-y-6">
              <EventsWidget />
              <IVORWidget />
              <CommunityActivityWidget />
              <MembershipWidget />
              <ContentCategoryKey />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}