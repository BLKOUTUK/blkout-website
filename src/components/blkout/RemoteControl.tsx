import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown, Circle, Square, Triangle, Home, Menu, Volume2 } from 'lucide-react'

interface RemoteControlProps {
  onNavigate: (slideIndex: number) => void
  currentSlide: number
  totalSlides: number
}

const RemoteControl: React.FC<RemoteControlProps> = ({ onNavigate, currentSlide, totalSlides }) => {
  const [isOpen, setIsOpen] = useState(false)

  const slideLabels = [
    'HOME', 'BLACK', 'QUEER', 'MALE', 'OUT', 'DEFINED', 'PROSE', 'PROJECTS', 
    'HEAL', 'BUILD', 'LOVE', 'BECOME', 'ENGAGE', 'FUTURE', 'QUIZ', 'CONNECT'
  ]

  return (
    <>
      {/* Remote Toggle Button */}
      <motion.button
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-1/2 right-6 transform -translate-y-1/2 z-50 bg-gray-900 hover:bg-gray-800 text-white p-3 rounded-lg shadow-lg transition-all"
      >
        <Menu className="w-5 h-5" />
      </motion.button>

      {/* Remote Control */}
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: isOpen ? 0 : 400, opacity: isOpen ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-1/2 right-6 transform -translate-y-1/2 z-40 w-20 bg-gradient-to-b from-gray-900 to-black rounded-2xl p-4 shadow-2xl border border-gray-700"
        style={{
          background: 'linear-gradient(145deg, #2d3748, #1a202c)',
          boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.1), 0 10px 30px rgba(0,0,0,0.5)'
        }}
      >
        {/* Remote Brand */}
        <div className="text-center mb-4">
          <div className="text-white text-xs font-black tracking-wider" style={{ fontFamily: 'Archivo Black, sans-serif' }}>BLKOUT</div>
          <div className="text-gray-500 text-xs font-mono">RC-1</div>
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-2 mb-4">
          <button
            onClick={() => currentSlide > 0 && onNavigate(currentSlide - 1)}
            disabled={currentSlide === 0}
            className="w-full p-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:opacity-50 rounded-lg transition-all"
          >
            <ChevronUp className="w-4 h-4 mx-auto text-white" />
          </button>
          
          <button
            onClick={() => currentSlide < totalSlides - 1 && onNavigate(currentSlide + 1)}
            disabled={currentSlide === totalSlides - 1}
            className="w-full p-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:opacity-50 rounded-lg transition-all"
          >
            <ChevronDown className="w-4 h-4 mx-auto text-white" />
          </button>
        </div>

        {/* Direct Channel Buttons */}
        <div className="grid grid-cols-2 gap-1 mb-4 max-h-48 overflow-y-auto">
          {slideLabels.map((label, index) => (
            <button
              key={index}
              onClick={() => onNavigate(index)}
              className={`p-1 rounded text-xs font-mono transition-all ${
                currentSlide === index
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Color-coded section indicators */}
        <div className="space-y-1 mb-4">
          <div className="flex items-center justify-between text-xs">
            <div className="w-3 h-3 bg-red-500 rounded" />
            <span className="text-gray-400 font-mono">DEF</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span className="text-gray-400 font-mono">PRJ</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="w-3 h-3 bg-green-500 rounded" />
            <span className="text-gray-400 font-mono">FUT</span>
          </div>
        </div>

        {/* Special buttons */}
        <div className="space-y-2">
          <button
            onClick={() => onNavigate(0)}
            className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
          >
            <Home className="w-4 h-4 mx-auto text-white" />
          </button>
        </div>

        {/* Current slide indicator */}
        <div className="mt-4 pt-2 border-t border-gray-700 text-center">
          <div className="text-green-400 text-xs font-mono">{slideLabels[currentSlide]}</div>
          <div className="text-gray-500 text-xs font-mono">{currentSlide + 1}/{totalSlides}</div>
        </div>

        {/* LED indicator */}
        <div className="absolute bottom-2 left-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </div>
      </motion.div>

      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/20 z-30"
        />
      )}
    </>
  )
}

export default RemoteControl