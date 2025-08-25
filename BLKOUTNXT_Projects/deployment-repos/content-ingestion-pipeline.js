#!/usr/bin/env node

/**
 * IVOR Health Knowledge Ingestion Pipeline
 * Scrapes menrus.co.uk and builds queryable knowledge base
 */

import puppeteer from 'puppeteer';
import { createHash } from 'crypto';
import { Client } from 'pg';
import OpenAI from 'openai';
import * as cheerio from 'cheerio';

class HealthContentIngestion {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    this.db = new Client({
      connectionString: process.env.DATABASE_URL || 'postgresql://localhost/ivor_health'
    });
    
    this.baseUrl = 'https://menrus.co.uk';
    this.discoveredUrls = new Set();
    this.processedUrls = new Set();
  }

  async initialize() {
    await this.db.connect();
    console.log('📊 Connected to health knowledge database');
  }

  async scrapeHealthContent() {
    console.log('🕷️ Starting health content ingestion from menrus.co.uk...');
    
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      await page.setUserAgent('IVOR Health Assistant Content Indexer 1.0');
      
      // Start with main sections
      const startUrls = [
        `${this.baseUrl}/you`,
        `${this.baseUrl}/men`, 
        `${this.baseUrl}/body`,
        `${this.baseUrl}/sex`,
        `${this.baseUrl}/stis`,
        `${this.baseUrl}/drugs`
      ];

      for (const url of startUrls) {
        await this.processPage(page, url);
      }

      // Process discovered URLs
      for (const url of this.discoveredUrls) {
        if (!this.processedUrls.has(url)) {
          await this.processPage(page, url);
        }
      }

    } finally {
      await browser.close();
    }
    
    console.log(`✅ Completed ingestion: ${this.processedUrls.size} pages processed`);
  }

  async processPage(page, url) {
    try {
      console.log(`📄 Processing: ${url}`);
      
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      
      // Extract content
      const content = await page.evaluate(() => {
        // Remove navigation, ads, and other non-content elements
        const elementsToRemove = ['nav', '.advertisement', '.cookie-banner', 'footer'];
        elementsToRemove.forEach(selector => {
          document.querySelectorAll(selector).forEach(el => el.remove());
        });

        const title = document.querySelector('h1')?.textContent?.trim() || 
                     document.title || 'Untitled';
        
        // Get main content, prioritizing article/main sections
        const contentSelectors = ['main', 'article', '.content', '.main-content', 'body'];
        let mainContent = '';
        
        for (const selector of contentSelectors) {
          const element = document.querySelector(selector);
          if (element) {
            mainContent = element.innerText || element.textContent;
            break;
          }
        }

        // Extract links for further crawling
        const links = Array.from(document.querySelectorAll('a[href]'))
          .map(link => link.href)
          .filter(href => href.includes('menrus.co.uk') && 
                         !href.includes('#') && 
                         !href.includes('mailto:'));

        return {
          title,
          content: mainContent.trim(),
          links: [...new Set(links)], // Remove duplicates
          url: window.location.href
        };
      });

      // Add discovered links
      content.links.forEach(link => this.discoveredUrls.add(link));
      
      if (content.content.length > 100) { // Only process pages with substantial content
        await this.storeContent(content);
      }
      
      this.processedUrls.add(url);
      
      // Respectful crawling delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Error processing ${url}:`, error.message);
    }
  }

  async storeContent(pageData) {
    const { title, content, url } = pageData;
    
    // Generate content hash for change detection
    const contentHash = createHash('sha256').update(content).digest('hex');
    
    // Categorize content based on URL and content analysis
    const category = this.categorizeContent(url, content);
    const serviceStage = this.categorizeServiceStage(content);
    const tags = this.extractTags(content);
    const location = this.extractLocation(content);
    
    try {
      // Check if content already exists and hasn't changed
      const existingResult = await this.db.query(
        'SELECT id, content_hash FROM health_content WHERE url = $1',
        [url]
      );
      
      let contentId;
      
      if (existingResult.rows.length > 0) {
        const existing = existingResult.rows[0];
        if (existing.content_hash === contentHash) {
          console.log(`⚡ Content unchanged: ${url}`);
          return; // No changes, skip processing
        }
        
        // Update existing content
        await this.db.query(
          `UPDATE health_content 
           SET title = $1, content = $2, category = $3, service_stage = $4, tags = $5, 
               location = $6, content_hash = $7, last_scraped = NOW()
           WHERE url = $8 RETURNING id`,
          [title, content, category, serviceStage, tags, location, contentHash, url]
        );
        contentId = existing.id;
        
        // Remove old embeddings
        await this.db.query('DELETE FROM content_embeddings WHERE content_id = $1', [contentId]);
        
      } else {
        // Insert new content
        const result = await this.db.query(
          `INSERT INTO health_content (url, title, content, category, service_stage, tags, location, content_hash)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
          [url, title, content, category, serviceStage, tags, location, contentHash]
        );
        contentId = result.rows[0].id;
      }
      
      // Generate and store embeddings
      await this.generateEmbeddings(contentId, content);
      
      // Extract structured health services if applicable
      await this.extractHealthServices(contentId, content, url);
      
      console.log(`💾 Stored content: ${title} (ID: ${contentId})`);
      
    } catch (error) {
      console.error(`❌ Error storing content for ${url}:`, error);
    }
  }

  categorizeContent(url, content) {
    const urlLower = url.toLowerCase();
    const contentLower = content.toLowerCase();
    
    if (urlLower.includes('/stis') || contentLower.includes('hiv') || contentLower.includes('sti')) {
      return 'Sexual Health';
    } else if (contentLower.includes('prep') || contentLower.includes('prevention')) {
      return 'Prevention';
    } else if (contentLower.includes('testing') || contentLower.includes('clinic')) {
      return 'Testing';
    } else if (urlLower.includes('/you') || contentLower.includes('mental health')) {
      return 'Mental Health';
    } else if (urlLower.includes('/body') || contentLower.includes('fitness')) {
      return 'Physical Health';
    } else if (urlLower.includes('/drugs') || contentLower.includes('substance')) {
      return 'Substance Use';
    }
    
    return 'General Health';
  }

  categorizeServiceStage(content) {
    const contentLower = content.toLowerCase();
    
    // Long-term care and ongoing support patterns
    if (contentLower.includes('living with hiv') || 
        contentLower.includes('positive') || 
        contentLower.includes('treatment') ||
        contentLower.includes('medication') ||
        contentLower.includes('viral load') ||
        contentLower.includes('cd4') ||
        contentLower.includes('adherence')) {
      return 'Long_term_care';
    }
    
    // New diagnosis support
    if (contentLower.includes('newly diagnosed') || 
        contentLower.includes('just found out') ||
        contentLower.includes('recent diagnosis') ||
        contentLower.includes('starting treatment')) {
      return 'New_diagnosis';
    }
    
    // Testing stage
    if (contentLower.includes('testing') || 
        contentLower.includes('test') ||
        contentLower.includes('window period') ||
        contentLower.includes('result')) {
      return 'Testing';
    }
    
    // Prevention/Pre-exposure
    if (contentLower.includes('prep') || 
        contentLower.includes('prevention') ||
        contentLower.includes('protect') ||
        contentLower.includes('before exposure')) {
      return 'Pre_exposure';
    }
    
    // General ongoing support
    if (contentLower.includes('support') || 
        contentLower.includes('counselling') ||
        contentLower.includes('peer') ||
        contentLower.includes('group') ||
        contentLower.includes('community')) {
      return 'Ongoing_support';
    }
    
    return 'General';
  }

  extractTags(content) {
    const tagPatterns = [
      /\b(hiv|aids|prep|pep|testing|clinic|prevention|positive|treatment|medication)\b/gi,
      /\b(viral load|cd4|adherence|undetectable|u=u|living with hiv|newly diagnosed)\b/gi,
      /\b(support group|peer support|counselling|mental health|stigma|disclosure)\b/gi,
      /\b(london|birmingham|manchester|leeds|bristol|south london|north london)\b/gi,
      /\b(gay|bisexual|lgb|queer|men|trans|msm)\b/gi,
      /\b(clinic|hospital|gum|sexual health|nhs|private|walk-in)\b/gi
    ];
    
    const tags = new Set();
    tagPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => tags.add(match.toLowerCase()));
      }
    });
    
    return Array.from(tags);
  }

  extractLocation(content) {
    const ukCities = [
      'london', 'south london', 'north london', 'east london', 'west london',
      'birmingham', 'manchester', 'leeds', 'liverpool', 'bristol', 'brighton',
      'cambridge', 'oxford', 'edinburgh', 'glasgow', 'cardiff', 'belfast'
    ];
    
    const contentLower = content.toLowerCase();
    for (const city of ukCities) {
      if (contentLower.includes(city)) {
        return city.charAt(0).toUpperCase() + city.slice(1);
      }
    }
    
    return null;
  }

  async generateEmbeddings(contentId, content) {
    // Split content into chunks for embedding
    const chunks = this.chunkContent(content, 500); // 500 word chunks
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      
      try {
        const embedding = await this.openai.embeddings.create({
          model: 'text-embedding-ada-002',
          input: chunk
        });
        
        const vector = embedding.data[0].embedding;
        
        await this.db.query(
          `INSERT INTO content_embeddings (content_id, embedding_vector, chunk_text, chunk_index, chunk_tokens)
           VALUES ($1, $2, $3, $4, $5)`,
          [contentId, vector, chunk, i, chunk.split(' ').length]
        );
        
        // Rate limiting for OpenAI API
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Error generating embedding for chunk ${i}:`, error);
      }
    }
  }

  chunkContent(content, maxWords = 500) {
    const words = content.split(' ');
    const chunks = [];
    
    for (let i = 0; i < words.length; i += maxWords) {
      const chunk = words.slice(i, i + maxWords).join(' ');
      chunks.push(chunk);
    }
    
    return chunks;
  }

  async extractHealthServices(contentId, content, url) {
    // Use regex patterns to extract structured health service information
    const servicePatterns = {
      clinicName: /(?:at|visit|contact)\s+([A-Z][a-zA-Z\s&]+(?:clinic|hospital|centre|center|service))/gi,
      address: /(\d+[a-zA-Z\s,]+(?:road|street|avenue|lane|way|place)[a-zA-Z\s,]*[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2})/gi,
      phone: /(\+?44\s?(?:\d{2,4}\s?\d{2,4}\s?\d{2,4}|\d{3}\s?\d{3}\s?\d{4}))/gi,
      website: /(https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/gi
    };

    const services = [];
    const nameMatches = content.match(servicePatterns.clinicName);
    
    if (nameMatches) {
      for (const name of nameMatches) {
        const service = {
          name: name.trim(),
          service_type: this.inferServiceType(content),
          source_content_id: contentId
        };
        
        // Try to extract additional details for this service
        const contextStart = content.indexOf(name);
        const contextEnd = Math.min(contextStart + 500, content.length);
        const context = content.slice(Math.max(0, contextStart - 100), contextEnd);
        
        const addressMatch = context.match(servicePatterns.address);
        if (addressMatch) service.address = addressMatch[0];
        
        const phoneMatch = context.match(servicePatterns.phone);
        if (phoneMatch) service.phone = phoneMatch[0];
        
        services.push(service);
      }
    }

    // Store extracted services
    for (const service of services) {
      try {
        await this.db.query(
          `INSERT INTO health_services (name, service_type, address, phone, source_content_id, last_verified)
           VALUES ($1, $2, $3, $4, $5, NOW())
           ON CONFLICT DO NOTHING`,
          [service.name, service.service_type, service.address, service.phone, service.source_content_id]
        );
      } catch (error) {
        console.error(`❌ Error storing health service:`, error);
      }
    }
  }

  inferServiceType(content) {
    const contentLower = content.toLowerCase();
    
    // Long-term care services
    if (contentLower.includes('living with hiv') || 
        contentLower.includes('viral load') || 
        contentLower.includes('adherence') ||
        contentLower.includes('medication management')) return 'Ongoing_Care';
    
    // Support groups and peer services
    if (contentLower.includes('support group') || 
        contentLower.includes('peer') || 
        contentLower.includes('community group')) return 'Support_Groups';
        
    // Mental health and counselling
    if (contentLower.includes('counselling') || 
        contentLower.includes('therapy') || 
        contentLower.includes('mental health') ||
        contentLower.includes('stigma')) return 'Mental_Health';
        
    // Advocacy and rights
    if (contentLower.includes('advocacy') || 
        contentLower.includes('rights') || 
        contentLower.includes('discrimination') ||
        contentLower.includes('legal')) return 'Advocacy';
    
    // Basic service types
    if (contentLower.includes('testing') || contentLower.includes('test')) return 'Testing';
    if (contentLower.includes('prep') || contentLower.includes('prevention')) return 'PrEP';
    if (contentLower.includes('treatment') || contentLower.includes('therapy')) return 'Treatment';
    if (contentLower.includes('clinic') || contentLower.includes('hospital')) return 'Clinical Services';
    
    return 'General Health Services';
  }

  async close() {
    await this.db.end();
    console.log('📊 Database connection closed');
  }
}

// Main execution
async function main() {
  const ingestion = new HealthContentIngestion();
  
  try {
    await ingestion.initialize();
    await ingestion.scrapeHealthContent();
    console.log('🎉 Health content ingestion completed successfully!');
  } catch (error) {
    console.error('💥 Ingestion failed:', error);
    process.exit(1);
  } finally {
    await ingestion.close();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default HealthContentIngestion;