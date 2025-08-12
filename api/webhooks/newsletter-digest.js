// Newsletter Digest System
// Combines Events, Newsroom, and Community content for automated digest distribution
// Supports partnership amplification and maven network integration

import fs from 'fs/promises'

const STORAGE_PATH = '/tmp/newsletter-digest.json'

// Newsletter content sources
const CONTENT_SOURCES = {
  EVENTS: 'events',
  NEWSROOM: 'newsroom', 
  COMMUNITY: 'community',
  PARTNERSHIPS: 'partnerships'
}

// Digest frequency options
const DIGEST_FREQUENCY = {
  DAILY: 'daily',
  WEEKLY: 'weekly', 
  MONTHLY: 'monthly',
  SPECIAL: 'special'
}

// Key maven and partnership categories
const PARTNERSHIP_CATEGORIES = {
  MEDIA_MAVENS: 'media_mavens',           // Journalists, bloggers, podcasters
  COMMUNITY_ORGS: 'community_orgs',       // Community organizations and NGOs
  ACADEMIC_ALLIES: 'academic_allies',     // Researchers, universities, think tanks
  CULTURAL_LEADERS: 'cultural_leaders',   // Artists, cultural workers, influencers
  POLICY_ADVOCATES: 'policy_advocates',   // Policy makers, advocacy organizations
  FUNDING_PARTNERS: 'funding_partners'    // Funders, grant organizations, sponsors
}

// Maven/Partner contact database structure
const MAVEN_NETWORK = {
  // Media Mavens - for content amplification
  media_mavens: [
    {
      name: "Black LGBTQ+ Media Coalition",
      contact: "media@example.com",
      platforms: ["twitter", "instagram", "linkedin"],
      focus: ["news", "events", "community"],
      amplification_reach: "10k+",
      partnership_status: "active"
    }
  ],
  
  // Community Organizations - for event cross-promotion
  community_orgs: [
    {
      name: "UK Black Pride",
      contact: "partnerships@ukblackpride.org.uk",
      focus: ["events", "community", "advocacy"],
      member_reach: "5k+",
      partnership_status: "potential"
    }
  ],
  
  // Academic Allies - for research and analysis amplification
  academic_allies: [
    {
      name: "Centre for Black Studies Research",
      contact: "outreach@university.ac.uk", 
      focus: ["research", "analysis", "policy"],
      network_reach: "academic",
      partnership_status: "potential"
    }
  ]
}

