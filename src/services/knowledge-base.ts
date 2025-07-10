/**
 * Knowledge Base Service - Google Sheets Integration
 * 
 * @purpose Manage community knowledge base using Google Sheets
 * @values Community ownership, transparency, collaborative content management
 * @integration Works with IVOR API for intelligent responses
 */

interface KnowledgeBaseItem {
  id: string
  question: string
  answer: string
  category: string
  organization: string
  lastUpdated: string
  tags: string[]
  isActive: boolean
  priority: 'high' | 'medium' | 'low'
  culturalContext?: string
  accessibility?: string
  region?: string
}

interface ResourceItem {
  id: string
  name: string
  description: string
  category: string
  organization: string
  contactEmail?: string
  contactPhone?: string
  website?: string
  address?: string
  cost: 'free' | 'paid' | 'sliding-scale' | 'varies'
  targetAudience: string[]
  accessibility: string[]
  region: string
  lastUpdated: string
  isActive: boolean
  culturalCompetency: string[]
  referralProcess: string
  waitingTime?: string
  specialties?: string[]
}

interface EventItem {
  id: string
  title: string
  description: string
  organization: string
  date: string
  time: string
  location: string
  isOnline: boolean
  cost: string
  registrationLink?: string
  contactEmail?: string
  targetAudience: string[]
  accessibility: string[]
  category: string
  recurring?: string
  lastUpdated: string
  isActive: boolean
}

/**
 * Google Sheets Configuration
 * In production, these would be environment variables
 */
const GOOGLE_SHEETS_CONFIG = {
  knowledgeBaseSheetId: process.env.KNOWLEDGE_BASE_SHEET_ID || 'your-knowledge-base-sheet-id',
  resourcesSheetId: process.env.RESOURCES_SHEET_ID || 'your-resources-sheet-id',
  eventsSheetId: process.env.EVENTS_SHEET_ID || 'your-events-sheet-id',
  apiKey: process.env.GOOGLE_SHEETS_API_KEY || 'your-google-sheets-api-key'
}

/**
 * Mock data for development
 * In production, this would be replaced with actual Google Sheets API calls
 */
