import React from 'react'

const BasicScrollytelling = () => {
  return (
    <div style={{ height: '100vh', overflow: 'auto', scrollSnapType: 'y mandatory' }}>
      {/* Simple header */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        width: '100%', 
        background: 'black', 
        zIndex: 50, 
        padding: '16px', 
        textAlign: 'center' 
      }}>
        <h1 style={{ color: 'white', fontSize: '20px', margin: 0 }}>BLKOUT</h1>
      </div>

      {/* Content with inline styles to ensure they work */}
      <div style={{ paddingTop: '64px' }}>
        
        {/* Slide 1 - Video test */}
        <div style={{ 
          width: '100%', 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: '#1e3a8a',
          scrollSnapAlign: 'start'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: 'white', fontSize: '36px', marginBottom: '16px' }}>Slide 1 - Video</h2>
            <video 
              style={{ width: '256px', height: '256px', background: '#ef4444' }}
              autoPlay 
              muted 
              loop
              src="/images/squared/FinalfinalwelcomeSQUARED.mp4"
            >
              Video not loading
            </video>
          </div>
        </div>

        {/* Slide 2 - Image test with img tag */}
        <div style={{ 
          width: '100%', 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: '#166534',
          scrollSnapAlign: 'start'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: 'white', fontSize: '36px', marginBottom: '16px' }}>Slide 2 - IMG tag</h2>
            <img 
              src="/images/squared/BlackSQUARED.png"
              alt="Black"
              style={{ 
                width: '256px', 
                height: '256px', 
                objectFit: 'cover', 
                border: '4px solid #ef4444' 
              }}
              onLoad={() => console.log('IMG: BlackSQUARED.png loaded')}
              onError={() => console.log('IMG: BlackSQUARED.png FAILED')}
            />
          </div>
        </div>

        {/* Slide 3 - CSS background test */}
        <div style={{ 
          width: '100%', 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          scrollSnapAlign: 'start',
          backgroundImage: 'url(/images/squared/queerSQUARED.PNG)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div style={{ 
            textAlign: 'center', 
            background: 'rgba(0,0,0,0.7)', 
            padding: '32px', 
            borderRadius: '8px' 
          }}>
            <h2 style={{ color: 'white', fontSize: '36px', marginBottom: '16px' }}>Slide 3 - CSS Background</h2>
            <p style={{ color: 'white' }}>queerSQUARED.PNG as background</p>
          </div>
        </div>

        {/* Slide 4 - Another image test */}
        <div style={{ 
          width: '100%', 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: '#6b21a8',
          scrollSnapAlign: 'start'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: 'white', fontSize: '36px', marginBottom: '16px' }}>Slide 4 - Another Image</h2>
            <img 
              src="/images/squared/WELLDEF_SQUARED.png"
              alt="Well Defined"
              style={{ 
                width: '320px', 
                height: '320px', 
                objectFit: 'cover', 
                border: '4px solid #eab308' 
              }}
              onLoad={() => console.log('IMG: WELLDEF_SQUARED.png loaded')}
              onError={() => console.log('IMG: WELLDEF_SQUARED.png FAILED')}
            />
          </div>
        </div>

        {/* Slide 5 - Space in filename test */}
        <div style={{ 
          width: '100%', 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: '#991b1b',
          scrollSnapAlign: 'start'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: 'white', fontSize: '36px', marginBottom: '16px' }}>Slide 5 - Space in filename</h2>
            <img 
              src="/images/squared/facecard SQUARED.png"
              alt="Facecard"
              style={{ 
                width: '320px', 
                height: '320px', 
                objectFit: 'cover', 
                border: '4px solid #06b6d4' 
              }}
              onLoad={() => console.log('IMG: facecard SQUARED.png loaded')}
              onError={() => console.log('IMG: facecard SQUARED.png FAILED')}
            />
          </div>
        </div>

      </div>

      {/* Simple navigation info */}
      <div style={{ 
        position: 'fixed', 
        bottom: '16px', 
        left: '16px', 
        background: 'rgba(0,0,0,0.7)', 
        padding: '8px', 
        borderRadius: '4px', 
        fontSize: '14px',
        color: 'white'
      }}>
        <div>Scroll to test</div>
        <div>Check console for image loading</div>
      </div>
    </div>
  )
}

export default BasicScrollytelling