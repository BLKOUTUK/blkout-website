'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Users, Heart, Zap } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollytellingHero() {
  const containerRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
    layoutEffect: false
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // GSAP timeline for sequential animations
      const tl = gsap.timeline()
      
      // Initial state
      gsap.set([titleRef.current, subtitleRef.current, badgeRef.current, ctaRef.current], {
        opacity: 0,
        y: 50
      })

      // Animate elements in sequence
      tl.to(badgeRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out"
      })
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=0.4")
      .to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.6")
      .to(ctaRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.4")

      // Scroll-triggered color change
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom center",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress
          const hue = gsap.utils.interpolate(212, 340, progress) // Blue to purple shift
          if (containerRef.current) {
            containerRef.current.style.filter = `hue-rotate(${hue - 212}deg)`
          }
        }
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <motion.section
      ref={containerRef}
      style={{ y, opacity, scale }}
      className="relative min-h-screen overflow-hidden px-6 pt-14 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pt-20 lg:pb-28"
    >
      {/* BOLD Electric Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blkout-deep via-zones-liberation-bg to-zones-technology-bg">
        {/* Sharp, Electric Geometric Elements */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.3, 1],
          }}
          transition={{
            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-20 left-10 w-32 h-32 bg-electric-magenta shadow-[0_0_60px_#FF0040] rounded-none"
          style={{ 
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            filter: 'drop-shadow(0 0 25px #FF0040)'
          }}
        />
        <motion.div
          animate={{ 
            rotate: -360,
            y: [0, -30, 0],
          }}
          transition={{
            rotate: { duration: 18, repeat: Infinity, ease: "linear" },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-40 right-20 w-40 h-40 bg-electric-cyan shadow-[0_0_70px_#00E6FF]"
          style={{ 
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
            filter: 'drop-shadow(0 0 30px #00E6FF)'
          }}
        />
        <motion.div
          animate={{ 
            scale: [1, 1.4, 1],
            x: [0, 15, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 left-1/4 w-24 h-24 bg-electric-green shadow-[0_0_50px_#32FF00] rounded-none"
          style={{ 
            clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
            filter: 'drop-shadow(0 0 25px #32FF00)'
          }}
        />
        
        {/* Electric Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 0, 85, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <motion.div className="text-center">
          {/* BOLD Electric Badge */}
          <motion.div
            ref={badgeRef}
            className="mx-auto mb-8 inline-flex items-center px-8 py-4 text-lg font-black text-white border-2 border-electric-magenta bg-electric-magenta/20 shadow-[0_0_30px_#FF0055] backdrop-blur-none"
            style={{
              clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
              textShadow: '0 0 10px #FF0055'
            }}
          >
            <motion.span 
              animate={{ 
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="mr-3 text-2xl"
            >
              ⚡
            </motion.span>
            <span className="font-display font-electric uppercase tracking-wider">
              BLKOUT = NOT STRAIGHT
            </span>
          </motion.div>

          {/* MASSIVE Bold Title */}
          <motion.h1
            ref={titleRef}
            className="mx-auto max-w-6xl font-display font-electric tracking-tighter text-white"
            style={{ 
              fontSize: 'clamp(3.5rem, 10vw, 10rem)',
              lineHeight: '0.9',
              textShadow: '0 0 25px #00E6FF, 0 0 50px #FF0040, 0 0 75px #6B46C1'
            }}
          >
            <motion.span
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
              className="bg-gradient-to-r from-electric-cyan via-electric-magenta to-electric-indigo bg-[length:300%_100%] bg-clip-text text-transparent"
              style={{
                filter: 'drop-shadow(0 0 15px rgba(255, 0, 85, 0.8))'
              }}
            >
              {SITE_CONFIG.name}
            </motion.span>
          </motion.h1>

          {/* BOLD Subtitle */}
          <motion.div
            ref={subtitleRef}
            className="mx-auto mt-8 max-w-4xl space-y-4"
          >
            <p className="text-3xl font-heading font-bold leading-tight text-electric-cyan"
               style={{ textShadow: '0 0 15px #00E6FF' }}>
              BLACK, QUEER & NOT STRAIGHTFORWARD
            </p>
            <p className="text-xl text-gray-200 leading-relaxed">
              We embrace complexity. We celebrate contradictions. We build power through authentic dialogue.
            </p>
          </motion.div>

          {/* ELECTRIC CTA Buttons */}
          <motion.div
            ref={ctaRef}
            className="mt-12 flex items-center justify-center gap-x-8"
          >
            <motion.button
              whileHover={{ 
                scale: 1.1, 
                boxShadow: "0 0 50px rgba(255, 0, 85, 0.8)",
                filter: "brightness(1.2)"
              }}
              whileTap={{ scale: 0.9 }}
              className="group relative px-12 py-6 text-xl font-display font-electric text-blkout-deep bg-electric-magenta border-4 border-electric-cyan shadow-[0_0_30px_#FF0055] transition-all uppercase tracking-wider"
              style={{
                clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)',
                textShadow: 'none'
              }}
            >
              <span className="relative z-10">ENTER THE CONVERSATION</span>
              <motion.div
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="ml-3 inline-block"
              >
                <ArrowRight className="h-6 w-6" />
              </motion.div>
              
              {/* Electric glow overlay */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-electric-cyan to-electric-magenta opacity-30"
                style={{
                  clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)',
                }}
              />
            </motion.button>
            
            <motion.button
              whileHover={{ 
                scale: 1.1, 
                boxShadow: "0 0 40px rgba(0, 255, 255, 0.6)",
                backgroundColor: "rgba(0, 255, 255, 0.2)"
              }}
              whileTap={{ scale: 0.9 }}
              className="px-12 py-6 text-xl font-display font-electric text-electric-cyan border-4 border-electric-cyan bg-transparent shadow-[0_0_25px_#00FFFF] transition-all uppercase tracking-wider"
              style={{
                clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
                textShadow: '0 0 10px #00FFFF'
              }}
            >
              EMBRACE COMPLEXITY
            </motion.button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-3 bg-white/60 rounded-full mt-2"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background decoration with parallax */}
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-blkout-secondary to-blkout-warm opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </motion.div>
    </motion.section>
  )
}