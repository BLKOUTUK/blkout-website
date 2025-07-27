// BLKOUT Media Assets Configuration
// Curated retro media for scrollytelling narrative: "joy through complexity, power through solidarity"

export interface MediaAsset {
  id: string
  type: 'image' | 'video'
  src: string
  webmSrc?: string
  mp4Src?: string
  alt: string
  title: string
  description: string
  theme: 'resilience' | 'love' | 'affirmation' | 'solidarity' | 'journey'
  vcrIntensity: 'light' | 'medium' | 'heavy'
  section: 'hero' | 'values' | 'principles' | 'community'
}

export const mediaAssets: MediaAsset[] = [
  // Hero Section - Dawn of New Possibilities
  {
    id: 'sunrise-silhouette',
    type: 'image',
    src: '/src/assets/images/sunrise.png',
    alt: 'Silhouette against golden sunrise over water',
    title: 'Dawn of Possibility',
    description: 'Standing at the threshold of transformation, we embrace the light of new beginnings.',
    theme: 'journey',
    vcrIntensity: 'medium',
    section: 'hero'
  },

  // Values Section - Core Foundations
  {
    id: 'ancient-love',
    type: 'image',
    src: '/src/assets/images/ancientlove.png',
    alt: 'Ancient Egyptian wall art showing intimate connection',
    title: 'Love is Ancient',
    description: 'Our connections transcend time - love, community, and solidarity are timeless foundations.',
    theme: 'love',
    vcrIntensity: 'heavy',
    section: 'values'
  },
  {
    id: 'capacity-affirmation',
    type: 'image',
    src: '/src/assets/images/capacity.png',
    alt: 'Repeated affirmation: You are capable of creating the things you have in your mind',
    title: 'Infinite Capacity',
    description: 'The power to create and transform lives within each of us.',
    theme: 'affirmation',
    vcrIntensity: 'light',
    section: 'values'
  },
  {
    id: 'facecard-identity',
    type: 'image',
    src: '/src/assets/images/facecard.png',
    alt: 'Stylized portrait celebrating Black identity',
    title: 'Unapologetic Identity',
    description: 'Celebrating the fullness of who we are, without compromise.',
    theme: 'solidarity',
    vcrIntensity: 'medium',
    section: 'values'
  },

  // Principles Section - Building Through Complexity
  {
    id: 'john-henry-resilience',
    type: 'image',
    src: '/src/assets/images/John Henry.png',
    alt: 'John Henry figure against brick wall with systemic challenges written on bricks',
    title: 'Breaking Through Systems',
    description: 'Like John Henry, we face systemic barriers with determination and collective strength.',
    theme: 'resilience',
    vcrIntensity: 'heavy',
    section: 'principles'
  },
  {
    id: 'baldwin-wisdom',
    type: 'image',
    src: '/src/assets/images/seat with baldwin.png',
    alt: 'James Baldwin sitting among empty chairs on red background',
    title: 'Voices That Matter',
    description: 'Every voice has a seat at the table we\'re building together.',
    theme: 'solidarity',
    vcrIntensity: 'medium',
    section: 'principles'
  },

  // Community Section - Dynamic Futures
  {
    id: 'cube-transformation',
    type: 'video',
    src: '/src/assets/videos/cube intro.mp4',
    mp4Src: '/src/assets/videos/cube intro.mp4',
    alt: 'Abstract cube transformation animation',
    title: 'Infinite Possibilities',
    description: 'Our community continuously transforms, creating new realities.',
    theme: 'journey',
    vcrIntensity: 'light',
    section: 'community'
  },
  {
    id: 'golden-smile',
    type: 'video',
    src: '/src/assets/videos/goldsmile  intro.mp4',
    mp4Src: '/src/assets/videos/goldsmile  intro.mp4',
    alt: 'Golden smile animation with warm retro effects',
    title: 'Joy in Motion',
    description: 'Finding joy through complexity, celebrating every moment of progress.',
    theme: 'affirmation',
    vcrIntensity: 'medium',
    section: 'community'
  },
  {
    id: 'travel-journey',
    type: 'video',
    src: '/src/assets/videos/travel intro.mp4',
    mp4Src: '/src/assets/videos/travel intro.mp4',
    alt: 'Travel-themed animation suggesting movement and progress',
    title: 'Collective Journey',
    description: 'We move forward together, each step building towards liberation.',
    theme: 'journey',
    vcrIntensity: 'heavy',
    section: 'community'
  },
  {
    id: 'roller-momentum',
    type: 'video',
    src: '/src/assets/videos/roller intro.mp4',
    mp4Src: '/src/assets/videos/roller intro.mp4',
    alt: 'Roller animation suggesting momentum and energy',
    title: 'Unstoppable Momentum',
    description: 'Our movement builds power through continuous action and solidarity.',
    theme: 'resilience',
    vcrIntensity: 'medium',
    section: 'community'
  },
  {
    id: 'cube2-variation',
    type: 'video',
    src: '/src/assets/videos/cube2 intro.mp4',
    mp4Src: '/src/assets/videos/cube2 intro.mp4',
    alt: 'Second cube transformation with different perspective',
    title: 'Multiple Perspectives',
    description: 'Every angle reveals new possibilities for cooperative power.',
    theme: 'solidarity',
    vcrIntensity: 'light',
    section: 'community'
  }
]

// Helper functions
export const getAssetsBySection = (section: MediaAsset['section']) => 
  mediaAssets.filter(asset => asset.section === section)

export const getAssetsByTheme = (theme: MediaAsset['theme']) =>
  mediaAssets.filter(asset => asset.theme === theme)

export const getAssetById = (id: string) =>
  mediaAssets.find(asset => asset.id === id)

export const getRandomAssetBySection = (section: MediaAsset['section']) => {
  const sectionAssets = getAssetsBySection(section)
  return sectionAssets[Math.floor(Math.random() * sectionAssets.length)]
}