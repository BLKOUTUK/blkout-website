import React, { useState } from 'react'
import { Article } from '../../data/articles'
import { ArticleImageGenerator, ArticleImageProps, imageSizes } from '../../utils/imageGenerator'

const ArticleImage: React.FC<ArticleImageProps> = ({ 
  article, 
  size = 'medium', 
  className = '', 
  showGradientFallback = true 
}) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const imageOptions = ArticleImageGenerator.generateImageOptions(article)
  const dimensions = imageSizes[size]
  
  // Determine which image to show - prioritize Black queer culture images
  const getImageSrc = (): string => {
    // If article has a specific image and it hasn't errored, use it
    if (article.image && !imageError) {
      return article.image
    }
    
    // Default to our beautiful Black queer culture imagery
    // Use thumbnail/squared for small sizes, primary for larger sizes
    if (size === 'thumbnail') {
      return imageOptions.squared
    }
    
    // For error cases or articles without images, use our culture imagery
    return imageOptions.primary
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  return (
    <div 
      className={`relative overflow-hidden bg-gray-800 ${className}`}
      style={{ 
        aspectRatio: `${dimensions.width}/${dimensions.height}`,
        minHeight: size === 'hero' ? '400px' : size === 'large' ? '300px' : '200px'
      }}
    >
      {/* Loading placeholder */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}

      {/* Main image */}
      <img
        src={getImageSrc()}
        alt={article.title}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
      />

      {/* Category overlay */}
      <div className="absolute top-3 left-3">
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
          ArticleImageGenerator.getCategoryClasses(article.category)
        }`}>
          {article.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
      </div>

      {/* Featured badge */}
      {article.featured && (
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 bg-yellow-500/90 text-yellow-900 rounded text-xs font-medium">
            Featured
          </span>
        </div>
      )}

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    </div>
  )
}

export default ArticleImage