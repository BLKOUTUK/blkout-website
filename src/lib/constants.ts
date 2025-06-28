// BLKOUT Community Constants

export const SITE_CONFIG = {
  name: 'BLKOUTUK',
  description: 'Cooperative ownership platform - Building power through dialogue and complexity',
  url: (import.meta as any).env?.VITE_SITE_URL || 'https://blkoutuk.com',
  author: 'BLKOUTUK Community',
  tagline: 'Black queer men in powerful conversation',
  email: 'hello@blkoutuk.com',
  social: {
    twitter: '@blkoutuk',
    instagram: '@blkoutuk',
    linkedin: 'company/blkoutuk'
  }
}

export const BLKOUT_COLORS = {
  primary: '#FF0040',      // Deep electric magenta - COMMANDING
  secondary: '#00E6FF',    // Intense cyan - PRECISION  
  accent: '#6B46C1',       // Royal indigo - AUTHORITY
  warm: '#FF4500',         // Blazing orange - INTENSITY
  deep: '#000000',         // Pure black - DOMINANCE
  neon: '#32FF00',         // Laser green - DISRUPTION
} as const

export const ELECTRIC_ZONES = {
  // Zone-specific color schemes for project areas
  community: {
    primary: '#FF0055',    // Electric magenta
    secondary: '#FF1493',  // Deep pink
    accent: '#8A2BE2',     // Blue violet
    bg: '#1a0a14'          // Dark magenta base
  },
  technology: {
    primary: '#00FFFF',    // Electric cyan
    secondary: '#0080FF',  // Electric blue
    accent: '#4169E1',     // Royal blue
    bg: '#0a1419'          // Dark cyan base
  },
  liberation: {
    primary: '#7B68EE',    // Electric indigo
    secondary: '#9370DB',  // Medium slate blue
    accent: '#6A5ACD',     // Slate blue
    bg: '#0f0a19'          // Dark indigo base
  },
  disruption: {
    primary: '#39FF14',    // Laser green
    secondary: '#00FF7F',  // Spring green
    accent: '#32CD32',     // Lime green
    bg: '#0a190a'          // Dark green base
  }
} as const

export const MASCULINE_PALETTE = {
  // Intensified high-contrast colors for confident masculine aesthetic
  electricPink: '#FF0080',
  neonBlue: '#0066FF', 
  laserGreen: '#32FF00',
  hotMagenta: '#FF0040',
  deepIndigo: '#4B0082',
  cyberCyan: '#00E6FF',
  voltOrange: '#FF4500',
  plasmaPurple: '#7B2CBF',
  steelBlue: '#1E3A8A',
  crimsonRed: '#DC2626'
} as const

export const COMMUNITY_VALUES = [
  'Collaboration over competition',
  'Complexity over simplification', 
  'Conversation over conversion',
  'Community over commodity',
  'Realness over perfectionism'
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