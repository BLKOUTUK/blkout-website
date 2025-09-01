// BLKOUTUK.com Article Migration System
// Migrates articles from blkoutuk.com to the new community platform

import { supabase } from './supabase'
import * as cheerio from 'cheerio'
import type { NewsArticle } from '../types/supabase'

export interface BlkoutUKArticle {
  title: string
  slug: string
  published_date: string
  featured_image?: string
  content: string
  excerpt: string
  author?: string
  category: 'READ' | 'LISTEN' | 'WATCH' | 'GALLERY' | 'EVENT' | 'REPORT'
  tags: string[]
  source_url: string
  hashtags?: string[]
}

export interface MigrationResult {
  success: boolean
  articlesProcessed: number
  articlesImported: number
  errors: string[]
  skipped: BlkoutUKArticle[]
  imported: NewsArticle[]
}

export class BlkoutUKMigration {
  private baseUrl = 'https://blkoutuk.com'
  private batchSize = 10

  /**
   * Discover all articles on blkoutuk.com
   */
  async discoverArticles(): Promise<BlkoutUKArticle[]> {
    const articles: BlkoutUKArticle[] = []
    
    try {
      console.log('🔍 Discovering articles from BLKOUTUK.com...')
      
      // Get homepage to find article links
      const homepageResponse = await fetch(this.baseUrl)
      const html = await homepageResponse.text()
      const $ = cheerio.load(html)
      
      // Extract article links from homepage
      const articleLinks: string[] = []
      
      // Common selectors for article links
      $('a[href*="/read/"], a[href*="/article/"], a[href*="/story/"], a[href*="/post/"]').each((i, el) => {
        const href = $(el).attr('href')
        if (href && !articleLinks.includes(href)) {
          articleLinks.push(href.startsWith('http') ? href : `${this.baseUrl}${href}`)
        }
      })
      
      // Also check navigation menus for blog/read sections
      $('.menu a, nav a, .navigation a').each((i, el) => {
        const href = $(el).attr('href')
        const text = $(el).text().toLowerCase()
        
        if (href && (text.includes('read') || text.includes('blog') || text.includes('stories'))) {
          const fullUrl = href.startsWith('http') ? href : `${this.baseUrl}${href}`
          if (!articleLinks.includes(fullUrl)) {
            articleLinks.push(fullUrl)
          }
        }
      })
      
      console.log(`📄 Found ${articleLinks.length} potential article links`)
      
      // Process each article link
      for (const link of articleLinks.slice(0, 50)) { // Limit for initial migration
        try {
          const article = await this.extractArticleData(link)
          if (article) {
            articles.push(article)
          }
        } catch (error) {
          console.warn(`Failed to extract article from ${link}:`, error)
        }
      }
      
      console.log(`✅ Successfully discovered ${articles.length} articles`)
      return articles
      
    } catch (error) {
      console.error('Failed to discover articles:', error)
      throw error
    }
  }

  /**
   * Extract article data from a single URL
   */
  private async extractArticleData(url: string): Promise<BlkoutUKArticle | null> {
    try {
      const response = await fetch(url)
      if (!response.ok) return null
      
      const html = await response.text()
      const $ = cheerio.load(html)
      
      // Extract article metadata
      const title = this.extractTitle($)
      if (!title) return null
      
      const content = this.extractContent($)
      if (!content) return null
      
      const article: BlkoutUKArticle = {
        title,
        slug: this.generateSlug(title),
        published_date: this.extractPublishedDate($) || new Date().toISOString(),
        featured_image: this.extractFeaturedImage($),
        content,
        excerpt: this.generateExcerpt(content),
        author: this.extractAuthor($),
        category: this.categorizeArticle(title, content),
        tags: this.extractTags($, content),
        source_url: url,
        hashtags: this.extractHashtags(content)
      }
      
      return article
      
    } catch (error) {
      console.error(`Failed to extract article data from ${url}:`, error)
      return null
    }
  }

  /**
   * Extract article title from various selectors
   */
  private extractTitle($: cheerio.CheerioAPI): string | null {
    const titleSelectors = [
      'h1',
      '.post-title',
      '.article-title',
      '.entry-title',
      'meta[property="og:title"]',
      'title'
    ]
    
    for (const selector of titleSelectors) {
      const title = $(selector).first().text().trim() || $(selector).attr('content')?.trim()
      if (title && title.length > 5) {
        return title
      }
    }
    
    return null
  }

  /**
   * Extract main article content
   */
  private extractContent($: cheerio.CheerioAPI): string | null {
    const contentSelectors = [
      '.post-content',
      '.article-content',
      '.entry-content',
      '.content',
      'main article',
      '.story-body'
    ]
    
    for (const selector of contentSelectors) {
      const content = $(selector).first().html()
      if (content && content.length > 100) {
        // Clean up HTML
        const $content = cheerio.load(content)
        $content('script, style, .ads, .advertisement').remove()
        return $content.html() || content
      }
    }
    
    return null
  }

