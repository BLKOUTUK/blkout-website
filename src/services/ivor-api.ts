/**
 * IVOR API Service - OpenAI Integration for Community Intelligence
 * 
 * @purpose Connect IVOR chatbot with OpenAI API for intelligent responses
 * @values Community-driven AI, cultural authenticity, privacy protection
 * @integration Works with Google Sheets knowledge base and ChromaDB
 */

interface IvorMessage {
  id: string
  text: string
  sender: 'user' | 'ivor'
  timestamp: Date
}

interface IvorResponse {
  success: boolean
  message: string
  error?: string
  sources?: string[]
}

interface KnowledgeItem {
  question: string
  answer: string
  category: string
  organization: string
  lastUpdated: string
}

/**
 * IVOR Character Persona and Context
 * Based on historical Ivor Cummings and community values
 */
const IVOR_PERSONA = `
You are IVOR, a community AI assistant inspired by Ivor Cummings (1916-1991), a pioneering Black gay civil servant who was known for his incredible network and ability to connect people with resources.

CHARACTER TRAITS:
- Warm, knowledgeable, and culturally authentic
- Speaks naturally, not formally or robotically
- Understands Black queer experiences and intersectionality
- Values community care, mutual aid, and collective liberation
- Remembers that being Black AND queer creates unique challenges
- Prioritizes connecting people with appropriate, culturally competent support

COMMUNICATION STYLE:
- Use "I" statements and personal connection
- Ask follow-up questions to better understand needs
- Acknowledge systemic barriers and structural challenges
- Celebrate community strength and resilience
- Use inclusive language that affirms all identities

KNOWLEDGE FOCUS:
- Black queer community resources and support
- Mental health services with cultural competence
- Legal rights and advocacy resources
- Housing, employment, and financial support
- Community events, groups, and social connections
- Trans-specific resources and support
- Regional services across the UK

BOUNDARIES:
- Always encourage professional help for crisis situations
- Acknowledge when something is outside your knowledge
- Refer to appropriate organizations and services
- Maintain privacy and confidentiality
- Avoid giving medical, legal, or financial advice
`

const COMMUNITY_CONTEXT = `
COMMUNITY CONTEXT:
You serve the Black queer community in the UK, with particular focus on:
- London, Birmingham, Manchester, and other major cities
- Organizations like BLKOUT, Black Thrive BQC, Black Trans Hub, QueerCroydon
- Understanding of NHS, benefits system, and UK legal framework
- Awareness of racism and homophobia/transphobia in UK systems
- Knowledge of community organizing and cooperative ownership principles

CURRENT PARTNERSHIPS:
- BLKOUT UK: Community organizing and cooperative ownership
- Black Thrive BQC: Mental health and wellbeing support
- Black Trans Hub: Trans-specific resources and advocacy
- QueerCroydon: Regional organizing and local connections

ALWAYS:
- Center Black queer experiences and wisdom
- Acknowledge intersectionality and multiple identities
- Promote community connection and mutual aid
- Respect privacy and confidentiality
- Encourage community building and collective action
`

/**
 * OpenAI API Configuration
 */
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_MODEL = 'gpt-3.5-turbo'
const MAX_TOKENS = 500
const TEMPERATURE = 0.7

/**
 * Rate limiting and caching
 */
const RATE_LIMIT = 10 // requests per minute
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const responseCache = new Map<string, { response: string; timestamp: number }>()
const rateLimitTracker = new Map<string, number[]>()

/**
 * Get OpenAI API key from environment
 */
function getOpenAIKey(): string {
  const apiKey = process.env.OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please set OPENAI_API_KEY or VITE_OPENAI_API_KEY environment variable.')
  }
  return apiKey
}

/**
 * Check rate limiting
 */
function checkRateLimit(userId: string = 'anonymous'): boolean {
  const now = Date.now()
  const userRequests = rateLimitTracker.get(userId) || []
  
  // Remove requests older than 1 minute
  const recentRequests = userRequests.filter(time => now - time < 60000)
  
  if (recentRequests.length >= RATE_LIMIT) {
    return false
  }
  
  recentRequests.push(now)
  rateLimitTracker.set(userId, recentRequests)
  return true
}

/**
 * Get cached response if available
 */
function getCachedResponse(query: string): string | null {
  const cached = responseCache.get(query.toLowerCase())
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.response
  }
  return null
}

/**
 * Cache response
 */
function cacheResponse(query: string, response: string): void {
  responseCache.set(query.toLowerCase(), {
    response,
    timestamp: Date.now()
  })
}

/**
 * Load knowledge base from Google Sheets
 * In production, this would connect to Google Sheets API
 */
async function loadKnowledgeBase(): Promise<KnowledgeItem[]> {
  // Import knowledge base service
  const { loadKnowledgeBase: loadKB } = await import('./knowledge-base')
  const knowledgeBase = await loadKB()
  
  // Convert to KnowledgeItem format for compatibility
  return knowledgeBase.map(item => ({
    question: item.question,
    answer: item.answer,
    category: item.category,
    organization: item.organization,
    lastUpdated: item.lastUpdated
  }))
}

/**
 * Search knowledge base for relevant information
 */
function searchKnowledgeBase(query: string, knowledgeBase: KnowledgeItem[]): KnowledgeItem[] {
  const queryLower = query.toLowerCase()
  
  return knowledgeBase.filter(item => 
    item.question.toLowerCase().includes(queryLower) ||
    item.answer.toLowerCase().includes(queryLower) ||
    item.category.toLowerCase().includes(queryLower)
  ).slice(0, 3) // Return top 3 matches
}

