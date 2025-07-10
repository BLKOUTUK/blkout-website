/**
 * ChromaDB Client - Vector Database for Community Intelligence
 * 
 * @purpose Provide semantic search capabilities for community resources
 * @values Community intelligence, contextual understanding, cultural relevance
 * @integration Works with knowledge base and IVOR API for enhanced responses
 */

import { KnowledgeBaseItem, ResourceItem } from './knowledge-base'

interface ChromaDocument {
  id: string
  content: string
  metadata: Record<string, any>
  embedding?: number[]
}

interface ChromaSearchResult {
  id: string
  content: string
  metadata: Record<string, any>
  distance: number
  score: number
}

interface ChromaCollection {
  name: string
  documents: ChromaDocument[]
  lastUpdated: string
}

/**
 * ChromaDB Configuration
 */
const CHROMA_CONFIG = {
  host: process.env.CHROMA_HOST || 'localhost',
  port: process.env.CHROMA_PORT || '8000',
  collection: 'ivor_community_knowledge',
  embeddingModel: 'all-MiniLM-L6-v2' // Sentence transformer model
}

/**
 * Mock ChromaDB implementation for development
 * In production, this would connect to actual ChromaDB instance
 */
class MockChromaDB {
  private collections: Map<string, ChromaCollection> = new Map()
  
  /**
   * Create or get collection
   */
  async getOrCreateCollection(name: string): Promise<ChromaCollection> {
    if (!this.collections.has(name)) {
      this.collections.set(name, {
        name,
        documents: [],
        lastUpdated: new Date().toISOString()
      })
    }
    return this.collections.get(name)!
  }
  
  /**
   * Add documents to collection
   */
  async addDocuments(collectionName: string, documents: ChromaDocument[]): Promise<void> {
    const collection = await this.getOrCreateCollection(collectionName)
    
    // Remove existing documents with same IDs
    const existingIds = new Set(collection.documents.map(doc => doc.id))
    const newDocuments = documents.filter(doc => !existingIds.has(doc.id))
    
    collection.documents.push(...newDocuments)
    collection.lastUpdated = new Date().toISOString()
    
    console.log(`Added ${newDocuments.length} documents to collection ${collectionName}`)
  }
  
  /**
   * Search documents by similarity
   */
  async searchDocuments(
    collectionName: string, 
    query: string, 
    limit: number = 5
  ): Promise<ChromaSearchResult[]> {
    const collection = await this.getOrCreateCollection(collectionName)
    
    // Simple text-based search for mock implementation
    const queryLower = query.toLowerCase()
    const searchTerms = queryLower.split(' ')
    
    const results = collection.documents
      .map(doc => {
        const contentLower = doc.content.toLowerCase()
        const metadataText = Object.values(doc.metadata).join(' ').toLowerCase()
        const searchableText = `${contentLower} ${metadataText}`
        
        // Calculate simple similarity score
        const termMatches = searchTerms.filter(term => searchableText.includes(term))
        const score = termMatches.length / searchTerms.length
        
        return {
          id: doc.id,
          content: doc.content,
          metadata: doc.metadata,
          distance: 1 - score, // Lower distance = higher similarity
          score: score
        }
      })
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
    
    return results
  }
  
  /**
   * Get collection stats
   */
  async getCollectionStats(collectionName: string): Promise<{ count: number; lastUpdated: string }> {
    const collection = await this.getOrCreateCollection(collectionName)
    return {
      count: collection.documents.length,
      lastUpdated: collection.lastUpdated
    }
  }
}

/**
 * ChromaDB Client Singleton
 */
let chromaClient: MockChromaDB | null = null

function getChromaClient(): MockChromaDB {
  if (!chromaClient) {
    chromaClient = new MockChromaDB()
  }
  return chromaClient
}

/**
 * Initialize ChromaDB collections with community knowledge
 */
export async function initializeChromaDB(): Promise<void> {
  const client = getChromaClient()
  
  try {
    // Load knowledge base and resources
    const { loadKnowledgeBase, loadResources } = await import('./knowledge-base')
    const knowledgeBase = await loadKnowledgeBase()
    const resources = await loadResources()
    
    // Convert knowledge base to ChromaDB documents
    const knowledgeDocuments: ChromaDocument[] = knowledgeBase.map(item => ({
      id: `kb_${item.id}`,
      content: `${item.question} ${item.answer}`,
      metadata: {
        type: 'knowledge_base',
        category: item.category,
        organization: item.organization,
        priority: item.priority,
        region: item.region || 'UK',
        tags: item.tags,
        culturalContext: item.culturalContext || '',
        accessibility: item.accessibility || '',
        lastUpdated: item.lastUpdated
      }
    }))
    
    // Convert resources to ChromaDB documents
    const resourceDocuments: ChromaDocument[] = resources.map(item => ({
      id: `res_${item.id}`,
      content: `${item.name} ${item.description}`,
      metadata: {
        type: 'resource',
        category: item.category,
        organization: item.organization,
        cost: item.cost,
        region: item.region,
        targetAudience: item.targetAudience,
        accessibility: item.accessibility,
        culturalCompetency: item.culturalCompetency,
        specialties: item.specialties || [],
        contactEmail: item.contactEmail || '',
        website: item.website || '',
        lastUpdated: item.lastUpdated
      }
    }))
    
    // Add documents to ChromaDB
    await client.addDocuments(CHROMA_CONFIG.collection, [
      ...knowledgeDocuments,
      ...resourceDocuments
    ])
    
    console.log('ChromaDB initialized successfully')
    
  } catch (error) {
    console.error('Error initializing ChromaDB:', error)
  }
}

/**
 * Search community knowledge using semantic similarity
 */