async function loadDigestData() {
  try {
    const data = await fs.readFile(STORAGE_PATH, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return {
      digests: [],
      subscribers: [],
      partnerships: MAVEN_NETWORK
    }
  }
}

async function saveDigestData(data) {
  try {
    await fs.writeFile(STORAGE_PATH, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error saving digest data:', error)
  }
}

// Fetch recent events for digest inclusion
async function fetchRecentEvents(days = 7) {
  try {
    const response = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/events`)
    const data = await response.json()
    
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    return data.events?.filter(event => 
      event.status === 'published' && 
      new Date(event.publishedAt || event.createdAt) >= cutoffDate
    ) || []
  } catch (error) {
    console.error('Error fetching events:', error)
    return []
  }
}

// Fetch recent articles for digest inclusion
async function fetchRecentArticles(days = 7) {
  try {
    // This would connect to your newsroom API
    // For now, return mock structure
    return [
      {
        id: 'art_recent_1',
        title: 'Community Building in Action: Week in Review',
        excerpt: 'Highlights from this week\'s community organizing efforts...',
        author: 'BLKOUT Editorial Collective',
        publishedAt: new Date().toISOString(),
        category: 'Community News',
        url: 'https://blkoutuk.com/newsroom/community-building-review'
      }
    ]
  } catch (error) {
    console.error('Error fetching articles:', error)
    return []
  }
}

// Generate digest content based on frequency and sources
async function generateDigestContent(frequency, sources = Object.values(CONTENT_SOURCES)) {
  const content = {
    events: [],
    articles: [],
    community_highlights: [],
    partnership_opportunities: []
  }

  const daysBack = frequency === DIGEST_FREQUENCY.DAILY ? 1 : 
                   frequency === DIGEST_FREQUENCY.WEEKLY ? 7 : 30

  if (sources.includes(CONTENT_SOURCES.EVENTS)) {
    content.events = await fetchRecentEvents(daysBack)
  }

  if (sources.includes(CONTENT_SOURCES.NEWSROOM)) {
    content.articles = await fetchRecentArticles(daysBack)
  }

  if (sources.includes(CONTENT_SOURCES.COMMUNITY)) {
    // Add community highlights, member spotlights, etc.
    content.community_highlights = [
      {
        type: 'member_spotlight',
        title: 'Community Member Leading Change',
        description: 'Highlighting the work of community members...',
        date: new Date().toISOString()
      }
    ]
  }

  if (sources.includes(CONTENT_SOURCES.PARTNERSHIPS)) {
    // Identify partnership opportunities based on content
    content.partnership_opportunities = identifyPartnershipOpportunities(content)
  }

  return content
}

// Identify strategic partnership opportunities based on content
function identifyPartnershipOpportunities(content) {
  const opportunities = []

  // Events-based partnership opportunities
  content.events.forEach(event => {
    if (event.category === 'Community Building') {
      opportunities.push({
        type: 'event_amplification',
        target_category: PARTNERSHIP_CATEGORIES.COMMUNITY_ORGS,
        content: event,
        opportunity: 'Cross-promotion with community organizations',
        potential_reach: 'Community networks'
      })
    }
    
    if (event.category === 'Advocacy' || event.category === 'Policy') {
      opportunities.push({
        type: 'policy_alignment', 
        target_category: PARTNERSHIP_CATEGORIES.POLICY_ADVOCATES,
        content: event,
        opportunity: 'Policy advocacy collaboration',
        potential_reach: 'Policy networks'
      })
    }
  })

  // Articles-based partnership opportunities
  content.articles.forEach(article => {
    if (article.category === 'Analysis' || article.category === 'Research') {
      opportunities.push({
        type: 'research_collaboration',
        target_category: PARTNERSHIP_CATEGORIES.ACADEMIC_ALLIES,
        content: article,
        opportunity: 'Academic research collaboration',
        potential_reach: 'Academic networks'
      })
    }
    
    if (article.category === 'Breaking News' || article.category === 'Community News') {
      opportunities.push({
        type: 'media_amplification',
        target_category: PARTNERSHIP_CATEGORIES.MEDIA_MAVENS,
        content: article,
        opportunity: 'Media coverage and amplification',
        potential_reach: 'Media networks'
      })
    }
  })

  return opportunities
}

// Generate newsletter HTML template
function generateNewsletterHTML(digestContent, frequency) {
  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric', 
    month: 'long',
    day: 'numeric'
  })

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>BLKOUT ${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Digest</title>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 20px; background: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #065f46 0%, #047857 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 900; }
        .header p { margin: 10px 0 0; opacity: 0.9; font-size: 16px; }
        .content { padding: 30px; }
        .section { margin-bottom: 40px; }
        .section h2 { color: #047857; border-bottom: 3px solid #065f46; padding-bottom: 10px; margin-bottom: 20px; }
        .event-item, .article-item { background: #f8f9fa; border-left: 4px solid #10b981; padding: 20px; margin-bottom: 20px; }
        .event-item h3, .article-item h3 { color: #065f46; margin: 0 0 10px; }
        .meta { color: #6b7280; font-size: 14px; margin-bottom: 15px; }
        .cta-button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px; margin: 10px 10px 10px 0; }
        .partnerships { background: #fffbeb; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; }
        .footer { background: #1f2937; color: white; padding: 30px; text-align: center; }
        .footer a { color: #10b981; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>BLKOUT ${frequency.toUpperCase()} DIGEST</h1>
            <p>Liberation through Community-Controlled Technology | ${date}</p>
        </div>
        
        <div class="content">
            ${digestContent.events.length > 0 ? `
            <div class="section">
                <h2>🎯 Upcoming Community Events</h2>
                ${digestContent.events.map(event => `
                    <div class="event-item">
                        <h3>${event.title}</h3>
                        <div class="meta">📅 ${new Date(event.date).toLocaleDateString()} | 📍 ${event.location?.address || 'Online'}</div>
                        <p>${event.description}</p>
                        ${event.registration_url ? `<a href="${event.registration_url}" class="cta-button">Register</a>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}

            ${digestContent.articles.length > 0 ? `
            <div class="section">
                <h2>📰 Latest Analysis & News</h2>
                ${digestContent.articles.map(article => `
                    <div class="article-item">
                        <h3>${article.title}</h3>
                        <div class="meta">✍️ ${article.author} | 📂 ${article.category}</div>
                        <p>${article.excerpt}</p>
                        ${article.url ? `<a href="${article.url}" class="cta-button">Read Full Article</a>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}

            ${digestContent.community_highlights.length > 0 ? `
            <div class="section">
                <h2>🌟 Community Highlights</h2>
                ${digestContent.community_highlights.map(highlight => `
                    <div class="article-item">
                        <h3>${highlight.title}</h3>
                        <p>${highlight.description}</p>
                    </div>
                `).join('')}
            </div>
            ` : ''}

            ${digestContent.partnership_opportunities.length > 0 ? `
            <div class="section">
                <h2>🤝 Partnership Opportunities</h2>
                <div class="partnerships">
                    <p><strong>Amplification & Collaboration Opportunities:</strong></p>
                    <p>We've identified ${digestContent.partnership_opportunities.length} strategic partnership opportunities this week. These connections could amplify our community's voice and expand our reach.</p>
                    <a href="https://blkoutuk.com/partnerships" class="cta-button">Explore Partnerships</a>
                </div>
            </div>
            ` : ''}

            <div class="section">
                <h2>🚀 Take Action</h2>
                <p>This digest comes alive when you take action. Here's how you can contribute:</p>
                <a href="https://blkouthub.com" class="cta-button">Join BLKOUTHUB</a>
                <a href="https://blkoutuk.com/events" class="cta-button">Browse Events</a>
                <a href="https://blkoutuk.com/newsroom" class="cta-button">Read More Analysis</a>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>BLKOUT</strong> | Building Liberation Through Community-Controlled Technology</p>
            <p><a href="https://blkoutuk.com">blkoutuk.com</a> | <a href="https://blkouthub.com">blkouthub.com</a></p>
            <p>This digest was generated automatically from our community platform.</p>
        </div>
    </div>
</body>
</html>
  `.trim()
}

// Trigger distribution workflows
async function triggerDistributionWorkflows(digestHTML, digestContent, frequency) {
  const results = {}

  // Email distribution via n8n/Zapier
  if (process.env.N8N_WEBHOOK_URL) {
    try {
      const response = await fetch(`${process.env.N8N_WEBHOOK_URL}/newsletter-distribution`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflow: 'newsletter-digest',
          frequency,
          html_content: digestHTML,
          content_summary: {
            events_count: digestContent.events.length,
            articles_count: digestContent.articles.length,
            partnership_opportunities: digestContent.partnership_opportunities.length
          },
          timestamp: new Date().toISOString()
        })
      })
      results.n8n = { success: response.ok, status: response.status }
    } catch (error) {
      results.n8n = { success: false, error: error.message }
    }
  }

  // Social media summary post
  try {
    const summaryContent = {
      title: `BLKOUT ${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Digest`,
      description: `${digestContent.events.length} events, ${digestContent.articles.length} articles, ${digestContent.partnership_opportunities.length} partnership opportunities`,
      url: 'https://blkoutuk.com/newsletter'
    }

    const socialResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/webhooks/social-media-automation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentType: 'newsletter',
        content: summaryContent,
        platforms: ['linkedin', 'twitter', 'facebook']
      })
    })
    results.social = { success: socialResponse.ok }
  } catch (error) {
    results.social = { success: false, error: error.message }
  }

  return results
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    if (req.method === 'POST') {
      const { 
        action, 
        frequency = DIGEST_FREQUENCY.WEEKLY, 
        sources = Object.values(CONTENT_SOURCES),
        distribute = true 
      } = req.body

      if (action === 'generate') {
        // Generate digest content
        const digestContent = await generateDigestContent(frequency, sources)
        const digestHTML = generateNewsletterHTML(digestContent, frequency)

        const digest = {
          id: `digest_${Date.now()}`,
          frequency,
          sources,
          content: digestContent,
          html: digestHTML,
          generatedAt: new Date().toISOString(),
          distributed: false
        }

        // Save digest
        const data = await loadDigestData()
        data.digests.push(digest)
        await saveDigestData(data)

        // Trigger distribution if requested
        let distributionResults = null
        if (distribute) {
          distributionResults = await triggerDistributionWorkflows(digestHTML, digestContent, frequency)
          digest.distributed = true
          digest.distributionResults = distributionResults
          await saveDigestData(data)
        }

        return res.status(200).json({
          success: true,
          digest: {
            id: digest.id,
            frequency,
            contentSummary: {
              events: digestContent.events.length,
              articles: digestContent.articles.length,
              community_highlights: digestContent.community_highlights.length,
              partnership_opportunities: digestContent.partnership_opportunities.length
            }
          },
          distribution: distributionResults,
          html_preview: digestHTML.slice(0, 500) + '...'
        })
      }

      return res.status(400).json({
        success: false,
        error: 'Invalid action. Use "generate".'
      })
    }

    if (req.method === 'GET') {
      const data = await loadDigestData()
      
      return res.status(200).json({
        success: true,
        newsletter_system: {
          sources: CONTENT_SOURCES,
          frequencies: DIGEST_FREQUENCY,
          partnership_categories: PARTNERSHIP_CATEGORIES
        },
        maven_network: Object.keys(MAVEN_NETWORK).reduce((acc, category) => {
          acc[category] = MAVEN_NETWORK[category].length
          return acc
        }, {}),
        recent_digests: data.digests.slice(-5).map(d => ({
          id: d.id,
          frequency: d.frequency,
          generatedAt: d.generatedAt,
          distributed: d.distributed,
          contentCounts: {
            events: d.content.events?.length || 0,
            articles: d.content.articles?.length || 0,
            partnerships: d.content.partnership_opportunities?.length || 0
          }
        })),
        usage: {
          generate_digest: {
            method: 'POST',
            body: {
              action: 'generate',
              frequency: 'weekly',
              sources: ['events', 'newsroom', 'community', 'partnerships'],
              distribute: true
            }
          }
        }
      })
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })

  } catch (error) {
    console.error('Newsletter digest error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    })
  }
}