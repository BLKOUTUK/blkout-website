import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ChevronRight, Users, Building, Heart, Zap, ArrowRight, Play, Pause } from 'lucide-react'

interface RevelationOption {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  content: {
    scenario: string
    impact: string[]
    action: string
  }
  color: string
}

interface InteractiveRevelationProps {
  slide: {
    id: string
    title: string | null
    subtitle?: string | null
    content?: any[] | any
    type: string
    [key: string]: any
  }
  onComplete?: (selections: string[]) => void
  className?: string
}

const REVELATION_DATA: Record<string, RevelationOption[]> = {
  'own-stories': [
    {
      id: 'storytelling-platform',
      title: 'Digital Storytelling Platform',
      description: 'Community-owned media creation and distribution',
      icon: <Zap className="w-6 h-6" />,
      content: {
        scenario: 'Imagine a platform where Black queer stories reach millions, but the storytellers keep ownership and profits flow back to the community.',
        impact: [
          'Stories told on our terms, not for external consumption',
          'Revenue stays within community for mutual aid',
          'Global network of Black queer storytellers',
          'Alternative to extractive mainstream media'
        ],
        action: 'Start with community podcast and video series'
      },
      color: '#D4261A'
    },
    {
      id: 'liberation-dialogues',
      title: 'Liberation Dialogue Series',
      description: 'Facilitated conversations building collective analysis',
      icon: <Users className="w-6 h-6" />,
      content: {
        scenario: 'Monthly gatherings where personal stories become political analysis, and individual struggles transform into collective action.',
        impact: [
          'Personal healing through shared understanding',
          'Political education through lived experience',
          'Community organizing emerging from conversation',
          'Intergenerational wisdom sharing'
        ],
        action: 'Host monthly community dialogue sessions'
      },
      color: '#F4A261'
    },
    {
      id: 'story-archive',
      title: 'Community Story Archive',
      description: 'Preserving our narratives for future generations',
      icon: <Heart className="w-6 h-6" />,
      content: {
        scenario: 'A living archive where community members preserve stories, creating an ancestral resource for future Black queer generations.',
        impact: [
          'Historical preservation of community experiences',
          'Resource for researchers and activists',
          'Inspiration for future generations',
          'Evidence of our resilience and innovation'
        ],
        action: 'Begin collecting and digitizing community stories'
      },
      color: '#2A9D8F'
    }
  ],
  'build-wealth': [
    {
      id: 'cooperative-housing',
      title: 'Community Land Trust',
      description: 'Cooperative ownership removing housing from speculation',
      icon: <Building className="w-6 h-6" />,
      content: {
        scenario: 'Black queer communities own land collectively, providing affordable housing while building generational wealth outside capitalist speculation.',
        impact: [
          'Permanently affordable housing for community',
          'Wealth building through collective ownership',
          'Safer spaces designed by and for us',
          'Community control over neighborhood development'
        ],
        action: 'Research community land trust models and funding'
      },
      color: '#E76F51'
    },
    {
      id: 'cooperative-businesses',
      title: 'Cooperative Business Network',
      description: 'Worker-owned enterprises prioritizing community benefit',
      icon: <Zap className="w-6 h-6" />,
      content: {
        scenario: 'Network of Black queer-owned cooperatives - from tech companies to cafes - where workers own the means of production.',
        impact: [
          'Democratic control over work conditions',
          'Profits shared among worker-owners',
          'Community-controlled economic development',
          'Alternative to extractive capitalism'
        ],
        action: 'Form cooperative development working group'
      },
      color: '#D4261A'
    },
    {
      id: 'mutual-aid-fund',
      title: 'Community Investment Fund',
      description: 'Pooled resources for mutual aid and community projects',
      icon: <Heart className="w-6 h-6" />,
      content: {
        scenario: 'Community-controlled fund providing no-interest loans, emergency aid, and investment in Black queer enterprises.',
        impact: [
          'Financial independence from exploitative systems',
          'Emergency support for community members',
          'Investment in community-beneficial projects',
          'Building collective economic power'
        ],
        action: 'Establish community investment cooperative'
      },
      color: '#F4A261'
    }
  ],
  'liberation-legacy': [
    {
      id: 'movement-infrastructure',
      title: 'Liberation Infrastructure',
      description: 'Long-term institutions supporting ongoing liberation work',
      icon: <Building className="w-6 h-6" />,
      content: {
        scenario: 'Community-controlled institutions - schools, healthcare, media, economic cooperatives - that exist beyond any single campaign or moment.',
        impact: [
          'Sustainable base for ongoing liberation work',
          'Independence from state and corporate systems',
          'Intergenerational institution building',
          'Model for other communities worldwide'
        ],
        action: 'Develop 20-year community institution roadmap'
      },
      color: '#2A9D8F'
    },
    {
      id: 'solidarity-networks',
      title: 'Global Solidarity Networks',
      description: 'International connections with liberation movements',
      icon: <Users className="w-6 h-6" />,
      content: {
        scenario: 'Deep partnerships with Black queer liberation movements globally, sharing resources, strategies, and solidarity.',
        impact: [
          'Learning from liberation movements worldwide',
          'Coordinated resistance to global systems',
          'Resource and strategy sharing',
          'International solidarity and support'
        ],
        action: 'Establish sister community relationships'
      },
      color: '#E76F51'
    },
    {
      id: 'ancestor-remembrance',
      title: 'Ancestral Wisdom Practices',
      description: 'Connecting with ancestors who paved the way',
      icon: <Heart className="w-6 h-6" />,
      content: {
        scenario: 'Regular practices honoring ancestors, learning from their strategies, and ensuring their sacrifices guide our current liberation work.',
        impact: [
          'Spiritual grounding for liberation work',
          'Learning from historical strategies',
          'Community healing through ancestral connection',
          'Ensuring continuity across generations'
        ],
        action: 'Create ancestor remembrance practices'
      },
      color: '#D4261A'
    }
  ]
}

