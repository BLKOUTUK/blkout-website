import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const HorizontalProjects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const elements = [
    {
      id: 1,
      type: 'video',
      src: '/images/story powered.mp4',
      title: 'STORY POWERED'
    },
    {
      id: 2,
      type: 'image',
      src: '/images/raisedfistlogo.png', 
      title: 'RAISED FIST'
    },
    {
      id: 3,
      type: 'image',
      src: '/images/blkoutcircleANIMATION.gif',
      title: 'BLKOUT CIRCLE'
    }
  ]

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return

    const track = trackRef.current
    const container = containerRef.current
    
    // Calculate scroll distance (3 elements * 100vw)
    const scrollDistance = (elements.length * window.innerWidth) - window.innerWidth

    // Set container height to enable scrolling
    gsap.set(container, { height: scrollDistance + window.innerHeight })

    // Create horizontal scroll animation
    gsap.to(track, {
      xPercent: -((scrollDistance / track.scrollWidth) * 100),
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    })

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <div 
        ref={trackRef}
        className="flex items-center h-screen"
        style={{ width: `${elements.length * 100}vw` }}
      >
        {elements.map((element) => (
          <div
            key={element.id}
            className="flex-shrink-0 w-screen h-screen flex items-center justify-center bg-black"
          >
            {element.type === 'video' ? (
              <div className="w-full h-full relative">
                <video
                  className="w-full h-full object-contain"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src={element.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={element.src}
                  alt={element.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
            
            {/* Screen reader accessibility */}
            <div className="sr-only">
              <h2>{element.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HorizontalProjects