export async function searchCommunityKnowledge(
  query: string, 
  limit: number = 5,
  filters?: { category?: string; organization?: string; type?: string }
): Promise<ChromaSearchResult[]> {
  const client = getChromaClient()
  
  try {
    const results = await client.searchDocuments(CHROMA_CONFIG.collection, query, limit * 2)
    
    // Apply filters if provided
    let filteredResults = results
    if (filters) {
      filteredResults = results.filter(result => {
        if (filters.category && result.metadata.category !== filters.category) {
          return false
        }
        if (filters.organization && result.metadata.organization !== filters.organization) {
          return false
        }
        if (filters.type && result.metadata.type !== filters.type) {
          return false
        }
        return true
      })
    }
    
    return filteredResults.slice(0, limit)
    
  } catch (error) {
    console.error('Error searching community knowledge:', error)
    return []
  }
}

/**
 * Get contextual information for IVOR responses
 */
export async function getContextualInfo(query: string): Promise<{
  knowledgeBase: ChromaSearchResult[]
  resources: ChromaSearchResult[]
  suggestions: string[]
}> {
  try {
    // Search knowledge base
    const knowledgeResults = await searchCommunityKnowledge(
      query, 
      3, 
      { type: 'knowledge_base' }
    )
    
    // Search resources
    const resourceResults = await searchCommunityKnowledge(
      query, 
      3, 
      { type: 'resource' }
    )
    
    // Generate suggestions based on search results
    const suggestions = generateSuggestions(knowledgeResults, resourceResults)
    
    return {
      knowledgeBase: knowledgeResults,
      resources: resourceResults,
      suggestions
    }
    
  } catch (error) {
    console.error('Error getting contextual info:', error)
    return {
      knowledgeBase: [],
      resources: [],
      suggestions: []
    }
  }
}

/**
 * Generate related suggestions based on search results
 */
function generateSuggestions(
  knowledgeResults: ChromaSearchResult[], 
  resourceResults: ChromaSearchResult[]
): string[] {
  const suggestions: string[] = []
  
  // Extract categories and topics from results
  const categories = new Set<string>()
  const organizations = new Set<string>()
  
  knowledgeResults.concat(resourceResults).forEach(result => {
    categories.add(result.metadata.category)
    organizations.add(result.metadata.organization)
  })
  
  // Generate category-based suggestions
  categories.forEach(category => {
    switch (category) {
      case 'mental health':
        suggestions.push('Would you like information about crisis support services?')
        suggestions.push('Are you looking for therapy or counseling services?')
        break
      case 'trans support':
        suggestions.push('Would you like information about peer support groups?')
        suggestions.push('Are you looking for advocacy or legal support?')
        break
      case 'housing':
        suggestions.push('Are you facing housing discrimination?')
        suggestions.push('Do you need emergency housing support?')
        break
      case 'legal':
        suggestions.push('Are you dealing with workplace discrimination?')
        suggestions.push('Do you need immigration law support?')
        break
      case 'events':
        suggestions.push('Would you like to find events in your area?')
        suggestions.push('Are you interested in support groups or social events?')
        break
    }
  })
  
  // Generate organization-based suggestions
  organizations.forEach(org => {
    if (org !== 'Various') {
      suggestions.push(`Would you like more information about ${org}?`)
    }
  })
  
  return suggestions.slice(0, 3) // Return top 3 suggestions
}

/**
 * Update ChromaDB with new community knowledge
 */
export async function updateCommunityKnowledge(
  documents: ChromaDocument[]
): Promise<void> {
  const client = getChromaClient()
  
  try {
    await client.addDocuments(CHROMA_CONFIG.collection, documents)
    console.log('Community knowledge updated successfully')
  } catch (error) {
    console.error('Error updating community knowledge:', error)
  }
}

/**
 * Get analytics on community knowledge usage
 */
export async function getKnowledgeAnalytics(): Promise<{
  totalDocuments: number
  documentsByType: Record<string, number>
  documentsByCategory: Record<string, number>
  documentsByOrganization: Record<string, number>
  lastUpdated: string
}> {
  const client = getChromaClient()
  
  try {
    const stats = await client.getCollectionStats(CHROMA_CONFIG.collection)
    const collection = await client.getOrCreateCollection(CHROMA_CONFIG.collection)
    
    const documentsByType: Record<string, number> = {}
    const documentsByCategory: Record<string, number> = {}
    const documentsByOrganization: Record<string, number> = {}
    
    collection.documents.forEach(doc => {
      const type = doc.metadata.type || 'unknown'
      const category = doc.metadata.category || 'unknown'
      const organization = doc.metadata.organization || 'unknown'
      
      documentsByType[type] = (documentsByType[type] || 0) + 1
      documentsByCategory[category] = (documentsByCategory[category] || 0) + 1
      documentsByOrganization[organization] = (documentsByOrganization[organization] || 0) + 1
    })
    
    return {
      totalDocuments: stats.count,
      documentsByType,
      documentsByCategory,
      documentsByOrganization,
      lastUpdated: stats.lastUpdated
    }
    
  } catch (error) {
    console.error('Error getting knowledge analytics:', error)
    return {
      totalDocuments: 0,
      documentsByType: {},
      documentsByCategory: {},
      documentsByOrganization: {},
      lastUpdated: new Date().toISOString()
    }
  }
}

/**
 * Initialize ChromaDB on module load
 */
let initialized = false
export async function ensureChromaDBInitialized(): Promise<void> {
  if (!initialized) {
    await initializeChromaDB()
    initialized = true
  }
}

/**
 * Export types for use in other modules
 */
export type { ChromaDocument, ChromaSearchResult, ChromaCollection }