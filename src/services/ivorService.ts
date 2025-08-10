// IVOR Service for connecting to IVOR backend
interface IVORResponse {
  message: string
  context?: any
  suggestions?: string[]
  resources?: any[]
}

interface IVORMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
  context?: any
}

class IVORService {
  private baseUrl: string
  private isConnected: boolean = false
  
  constructor() {
    // Try multiple backend URLs - sophisticated services backend first, then fallback
    const productionUrls = [
      'https://services-deploy.vercel.app',    // Primary: Full services backend
      'https://ivor.vercel.app',               // Fallback 1: IVOR-specific deployment  
      'https://blkout-ivor-api.vercel.app'     // Fallback 2: Alternative naming
    ]
    
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? productionUrls[0]  // Will test all URLs in checkConnection()
      : 'https://blkout-ivor-fresh-jklmotmfs-robs-projects-54d653d3.vercel.app/api'
  }

  async checkConnection(): Promise<boolean> {
    if (process.env.NODE_ENV !== 'production') {
      // Development mode - single URL check
      try {
        const response = await fetch(`${this.baseUrl}/health`, {
          method: 'GET',
        })
        this.isConnected = response.ok
        return this.isConnected
      } catch (error) {
        console.warn('IVOR backend not available:', error)
        this.isConnected = false
        return false
      }
    }

    // Production mode - try multiple URLs
    const productionUrls = [
      'https://services-deploy.vercel.app',
      'https://ivor.vercel.app', 
      'https://blkout-ivor-api.vercel.app'
    ]

    for (const url of productionUrls) {
      try {
        const response = await fetch(`${url}/api/health`, {
          method: 'GET',
        })
        
        if (response.ok) {
          this.baseUrl = url
          this.isConnected = true
          // IVOR backend connected
          return true
        }
      } catch (error) {
        console.warn(`IVOR backend ${url} not available:`, error)
      }
    }
    
    this.isConnected = false
    return false
  }

  async sendMessage(message: string, context?: any): Promise<IVORResponse> {
    try {
      if (!this.isConnected) {
        await this.checkConnection()
      }

      if (!this.isConnected) {
        // Return helpful fallback response when backend is unavailable
        return this.getFallbackResponse(message)
      }

      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('IVOR communication error:', error)
      return this.getFallbackResponse(message)
    }
  }

