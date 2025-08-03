// BLKOUT Community Constants

export const SITE_CONFIG = {
  name: 'BLKOUTUK',
  description: 'Community platform for cooperative ownership - Building bridges, not walls',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://blkoutuk.com',
  author: 'BLKOUTUK Community',
  tagline: 'Cooperative ownership for Black queer men',
  email: 'hello@blkoutuk.com',
  social: {
    twitter: '@blkoutuk',
    instagram: '@blkoutuk',
    linkedin: 'company/blkoutuk'
  }
}

export const BLKOUT_COLORS = {
  primary: '#D4261A',      // Bold red
  secondary: '#F4A261',    // Warm gold  
  accent: '#2A9D8F',       // Teal
  warm: '#E76F51',         // Orange
  deep: '#264653',         // Forest green
} as const

export const REALNESS_PALETTE = {
  amber: '#F59E0B',
  orange: '#EA580C', 
  rose: '#E11D48',
  purple: '#7C3AED',
} as const

export const COMMUNITY_VALUES = [
  'Black queer liberation first',
  'Cooperative ownership',
  'Authentic community building', 
  'Digital sovereignty',
  'Trust-based development'
] as const

export const NAVIGATION_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'Our Movement', href: '/movement' },
  { name: 'Stories', href: '/stories' },
  { name: 'Join Us', href: '/join' },
  { name: 'Hub', href: '/hub' }
] as const

export const DEVELOPMENT_PRINCIPLES = [
  '"Move at the speed of trust" - Iterative, community-reviewed releases',
  '"Small is good, small is all" - Incremental improvements over massive changes', 
  '"Trust the people" - Community feedback drives development priorities',
  '"Focus on critical connections" - Build features that strengthen community bonds'
] as const

// Content categorization system for consistent UI across the platform
export const CONTENT_CATEGORIES = {
  'Original Commentary': { 
    color: 'bg-purple-600', 
    textColor: 'text-purple-600',
    gradient: 'from-purple-400 via-purple-500 to-purple-600',
    glowColor: 'shadow-purple-500/25',
    description: 'Original analysis and commentary from community members'
  },
  'Curated Content': { 
    color: 'bg-pink-600', 
    textColor: 'text-pink-600',
    gradient: 'from-pink-400 via-pink-500 to-pink-600',
    glowColor: 'shadow-pink-500/25',
    description: 'Curated external content relevant to our community'
  },
  'Event Coverage': { 
    color: 'bg-orange-600', 
    textColor: 'text-orange-600',
    gradient: 'from-orange-400 via-orange-500 to-orange-600',
    glowColor: 'shadow-orange-500/25',
    description: 'Coverage and documentation of community events'
  },
  'Community Response': { 
    color: 'bg-green-600', 
    textColor: 'text-green-600',
    gradient: 'from-green-400 via-green-500 to-green-600',
    glowColor: 'shadow-green-500/25',
    description: 'Community reactions and responses to current events'
  },
  'Video/Audio/Photo': { 
    color: 'bg-blue-600', 
    textColor: 'text-blue-600',
    gradient: 'from-blue-400 via-blue-500 to-blue-600',
    glowColor: 'shadow-blue-500/25',
    description: 'Multimedia content including videos, audio, and photography'
  },
  
  // Additional categories for different content types
  'Community': {
    color: 'bg-emerald-600',
    textColor: 'text-emerald-600', 
    gradient: 'from-emerald-400 via-emerald-500 to-emerald-600',
    glowColor: 'shadow-emerald-500/25',
    description: 'Community stories and experiences'
  },
  'History & Culture': {
    color: 'bg-violet-600',
    textColor: 'text-violet-600',
    gradient: 'from-violet-400 via-violet-500 to-violet-600', 
    glowColor: 'shadow-violet-500/25',
    description: 'Historical perspectives and cultural analysis'
  },
  'Community Building': {
    color: 'bg-indigo-600',
    textColor: 'text-indigo-600',
    gradient: 'from-indigo-400 via-indigo-500 to-indigo-600',
    glowColor: 'shadow-indigo-500/25',
    description: 'Stories about building stronger communities'
  },
  'Arts & Culture': {
    color: 'bg-rose-600',
    textColor: 'text-rose-600',
    gradient: 'from-rose-400 via-rose-500 to-rose-600',
    glowColor: 'shadow-rose-500/25',
    description: 'Arts, culture, and creative expression'
  },
  'Geography & Space': {
    color: 'bg-teal-600',
    textColor: 'text-teal-600',
    gradient: 'from-teal-400 via-teal-500 to-teal-600',
    glowColor: 'shadow-teal-500/25',
    description: 'Place-making and geographic perspectives'
  },
  'Manifesto': {
    color: 'bg-red-600',
    textColor: 'text-red-600',
    gradient: 'from-red-400 via-red-500 to-red-600',
    glowColor: 'shadow-red-500/25',
    description: 'Foundational principles and manifestos'
  },
  'Technology': {
    color: 'bg-cyan-600',
    textColor: 'text-cyan-600',
    gradient: 'from-cyan-400 via-cyan-500 to-cyan-600',
    glowColor: 'shadow-cyan-500/25',
    description: 'Technology, digital rights, and platform development'
  },
  'Health & Wellness': {
    color: 'bg-lime-600',
    textColor: 'text-lime-600',
    gradient: 'from-lime-400 via-lime-500 to-lime-600',
    glowColor: 'shadow-lime-500/25',
    description: 'Mental health, wellness, and community care'
  },
  'Economics': {
    color: 'bg-amber-600',
    textColor: 'text-amber-600',
    gradient: 'from-amber-400 via-amber-500 to-amber-600',
    glowColor: 'shadow-amber-500/25',
    description: 'Economic justice and cooperative economics'
  },
  'Media & Storytelling': {
    color: 'bg-fuchsia-600',
    textColor: 'text-fuchsia-600',
    gradient: 'from-fuchsia-400 via-fuchsia-500 to-fuchsia-600',
    glowColor: 'shadow-fuchsia-500/25',
    description: 'Media justice and community storytelling'
  }
} as const

export type ContentCategory = keyof typeof CONTENT_CATEGORIES

// Helper function to get category styling
export const getCategoryIndicator = (category: string) => {
  const categoryData = CONTENT_CATEGORIES[category as ContentCategory]
  if (!categoryData) {
    return CONTENT_CATEGORIES['Community'] // fallback
  }
  return categoryData
}

// Helper function to get category color for display
export const getCategoryColor = (category: string) => {
  const categoryData = getCategoryIndicator(category)
  return categoryData.color
}

// Helper function to get category text color
export const getCategoryTextColor = (category: string) => {
  const categoryData = getCategoryIndicator(category)
  return categoryData.textColor
}