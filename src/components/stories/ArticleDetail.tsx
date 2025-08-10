'use client'

import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, User, Calendar, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import PrimaryNavigationEnhanced from '../layout/PrimaryNavigationEnhanced'
import PlatformFooter from '../layout/PlatformFooter'

// Demo article content - clearly labeled
const demoArticles = {
  'black-joy-celebration': {
    title: '[DEMO] Celebrating Black Joy as Resistance',
    content: `
# DEMO CONTENT WARNING

**This is demonstration content for platform testing purposes only.**

## Celebrating Black Joy as Resistance

*This would be where authentic community content appears once migration from blkoutuk.com is complete.*

### What Will Be Here

- Real stories from community members
- Authentic perspectives on Black QTIPOC experiences  
- Original commentary and analysis
- Community-generated content and voices

### Migration in Progress

We are actively working to migrate authentic content from our existing platform at blkoutuk.com. This includes:

- Personal narratives and lived experiences
- Community event coverage and responses
- Original analysis and commentary
- Historical archives and documentation

For now, please visit [blkoutuk.com](https://blkoutuk.com) for authentic community content and stories.
    `,
    date: '2025-01-15',
    author: 'Demo Author',
    readingTime: 4,
    tags: ['Demo Content', 'Black Joy', 'Resistance'],
    image: '/images/story archive colours/blue images/tumblr_384f4870a87f4722ccfc66e8bb2fa98d_e8839690_1280.jpg'
  },
  'community-arts-spotlight': {
    title: '[DEMO] Community Arts Program Making Waves in Manchester',
    content: `
# DEMO CONTENT WARNING

**This is demonstration content for platform testing purposes only.**

## Community Arts Program Making Waves in Manchester

*This would be where authentic community coverage appears once migration from blkoutuk.com is complete.*

### What Will Be Here

- Real coverage of community arts initiatives
- Interviews with program participants
- Impact stories and community responses
- Documentation of grassroots cultural work

### Migration in Progress

We are actively working to migrate authentic content from our existing platform at blkoutuk.com.

For authentic community arts coverage and stories, please visit [blkoutuk.com](https://blkoutuk.com).
    `,
    date: '2025-01-12',
    author: 'Demo Author',
    readingTime: 5,
    tags: ['Demo Content', 'Arts', 'Manchester'],
    image: '/images/story archive colours/red images/tumblr_5d9a2ccc0fa2a56133c0501cacc46adf_6a189059_1280.jpg'
  },
  'health-equity-discussion': {
    title: '[DEMO] Health Equity: The Conversation We Need to Have',
    content: `
# DEMO CONTENT WARNING

**This is demonstration content for platform testing purposes only.**

## Health Equity: The Conversation We Need to Have

*This would be where authentic health equity analysis appears once migration from blkoutuk.com is complete.*

### What Will Be Here

- Community perspectives on healthcare access
- Analysis of health disparities affecting Black QTIPOC communities
- Resource sharing and mutual aid coordination
- Advocacy strategies and community responses

### Migration in Progress

We are actively working to migrate authentic content from our existing platform at blkoutuk.com.

For real health equity discussions and community resources, please visit [blkoutuk.com](https://blkoutuk.com).
    `,
    date: '2025-01-10',
    author: 'Demo Author',
    readingTime: 7,
    tags: ['Demo Content', 'Health', 'Equity'],
    image: '/images/story archive colours/green images/tumblr_4ccb3ff837292f82d8ab03ba554e8786_0684d01c_1280.jpg'
  }
}

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>()
  
  if (!slug || !demoArticles[slug as keyof typeof demoArticles]) {
    return <Navigate to="/platform" replace />
  }

  const article = demoArticles[slug as keyof typeof demoArticles]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <PrimaryNavigationEnhanced />
      
      {/* Demo Content Warning Banner */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white text-center py-4 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="font-bold text-lg">⚠️ DEMONSTRATION CONTENT</p>
          <p className="text-sm mt-1">
            This is placeholder content for platform testing. Real articles from blkoutuk.com are being migrated. 
            <a href="https://blkoutuk.com" className="underline ml-1 font-semibold" target="_blank" rel="noopener noreferrer">
              Visit blkoutuk.com for authentic content →
            </a>
          </p>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 py-16">
        {/* Back to Platform */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            to="/platform" 
            className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Platform
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          {/* Featured Image */}
          <div className="aspect-video mb-8 overflow-hidden rounded-lg">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(article.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{article.readingTime} min read</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.header>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="prose prose-invert prose-lg max-w-none"
        >
          <div className="whitespace-pre-line leading-relaxed">
            {article.content}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 p-8 bg-gradient-to-r from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 rounded-lg text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Ready for Real Stories?</h3>
          <p className="text-gray-300 mb-6 text-lg">
            While we migrate authentic content to this new platform, visit our existing site for real community stories and analysis.
          </p>
          <a
            href="https://blkoutuk.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-bold text-lg hover:from-emerald-500 hover:to-indigo-500 transition-all duration-300 rounded-lg"
          >
            <ExternalLink className="w-5 h-5" />
            Visit BLKOUTUK.com
          </a>
        </motion.div>
      </article>

      <PlatformFooter />
    </div>
  )
}