const MOCK_KNOWLEDGE_BASE: KnowledgeBaseItem[] = [
  {
    id: '1',
    question: 'mental health support for Black queer people',
    answer: 'Black Thrive BQC provides culturally competent mental health services specifically designed for Black queer individuals. They understand the unique challenges of being both Black and queer in the UK, including dealing with racism within queer spaces and homophobia/transphobia within Black communities. They offer individual therapy, group support, and community workshops. Contact them at info@blackthrivebqc.org or visit their website. They also have a 24/7 crisis support line.',
    category: 'mental health',
    organization: 'Black Thrive BQC',
    lastUpdated: '2024-07-01',
    tags: ['mental health', 'therapy', 'counseling', 'crisis support', 'culturally competent'],
    isActive: true,
    priority: 'high',
    culturalContext: 'Specifically designed for Black queer experiences and intersectionality',
    accessibility: 'BSL interpreters available, wheelchair accessible offices',
    region: 'London, Birmingham, Manchester'
  },
  {
    id: '2',
    question: 'trans support services',
    answer: 'Black Trans Hub offers comprehensive support for Black trans individuals, including peer support groups, advocacy services, and practical resources like clothing exchanges and legal name change support. They provide a safe space that truly understands the intersection of being Black and trans. They run weekly support groups in London and Birmingham, and offer one-to-one support sessions. Contact them at support@blacktranshub.org or through their website.',
    category: 'trans support',
    organization: 'Black Trans Hub',
    lastUpdated: '2024-07-01',
    tags: ['trans', 'transgender', 'peer support', 'advocacy', 'legal support'],
    isActive: true,
    priority: 'high',
    culturalContext: 'Specifically for Black trans experiences and challenges',
    accessibility: 'Trans-friendly spaces, chosen name respected, various meeting formats',
    region: 'London, Birmingham'
  },
  {
    id: '3',
    question: 'housing support and discrimination',
    answer: 'For housing support, there are several options depending on your situation. If you\'re facing discrimination, contact Shelter\'s discrimination helpline or the Equality and Human Rights Commission. For emergency housing, contact your local council\'s housing department - they have a duty to help if you\'re homeless or at risk. For longer-term support, organizations like Albert Kennedy Trust (AKT) specifically support LGBTQ+ young people with housing. For Black-specific housing advice, contact your local Black housing association or community center.',
    category: 'housing',
    organization: 'Various',
    lastUpdated: '2024-07-01',
    tags: ['housing', 'discrimination', 'homelessness', 'emergency accommodation', 'rights'],
    isActive: true,
    priority: 'high',
    culturalContext: 'Understanding of racial discrimination in housing market',
    accessibility: 'Multiple contact methods, interpreters available',
    region: 'UK-wide'
  },
  {
    id: '4',
    question: 'legal rights and discrimination',
    answer: 'For legal support, especially around discrimination, there are several free and low-cost options. The Equality and Human Rights Commission provides free advice on discrimination issues. Liberty offers legal advice and representation for civil liberties issues. For employment discrimination, contact ACAS (free) or your trade union if you have one. For immigration issues affecting queer people, contact UKLGIG (UK Lesbian & Gay Immigration Group). Many local law centers also provide free legal advice - search for your local community legal clinic.',
    category: 'legal',
    organization: 'Various',
    lastUpdated: '2024-07-01',
    tags: ['legal', 'discrimination', 'rights', 'employment', 'immigration'],
    isActive: true,
    priority: 'high',
    culturalContext: 'Understanding of racial and sexuality-based discrimination',
    accessibility: 'Free phone advice, written information available',
    region: 'UK-wide'
  },
  {
    id: '5',
    question: 'community events and social groups',
    answer: 'There are lots of community events happening regularly! BLKOUT runs monthly community gatherings focused on cooperative ownership and Black queer liberation. Black Thrive BQC hosts wellness workshops and social events. QueerCroydon organizes regular social meetups in South London. Black Trans Hub runs support groups and social events. Check their websites and social media for current events, or I can help you find events in your specific area. Many events are free or low-cost to ensure accessibility.',
    category: 'events',
    organization: 'Various',
    lastUpdated: '2024-07-01',
    tags: ['events', 'social', 'community', 'meetups', 'workshops'],
    isActive: true,
    priority: 'medium',
    culturalContext: 'Black queer specific events and safer spaces',
    accessibility: 'Most events are wheelchair accessible, check individual events',
    region: 'London, Birmingham, Manchester, Croydon'
  },
  {
    id: '6',
    question: 'employment and workplace discrimination',
    answer: 'For employment support, contact your local job center plus for basic support. For workplace discrimination, ACAS provides free advice and mediation services. Stonewall\'s workplace equality index can help you identify LGBTQ+ friendly employers. For race discrimination at work, contact the Equality and Human Rights Commission. If you\'re in a union, they can provide representation and advice. For career development specifically for Black professionals, organizations like the Black Professional Network offer mentoring and networking opportunities.',
    category: 'employment',
    organization: 'Various',
    lastUpdated: '2024-07-01',
    tags: ['employment', 'workplace', 'discrimination', 'careers', 'rights'],
    isActive: true,
    priority: 'medium',
    culturalContext: 'Understanding of both racial and sexuality-based workplace discrimination',
    accessibility: 'Phone and online advice available',
    region: 'UK-wide'
  },
  {
    id: '7',
    question: 'youth support for Black queer young people',
    answer: 'For young Black queer people, there are several specialized services. Albert Kennedy Trust (AKT) supports LGBTQ+ young people aged 16-25 with housing, mentoring, and advocacy. Black Pride Youth runs groups and events specifically for young Black LGBTQ+ people. Many local youth services also have specific LGBTQ+ support - check with your local council\'s youth services. School-based support is available through organizations like Stonewall\'s education program.',
    category: 'youth',
    organization: 'Various',
    lastUpdated: '2024-07-01',
    tags: ['youth', 'young people', 'support', 'education', 'mentoring'],
    isActive: true,
    priority: 'high',
    culturalContext: 'Understanding of unique challenges facing young Black queer people',
    accessibility: 'Age-appropriate services, multiple contact methods',
    region: 'UK-wide'
  },
  {
    id: '8',
    question: 'healthcare and GP services',
    answer: 'Finding culturally competent healthcare can be challenging. For trans healthcare, contact your GP about referrals to Gender Identity Clinics, though waiting times are long. Private options include GenderCare and London Transgender Clinic. For general healthcare, you can ask to see a different GP if you don\'t feel comfortable with yours. Some areas have specific LGBTQ+ healthcare services - check with your local NHS trust. For mental health, many areas have specific services for LGBTQ+ people.',
    category: 'healthcare',
    organization: 'Various',
    lastUpdated: '2024-07-01',
    tags: ['healthcare', 'GP', 'NHS', 'trans healthcare', 'medical'],
    isActive: true,
    priority: 'high',
    culturalContext: 'Understanding of barriers to healthcare for Black queer people',
    accessibility: 'NHS services free at point of use, interpreters available',
    region: 'UK-wide'
  }
]

