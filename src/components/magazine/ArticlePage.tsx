'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Clock, User, Share2, Bookmark, Heart, MessageCircle, Twitter, Facebook, Link } from 'lucide-react'

interface ArticleContent {
  id: string
  title: string
  excerpt: string
  content: string
  author: {
    name: string
    bio: string
    avatar: string
  }
  publishedAt: string
  updatedAt?: string
  readTime: number
  category: string
  tags: string[]
  image?: string
}

interface ArticlePageProps {
  article: ArticleContent
  onBack?: () => void
}

const mockArticle: ArticleContent = {
  id: '1',
  title: 'Building Cooperative Power in the Digital Age',
  excerpt: 'How Black QTIPOC+ communities are creating new models of economic democracy through technology and collective ownership.',
  content: `
    <p>The future of economic justice isn't just about reforming existing systems—it's about creating entirely new ones. Across the country, Black QTIPOC+ communities are leading the charge in developing cooperative models that center collective ownership, mutual aid, and shared prosperity.</p>

    <p>This isn't just theory. It's happening right now, in real time, in communities that have long been excluded from traditional economic structures.</p>

    <h2>The Digital Commons Revolution</h2>

    <p>Technology has democratized access to tools of production in ways that previous generations couldn't imagine. From platform cooperatives that give workers ownership of the digital platforms they use, to community land trusts that leverage blockchain for transparent governance, we're seeing innovation emerge from the margins.</p>

    <blockquote>
      "We're not just building alternatives to capitalism—we're building the seeds of what comes next." - Community organizer and cooperative developer Maya Johnson
    </blockquote>

    <p>The key insight driving this movement is that economic democracy and racial justice are inseparable. You can't have one without the other. The same systems that extract wealth from our communities are the ones that perpetuate racial inequality.</p>

    <h2>Learning from Our Ancestors</h2>

    <p>This work isn't new. Black communities have always practiced forms of cooperative economics—from the Freedom Budget of the 1960s to the numerous mutual aid societies that sustained our ancestors through Jim Crow and beyond.</p>

    <p>What's different now is the scale and the tools available to us. Digital platforms allow us to coordinate at unprecedented levels, while new legal structures make it easier to formalize cooperative ownership.</p>

    <h2>The Path Forward</h2>

    <p>The transition to a cooperative economy won't happen overnight. It requires patient organizing, thoughtful experimentation, and a willingness to learn from both success and failure.</p>

    <p>But the communities leading this work understand something that mainstream economists often miss: true economic security comes not from individual accumulation, but from collective resilience.</p>

    <p>As we build these new systems, we're not just creating alternatives—we're modeling the world we want to live in. Every cooperative formed, every mutual aid network strengthened, every platform owned by its users rather than its investors, is a step toward the more just future we know is possible.</p>
  `,
  author: {
    name: 'Jordan Thompson',
    bio: 'Jordan is a community organizer and writer focused on cooperative economics and racial justice. They have helped launch three worker cooperatives in Oakland and writes regularly about economic democracy.',
    avatar: 'JT'
  },
  publishedAt: '2025-01-07',
  readTime: 8,
  category: 'Movement',
  tags: ['Cooperative Economy', 'Technology', 'Community Power', 'Racial Justice']
}

export default function ArticlePage({ article = mockArticle, onBack }: ArticlePageProps) {
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

  return (
    <div className="py-8">
      {/* Article Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mb-12"
      >
        {/* Category and Meta */}
        <div className="flex items-center space-x-4 mb-6">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(article.category)}`}>
            {article.category}
          </span>
          <div className="flex items-center space-x-2 text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{article.readTime} min read</span>
          </div>
          <span className="text-gray-500">•</span>
          <span className="text-gray-500">{formatDate(article.publishedAt)}</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {article.title}
        </h1>

        {/* Excerpt */}
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          {article.excerpt}
        </p>

        {/* Author and Actions */}
        <div className="flex items-center justify-between pb-8 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-electric-magenta to-electric-cyan rounded-full flex items-center justify-center text-white font-bold">
              {article.author.avatar}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{article.author.name}</p>
              <p className="text-sm text-gray-500">Community Organizer & Writer</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-400 hover:text-electric-magenta transition-colors"
            >
              <Bookmark className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-400 hover:text-electric-magenta transition-colors"
            >
              <Heart className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-400 hover:text-electric-magenta transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Article Content */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-3xl mx-auto"
      >
        <div 
          className="prose prose-lg prose-gray max-w-none"
          style={{
            lineHeight: '1.8',
          }}
        >
          {/* Temporarily render as text to eliminate XSS risk - TODO: Implement proper HTML sanitization */}
          <div className="whitespace-pre-wrap">
            {article.content.replace(/<[^>]*>/g, '').trim()}
          </div>
        </div>

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Topics</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-electric-magenta hover:text-white transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this story</h3>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Twitter className="w-4 h-4" />
              <span>Twitter</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Facebook className="w-4 h-4" />
              <span>Facebook</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Link className="w-4 h-4" />
              <span>Copy Link</span>
            </motion.button>
          </div>
        </div>
      </motion.article>

      {/* Author Bio */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-4xl mx-auto mt-16 p-8 bg-gray-50 rounded-xl"
      >
        <div className="flex items-start space-x-6">
          <div className="w-16 h-16 bg-gradient-to-br from-electric-magenta to-electric-cyan rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {article.author.avatar}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{article.author.name}</h3>
            <p className="text-gray-600 leading-relaxed mb-4">{article.author.bio}</p>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-electric-magenta hover:text-electric-cyan transition-colors font-medium"
              >
                More from {article.author.name.split(' ')[0]}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 border border-electric-magenta text-electric-magenta rounded-lg hover:bg-electric-magenta hover:text-white transition-colors"
              >
                Follow
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Comments Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="max-w-4xl mx-auto mt-16"
      >
        <div className="flex items-center space-x-3 mb-8">
          <MessageCircle className="w-6 h-6 text-gray-600" />
          <h3 className="text-xl font-bold text-gray-900">Community Responses</h3>
          <span className="text-gray-500">(12)</span>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-600 text-center">
            Join the conversation with other community members.
          </p>
          <div className="mt-4 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-electric-magenta text-white rounded-lg hover:bg-electric-cyan transition-colors"
            >
              Sign In to Comment
            </motion.button>
          </div>
        </div>
      </motion.section>
    </div>
  )
}