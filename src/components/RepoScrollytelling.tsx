import React, { useState } from 'react'

const slides = [
  // Introducing slide - very first slide
  {
    id: 'introducing',
    type: 'image',
    title: '',
    subtitle: '',
    bgImage: '/images/squared/INTRODUCING.png',
    bgColor: '#000000'
  },

  // Welcome video - second slide
  {
    id: 'welcome',
    type: 'video',
    videoUrl: '/images/squared/FinalfinalwelcomeSQUARED.mp4',
    title: '',
    subtitle: '',
    content: '',
    bgColor: '#000000'
  },
  
  // Value Proposition
  {
    id: 'value-proposition',
    type: 'text',
    title: 'WHERE BLACK QUEER MEN BUILD COLLECTIVE POWER',
    subtitle: 'BLKOUT UK is a movement built by and for Black queer men in the UK, shaping a future where our stories, culture, and leadership are central.',
    content: 'We exist to create systemic change. We connect, empower, and transform Black Queer men\'s lives through digital tech, storytelling, and community ownership.',
    bgColor: '#d97706'
  },
  
  // Well Defined - image only
  {
    id: 'well-defined',
    type: 'image',
    title: 'WELL DEFINED',
    subtitle: 'COMPLEXITY IS ALL WE HAVE',
    bgImage: '/images/squared/WELLDEF_SQUARED.png',
    bgColor: '#000000'
  },
  
  // Unity Not Uniformity
  {
    id: 'unity-not-uniformity',
    type: 'text',
    title: 'UNITY NOT UNIFORMITY',
    subtitle: 'Our identities are complex and contested',
    content: '@BLKOUT this realness is a resource for building our community',
    bgColor: '#4c1d95'
  },
  
  // Definitions - image only slides
  {
    id: 'black',
    type: 'image',
    title: 'BLACK?',
    subtitle: 'MORE THAN MELANIN',
    bgImage: '/images/squared/BlackSQUARED.png',
    bgColor: '#000000'
  },
  {
    id: 'queer',
    type: 'image', 
    title: 'QUEER',
    subtitle: 'RECLAIMED TERRITORY',
    bgImage: '/images/squared/queerSQUARED.PNG',
    bgColor: '#000000'
  },
  {
    id: 'male',
    type: 'image',
    title: 'MALE*',
    subtitle: '*TERMS AND CONDITIONS APPLY',
    bgImage: '/images/squared/menSQUARED.png',
    bgColor: '#000000'
  },
  {
    id: 'out',
    type: 'image',
    title: 'OUT',
    subtitle: 'VISIBILITY ≠ LIBERATION',
    bgImage: '/images/squared/outSQUARED.png',
    bgColor: '#000000'
  },
  
  // Liberation image
  {
    id: 'liberation-image',
    type: 'image',
    title: 'LIBERATION DIALOGUE',
    subtitle: 'DISRUPTION, DIFFERENCE, MEANING-MAKING',
    bgImage: '/images/squared/liberationSQUARED.png',
    bgColor: '#000000'
  },
  
  // Fake quiz
  {
    id: 'fake-quiz-trigger',
    type: 'quiz',
    title: 'BEFORE WE CONTINUE...',
    subtitle: 'A QUICK QUESTION',
    content: 'We want to know if you belong here. Are you ready?',
    bgColor: '#7c2d12',
    question: "What's your favorite weather?",
    options: ["☀️ Sunny", "⛈️ Stormy", "🌧️ Rainy", "🤷🏾‍♂️ Don't notice"],
    result: {
      title: "CONGRATULATIONS! You passed!",
      message: "Plot twist: There was never a test. Identity is liberation, not prison. Difference creates dialogue, not division. Black queer men belong here."
    }
  },
  
  // Creating Shared Futures
  {
    id: 'creating-shared-futures',
    type: 'text',
    title: 'CREATING SHARED FUTURES',
    subtitle: 'we use wisdom from our ancestors',
    content: 'to inform our collective imagination',
    bgColor: '#166534'
  },

  // Liberation Lessons (interactive)
  {
    id: 'lesson-healing',
    type: 'lesson',
    title: 'HEALING AS INNOVATION',
    subtitle: 'TURNING WOUNDS INTO WISDOM',
    quote: 'The trauma is not your fault, the healing is your responsibility.',
    author: 'Erwin McManus',
    content: 'We understand that you\'ve carried burdens that weren\'t yours to bear. Our innovation lies in creating new pathways to healing—not just individual therapy, but collective care systems.\n\nThe reward? You become the ancestor you needed, breaking cycles and building bridges for others who follow your path.',
    bgColor: '#dc2626'
  },
  {
    id: 'lesson-tools',
    type: 'lesson',
    title: 'BUILDING NEW TOOLS',
    subtitle: 'BEYOND THE MASTER\'S BLUEPRINT',
    quote: 'The master\'s tools will never dismantle the master\'s house.',
    author: 'Audre Lorde',
    content: 'We know you\'ve tried to succeed within systems that were never designed for your liberation. Our innovation is creating entirely new frameworks—cooperative ownership, community-led decision making.\n\nThe reward? Freedom from systems that demand you diminish yourself to participate.',
    bgColor: '#ea580c'
  },
  {
    id: 'lesson-connection',
    type: 'lesson',
    title: 'AUTHENTIC CONNECTION',
    subtitle: 'LOVE BEHIND THE MASKS',
    quote: 'Love removes the masks that we fear we cannot live without and know we cannot live within.',
    author: 'James Baldwin',
    content: 'We recognize how exhausting it is to perform versions of yourself for survival. Our innovation is creating spaces where your full humanity is not just welcomed but necessary.\n\nThe reward? The profound relief of being known and loved for exactly who you are.',
    bgColor: '#ca8a04'
  },
  {
    id: 'lesson-collective',
    type: 'lesson',
    title: 'COLLECTIVE LIBERATION',
    subtitle: 'NONE OF US ARE FREE UNTIL ALL OF US ARE FREE',
    quote: 'Your liberation is bound up with mine.',
    author: 'Fannie Lou Hamer',
    content: 'Individual success within oppressive systems is not liberation. True freedom requires collective action and community power.\n\nThe reward? Building movements that create lasting change for all Black queer men.',
    bgColor: '#16a34a'
  },
  
  // Visioning
  {
    id: 'future-visioning',
    type: 'image',
    title: 'IMAGINE',
    subtitle: 'WHAT WE COULD BUILD TOGETHER',
    bgImage: '/images/squared/sunrise SQUARED.png',
    bgColor: '#000000'
  },
  
  // Revelation slides
  {
    id: 'own-stories',
    type: 'image',
    title: 'WHAT IF OUR STORIES CREATED LIBERATION DIALOGUES?',
    subtitle: 'BRAVER SPACES. BOLDER STORYTELLING.',
    bgImage: '/images/squared/seat with baldwin SQUARED.png',
    bgColor: '#000000'
  },
  
  {
    id: 'build-wealth',
    type: 'image',
    title: 'WHAT IF WE BUILT WEALTH TOGETHER?',
    subtitle: 'LIBERATION PLUS FINANCIAL INDEPENDENCE',
    bgImage: '/images/squared/capacitySQUARED.png',
    bgColor: '#000000'
  },
  
  {
    id: 'liberation-legacy',
    type: 'image',
    title: 'WHAT IF WE MOVED BEYOND VISIBILITY TO SOLIDARITY?',
    subtitle: 'THE REVOLUTION IS COOPERATIVE',
    bgImage: '/images/squared/imagine SQUARED.png',
    bgColor: '#000000'
  },
  
  // Realness Unleashed
  {
    id: 'realness-unleashed',
    type: 'text',
    title: 'REALNESS UNLEASHED',
    subtitle: 'Building the infrastructure for Black Queer community',
    content: '',
    bgColor: '#4c1d95'
  },
  
  // Story powered video
  {
    id: 'story-powered-video',
    type: 'video',
    videoUrl: '/images/squared/story powered SQUARED).mp4',
    title: '',
    subtitle: '',
    content: '',
    bgColor: '#000000'
  },

  // Project intro
  {
    id: 'project-intro',
    type: 'image',
    title: 'OUR PROJECTS',
    subtitle: 'BUILDING LIBERATION TOGETHER',
    bgImage: '/images/squared/projects SQUAREDpng.png',
    bgColor: '#000000'
  },
  
  // Your Voice Matters
  {
    id: 'your-voice-matters',
    type: 'text',
    title: 'YOUR VOICE MATTERS',
    subtitle: 'we are informed and led by Black queer men',
    content: 'have your say',
    bgColor: '#166534'
  },
  
  // Pathway quiz (interactive)
  {
    id: 'pathway-discovery',
    type: 'pathway',
    title: 'DISCOVER YOUR LIBERATION PATHWAY',
    subtitle: 'THERE ARE MANY DIFFERENT ROLES TO PLAY',
    content: 'Now that you\'ve explored what\'s possible, let\'s get curious about how you want to contribute.\n\nWhat part of our work do you find most interesting?',
    bgColor: '#ea580c',
    question: "What part of our work do you find most interesting?",
    options: [
      { text: "Direct mutual aid and support", pathway: "community-healer" },
      { text: "Creative expression and storytelling", pathway: "creative-catalyst" }, 
      { text: "Technology and digital liberation", pathway: "tech-liberator" },
      { text: "Policy and systemic change", pathway: "systems-transformer" }
    ],
    pathwayResults: {
      "community-healer": {
        title: "COMMUNITY HEALER",
        subtitle: "The medicine our people need",
        description: "You're drawn to the deep work of healing - both individual and collective.",
        opportunities: [
          "Ready to take the next step? Become a member of the BLKOUT cooperative and help build the platform for Black queer liberation.",
          "Join our waiting list for the next recruitment round - we're looking for passionate community healers to help shape our future.",
          "Your skills in community care and mutual aid are exactly what our cooperative needs to thrive."
        ]
      },
      "creative-catalyst": {
        title: "CREATIVE CATALYST", 
        subtitle: "Storytelling as liberation practice",
        description: "You understand that representation matters, but authentic representation controlled by us matters more.",
        opportunities: [
          "Ready to take the next step? Become a member of the BLKOUT cooperative and help build the platform for Black queer liberation.",
          "Join our waiting list for the next recruitment round - we're looking for creative catalysts to help shape our storytelling future.",
          "Your skills in creative expression and authentic representation are exactly what our cooperative needs to thrive."
        ]
      },
      "tech-liberator": {
        title: "TECH LIBERATOR",
        subtitle: "Code as cooperative power",
        description: "You see technology as a tool for collective liberation, not individual accumulation.",
        opportunities: [
          "Ready to take the next step? Become a member of the BLKOUT cooperative and help build the platform for Black queer liberation.",
          "Join our waiting list for the next recruitment round - we're looking for tech liberators to help shape our digital future.",
          "Your skills in technology and digital liberation are exactly what our cooperative needs to thrive."
        ]
      },
      "systems-transformer": {
        title: "SYSTEMS TRANSFORMER",
        subtitle: "Policy as collective power building",
        description: "You're committed to changing the rules of the game, not just playing it better.",
        opportunities: [
          "Ready to take the next step? Become a member of the BLKOUT cooperative and help build the platform for Black queer liberation.",
          "Join our waiting list for the next recruitment round - we're looking for systems transformers to help shape our policy work.",
          "Your skills in policy and systemic change are exactly what our cooperative needs to thrive."
        ]
      }
    }
  },
  
  // Photo collage video
  {
    id: 'photo-collage',
    type: 'video',
    title: '',
    subtitle: '',
    content: '',
    videoUrl: '/images/squared/photo collage Video.mp4',
    bgColor: '#000000'
  },
  
  // Realness Unleashed Infographic
  {
    id: 'realness-unleashed-infographic',
    type: 'image',
    title: '',
    subtitle: '',
    bgImage: '/images/squared/REALNESS UNLEASHED Infographic Graph .png',
    bgColor: '#000000'
  },
  
  // Primary CTA
  {
    id: 'blkouthub-cta',
    type: 'cta',
    title: 'READY TO JOIN?',
    subtitle: 'YOUR LIBERATION JOURNEY STARTS HERE',
    content: 'You\'ve experienced our vision. Now join the movement for real community support, personalized AI assistance, and collective liberation action. Access the full BLKOUT platform with community tools, AI assistance, and cooperative features.',
    bgImage: '/images/squared/facecard SQUARED.png',
    bgColor: '#000000'
  },
  
  // Newsletter CTA
  {
    id: 'newsletter-cta',
    type: 'cta',
    title: 'STAY CONNECTED',
    subtitle: 'JOIN OUR NEWSLETTER',
    content: 'Stay connected with our latest projects, events, and community stories. Regular updates on cooperative development and community initiatives.',
    bgColor: '#1e3a8a',
    ctaText: 'JOIN NEWSLETTER',
    ctaUrl: 'https://blkoutuk.com/newsletter'
  },
  
  // Explore Platform CTA
  {
    id: 'explore-platform-cta',
    type: 'cta',
    title: 'EXPLORE THE PLATFORM',
    subtitle: 'DISCOVER MORE',
    content: 'Browse our full range of projects, resources, and ways to get involved in the movement. Community hub, events calendar, and cooperative resources.',
    bgColor: '#4c1d95',
    ctaText: 'EXPLORE PLATFORM',
    ctaUrl: 'https://blkout-community-platform-pl201c5w0-robs-projects-54d653d3.vercel.app'
  }
]