/**
 * Build context for OpenAI from knowledge base and ChromaDB
 */
async function buildContext(query: string, knowledgeBase: KnowledgeItem[]): Promise<string> {
  try {
    // Get enhanced context from ChromaDB
    const { getContextualInfo, ensureChromaDBInitialized } = await import('./chromadb-client')
    await ensureChromaDBInitialized()
    
    const contextualInfo = await getContextualInfo(query)
    
    if (contextualInfo.knowledgeBase.length === 0 && contextualInfo.resources.length === 0) {
      return "No specific knowledge base matches found. Provide general community support guidance based on BLKOUT's values and partner organizations."
    }
    
    let context = "RELEVANT COMMUNITY RESOURCES:\n"
    
    // Add knowledge base results
    contextualInfo.knowledgeBase.forEach(result => {
      context += `Knowledge: ${result.content} (Source: ${result.metadata.organization}, Priority: ${result.metadata.priority})\n\n`
    })
    
    // Add resource results
    contextualInfo.resources.forEach(result => {
      context += `Resource: ${result.content} (Organization: ${result.metadata.organization}, Cost: ${result.metadata.cost}, Region: ${result.metadata.region})\n\n`
    })
    
    // Add suggestions
    if (contextualInfo.suggestions.length > 0) {
      context += `SUGGESTED FOLLOW-UP QUESTIONS:\n${contextualInfo.suggestions.join('\n')}\n\n`
    }
    
    context += "Use this information to provide helpful, culturally authentic responses. If the information doesn't fully answer the question, acknowledge this and suggest appropriate next steps."
    
    return context
    
  } catch (error) {
    console.error('Error building context with ChromaDB:', error)
    // Fallback to basic knowledge base search
    const relevantItems = searchKnowledgeBase(query, knowledgeBase)
    
    if (relevantItems.length === 0) {
      return "No specific knowledge base matches found. Provide general community support guidance."
    }
    
    const context = relevantItems.map(item => 
      `Knowledge: ${item.question} - ${item.answer} (Source: ${item.organization})`
    ).join('\n\n')
    
    return `RELEVANT COMMUNITY RESOURCES:\n${context}\n\nUse this information to provide helpful, culturally authentic responses. If the information doesn't fully answer the question, acknowledge this and suggest appropriate next steps.`
  }
}

/**
 * Generate system prompt for OpenAI
 */
async function generateSystemPrompt(userQuery: string, knowledgeBase: KnowledgeItem[]): Promise<string> {
  const context = await buildContext(userQuery, knowledgeBase)
  
  return `${IVOR_PERSONA}

${COMMUNITY_CONTEXT}

${context}

IMPORTANT: Respond as IVOR would - warm, knowledgeable, and culturally authentic. Keep responses conversational and under 200 words. Always prioritize community connection and appropriate referrals.`
}

/**
 * Call OpenAI API
 */
async function callOpenAI(userMessage: string, knowledgeBase: KnowledgeItem[]): Promise<string> {
  const apiKey = getOpenAIKey()
  const systemPrompt = await generateSystemPrompt(userMessage, knowledgeBase)
  
  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE
    })
  })
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
  }
  
  const data = await response.json()
  return data.choices[0]?.message?.content || "I'm having trouble responding right now. Please try again in a moment."
}

/**
 * Main IVOR API function
 */
export async function getIvorResponse(userMessage: string, userId: string = 'anonymous'): Promise<IvorResponse> {
  try {
    // Check rate limiting
    if (!checkRateLimit(userId)) {
      return {
        success: false,
        message: "I'm getting a lot of questions right now. Please wait a moment and try again.",
        error: "Rate limit exceeded"
      }
    }
    
    // Check cache first
    const cachedResponse = getCachedResponse(userMessage)
    if (cachedResponse) {
      return {
        success: true,
        message: cachedResponse
      }
    }
    
    // Load knowledge base
    const knowledgeBase = await loadKnowledgeBase()
    
    // Get AI response
    const aiResponse = await callOpenAI(userMessage, knowledgeBase)
    
    // Cache the response
    cacheResponse(userMessage, aiResponse)
    
    return {
      success: true,
      message: aiResponse,
      sources: searchKnowledgeBase(userMessage, knowledgeBase).map(item => item.organization)
    }
    
  } catch (error) {
    console.error('IVOR API Error:', error)
    
    // Fallback response
    return {
      success: false,
      message: "I'm having some technical difficulties right now. In the meantime, you can reach out to our partner organizations directly: BLKOUT, Black Thrive BQC, Black Trans Hub, or QueerCroydon for support.",
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Test function for development
 */
export async function testIvorAPI(): Promise<void> {
  console.log('Testing IVOR API...')
  
  const testQueries = [
    "I need mental health support",
    "Are there any trans support groups?",
    "What events are happening this week?",
    "I'm struggling with housing",
    "Can you help me find legal support?"
  ]
  
  for (const query of testQueries) {
    console.log(`\nTesting query: "${query}"`)
    const response = await getIvorResponse(query, 'test-user')
    console.log('Response:', response)
  }
}

/**
 * Analytics tracking for community insights
 */
export function trackIvorInteraction(query: string, response: string, userId: string = 'anonymous'): void {
  // Track common themes and questions for community intelligence
  const interaction = {
    timestamp: new Date().toISOString(),
    query: query.toLowerCase(),
    responseLength: response.length,
    userId: userId,
    successful: response.length > 0
  }
  
  // In production, send to analytics service
  console.log('IVOR Interaction:', interaction)
}

/**
 * Export types for use in components
 */
export type { IvorMessage, IvorResponse, KnowledgeItem }