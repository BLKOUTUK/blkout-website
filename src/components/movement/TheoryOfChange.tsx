'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, ChevronDown, ExternalLink } from 'lucide-react'
import PrimaryNavigationEnhanced from '../layout/PrimaryNavigationEnhanced'

// ========================================
// BLKOUT THEORY OF CHANGE v2.0 - SCROLLING STORY
// ========================================
// 40-card narrative experience
// X-Men 97 animation aesthetic + real photography
// Purple family palette (indigo → fuchsia → pink)
// Accents: gold (amber), teal, emerald
// Built for conversion: anonymous viewer → engaged participant → hero
// Ends with OOMF Interactive integration
// ========================================

interface CardData {
  id: number
  type: 'text' | 'visual' | 'interactive' | 'video' | 'statement' | 'beauty' | 'cascade' | 'oomf' | 'disclaimer'
  visualStyle?: 'animated' | 'photo' | 'hyper-real' // Animation, real photography, or AI photorealistic
  imageUrl?: string // Path to generated card image
  content: {
    title?: string
    body?: string
    highlight?: string
    quote?: string
    subtext?: string
  }
  background: string // Tailwind gradient classes (fallback if no image)
  interactive?: {
    type: 'poll' | 'reveal' | 'swipe' | 'wordcloud' | 'map' | 'openresponse' | 'cascade'
    data?: any
  }
  video?: {
    title: string
    placeholder: string
    duration: string
    style: string
    videoUrl?: string // Path to video file when ready
  }
  oomf?: {
    url: string
    ctaText: string
  }
  cta?: {
    type: 'single' | 'horizontal-scroll'
    text?: string
    link?: string
    color?: 'amber' | 'fuchsia'
  }
}

// ========================================
// CARD 0: DISCLAIMER
// ========================================
const disclaimerCard: CardData = {
  id: 0,
  type: 'disclaimer',
  visualStyle: 'hyper-real',
  content: {
    title: 'THE FOLLOWING IMAGERY CREATED WITH AI',
    body: 'Representing diverse Black queer experiences',
    subtext: 'Models: Alibaba Wan 2.6 (DashScope), Google Gemini 3 Pro\n\nReal photography: Cards 20, 27, 29, 39, 40'
  },
  background: 'from-indigo-950 via-purple-950 to-black'
};

// ========================================
// ACT 1: RECOGNITION (Cards 1-10)
// ========================================
const act1Cards: CardData[] = [
  {
    id: 1,
    type: 'statement',
    visualStyle: 'hyper-real',
    imageUrl: '/images/theory-of-change/card-01-isolation.png',
    content: {
      body: 'You ever been in a room full of us and still felt alone?'
    },
    background: 'from-indigo-950 via-purple-950 to-violet-950'
  },
  {
    id: 2,
    type: 'statement',
    visualStyle: 'hyper-real',
    imageUrl: '/images/theory-of-change/card-02-recognition.png',
    content: {
      body: 'Same.'
    },
    background: 'from-purple-950 to-violet-950'
  },
  {
    id: 3,
    type: 'text',
    visualStyle: 'hyper-real',
    imageUrl: '/images/theory-of-change/card-03-wondering.png',
    content: {
      body: 'You ever wondered who you\'d be if you actually knew us?'
    },
    background: 'from-fuchsia-950 via-purple-950 to-violet-950'
  },
  {
    id: 4,
    type: 'interactive',
    visualStyle: 'hyper-real',
    imageUrl: '/images/theory-of-change/card-04-poll.png',
    content: {
      title: 'How many Black queer men do you know well enough to call at 3am?',
      body: 'Be honest.'
    },
    background: 'from-indigo-950 via-purple-950 to-violet-950',
    interactive: {
      type: 'poll',
      data: {
        options: ['0', '1-2', '3-5', 'Squad deep']
      }
    }
  },
  {
    id: 5,
    type: 'text',
    visualStyle: 'hyper-real',
    imageUrl: '/images/theory-of-change/card-05-one-or-fewer.png',
    content: {
      body: 'When we asked, most said:',
      highlight: '1 or fewer.'
    },
    background: 'from-purple-950 to-fuchsia-950'
  },
  {
    id: 6,
    type: 'statement',
    visualStyle: 'hyper-real',
    imageUrl: '/images/theory-of-change/card-06-proximity.png',
    content: {
      body: 'That\'s not a personal failing.',
      highlight: 'That\'s a design.'
    },
    background: 'from-violet-950 via-purple-950 to-indigo-950'
  },
  {
    id: 7,
    type: 'beauty',
    visualStyle: 'hyper-real',
    imageUrl: '/images/theory-of-change/card-07-survive-alone.png',
    content: {
      title: 'But also—'
    },
    background: 'from-fuchsia-600 via-purple-600 to-pink-600'
  },
  {
    id: 8,
    type: 'interactive',
    visualStyle: 'hyper-real',
    imageUrl: '/images/theory-of-change/card-08-old-story.png',
    content: {
      title: 'What we\'ve been told',
      body: 'Click to reveal →'
    },
    background: 'from-indigo-950 to-purple-950',
    interactive: {
      type: 'reveal',
      data: {
        revealed: 'Love yourself first. Know yourself. Then you can connect.'
      }
    }
  },
  {
    id: 9,
    type: 'statement',
    visualStyle: 'hyper-real',
    imageUrl: '/images/theory-of-change/card-09-inversion.png',
    content: {
      title: 'The Inversion',
      body: 'Know yourself → Love yourself → Connect',
      highlight: 'Know each other → Know ourselves → Love becomes possible'
    },
    background: 'from-purple-950 via-violet-950 to-fuchsia-950'
  },
  {
    id: 10,
    type: 'statement',
    visualStyle: 'hyper-real',
    imageUrl: '/images/theory-of-change/card-10-backwards.png',
    content: {
      body: 'The order matters.'
    },
    background: 'from-fuchsia-950 via-purple-950 to-violet-950'
  }
]

