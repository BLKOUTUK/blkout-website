'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen, Users, Target, Heart, Zap, Shield,
  ExternalLink, ArrowRight, Download, FileText,
  Calendar, Mail, Handshake, Sparkles, Globe,
  ChevronDown, CheckCircle, Award
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PrimaryNavigationEnhanced from '../layout/PrimaryNavigationEnhanced'
import PlatformFooter from '../layout/PlatformFooter'

// ========================================
// MOVEMENT PAGE - BLKOUT DESIGN VOICE EXEMPLAR
// ========================================
// This page serves as the canonical reference for
// "recognizably BLKOUT at a glance" aesthetic.
//
// Brand Colors (CORRECT HARMONIOUS PALETTE):
// PRIMARY: Purple family spectrum (indigo → purple → violet → fuchsia → pink)
// - Indigo (cool purple): indigo-*
// - Purple (core brand): purple-*
// - Violet (warm purple): violet-*
// - Fuchsia (purple-pink): fuchsia-*
// - Pink (electric pink): pink-*
//
// ACCENTS: Gold, Teal, Emerald green
// - Gold: amber-*
// - Teal: teal-*
// - Emerald: emerald-*
//
// Voice: IVOR (sophisticated wit + Black British warmth)
// Typography: font-black headings, font-light body
// Content: Values-led (not tech-led)
// CTAs: Specific actions with destinations
// ========================================

interface Principle {
  id: string
  title: string
  description: string
  icon: any
  gradient: string
}

interface Resource {
  id: string
  title: string
  description: string
  type: 'guide' | 'report' | 'framework' | 'template'
  category: string
  url?: string
}

interface Event {
  id: string
  title: string
  date: string
  time: string
  description: string
  url: string
  isNew?: boolean
}

interface Partner {
  id: string
  name: string
  type: 'cooperative' | 'cultural' | 'funding' | 'technology'
  description: string
  url?: string
}

// Four Principles - Community Control, Economic Justice, Liberation Focus, Accessibility
// Using purple family spectrum (indigo → electric pink) with gold/teal/emerald accents
const movementPrinciples: Principle[] = [
  {
    id: 'community-control',
    title: 'COMMUNITY CONTROL',
    description: 'Democratic governance with community-owned data, full export capabilities, and transparent decision-making. One member, one vote.',
    icon: Users,
    gradient: 'from-indigo-500 via-purple-500 to-violet-500' // Cool to warm purple spectrum
  },
  {
    id: 'economic-justice',
    title: 'ECONOMIC JUSTICE',
    description: '75% creator revenue share (hardcoded). Cooperative ownership through Community Benefit Society. Fair distribution of platform value.',
    icon: Heart,
    gradient: 'from-purple-500 via-fuchsia-500 to-pink-500' // Purple to electric pink with warmth
  },
  {
    id: 'liberation-focus',
    title: 'LIBERATION FOCUS',
    description: 'All content and technology serves Black queer liberation. Community building through cooperative ownership. For and by us.',
    icon: Shield,
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500' // Warm purple spectrum
  },
  {
    id: 'accessibility',
    title: 'ACCESSIBILITY',
    description: 'Low barriers to participation with multiple formats. Community contribution enabled. Inclusive design for all abilities.',
    icon: Zap,
    gradient: 'from-purple-500 via-violet-500 to-fuchsia-500' // Purple spectrum with vibrancy
  }
]

// Real Governance Resources from BLKOUT Development
const governanceResources: Resource[] = [
  {
    id: 'cbs-structure',
    title: 'Community Benefit Society Structure',
    description: 'Democratic membership model with asset lock for community protection. One member, one vote governance. Registered with FCA.',
    type: 'framework',
    category: 'Governance',
    url: '/governance/community-benefit-society'
  },
  {
    id: 'liberation-layer-3',
    title: 'Liberation Layer 3: Economic Model',
    description: '75% creator revenue share (hardcoded), 25% platform operations. Transparent financial reporting and cooperative ownership.',
    type: 'framework',
    category: 'Economics',
    url: '/governance/liberation-layer-3'
  },
  {
    id: 'editorial-policy',
    title: 'Editorial Policy Framework',
    description: 'Community-led moderation with transparent appeals process. Values-based content curation. Democratic editorial decisions.',
    type: 'guide',
    category: 'Content',
    url: '/governance/editorial-policy'
  },
  {
    id: 'technical-architecture',
    title: 'Modular Platform Architecture',
    description: '6-component ecosystem: IVOR AI, Events, News, Channel BLKOUT, Storylab, Shop. Data sovereignty and full portability.',
    type: 'report',
    category: 'Technology',
    url: '/governance/technical-architecture'
  }
]

