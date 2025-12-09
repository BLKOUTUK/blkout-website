import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Slide } from '../data/slides';

interface PathwayCardProps {
  slide: Slide;
  index: number;
}

export const PathwayCard: React.FC<PathwayCardProps> = ({ slide, index }) => {
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const options = slide.options as { text: string; pathway: string }[] | undefined;

  const handlePathwayClick = (pathway: string) => {
    setSelectedPathway(pathway);
    setTimeout(() => setShowResult(true), 300);
  };

  const reset = () => {
    setSelectedPathway(null);
    setShowResult(false);
  };

  const result = selectedPathway ? slide.pathwayResults?.[selectedPathway] : null;

  return (
    <motion.div
      className="col-span-2 row-span-2 lg:col-span-3 relative overflow-hidden rounded-2xl"
      style={{ backgroundColor: slide.bgColor || '#ea580c' }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div className="relative z-10 h-full flex flex-col justify-center p-8 min-h-[500px]">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="pathway-quiz"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h3 className="text-2xl md:text-4xl font-bold text-white">
                  {slide.title}
                </h3>
                <p className="text-gray-200 font-mono uppercase tracking-wider">
                  {slide.subtitle}
                </p>
              </div>

              {slide.content && (
                <p className="text-center text-gray-200 max-w-lg mx-auto">
                  {slide.content}
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {options?.map((option, optIndex) => (
                  <motion.button
                    key={optIndex}
                    onClick={() => handlePathwayClick(option.pathway)}
                    className={`p-6 rounded-xl text-white text-left transition-all bg-white/10 hover:bg-white/20 border-2 border-transparent hover:border-white/30`}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-lg font-medium">{option.text}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="pathway-result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto bg-black/60 backdrop-blur-sm rounded-2xl p-8 space-y-6"
            >
              <div className="space-y-2">
                <motion.h3
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold text-green-400"
                >
                  {result?.title}
                </motion.h3>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-gray-300 italic"
                >
                  {result?.subtitle}
                </motion.p>
              </div>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-200 leading-relaxed"
              >
                {result?.description}
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <h4 className="text-white font-semibold">Immediate Opportunities:</h4>
                <ul className="space-y-2">
                  {result?.opportunities.map((opp, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-green-400 mt-1">→</span>
                      {opp}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex gap-4 pt-4"
              >
                <button
                  onClick={reset}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  Take Quiz Again
                </button>
                <a
                  href="https://blkoutuk.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold transition-colors"
                >
                  Get Started
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PathwayCard;
