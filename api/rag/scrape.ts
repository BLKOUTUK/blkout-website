import { NextApiRequest, NextApiResponse } from 'next'
import { BlkoutRAGService } from '../../lib/rag/core'
import { createClient } from '@supabase/supabase-js'
import Parser from 'rss-parser'
import * as cheerio from 'cheerio'

const ragService = new BlkoutRAGService()
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
)

// Enhanced scraping functions
class BlkoutScraper {
  private rssParser: Parser

  constructor() {
    this.rssParser = new Parser({
      timeout: 10000,
      customFields: {
        item: ['media:thumbnail', 'enclosure', 'category']
      }
    })
  }

  async scrapeRSSFeed(url: string): Promise<any[]> {
    try {
      console.log(`Scraping RSS feed: ${url}`)
      
      const feed = await this.rssParser.parseURL(url)
      const items = []

      for (const item of feed.items.slice(0, 20)) { // Limit to 20 most recent items
        try {
          const content = {
            title: item.title || 'Untitled',
            description: this.extractTextFromHTML(item.contentSnippet || item.content || ''),
            content: this.extractTextFromHTML(item.content || item.contentSnippet || ''),
            originalUrl: item.link || url,
            author: item.creator || feed.title || 'Unknown',
            publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
            imageUrl: this.extractImageFromItem(item),
            tags: this.extractTagsFromItem(item)
          }

          // Skip if content is too short or low quality
          if (content.title.length > 10 && content.description.length > 50) {
            items.push(content)
          }
        } catch (itemError) {
          console.error(`Error processing RSS item: ${item.title}`, itemError)
        }
      }

      return items
    } catch (error) {
      console.error(`Error scraping RSS feed ${url}:`, error)
      return []
    }
  }

  async scrapeWebsite(url: string): Promise<any[]> {
    try {
      console.log(`Scraping website: ${url}`)
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BLKOUT-Bot/1.0; +https://blkout.app/bot)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        timeout: 15000
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const html = await response.text()
      const $ = cheerio.load(html)

      // Extract various content types based on common patterns
      const items = []

      // Look for article elements
      $('article, .article, .post, .event, .news-item').each((i, element) => {
        if (i >= 10) return false // Limit to 10 items per page

        const $el = $(element)
        const title = this.extractTitle($el, $)
        const description = this.extractDescription($el, $)
        const content = this.extractContent($el, $)
        const imageUrl = this.extractImage($el, $, url)
        const publishedAt = this.extractDate($el, $)

        if (title && title.length > 10 && description && description.length > 30) {
          items.push({
            title,
            description,
            content: content || description,
            originalUrl: url,
            author: this.extractAuthor($el, $) || 'Unknown',
            publishedAt: publishedAt || new Date(),
            imageUrl,
            tags: this.extractTagsFromHTML($el, $)
          })
        }
      })

      // If no articles found, try extracting events from event platforms
      if (items.length === 0 && this.isEventPlatform(url)) {
        const events = await this.scrapeEvents($, url)
        items.push(...events)
      }

      return items
    } catch (error) {
      console.error(`Error scraping website ${url}:`, error)
      return []
    }
  }

  private extractTextFromHTML(html: string): string {
    const $ = cheerio.load(html || '')
    return $.text().trim().replace(/\s+/g, ' ').slice(0, 2000)
  }

  private extractImageFromItem(item: any): string | undefined {
    if (item['media:thumbnail']) {
      return item['media:thumbnail'].$ || item['media:thumbnail'].url
    }
    if (item.enclosure && item.enclosure.type?.startsWith('image/')) {
      return item.enclosure.url
    }
    return undefined
  }

  private extractTagsFromItem(item: any): string[] {
    const tags = []
    if (item.categories) {
      tags.push(...item.categories)
    }
    if (item.category) {
      if (Array.isArray(item.category)) {
        tags.push(...item.category)
      } else {
        tags.push(item.category)
      }
    }
    return tags.filter(Boolean).slice(0, 10)
  }

