import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const HorizontalProjects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const projects = [
    {
      id: 1,
      title: "BLKOUTHUB",
      description: "Our core community platform connecting Black queer men through authentic dialogue, mutual support, and shared resources. A space where vulnerability becomes strength and individual stories build collective power.",
      link: "/hub",
      color: "bg-red-500"
    },
    {
      id: 2,
      title: "STORYLAB",
      description: "Collaborative storytelling workshops where community members craft narratives that center our experiences. Through guided sessions, we transform personal truth into powerful collective testimony.",
      link: "/storylab",
      color: "bg-orange-500"
    },
    {
      id: 3,
      title: "COOPERATIVE",
      description: "Building economic justice through shared ownership. Our cooperative model ensures community members have real stakes in the platforms and resources that serve them.",
      link: "/cooperative",
      color: "bg-yellow-500"
    },
    {
      id: 4,
      title: "CHANNEL",
      description: "Broadcasting Black queer liberation through podcasts, videos, and digital content. Amplifying voices that mainstream media ignores while building audience around our values.",
      link: "/channel",
      color: "bg-green-500"
    },
    {
      id: 5,
      title: "IVOR",
      description: "Our AI community assistant, designed to support navigation of resources, answer questions, and provide guidance rooted in our values. Technology that serves community, not capital.",
      link: "/ivor",
      color: "bg-blue-500"
    },
    {
      id: 6,
      title: "EVENTS",
      description: "Regular gatherings, workshops, and celebrations that strengthen community bonds in person. From intimate conversations to joyful celebrations of our collective achievements.",
      link: "/events",
      color: "bg-purple-500"
    }
  ]

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return

    const track = trackRef.current
    const container = containerRef.current
    
    // Calculate scroll distance
    const scrollDistance = track.scrollWidth - window.innerWidth

    // Set container height to enable scrolling
    gsap.set(container, { height: scrollDistance + window.innerHeight })

    // Create horizontal scroll animation
    const horizontalScroll = gsap.to(track, {
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

    // Layer animation for each project
    projects.forEach((project, index) => {
      const projectElement = document.querySelector(`[data-project="${project.id}"]`)
      if (projectElement) {
        gsap.fromTo(projectElement, 
          { 
            x: 200,
            opacity: 0,
            scale: 0.8
          },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            scrollTrigger: {
              trigger: container,
              start: `top+=${index * 200} top`,
              end: `top+=${(index + 1) * 200} top`,
              scrub: true,
              containerAnimation: horizontalScroll
            }
          }
        )
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
        style={{ width: `${projects.length * 100}vw` }}
      >
        {/* Project Cards */}
        {projects.map((project, index) => (
          <div
            key={project.id}
            data-project={project.id}
            className="flex-shrink-0 w-screen h-screen flex items-center justify-center relative"
          >
            <div className={`w-4/5 max-w-2xl p-8 rounded-lg ${project.color} text-white shadow-2xl`}>
              <h2 className="text-4xl font-bold mb-6 font-mono tracking-wider">
                {project.title}
              </h2>
              <p className="text-lg leading-relaxed mb-8">
                {project.description}
              </p>
              <motion.a
                href={project.link}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Learn More
              </motion.a>
            </div>
          </div>
        ))}

        {/* Projects Table */}
        <div className="flex-shrink-0 w-screen h-screen flex items-center justify-center bg-black">
          <div className="w-4/5 max-w-4xl">
            <h2 className="text-4xl font-bold text-white mb-8 text-center font-mono">
              OUR PROJECTS
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  whileHover={{ scale: 1.05 }}
                  className={`${project.color} p-6 rounded-lg text-white text-center cursor-pointer`}
                >
                  <h3 className="text-xl font-bold font-mono">{project.title}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Raised Fist Logo Transformation */}
        <div className="flex-shrink-0 w-screen h-screen flex items-center justify-center bg-black">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative w-96 h-96"
          >
            {/* Placeholder for raised fist logo - will need actual layered images */}
            <div className="w-full h-full bg-gradient-to-br from-red-500 via-orange-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-6xl">✊</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default HorizontalProjects