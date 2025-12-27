/**
 * Disclaimer Card - Card 0
 * AI imagery transparency and model attribution
 */

import { motion } from 'framer-motion';

interface DisclaimerCardProps {
  isActive: boolean;
}

export const DisclaimerCard: React.FC<DisclaimerCardProps> = ({ isActive }) => {
  return (
    <div className="h-screen snap-start flex items-center justify-center px-6 md:px-12 bg-gradient-to-br from-indigo-950 via-purple-950 to-black">
      <div className="text-center max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-black leading-tight mb-8 uppercase tracking-tight text-white"
          style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}
        >
          The following imagery created with AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl md:text-2xl text-amber-400 mb-12 font-bold"
        >
          Representing diverse Black queer experiences
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-sm md:text-base text-purple-400 space-y-6 leading-relaxed"
        >
          <div className="bg-purple-900/30 border border-purple-700/30 rounded-lg p-6">
            <p className="font-semibold text-purple-300 mb-3">Models used:</p>
            <ul className="text-left space-y-2 max-w-md mx-auto">
              <li>• Alibaba Wan 2.6 (DashScope) - Image generation</li>
              <li>• Google Gemini 3 Pro - Concept development</li>
            </ul>
          </div>

          <div className="text-purple-500">
            <p className="mb-2">Real photography appears in:</p>
            <p className="font-mono text-xs">
              Cards 20, 27, 29 (Liberation Collective community photos)<br/>
              Card 39 transition video (community + Rob)<br/>
              Card 40 OOMF Interactive
            </p>
          </div>

          <p className="text-xs text-purple-600 italic">
            All AI-generated characters represent fictional individuals<br/>
            inspired by our community.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="mt-12"
        >
          <p className="text-purple-500 text-sm animate-pulse">
            Scroll to continue ↓
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default DisclaimerCard;
