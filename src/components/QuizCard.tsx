import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Slide } from '../data/slides';

interface QuizCardProps {
  slide: Slide;
  index: number;
}

export const QuizCard: React.FC<QuizCardProps> = ({ slide, index }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleOptionClick = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setTimeout(() => setShowResult(true), 500);
  };

  const reset = () => {
    setSelectedOption(null);
    setShowResult(false);
  };

  return (
    <motion.div
      className="col-span-2 row-span-2 relative overflow-hidden rounded-2xl"
      style={{ backgroundColor: slide.bgColor || '#7c2d12' }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div className="relative z-10 h-full flex flex-col justify-center p-8 min-h-[400px]">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  {slide.title}
                </h3>
                <p className="text-gray-200 font-mono uppercase tracking-wider">
                  {slide.subtitle}
                </p>
              </div>

              {slide.content && (
                <p className="text-center text-gray-300">
                  {slide.content}
                </p>
              )}

              <div className="mt-6">
                <h4 className="text-xl text-white text-center mb-4">
                  {slide.question}
                </h4>

                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                  {(slide.options as string[])?.map((option, optIndex) => (
                    <motion.button
                      key={optIndex}
                      onClick={() => handleOptionClick(optIndex)}
                      className={`p-4 rounded-xl text-white text-sm font-medium transition-all ${
                        selectedOption === optIndex
                          ? 'bg-white/30 ring-2 ring-white'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 bg-black/50 backdrop-blur-sm rounded-2xl p-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="text-6xl"
              >
                🎉
              </motion.div>

              <h3 className="text-2xl font-bold text-green-400">
                {slide.result?.title}
              </h3>

              <p className="text-gray-200 leading-relaxed max-w-md mx-auto">
                {slide.result?.message}
              </p>

              <button
                onClick={reset}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Try again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default QuizCard;