  /**
   * Extract published date
   */
  private extractPublishedDate($: cheerio.CheerioAPI): string | null {
    const dateSelectors = [
      'meta[property="article:published_time"]',
      'meta[name="publication-date"]',
      '.published-date',
      '.post-date',
      'time[datetime]'
    ]
    
    for (const selector of dateSelectors) {
      const dateStr = $(selector).attr('content') || $(selector).attr('datetime') || $(selector).text().trim()
      if (dateStr) {
        const date = new Date(dateStr)
        if (!isNaN(date.getTime())) {
          return date.toISOString()
        }
      }
    }
    
    return null
  }

  /**
   * Extract featured image
   */
  private extractFeaturedImage($: cheerio.CheerioAPI): string | undefined {
    const imageSelectors = [
      'meta[property="og:image"]',
      '.featured-image img',
      '.post-thumbnail img',
      'article img:first-of-type'
    ]
    
    for (const selector of imageSelectors) {
      const src = $(selector).attr('content') || $(selector).attr('src')
      if (src) {
        return src.startsWith('http') ? src : `${this.baseUrl}${src}`
      }
    }
    
    return undefined
  }

  /**
   * Extract or infer author
   */
  private extractAuthor($: cheerio.CheerioAPI): string | undefined {
    const authorSelectors = [
      'meta[name="author"]',
      '.author-name',
      '.post-author',
      '.byline'
    ]
    
    for (const selector of authorSelectors) {
      const author = $(selector).attr('content') || $(selector).text().trim()
      if (author && author.length > 2) {
        return author
      }
    }
    
    return 'BLKOUTUK'
  }

  /**
   * Categorize article based on content analysis
   */
  private categorizeArticle(title: string, content: string): BlkoutUKArticle['category'] {
    const text = `${title} ${content}`.toLowerCase()
    
    if (text.includes('listen') || text.includes('podcast') || text.includes('audio')) return 'LISTEN'
    if (text.includes('watch') || text.includes('video') || text.includes('film')) return 'WATCH'
    if (text.includes('gallery') || text.includes('photos') || text.includes('images')) return 'GALLERY'
    if (text.includes('event') || text.includes('happening') || text.includes('attend')) return 'EVENT'
    if (text.includes('report') || text.includes('investigation') || text.includes('findings')) return 'REPORT'
    
    return 'READ'
  }

  /**
   * Extract tags from content and HTML
   */
  private extractTags($: cheerio.CheerioAPI, content: string): string[] {
    const tags: string[] = []
    
    // Extract from meta tags
    $('meta[name="keywords"]').each((i, el) => {
      const keywords = $(el).attr('content')?.split(',').map(k => k.trim()) || []
      tags.push(...keywords)
    })
    
    // Extract from content themes
    const contentThemes = [
      'community', 'culture', 'health', 'wellness', 'activism', 'liberation',
      'trans', 'queer', 'black', 'uk', 'london', 'manchester', 'birmingham',
      'organizing', 'solidarity', 'justice', 'pride', 'visibility'
    ]
    
    const textContent = content.toLowerCase()
    contentThemes.forEach(theme => {
      if (textContent.includes(theme) && !tags.includes(theme)) {
        tags.push(theme)
      }
    })
    
    return [...new Set(tags)].slice(0, 10) // Dedupe and limit
  }

  /**
   * Extract hashtags from content
   */
  private extractHashtags(content: string): string[] {
    const hashtagRegex = /#([a-zA-Z0-9_]+)/g
    const matches = content.match(hashtagRegex) || []
    return [...new Set(matches)]
  }

  /**
   * Generate excerpt from content
   */
  private generateExcerpt(content: string, maxLength = 200): string {
    const text = cheerio.load(content).text().trim()
    if (text.length <= maxLength) return text
    
    const truncated = text.substring(0, maxLength)
    const lastSpace = truncated.lastIndexOf(' ')
    return lastSpace > maxLength * 0.8 
      ? truncated.substring(0, lastSpace) + '...'
      : truncated + '...'
  }

