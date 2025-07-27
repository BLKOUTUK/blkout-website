import React from 'react'
import { motion } from 'framer-motion'

interface RevelationProps {
  slide: any
  userPathway?: string
  onVisionSelection?: (selections: any[]) => void
}

const InteractiveRevelation: React.FC<RevelationProps> = ({ slide, userPathway, onVisionSelection }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2 }}
      viewport={{ once: false }}
      className="relative w-full h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Background Image */}
      {slide.bgImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${slide.bgImage})`
          }}
        />
      )}
      
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: false }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white heading-block mb-8 leading-tight">
            {slide.title}
          </h1>
          {slide.subtitle && (
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              {slide.subtitle}
            </p>
          )}
        </motion.div>

        {/* Content Array with Custom Styling */}
        {Array.isArray(slide.content) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: false }}
            className="space-y-6"
          >
            {slide.content.map((item: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.8 + (index * 0.2) 
                }}
                viewport={{ once: false }}
                className={`${item.style || 'text-xl text-gray-200'}`}
              >
                {item.text}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* String Content */}
        {typeof slide.content === 'string' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: false }}
            className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto"
          >
            {slide.content}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default InteractiveRevelation