  private extractTitle($el: cheerio.Cheerio<cheerio.Element>, $: cheerio.CheerioAPI): string {
    return (
      $el.find('h1, h2, h3, .title, .headline, .event-title').first().text().trim() ||
      $el.find('[class*="title"], [class*="headline"]').first().text().trim() ||
      $el.attr('data-title') ||
      ''
    )
  }

  private extractDescription($el: cheerio.Cheerio<cheerio.Element>, $: cheerio.CheerioAPI): string {
    return (
      $el.find('.excerpt, .summary, .description, .event-description, p').first().text().trim() ||
      $el.find('[class*="excerpt"], [class*="summary"], [class*="description"]').first().text().trim() ||
      ''
    ).slice(0, 500)
  }

  private extractContent($el: cheerio.Cheerio<cheerio.Element>, $: cheerio.CheerioAPI): string {
    return (
      $el.find('.content, .body, .text, .event-details').text().trim() ||
      $el.text().trim()
    ).slice(0, 2000)
  }

  private extractImage($el: cheerio.Cheerio<cheerio.Element>, $: cheerio.CheerioAPI, baseUrl: string): string | undefined {
    const imgSrc = $el.find('img').first().attr('src') ||
                   $el.find('[class*="image"], [class*="photo"]').find('img').first().attr('src')
    
    if (imgSrc) {
      return imgSrc.startsWith('http') ? imgSrc : new URL(imgSrc, baseUrl).href
    }
    return undefined
  }

  private extractAuthor($el: cheerio.Cheerio<cheerio.Element>, $: cheerio.CheerioAPI): string {
    return (
      $el.find('.author, .by, .byline, [class*="author"]').first().text().trim() ||
      $el.find('[rel="author"]').first().text().trim() ||
      ''
    )
  }

  private extractDate($el: cheerio.Cheerio<cheerio.Element>, $: cheerio.CheerioAPI): Date | undefined {
    const dateStr = (
      $el.find('time').first().attr('datetime') ||
      $el.find('.date, .published, [class*="date"]').first().text().trim() ||
      $el.attr('data-date') ||
      ''
    )

    if (dateStr) {
      const date = new Date(dateStr)
      return isNaN(date.getTime()) ? undefined : date
    }
    return undefined
  }

  private extractTagsFromHTML($el: cheerio.Cheerio<cheerio.Element>, $: cheerio.CheerioAPI): string[] {
    const tags = []
    $el.find('.tag, .category, .label, [class*="tag"], [class*="category"]').each((i, tagEl) => {
      const tag = $(tagEl).text().trim()
      if (tag && tags.length < 10) {
        tags.push(tag)
      }
    })
    return tags
  }

  private isEventPlatform(url: string): boolean {
    const eventPlatforms = ['eventbrite', 'meetup', 'facebook.com/events', 'eventful']
    return eventPlatforms.some(platform => url.includes(platform))
  }

