import React from 'react'

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

const CleanScrollytelling = () => {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      position: 'relative'
    }}>
      
      {/* Scroll container */}
      <div style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth'
      }}>
        
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            style={{
              width: '100vw',
              height: '100vh',
              minHeight: '100vh',
              maxHeight: '100vh',
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            
            {/* Background layer - full coverage */}
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
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: slide.type === 'text' ? '#1e3a8a' : '#000000'
                }} />
              )}
            </div>

            {/* Content layer - positioned to not obscure */}
            <div style={{
              position: 'relative',
              zIndex: 10,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: slide.type === 'image' ? 'flex-end' : 'center',
              alignItems: 'center',
              padding: '40px',
              boxSizing: 'border-box'
            }}>
              
              {slide.type === 'video' ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '30px'
                }}>
                  <h1 style={{
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: 'white',
                    textAlign: 'center',
                    margin: 0,
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
              ) : slide.type === 'image' ? (
                /* Position text at bottom for image slides */
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
              ) : slide.type === 'cta' ? (
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
                      textDecoration: 'none',
                      transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    Join BLKOUTHUB
                  </a>
                </div>
              ) : (
                /* Text slides - centered */
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

            {/* Slide counter - minimal and unobtrusive */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              padding: '8px 16px',
              borderRadius: '20px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              zIndex: 20
            }}>
              {index + 1} / {slides.length}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CleanScrollytelling