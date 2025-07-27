'use client'

import React from 'react'
import { motion } from 'framer-motion'
import RetroImage from './RetroImage'
import RetroVideo from './RetroVideo'

interface MediaItem {
  id: string
  type: 'image' | 'video'
  src: string
  alt?: string
  webmSrc?: string // For videos
  mp4Src?: string  // For videos
  title?: string
  description?: string
  vcrIntensity?: 'light' | 'medium' | 'heavy'
}

interface MediaGalleryProps {
  items: MediaItem[]
  layout?: 'grid' | 'masonry' | 'slideshow'
  columns?: 2 | 3 | 4
  className?: string
}

export default function MediaGallery({
  items,
  layout = 'grid',
  columns = 3,
  className = ''
}: MediaGalleryProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const getGridCols = () => {
    switch (columns) {
      case 2: return 'grid-cols-1 md:grid-cols-2'
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }
  }

  return (
    <motion.div
      className={`${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className={`grid ${getGridCols()} gap-6`}>
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="group"
          >
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              {item.type === 'image' ? (
                <RetroImage
                  src={item.src}
                  alt={item.alt || item.title || `Gallery image ${index + 1}`}
                  vcrIntensity={item.vcrIntensity || 'medium'}
                  className="w-full h-full"
                  overlayContent={
                    (item.title || item.description) && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {item.title && (
                          <h3 className="text-lg font-bold mb-2 text-electric-cyan">
                            {item.title}
                          </h3>
                        )}
                        {item.description && (
                          <p className="text-sm text-gray-200">
                            {item.description}
                          </p>
                        )}
                      </div>
                    )
                  }
                />
              ) : (
                <RetroVideo
                  webmSrc={item.webmSrc || ''}
                  mp4Src={item.mp4Src || item.src}
                  vcrIntensity={item.vcrIntensity || 'medium'}
                  className="w-full h-full"
                  scrollTriggered={true}
                  overlayContent={
                    (item.title || item.description) && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {item.title && (
                          <h3 className="text-lg font-bold mb-2 text-electric-cyan">
                            {item.title}
                          </h3>
                        )}
                        {item.description && (
                          <p className="text-sm text-gray-200">
                            {item.description}
                          </p>
                        )}
                      </div>
                    )
                  }
                />
              )}
            </div>

            {/* Caption Below Media */}
            {(item.title || item.description) && (
              <motion.div
                className="mt-4 p-4 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {item.title && (
                  <h3 className="text-white font-semibold mb-2">
                    {item.title}
                  </h3>
                )}
                {item.description && (
                  <p className="text-gray-300 text-sm">
                    {item.description}
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}