import React, { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'

interface QuizOption {
  text: string
  pathway: string
}

interface Question {
  question: string
  options: QuizOption[]
}

interface PathwayResponse {
  title: string
  subtitle: string
  description: string
  opportunities: string[]
  cta: {
    text: string
    action: string
    pathwayContext: {
      pathway: string
      initialMessage: string
      focus: string
    }
  }
}

interface Slide {
  id: string
  title: string
  subtitle?: string
  content?: string | React.ReactNode
  questions?: Question[]
  pathwayResponses?: Record<string, PathwayResponse>
}

interface QuizResponse {
  questionIndex: number
  selectedOption: QuizOption
  timestamp: Date
}

interface EnhancedQuizProps {
  slide: Slide
  onComplete: (responses: QuizResponse[]) => void
}

const EnhancedQuiz: React.FC<EnhancedQuizProps> = ({ slide, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<QuizResponse[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedOption, setSelectedOption] = useState<QuizOption | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  const questions = slide.questions || []
  const currentQuestion = questions[currentQuestionIndex]
  const pathwayResponses = slide.pathwayResponses || {}

  const handleOptionSelect = useCallback((option: QuizOption) => {
    if (isAnimating) return
    setSelectedOption(option)
  }, [isAnimating])

  const handleNext = useCallback(() => {
    if (!selectedOption || isAnimating) return
    
    setIsAnimating(true)
    
    const newResponse: QuizResponse = {
      questionIndex: currentQuestionIndex,
      selectedOption,
      timestamp: new Date()
    }
    
    const updatedResponses = [...responses, newResponse]
    setResponses(updatedResponses)
    
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
        setSelectedOption(null)
        setIsAnimating(false)
      } else {
        // Quiz complete
        setShowResults(true)
        setIsAnimating(false)
        onComplete(updatedResponses)
        
        // Scroll to results
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          })
        }, 100)
      }
    }, 300)
  }, [selectedOption, currentQuestionIndex, questions.length, responses, onComplete, isAnimating])

  const getResultsFromResponse = useCallback(() => {
    if (responses.length === 0) return null
    
    const lastResponse = responses[responses.length - 1]
    const pathway = lastResponse.selectedOption.pathway
    return pathwayResponses[pathway] || null
  }, [responses, pathwayResponses])

  const results = getResultsFromResponse()

  if (showResults && results) {
    return (
      <div ref={resultsRef} className="w-full h-full flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-green-900/90 to-emerald-800/90 backdrop-blur-sm rounded-2xl p-6 border border-green-600/50 shadow-2xl max-w-md w-full"
        >
          <div className="text-center space-y-4">
            {/* Result Header */}
            <div className="space-y-2">
              <div className="inline-block bg-green-600 rounded-full px-3 py-1">
                <span className="text-white font-mono text-xs uppercase tracking-widest font-bold">
                  Your Liberation Pathway
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-white heading-block">
                {results.title}
              </h2>
              
              <p className="text-sm font-mono uppercase tracking-wider text-green-200">
                {results.subtitle}
              </p>
              
              <p className="text-sm text-gray-300 leading-relaxed">
                {results.description}
              </p>
            </div>

            {/* Opportunities */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">
                Next Steps
              </h3>
              <div className="space-y-2">
                {results.opportunities.map((opportunity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-2 text-xs text-gray-200"
                  >
                    <span className="flex-shrink-0 mt-0.5">•</span>
                    <span className="leading-relaxed">{opportunity}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // Handle CTA action
                  const pathwayContext = results.cta.pathwayContext
                  localStorage.setItem('pathwayContext', JSON.stringify(pathwayContext))
                  
                  // For now, just show alert (can be replaced with actual action)
                  alert(`Pathway context saved for ${pathwayContext.pathway}`)
                }}
                className="w-full bg-white text-green-800 hover:bg-gray-100 px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
              >
                {results.cta.text}
              </motion.button>
            </motion.div>
            
            {/* Progress indicator */}
            <div className="flex justify-center pt-2">
              <div className="text-xs text-green-300 font-mono">
                ✓ Pathway Discovered
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-br from-orange-900/90 to-amber-800/90 backdrop-blur-sm rounded-2xl p-6 border border-orange-600/50 shadow-2xl max-w-md w-full"
      >
        <div className="space-y-6">
          {/* Quiz Header */}
          <div className="text-center space-y-2">
            <div className="inline-block bg-orange-600 rounded-full px-3 py-1">
              <span className="text-white font-mono text-xs uppercase tracking-widest font-bold">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
            
            <h2 className="text-xl md:text-2xl font-bold text-white heading-block">
              {slide.title}
            </h2>
            
            <p className="text-sm text-gray-300 leading-relaxed">
              {slide.content}
            </p>
          </div>

          {/* Question */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <h3 className="text-base font-bold text-white mb-4 text-center">
              {currentQuestion?.question}
            </h3>
            
            {/* Options */}
            <div className="space-y-3">
              <AnimatePresence mode="wait">
                {currentQuestion?.options.map((option, index) => (
                  <motion.button
                    key={`${currentQuestionIndex}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOptionSelect(option)}
                    disabled={isAnimating}
                    className={clsx(
                      "w-full text-left p-3 rounded-lg border transition-all text-sm",
                      selectedOption?.pathway === option.pathway
                        ? "bg-orange-600 border-orange-500 text-white shadow-lg"
                        : "bg-gray-800/50 border-gray-600 text-gray-200 hover:bg-gray-700/50 hover:border-gray-500",
                      isAnimating && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={clsx(
                        "w-4 h-4 rounded-full border-2 flex-shrink-0",
                        selectedOption?.pathway === option.pathway
                          ? "border-white bg-white"
                          : "border-gray-400"
                      )}>
                        {selectedOption?.pathway === option.pathway && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-orange-600 rounded-full m-0.5"
                          />
                        )}
                      </div>
                      <span className="font-medium leading-snug">
                        {option.text}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: selectedOption ? 1.05 : 1 }}
            whileTap={{ scale: selectedOption ? 0.95 : 1 }}
            onClick={handleNext}
            disabled={!selectedOption || isAnimating}
            className={clsx(
              "w-full px-6 py-3 rounded-xl font-bold transition-all shadow-lg text-sm",
              selectedOption && !isAnimating
                ? "bg-white text-orange-800 hover:bg-gray-100"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            )}
          >
            {isAnimating ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : currentQuestionIndex === questions.length - 1 ? (
              "Discover Your Pathway"
            ) : (
              "Continue"
            )}
          </motion.button>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ 
                width: `${((currentQuestionIndex + (selectedOption ? 1 : 0)) / questions.length) * 100}%` 
              }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default EnhancedQuiz