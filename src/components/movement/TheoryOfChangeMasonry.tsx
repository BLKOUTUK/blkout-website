/**
 * Theory of Change v2.0 - Masonry Grid Layout
 * Inspired by Grindr Unwrapped and MasonryScrollytelling
 * Multi-column responsive grid with hero video breaks
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, ExternalLink } from 'lucide-react';

interface Card {
  id: number;
  type: 'statement' | 'interactive' | 'beauty' | 'disclaimer';
  size: 'small' | 'medium' | 'large' | 'hero';
  imageUrl?: string;
  videoUrl?: string;      // For inline video cards
  bgGradient: string;
  content: {
    title?: string;         // Primary heading (largest)
    heading2?: string;      // Secondary heading
    subtitle?: string;      // Supporting text above main
    body?: string;          // Main text
    highlight?: string;     // Emphasis text below main
  };
  interactive?: {
    type: 'poll' | 'reveal' | 'wordcloud';
    data?: any;
  };
  cta?: {
    text: string;
    link: string;
    color?: 'amber' | 'fuchsia';
  };
}

// Masonry size classes
const sizeClasses = {
  small: 'col-span-1 row-span-1',
  medium: 'col-span-1 row-span-2',
  large: 'col-span-2 row-span-2',
  hero: 'col-span-2 row-span-3 md:col-span-3 lg:col-span-4'
};

const heightClasses = {
  small: 'min-h-[250px]',
  medium: 'min-h-[400px]',
  large: 'min-h-[500px]',
  hero: 'min-h-[600px]'
};

// Card component for masonry grid
const MasonryCard: React.FC<{ card: Card; index: number }> = ({ card, index }) => {
  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl group ${sizeClasses[card.size]} ${heightClasses[card.size]}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (index % 12) * 0.05 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Background: Image, Video, or Gradient */}
      {card.videoUrl ? (
        <div className="absolute inset-0">
          <video
            src={card.videoUrl}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
        </div>
      ) : card.imageUrl ? (
        <div className="absolute inset-0">
          <img
            src={card.imageUrl}
            alt=""
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
        </div>
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient}`} />
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8">
        {/* Subtitle (small, uppercase, accent color) */}
        {card.content.subtitle && (
          <motion.p className="text-amber-400 text-sm md:text-base lg:text-lg font-mono uppercase tracking-widest mb-2">
            {card.content.subtitle}
          </motion.p>
        )}

        {/* Title (primary heading - largest) */}
        {card.content.title && (
          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-tight mb-3"
            style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}
          >
            {card.content.title}
          </motion.h1>
        )}

        {/* Heading2 (secondary heading) */}
        {card.content.heading2 && (
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-purple-100 uppercase tracking-tight leading-tight mb-3"
            style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}
          >
            {card.content.heading2}
          </motion.h2>
        )}

        {/* Body (main text) */}
        {card.content.body && (
          <motion.p
            className="text-xl md:text-2xl lg:text-3xl font-black text-white uppercase tracking-tight leading-tight mb-4"
            style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}
          >
            {card.content.body}
          </motion.p>
        )}

        {/* Highlight (emphasis text below) */}
        {card.content.highlight && (
          <p className="text-lg md:text-xl lg:text-2xl text-purple-200 font-light leading-relaxed italic">
            {card.content.highlight}
          </p>
        )}

        {/* Interactive elements */}
        {card.interactive?.type === 'poll' && (
          <div className="mt-4 space-y-2">
            {card.interactive.data.options.map((option: string) => (
              <button
                key={option}
                onClick={(e) => { e.stopPropagation(); setSelected(option); }}
                className={`w-full px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  selected === option
                    ? 'bg-fuchsia-600 text-white'
                    : 'bg-purple-900/50 text-purple-100 hover:bg-purple-800/50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {card.interactive?.type === 'reveal' && (
          <button
            onClick={(e) => { e.stopPropagation(); setRevealed(!revealed); }}
            className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-bold transition-all"
          >
            {revealed ? card.interactive.data.revealed : 'Click to reveal →'}
          </button>
        )}

        {/* CTA Button */}
        {card.cta && (
          <a
            href={card.cta.link}
            onClick={(e) => e.stopPropagation()}
            className={`mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 ${
              card.cta.color === 'fuchsia'
                ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white'
                : 'bg-gradient-to-r from-amber-600 to-amber-500 text-black'
            }`}
          >
            {card.cta.text} →
          </a>
        )}
      </div>
    </motion.div>
  );
};

