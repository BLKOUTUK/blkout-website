'use client'

import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, User, Calendar, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import PrimaryNavigationEnhanced from '../layout/PrimaryNavigationEnhanced'
import PlatformFooter from '../layout/PlatformFooter'
import { liveStoryArchive } from '../../data/liveStoryArchive'


export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>()
  
  // Find the article by slug (which should match the id)
  const article = liveStoryArchive.find((story: any) => story.id === slug)
  
  if (!slug || !article) {
    return <Navigate to="/stories" replace />
  }

  // Generate image path based on category for articles without images
  const getImageByCategory = (category: string, id: string) => {
    const categoryImages = {
      'Community': '/images/story archive colours/green images/',
      'History & Culture': '/images/story archive colours/blue images/', 
      'Arts & Culture': '/images/story archive colours/red images/',
      'Community Building': '/images/story archive colours/purple images/',
      'Geography & Space': '/images/story archive colours/blue images/',
      'Manifesto': '/images/story archive colours/gold images/',
      'Technology': '/images/story archive colours/blue images/',
      'Health & Wellness': '/images/story archive colours/green images/',
      'Economics': '/images/story archive colours/purple images/',
      'Media & Storytelling': '/images/story archive colours/red images/'
    }
    
    // Use a default image based on category
    const baseImageUrl = categoryImages[category as keyof typeof categoryImages] || '/images/story archive colours/blue images/'
    return article.imageUrl || `${baseImageUrl}tumblr_384f4870a87f4722ccfc66e8bb2fa98d_e8839690_1280.jpg`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-white">
      <PrimaryNavigationEnhanced />
      
      <article className="max-w-4xl mx-auto px-6 py-16">
        {/* Back to Stories */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            to="/stories" 
            className="inline-flex items-center text-emerald-400 hover:text-emerald-300 transition-colors font-bold font-display uppercase tracking-wide"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stories
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
          <div className="aspect-video mb-8 overflow-hidden rounded-2xl">
            <img
              src={getImageByCategory(article.category, article.id)}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Category Badge */}
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-violet-500/20 border border-emerald-400/30 rounded-full text-emerald-300 font-bold font-display uppercase text-sm tracking-widest">
              {article.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black font-display uppercase mb-6 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-emerald-400 via-white to-violet-400 bg-clip-text text-transparent">
              {article.title}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/70 mb-8 font-light leading-relaxed">
            {article.excerpt}
          </p>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-white/60 mb-8">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="font-medium">{article.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{new Date(article.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{article.readTime} min read</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-3 mb-8">
            {article.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 rounded-full text-sm font-medium"
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
          <div className="text-white/90 leading-relaxed text-lg space-y-6">
            {article.content?.split('\n\n').map((paragraph: string, index: number) => (
              <p key={index} className="mb-6">
                {paragraph.trim()}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Author Bio */}
        {article.author.bio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 p-8 bg-gradient-to-br from-emerald-500/10 to-violet-500/10 backdrop-blur-sm border border-white/10 rounded-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center rounded-2xl text-white font-bold text-xl">
                {article.author.avatar}
              </div>
              <div>
                <h3 className="text-xl font-bold font-display uppercase text-white mb-2">
                  {article.author.name}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {article.author.bio}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Related Articles CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <Link
            to="/stories"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-violet-600 text-white font-bold font-display uppercase tracking-wide hover:from-emerald-500 hover:to-violet-500 transition-all duration-300 rounded-2xl"
          >
            <ArrowLeft className="w-5 h-5" />
            Explore More Stories
          </Link>
        </motion.div>
      </article>

      <PlatformFooter />
    </div>
  )
}