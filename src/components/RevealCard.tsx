import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Slide } from '../data/slides';

interface RevealCardProps {
  slide: Slide;
  index: number;
}

export const RevealCard: React.FC<RevealCardProps> = ({ slide, index }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  // Size classes for masonry grid
  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-1 row-span-2 md:col-span-1',
    large: 'col-span-2 row-span-2 md:col-span-2',
    hero: 'col-span-2 row-span-2 md:col-span-2 lg:col-span-3'
  };

  const heightClasses = {
    small: 'min-h-[200px]',
    medium: 'min-h-[300px] md:min-h-[400px]',
    large: 'min-h-[400px] md:min-h-[500px]',
    hero: 'min-h-[500px] md:min-h-[600px]'
  };

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl cursor-pointer group ${sizeClasses[slide.size || 'medium']} ${heightClasses[slide.size || 'medium']}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onClick={() => setIsRevealed(!isRevealed)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background */}
      {slide.bgImage ? (
        <div className="absolute inset-0">
          <img
            src={slide.bgImage}
            alt={slide.title || ''}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>
      ) : (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: slide.bgColor || '#000' }}
        />
      )}

      {/* Video Background */}
      {slide.type === 'video' && slide.videoUrl && (
        <div className="absolute inset-0">
          <video
            src={slide.videoUrl}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6">
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            <motion.div
              key="preview"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {slide.title && (
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight">
                  {slide.title}
                </h3>
              )}
              {slide.subtitle && (
                <p className="text-sm md:text-base text-gray-200 font-mono uppercase tracking-wider">
                  {slide.subtitle}
                </p>
              )}

              {/* Reveal prompt */}
              {(slide.content || slide.quote) && (
                <div className="mt-4 flex items-center gap-2 text-white/60 text-sm">
                  <span className="animate-pulse">Click to reveal</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="revealed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 bg-black/80 backdrop-blur-sm rounded-xl p-4 -m-2"
            >
              {slide.quote && (
                <blockquote className="text-lg italic text-white border-l-4 border-amber-500 pl-4">
                  "{slide.quote}"
                  {slide.author && (
                    <footer className="text-sm text-gray-400 mt-2 not-italic">
                      — {slide.author}
                    </footer>
                  )}
                </blockquote>
              )}

              {slide.content && (
                <p className="text-gray-200 leading-relaxed">
                  {slide.content}
                </p>
              )}

              <button
                className="text-xs text-white/50 hover:text-white/80 transition-colors"
                onClick={(e) => { e.stopPropagation(); setIsRevealed(false); }}
              >
                ✕ Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-amber-500/20" />
      </div>
    </motion.div>
  );
};

export default RevealCard;