// Hero Video Break component
const HeroVideoBreak: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-black my-16">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-indigo-950 to-black opacity-50" />
      <div className="relative z-10 text-center px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-6xl md:text-8xl font-black text-white uppercase mb-6"
          style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl text-amber-400 font-bold"
        >
          {subtitle}
        </motion.p>
        {/* Video placeholder - will be replaced with actual video */}
        <div className="mt-12 w-full max-w-4xl mx-auto aspect-video bg-purple-950/30 rounded-2xl border border-purple-700/50 flex items-center justify-center">
          <p className="text-purple-400 text-sm">Video Coming Soon</p>
        </div>
      </div>
    </section>
  );
};

export default function TheoryOfChangeMasonry() {
  // Elegant disclaimer - non-obstructive
  const DisclaimerNote = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 max-w-2xl"
    >
      <div className="bg-purple-950/90 backdrop-blur-sm border border-purple-700/50 rounded-full px-6 py-3 shadow-lg">
        <p className="text-xs text-purple-300 text-center">
          <span className="font-semibold">Imagery:</span> AI-generated (Wan 2.6, Gemini 3) •
          <span className="text-purple-400"> Real photos in select cards</span>
        </p>
      </div>
    </motion.div>
  );

  // ACT 1: Recognition (Cards 1-10)
  const act1Cards: Card[] = [
    {
      id: 1,
      type: 'statement',
      size: 'hero',
      imageUrl: '/images/theory-of-change/card-01-isolation.png',
      bgGradient: 'from-indigo-950 to-purple-950',
      content: {
        subtitle: 'THE RECOGNITION',
        body: 'You ever been in a room full of us',
        highlight: 'and still felt alone?'
      }
    },
    {
      id: 2,
      type: 'statement',
      size: 'large',
      imageUrl: '/images/theory-of-change/card-02-recognition.png',
      bgGradient: 'from-purple-950 to-violet-950',
      content: {
        subtitle: 'yeah',
        title: 'same'
      }
    },
    {
      id: 2.5,
      type: 'beauty',
      size: 'small',
      imageUrl: '/images/theory-backgrounds-resized/spiderman-meme.png',
      bgGradient: 'from-purple-900 to-indigo-900',
      content: {}
    },
    {
      id: 2.75,
      type: 'statement',
      size: 'hero',
      bgGradient: 'from-purple-950 via-violet-950 to-indigo-950',
      content: {
        subtitle: 'THE DESIGN',
        title: 'Societies invest in passing on knowledge between generations.',
        heading2: 'They design systems around it.',
        body: 'Schools, churches, media, museums, families, taxes, police—all actively work to teach young people what it is to be a "good man". Many of the same institutions have actively worked to deny young people knowledge of what it is to be a queer man.',
        highlight: 'We are left to our own devices.\n\nSmartphones mostly.'
      }
    },
    {
      id: 3,
      type: 'statement',
      size: 'large',
      imageUrl: '/images/theory-of-change/card-03-wondering.png',
      bgGradient: 'from-fuchsia-950 to-purple-950',
      content: {
        body: 'You ever wondered who you\'d be if you actually knew us?'
      }
    },
    {
      id: 4,
      type: 'interactive',
      size: 'large',
      imageUrl: '/images/theory-of-change/card-04-poll.png',
      bgGradient: 'from-indigo-950 to-purple-950',
      content: {
        title: 'How many Black queer men',
        heading2: 'could you call on in a crisis?',
        body: 'When you\'re falling apart and need someone who gets it.',
        highlight: '(Note: a booty call, however urgent, is not a crisis.)'
      },
      interactive: {
        type: 'poll',
        data: { options: ['0', '1-2', '3-5', 'Squad deep'] }
      }
    },
    {
      id: 5,
      type: 'statement',
      size: 'large',
      imageUrl: '/images/theory-of-change/card-05-one-or-fewer.png',
      bgGradient: 'from-purple-950 to-fuchsia-950',
      content: {
        title: 'Ever wondered what difference it would make',
        body: 'if we knew each other better?'
      }
    },
    {
      id: 6,
      type: 'statement',
      size: 'large',
      imageUrl: '/images/theory-of-change/card-06-proximity.png',
      bgGradient: 'from-violet-950 to-purple-950',
      content: {
        title: 'That\'s not community.',
        body: 'That\'s proximity.',
        highlight: '(And proximity without knowing is just... geography.)'
      }
    },
    {
      id: 7,
      type: 'beauty',
      size: 'large',
      imageUrl: '/images/theory-of-change/card-07-survive-alone.png',
      bgGradient: 'from-fuchsia-600 to-purple-600',
      content: {
        title: 'We\'ve learned to survive alone together.'
      },
      cta: { text: 'In The Picture: Loneliness Report', link: 'https://blkoutuk.com/in-the-picture', color: 'amber' }
    },
    {
      id: 7.5,
      type: 'statement',
      size: 'large',
      imageUrl: '/images/theory-of-change/survival is a good start.png',
      bgGradient: 'from-violet-950 to-purple-950',
      content: {
        title: 'Survival is a good start.',
        body: 'If we want to thrive',
        highlight: '"alone together" is not enough.'
      }
    },
    {
      id: 8,
      type: 'interactive',
      size: 'large',
      imageUrl: '/images/theory-of-change/card-08-old-story.png',
      bgGradient: 'from-indigo-950 to-purple-950',
      content: {
        title: 'What we\'ve been told'
      },
      interactive: {
        type: 'reveal',
        data: { revealed: 'Love yourself first. Know yourself. Then connect.' }
      }
    },
    {
      id: 8.5,
      type: 'beauty',
      size: 'large',
      imageUrl: '/images/theory-of-change/RupaulAmen.gif',
      bgGradient: 'from-fuchsia-600 to-pink-600',
      content: {}
    },
    {
      id: 8.75,
      type: 'statement',
      size: 'medium',
      bgGradient: 'from-purple-950 to-violet-950',
      content: {
        title: 'Hold on a minute'
      }
    },
    {
      id: 9,
      type: 'statement',
      size: 'hero',
      imageUrl: '/images/theory-of-change/card-09-inversion.png',
      bgGradient: 'from-purple-950 to-fuchsia-950',
      content: {
        subtitle: 'you\'ve missed a step',
        title: 'Each others missing link',
        body: 'Loving ourselves requires both personal and collective growth. Loving who we are requires empathy and care.',
        highlight: 'Community enables love'
      }
    },
    {
      id: 10,
      type: 'statement',
      size: 'large',
      imageUrl: '/images/theory-of-change/card-10-backwards.png',
      bgGradient: 'from-fuchsia-950 to-violet-950',
      content: {
        title: 'Choose freedom'
      },
      cta: { text: 'Join our next gathering', link: 'https://events.blkoutuk.cloud', color: 'amber' }
    }
  ];

  // ACT 2: The Problem (Cards 11-17)
  const act2Cards: Card[] = [
    { id: 11, type: 'statement', size: 'large', imageUrl: '/images/theory-of-change/card-11-geography.png', bgGradient: 'from-indigo-950 to-purple-950', content: { body: 'Racism and patriarchy don\'t just harm us as individuals,', highlight: 'they stop us from healing by cutting us off from each other' }},
    { id: 12, type: 'statement', size: 'large', imageUrl: '/images/theory-of-change/card-12-cascade.png', bgGradient: 'from-purple-950 to-violet-950', content: { title: 'Without each other:', body: 'We can\'t know ourselves' }},
    { id: 13, type: 'statement', size: 'large', imageUrl: '/images/theory-of-change/card-13-app.png', bgGradient: 'from-violet-950 to-purple-950', content: { title: 'No face, no case, no intimacy', body: 'Success on dating apps means sharing as little of yourself as possible' }},
    { id: 14, type: 'statement', size: 'hero', imageUrl: '/images/theory-of-change/card-14-club.png', bgGradient: 'from-purple-950 to-indigo-950', content: { body: 'You can\'t know yourself in isolation.', highlight: 'The self is relational.' }},
    { id: 15, type: 'statement', size: 'large', imageUrl: '/images/theory-of-change/card-15-group-chat.png', bgGradient: 'from-indigo-600 to-purple-600', content: { title: 'We come from somewhere.', body: 'Black queer elders existed. Thrived. Built community.', highlight: 'The systems that severed us also erased them from our history.' }},
    { id: 16, type: 'statement', size: 'large', imageUrl: '/images/theory-of-change/card-16-swipe.png', bgGradient: 'from-violet-950 to-purple-950', content: { body: 'We are scattered across cities, scrolling from behind faceless profiles, lurking in the GC.', highlight: 'Not being able to find each other makes both of us lost' }},
    { id: 17, type: 'statement', size: 'hero', imageUrl: '/images/theory-of-change/card-17-dont-know.png', bgGradient: 'from-fuchsia-950 to-purple-950', content: { title: 'Our heterogeneity is a power, not a problem.', body: 'It is richness we can learn to treasure.', highlight: 'Solidarity is a habit, it takes practice' }, cta: { text: '300+ articles by us, for us', link: '/stories', color: 'amber' }}
  ];

  // ACT 3: What We're Building (Cards 19-26, 28)
  const act3Cards: Card[] = [
    { id: 19, type: 'statement', size: 'hero', imageUrl: '/images/theory-of-change/card-25-infrastructure.png', bgGradient: 'from-purple-950 to-indigo-950', content: { title: 'So we\'re building:', body: 'Space to be' }},
    { id: 21, type: 'statement', size: 'large', imageUrl: '/images/theory-of-change/card-21-gatherings.png', bgGradient: 'from-fuchsia-600 to-purple-600', content: { title: 'A lively calendar of social events', body: 'Real conversations. Shared experiences.' }, cta: { text: 'See what\'s happening', link: 'https://events.blkoutuk.cloud', color: 'amber' }},
    { id: 22, type: 'interactive', size: 'large', imageUrl: '/images/theory-of-change/card-22-wordcloud.png', bgGradient: 'from-indigo-950 to-purple-950', content: { title: 'What comes up when we talk:' }, interactive: { type: 'wordcloud', data: { topics: ['Family', 'Sex', 'Money', 'Health', 'Faith', 'Fear', 'Joy', 'Aging', 'Love', 'Loneliness', 'Dreams', 'Rage', 'Healing'] }}},
    { id: 23, type: 'statement', size: 'large', imageUrl: '/images/theory-of-change/card-23-connection.png', bgGradient: 'from-purple-950 to-violet-950', content: { title: 'Not Networking', body: 'No transaction required.', highlight: 'Connection' }},
    { id: 24, type: 'statement', size: 'large', imageUrl: '/images/theory-of-change/card-24-articles.png', bgGradient: 'from-violet-950 to-purple-950', content: { title: 'Liberation technology', body: 'Our values integral to the code', highlight: 'By us, for us' }, cta: { text: 'Explore our stories', link: '/stories', color: 'amber' }},
    { id: 26, type: 'statement', size: 'large', imageUrl: '/images/theory-of-change/card-26-map.png', bgGradient: 'from-purple-950 to-indigo-950', content: { title: 'From London to Bristol to Manchester', body: 'Finding each other' }, cta: { text: 'Connect locally', link: 'https://events.blkoutuk.cloud', color: 'amber' }},
    { id: 28, type: 'statement', size: 'large', imageUrl: '/images/theory-of-change/card-28-digital-human.png', bgGradient: 'from-fuchsia-950 to-purple-950', content: { body: 'Tech built by us.', highlight: 'Owned by us.' }, cta: { text: 'Meet IVOR', link: 'https://ivor.blkoutuk.cloud', color: 'amber' }}
  ];

  // ACT 4: The Core (Cards 30-33)
  const act4Cards: Card[] = [
    { id: 30, type: 'statement', size: 'large', imageUrl: '/images/theory-of-change/card-30-isolation.png', bgGradient: 'from-indigo-950 to-purple-950', content: { body: '1970s 2nd Wave Queer rights activism sought \'free love\'', highlight: 'Today, we seek love to set us free.' }},
    { id: 31, type: 'statement', size: 'large', imageUrl: '/images/theory-of-change/card-31-problem-is-us.png', bgGradient: 'from-fuchsia-950 to-purple-950', content: { body: 'Our sexuality is not a choice', highlight: 'Commitment to community is' }},
    { id: 32, type: 'beauty', size: 'large', imageUrl: '/images/theory-of-change/card-32-never-us.png', bgGradient: 'from-violet-600 to-purple-600', content: { title: 'Tenderness is a political act', body: 'Black queer joy is revolutionary' }, cta: { text: 'How we\'re different', link: '/governance', color: 'amber' }},
    { id: 32.3, type: 'beauty', size: 'large', videoUrl: '/videos/baldwinscroll.mp4', bgGradient: 'from-purple-950 to-indigo-950', content: {} },
    { id: 32.5, type: 'beauty', size: 'large', videoUrl: '/videos/Making Space For What.mp4', bgGradient: 'from-purple-950 to-indigo-950', content: {} },
    { id: 33, type: 'interactive', size: 'hero', imageUrl: '/images/theory-of-change/card-33-show-up.png', bgGradient: 'from-purple-950 to-violet-950', content: { title: 'How do you show up?', body: 'Choose your power' }, interactive: { type: 'poll', data: { options: ['I bring food', 'I show up', 'I listen', 'I fight', 'I laugh', 'I remember'] }}}
  ];

  // ACT 5: The Invitation (Cards 35-38)
  const act5Cards: Card[] = [
    { id: 35, type: 'statement', size: 'hero', imageUrl: '/images/theory-of-change/card-35-structural-damage.png', bgGradient: 'from-indigo-950 to-purple-950', content: { subtitle: 'Liberation Is', title: 'Freedom from...', body: 'Ending harm, using our power to resist and dismantle injustice' }},
    { id: 36, type: 'statement', size: 'large', imageUrl: '/images/theory-of-change/card-36-relational-repair.png', bgGradient: 'from-purple-950 to-violet-950', content: { subtitle: 'Liberation Is', title: 'Freedom to...', body: 'Imagine better, create the new' }},
    { id: 37, type: 'statement', size: 'hero', imageUrl: '/images/theory-of-change/card-37-liberation.png', bgGradient: 'from-violet-950 to-purple-950', content: { title: 'What does liberation look like?', body: 'Your vision matters.' }, cta: { text: 'Get the newsletter', link: 'https://crm.blkoutuk.cloud/api/community/join', color: 'amber' }},
    { id: 38, type: 'statement', size: 'hero', imageUrl: '/images/theory-of-change/card-38-damage-repair.png', bgGradient: 'from-purple-950 to-indigo-950', content: { subtitle: 'THE THESIS', title: 'The damage is structural.', body: 'The repair is relational.', highlight: 'This is the work.' }, cta: { text: 'Explore the platform', link: '/platform', color: 'amber' }}
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 z-50" />

      {/* Ticker Header */}
      <div className="fixed top-1 left-0 right-0 z-40 overflow-hidden bg-black/80 backdrop-blur-sm">
        <motion.div
          className="flex whitespace-nowrap py-2"
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-xs font-mono uppercase tracking-widest text-gray-400 mx-8">
              LIBERATION • COMMUNITY • POWER • HEALING • CONNECTION • COLLECTIVE •
            </span>
          ))}
        </motion.div>
      </div>

      {/* Hero Introduction */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Custom Hero Design */}
        <div className="absolute inset-0">
          <img
            src="/images/theory-of-change/WHY BLKOUT HERO.png"
            alt="Why BLKOUT Matters"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Scroll prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10"
        >
          <p className="text-white text-sm animate-pulse">
            Scroll to begin ↓
          </p>
        </motion.div>
      </section>

      {/* Elegant Disclaimer - Bottom overlay */}
      <DisclaimerNote />

      {/* Main Content */}
      <main className="pt-0">
        {/* ACT 1: Recognition - Masonry Grid (Cards 1-7) */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px]">
            {act1Cards.filter(c => c.id <= 7).map((card, i) => (
              <MasonryCard key={card.id} card={card} index={i} />
            ))}
          </div>
        </section>

        {/* LORDE VIDEO BREAK: Transition from Survival to Thriving */}
        <section className="relative w-full flex items-center justify-center bg-black my-8 py-16">
          <div className="w-full max-w-3xl px-4">
            <video
              src="/videos/Lordescroll.mp4"
              className="w-full rounded-2xl"
              autoPlay
              muted
              loop
              playsInline
              controls
            />
          </div>
        </section>

        {/* Continue Act 1 (Cards 7.5-10) */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px]">
            {act1Cards.filter(c => c.id > 7).map((card, i) => (
              <MasonryCard key={card.id} card={card} index={i} />
            ))}
          </div>
        </section>

        {/* VIDEO BREAK 1: We Don't Know Each Other (Yet) */}
        <HeroVideoBreak
          title="We Don't Know Each Other"
          subtitle="(Yet)"
        />

        {/* ACT 2: The Problem - Masonry Grid */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px]">
            {act2Cards.map((card, i) => (
              <MasonryCard key={card.id} card={card} index={i} />
            ))}
          </div>
        </section>

        {/* VIDEO BREAK 2: Heroes */}
        <HeroVideoBreak
          title="Heroes"
          subtitle="The team assembles"
        />

        {/* ACT 3: What We're Building - Masonry Grid */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px]">
            {act3Cards.map((card, i) => (
              <MasonryCard key={card.id} card={card} index={i} />
            ))}
          </div>
        </section>

        {/* ACT 4: The Core - Masonry Grid */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px]">
            {act4Cards.map((card, i) => (
              <MasonryCard key={card.id} card={card} index={i} />
            ))}
          </div>
        </section>

        {/* ACT 5: The Invitation - Masonry Grid */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px]">
            {act5Cards.map((card, i) => (
              <MasonryCard key={card.id} card={card} index={i} />
            ))}
          </div>
        </section>

        {/* Final CTA: OOMF Interactive */}
        <section className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-black">
          <div className="text-center px-4 max-w-4xl">
            <h2 className="text-6xl md:text-8xl font-black text-white uppercase mb-6" style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}>
              We're the heroes we've been waiting for
            </h2>
            <p className="text-2xl md:text-3xl text-amber-400 font-bold mb-12">
              Now put yourself in the story
            </p>
            <a
              href="https://blkoutuk.github.io/OOMF_Interactive/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-black text-xl rounded-lg hover:from-fuchsia-500 hover:to-pink-500 transition-all transform hover:scale-105 uppercase"
              style={{ fontFamily: "'Arial Black', 'Arial', sans-serif" }}
            >
              Create Your Hero Panel →
              <ExternalLink className="w-6 h-6" />
            </a>
          </div>
        </section>

        {/* Share Button */}
        <button
          className="fixed top-20 right-8 z-50 w-12 h-12 bg-purple-900/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-purple-800/80 transition-colors"
        >
          <Share2 className="w-5 h-5 text-white" />
        </button>
      </main>
    </div>
  );
}
