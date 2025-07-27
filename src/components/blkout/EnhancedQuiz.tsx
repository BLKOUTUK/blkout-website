import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

interface QuizProps {
  slide: any
  onComplete?: (responses: any[]) => void
}

const EnhancedQuiz: React.FC<QuizProps> = ({ slide, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<any[]>([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [dominantPathway, setDominantPathway] = useState<string>('')

  const calculateDominantPathway = (answers: any[]) => {
    const pathwayCounts: { [key: string]: number } = {}
    
    answers.forEach(answer => {
      if (answer.pathway) {
        pathwayCounts[answer.pathway] = (pathwayCounts[answer.pathway] || 0) + 1
      }
    })

    return Object.entries(pathwayCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'community-healer'
  }

  const handleAnswer = (option: any) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = { 
      answer: option.text, 
      pathway: option.pathway 
    }
    setSelectedAnswers(newAnswers)

    if (currentQuestion < (slide.questions?.length || 1) - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      const pathway = calculateDominantPathway([...newAnswers])
      setDominantPathway(pathway)
      setIsCompleted(true)
      onComplete?.(newAnswers)
    }
  }

  if (!slide.questions || slide.questions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-4xl mx-auto space-y-8 text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white heading-block mb-8">
          {slide.title}
        </h1>
        <p className="text-xl text-gray-200">
          {slide.content}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onComplete?.([])}
          className="bg-blkout-primary hover:bg-blkout-warm text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors"
        >
          Continue Your Journey
        </motion.button>
      </motion.div>
    )
  }

  if (isCompleted && dominantPathway) {
    const pathwayData = slide.pathwayResponses?.[dominantPathway]
    
    if (!pathwayData) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-8 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white heading-block mb-8">
            Pathway Discovered!
          </h1>
          <p className="text-xl text-gray-200">
            Your unique contribution to collective liberation has been identified.
          </p>
        </motion.div>
      )
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-5xl mx-auto space-y-8"
      >
        {/* Pathway Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-gradient-to-r from-blkout-primary to-blkout-warm rounded-full px-6 py-2 mb-6">
            <span className="text-white font-mono text-xs uppercase tracking-widest font-bold">
              Your Liberation Pathway
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white heading-block mb-4">
            {pathwayData.title}
          </h1>
          <p className="text-xl md:text-2xl text-blkout-primary font-semibold">
            {pathwayData.subtitle}
          </p>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8"
        >
          <p className="text-lg text-gray-200 leading-relaxed">
            {pathwayData.description}
          </p>
        </motion.div>

        {/* Opportunities */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-2xl font-bold text-white heading-block mb-4">
              Your Opportunities
            </h3>
            <ul className="space-y-3">
              {pathwayData.opportunities.map((opportunity: string, index: number) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                  className="flex items-start gap-3 text-gray-200"
                >
                  <span className="text-blkout-primary mt-1">•</span>
                  <span>{opportunity}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* IVOR Video Introduction */}
          <div className="bg-gradient-to-br from-blue-800/80 to-purple-900/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
            <h3 className="text-2xl font-bold text-white heading-block mb-4">
              Meet IVOR
            </h3>
            <div className="relative rounded-xl overflow-hidden mb-4 bg-black/20 aspect-square">
              <video 
                autoPlay 
                muted 
                loop 
                className="w-full h-full object-cover"
                src="/images/ivorintrovid.mp4"
              >
                <source src="/images/ivorintrovid.mp4" type="video/mp4" />
              </video>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed">
              {pathwayData.ivorCapability}
            </p>
          </div>
        </motion.div>

        {/* Continue Your Journey - Pathway-Specific Routing */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="text-center"
        >
          <div className="bg-gradient-to-br from-blkout-primary/20 to-blkout-warm/20 backdrop-blur-sm rounded-2xl p-8 border border-blkout-primary/30">
            <h3 className="text-2xl md:text-3xl font-bold text-white heading-block mb-4">
              Continue Your Liberation Journey
            </h3>
            <p className="text-lg text-gray-200 mb-8">
              Connect with content and community that serves your pathway.
            </p>
            
            {/* Pathway-Specific Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Newsroom - for analysis and community news */}
              <Link to="/media/newsroom">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-6 bg-black/30 hover:bg-black/40 rounded-xl border border-white/20 transition-all"
                >
                  <div className="text-3xl mb-3">📰</div>
                  <h4 className="text-lg font-bold text-white mb-2">Community News</h4>
                  <p className="text-sm text-gray-300">Liberation analysis & community updates</p>
                </motion.div>
              </Link>
              
              {/* Channel BLKOUT - for video content and education */}
              <Link to="/media/channel">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-6 bg-black/30 hover:bg-black/40 rounded-xl border border-white/20 transition-all"
                >
                  <div className="text-3xl mb-3">📺</div>
                  <h4 className="text-lg font-bold text-white mb-2">Channel BLKOUT</h4>
                  <p className="text-sm text-gray-300">Video stories & educational content</p>
                </motion.div>
              </Link>
              
              {/* Storylab - for personal expression and community stories */}
              <Link to="/media/storylab">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-6 bg-black/30 hover:bg-black/40 rounded-xl border border-white/20 transition-all"
                >
                  <div className="text-3xl mb-3">✍️</div>
                  <h4 className="text-lg font-bold text-white mb-2">Storylab</h4>
                  <p className="text-sm text-gray-300">Share your story & connect with others</p>
                </motion.div>
              </Link>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-sm text-gray-400 mb-4">Or explore the full ecosystem:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/events" className="text-blue-400 hover:text-blue-300 text-sm">Events</Link>
                <Link to="/ivor" className="text-blue-400 hover:text-blue-300 text-sm">IVOR AI</Link>
                <Link to="/governance" className="text-blue-400 hover:text-blue-300 text-sm">Governance</Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  const question = slide.questions[currentQuestion]

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="max-w-4xl mx-auto space-y-8 text-center"
    >
      <div className="mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white heading-block mb-4">
          {slide.title}
        </h1>
        <p className="text-xl text-gray-300 mb-6">
          {slide.subtitle}
        </p>
        {slide.introduction && (
          <p className="text-base text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            {slide.introduction}
          </p>
        )}
      </div>

      <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 heading-block">
          {question.question}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option: any, index: number) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(option)}
              className="bg-gradient-to-br from-gray-800 to-gray-900 hover:from-blkout-primary hover:to-blkout-warm text-white p-6 rounded-xl text-left transition-all duration-300 border border-white/10 hover:border-white/30"
            >
              <span className="text-lg font-medium">{typeof option === 'string' ? option : option.text}</span>
            </motion.button>
          ))}
        </div>

        <div className="mt-8 flex justify-center items-center space-x-2">
          {slide.questions.map((_: any, index: number) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentQuestion
                  ? 'bg-blkout-primary'
                  : index < currentQuestion
                  ? 'bg-white'
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default EnhancedQuiz