// ========================================
// ACT 2: THE PROBLEM (Cards 11-18 including Video 1)
// ========================================
const act2Cards: CardData[] = [
  {
    id: 11,
    type: 'statement',
    visualStyle: 'hyper-real',
    imageUrl: '/images/theory-of-change/card-11-geography.png',
    content: {
      body: 'Racism and patriarchy don\'t just hurt us.',
      highlight: 'They sever us from each other.'
    },
    background: 'from-indigo-950 to-purple-950'
  },
  {
    id: 12,
    type: 'cascade',
    visualStyle: 'hyper-real',
    imageUrl: '/images/theory-of-change/card-12-cascade.png',
    content: {
      title: 'Without each other:'
    },
    background: 'from-purple-950 to-violet-950',
    interactive: {
      type: 'cascade',
      data: {
        lines: [
          'Rumour fills the void',
          'We can\'t tell what\'s real',
          'We can\'t know ourselves'
        ]
      }
    }
  },
  {
    id: 13,
    type: 'text',
    visualStyle: 'hyper-real',
    imageUrl: '/images/theory-of-change/card-13-app.png',
    content: {
      quote: 'If we can\'t love ourselves, how are we going to love each other?',
      highlight: 'But what if we\'ve had it backwards?'
    },
    background: 'from-violet-950 via-fuchsia-950 to-purple-950'
  },
  {
    id: 14,
    type: 'statement',
    visualStyle: 'hyper-real',
    imageUrl: '/images/theory-of-change/card-14-club.png',
    content: {
      body: 'You can\'t know yourself in isolation.',
      highlight: 'The self is relational. Always was.'
    },
    background: 'from-purple-950 via-violet-950 to-indigo-950'
  },
  {
    id: 15,
    type: 'beauty',
    visualStyle: 'hyper-real',
    imageUrl: '/images/theory-of-change/card-15-group-chat.png',
    content: {
      title: 'We come from somewhere.'
    },
    background: 'from-indigo-600 via-purple-600 to-violet-600'
  },
  {
    id: 16,
    type: 'interactive',
    visualStyle: 'hyper-real',
    imageUrl: '/images/theory-of-change/card-16-swipe.png',
    content: {
      title: 'They asked us what works. No one knew.'
    },
    background: 'from-violet-950 to-purple-950',
    interactive: {
      type: 'swipe',
      data: {
        before: {
          text: 'They asked us what works.',
          detail: 'No one knew.'
        },
        after: {
          text: 'Because there was no \'us\' that could be asked.',
          detail: 'The structural problem becoming visible.'
        }
      }
    }
  },
  {
    id: 17,
    type: 'statement',
    visualStyle: 'hyper-real',
    imageUrl: '/images/theory-of-change/card-17-dont-know.png',
    content: {
      body: 'Our heterogeneity wasn\'t a problem to solve.',
      highlight: 'It was the richness we hadn\'t yet learned to hold.'
    },
    background: 'from-fuchsia-950 via-purple-950 to-violet-950'
  },
  {
    id: 18,
    type: 'video',
    visualStyle: 'animated',
    content: {
      title: 'We Don\'t Know Each Other (Yet)'
    },
    background: 'from-indigo-950 via-purple-950 to-black',
    video: {
      title: 'We Don\'t Know Each Other (Yet)',
      placeholder: 'X-Men 97 Animation Style - Coming Soon',
      duration: '60-90s',
      style: 'Bold cel-shaded animation, dramatic lighting, heroic isolation → connection'
    }
  }
]

