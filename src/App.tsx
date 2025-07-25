import { motion } from 'framer-motion'
import { ArrowRight, Users, Heart, Zap } from 'lucide-react'
import { SITE_CONFIG, COMMUNITY_VALUES } from './lib/constants'
import IvorChatbot from './components/blkout/IvorChatbot'

function App() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blkout-deep via-blkout-accent to-blkout-primary">
      <div className="text-center py-20">
        <h1 className="text-6xl font-bold text-white mb-4">
          {SITE_CONFIG.name}
        </h1>
        <p className="text-xl text-gray-200">
          {SITE_CONFIG.description}
        </p>
      </div>
    </main>
  )
}

export default App