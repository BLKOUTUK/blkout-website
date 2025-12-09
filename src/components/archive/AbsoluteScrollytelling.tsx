import React, { useState, useEffect } from 'react'

const slides = [
  {
    id: 'welcome',
    type: 'video',
    title: 'Welcome to BLKOUT',
    videoUrl: '/images/squared/FinalfinalwelcomeSQUARED.mp4'
  },
  {
    id: 'value',
    type: 'text',
    title: 'WHERE BLACK QUEER MEN BUILD COLLECTIVE POWER',
    subtitle: 'BLKOUT UK is a movement built by and for Black queer men in the UK',
    content: 'We exist to create systemic change through digital tech, storytelling, and community ownership.'
  },
  {
    id: 'well-defined',
    type: 'image',
    title: 'WELL DEFINED',
    subtitle: 'COMPLEXITY IS ALL WE HAVE',
    bgImage: '/images/squared/WELLDEF_SQUARED.png'
  },
  {
    id: 'black',
    type: 'image',
    title: 'BLACK?',
    subtitle: 'MORE THAN MELANIN',
    bgImage: '/images/squared/BlackSQUARED.png'
  },
  {
    id: 'queer',
    type: 'image',
    title: 'QUEER',
    subtitle: 'RECLAIMED TERRITORY',
    bgImage: '/images/squared/queerSQUARED.PNG'
  },
  {
    id: 'join',
    type: 'cta',
    title: 'READY TO JOIN?',
    subtitle: 'YOUR LIBERATION JOURNEY STARTS HERE',
    content: 'Join the movement for community support and collective liberation.',
    bgImage: '/images/squared/facecard SQUARED.png'
  }
]

const AbsoluteScrollytelling = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setCurrentSlide(prev => Math.max(prev - 1, 0))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handle wheel/scroll events
  useEffect(() => {
    let isScrolling = false
    
    const handleWheel = (e) => {
      if (isScrolling) return
      
      e.preventDefault()
      isScrolling = true
      
      if (e.deltaY > 0) {
        // Scroll down
        setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1))
      } else {
        // Scroll up  
        setCurrentSlide(prev => Math.max(prev - 1, 0))
      }
      
      setTimeout(() => { isScrolling = false }, 500)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  const renderSlideContent = (slide) => {
    const baseStyles = {
      position: 'relative',
      zIndex: 10,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px',
      boxSizing: 'border-box'
    }

    if (slide.type === 'video') {
      return (
        <div style={{ ...baseStyles, justifyContent: 'center' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            margin: '0 0 30px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}>
            {slide.title}
          </h1>
          <video
            style={{
              width: '400px',
              height: '400px',
              objectFit: 'cover',
              borderRadius: '20px',
              border: '4px solid white'
            }}
            autoPlay
            muted
            loop
            playsInline
            src={slide.videoUrl}
          />
        </div>
      )
    }

    if (slide.type === 'image') {
      return (
        <div style={{ ...baseStyles, justifyContent: 'flex-end' }}>
          <div style={{
            background: 'rgba(0,0,0,0.8)',
            padding: '30px',
            borderRadius: '15px',
            textAlign: 'center',
            maxWidth: '600px',
            marginBottom: '60px'
          }}>
            <h1 style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 15px 0'
            }}>
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p style={{
                fontSize: '20px',
                color: '#e5e7eb',
                margin: 0
              }}>
                {slide.subtitle}
              </p>
            )}
          </div>
        </div>
      )
    }

    if (slide.type === 'cta') {
      return (
        <div style={{ ...baseStyles, justifyContent: 'center' }}>
          <div style={{
            background: 'rgba(0,0,0,0.85)',
            padding: '50px',
            borderRadius: '20px',
            textAlign: 'center',
            maxWidth: '700px'
          }}>
            <h1 style={{
              fontSize: '42px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 20px 0'
            }}>
              {slide.title}
            </h1>
            <p style={{
              fontSize: '22px',
              color: '#e5e7eb',
              margin: '0 0 15px 0'
            }}>
              {slide.subtitle}
            </p>
            <p style={{
              fontSize: '18px',
              color: '#d1d5db',
              margin: '0 0 35px 0'
            }}>
              {slide.content}
            </p>
            <a
              href="https://blkouthub.com/invitation?code=BE862C"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: 'white',
                color: 'black',
                padding: '18px 40px',
                borderRadius: '12px',
                fontSize: '20px',
                fontWeight: 'bold',
                textDecoration: 'none'
              }}
            >
              Join BLKOUTHUB
            </a>
          </div>
        </div>
      )
    }

    // Text slide
    return (
      <div style={{ ...baseStyles, justifyContent: 'center' }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '800px'
        }}>
          <h1 style={{
            fontSize: '44px',
            fontWeight: 'bold',
            color: 'white',
            margin: '0 0 25px 0',
            lineHeight: '1.2'
          }}>
            {slide.title}
          </h1>
          {slide.subtitle && (
            <p style={{
              fontSize: '24px',
              color: '#e5e7eb',
              margin: '0 0 20px 0'
            }}>
              {slide.subtitle}
            </p>
          )}
          {slide.content && (
            <p style={{
              fontSize: '18px',
              color: '#d1d5db',
              margin: 0,
              lineHeight: '1.6'
            }}>
              {slide.content}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      position: 'relative',
      background: '#000'
    }}>
      
      {/* Only render current slide */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: index === currentSlide ? 1 : 0,
            visibility: index === currentSlide ? 'visible' : 'hidden',
            transition: 'opacity 0.5s ease-in-out',
            zIndex: index === currentSlide ? 1 : 0
          }}
        >
          {/* Background */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1
          }}>
            {slide.bgImage ? (
              <img 
                src={slide.bgImage}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
                onLoad={() => console.log(`Image loaded: ${slide.bgImage}`)}
                onError={() => console.log(`Image failed: ${slide.bgImage}`)}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                background: slide.type === 'text' ? '#1e3a8a' : '#000000'
              }} />
            )}
          </div>

          {/* Content */}
          {renderSlideContent(slide)}
        </div>
      ))}

      {/* Navigation dots */}
      <div style={{
        position: 'fixed',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: 'none',
              background: index === currentSlide ? 'white' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              transition: 'background 0.3s'
            }}
          />
        ))}
      </div>

      {/* Instructions */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '8px',
        fontSize: '14px',
        zIndex: 100
      }}>
        <div>Slide {currentSlide + 1} of {slides.length}</div>
        <div>Use ↑↓ arrows, scroll, or click dots</div>
      </div>
    </div>
  )
}

export default AbsoluteScrollytelling