const InteractiveRevelation: React.FC<InteractiveRevelationProps> = ({
  slide,
  onComplete,
  className = ''
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [expandedOption, setExpandedOption] = useState<string | null>(null)
  const [isExploring, setIsExploring] = useState(false)
  const [currentScenario, setCurrentScenario] = useState<RevelationOption | null>(null)
  const [autoPlayScenarios, setAutoPlayScenarios] = useState(false)
  const [scenarioIndex, setScenarioIndex] = useState(0)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.3 })

  const revelationOptions = REVELATION_DATA[slide.id] || []

  useEffect(() => {
    if (autoPlayScenarios && revelationOptions.length > 0) {
      const interval = setInterval(() => {
        setScenarioIndex(prev => (prev + 1) % revelationOptions.length)
        setCurrentScenario(revelationOptions[scenarioIndex])
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [autoPlayScenarios, revelationOptions, scenarioIndex])

  const handleOptionSelect = (optionId: string) => {
    const option = revelationOptions.find(opt => opt.id === optionId)
    if (!option) return

    setCurrentScenario(option)
    setIsExploring(true)
    
    if (!selectedOptions.includes(optionId)) {
      const newSelections = [...selectedOptions, optionId]
      setSelectedOptions(newSelections)
      onComplete?.(newSelections)
    }
  }

  const handleOptionExpand = (optionId: string) => {
    setExpandedOption(expandedOption === optionId ? null : optionId)
  }

  const toggleAutoPlay = () => {
    setAutoPlayScenarios(!autoPlayScenarios)
    if (!autoPlayScenarios && revelationOptions.length > 0) {
      setCurrentScenario(revelationOptions[0])
      setScenarioIndex(0)
    }
  }

  const renderOptionCard = (option: RevelationOption, index: number) => (
    <motion.div
      key={option.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className={`relative bg-white/10 backdrop-blur-sm rounded-xl border transition-all cursor-pointer group hover:scale-105 ${
        selectedOptions.includes(option.id) 
          ? 'border-blkout-secondary bg-blkout-secondary/20 shadow-lg shadow-blkout-secondary/20' 
          : 'border-white/20 hover:border-white/40'
      }`}
      onClick={() => handleOptionSelect(option.id)}
    >
      <div className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          <div 
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${option.color}20`, color: option.color }}
          >
            {option.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">{option.title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{option.description}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleOptionExpand(option.id)
            }}
            className="text-white/60 hover:text-white transition-colors"
          >
            <ChevronRight className={`w-5 h-5 transition-transform ${
              expandedOption === option.id ? 'rotate-90' : ''
            }`} />
          </button>
        </div>

        <AnimatePresence>
          {expandedOption === option.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/20 pt-4 mt-4"
            >
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                {option.content.scenario}
              </p>
              <div className="space-y-2">
                <h4 className="text-white font-medium text-sm">Potential Impact:</h4>
                <ul className="space-y-1">
                  {option.content.impact.map((impact, idx) => (
                    <li key={idx} className="text-gray-300 text-xs flex items-start space-x-2">
                      <span className="text-blkout-secondary mt-1">•</span>
                      <span>{impact}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10">
                <p className="text-blkout-secondary text-sm font-medium">
                  Next Step: {option.content.action}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {selectedOptions.includes(option.id) && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-blkout-secondary rounded-full flex items-center justify-center"
          >
            <ArrowRight className="w-3 h-3 text-white" />
          </motion.div>
        )}
      </div>
    </motion.div>
  )

  const renderScenarioViewer = () => {
    if (!currentScenario) return null

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setIsExploring(false)}
      >
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          className="bg-gradient-to-br from-blkout-deep to-blkout-accent rounded-2xl p-8 max-w-2xl w-full border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${currentScenario.color}20`, color: currentScenario.color }}
            >
              {currentScenario.icon}
            </div>
            <button
              onClick={() => setIsExploring(false)}
              className="text-white/60 hover:text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">{currentScenario.title}</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-semibold mb-2">The Vision:</h3>
              <p className="text-gray-300 leading-relaxed">{currentScenario.content.scenario}</p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Community Impact:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentScenario.content.impact.map((impact, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start space-x-2 bg-white/5 rounded-lg p-3"
                  >
                    <span className="text-blkout-secondary mt-1">•</span>
                    <span className="text-gray-300 text-sm">{impact}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-blkout-primary/20 rounded-lg p-4 border border-blkout-primary/30">
              <h3 className="text-white font-semibold mb-2">Ready to Act?</h3>
              <p className="text-gray-300 text-sm mb-4">{currentScenario.content.action}</p>
              <button className="bg-blkout-primary hover:bg-blkout-warm text-white px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105">
                Join This Initiative
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4"
          >
            {slide.title || 'Interactive Exploration'}
          </motion.h1>
          {slide.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-300 uppercase tracking-wider font-mono"
            >
              {slide.subtitle}
            </motion.p>
          )}
        </div>

        {/* Auto-play Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex items-center justify-center space-x-4 mb-8"
        >
          <button
            onClick={toggleAutoPlay}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all"
          >
            {autoPlayScenarios ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{autoPlayScenarios ? 'Pause' : 'Auto-explore'} Scenarios</span>
          </button>
          <span className="text-gray-400 text-sm">Click any option to explore in detail</span>
        </motion.div>

        {/* Interactive Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {revelationOptions.map((option, index) => renderOptionCard(option, index))}
        </div>

        {/* Selection Summary */}
        {selectedOptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blkout-primary/20 to-blkout-secondary/20 rounded-xl p-6 border border-blkout-primary/30 text-center"
          >
            <h3 className="text-white font-bold mb-2">Your Vision for Liberation</h3>
            <p className="text-gray-300 text-sm mb-4">
              You've explored {selectedOptions.length} pathway{selectedOptions.length !== 1 ? 's' : ''} to collective liberation
            </p>
            <button className="bg-blkout-primary hover:bg-blkout-warm text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
              Continue Your Journey
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Scenario Viewer Modal */}
      <AnimatePresence>
        {isExploring && renderScenarioViewer()}
      </AnimatePresence>
    </div>
  )
}

export default InteractiveRevelation