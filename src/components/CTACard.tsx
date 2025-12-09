import { motion } from 'framer-motion';
import type { Slide } from '../data/slides';

interface CTACardProps {
  slide: Slide;
  index: number;
}

export const CTACard: React.FC<CTACardProps> = ({ slide, index }) => {
  const sizeClasses = {
    small: 'col-span-1',
    medium: 'col-span-1 md:col-span-1',
    large: 'col-span-2 md:col-span-2',
    hero: 'col-span-2 lg:col-span-3'
  };

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl ${sizeClasses[slide.size || 'medium']} min-h-[300px]`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* Background */}
      {slide.bgImage ? (
        <div className="absolute inset-0">
          <img
            src={slide.bgImage}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
        </div>
      ) : (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: slide.bgColor || '#1e3a8a' }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center p-8 text-center">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="space-y-4 max-w-md"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            {slide.title}
          </h3>

          {slide.subtitle && (
            <p className="text-gray-200 font-mono uppercase tracking-wider text-sm">
              {slide.subtitle}
            </p>
          )}

          {slide.content && (
            <p className="text-gray-300 leading-relaxed">
              {slide.content}
            </p>
          )}

          <motion.a
            href={slide.ctaUrl || 'https://blkoutuk.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 px-8 py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {slide.ctaText || 'Learn More'}
          </motion.a>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CTACard;
