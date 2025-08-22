import React, { useState } from 'react'

const slides = [
  {
    id: 'welcome',
    type: 'video',
    title: 'Welcome to BLKOUT',
    videoUrl: '/images/squared/FinalfinalwelcomeSQUARED.mp4',
    bgColor: '#000000'
  },
  {
    id: 'value',
    type: 'text',
    title: 'WHERE BLACK QUEER MEN BUILD COLLECTIVE POWER',
    subtitle: 'BLKOUT UK is a movement built by and for Black queer men in the UK',
    content: 'We exist to create systemic change through digital tech, storytelling, and community ownership.',
    bgColor: '#1e3a8a'
  },
  {
    id: 'well-defined',
    type: 'image',
    title: 'WELL DEFINED',
    subtitle: 'COMPLEXITY IS ALL WE HAVE',
    bgImage: '/images/squared/WELLDEF_SQUARED.png',
    bgColor: '#000000'
  },
  {
    id: 'black',
    type: 'image',
    title: 'BLACK?',
    subtitle: 'MORE THAN MELANIN',
    bgImage: '/images/squared/BlackSQUARED.png',
    bgColor: '#000000'
  }
]

const SimpleSlideTest = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)
  }

  const slide = slides[currentSlide]

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: slide.bgColor || '#000000'
    }}>
      
      {/* Background Image (if exists) */}
      {slide.bgImage && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}>
          <img 
            src={slide.bgImage}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onLoad={() => console.log(`✅ Image loaded: ${slide.bgImage}`)}
            onError={() => console.log(`❌ Image failed: ${slide.bgImage}`)}
          />
        </div>
      )}

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        boxSizing: 'border-box'
      }}>
        
        {slide.type === 'video' ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '30px',
            textAlign: 'center'
          }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}>
              {slide.title}
            </h1>
            <video
              style={{
                width: '80vmin',
                height: '80vmin',
                maxWidth: '600px',
                maxHeight: '600px',
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
        ) : slide.type === 'image' ? (
          <div style={{
            position: 'absolute',
            bottom: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.8)',
            padding: '30px',
            borderRadius: '15px',
            textAlign: 'center',
            maxWidth: '600px'
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
        ) : (
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
        )}
      </div>

      {/* Navigation Controls */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '20px',
        zIndex: 100
      }}>
        <button
          onClick={prevSlide}
          style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            padding: '15px 25px',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          ← Previous
        </button>
        
        <div style={{
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '8px',
          fontSize: '16px'
        }}>
          {currentSlide + 1} / {slides.length}
        </div>
        
        <button
          onClick={nextSlide}
          style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            padding: '15px 25px',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Next →
        </button>
      </div>

      {/* Debug Info */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '14px',
        zIndex: 100
      }}>
        <div>Current: {slide.id}</div>
        <div>Type: {slide.type}</div>
        {slide.bgImage && <div>Image: {slide.bgImage.split('/').pop()}</div>}
        <div>BG Color: {slide.bgColor}</div>
      </div>
    </div>
  )
}

export default SimpleSlideTest