// Real Upcoming Events
const upcomingEvents: Event[] = [
  {
    id: 'joseph-beam-quiz',
    title: 'Joseph Beam Day Quiz of the Year',
    date: 'December 28th',
    time: '6:00 PM GMT',
    description: 'Subscriber-exclusive celebration of 2025\'s Black queer brilliance. Prizes: journals, memberships, beta access. First 100 RSVPs get Joseph Beam quote prints.',
    url: 'https://blkouthub.com/events/520807',
    isNew: true
  },
  {
    id: 'monthly-governance',
    title: 'Monthly Community Governance Meeting',
    date: 'First Thursday monthly',
    time: '7:00 PM GMT',
    description: 'Democratic decision-making on platform features, editorial policies, and resource allocation. All members welcome.',
    url: 'https://blkouthub.com/governance'
  },
  {
    id: 'tech-cooperative',
    title: 'Tech Cooperative Workshop Series',
    date: 'Ongoing',
    time: 'Varies',
    description: 'Learn to build liberation technology. SPARC development methodology, AI integration, and community-owned platforms.',
    url: 'https://blkouthub.com/workshops'
  }
]

// Partner Types
const partnerOpportunities: Partner[] = [
  {
    id: 'cooperative-orgs',
    name: 'Cooperative Organizations',
    type: 'cooperative',
    description: 'Mutual aid networks, worker cooperatives, and cooperative federations building economic democracy.',
    url: 'mailto:partners@blkoutuk.com?subject=Cooperative%20Partnership'
  },
  {
    id: 'cultural-institutions',
    name: 'Cultural & Educational Institutions',
    type: 'cultural',
    description: 'Archives, libraries, universities, and cultural centers preserving and amplifying Black queer history and knowledge.',
    url: 'mailto:partners@blkoutuk.com?subject=Cultural%20Partnership'
  },
  {
    id: 'funding-partners',
    name: 'Community Development Finance',
    type: 'funding',
    description: 'Cooperative funds, community investment, and patient capital for liberation technology and community ownership.',
    url: 'mailto:partners@blkoutuk.com?subject=Funding%20Partnership'
  },
  {
    id: 'tech-partners',
    name: 'Technology & Platform Cooperatives',
    type: 'technology',
    description: 'Open source projects, platform cooperatives, and technology for good organizations building ethical alternatives.',
    url: 'mailto:partners@blkoutuk.com?subject=Technology%20Partnership'
  }
]

