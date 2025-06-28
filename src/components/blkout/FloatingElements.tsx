'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface FloatingSymbol {
  id: string
  symbol: string
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
}

export default function FloatingElements() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const symbolsRef = useRef<FloatingSymbol[]>([])
  const animationRef = useRef<number>()
  const mouseRef = useRef({ x: 0, y: 0 })

  const cooperativeSymbols = [
    '🤝', '✊🏿', '🏳️‍🌈', '💝', '🌉', '⚡', '💎', '🔥', 
    '🌟', '💫', '🎯', '🚀', '💜', '🧡', '💛', '💚'
  ]

  const colors = [
    '#F4A261', // blkout-secondary
    '#2A9D8F', // blkout-accent  
    '#E76F51', // blkout-warm
    '#D4261A', // blkout-primary
    '#7C3AED', // realness-purple
    '#E11D48', // realness-rose
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize floating symbols
    const initSymbols = () => {
      symbolsRef.current = Array.from({ length: 20 }, (_, i) => ({
        id: `symbol-${i}`,
        symbol: cooperativeSymbols[Math.floor(Math.random() * cooperativeSymbols.length)],
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: 20 + Math.random() * 30,
        color: colors[Math.floor(Math.random() * colors.length)]
      }))
    }

    initSymbols()

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      symbolsRef.current.forEach((symbol) => {
        // Mouse attraction/repulsion
        const dx = mouseRef.current.x - symbol.x
        const dy = mouseRef.current.y - symbol.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 150

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance
          const angle = Math.atan2(dy, dx)
          // Repulsion effect
          symbol.vx -= Math.cos(angle) * force * 0.5
          symbol.vy -= Math.sin(angle) * force * 0.5
        }

        // Update position
        symbol.x += symbol.vx
        symbol.y += symbol.vy

        // Boundary collision with bounce
        if (symbol.x <= symbol.size / 2 || symbol.x >= canvas.width - symbol.size / 2) {
          symbol.vx *= -0.8
          symbol.x = Math.max(symbol.size / 2, Math.min(canvas.width - symbol.size / 2, symbol.x))
        }
        if (symbol.y <= symbol.size / 2 || symbol.y >= canvas.height - symbol.size / 2) {
          symbol.vy *= -0.8
          symbol.y = Math.max(symbol.size / 2, Math.min(canvas.height - symbol.size / 2, symbol.y))
        }

        // Friction
        symbol.vx *= 0.99
        symbol.vy *= 0.99

        // Gravity effect (very subtle)
        symbol.vy += 0.01

        // Draw symbol
        ctx.font = `${symbol.size}px Arial`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
        // Glow effect
        ctx.shadowColor = symbol.color
        ctx.shadowBlur = 20
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        
        // Symbol with slight transparency for layering effect
        ctx.globalAlpha = 0.8
        ctx.fillText(symbol.symbol, symbol.x, symbol.y)
        
        // Reset shadow
        ctx.shadowBlur = 0
        ctx.globalAlpha = 1
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <>
      {/* Canvas for physics-based floating elements */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-10"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* CSS-based floating elements for fallback/additional effects */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {/* Large floating background symbols */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 60, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-1/4 left-1/4 text-6xl opacity-10"
          style={{ color: '#F4A261' }}
        >
          🤝
        </motion.div>

        <motion.div
          animate={{ 
            rotate: -360,
            y: [0, -20, 0],
          }}
          transition={{
            rotate: { duration: 45, repeat: Infinity, ease: "linear" },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-3/4 right-1/4 text-8xl opacity-10"
          style={{ color: '#2A9D8F' }}
        >
          ✊🏿
        </motion.div>

        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-7xl opacity-10"
          style={{ color: '#E76F51' }}
        >
          🏳️‍🌈
        </motion.div>

        {/* Smaller scattered elements */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
            className="absolute text-2xl"
            style={{
              top: `${10 + (i * 10)}%`,
              left: `${5 + (i * 12)}%`,
              color: colors[i % colors.length]
            }}
          >
            {cooperativeSymbols[i % cooperativeSymbols.length]}
          </motion.div>
        ))}
      </div>

      {/* Interactive hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="fixed bottom-20 right-8 text-white/40 text-sm z-20 pointer-events-none"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Move your mouse to interact ✨
        </motion.div>
      </motion.div>
    </>
  )
}