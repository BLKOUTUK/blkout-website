import React from 'react'

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

const WorkingScrollytelling = () => {
  return (
    <div style={{
      height: '100vh',
      overflowY: 'scroll',
      scrollSnapType: 'y mandatory'
    }}>
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          style={{
            height: '100vh',
            width: '100%',
            scrollSnapAlign: 'start',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: slide.bgImage ? `url(${slide.bgImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: slide.bgColor || '#000000'
          }}
        >
          {/* Content overlay */}
          <div style={{
            textAlign: 'center',
            color: 'white',
            zIndex: 10,
            maxWidth: '800px',
            padding: '40px'
          }}>
            
            {slide.type === 'video' ? (
              <div>
                <h1 style={{ fontSize: '48px', marginBottom: '30px' }}>{slide.title}</h1>
                <video
                  style={{ 
                    width: '80vmin', 
                    height: '80vmin',
                    maxWidth: '600px',
                    maxHeight: '600px',
                    objectFit: 'cover',
                    borderRadius: '20px'
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
                background: 'rgba(0,0,0,0.6)',
                padding: '30px',
                borderRadius: '15px',
                backdropFilter: 'blur(10px)'
              }}>
                <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>{slide.title}</h1>
                {slide.subtitle && (
                  <p style={{ fontSize: '24px', opacity: 0.9 }}>{slide.subtitle}</p>
                )}
              </div>
            ) : slide.type === 'cta' ? (
              <div style={{
                background: 'rgba(0,0,0,0.7)',
                padding: '40px',
                borderRadius: '15px',
                backdropFilter: 'blur(10px)'
              }}>
                <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>{slide.title}</h1>
                <p style={{ fontSize: '24px', marginBottom: '20px' }}>{slide.subtitle}</p>
                <p style={{ fontSize: '18px', marginBottom: '30px' }}>{slide.content}</p>
                <a
                  href="https://blkouthub.com/invitation?code=BE862C"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    background: 'white',
                    color: 'black',
                    padding: '15px 30px',
                    borderRadius: '8px',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    textDecoration: 'none'
                  }}
                >
                  Join BLKOUTHUB
                </a>
              </div>
            ) : (
              <div>
                <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>{slide.title}</h1>
                {slide.subtitle && (
                  <p style={{ fontSize: '24px', marginBottom: '20px' }}>{slide.subtitle}</p>
                )}
                {slide.content && (
                  <p style={{ fontSize: '18px' }}>{slide.content}</p>
                )}
              </div>
            )}
          </div>

          {/* Slide indicator */}
          <div style={{
            position: 'absolute',
            bottom: '30px',
            right: '30px',
            background: 'rgba(255,255,255,0.3)',
            padding: '10px',
            borderRadius: '5px',
            color: 'white',
            fontSize: '14px'
          }}>
            {index + 1} / {slides.length}
          </div>
        </div>
      ))}
    </div>
  )
}

export default WorkingScrollytelling