const MOCK_RESOURCES: ResourceItem[] = [
  {
    id: '1',
    name: 'Black Thrive BQC Mental Health Services',
    description: 'Culturally competent mental health support for Black queer individuals',
    category: 'mental health',
    organization: 'Black Thrive BQC',
    contactEmail: 'info@blackthrivebqc.org',
    website: 'https://blackthrivebqc.org',
    cost: 'free',
    targetAudience: ['Black queer individuals', 'LGBTQ+ people', 'mental health support seekers'],
    accessibility: ['Wheelchair accessible', 'BSL interpreters available', 'Multiple languages'],
    region: 'London, Birmingham, Manchester',
    lastUpdated: '2024-07-01',
    isActive: true,
    culturalCompetency: ['Black community understanding', 'LGBTQ+ affirmative', 'Intersectional approach'],
    referralProcess: 'Self-referral via website or phone',
    waitingTime: '2-4 weeks',
    specialties: ['Individual therapy', 'Group support', 'Crisis intervention', 'Community workshops']
  },
  {
    id: '2',
    name: 'Black Trans Hub Support Services',
    description: 'Comprehensive support for Black trans individuals including peer support and advocacy',
    category: 'trans support',
    organization: 'Black Trans Hub',
    contactEmail: 'support@blacktranshub.org',
    website: 'https://blacktranshub.org',
    cost: 'free',
    targetAudience: ['Black trans individuals', 'Trans people', 'Gender diverse people'],
    accessibility: ['Trans-friendly spaces', 'Chosen names respected', 'Various meeting formats'],
    region: 'London, Birmingham',
    lastUpdated: '2024-07-01',
    isActive: true,
    culturalCompetency: ['Trans experience understanding', 'Black community knowledge', 'Intersectional support'],
    referralProcess: 'Self-referral via website, phone, or drop-in',
    waitingTime: 'Immediate for crisis support, 1-2 weeks for regular support',
    specialties: ['Peer support groups', 'Advocacy', 'Legal name change support', 'Clothing exchange']
  },
  {
    id: '3',
    name: 'BLKOUT Community Organizing',
    description: 'Community organizing focused on cooperative ownership and Black queer liberation',
    category: 'community organizing',
    organization: 'BLKOUT',
    contactEmail: 'info@blkoutuk.org',
    website: 'https://blkoutuk.org',
    cost: 'free',
    targetAudience: ['Black queer people', 'Community organizers', 'Cooperative ownership advocates'],
    accessibility: ['Wheelchair accessible venues', 'Multiple meeting formats', 'Childcare available'],
    region: 'London, Birmingham, Manchester',
    lastUpdated: '2024-07-01',
    isActive: true,
    culturalCompetency: ['Black queer liberation focus', 'Cooperative ownership principles', 'Community organizing'],
    referralProcess: 'Open membership, attend events or contact directly',
    specialties: ['Community organizing', 'Cooperative ownership', 'Political education', 'Mutual aid']
  },
  {
    id: '4',
    name: 'QueerCroydon Community Groups',
    description: 'Regional organizing and social groups for queer people in South London',
    category: 'community groups',
    organization: 'QueerCroydon',
    contactEmail: 'info@queercroydon.org',
    cost: 'free',
    targetAudience: ['Queer people in South London', 'Community members', 'Social group seekers'],
    accessibility: ['Various venue accessibility', 'Public transport accessible', 'Low-cost/free events'],
    region: 'Croydon, South London',
    lastUpdated: '2024-07-01',
    isActive: true,
    culturalCompetency: ['Queer-affirmative', 'Community-focused', 'Grassroots organizing'],
    referralProcess: 'Open to all, check website for events',
    specialties: ['Social events', 'Community organizing', 'Mutual aid', 'Networking']
  }
]

/**
 * Load knowledge base from Google Sheets
 * In production, this would make actual API calls
 */
export async function loadKnowledgeBase(): Promise<KnowledgeBaseItem[]> {
  try {
    // TODO: Implement actual Google Sheets API call
    // For now, return mock data
    return MOCK_KNOWLEDGE_BASE.filter(item => item.isActive)
  } catch (error) {
    console.error('Error loading knowledge base:', error)
    return []
  }
}

