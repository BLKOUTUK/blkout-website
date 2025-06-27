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