// ========================================
// ACT 3: WHAT WE'RE BUILDING (Cards 19-29)
// ========================================
const act3Cards: CardData[] = [
  {
    id: 19,
    type: 'statement',
    visualStyle: 'hyper-real',
    imageUrl: '/images/theory-of-change/card-19-what-if.png',
    content: {
      title: 'So we\'re building something.',
      body: 'SPACE',
      highlight: 'Unmediated. Where we meet each other as we actually are.'
    },
    background: 'from-purple-950 via-indigo-950 to-violet-950'
  },
  {
    id: 20,
    type: 'beauty',
    visualStyle: 'photo',
    content: {
      title: 'Space in action'
    },
    background: 'from-violet-950 to-fuchsia-950'
  },
  {
    id: 21,
    type: 'statement',
    visualStyle: 'animated',
    content: {
      title: 'From Space to:',
      body: 'DIALOGUE',
      highlight: 'Conversation that separates rumour from reality. The ground for knowing.'
    },
    background: 'from-fuchsia-600 via-pink-600 to-purple-600'
  },
  {
    id: 22,
    type: 'interactive',
    visualStyle: 'hyper-real',
    imageUrl: '/images/theory-of-change/card-22-wordcloud.png',
    content: {
      title: 'What comes up when we finally talk:',
      body: 'Click a topic'
    },
    background: 'from-indigo-950 via-purple-950 to-violet-950',
    interactive: {
      type: 'wordcloud',
      data: {
        topics: [
          { word: 'Family', size: 'large' },
          { word: 'Sex', size: 'large' },
          { word: 'Money', size: 'medium' },
          { word: 'Health', size: 'large' },
          { word: 'Faith', size: 'small' },
          { word: 'Fear', size: 'medium' },
          { word: 'Joy', size: 'large' },
          { word: 'Aging', size: 'medium' },
          { word: 'Love', size: 'large' },
          { word: 'Loneliness', size: 'medium' },
          { word: 'Dreams', size: 'medium' },
          { word: 'Rage', size: 'small' },
          { word: 'Healing', size: 'large' }
        ]
      }
    }
  },
  {
    id: 23,
    type: 'statement',
    visualStyle: 'hyper-real',
    imageUrl: '/images/theory-of-change/card-23-connection.png',
    content: {
      title: 'From Dialogue to:',
      body: 'INSTITUTION',
      highlight: 'Infrastructure so knowledge can travel. So the next generation doesn\'t start from zero.'
    },
    background: 'from-purple-950 to-violet-950'
  },
  {
    id: 24,
    type: 'text',
    visualStyle: 'hyper-real',
    imageUrl: '/images/theory-of-change/card-24-articles.png',
    content: {
      body: '300+ articles by us, for us\n8 years building\n1 community-owned organization\n0 permission asked'
    },
    background: 'from-violet-950 via-fuchsia-950 to-purple-950'
  },
  {
    id: 25,
    type: 'beauty',
    visualStyle: 'photo',
    content: {
      title: 'Our own space to hear and be heard.'
    },
    background: 'from-indigo-950 via-purple-950 to-violet-950'
  },
  {
    id: 26,
    type: 'interactive',
    visualStyle: 'hyper-real',
    imageUrl: '/images/theory-of-change/card-26-map.png',
    content: {
      title: 'Black queer men. Everywhere. Finding each other.',
      body: 'Where are you?'
    },
    background: 'from-purple-950 to-indigo-950',
    interactive: {
      type: 'map',
      data: {
        locations: [
          { city: 'London', count: 850, lat: 51.5074, lng: -0.1278 },
          { city: 'Manchester', count: 120, lat: 53.4808, lng: -2.2426 },
          { city: 'Birmingham', count: 95, lat: 52.4862, lng: -1.8904 },
          { city: 'Bristol', count: 67, lat: 51.4545, lng: -2.5879 },
          { city: 'Leeds', count: 54, lat: 53.8008, lng: -1.5491 },
          { city: 'Glasgow', count: 48, lat: 55.8642, lng: -4.2518 }
        ]
      }
    }
  },
  {
    id: 27,
    type: 'statement',
    visualStyle: 'animated',
    content: {
      body: 'Community is a verb.',
      highlight: 'An active decision rooted in love, accountability, and shared struggle.'
    },
    background: 'from-violet-950 via-purple-950 to-fuchsia-950'
  },
  {
    id: 28,
    type: 'beauty',
    visualStyle: 'photo',
    content: {
      title: 'Real joy. Real people.'
    },
    background: 'from-fuchsia-950 to-purple-950'
  },
  {
    id: 29,
    type: 'statement',
    visualStyle: 'animated',
    content: {
      title: 'From Institution to:',
      body: 'COMMUNITY',
      highlight: 'A network of Black queer men who know and support each other.'
    },
    background: 'from-pink-600 via-fuchsia-600 to-purple-600'
  }
]