const RepoScrollytelling: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showFakeQuizResults, setShowFakeQuizResults] = useState(false)
  const [selectedPathway, setSelectedPathway] = useState('')
  const [showPathwayResults, setShowPathwayResults] = useState(false)
  const [lessonRevealed, setLessonRevealed] = useState<{[key: string]: boolean}>({})

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const slide = slides[currentSlide]

  return (
    <div style={{
      minHeight: '100vh',
      background: slide.bgColor || '#000000',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Background Image */}
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
              objectFit: 'contain',
              objectPosition: 'center'
            }}
            onLoad={() => console.log(`✅ Image loaded: ${slide.bgImage}`)}
            onError={() => console.log(`❌ Image failed: ${slide.bgImage}`)}
          />
        </div>
      )}

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
        padding: '24px'
      }}>
        
        {/* Video Content */}
        {slide.type === 'video' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '30px',
            textAlign: 'center',
            marginBottom: '32px'
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
        )}

        {/* Main Content */}
        <div style={{
          textAlign: 'center',
          maxWidth: '1024px',
          margin: '0 auto'
        }}>
          
          {/* Regular Text Slides */}
          {slide.type === 'text' && (
            <>
              <h1 style={{
                fontSize: window.innerWidth >= 768 ? '64px' : '48px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '24px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
              }}>
                {slide.title}
              </h1>

              <p style={{
                fontSize: window.innerWidth >= 768 ? '24px' : '18px',
                color: '#e5e7eb',
                marginBottom: '32px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontFamily: 'monospace'
              }}>
                {slide.subtitle}
              </p>

              <p style={{
                fontSize: window.innerWidth >= 768 ? '20px' : '16px',
                color: '#d1d5db',
                lineHeight: '1.6',
                maxWidth: '512px',
                margin: '0 auto'
              }}>
                {slide.content}
              </p>
            </>
          )}

          {/* Interactive Quiz */}
          {slide.type === 'quiz' && (
            <div>
              <h1 style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '24px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
              }}>
                {slide.title}
              </h1>
              
              <p style={{
                fontSize: '20px',
                color: '#e5e7eb',
                marginBottom: '32px'
              }}>
                {slide.subtitle}
              </p>

              {!showFakeQuizResults ? (
                <div>
                  <p style={{
                    fontSize: '18px',
                    color: '#d1d5db',
                    marginBottom: '32px'
                  }}>
                    {slide.content}
                  </p>
                  
                  <h3 style={{
                    fontSize: '24px',
                    color: 'white',
                    marginBottom: '24px'
                  }}>
                    {slide.question}
                  </h3>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    maxWidth: '600px',
                    margin: '0 auto'
                  }}>
                    {slide.options?.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setShowFakeQuizResults(true)}
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          color: 'white',
                          border: '2px solid rgba(255,255,255,0.3)',
                          padding: '16px',
                          borderRadius: '12px',
                          fontSize: '16px',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          backdropFilter: 'blur(10px)'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = 'rgba(255,255,255,0.2)'
                          e.target.style.transform = 'scale(1.05)'
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = 'rgba(255,255,255,0.1)'
                          e.target.style.transform = 'scale(1)'
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{
                  background: 'rgba(0,0,0,0.8)',
                  padding: '40px',
                  borderRadius: '20px',
                  backdropFilter: 'blur(10px)'
                }}>
                  <h2 style={{
                    fontSize: '36px',
                    color: '#4ade80',
                    marginBottom: '24px'
                  }}>
                    {slide.result?.title}
                  </h2>
                  <p style={{
                    fontSize: '18px',
                    color: '#d1d5db',
                    lineHeight: '1.6'
                  }}>
                    {slide.result?.message}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Interactive Lessons */}
          {slide.type === 'lesson' && (
            <div style={{
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <h1 style={{
                fontSize: '42px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '16px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
              }}>
                {slide.title}
              </h1>
              
              <p style={{
                fontSize: '18px',
                color: '#e5e7eb',
                marginBottom: '32px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontFamily: 'monospace'
              }}>
                {slide.subtitle}
              </p>

              <div style={{
                background: 'rgba(0,0,0,0.4)',
                padding: '24px',
                borderRadius: '16px',
                marginBottom: '24px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'start',
                  gap: '16px'
                }}>
                  <div style={{ fontSize: '32px', opacity: 0.6 }}>❝</div>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: '20px',
                      color: 'white',
                      fontStyle: 'italic',
                      lineHeight: '1.5',
                      marginBottom: '16px'
                    }}>
                      {slide.quote}
                    </p>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        fontSize: '14px',
                        color: '#e5e7eb',
                        opacity: 0.8,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontFamily: 'monospace'
                      }}>
                        — {slide.author}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {!lessonRevealed[slide.id] ? (
                <button
                  onClick={() => setLessonRevealed({...lessonRevealed, [slide.id]: true})}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '2px solid rgba(255,255,255,0.3)',
                    padding: '20px 40px',
                    borderRadius: '12px',
                    fontSize: '18px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    backdropFilter: 'blur(10px)',
                    width: '100%'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.2)'
                    e.target.style.transform = 'scale(1.02)'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.1)'
                    e.target.style.transform = 'scale(1)'
                  }}
                >
                  💭 Tap to Reveal Our Response
                </button>
              ) : (
                <div style={{
                  background: 'rgba(0,0,0,0.6)',
                  padding: '24px',
                  borderRadius: '16px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <span style={{
                      fontSize: '14px',
                      color: '#e5e7eb',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      fontFamily: 'monospace'
                    }}>
                      Community Response
                    </span>
                    <button
                      onClick={() => setLessonRevealed({...lessonRevealed, [slide.id]: false})}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#e5e7eb',
                        cursor: 'pointer',
                        fontSize: '16px',
                        opacity: 0.6
                      }}
                      onMouseOver={(e) => e.target.style.opacity = '1'}
                      onMouseOut={(e) => e.target.style.opacity = '0.6'}
                    >
                      ✕
                    </button>
                  </div>
                  
                  {slide.content?.split('\n\n').map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      style={{
                        fontSize: '16px',
                        color: '#d1d5db',
                        lineHeight: '1.6',
                        marginBottom: pIndex < slide.content.split('\n\n').length - 1 ? '16px' : '0'
                      }}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pathway Quiz */}
          {slide.type === 'pathway' && (
            <div>
              <h1 style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '24px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
              }}>
                {slide.title}
              </h1>
              
              <p style={{
                fontSize: '20px',
                color: '#e5e7eb',
                marginBottom: '16px'
              }}>
                {slide.subtitle}
              </p>

              <p style={{
                fontSize: '16px',
                color: '#d1d5db',
                marginBottom: '32px'
              }}>
                {slide.content}
              </p>

              {!showPathwayResults ? (
                <div>
                  <h3 style={{
                    fontSize: '24px',
                    color: 'white',
                    marginBottom: '24px'
                  }}>
                    {slide.question}
                  </h3>
                  
                  <div style={{
                    display: 'grid',
                    gap: '16px',
                    maxWidth: '600px',
                    margin: '0 auto'
                  }}>
                    {slide.options?.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedPathway(option.pathway)
                          setShowPathwayResults(true)
                        }}
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          color: 'white',
                          border: '2px solid rgba(255,255,255,0.3)',
                          padding: '20px',
                          borderRadius: '12px',
                          fontSize: '16px',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          backdropFilter: 'blur(10px)',
                          textAlign: 'left'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = 'rgba(255,255,255,0.2)'
                          e.target.style.transform = 'scale(1.02)'
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = 'rgba(255,255,255,0.1)'
                          e.target.style.transform = 'scale(1)'
                        }}
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{
                  background: 'rgba(0,0,0,0.8)',
                  padding: '40px',
                  borderRadius: '20px',
                  backdropFilter: 'blur(10px)',
                  textAlign: 'left'
                }}>
                  {slide.pathwayResults?.[selectedPathway] && (
                    <>
                      <h2 style={{
                        fontSize: '36px',
                        color: '#4ade80',
                        marginBottom: '8px'
                      }}>
                        {slide.pathwayResults[selectedPathway].title}
                      </h2>
                      <p style={{
                        fontSize: '18px',
                        color: '#e5e7eb',
                        marginBottom: '16px',
                        fontStyle: 'italic'
                      }}>
                        {slide.pathwayResults[selectedPathway].subtitle}
                      </p>
                      <p style={{
                        fontSize: '16px',
                        color: '#d1d5db',
                        marginBottom: '24px',
                        lineHeight: '1.6'
                      }}>
                        {slide.pathwayResults[selectedPathway].description}
                      </p>
                      
                      <h4 style={{
                        fontSize: '18px',
                        color: 'white',
                        marginBottom: '16px'
                      }}>
                        Immediate Opportunities:
                      </h4>
                      
                      <div style={{ marginBottom: '24px' }}>
                        {slide.pathwayResults[selectedPathway].opportunities?.map((opportunity, index) => (
                          <p
                            key={index}
                            style={{
                              fontSize: '14px',
                              color: '#d1d5db',
                              marginBottom: '8px',
                              lineHeight: '1.5'
                            }}
                          >
                            {opportunity}
                          </p>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          setShowPathwayResults(false)
                          setSelectedPathway('')
                        }}
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          color: 'white',
                          border: '2px solid rgba(255,255,255,0.3)',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          marginRight: '16px'
                        }}
                      >
                        Take Quiz Again
                      </button>

                      <a
                        href="https://blkout-community-platform-pl201c5w0-robs-projects-54d653d3.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-block',
                          background: '#4ade80',
                          color: 'black',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          textDecoration: 'none'
                        }}
                      >
                        Get Support
                      </a>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Pure image slides - no text overlays for slides 3-9 (identity questions) */}
          {slide.type === 'image' && ['introducing', 'well-defined', 'black', 'queer', 'male', 'out', 'liberation-image', 'project-intro', 'realness-unleashed-infographic'].includes(slide.id) && (
            // No text overlay for identity question slides - let the images speak for themselves
            null
          )}
          
          {/* Image slides with text overlays for other slides */}
          {slide.type === 'image' && !['introducing', 'well-defined', 'black', 'queer', 'male', 'out', 'liberation-image', 'project-intro', 'realness-unleashed-infographic'].includes(slide.id) && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              background: 'rgba(0,0,0,0.7)',
              padding: '40px',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              maxWidth: '90%',
              width: 'auto'
            }}>
              <h1 style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '16px',
                lineHeight: '1.1'
              }}>
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p style={{
                  fontSize: '24px',
                  color: '#e5e7eb',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  fontFamily: 'monospace',
                  marginBottom: '20px'
                }}>
                  {slide.subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* CTA Slides */}
        {slide.type === 'cta' && (
          <div style={{
            marginTop: '48px',
            background: 'rgba(0,0,0,0.8)',
            padding: '40px',
            borderRadius: '20px',
            textAlign: 'center',
            maxWidth: '600px',
            backdropFilter: 'blur(10px)'
          }}>
            <a
              href={slide.ctaUrl || "https://blkout-community-platform-pl201c5w0-robs-projects-54d653d3.vercel.app"}
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
              {slide.ctaText || "Join BLKOUTHUB"}
            </a>
          </div>
        )}

        {/* Navigation Arrow */}
        {currentSlide < slides.length - 1 && (
          <button
            onClick={nextSlide}
            style={{
              position: 'absolute',
              bottom: '32px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '12px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              color: 'white',
              cursor: 'pointer',
              fontSize: '24px',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)'
              e.target.style.transform = 'translateX(-50%) scale(1.1)'
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.1)'
              e.target.style.transform = 'translateX(-50%) scale(1)'
            }}
          >
            ↓
          </button>
        )}

        {/* Navigation Dots */}
        <div style={{
          position: 'fixed',
          right: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 50
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
                transition: 'all 0.3s',
                transform: index === currentSlide ? 'scale(1.25)' : 'scale(1)'
              }}
            />
          ))}
        </div>

        {/* Navigation Controls */}
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          display: 'flex',
          gap: '10px',
          zIndex: 50
        }}>
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
              opacity: currentSlide === 0 ? 0.5 : 1
            }}
          >
            ← Prev
          </button>
          
          <div style={{
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            {currentSlide + 1} / {slides.length}
          </div>
          
          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: currentSlide === slides.length - 1 ? 'not-allowed' : 'pointer',
              opacity: currentSlide === slides.length - 1 ? 0.5 : 1
            }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}

export default RepoScrollytelling