// =======================
// HERO SECTION
// =======================
const MovementHero = () => (
  <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-950 overflow-hidden">
    {/* Background pattern with purple family spectrum */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-fuchsia-500 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-violet-500 rounded-full blur-3xl"></div>
    </div>

    <div className="relative z-10 max-w-7xl mx-auto px-8 py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-fuchsia-300 text-xl font-mono uppercase tracking-widest mb-6"
          >
            MOVEMENT BUILDING
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black heading-block leading-none mb-8"
          >
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              LIBERATION
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              PLATFORM
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl md:text-2xl text-purple-100 leading-relaxed font-light mb-12 max-w-2xl"
          >
            Community-controlled technology for Black queer liberation through cooperative ownership.
            Where we own our data, control our decisions, and share the value we create together.
          </motion.p>

          {/* Primary CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <a
              href="https://blkouthub.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-12 py-4 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-black text-lg hover:from-indigo-500 hover:to-fuchsia-500 transition-all duration-300 shadow-xl hover:shadow-2xl heading-block uppercase tracking-wide flex items-center justify-center"
            >
              <Users className="w-6 h-6 mr-3" />
              JOIN THE HUB
            </a>
            <a
              href="#resources"
              className="px-12 py-4 border-2 border-amber-400 text-amber-100 font-black text-lg hover:bg-amber-400 hover:text-indigo-900 transition-all duration-300 heading-block uppercase tracking-wide flex items-center justify-center"
            >
              <BookOpen className="w-6 h-6 mr-3" />
              BROWSE RESOURCES
            </a>
          </motion.div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="aspect-[4/3] overflow-hidden relative rounded-2xl shadow-2xl border-4 border-fuchsia-500/30">
            <img
              src="/images/blkoutuk.com v3/John Henry.png"
              alt="Breaking through systemic barriers together - collective liberation through cooperative ownership"
              className="w-full h-full object-contain bg-indigo-100"
            />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center text-fuchsia-300"
        >
          <span className="text-sm font-mono uppercase tracking-wider mb-2">EXPLORE</span>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </div>
  </section>
)

// =======================
// PRINCIPLES SECTION
// =======================
const MovementPrinciples = () => (
  <section className="py-24 bg-purple-950/50 backdrop-blur-sm">
    <div className="max-w-6xl mx-auto px-8">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black heading-block mb-6 uppercase"
        >
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            OUR
          </span>
          <span className="bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent ml-4">
            FOUNDATION
          </span>
        </motion.h2>
        <p className="text-xl text-purple-100 font-light leading-relaxed max-w-3xl mx-auto">
          The principles that guide our work toward economic democracy and collective liberation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {movementPrinciples.map((principle, index) => {
          const IconComponent = principle.icon

          return (
            <motion.div
              key={principle.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -8 }}
              className="bg-purple-900/30 backdrop-blur-sm border border-purple-700/30 p-8 hover:bg-purple-900/50 hover:border-fuchsia-500/50 transition-all duration-500 text-center group"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${principle.gradient} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-black heading-block mb-4 uppercase">
                <span className={`bg-gradient-to-r ${principle.gradient} bg-clip-text text-transparent`}>
                  {principle.title}
                </span>
              </h3>

              <p className="text-purple-100 leading-relaxed font-light text-sm">
                {principle.description}
              </p>
            </motion.div>
          )
        })}
      </div>
    </div>
  </section>
)

// =======================
// GOVERNANCE RESOURCES
// =======================
const ResourcesSection = () => (
  <section id="resources" className="py-24">
    <div className="max-w-6xl mx-auto px-8">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black heading-block mb-6 uppercase"
        >
          <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
            GOVERNANCE
          </span>
          <span className="bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent ml-4">
            RESOURCES
          </span>
        </motion.h2>
        <p className="text-xl text-purple-100 font-light leading-relaxed max-w-3xl mx-auto mb-8">
          Real frameworks from BLKOUT's development. Transparent, community-controlled,
          and designed for democratic participation.
        </p>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {governanceResources.map((resource, index) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-purple-900/20 backdrop-blur-sm border border-purple-700/20 p-8 hover:bg-purple-900/30 hover:border-violet-500/30 transition-all duration-300"
          >
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                <FileText className="w-7 h-7 text-white" />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-black heading-block uppercase text-purple-100 leading-tight mb-3">
                  {resource.title}
                </h3>

                <p className="text-amber-200 text-sm font-mono mb-4 opacity-80">
                  {resource.category} • {resource.type.toUpperCase()}
                </p>

                <p className="text-purple-100 leading-relaxed font-light mb-6">
                  {resource.description}
                </p>

                <div className="flex gap-3">
                  <a
                    href={resource.url || '#'}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-sm hover:from-indigo-500 hover:to-violet-500 transition-all heading-block uppercase flex items-center"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    READ
                  </a>
                  <button className="px-4 py-2 border border-amber-400 text-amber-100 font-black text-sm hover:bg-amber-400 hover:text-indigo-900 transition-all heading-block uppercase flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    DOWNLOAD
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

// =======================
// MEMBER ENGAGEMENT
// =======================
const MemberEngagement = () => (
  <section className="py-24 bg-gradient-to-br from-indigo-950/50 to-violet-950/30">
    <div className="max-w-6xl mx-auto px-8">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black heading-block mb-6 uppercase"
        >
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            UPCOMING
          </span>
          <span className="bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent ml-4">
            EVENTS
          </span>
        </motion.h2>
        <p className="text-xl text-purple-100 font-light leading-relaxed max-w-3xl mx-auto">
          Join community gatherings, governance meetings, and celebration events
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {upcomingEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-purple-900/30 backdrop-blur-sm border border-purple-700/30 p-6 hover:bg-purple-900/50 hover:border-fuchsia-500/50 transition-all duration-300"
          >
            {event.isNew && (
              <span className="inline-block bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white text-xs font-black px-3 py-1 uppercase tracking-wide mb-4">
                NEW
              </span>
            )}

            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-amber-400" />
              <span className="text-amber-200 font-mono text-sm">{event.date}</span>
            </div>

            <h3 className="text-xl font-black heading-block uppercase text-purple-100 mb-2 leading-tight">
              {event.title}
            </h3>

            <p className="text-violet-200 text-sm font-mono mb-4">{event.time}</p>

            <p className="text-purple-100 leading-relaxed font-light text-sm mb-6">
              {event.description}
            </p>

            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-black text-sm hover:from-indigo-500 hover:to-fuchsia-500 transition-all heading-block uppercase"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              REGISTER
            </a>
          </motion.div>
        ))}
      </div>

      {/* Newsletter CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-fuchsia-600/20 to-pink-600/20 border border-fuchsia-500/30 p-12 text-center"
      >
        <Sparkles className="w-12 h-12 text-fuchsia-400 mx-auto mb-6" />
        <h3 className="text-3xl font-black heading-block mb-4 uppercase">
          <span className="bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            NEWSLETTER EXCLUSIVE ACCESS
          </span>
        </h3>
        <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto leading-relaxed font-light">
          Get first access to beta features, exclusive events like Joseph Beam Day Quiz,
          and behind-the-scenes development updates.
        </p>
        <a
          href="https://blkoutuk.com/newsletter"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-black text-lg hover:from-fuchsia-500 hover:to-pink-500 transition-all heading-block uppercase"
        >
          <Mail className="w-6 h-6 mr-3" />
          SUBSCRIBE NOW
        </a>
      </motion.div>
    </div>
  </section>
)

// =======================
// PARTNER ENGAGEMENT
// =======================
const PartnerEngagement = () => (
  <section className="py-24">
    <div className="max-w-6xl mx-auto px-8">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black heading-block mb-6 uppercase"
        >
          <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
            BUILD
          </span>
          <span className="bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent ml-4">
            WITH US
          </span>
        </motion.h2>
        <p className="text-xl text-purple-100 font-light leading-relaxed max-w-3xl mx-auto">
          Partner with BLKOUT to build liberation technology and cooperative infrastructure together
        </p>
      </div>

      {/* Partner Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {partnerOpportunities.map((partner, index) => (
          <motion.div
            key={partner.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-purple-900/20 backdrop-blur-sm border border-purple-700/20 p-8 hover:bg-purple-900/30 hover:border-violet-500/30 transition-all duration-300"
          >
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Handshake className="w-7 h-7 text-white" />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-black heading-block uppercase text-purple-100 leading-tight mb-3">
                  {partner.name}
                </h3>

                <p className="text-violet-200 text-sm font-mono mb-4 opacity-80 uppercase">
                  {partner.type}
                </p>

                <p className="text-purple-100 leading-relaxed font-light mb-6">
                  {partner.description}
                </p>

                <a
                  href={partner.url || '#'}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-sm hover:from-indigo-500 hover:to-violet-500 transition-all heading-block uppercase"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  GET IN TOUCH
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Partner Value Proposition */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 p-12 text-center"
      >
        <Award className="w-12 h-12 text-fuchsia-400 mx-auto mb-6" />
        <h3 className="text-3xl font-black heading-block mb-6 uppercase">
          <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
            PARTNERSHIP PRINCIPLES
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
          <div>
            <h4 className="font-black heading-block uppercase text-amber-300 mb-2">MUTUAL BENEFIT</h4>
            <p className="text-purple-100 font-light text-sm">Partnerships that create value for both communities through shared resources and knowledge.</p>
          </div>
          <div>
            <h4 className="font-black heading-block uppercase text-teal-300 mb-2">VALUES ALIGNMENT</h4>
            <p className="text-purple-100 font-light text-sm">Shared commitment to liberation, cooperative ownership, and community control.</p>
          </div>
          <div>
            <h4 className="font-black heading-block uppercase text-emerald-300 mb-2">TRANSPARENCY</h4>
            <p className="text-purple-100 font-light text-sm">Open communication, democratic decision-making, and clear accountability.</p>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
)

// =======================
// BLKOUTHUB FINAL CTA
// =======================
const BlkoutHubCTA = () => (
  <section className="py-24">
    <div className="max-w-5xl mx-auto px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-16 text-center relative overflow-hidden shadow-2xl"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-6xl mb-8"
          >
            🚀
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-black text-white heading-block mb-6 uppercase">
            JOIN THE MOVEMENT
            <br />
            <span className="bg-gradient-to-r from-pink-300 to-amber-300 bg-clip-text text-transparent">
              IN BLKOUTHUB
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            These principles come alive in practice. Join ongoing projects, participate in governance,
            and build the cooperative economy with your community.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="https://blkouthub.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-12 py-4 bg-white text-indigo-900 font-black text-lg hover:bg-gray-100 transition-colors heading-block uppercase flex items-center justify-center shadow-lg"
            >
              <Users className="w-6 h-6 mr-3" />
              JOIN NOW
            </a>

            <a
              href="/governance"
              className="px-12 py-4 border-2 border-white text-white font-black text-lg hover:bg-white hover:text-indigo-900 transition-colors heading-block uppercase flex items-center justify-center"
            >
              <Target className="w-6 h-6 mr-3" />
              VIEW GOVERNANCE
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
)

// =======================
// MAIN COMPONENT
// =======================
export default function MovementComplete() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-950">
      <PrimaryNavigationEnhanced />

      <MovementHero />
      <MovementPrinciples />
      <ResourcesSection />
      <MemberEngagement />
      <PartnerEngagement />
      <BlkoutHubCTA />

      <PlatformFooter />
    </div>
  )
}