// ========================================
// ACT 4: THE CORE (Cards 30-34 including Video 2)
// ========================================
const act4Cards: CardData[] = [
  {
    id: 30,
    type: 'statement',
    visualStyle: 'hyper-real',
    imageUrl: '/images/theory-of-change/card-30-isolation.png',
    content: {
      body: 'Second-wave sought Free Love.',
      highlight: 'We pursue Love to get us free.'
    },
    background: 'from-indigo-950 via-purple-950 to-fuchsia-950'
  },
  {
    id: 31,
    type: 'statement',
    visualStyle: 'hyper-real',
    imageUrl: '/images/theory-of-change/card-31-problem-is-us.png',
    content: {
      body: 'Our sexuality is not a choice.',
      highlight: 'Our community is.'
    },
    background: 'from-fuchsia-950 via-purple-950 to-violet-950'
  },
  {
    id: 32,
    type: 'beauty',
    visualStyle: 'hyper-real',
    imageUrl: '/images/theory-of-change/card-32-never-us.png',
    content: {
      title: 'Tenderness is a political act.'
    },
    background: 'from-violet-600 via-purple-600 to-indigo-600'
  },
  {
    id: 33,
    type: 'interactive',
    visualStyle: 'hyper-real',
    imageUrl: '/images/theory-of-change/card-33-show-up.png',
    content: {
      title: 'How do you show up for your people?',
      body: 'Choose your power'
    },
    background: 'from-purple-950 to-violet-950',
    interactive: {
      type: 'poll',
      data: {
        options: ['I bring food', 'I show up', 'I listen', 'I fight for them', 'I make them laugh', 'I remember']
      }
    }
  },
  {
    id: 34,
    type: 'video',
    visualStyle: 'animated',
    content: {
      title: 'Heroes'
    },
    background: 'from-violet-950 via-fuchsia-950 to-black',
    video: {
      title: 'Heroes',
      placeholder: 'X-Men 97 Animation Style - Coming Soon',
      duration: '60-90s',
      style: 'Team assembly energy, heroic poses, direct address to viewer'
    }
  }
]

// ========================================
// ACT 5: THE INVITATION (Cards 35-40)
// ========================================
const act5Cards: CardData[] = [
  {
    id: 35,
    type: 'statement',
    visualStyle: 'hyper-real',
    imageUrl: '/images/theory-of-change/card-35-structural-damage.png',
    content: {
      title: 'FREEDOM FROM',
      body: 'Collective power to resist and dismantle.'
    },
    background: 'from-indigo-950 to-purple-950'
  },
  {
    id: 36,
    type: 'statement',
    visualStyle: 'animated',
    content: {
      title: 'FREEDOM TO',
      body: 'Imagination. Creation. Something new taking root.'
    },
    background: 'from-purple-950 to-violet-950'
  },
  {
    id: 37,
    type: 'interactive',
    visualStyle: 'animated',
    content: {
      title: 'If we had everything we needed, what would you want us to build?',
      body: 'Share your vision'
    },
    background: 'from-violet-950 via-fuchsia-950 to-purple-950',
    interactive: {
      type: 'openresponse',
      data: {
        placeholder: 'I would build...'
      }
    }
  },
  {
    id: 38,
    type: 'statement',
    visualStyle: 'animated',
    content: {
      body: 'The damage is structural.',
      highlight: 'The repair is relational.'
    },
    background: 'from-purple-950 via-violet-950 to-indigo-950'
  },
  {
    id: 39,
    type: 'beauty',
    visualStyle: 'animated',
    content: {
      title: 'We can\'t do this alone. (That\'s literally the point.)'
    },
    background: 'from-fuchsia-600 via-pink-600 to-purple-600'
  },
  {
    id: 40,
    type: 'oomf',
    visualStyle: 'animated',
    content: {
      body: 'We\'re the heroes we\'ve been waiting for.',
      subtext: 'Now put yourself in the story.'
    },
    background: 'from-indigo-950 via-purple-950 to-black',
    oomf: {
      url: 'https://blkoutuk.github.io/OOMF_Interactive/',
      ctaText: 'PUT YOURSELF IN THE STORY →'
    }
  }
]

// ========================================
// SCROLL SNAP CARD COMPONENT
// ========================================
interface CardProps {
  card: CardData
  isActive: boolean
  onInteraction?: (cardId: number, response: any) => void
}

