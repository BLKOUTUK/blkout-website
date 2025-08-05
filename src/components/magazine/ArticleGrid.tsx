'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, User, ArrowRight, Bookmark, Share2, Wifi, WifiOff } from 'lucide-react'

interface Article {
  id: string
  title: string
  excerpt: string
  author: {
    name: string
    avatar?: string
  }
  publishedAt: string
  readTime: number
  category: string
  featured?: boolean
  image?: string
  tags: string[]
}

interface NewsroomStory {
  id: number
  title: string
  category: string
  summary: string
  author: string
  published_at: string
  featured_image_url?: string
  status: string
}

interface ArticleGridProps {
  articles: Article[]
  featuredArticle?: Article
}

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Building Cooperative Power in the Digital Age',
    excerpt: 'How Black QTIPOC+ communities are creating new models of economic democracy through technology and collective ownership.',
    author: {
      name: 'Jordan Thompson',
      avatar: 'JT'
    },
    publishedAt: '2025-01-07',
    readTime: 8,
    category: 'Movement',
    featured: true,
    tags: ['Cooperative Economy', 'Technology', 'Community Power']
  },
  {
    id: '2', 
    title: 'The Complexity of Joy: Finding Light in the Struggle',
    excerpt: 'A personal reflection on how embracing contradictions has become a form of resistance and healing.',
    author: {
      name: 'Alex Rivera',
      avatar: 'AR'
    },
    publishedAt: '2025-01-06',
    readTime: 5,
    category: 'Personal Story',
    tags: ['Mental Health', 'Resilience', 'Identity']
  },
  {
    id: '3',
    title: 'Community Care as Economic Revolution',
    excerpt: 'Examining how mutual aid networks are modeling the cooperative economy we want to build.',
    author: {
      name: 'Taylor Washington',
      avatar: 'TW'
    },
    publishedAt: '2025-01-05',
    readTime: 12,
    category: 'Analysis',
    tags: ['Mutual Aid', 'Community Care', 'Economics']
  },
  {
    id: '4',
    title: 'Navigating Queer Identity in Professional Spaces',
    excerpt: 'Strategies for authenticity and protection in workplace environments that aren\'t built for us.',
    author: {
      name: 'Morgan Lee',
      avatar: 'ML'
    },
    publishedAt: '2025-01-04',
    readTime: 7,
    category: 'Work & Life',
    tags: ['Professional Development', 'Identity', 'Workplace']
  },
  {
    id: '5',
    title: 'The Art of Collective Decision Making',
    excerpt: 'Lessons learned from organizing consensus-based communities and cooperative businesses.',
    author: {
      name: 'Sam Chen',
      avatar: 'SC'
    },
    publishedAt: '2025-01-03',
    readTime: 10,
    category: 'Community',
    tags: ['Organizing', 'Consensus', 'Leadership']
  },
  {
    id: '6',
    title: 'Redefining Success Beyond Individual Achievement',
    excerpt: 'Why collective liberation requires us to rethink what winning looks like.',
    author: {
      name: 'River Johnson',
      avatar: 'RJ'
    },
    publishedAt: '2025-01-02',
    readTime: 6,
    category: 'Philosophy',
    tags: ['Success', 'Collective Liberation', 'Values']
  }
]

