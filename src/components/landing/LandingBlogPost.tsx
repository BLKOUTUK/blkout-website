'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Clock, User } from 'lucide-react'
import { Link } from 'react-router-dom'

interface BlogPost {
  path: string
  date: string
  title: string
  summary: string
  tags: string[]
  images?: string[]
  readingTime?: number
  author?: {
    name: string
    avatar: string
  }
}

interface LandingBlogPostProps {
  post: BlogPost
  slug: string
  imagePosition?: 'left' | 'right' | 'center'
  index?: number
  className?: string
}

export const LandingBlogPost: React.FC<LandingBlogPostProps> = ({
  post,
  slug,
  imagePosition = 'left',
  index = 0,
  className = ''
}) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`group bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 ${className}`}
    >
      <Link href={post.path || slug} className="block">
        {/* Featured Image */}
        {post.images && post.images[0] && (
          <div className="aspect-video overflow-hidden">
            <img
              src={post.images[0]}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 2).map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-2 py-1 bg-emerald-600/20 text-emerald-400 text-xs font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors mb-3 line-clamp-2">
            {post.title}
          </h3>

          {/* Summary */}
          <p className="text-gray-400 mb-4 line-clamp-3">
            {post.summary}
          </p>

          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              {/* Author */}
              {post.author && (
                <div className="flex items-center gap-2">
                  {post.author.avatar && (
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  )}
                  <span>{post.author.name}</span>
                </div>
              )}

              {/* Reading Time */}
              {post.readingTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readingTime} min read</span>
                </div>
              )}
            </div>

            {/* Date */}
            <time dateTime={post.date} className="text-gray-500">
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </time>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}