const Card: React.FC<CardProps> = ({ card, isActive, onInteraction }) => {
  const [revealed, setRevealed] = useState(false)
  const [pollResponse, setPollResponse] = useState<string | null>(null)

  const renderContent = () => {
    switch (card.type) {
      case 'statement':
        return (
          <div className="text-center max-w-4xl">
            {card.content.title && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="text-amber-400 text-sm md:text-base font-mono uppercase tracking-[0.3em] mb-8"
              >
                {card.content.title}
              </motion.p>
            )}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl lg:text-9xl font-black leading-tight mb-8 uppercase tracking-tight whitespace-pre-line"
              style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}
            >
              <span className="text-white">
                {card.content.body}
              </span>
            </motion.h1>
            {card.content.highlight && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl md:text-2xl text-purple-100 font-light max-w-2xl mx-auto"
              >
                {card.content.highlight}
              </motion.p>
            )}
          </div>
        )

      case 'text':
        return (
          <div className="text-center max-w-3xl">
            {card.content.quote && (
              <motion.blockquote
                initial={{ opacity: 0, y: 30 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-2xl md:text-4xl font-bold leading-tight text-purple-100 mb-4"
                style={{ fontFamily: "'Arial', sans-serif" }}
              >
                "{card.content.quote}"
              </motion.blockquote>
            )}
            {card.content.body && (
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: card.content.quote ? 0.3 : 0 }}
                className={`${card.content.quote ? 'text-lg md:text-xl text-purple-300 mb-8' : 'text-4xl md:text-6xl lg:text-8xl font-black leading-tight text-purple-50 uppercase tracking-tight'} whitespace-pre-line`}
                style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}
              >
                {card.content.body}
              </motion.p>
            )}
            {card.content.highlight && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: card.content.quote ? 0.5 : 0.3 }}
                className="text-3xl md:text-5xl font-black mt-8 text-white uppercase tracking-tight"
                style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}
              >
                {card.content.highlight}
              </motion.p>
            )}
          </div>
        )

      case 'beauty':
        return (
          <div className="text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isActive ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1.2 }}
              className="w-full aspect-video bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10 rounded-2xl flex items-center justify-center mb-8"
            >
              {card.visualStyle === 'photo' ? (
                <div className="text-purple-300 text-center p-8">
                  <p className="text-sm uppercase tracking-wider mb-2">Real Photography</p>
                  <p className="text-xs opacity-60">BLKOUT Community Moments</p>
                </div>
              ) : (
                <p className="text-6xl">🎉</p>
              )}
            </motion.div>
            {card.content.title && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-2xl md:text-3xl text-purple-100 font-bold"
                style={{ fontFamily: "'Arial', sans-serif" }}
              >
                {card.content.title}
              </motion.p>
            )}
          </div>
        )

      case 'interactive':
        if (card.interactive?.type === 'poll') {
          return (
            <div className="text-center max-w-2xl">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-black mb-4 text-purple-100 uppercase tracking-tight"
                style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}
              >
                {card.content.title}
              </motion.h2>
              {card.content.body && (
                <p className="text-lg text-purple-300 mb-8">{card.content.body}</p>
              )}
              <div className="grid grid-cols-2 gap-4">
                {card.interactive.data.options.map((option: string, idx: number) => (
                  <motion.button
                    key={option}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isActive ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                    onClick={() => {
                      setPollResponse(option)
                      onInteraction?.(card.id, option)
                    }}
                    className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
                      pollResponse === option
                        ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white'
                        : 'bg-purple-900/30 border border-purple-700/30 text-purple-100 hover:border-fuchsia-500/50'
                    }`}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </div>
          )
        }

        if (card.interactive?.type === 'reveal') {
          return (
            <div className="text-center max-w-3xl">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-black mb-8 text-purple-100 uppercase tracking-tight"
                style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}
              >
                {card.content.title}
              </motion.h2>

              {!revealed && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={isActive ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  onClick={() => setRevealed(true)}
                  className="px-12 py-4 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-bold text-lg rounded-lg hover:from-indigo-500 hover:to-fuchsia-500 transition-all"
                >
                  {card.content.body}
                </motion.button>
              )}

              <AnimatePresence>
                {revealed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="mt-8 p-8 bg-purple-900/30 border border-purple-700/30 rounded-lg"
                  >
                    <p className="text-2xl md:text-3xl text-purple-100 line-through opacity-40 mb-4">
                      {card.interactive.data.revealed}
                    </p>
                    <p className="text-lg text-amber-300 italic">
                      (But what if we've had it backwards?)
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        }

        if (card.interactive?.type === 'swipe') {
          const [swipeState, setSwipeState] = useState<'before' | 'after'>('before')
          return (
            <div className="text-center max-w-3xl">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-black mb-8 text-purple-100 uppercase tracking-tight"
                style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}
              >
                {card.content.title}
              </motion.h2>

              <div className="relative bg-purple-900/30 border border-purple-700/30 rounded-lg p-8 min-h-[300px] flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  {swipeState === 'before' ? (
                    <motion.div
                      key="before"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.5 }}
                      className="text-center"
                    >
                      <p className="text-3xl md:text-4xl font-bold mb-4 text-white">
                        {card.interactive.data.before.text}
                      </p>
                      <p className="text-lg md:text-xl text-purple-300">
                        {card.interactive.data.before.detail}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="after"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.5 }}
                      className="text-center"
                    >
                      <p className="text-3xl md:text-4xl font-bold mb-4 text-white">
                        {card.interactive.data.after.text}
                      </p>
                      <p className="text-lg md:text-xl text-purple-300">
                        {card.interactive.data.after.detail}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                onClick={() => {
                  setSwipeState(swipeState === 'before' ? 'after' : 'before')
                  onInteraction?.(card.id, swipeState === 'before' ? 'after' : 'before')
                }}
                className="mt-6 px-8 py-3 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-bold rounded-lg hover:from-indigo-500 hover:to-fuchsia-500 transition-all"
              >
                {swipeState === 'before' ? 'Swipe to reframe →' : '← Swipe back'}
              </motion.button>
            </div>
          )
        }

        if (card.interactive?.type === 'wordcloud') {
          const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
          return (
            <div className="text-center max-w-4xl">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-black mb-4 text-purple-100 uppercase tracking-tight"
                style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}
              >
                {card.content.title}
              </motion.h2>
              {card.content.body && (
                <p className="text-lg text-purple-300 mb-8">{card.content.body}</p>
              )}

              <div className="flex flex-wrap justify-center items-center gap-4 min-h-[300px] p-8 bg-purple-900/20 rounded-lg">
                {card.interactive.data.topics.map((topic: any, idx: number) => {
                  const sizeClasses = {
                    large: 'text-3xl md:text-5xl px-6 py-3',
                    medium: 'text-2xl md:text-3xl px-4 py-2',
                    small: 'text-xl md:text-2xl px-3 py-2'
                  }
                  return (
                    <motion.button
                      key={topic.word}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isActive ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.2 + idx * 0.05 }}
                      onClick={() => {
                        setSelectedTopic(topic.word)
                        onInteraction?.(card.id, topic.word)
                      }}
                      className={`${sizeClasses[topic.size as keyof typeof sizeClasses]} font-bold rounded-lg transition-all ${
                        selectedTopic === topic.word
                          ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white scale-110'
                          : 'bg-purple-900/30 text-purple-200 hover:bg-purple-800/40 hover:text-fuchsia-300'
                      }`}
                    >
                      {topic.word}
                    </motion.button>
                  )
                })}
              </div>

              {selectedTopic && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 text-lg text-amber-300 italic"
                >
                  Real conversations happening around "{selectedTopic}"
                </motion.p>
              )}
            </div>
          )
        }

        if (card.interactive?.type === 'map') {
          return (
            <div className="text-center max-w-5xl">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-black mb-4 text-purple-100 uppercase tracking-tight"
                style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}
              >
                {card.content.title}
              </motion.h2>
              {card.content.body && (
                <p className="text-lg text-purple-300 mb-8">{card.content.body}</p>
              )}

              <div className="relative aspect-video bg-gradient-to-br from-indigo-950/50 to-purple-950/50 rounded-2xl border border-purple-700/30 p-8 flex items-center justify-center">
                <div className="relative w-full h-full flex flex-col items-center justify-center space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl">
                    {card.interactive.data.locations.map((location: any, idx: number) => (
                      <motion.div
                        key={location.city}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isActive ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                        className="bg-purple-900/40 border border-purple-700/40 rounded-lg p-4 text-center hover:border-fuchsia-500/50 transition-all cursor-pointer"
                        onClick={() => onInteraction?.(card.id, location.city)}
                      >
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 mx-auto mb-2" />
                        <p className="text-lg font-bold text-purple-100">{location.city}</p>
                        <p className="text-sm text-purple-300">{location.count} members</p>
                      </motion.div>
                    ))}
                  </div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={isActive ? { opacity: 1 } : {}}
                    transition={{ delay: 1 }}
                    className="text-sm text-purple-400 italic mt-4"
                  >
                    Growing across the UK and beyond
                  </motion.p>
                </div>
              </div>
            </div>
          )
        }

        if (card.interactive?.type === 'openresponse') {
          const [response, setResponse] = useState('')
          const [submitted, setSubmitted] = useState(false)
          return (
            <div className="text-center max-w-3xl">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-5xl font-black mb-4 text-purple-100 uppercase tracking-tight"
                style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}
              >
                {card.content.title}
              </motion.h2>
              {card.content.body && (
                <p className="text-lg text-purple-300 mb-8">{card.content.body}</p>
              )}

              {!submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isActive ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder={card.interactive.data.placeholder}
                    className="w-full min-h-[200px] p-6 bg-purple-900/30 border border-purple-700/30 rounded-lg text-lg text-purple-100 placeholder-purple-500 focus:outline-none focus:border-fuchsia-500/50 resize-none"
                    style={{ fontFamily: "'Arial', sans-serif" }}
                  />
                  <button
                    onClick={() => {
                      if (response.trim()) {
                        setSubmitted(true)
                        onInteraction?.(card.id, response)
                      }
                    }}
                    disabled={!response.trim()}
                    className="mt-6 px-12 py-4 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-bold text-lg rounded-lg hover:from-indigo-500 hover:to-fuchsia-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Share Your Vision
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="p-8 bg-purple-900/30 border border-purple-700/30 rounded-lg"
                >
                  <p className="text-2xl text-fuchsia-400 mb-4">Thank you for sharing.</p>
                  <p className="text-lg text-purple-300 italic">
                    Every vision matters. Every voice counts.
                  </p>
                </motion.div>
              )}
            </div>
          )
        }

        return null

      case 'cascade':
        return (
          <div className="text-center max-w-3xl">
            {card.content.title && (
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-black mb-12 text-purple-100 uppercase tracking-tight"
                style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}
              >
                {card.content.title}
              </motion.h2>
            )}
            <div className="space-y-6">
              {card.interactive?.data.lines.map((line: string, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isActive ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.3 + idx * 0.4 }}
                  className="text-3xl md:text-5xl font-black text-purple-100 uppercase tracking-tight"
                  style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}
                >
                  {line}
                  {idx < card.interactive.data.lines.length - 1 && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={isActive ? { scaleY: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.3 + idx * 0.4 + 0.6 }}
                      className="w-px h-12 bg-gradient-to-b from-purple-500 to-transparent mx-auto mt-6"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )

      case 'video':
        return (
          <div className="text-center max-w-5xl w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isActive ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1 }}
              className="aspect-video bg-gradient-to-br from-purple-950/50 to-indigo-950/50 rounded-2xl border border-purple-700/30 flex flex-col items-center justify-center p-12"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-600 flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                {card.video?.title}
              </h3>
              <p className="text-lg text-purple-300 mb-2">{card.video?.placeholder}</p>
              <p className="text-sm text-purple-500 font-mono mb-4">{card.video?.duration}</p>
              {card.video?.style && (
                <p className="text-xs text-purple-600 max-w-md">{card.video.style}</p>
              )}
            </motion.div>
          </div>
        )

      case 'oomf':
        // Cinematic slideshow of Liberation Collective
        const collectiveImages = [
          'tumblr_0251cea1cc5fd09e2b0c41ffc9c1831e_237f2e44_1280.jpg',
          'tumblr_304dfac733eaf9b218d60719f1bfa061_71a54d5c_400.webp',
          'tumblr_7ed756b88a0eb5851bfca7cfa2f3aca9_8769f3f0_1280.jpg',
          'tumblr_8d6d12538284c9062fca59225b80b35f_2b2dc944_500.webp',
          'tumblr_99a57659866ec6d169e85dcbc9b41b36_e0aee5d9_1280.jpg',
          'tumblr_9ccd25b3f9683386cc83b53fc27d1a39_a09d5048_1280.jpg',
          'tumblr_9ddd3557231ccfdaae353d5568bf0c80_ee5ba783_500.jpg',
          'tumblr_a8ff21cfe9302e86a3d03892c864c5a5_391b148a_1280.jpg',
          'tumblr_b0d9293f446c8df8164cbce9ac26c3fa_b7a851c9_500.webp',
          'tumblr_b36867ede4560f83007b9b3947fca29e_98a985b6_1280.jpg',
          'tumblr_b565ed3f0ba2877ad21be3e6609cdb45_94de8fbb_540.webp',
          'tumblr_be5bf77c6a920a08963e41d75c96906c_063569bf_540.webp',
          'tumblr_c0da8943ac03a8ebb28404880c7f5a45_5dff8e40_1280.png',
          'tumblr_e75dcac34c703b9670a50925bea39c41_26e39db8_1280.jpg',
          'tumblr_fdf8dcd9bc9f5098aff6bcdf07243f0e_867b1e45_1280.jpg',
          'tumblr_nc0ovmPzrg1rm4wgqo1_640.jpg',
          'tumblr_ndgcxiCqwU1sg2ik8o1_500.webp',
          'tumblr_pvb0gnG0bi1rchkzlo2_500.webp'
        ]

        const [currentImageIndex, setCurrentImageIndex] = useState(0)

        // Auto-advance slideshow when card is active
        useEffect(() => {
          if (!isActive) return

          const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % collectiveImages.length)
          }, 2500) // Change image every 2.5 seconds

          return () => clearInterval(interval)
        }, [isActive, collectiveImages.length])

        return (
          <div className="text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isActive ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1.2 }}
              className="mb-12"
            >
              <div className="w-full aspect-video bg-black rounded-2xl border-2 border-purple-700/50 overflow-hidden relative mb-8">
                {/* Cinematic slideshow */}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={`/images/collective/${collectiveImages[currentImageIndex]}`}
                    alt="Black Queer Men's Liberation Collective"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Cinematic overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

                {/* "The Collective" badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isActive ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-6 left-6 bg-purple-950/90 backdrop-blur-sm border border-purple-700/50 rounded-lg px-4 py-2"
                >
                  <p className="text-sm text-purple-300 uppercase tracking-wider font-bold">Come to life</p>
                  <p className="text-xs text-purple-500">The Liberation Collective</p>
                </motion.div>

                {/* Progress indicator */}
                <div className="absolute bottom-6 right-6 flex gap-1">
                  {collectiveImages.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        idx === currentImageIndex
                          ? 'w-8 bg-fuchsia-400'
                          : 'w-1 bg-purple-700/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-6xl md:text-8xl lg:text-9xl font-black leading-tight mb-8 uppercase tracking-tight"
              style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}
            >
              <span className="text-white">{card.content.body}</span>
            </motion.h1>

            {card.content.subtext && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-2xl md:text-3xl text-amber-400 mb-12 font-bold"
              >
                {card.content.subtext}
              </motion.p>
            )}

            <motion.a
              href={card.oomf?.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-black text-xl rounded-lg hover:from-fuchsia-500 hover:to-pink-500 transition-all transform hover:scale-105 uppercase tracking-tight"
              style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}
            >
              {card.oomf?.ctaText}
              <ExternalLink className="w-6 h-6" />
            </motion.a>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isActive ? { opacity: 1 } : {}}
              transition={{ delay: 1 }}
              className="mt-8 text-sm text-purple-500 italic"
            >
              Create your own X-Men 97 style hero panel
            </motion.p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={`h-screen snap-start flex items-center justify-center px-6 md:px-12 relative overflow-hidden`}>
      {/* Background Image (if hyper-real card) */}
      {card.imageUrl && (
        <div className="absolute inset-0 z-0">
          <img
            src={card.imageUrl}
            alt=""
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
        </div>
      )}

      {/* Fallback gradient background */}
      {!card.imageUrl && (
        <div className={`absolute inset-0 z-0 bg-gradient-to-br ${card.background}`} />
      )}

      {/* Content */}
      <div className="relative z-10">
        {renderContent()}
      </div>
    </div>
  )
}

// ========================================
// PROGRESS DOTS NAVIGATION
// ========================================
interface ProgressDotsProps {
  total: number
  current: number
  onDotClick: (index: number) => void
}

const ProgressDots: React.FC<ProgressDotsProps> = ({ total, current, onDotClick }) => {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex gap-2 bg-purple-950/80 backdrop-blur-sm px-4 py-2 rounded-full">
      {Array.from({ length: total }).map((_, idx) => (
        <button
          key={idx}
          onClick={() => onDotClick(idx)}
          className={`w-2 h-2 rounded-full transition-all ${
            idx === current
              ? 'bg-fuchsia-400 w-8'
              : 'bg-purple-400/30 hover:bg-purple-400/50'
          }`}
          aria-label={`Go to card ${idx + 1}`}
        />
      ))}
    </div>
  )
}

// ========================================
// SHARE BUTTON
// ========================================
const ShareButton: React.FC = () => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BLKOUT: The Movement',
          text: 'The damage is structural. The repair is relational.',
          url: window.location.href
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      onClick={handleShare}
      className="fixed top-24 right-8 z-50 w-12 h-12 bg-purple-900/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-purple-800/80 transition-colors"
      aria-label="Share this story"
    >
      <Share2 className="w-5 h-5 text-fuchsia-400" />
    </motion.button>
  )
}

// ========================================
// MAIN COMPONENT
// ========================================
export default function TheoryOfChange() {
  const [currentCard, setCurrentCard] = useState(0)
  const [interactions, setInteractions] = useState<Record<number, any>>({})

  // All cards (Complete 40-card Theory of Change v2.0 experience with disclaimer)
  const allCards = [disclaimerCard, ...act1Cards, ...act2Cards, ...act3Cards, ...act4Cards, ...act5Cards]

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const cardHeight = window.innerHeight
      const newCardIndex = Math.round(scrollPosition / cardHeight)
      if (newCardIndex !== currentCard && newCardIndex < allCards.length) {
        setCurrentCard(newCardIndex)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentCard, allCards.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && currentCard < allCards.length - 1) {
        const nextCard = document.getElementById(`card-${currentCard + 1}`)
        nextCard?.scrollIntoView({ behavior: 'smooth' })
      } else if (e.key === 'ArrowUp' && currentCard > 0) {
        const prevCard = document.getElementById(`card-${currentCard - 1}`)
        prevCard?.scrollIntoView({ behavior: 'smooth' })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentCard, allCards.length])

  const handleInteraction = (cardId: number, response: any) => {
    setInteractions(prev => ({ ...prev, [cardId]: response }))
    // TODO: Send to analytics - track 8 interactive moments + OOMF conversion
    console.log('Interaction:', { cardId, response, timestamp: new Date().toISOString() })
  }

  const handleDotClick = (index: number) => {
    const card = document.getElementById(`card-${index}`)
    card?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-black">
      <PrimaryNavigationEnhanced />

      {/* Scroll Container */}
      <div className="scroll-smooth snap-y snap-mandatory h-screen overflow-y-scroll">
        {allCards.map((card, index) => (
          <div key={card.id} id={`card-${index}`}>
            <Card
              card={card}
              isActive={currentCard === index}
              onInteraction={handleInteraction}
            />
          </div>
        ))}
      </div>

      {/* Progress Dots */}
      <ProgressDots
        total={allCards.length}
        current={currentCard}
        onDotClick={handleDotClick}
      />

      {/* Share Button */}
      <ShareButton />

      {/* Scroll Hint (first card only) */}
      {currentCard === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-fuchsia-300"
        >
          <span className="text-sm font-mono uppercase tracking-wider mb-2">Scroll</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
