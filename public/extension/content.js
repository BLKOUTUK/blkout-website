/**
 * BLKOUT Chrome Extension - Content Script
 * Analyzes page content for story potential and provides context
 */

class BlkoutContentAnalyzer {
  constructor() {
    this.initializeAnalyzer()
    this.setupMessageListener()
    this.detectCommunityContent()
  }
  
  initializeAnalyzer() {
    this.communityKeywords = [
      // LGBTQ+ terms
      'lgbtq', 'lgbt', 'queer', 'trans', 'transgender', 'gay', 'lesbian', 'bisexual', 'nonbinary', 'pride',
      // Black community terms
      'black', 'african', 'caribbean', 'diaspora', 'afro', 'melanin',
      // Community/organizing terms
      'community', 'organize', 'organise', 'activism', 'movement', 'solidarity', 'liberation', 'justice',
      'collective', 'grassroots', 'mutual aid', 'support group',
      // UK-specific terms
      'nhs', 'council', 'borough', 'constituency', 'mp', 'local authority',
      // Health/support terms
      'clinic', 'support', 'helpline', 'resource', 'service', 'workshop', 'meeting',
      // Event/celebration terms
      'event', 'celebration', 'festival', 'march', 'protest', 'gathering', 'meetup',
      'conference', 'panel', 'discussion', 'screening'
    ]
    
    this.ukLocations = [
      'london', 'manchester', 'birmingham', 'leeds', 'liverpool', 'bristol', 'brighton',
      'edinburgh', 'glasgow', 'cardiff', 'nottingham', 'sheffield', 'newcastle',
      'coventry', 'leicester', 'sunderland', 'belfast', 'bradford', 'preston',
      'southampton', 'plymouth', 'reading', 'york', 'oxford', 'cambridge'
    ]
    
    this.storyIndicators = {
      organizing: ['victory', 'won', 'success', 'achieved', 'campaign', 'petition', 'change', 'fight'],
      community: ['together', 'united', 'collective', 'group', 'members', 'join', 'participate'],
      health: ['health', 'clinic', 'doctor', 'treatment', 'vaccine', 'screening', 'support'],
      culture: ['celebrate', 'festival', 'art', 'music', 'culture', 'heritage', 'history'],
      education: ['workshop', 'training', 'education', 'learn', 'teach', 'knowledge', 'skill']
    }
  }
  
  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'analyzePageContent') {
        const analysis = this.analyzeCurrentPage()
        sendResponse(analysis)
      }
      
      if (request.action === 'getSelectedText') {
        const selectedText = window.getSelection().toString()
        sendResponse({ selectedText })
      }
      
      if (request.action === 'highlightCommunityContent') {
        this.highlightCommunityRelevantContent()
        sendResponse({ highlighted: true })
      }
      
      return true // Keep message channel open
    })
  }
  
  detectCommunityContent() {
    const analysis = this.analyzeCurrentPage()
    
    // Store analysis for popup to access
    chrome.storage.local.set({
      currentPageAnalysis: {
        ...analysis,
        timestamp: Date.now(),
        url: window.location.href
      }
    })
    
    // Notify background script if high community relevance
    if (analysis.communityRelevance.score > 0.6) {
      chrome.runtime.sendMessage({
        action: 'highRelevanceDetected',
        analysis,
        url: window.location.href
      })
    }
  }
  
  analyzeCurrentPage() {
    const pageContent = this.extractPageContent()
    const communityRelevance = this.calculateCommunityRelevance(pageContent)
    const storyPotential = this.assessStoryPotential(pageContent)
    const ukRelevance = this.assessUkRelevance(pageContent)
    
    return {
      pageContent,
      communityRelevance,
      storyPotential,
      ukRelevance,
      suggestedTitle: this.generateSuggestedTitle(),
      suggestedCategory: this.suggestCategory(pageContent),
      extractedLocation: this.extractLocation(pageContent),
      contentSummary: this.generateContentSummary(pageContent)
    }
  }
  
  extractPageContent() {
    const content = {
      title: document.title,
      url: window.location.href,
      domain: window.location.hostname,
      headings: this.extractHeadings(),
      bodyText: this.extractBodyText(),
      metadata: this.extractMetadata(),
      socialPlatform: this.detectSocialPlatform()
    }
    
    return content
  }
  
  extractHeadings() {
    const headings = []
    const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    
    headingElements.forEach(heading => {
      if (heading.textContent.trim()) {
        headings.push({
          level: parseInt(heading.tagName.charAt(1)),
          text: heading.textContent.trim()
        })
      }
    })
    
    return headings.slice(0, 10) // Limit to first 10 headings
  }
  
  extractBodyText() {
    // Remove script and style elements
    const clonedDoc = document.cloneNode(true)
    const scripts = clonedDoc.querySelectorAll('script, style, nav, header, footer')
    scripts.forEach(el => el.remove())
    
    // Get main content
    const mainContent = clonedDoc.querySelector('main, article, .content, .post, .entry') || clonedDoc.body
    const text = mainContent ? mainContent.textContent : document.body.textContent
    
    return text.replace(/\s+/g, ' ').trim().substring(0, 2000) // Limit to 2000 chars
  }
  
  extractMetadata() {
    const metadata = {}
    
    // Open Graph tags
    const ogTags = document.querySelectorAll('meta[property^="og:"]')
    ogTags.forEach(tag => {
      const property = tag.getAttribute('property').replace('og:', '')
      metadata[property] = tag.getAttribute('content')
    })
    
    // Twitter Card tags
    const twitterTags = document.querySelectorAll('meta[name^="twitter:"]')
    twitterTags.forEach(tag => {
      const name = tag.getAttribute('name').replace('twitter:', '')
      metadata[`twitter_${name}`] = tag.getAttribute('content')
    })
    
    // Standard meta tags
    const description = document.querySelector('meta[name="description"]')
    if (description) {
      metadata.description = description.getAttribute('content')
    }
    
    const keywords = document.querySelector('meta[name="keywords"]')
    if (keywords) {
      metadata.keywords = keywords.getAttribute('content')
    }
    
    return metadata
  }
  
  detectSocialPlatform() {
    const domain = window.location.hostname.toLowerCase()
    
    if (domain.includes('twitter.com') || domain.includes('x.com')) return 'twitter'
    if (domain.includes('facebook.com')) return 'facebook'
    if (domain.includes('instagram.com')) return 'instagram'
    if (domain.includes('linkedin.com')) return 'linkedin'
    if (domain.includes('tiktok.com')) return 'tiktok'
    if (domain.includes('youtube.com')) return 'youtube'
    
    return null
  }
  
  calculateCommunityRelevance(content) {
    const text = `${content.title} ${content.bodyText} ${Object.values(content.metadata).join(' ')}`.toLowerCase()
    
    let score = 0
    let matchedKeywords = []
    let reasons = []
    
    // Check community keywords
    this.communityKeywords.forEach(keyword => {
      const matches = (text.match(new RegExp(keyword, 'gi')) || []).length
      if (matches > 0) {
        score += matches * 0.1
        matchedKeywords.push(keyword)
        reasons.push(`Found "${keyword}" ${matches} times`)
      }
    })
    
    // Boost for UK locations
    this.ukLocations.forEach(location => {
      if (text.includes(location)) {
        score += 0.2
        reasons.push(`UK location: ${location}`)
      }
    })
    
    // Boost for social platforms (community discussions)
    if (content.socialPlatform) {
      score += 0.1
      reasons.push(`Social platform: ${content.socialPlatform}`)
    }
    
    // Boost for news/blog sites with community content
    if (content.domain.includes('news') || content.domain.includes('blog') || 
        content.domain.includes('medium.com') || content.domain.includes('substack.com')) {
      score += 0.1
      reasons.push('News/blog platform')
    }
    
    return {
      score: Math.min(score, 1), // Cap at 1.0
      matchedKeywords: matchedKeywords.slice(0, 10),
      reasons: reasons.slice(0, 5),
      level: score > 0.7 ? 'high' : score > 0.4 ? 'medium' : score > 0.1 ? 'low' : 'minimal'
    }
  }
  
  assessStoryPotential(content) {
    const text = `${content.title} ${content.bodyText}`.toLowerCase()
    const categories = {}
    
    Object.entries(this.storyIndicators).forEach(([category, indicators]) => {
      let categoryScore = 0
      const foundIndicators = []
      
      indicators.forEach(indicator => {
        if (text.includes(indicator)) {
          categoryScore += 0.1
          foundIndicators.push(indicator)
        }
      })
      
      if (categoryScore > 0) {
        categories[category] = {
          score: categoryScore,
          indicators: foundIndicators
        }
      }
    })
    
    const topCategory = Object.entries(categories)
      .sort(([,a], [,b]) => b.score - a.score)[0]
    
    return {
      categories,
      suggestedCategory: topCategory ? topCategory[0] : 'community',
      overallScore: Math.max(...Object.values(categories).map(c => c.score), 0)
    }
  }
  
  assessUkRelevance(content) {
    const text = `${content.title} ${content.bodyText} ${content.url}`.toLowerCase()
    
    let score = 0
    const foundLocations = []
    const indicators = []
    
    // Check for UK locations
    this.ukLocations.forEach(location => {
      if (text.includes(location)) {
        score += 0.2
        foundLocations.push(location)
      }
    })
    
    // Check for UK-specific indicators
    const ukIndicators = ['uk', 'britain', 'british', 'england', 'scotland', 'wales', 'northern ireland', 'nhs', 'bbc', '.gov.uk', '.ac.uk']
    ukIndicators.forEach(indicator => {
      if (text.includes(indicator)) {
        score += 0.1
        indicators.push(indicator)
      }
    })
    
    return {
      score: Math.min(score, 1),
      foundLocations,
      indicators,
      level: score > 0.5 ? 'high' : score > 0.2 ? 'medium' : score > 0 ? 'low' : 'none'
    }
  }
  
  generateSuggestedTitle() {
    const title = document.title
    
    if (!title) return ''
    
    // Clean up title
    let cleanTitle = title.replace(/ - .*$/, '').replace(/ \| .*$/, '')
    
    // Limit length
    if (cleanTitle.length > 60) {
      cleanTitle = cleanTitle.substring(0, 57) + '...'
    }
    
    return cleanTitle
  }
  
  suggestCategory(content) {
    const storyPotential = this.assessStoryPotential(content)
    
    if (storyPotential.suggestedCategory !== 'community') {
      return storyPotential.suggestedCategory
    }
    
    // Fallback analysis based on content
    const text = content.title.toLowerCase() + ' ' + content.bodyText.toLowerCase()
    
    if (text.includes('health') || text.includes('nhs') || text.includes('clinic')) return 'health'
    if (text.includes('event') || text.includes('festival') || text.includes('celebrate')) return 'culture'
    if (text.includes('campaign') || text.includes('petition') || text.includes('victory')) return 'organizing'
    if (text.includes('workshop') || text.includes('education') || text.includes('training')) return 'education'
    
    return 'community'
  }
  
  extractLocation(content) {
    const text = `${content.title} ${content.bodyText}`.toLowerCase()
    
    for (const location of this.ukLocations) {
      if (text.includes(location)) {
        return location.charAt(0).toUpperCase() + location.slice(1)
      }
    }
    
    return null
  }
  
  generateContentSummary(content) {
    let summary = ''
    
    // Use meta description if available
    if (content.metadata.description) {
      summary = content.metadata.description
    }
    // Use first paragraph
    else if (content.bodyText) {
      const sentences = content.bodyText.split('. ')
      summary = sentences.slice(0, 2).join('. ')
      if (sentences.length > 2) summary += '.'
    }
    
    // Limit length
    if (summary.length > 200) {
      summary = summary.substring(0, 197) + '...'
    }
    
    return summary
  }
  
  highlightCommunityRelevantContent() {
    // Find and highlight community-relevant terms on the page
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    )
    
    const textNodes = []
    let node
    
    while (node = walker.nextNode()) {
      if (node.textContent.trim()) {
        textNodes.push(node)
      }
    }
    
    textNodes.forEach(textNode => {
      let content = textNode.textContent
      let hasMatch = false
      
      this.communityKeywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
        if (regex.test(content)) {
          content = content.replace(regex, `<mark style="background: #fef3c7; color: #92400e;">$&</mark>`)
          hasMatch = true
        }
      })
      
      if (hasMatch) {
        const span = document.createElement('span')
        span.innerHTML = content
        textNode.parentNode.replaceChild(span, textNode)
      }
    })
  }
}

// Initialize content analyzer
new BlkoutContentAnalyzer()

console.log('BLKOUT Chrome Extension: Content script loaded')