/**
 * Load resources from Google Sheets
 */
export async function loadResources(): Promise<ResourceItem[]> {
  try {
    // TODO: Implement actual Google Sheets API call
    return MOCK_RESOURCES.filter(item => item.isActive)
  } catch (error) {
    console.error('Error loading resources:', error)
    return []
  }
}

/**
 * Search knowledge base
 */
export function searchKnowledgeBase(query: string, knowledgeBase: KnowledgeBaseItem[]): KnowledgeBaseItem[] {
  const queryLower = query.toLowerCase()
  const searchTerms = queryLower.split(' ')
  
  return knowledgeBase
    .filter(item => {
      const searchableText = [
        item.question,
        item.answer,
        item.category,
        item.organization,
        ...item.tags,
        item.culturalContext || '',
        item.region || ''
      ].join(' ').toLowerCase()
      
      return searchTerms.some(term => searchableText.includes(term))
    })
    .sort((a, b) => {
      // Sort by priority and relevance
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const aPriority = priorityOrder[a.priority]
      const bPriority = priorityOrder[b.priority]
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority
      }
      
      // Sort by how many search terms match
      const aMatches = searchTerms.filter(term => 
        [item.question, item.answer, ...item.tags].join(' ').toLowerCase().includes(term)
      ).length
      const bMatches = searchTerms.filter(term => 
        [item.question, item.answer, ...item.tags].join(' ').toLowerCase().includes(term)
      ).length
      
      return bMatches - aMatches
    })
    .slice(0, 5) // Return top 5 matches
}

/**
 * Search resources
 */
export function searchResources(query: string, resources: ResourceItem[]): ResourceItem[] {
  const queryLower = query.toLowerCase()
  const searchTerms = queryLower.split(' ')
  
  return resources
    .filter(item => {
      const searchableText = [
        item.name,
        item.description,
        item.category,
        item.organization,
        ...item.targetAudience,
        ...item.specialties || [],
        item.region
      ].join(' ').toLowerCase()
      
      return searchTerms.some(term => searchableText.includes(term))
    })
    .sort((a, b) => {
      // Prioritize free resources
      if (a.cost === 'free' && b.cost !== 'free') return -1
      if (b.cost === 'free' && a.cost !== 'free') return 1
      
      // Sort by cultural competency
      const aCultural = a.culturalCompetency.length
      const bCultural = b.culturalCompetency.length
      
      return bCultural - aCultural
    })
    .slice(0, 5) // Return top 5 matches
}

/**
 * Get knowledge base item by ID
 */
export async function getKnowledgeBaseItem(id: string): Promise<KnowledgeBaseItem | null> {
  const knowledgeBase = await loadKnowledgeBase()
  return knowledgeBase.find(item => item.id === id) || null
}

/**
 * Get resource by ID
 */
export async function getResource(id: string): Promise<ResourceItem | null> {
  const resources = await loadResources()
  return resources.find(item => item.id === id) || null
}

/**
 * Add new knowledge base item (for partner organizations)
 */
export async function addKnowledgeBaseItem(item: Omit<KnowledgeBaseItem, 'id' | 'lastUpdated'>): Promise<boolean> {
  try {
    // TODO: Implement Google Sheets API call to add item
    console.log('Adding knowledge base item:', item)
    return true
  } catch (error) {
    console.error('Error adding knowledge base item:', error)
    return false
  }
}

/**
 * Update knowledge base item
 */
export async function updateKnowledgeBaseItem(id: string, updates: Partial<KnowledgeBaseItem>): Promise<boolean> {
  try {
    // TODO: Implement Google Sheets API call to update item
    console.log('Updating knowledge base item:', id, updates)
    return true
  } catch (error) {
    console.error('Error updating knowledge base item:', error)
    return false
  }
}

/**
 * Get analytics on knowledge base usage
 */
export function getKnowledgeBaseAnalytics(interactions: Array<{ query: string; timestamp: string }>) {
  const categories = MOCK_KNOWLEDGE_BASE.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const topQuestions = interactions
    .reduce((acc, interaction) => {
      acc[interaction.query] = (acc[interaction.query] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  
  return {
    totalItems: MOCK_KNOWLEDGE_BASE.length,
    categories,
    topQuestions: Object.entries(topQuestions)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
  }
}

/**
 * Export types for use in other modules
 */
export type { KnowledgeBaseItem, ResourceItem, EventItem }