#!/usr/bin/env tsx
// BLKOUTUK.com Migration CLI Script
// Run with: npx tsx scripts/migrate-blkoutuk.ts [options]

import { createClient } from '@supabase/supabase-js'
import * as cheerio from 'cheerio'
import { program } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import inquirer from 'inquirer'
import fs from 'fs'
import path from 'path'

// Standalone migration interfaces and classes for CLI use
interface BlkoutUKArticle {
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

interface MigrationResult {
  success: boolean
  articlesProcessed: number
  articlesImported: number
  errors: string[]
  skipped: BlkoutUKArticle[]
  imported: any[]
}

class CLIBlkoutUKMigration {
  private baseUrl = 'https://blkoutuk.com'
  private batchSize = 10
  private supabase: any

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  async discoverArticles(): Promise<BlkoutUKArticle[]> {
    const articles: BlkoutUKArticle[] = []
    
    try {
      console.log('🔍 Discovering ALL articles from BLKOUTUK.com using WordPress API...')
      
      let page = 1
      const perPage = 100 // WordPress API max per page
      let hasMorePages = true
      
      while (hasMorePages) {
        console.log(`📄 Fetching page ${page} (up to ${perPage} articles per page)...`)
        
        const apiUrl = `${this.baseUrl}/wp-json/wp/v2/posts?per_page=${perPage}&page=${page}&status=publish`
        const response = await fetch(apiUrl)
        
        if (!response.ok) {
          if (response.status === 400 && page > 1) {
            // No more pages available
            console.log(`✅ Reached end of articles at page ${page - 1}`)
            break
          }
          throw new Error(`API request failed: ${response.status}`)
        }
        
        const posts = await response.json()
        
        if (posts.length === 0) {
          hasMorePages = false
          break
        }
        
        console.log(`📄 Found ${posts.length} posts on page ${page}`)
        
        // Process each post
        for (const post of posts) {
          try {
            const article = await this.convertWordPressPost(post)
            if (article) {
              articles.push(article)
            }
          } catch (error) {
            console.warn(`Failed to convert post ${post.id}:`, error)
          }
        }
        
        // Check if we have fewer posts than requested, indicating last page
        if (posts.length < perPage) {
          hasMorePages = false
        } else {
          page++
        }
        
        // Add small delay to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      
      console.log(`✅ Successfully discovered ${articles.length} articles across ${page} pages`)
      console.log(`📊 Article breakdown:`)
      
      // Show article categories breakdown
      const categories = articles.reduce((acc, article) => {
        acc[article.category] = (acc[article.category] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      Object.entries(categories).forEach(([category, count]) => {
        console.log(`  • ${category}: ${count} articles`)
      })
      
      return articles
      
    } catch (error) {
      console.error('Failed to discover articles:', error)
      throw error
    }
  }

  private async convertWordPressPost(post: any): Promise<BlkoutUKArticle | null> {
    try {
      // Skip password-protected posts
      if (post.content.protected) {
        console.log(`Skipping password-protected post: ${post.title.rendered}`)
        return null
      }

      // Extract content, skip if empty
      const content = post.content.rendered
      if (!content || content.trim().length < 100) {
        console.log(`Skipping post with insufficient content: ${post.title.rendered}`)
        return null
      }

      const article: BlkoutUKArticle = {
        title: post.title.rendered,
        slug: post.slug,
        published_date: post.date_gmt,
        featured_image: post.jetpack_featured_media_url || undefined,
        content: content,
        excerpt: post.excerpt.rendered || this.generateExcerpt(content),
        author: 'BLKOUTUK',
        category: 'READ', // Default category, could be enhanced with WordPress category mapping
        tags: await this.getWordPressPostTags(post.id),
        source_url: post.link,
        hashtags: this.extractHashtags(content)
      }
      
      return article
      
    } catch (error) {
      console.error(`Failed to convert WordPress post:`, error)
      return null
    }
  }

  private async getWordPressPostTags(postId: number): Promise<string[]> {
    try {
      // Get tags for this post
      const tagResponse = await fetch(`${this.baseUrl}/wp-json/wp/v2/tags?post=${postId}`)
      if (tagResponse.ok) {
        const tags = await tagResponse.json()
        return tags.map((tag: any) => tag.name)
      }
    } catch (error) {
      console.warn('Failed to get WordPress tags:', error)
    }
    return ['community', 'blkout', 'black', 'queer'] // Default tags
  }

  private async extractArticleData(url: string): Promise<BlkoutUKArticle | null> {
    try {
      const response = await fetch(url)
      if (!response.ok) return null
      
      const html = await response.text()
      const $ = cheerio.load(html)
      
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

  private extractTitle($: cheerio.CheerioAPI): string | null {
    const titleSelectors = ['h1', '.post-title', '.article-title', '.entry-title', 'meta[property="og:title"]', 'title']
    
    for (const selector of titleSelectors) {
      const title = $(selector).first().text().trim() || $(selector).attr('content')?.trim()
      if (title && title.length > 5) {
        return title
      }
    }
    
    return null
  }

  private extractContent($: cheerio.CheerioAPI): string | null {
    const contentSelectors = ['.post-content', '.article-content', '.entry-content', '.content', 'main article', '.story-body']
    
    for (const selector of contentSelectors) {
      const content = $(selector).first().html()
      if (content && content.length > 100) {
        const $content = cheerio.load(content)
        $content('script, style, .ads, .advertisement').remove()
        return $content.html() || content
      }
    }
    
    return null
  }

  private extractPublishedDate($: cheerio.CheerioAPI): string | null {
    const dateSelectors = ['meta[property="article:published_time"]', 'meta[name="publication-date"]', '.published-date', '.post-date', 'time[datetime]']
    
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

  private extractFeaturedImage($: cheerio.CheerioAPI): string | undefined {
    const imageSelectors = ['meta[property="og:image"]', '.featured-image img', '.post-thumbnail img', 'article img:first-of-type']
    
    for (const selector of imageSelectors) {
      const src = $(selector).attr('content') || $(selector).attr('src')
      if (src) {
        return src.startsWith('http') ? src : `${this.baseUrl}${src}`
      }
    }
    
    return undefined
  }

  private extractAuthor($: cheerio.CheerioAPI): string | undefined {
    const authorSelectors = ['meta[name="author"]', '.author-name', '.post-author', '.byline']
    
    for (const selector of authorSelectors) {
      const author = $(selector).attr('content') || $(selector).text().trim()
      if (author && author.length > 2) {
        return author
      }
    }
    
    return 'BLKOUTUK'
  }

  private categorizeArticle(title: string, content: string): BlkoutUKArticle['category'] {
    const text = `${title} ${content}`.toLowerCase()
    
    if (text.includes('listen') || text.includes('podcast') || text.includes('audio')) return 'LISTEN'
    if (text.includes('watch') || text.includes('video') || text.includes('film')) return 'WATCH'
    if (text.includes('gallery') || text.includes('photos') || text.includes('images')) return 'GALLERY'
    if (text.includes('event') || text.includes('happening') || text.includes('attend')) return 'EVENT'
    if (text.includes('report') || text.includes('investigation') || text.includes('findings')) return 'REPORT'
    
    return 'READ'
  }

  private extractTags($: cheerio.CheerioAPI, content: string): string[] {
    const tags: string[] = []
    
    $('meta[name="keywords"]').each((i, el) => {
      const keywords = $(el).attr('content')?.split(',').map(k => k.trim()) || []
      tags.push(...keywords)
    })
    
    const contentThemes = ['community', 'culture', 'health', 'wellness', 'activism', 'liberation', 'trans', 'queer', 'black', 'uk', 'london', 'manchester', 'birmingham', 'organizing', 'solidarity', 'justice', 'pride', 'visibility']
    
    const textContent = content.toLowerCase()
    contentThemes.forEach(theme => {
      if (textContent.includes(theme) && !tags.includes(theme)) {
        tags.push(theme)
      }
    })
    
    return [...new Set(tags)].slice(0, 10)
  }

  private extractHashtags(content: string): string[] {
    const hashtagRegex = /#([a-zA-Z0-9_]+)/g
    const matches = content.match(hashtagRegex) || []
    return [...new Set(matches)]
  }

  private generateExcerpt(content: string, maxLength = 200): string {
    const text = cheerio.load(content).text().trim()
    if (text.length <= maxLength) return text
    
    const truncated = text.substring(0, maxLength)
    const lastSpace = truncated.lastIndexOf(' ')
    return lastSpace > maxLength * 0.8 
      ? truncated.substring(0, lastSpace) + '...'
      : truncated + '...'
  }

  private generateSlug(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 100)
  }

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

    for (const article of articles) {
      result.articlesProcessed++
      
      try {
        // Check if article already exists
        const { data: existing } = await this.supabase
          .from('newsroom_articles')
          .select('id')
          .eq('source_url', article.source_url)
          .single()

        if (existing) {
          console.log(`⏭️  Skipping existing article: ${article.title}`)
          result.skipped.push(article)
          continue
        }

        // Convert and insert article
        const newsArticle = {
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          featured_image: article.featured_image || null,
          published_at: article.published_date,
          status: 'draft', // Start as draft to avoid RLS issues
          source_url: article.source_url,
          community_funded: false,
          liberation_score: null,
          moderated_at: new Date().toISOString(),
          moderated_by: null, // No specific moderator for auto-migration
          moderation_reason: 'Auto-migrated from BLKOUTUK.com'
        }
        
        const { data: inserted, error } = await this.supabase
          .from('newsroom_articles')
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

    console.log(`✅ Migration complete: ${result.articlesImported}/${result.articlesProcessed} articles imported`)
    return result
  }

  async createPreMigrationBackup(): Promise<any> {
    try {
      console.log('💾 Creating pre-migration backup...')
      
      const { data: articles, error } = await this.supabase
        .from('newsroom_articles')
        .select('*')

      if (error) throw error

      const backup = {
        timestamp: new Date().toISOString(),
        type: 'pre-blkoutuk-migration',
        articleCount: articles.length,
        articles
      }

      console.log(`💾 Backup created: ${backup.articleCount} articles`)
      return backup
      
    } catch (error) {
      console.error('Failed to create backup:', error)
      throw error
    }
  }
}

interface MigrationConfig {
  supabaseUrl: string
  supabaseKey: string
  batchSize: number
  backupPath: string
  dryRun: boolean
  verbose: boolean
}

class MigrationCLI {
  private config: MigrationConfig
  private migration: CLIBlkoutUKMigration

  constructor(config: MigrationConfig) {
    this.config = config
    this.migration = new CLIBlkoutUKMigration(config.supabaseUrl, config.supabaseKey)
  }

  async run() {
    console.log(chalk.blue.bold('🏛️  BLKOUTUK.com Article Migration Tool\n'))

    if (this.config.dryRun) {
      console.log(chalk.yellow('🔍 Running in DRY RUN mode - no data will be modified\n'))
    }

    try {
      // Step 1: Validate connection
      await this.validateConnection()

      // Step 2: Discovery
      const articles = await this.discoverArticles()
      
      if (articles.length === 0) {
        console.log(chalk.yellow('⚠️  No articles found to migrate'))
        return
      }

      // Step 3: Confirm migration
      if (!this.config.dryRun) {
        const confirmed = await this.confirmMigration(articles.length)
        if (!confirmed) {
          console.log(chalk.gray('Migration cancelled'))
          return
        }
      }

      // Step 4: Create backup
      if (!this.config.dryRun) {
        await this.createBackup()
      }

      // Step 5: Run migration
      const result = await this.runMigration(articles)

      // Step 6: Report results
      this.reportResults(result)

    } catch (error) {
      console.error(chalk.red.bold('❌ Migration failed:'), error)
      process.exit(1)
    }
  }

  private async validateConnection() {
    const spinner = ora('Validating Supabase connection...').start()
    
    try {
      const supabase = createClient(this.config.supabaseUrl, this.config.supabaseKey)
      const { error } = await supabase.from('articles').select('count', { count: 'exact', head: true })
      
      if (error) throw error
      
      spinner.succeed('Supabase connection validated')
    } catch (error) {
      spinner.fail('Failed to connect to Supabase')
      throw error
    }
  }

  private async discoverArticles() {
    const spinner = ora('Discovering articles from BLKOUTUK.com...').start()
    
    try {
      const articles = await this.migration.discoverArticles()
      
      if (this.config.verbose) {
        spinner.info(`Found ${articles.length} articles:`)
        articles.slice(0, 5).forEach(article => {
          console.log(chalk.gray(`  • ${article.title} (${article.category})`))
        })
        if (articles.length > 5) {
          console.log(chalk.gray(`  ... and ${articles.length - 5} more`))
        }
        console.log()
      }
      
      spinner.succeed(`Discovered ${articles.length} articles`)
      return articles
      
    } catch (error) {
      spinner.fail('Failed to discover articles')
      throw error
    }
  }

  private async confirmMigration(articleCount: number): Promise<boolean> {
    console.log(chalk.yellow(`⚠️  About to migrate ${articleCount} articles from BLKOUTUK.com`))
    console.log(chalk.yellow('   This will import articles into your community platform database'))
    console.log()

    const { confirmed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: 'Do you want to continue with the migration?',
        default: false
      }
    ])

    return confirmed
  }

  private async createBackup() {
    const spinner = ora('Creating pre-migration backup...').start()
    
    try {
      const backup = await this.migration.createPreMigrationBackup()
      
      // Save backup to file
      const backupFile = path.join(this.config.backupPath, `blkoutuk-migration-backup-${Date.now()}.json`)
      await fs.promises.mkdir(path.dirname(backupFile), { recursive: true })
      await fs.promises.writeFile(backupFile, JSON.stringify(backup, null, 2))
      
      spinner.succeed(`Backup created: ${backupFile}`)
      
    } catch (error) {
      spinner.fail('Failed to create backup')
      throw error
    }
  }

  private async runMigration(articles: any[]) {
    if (this.config.dryRun) {
      console.log(chalk.blue('🔍 DRY RUN: Would migrate the following articles:'))
      articles.forEach((article, index) => {
        console.log(chalk.gray(`${index + 1}. ${article.title}`))
        console.log(chalk.gray(`   Category: ${article.category} | Tags: ${article.tags.join(', ')}`))
        console.log(chalk.gray(`   Published: ${new Date(article.published_date).toLocaleDateString()}`))
        console.log()
      })
      
      return {
        success: true,
        articlesProcessed: articles.length,
        articlesImported: articles.length,
        errors: [],
        skipped: [],
        imported: articles
      }
    }

    const spinner = ora('Migrating articles...').start()
    
    try {
      // Update spinner with progress
      const originalMigrateArticles = this.migration.migrateArticles.bind(this.migration)
      
      let processed = 0
      this.migration.migrateArticles = async (articles: any[]) => {
        const result = await originalMigrateArticles(articles)
        processed = result.articlesProcessed
        spinner.text = `Migrating articles... ${processed}/${articles.length}`
        return result
      }
      
      const result = await this.migration.migrateArticles(articles)
      
      if (result.success) {
        spinner.succeed(`Migration completed: ${result.articlesImported}/${result.articlesProcessed} articles imported`)
      } else {
        spinner.warn(`Migration completed with errors: ${result.articlesImported}/${result.articlesProcessed} articles imported`)
      }
      
      return result
      
    } catch (error) {
      spinner.fail('Migration failed')
      throw error
    }
  }

  private reportResults(result: any) {
    console.log()
    console.log(chalk.bold('📊 Migration Results:'))
    console.log()

    // Success metrics
    console.log(chalk.green('✅ Success:'))
    console.log(`   • Articles imported: ${result.articlesImported}`)
    
    if (result.skipped.length > 0) {
      console.log(chalk.yellow('⏭️  Skipped:'))
      console.log(`   • Already existed: ${result.skipped.length}`)
      
      if (this.config.verbose && result.skipped.length > 0) {
        console.log(chalk.gray('   Skipped articles:'))
        result.skipped.slice(0, 3).forEach((article: any) => {
          console.log(chalk.gray(`     • ${article.title}`))
        })
        if (result.skipped.length > 3) {
          console.log(chalk.gray(`     ... and ${result.skipped.length - 3} more`))
        }
      }
    }

    if (result.errors.length > 0) {
      console.log(chalk.red('❌ Errors:'))
      console.log(`   • Failed imports: ${result.errors.length}`)
      
      if (this.config.verbose) {
        console.log(chalk.red('   Error details:'))
        result.errors.slice(0, 3).forEach((error: string) => {
          console.log(chalk.red(`     • ${error}`))
        })
        if (result.errors.length > 3) {
          console.log(chalk.red(`     ... and ${result.errors.length - 3} more errors`))
        }
      }
    }

    // Next steps
    console.log()
    console.log(chalk.blue('🚀 Next Steps:'))
    console.log('   • Check your newsroom to verify imported articles')
    console.log('   • Review the story archive for proper categorization')
    console.log('   • Consider running moderation review for imported content')
    console.log()

    if (result.success && result.articlesImported > 0) {
      console.log(chalk.green.bold('🎉 Migration completed successfully!'))
    } else if (result.articlesImported > 0) {
      console.log(chalk.yellow.bold('⚠️  Migration completed with some issues'))
    } else {
      console.log(chalk.red.bold('❌ Migration failed - no articles imported'))
    }
  }
}

// CLI Configuration
program
  .name('migrate-blkoutuk')
  .description('Migrate articles from BLKOUTUK.com to community platform')
  .version('1.0.0')
  .option('-d, --dry-run', 'Run migration without making changes')
  .option('-v, --verbose', 'Enable verbose output')
  .option('--supabase-url <url>', 'Supabase project URL')
  .option('--supabase-key <key>', 'Supabase anon key')
  .option('--batch-size <size>', 'Batch size for migration', '10')
  .option('--backup-path <path>', 'Backup directory path', './backups')
  .parse()

async function main() {
  const options = program.opts()
  
  // Load environment variables if not provided via CLI
  const config: MigrationConfig = {
    supabaseUrl: options.supabaseUrl || process.env.VITE_SUPABASE_URL || 'https://bgjengudzfickgomjqmz.supabase.co',
    supabaseKey: options.supabaseKey || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnamVuZ3VkemZpY2tnb21qcW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MTI3NjcsImV4cCI6MjA3MTE4ODc2N30.kYQ2oFuQBGmu4V_dnj_1zDMDVsd-qpDZJwNvswzO6M0',
    batchSize: parseInt(options.batchSize) || 10,
    backupPath: options.backupPath || './backups',
    dryRun: options.dryRun || false,
    verbose: options.verbose || false
  }

  // Validate required config
  if (!config.supabaseUrl || !config.supabaseKey) {
    console.error(chalk.red('❌ Missing required Supabase configuration'))
    console.error('   Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables')
    console.error('   Or use --supabase-url and --supabase-key options')
    process.exit(1)
  }

  const cli = new MigrationCLI(config)
  await cli.run()
}

// Handle errors gracefully
process.on('unhandledRejection', (error) => {
  console.error(chalk.red('Unhandled error:'), error)
  process.exit(1)
})

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error(chalk.red('Migration failed:'), error)
    process.exit(1)
  })
}

export { MigrationCLI }