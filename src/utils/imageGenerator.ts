import { Article } from '../data/articles'

// Enhanced image generation system for articles
export class ArticleImageGenerator {
  private static baseUrls = {
    unsplash: 'https://images.unsplash.com',
    picsum: 'https://picsum.photos'
  }

  // Category-specific image themes and colors
  private static categoryThemes = {
    'original': {
      colors: ['8B5CF6', '6366F1', '7C3AED'], // Purples
      keywords: ['community', 'people', 'discussion', 'meeting', 'unity'],
      fallbackId: 1
    },
    'curated': {
      colors: ['EC4899', 'F472B6', 'E879F9'], // Pinks
      keywords: ['books', 'reading', 'library', 'study', 'knowledge'],
      fallbackId: 2
    },
    'event-coverage': {
      colors: ['F97316', 'FB923C', 'FDBA74'], // Oranges
      keywords: ['event', 'crowd', 'celebration', 'gathering', 'festival'],
      fallbackId: 3
    },
    'community-response': {
      colors: ['10B981', '34D399', '6EE7B7'], // Greens  
      keywords: ['protest', 'activism', 'community', 'solidarity', 'justice'],
      fallbackId: 4
    },
    'multimedia': {
      colors: ['3B82F6', '60A5FA', '93C5FD'], // Blues
      keywords: ['technology', 'media', 'video', 'audio', 'digital'],
      fallbackId: 5
    }
  }

  // Generate a gradient background for articles without specific images
  static generateGradientImage(category: Article['category'], id: string): string {
    const theme = this.categoryThemes[category]
    const colors = theme.colors
    const primaryColor = colors[0]
    const secondaryColor = colors[1] || colors[0]
    
    // Create a data URL for a CSS gradient
    const gradientSvg = `
      <svg width="800" height="500" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#${primaryColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:#${secondaryColor};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)" />
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial, sans-serif" font-size="48" font-weight="bold" opacity="0.8">
          BLKOUT
        </text>
      </svg>
    `
    
    return `data:image/svg+xml;base64,${btoa(gradientSvg)}`
  }

  // Generate themed placeholder using Picsum with category-appropriate seed
  static generateThemedPlaceholder(category: Article['category'], id: string): string {
    const theme = this.categoryThemes[category]
    const seed = parseInt(id) || theme.fallbackId
    return `${this.baseUrls.picsum}/800/500?random=${seed}&blur=1`
  }

  // Generate multiple image options for an article
  static generateImageOptions(article: Article): {
    primary: string
    gradient: string
    placeholder: string
    thumbnail: string
  } {
    return {
      primary: this.generateThemedPlaceholder(article.category, article.id),
      gradient: this.generateGradientImage(article.category, article.id),
      placeholder: `${this.baseUrls.picsum}/800/500?random=${article.id}`,
      thumbnail: `${this.baseUrls.picsum}/400/300?random=${article.id}`
    }
  }

  // Get category color for UI elements
  static getCategoryColor(category: Article['category']): string {
    const theme = this.categoryThemes[category]
    return `#${theme.colors[0]}`
  }

  // Get category text color classes for Tailwind
  static getCategoryClasses(category: Article['category']): string {
    switch (category) {
      case 'original': return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      case 'curated': return 'bg-pink-500/20 text-pink-300 border-pink-500/30'
      case 'event-coverage': return 'bg-orange-500/20 text-orange-300 border-orange-500/30'
      case 'community-response': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'multimedia': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }
}

// Enhanced article image component props
export interface ArticleImageProps {
  article: Article
  size?: 'thumbnail' | 'medium' | 'large' | 'hero'
  className?: string
  showGradientFallback?: boolean
}

// Size mappings for different use cases
export const imageSizes = {
  thumbnail: { width: 400, height: 300 },
  medium: { width: 600, height: 400 },
  large: { width: 800, height: 500 },
  hero: { width: 1200, height: 600 }
}