  /**
   * Generate URL slug from title
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100)
  }

  /**
   * Convert BLKOUTUK article to NewsArticle format
   */
  private convertToNewsArticle(blkoutukArticle: BlkoutUKArticle): Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'> {
    return {
      title: blkoutukArticle.title,
      slug: blkoutukArticle.slug,
      excerpt: blkoutukArticle.excerpt,
      content: blkoutukArticle.content,
      featured_image: blkoutukArticle.featured_image || null,
      published_at: blkoutukArticle.published_date,
      author: blkoutukArticle.author || 'BLKOUTUK',
      category: this.mapCategoryToNewsroomCategory(blkoutukArticle.category),
      tags: blkoutukArticle.tags,
      status: 'published',
      source_url: blkoutukArticle.source_url,
      submitted_via: 'blkoutuk-migration',
      moderated_at: new Date().toISOString(),
      moderated_by: 'migration-system'
    }
  }

  /**
   * Map BLKOUTUK categories to newsroom categories
   */
  private mapCategoryToNewsroomCategory(category: BlkoutUKArticle['category']): string {
    const categoryMap = {
      'READ': 'Community',
      'LISTEN': 'Media & Storytelling',
      'WATCH': 'Media & Storytelling',
      'GALLERY': 'Arts & Culture',
      'EVENT': 'Community',
      'REPORT': 'History & Culture'
    }
    
    return categoryMap[category] || 'Community'
  }

  /**
   * Migrate articles in batches
   */
  async migrateArticles(articles: BlkoutUKArticle[]): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: true,
      articlesProcessed: 0,
      articlesImported: 0,
      errors: [],
      skipped: [],
      imported: []
    }

    console.log(`🚀 Starting migration of ${articles.length} articles...`)

    // Process in batches to avoid overwhelming the database
    for (let i = 0; i < articles.length; i += this.batchSize) {
      const batch = articles.slice(i, i + this.batchSize)
      
      try {
        await this.processBatch(batch, result)
      } catch (error) {
        console.error(`Batch ${Math.floor(i / this.batchSize) + 1} failed:`, error)
        result.errors.push(`Batch ${Math.floor(i / this.batchSize) + 1} failed: ${error}`)
        result.success = false
      }
    }

    console.log(`✅ Migration complete: ${result.articlesImported}/${result.articlesProcessed} articles imported`)
    
    return result
  }

  /**
   * Process a batch of articles
   */
  private async processBatch(articles: BlkoutUKArticle[], result: MigrationResult): Promise<void> {
    for (const article of articles) {
      result.articlesProcessed++
      
      try {
        // Check if article already exists
        const { data: existing } = await supabase
          .from('articles')
          .select('id')
          .eq('source_url', article.source_url)
          .single()

        if (existing) {
          console.log(`⏭️  Skipping existing article: ${article.title}`)
          result.skipped.push(article)
          continue
        }

        // Convert and insert article
        const newsArticle = this.convertToNewsArticle(article)
        
        const { data: inserted, error } = await supabase
          .from('articles')
          .insert([newsArticle])
          .select()
          .single()

        if (error) throw error

        result.articlesImported++
        result.imported.push(inserted)
        console.log(`✅ Imported: ${article.title}`)
        
      } catch (error) {
        console.error(`Failed to import article "${article.title}":`, error)
        result.errors.push(`Failed to import "${article.title}": ${error}`)
        result.skipped.push(article)
      }
    }
  }

  /**
   * Create backup before migration
   */
  async createPreMigrationBackup(): Promise<any> {
    try {
      console.log('💾 Creating pre-migration backup...')
      
      const { data: articles, error } = await supabase
        .from('articles')
        .select('*')

      if (error) throw error

      const backup = {
        timestamp: new Date().toISOString(),
        type: 'pre-blkoutuk-migration',
        articleCount: articles.length,
        articles
      }

      // Store backup (in production, this would go to file storage)
      console.log(`💾 Backup created: ${backup.articleCount} articles`)
      return backup
      
    } catch (error) {
      console.error('Failed to create backup:', error)
      throw error
    }
  }

  /**
   * Full migration workflow
   */
  async runFullMigration(): Promise<MigrationResult> {
    try {
      // Step 1: Create backup
      const backup = await this.createPreMigrationBackup()
      
      // Step 2: Discover articles
      const articles = await this.discoverArticles()
      
      if (articles.length === 0) {
        console.log('⚠️  No articles found to migrate')
        return {
          success: true,
          articlesProcessed: 0,
          articlesImported: 0,
          errors: [],
          skipped: [],
          imported: []
        }
      }

      // Step 3: Migrate articles
      const result = await this.migrateArticles(articles)
      
      console.log('🎉 BLKOUTUK.com migration complete!')
      console.log(`📊 Results:`)
      console.log(`   • Articles processed: ${result.articlesProcessed}`)
      console.log(`   • Articles imported: ${result.articlesImported}`)
      console.log(`   • Articles skipped: ${result.skipped.length}`)
      console.log(`   • Errors: ${result.errors.length}`)
      
      return result
      
    } catch (error) {
      console.error('Migration failed:', error)
      throw error
    }
  }
}