export default function ArticleGrid({ articles: propArticles, featuredArticle }: ArticleGridProps) {
  const [articles, setArticles] = useState<Article[]>(mockArticles)
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'offline'>('checking')
  const [loading, setLoading] = useState(true)

  // Function to convert NewsroomStory to Article format
  const convertStoryToArticle = (story: NewsroomStory): Article => ({
    id: story.id.toString(),
    title: story.title,
    excerpt: story.summary,
    author: {
      name: story.author,
      avatar: story.author.split(' ').map(n => n[0]).join('').toUpperCase()
    },
    publishedAt: story.published_at.split('T')[0],
    readTime: Math.max(3, Math.floor(story.summary.length / 200)), // Estimate read time
    category: story.category,
    featured: false,
    image: story.featured_image_url,
    tags: [story.category]
  })

  // Fetch stories from newsroom backend
  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true)
      setBackendStatus('checking')
      
      try {
        const response = await fetch('http://localhost:8000/api/newsroom/stories')
        
        if (response.ok) {
          const data = await response.json()
          
          if (data.status === 'success' && data.stories) {
            const convertedArticles = data.stories.map(convertStoryToArticle)
            // Mark first article as featured
            if (convertedArticles.length > 0) {
              convertedArticles[0].featured = true
            }
            setArticles(convertedArticles)
            setBackendStatus('connected')
            // Successfully connected to newsroom backend
          } else {
            throw new Error('Invalid response format')
          }
        } else {
          throw new Error(`HTTP ${response.status}`)
        }
      } catch (error) {
        // Backend offline, using fallback data
        setBackendStatus('offline')
        setArticles(mockArticles)
      } finally {
        setLoading(false)
      }
    }

    fetchStories()
  }, [])

  // Use prop articles if provided, otherwise use fetched/mock articles
  const finalArticles = propArticles || articles
  const featured = featuredArticle || finalArticles.find(a => a.featured) || finalArticles[0]
  const regularArticles = finalArticles.filter(a => a.id !== featured.id)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'Movement': 'bg-electric-magenta text-white',
      'Personal Story': 'bg-electric-cyan text-white',
      'Analysis': 'bg-electric-indigo text-white',
      'Work & Life': 'bg-electric-green text-white',
      'Community': 'bg-purple-600 text-white',
      'Philosophy': 'bg-orange-600 text-white'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-600 text-white'
  }

  if (loading) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-magenta"></div>
            <span className="text-gray-600">Loading stories...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      {/* Backend Status Indicator */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-sm">
          {backendStatus === 'connected' ? (
            <>
              <Wifi className="w-4 h-4 text-green-500" />
              <span className="text-green-600">Live newsroom data</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-orange-500" />
              <span className="text-orange-600">Demo mode - using sample content</span>
              <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full border border-orange-200">
                PREVIEW
              </span>
            </>
          )}
        </div>
      </div>

      {/* Featured Article */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-1 h-6 bg-electric-magenta"></div>
          <h2 className="text-2xl font-bold text-gray-900">Featured Story</h2>
        </div>

        <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow ${
          backendStatus === 'connected' ? '' : 'relative border-dashed border-orange-300'
        }`}>
          {backendStatus !== 'connected' && (
            <div className="absolute top-4 right-4 z-10">
              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded border border-orange-200">
                SAMPLE
              </span>
            </div>
          )}
          <div className="p-8 md:p-12">
            <div className="flex items-center space-x-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(featured.category)}`}>
                {featured.category}
              </span>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{featured.readTime} min read</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {featured.title}
            </h1>

            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {featured.excerpt}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-electric-magenta to-electric-cyan rounded-full flex items-center justify-center text-white font-semibold">
                  {featured.author.avatar}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{featured.author.name}</p>
                  <p className="text-sm text-gray-500">{formatDate(featured.publishedAt)}</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-6 py-3 bg-electric-magenta text-white rounded-lg hover:bg-electric-cyan transition-colors"
              >
                <span>Read Story</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Article Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-1 h-6 bg-electric-cyan"></div>
            <h2 className="text-2xl font-bold text-gray-900">Latest Stories</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-electric-magenta focus:border-transparent">
              <option>All Categories</option>
              <option>Movement</option>
              <option>Personal Story</option>
              <option>Analysis</option>
              <option>Community</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group ${
                backendStatus === 'connected' ? '' : 'relative border-dashed border-orange-300'
              }`}
            >
              {backendStatus !== 'connected' && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs rounded border border-orange-200">
                    SAMPLE
                  </span>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getCategoryColor(article.category)}`}>
                    {article.category}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-gray-400 hover:text-electric-magenta transition-colors"
                    >
                      <Bookmark className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-gray-400 hover:text-electric-magenta transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-electric-magenta transition-colors leading-tight">
                  {article.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-electric-cyan to-electric-indigo rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {article.author.avatar}
                    </div>
                    <span className="text-gray-700">{article.author.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-gray-500">
                    <span>{formatDate(article.publishedAt)}</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}m</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {article.tags.slice(0, 2).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 border-2 border-electric-magenta text-electric-magenta rounded-lg hover:bg-electric-magenta hover:text-white transition-colors"
          >
            Load More Stories
          </motion.button>
        </div>
      </section>
    </div>
  )
}