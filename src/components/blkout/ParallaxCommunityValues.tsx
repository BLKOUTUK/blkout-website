'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Heart, Users, Zap, Shield, Sparkles } from 'lucide-react'
import { COMMUNITY_VALUES } from '@/lib/constants'

gsap.registerPlugin(ScrollTrigger)

const valueIcons = [Heart, Users, Zap, Shield, Sparkles]

export default function ParallaxCommunityValues() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
    layoutEffect: false
  })

  const y = useTransform(scrollYProgress, [0, 1], [-50, 50])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered animation for value cards
      const valueCards = valuesRef.current?.children
      if (valueCards) {
        gsap.fromTo(valueCards, 
          {
            opacity: 0,
            y: 100,
            rotationX: -15,
            scale: 0.8
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out",
            scrollTrigger: {
              trigger: valuesRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        )
      }

      // Title animation
      gsap.fromTo(titleRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Parallax background elements
      gsap.to(".value-bg-1", {
        y: -100,
        rotation: 180,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      })

      gsap.to(".value-bg-2", {
        y: 100,
        rotation: -180,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity }}
      className="relative py-20 bg-gradient-to-b from-transparent via-white/5 to-transparent backdrop-blur-sm overflow-hidden"
    >
      {/* Parallax Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          style={{ y }}
          className="value-bg-1 absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blkout-secondary/20 to-blkout-warm/20 rounded-full blur-xl"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [50, -100]) }}
          className="value-bg-2 absolute top-20 right-20 w-48 h-48 bg-gradient-to-br from-realness-purple/15 to-realness-rose/15 rounded-full blur-2xl"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [-30, 80]) }}
          className="absolute bottom-10 left-1/3 w-24 h-24 bg-gradient-to-br from-blkout-accent/25 to-blkout-deep/25 rounded-full blur-lg"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          ref={titleRef}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-4xl font-bold text-white sm:text-5xl mb-4"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: "linear-gradient(90deg, #FF0040, #00E6FF, #6B46C1, #FF4500, #FF0040)",
              backgroundSize: "300% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: '0 0 20px rgba(255, 0, 64, 0.3)'
            }}
          >
            Values in Powerful Dialogue
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-200 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            These principles spark the conversations that shape our collective future
          </motion.p>
        </motion.div>

        <div ref={valuesRef} className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {COMMUNITY_VALUES.map((value, index) => {
            const IconComponent = valueIcons[index] || Heart
            
            return (
              <motion.div
                key={value}
                className="group relative rounded-xl bg-white/10 p-8 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  z: 50
                }}
                style={{ 
                  transformStyle: "preserve-3d",
                  perspective: 1000 
                }}
              >
                {/* Card glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blkout-secondary/20 to-blkout-warm/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                
                <div className="relative">
                  {/* Icon */}
                  <motion.div
                    className="flex items-center justify-center w-16 h-16 mb-6 mx-auto rounded-full bg-gradient-to-br from-blkout-secondary to-blkout-warm"
                    whileHover={{ 
                      rotate: 360,
                      scale: 1.1 
                    }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Value text */}
                  <motion.h3 
                    className="text-xl font-semibold text-white text-center leading-tight"
                    whileHover={{ scale: 1.05 }}
                  >
                    {value}
                  </motion.h3>

                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-blkout-secondary rounded-full opacity-60" />
                  <div className="absolute bottom-4 left-4 w-1 h-1 bg-blkout-warm rounded-full opacity-40" />
                  
                  {/* Floating particles */}
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      opacity: [0.3, 0.7, 0.3]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.5,
                      ease: "easeInOut"
                    }}
                    className="absolute -top-2 left-1/2 w-1 h-1 bg-blkout-secondary rounded-full"
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Interactive call-to-action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blkout-secondary to-blkout-warm text-white font-semibold cursor-pointer"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(244, 162, 97, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Experience these values in action</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="ml-2"
            >
              ✨
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}