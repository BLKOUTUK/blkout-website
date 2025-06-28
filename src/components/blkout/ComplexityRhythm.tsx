'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const complexityThemes = [
  {
    title: "Multiplicity",
    description: "We contain multitudes",
    details: "Professional by day, artist by night. Activist and entrepreneur. Father and revolutionary. We reject the pressure to be one thing.",
    visual: "🎭",
    color: "from-realness-purple to-blkout-accent"
  },
  {
    title: "Intersectionality", 
    description: "All of us, all at once",
    details: "Black and queer and working class and brilliant and tired and hopeful. Every intersection honored, every identity celebrated.",
    visual: "⚡",
    color: "from-blkout-warm to-realness-rose"
  },
  {
    title: "Contradictions",
    description: "We hold space for paradox", 
    details: "Cautious and bold. Individual and collective. Traditional and revolutionary. Contradictions make us human, make us whole.",
    visual: "🌊",
    color: "from-blkout-secondary to-realness-amber"
  }
]

const rhythmCards = [
  {
    title: "Community Care",
    subtitle: "We hold each other",
    content: "Mutual aid isn't charity - it's revolution. We care for our community because we are our community.",
    icon: "💝"
  },
  {
    title: "Digital Sovereignty",
    subtitle: "Our data, our rules",
    content: "No surveillance. No extraction. No exploitation. Our digital spaces serve our liberation, not corporate profits.",
    icon: "🔐"
  },
  {
    title: "Authentic Expression",
    subtitle: "Your whole self welcome",
    content: "Code-switching exhausts us. Here, bring your full self - your joy, your pain, your complexity, your truth.",
    icon: "🎨"
  },
  {
    title: "Collective Liberation",
    subtitle: "None of us free until all of us free",
    content: "Our liberation is bound together. Black queer freedom is everyone's freedom. We rise together or not at all.",
    icon: "🕊️"
  }
]

export default function ComplexityRhythm() {
  const containerRef = useRef<HTMLDivElement>(null)
  const verticalRef = useRef<HTMLDivElement>(null)
  const horizontalRef = useRef<HTMLDivElement>(null)
  const verticalSecondRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // First Vertical Section - Complexity Themes
      complexityThemes.forEach((theme, index) => {
        gsap.fromTo(`.complexity-card-${index}`,
          {
            opacity: 0,
            y: 100,
            rotationX: -15
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: `.complexity-card-${index}`,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        )
      })

      // Horizontal Rhythm Cards Section
      const horizontalContainer = horizontalRef.current
      if (horizontalContainer) {
        const rhythmCardsContainer = horizontalContainer.querySelector('.rhythm-cards-container')
        if (rhythmCardsContainer) {
          const scrollDistance = rhythmCardsContainer.scrollWidth - window.innerWidth

          gsap.to(rhythmCardsContainer, {
            x: -scrollDistance,
            ease: "none",
            scrollTrigger: {
              trigger: horizontalContainer,
              start: "top center",
              end: `+=${scrollDistance + 200}`,
              scrub: 1,
              pin: true,
              pinSpacing: true,
              invalidateOnRefresh: true
            }
          })

          // Animate individual rhythm cards
          rhythmCards.forEach((_, index) => {
            gsap.fromTo(`.rhythm-card-${index}`,
              {
                opacity: 0,
                y: 80,
                scale: 0.8
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: "back.out",
                scrollTrigger: {
                  trigger: `.rhythm-card-${index}`,
                  start: "left 80%",
                  end: "left 20%",
                  containerAnimation: gsap.getById('rhythmScroll'),
                  toggleActions: "play none none reverse"
                }
              }
            )
          })
        }
      }

      // Second Vertical Section - Integration
      gsap.fromTo('.integration-content',
        {
          opacity: 0,
          y: 50,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: verticalSecondRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      )

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="relative">
      {/* First Vertical Section - Complexity Themes */}
      <section ref={verticalRef} className="min-h-screen py-20 bg-gradient-to-b from-transparent via-blkout-deep/50 to-transparent">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
              We Embrace Complexity
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              The world tries to make us simple. We choose to be beautifully, unapologetically complex.
            </p>
          </motion.div>

          <div className="space-y-20">
            {complexityThemes.map((theme, index) => (
              <div
                key={theme.title}
                className={`complexity-card-${index} flex flex-col lg:flex-row items-center gap-12 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Visual */}
                <div className="flex-1 text-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      delay: index * 2,
                      ease: "easeInOut"
                    }}
                    className="text-9xl mb-8"
                  >
                    {theme.visual}
                  </motion.div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    {theme.title}
                  </h3>
                  <p className={`text-2xl bg-gradient-to-r ${theme.color} bg-clip-text text-transparent font-semibold mb-6`}>
                    {theme.description}
                  </p>
                  <p className="text-lg text-gray-200 leading-relaxed">
                    {theme.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Horizontal Rhythm Section */}
      <section ref={horizontalRef} className="h-screen overflow-hidden bg-gradient-to-r from-blkout-primary via-blkout-warm to-blkout-secondary">
        <div className="rhythm-cards-container flex h-full items-center" style={{ width: 'max-content' }}>
          {/* Title Card */}
          <div className="flex-shrink-0 w-screen h-full flex items-center justify-center px-8">
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-8xl mb-8"
              >
                🌈
              </motion.div>
              <h2 className="text-6xl md:text-8xl font-bold text-white mb-6">
                Our Values in Action
              </h2>
              <p className="text-2xl text-white/90 max-w-2xl mx-auto">
                How complexity becomes community
              </p>
            </div>
          </div>

          {/* Rhythm Cards */}
          {rhythmCards.map((card, index) => (
            <div
              key={card.title}
              className={`rhythm-card-${index} flex-shrink-0 w-96 mx-8 p-8 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 h-96 flex flex-col justify-center`}
            >
              <div className="text-6xl text-center mb-6">
                {card.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 text-center">
                {card.title}
              </h3>
              <p className="text-lg text-white/80 mb-4 text-center font-semibold">
                {card.subtitle}
              </p>
              <p className="text-white/90 leading-relaxed text-center">
                {card.content}
              </p>
            </div>
          ))}

          {/* Transition Card */}
          <div className="flex-shrink-0 w-screen h-full flex items-center justify-center px-8">
            <div className="text-center">
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
                className="text-8xl mb-8"
              >
                ✊🏿
              </motion.div>
              <h2 className="text-6xl md:text-8xl font-bold text-white mb-6">
                Ready to Build?
              </h2>
              <p className="text-2xl text-white/90">
                Let's create technology that serves liberation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Second Vertical Section - Integration */}
      <section ref={verticalSecondRef} className="min-h-screen py-20 bg-gradient-to-b from-blkout-secondary via-blkout-accent to-blkout-deep flex items-center">
        <div className="integration-content max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            className="text-8xl mb-12"
            animate={{ 
              y: [0, -20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🏗️
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
            Technology + Liberation
          </h2>
          
          <p className="text-2xl text-white/90 mb-12 leading-relaxed">
            We don't just build software. We build futures. We don't just write code. We write liberation into every line.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4">Our Approach</h3>
              <p className="text-white/80">Move at the speed of trust. Build with, not for. Center the margins.</p>
            </div>
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4">Our Promise</h3>
              <p className="text-white/80">Your data is yours. Your voice matters. Your liberation is our liberation.</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-4 bg-white text-blkout-deep font-bold rounded-full text-xl"
          >
            Experience Our Philosophy
          </motion.button>
        </div>
      </section>
    </div>
  )
}