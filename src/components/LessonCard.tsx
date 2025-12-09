import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Slide } from '../data/slides';

interface LessonCardProps {
  slide: Slide;
  index: number;
}

export const LessonCard: React.FC<LessonCardProps> = ({ slide, index }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const sizeClasses = {
    small: 'col-span-1',
    medium: 'col-span-1 md:col-span-1',
    large: 'col-span-2',
    hero: 'col-span-2 lg:col-span-3'
  };

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl cursor-pointer group ${sizeClasses[slide.size || 'medium']} min-h-[350px]`}
      style={{ backgroundColor: slide.bgColor || '#dc2626' }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onClick={() => setIsRevealed(!isRevealed)}
    >
      <div className="relative z-10 h-full flex flex-col justify-center p-6 md:p-8">
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            <motion.div
              key="lesson-preview"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  {slide.title}
                </h3>
                <p className="text-gray-200 font-mono uppercase tracking-wider text-sm">
                  {slide.subtitle}
                </p>
              </div>

              {/* Quote preview */}
              {slide.quote && (
                <blockquote className="border-l-4 border-white/30 pl-4 py-2">
                  <p className="text-white/90 italic text-lg leading-relaxed">
                    "{slide.quote}"
                  </p>
                  {slide.author && (
                    <footer className="text-gray-300 text-sm mt-2">
                      — {slide.author}
                    </footer>
                  )}
                </blockquote>
              )}

              {/* Reveal prompt */}
              <motion.div
                className="flex items-center gap-2 text-white/60 text-sm"
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <span>💭 Tap to Reveal Our Response</span>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="lesson-revealed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4 bg-black/60 backdrop-blur-sm rounded-xl p-6"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">
                  Community Response
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsRevealed(false);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {slide.content && (
                <div className="space-y-4">
                  {slide.content.split('\n\n').map((paragraph, pIndex) => (
                    <motion.p
                      key={pIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: pIndex * 0.1 }}
                      className="text-gray-200 leading-relaxed"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-4 right-4 text-4xl opacity-20">
        ❝
      </div>
    </motion.div>
  );
};

export default LessonCard;