  private async scrapeEvents($: cheerio.CheerioAPI, url: string): Promise<any[]> {
    const events = []

    // Eventbrite-specific scraping
    if (url.includes('eventbrite')) {
      $('.search-event-card, .event-card, [data-event-id]').each((i, element) => {
        if (i >= 10) return false

        const $event = $(element)
        const title = $event.find('.event-title, h3, h2').first().text().trim()
        const description = $event.find('.event-description, .summary').first().text().trim()
        const date = $event.find('.event-date, time').first().text().trim()
        const location = $event.find('.event-location, .venue').first().text().trim()

        if (title && title.length > 5) {
          events.push({
            title,
            description: description || `Event: ${title}`,
            content: `${description}\nDate: ${date}\nLocation: ${location}`,
            originalUrl: url,
            author: 'Eventbrite',
            publishedAt: new Date(),
            tags: ['event', 'community']
          })
        }
      })
    }

    // Meetup-specific scraping
    else if (url.includes('meetup')) {
      $('.event-card, [data-event-id], .eventCard').each((i, element) => {
        if (i >= 10) return false

        const $event = $(element)
        const title = $event.find('h3, h2, .event-title').first().text().trim()
        const description = $event.find('.event-description, .description').first().text().trim()
        const date = $event.find('.event-time, time').first().text().trim()

        if (title && title.length > 5) {
          events.push({
            title,
            description: description || `Meetup: ${title}`,
            content: `${description}\nDate: ${date}`,
            originalUrl: url,
            author: 'Meetup',
            publishedAt: new Date(),
            tags: ['event', 'meetup', 'community']
          })
        }
      })
    }

    return events
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    await ragService.initialize()
    const scraper = new BlkoutScraper()

    if (req.method === 'POST') {
      const { sources, immediate = false } = req.body

      if (!sources || !Array.isArray(sources)) {
        return res.status(400).json({
          success: false,
          error: 'Sources array is required'
        })
      }

      const results = []

      for (const source of sources) {
        try {
          console.log(`Processing source: ${source.url} (${source.type})`)
          
          let rawContent = []

          // Scrape based on source type
          if (source.type === 'rss') {
            rawContent = await scraper.scrapeRSSFeed(source.url)
          } else if (source.type === 'website') {
            rawContent = await scraper.scrapeWebsite(source.url)
          }

          // Process each content item through the RAG pipeline
          const processedItems = []
          
          for (const item of rawContent) {
            try {
              // Add source information
              item.sourceId = source.id
              item.id = `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

              // Run through RAG pipeline if immediate processing requested
              if (immediate) {
                const classified = await ragService.classifyContent(item)
                const validation = await ragService.validateContent(classified)
                
                if (validation.isValid) {
                  await ragService.storeContent(classified)
                  const autoApproved = await ragService.processForAutoApproval(classified, validation)
                  
                  processedItems.push({
                    ...item,
                    category: classified.category,
                    relevanceScore: classified.relevanceScore,
                    validationScore: validation.score,
                    autoApproved,
                    status: autoApproved ? 'published' : 'pending_review'
                  })
                }
              } else {
                // Just return scraped content for review
                processedItems.push(item)
              }
            } catch (itemError) {
              console.error(`Error processing item: ${item.title}`, itemError)
              processedItems.push({
                ...item,
                status: 'error',
                error: itemError.message
              })
            }
          }

          // Update source last_checked timestamp
          if (source.id) {
            await supabase
              .from('content_sources')
              .update({ last_checked: new Date().toISOString() })
              .eq('id', source.id)
          }

          results.push({
            source: source.url,
            type: source.type,
            scraped: rawContent.length,
            processed: processedItems.length,
            items: immediate ? processedItems : processedItems.slice(0, 5) // Limit preview if not immediate
          })

        } catch (sourceError) {
          console.error(`Error processing source ${source.url}:`, sourceError)
          results.push({
            source: source.url,
            type: source.type,
            status: 'error',
            error: sourceError.message
          })
        }
      }

      const totalScraped = results.reduce((sum, r) => sum + (r.scraped || 0), 0)
      const totalProcessed = results.reduce((sum, r) => sum + (r.processed || 0), 0)

      res.status(200).json({
        success: true,
        message: `Scraped ${totalScraped} items from ${sources.length} sources`,
        results,
        summary: {
          sources: sources.length,
          totalScraped,
          totalProcessed,
          immediate
        }
      })
    }
    else if (req.method === 'GET') {
      // Get scraping status and recent activity
      const { data: recentSources, error } = await supabase
        .from('content_sources')
        .select('*')
        .not('last_checked', 'is', null)
        .order('last_checked', { ascending: false })
        .limit(10)

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      res.status(200).json({
        success: true,
        service: 'BLKOUT Enhanced Scraping Service',
        capabilities: [
          'RSS Feed Parsing',
          'Website Content Extraction',
          'Event Platform Integration',
          'Smart Content Classification',
          'Duplicate Detection',
          'Community Relevance Scoring'
        ],
        recentActivity: recentSources.map(source => ({
          url: source.url,
          type: source.type,
          lastChecked: source.last_checked,
          credibilityScore: source.credibility_score,
          communityVerified: source.community_verified
        }))
      })
    }
    else {
      res.status(405).json({
        success: false,
        error: 'Method not allowed'
      })
    }
  } catch (error) {
    console.error('Scraping API error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    })
  }
}