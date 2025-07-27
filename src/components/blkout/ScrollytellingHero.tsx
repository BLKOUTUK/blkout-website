'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroVideoCarousel from './HeroVideoCarousel'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollytellingHero() {
  const containerRef = useRef<HTMLElement>(null)
  
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
      // Simple fade-in animation for the hero section
      gsap.fromTo(containerRef.current, 
        {
          opacity: 0
        },
        {
          opacity: 1,
          duration: 1.5,
          ease: "power2.out"
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <motion.section
      ref={containerRef}
      style={{ y, opacity, scale }}
      className="relative min-h-screen overflow-hidden"
    >
      {/* Hero Video Carousel */}
      <HeroVideoCarousel />
    </motion.section>
  )
}