  async getResources(query: string, filters?: any): Promise<any[]> {
    try {
      if (!this.isConnected) {
        await this.checkConnection()
      }

      if (!this.isConnected) {
        return this.getFallbackResources(query)
      }

      const response = await fetch(`${this.baseUrl}/resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          filters,
          source: 'blkout-website'
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.resources || []
    } catch (error) {
      console.error('IVOR resources error:', error)
      return this.getFallbackResources(query)
    }
  }

  async getPathwayContext(pathwayData: any): Promise<any> {
    try {
      if (!this.isConnected) {
        await this.checkConnection()
      }

      if (!this.isConnected) {
        return this.getFallbackPathwayContext(pathwayData)
      }

      const response = await fetch(`${this.baseUrl}/pathway-context`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pathway: pathwayData.pathway,
          focus: pathwayData.focus,
          description: pathwayData.description,
          userId: pathwayData.userId || 'website-user'
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('IVOR pathway context error:', error)
      return this.getFallbackPathwayContext(pathwayData)
    }
  }

  // Enhanced fallback responses when backend is unavailable
  private getFallbackResponse(message: string): IVORResponse {
    const lowercaseMessage = message.toLowerCase()
    
    // Check for pathway context from localStorage
    const pathwayContext = localStorage.getItem('pathwayContext')
    let pathwayData = null
    try {
      pathwayData = pathwayContext ? JSON.parse(pathwayContext) : null
    } catch (e) {
      // Ignore parsing errors
    }
    
    if (lowercaseMessage.includes('mental health') || lowercaseMessage.includes('therapy')) {
      return {
        message: "I understand you're looking for mental health support. BLKOUT connects Black QTIPOC folks with culturally competent mental health resources. I can help guide you to our community resources and support networks.",
        suggestions: [
          "Explore community support groups",
          "Find QTIPOC-affirming therapists",
          "Access crisis support resources"
        ]
      }
    }
    
    if (lowercaseMessage.includes('housing') || lowercaseMessage.includes('accommodation')) {
      return {
        message: "Housing security is crucial for our community. BLKOUT works with organizations that provide QTIPOC-safe housing options and advocacy. I can help connect you with current housing resources and support.",
        suggestions: [
          "Community housing programs",
          "LGBTQ+ friendly accommodations",
          "Housing rights advocacy"
        ]
      }
    }
    
    if (lowercaseMessage.includes('legal') || lowercaseMessage.includes('discrimination')) {
      return {
        message: "Legal support is essential for protecting our rights. Even in offline mode, I can tell you that BLKOUT connects folks with legal advocates who understand the unique challenges facing Black QTIPOC communities, including discrimination and identity document issues.",
        suggestions: [
          "QTIPOC legal advocacy",
          "Discrimination reporting",
          "Identity document support"
        ]
      }
    }
    
    // Pathway-aware general fallback
    let responseMessage = "I'm currently operating in offline mode, but I'm still here to help! "
    
    if (pathwayData?.pathway) {
      switch (pathwayData.pathway) {
        case 'Community Healer':
          responseMessage += `As someone identified as a Community Healer, you're focused on healing trauma and supporting collective wellness. `
          break
        case 'Culture Keeper':
          responseMessage += `As a Culture Keeper, you're vital to preserving and sharing our community's rich heritage. `
          break
        case 'System Disruptor':
          responseMessage += `As a System Disruptor, your work challenges oppression and creates systemic change. `
          break
        case 'Wisdom Keeper':
          responseMessage += `As a Wisdom Keeper, you carry essential knowledge and insights for our community. `
          break
      }
    }
    
    responseMessage += "BLKOUT provides comprehensive support for Black QTIPOC communities including mental health resources, housing assistance, legal advocacy, and community connections. How can I point you toward the support you need?"
    
    return {
      message: responseMessage,
      suggestions: pathwayData?.pathway ? [
        `Explore ${pathwayData.pathway} resources`,
        "Connect with similar pathway holders",
        "Access specialized support networks",
        "Join pathway-specific discussions"
      ] : [
        "Browse community resources",
        "Connect with local support groups", 
        "Access liberation pathways",
        "Join community discussions"
      ]
    }
  }

  private getFallbackResources(query: string): any[] {
    // Return curated fallback resources based on query
    const queryLower = query.toLowerCase()
    
    if (queryLower.includes('mental health')) {
      return [
        {
          id: 'mh-1',
          title: 'Black QTIPOC Therapy Network',
          description: 'Directory of culturally competent therapists',
          type: 'mental-health',
          url: '#',
          location: 'UK-wide'
        },
        {
          id: 'mh-2', 
          title: 'Community Healing Circles',
          description: 'Peer support groups for Black QTIPOC folks',
          type: 'peer-support',
          url: '#',
          location: 'London, Manchester, Birmingham'
        }
      ]
    }
    
    if (queryLower.includes('housing')) {
      return [
        {
          id: 'h-1',
          title: 'QTIPOC Safe Housing Network',
          description: 'LGBTQ+ affirming accommodation options',
          type: 'housing',
          url: '#',
          location: 'UK-wide'
        }
      ]
    }
    
    // Default resources
    return [
      {
        id: 'general-1',
        title: 'BLKOUT Community Hub',
        description: 'Central resource for Black QTIPOC community support',
        type: 'community',
        url: '/community',
        location: 'Online & UK-wide'
      },
      {
        id: 'general-2',
        title: 'Liberation Pathways',
        description: 'Personalized support journey assessment',
        type: 'pathway',
        url: '/quiz',
        location: 'Online'
      }
    ]
  }

  private getFallbackPathwayContext(pathwayData: any): any {
    return {
      context: `Based on your liberation pathway responses, you've indicated interests in ${pathwayData.interests?.join(', ') || 'community connection'}. While my full analysis system is offline, I can help connect you with relevant community resources and support networks.`,
      recommendations: [
        'Join community discussions',
        'Explore local support groups',
        'Access educational resources',
        'Connect with peer networks'
      ],
      urgency: pathwayData.urgency || 'standard',
      followUp: 'Visit our community hub for immediate connection opportunities.'
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected
  }
}

export const ivorService = new IVORService()
export type { IVORResponse, IVORMessage }