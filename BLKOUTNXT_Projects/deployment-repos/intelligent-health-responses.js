#!/usr/bin/env node

/**
 * IVOR Intelligent Health Response System
 * Queries knowledge base and generates specific answers from menrus.co.uk content
 */

import { Client } from 'pg';
import OpenAI from 'openai';

class IntelligentHealthResponses {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    this.db = new Client({
      connectionString: process.env.DATABASE_URL || 'postgresql://localhost/ivor_health'
    });
  }

  async initialize() {
    await this.db.connect();
  }

  async processHealthQuery(userQuery, userLocation = null) {
    console.log(`🧠 Processing health query: "${userQuery}"`);
    
    try {
      // Generate embedding for user query
      const queryEmbedding = await this.generateQueryEmbedding(userQuery);
      
      // Search knowledge base for relevant content
      const relevantContent = await this.searchKnowledgeBase(
        queryEmbedding, 
        userLocation,
        0.75, // similarity threshold
        5     // max results
      );
      
      if (relevantContent.length === 0) {
        return this.fallbackResponse(userQuery);
      }
      
      // Generate intelligent response from found content
      const response = await this.generateIntelligentResponse(
        userQuery, 
        relevantContent, 
        userLocation
      );
      
      // Log query for learning and improvement
      await this.logQuery(userQuery, relevantContent, response);
      
      return response;
      
    } catch (error) {
      console.error('❌ Error processing health query:', error);
      return this.fallbackResponse(userQuery);
    }
  }

  async generateQueryEmbedding(query) {
    const embedding = await this.openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: query
    });
    
    return embedding.data[0].embedding;
  }

  async searchKnowledgeBase(queryEmbedding, userLocation, threshold = 0.75, limit = 5) {
    let locationFilter = '';
    let params = [queryEmbedding, threshold, limit];
    
    if (userLocation) {
      locationFilter = 'AND (hc.location ILIKE $4 OR $4 IS NULL)';
      params.push(`%${userLocation}%`);
    }
    
    const query = `
      SELECT 
        ce.content_id,
        hc.title,
        ce.chunk_text,
        hc.url,
        hc.category,
        hc.location,
        hc.tags,
        1 - (ce.embedding_vector <=> $1::vector) as similarity,
        hs.name as service_name,
        hs.address,
        hs.phone,
        hs.service_type
      FROM content_embeddings ce
      JOIN health_content hc ON ce.content_id = hc.id
      LEFT JOIN health_services hs ON hs.source_content_id = hc.id
      WHERE hc.is_active = true
      AND 1 - (ce.embedding_vector <=> $1::vector) > $2
      ${locationFilter}
      ORDER BY ce.embedding_vector <=> $1::vector
      LIMIT $3
    `;
    
    const result = await this.db.query(query, params);
    return result.rows;
  }

  async generateIntelligentResponse(userQuery, relevantContent, userLocation) {
    // Prepare context from relevant content
    const context = relevantContent.map(item => ({
      title: item.title,
      content: item.chunk_text,
      url: item.url,
      category: item.category,
      location: item.location,
      service_name: item.service_name,
      address: item.address,
      phone: item.phone,
      service_type: item.service_type,
      similarity: item.similarity
    }));

    // Create a comprehensive context string
    const contextString = context.map(item => 
      `Source: ${item.title} (${item.url})
Location: ${item.location || 'Not specified'}
Service: ${item.service_name || 'General information'}
Address: ${item.address || 'Contact for details'}  
Phone: ${item.phone || 'See website for contact'}
Content: ${item.content}`
    ).join('\n\n---\n\n');

    const systemPrompt = `You are IVOR, an AI assistant specialized in providing specific, actionable health information for Black queer men using content from menrus.co.uk. 

Your role is to:
1. Provide specific, actionable answers from the knowledge base
2. Include concrete details like addresses, phone numbers, and booking information when available
3. Always attribute information to menrus.co.uk
4. Be culturally affirming and supportive
5. Recognize the full spectrum of HIV support needs - from prevention to long-term wellness
6. Offer to help with additional specific questions

Guidelines:
- Give SPECIFIC information from the sources (addresses, phone numbers, opening hours)
- Don't just refer users to "visit the website" - provide the actual information
- If location-specific info is available, prioritize it
- Include source URLs for users who want more details
- Be encouraging and supportive in tone
- Understand that HIV support includes: testing, prevention (PrEP), new diagnosis support, ongoing treatment care, support groups, mental health, advocacy, and living well with HIV
- For long-term care queries, focus on treatment adherence, viral load management, and wellness
- For new diagnosis queries, provide immediate emotional support plus practical next steps
- For peer support queries, emphasize community connections and shared experiences

Context from menrus.co.uk:
${contextString}

User's location: ${userLocation || 'Not specified'}
User's question: ${userQuery}`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userQuery }
      ],
      max_tokens: 500,
      temperature: 0.3 // Lower temperature for more factual responses
    });

    return {
      response: response.choices[0].message.content,
      sources: [...new Set(context.map(item => item.url))], // Unique URLs
      confidence: Math.max(...context.map(item => item.similarity)),
      category: 'health',
      knowledge_source: 'menrus.co.uk',
      has_specific_services: context.some(item => item.service_name),
      location_specific: context.some(item => 
        item.location && userLocation && 
        item.location.toLowerCase().includes(userLocation.toLowerCase())
      )
    };
  }

  fallbackResponse(userQuery) {
    return {
      response: "I'm working on building my knowledge base from menrus.co.uk to provide you with specific health information. In the meantime, please visit menrus.co.uk directly for comprehensive gay and bi men's health resources, or contact your local sexual health clinic for immediate support.",
      sources: ['https://menrus.co.uk'],
      confidence: 0,
      category: 'health',
      knowledge_source: 'fallback',
      has_specific_services: false,
      location_specific: false
    };
  }

  async logQuery(userQuery, relevantContent, response) {
    try {
      const contentIds = relevantContent.map(item => item.content_id);
      const sources = response.sources;
      
      await this.db.query(
        `INSERT INTO user_query_logs 
         (original_query, matched_content_ids, response_generated, response_sources, intent_category)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          userQuery, 
          contentIds, 
          response.response, 
          sources, 
          response.category
        ]
      );
    } catch (error) {
      console.error('❌ Error logging query:', error);
    }
  }

  // Enhanced search with intent recognition
  async processHealthQueryWithIntent(userQuery, userLocation = null) {
    const intent = this.recognizeIntent(userQuery);
    console.log(`🎯 Recognized intent: ${intent.type} (confidence: ${intent.confidence})`);
    
    // Modify search strategy based on intent
    let threshold = 0.75;
    let limit = 5;
    
    if (intent.type === 'service_search') {
      // For service searches, lower threshold to find more locations
      threshold = 0.65;
      limit = 10;
    } else if (intent.type === 'general_info') {
      // For general info, higher threshold for more relevant content
      threshold = 0.8;
      limit = 3;
    }
    
    const enhancedQuery = this.enhanceQueryWithIntent(userQuery, intent);
    return this.processHealthQuery(enhancedQuery, userLocation);
  }

  recognizeIntent(query) {
    const queryLower = query.toLowerCase();
    
    // Long-term care and treatment support
    if (queryLower.match(/\b(living with hiv|positive|treatment|medication|viral load|cd4|adherence|undetectable)\b/)) {
      return { type: 'long_term_care', confidence: 0.95 };
    }
    
    // New diagnosis support
    if (queryLower.match(/\b(newly diagnosed|just found out|recent diagnosis|starting treatment|just tested positive)\b/)) {
      return { type: 'new_diagnosis', confidence: 0.95 };
    }
    
    // Support groups and peer support
    if (queryLower.match(/\b(support group|peer support|community|others like me|counselling|stigma|disclosure)\b/)) {
      return { type: 'peer_support', confidence: 0.9 };
    }
    
    // Service/location search patterns
    if (queryLower.match(/\b(where|clinic|testing|location|near|in|address|phone)\b/)) {
      return { type: 'service_search', confidence: 0.9 };
    }
    
    // Information request patterns  
    if (queryLower.match(/\b(what|how|when|info|about|explain|tell me)\b/)) {
      return { type: 'general_info', confidence: 0.8 };
    }
    
    // Urgent/immediate help patterns
    if (queryLower.match(/\b(urgent|now|today|emergency|immediate)\b/)) {
      return { type: 'urgent_help', confidence: 0.95 };
    }
    
    // Prevention/safety patterns
    if (queryLower.match(/\b(prep|prevent|safe|protection)\b/)) {
      return { type: 'prevention', confidence: 0.85 };
    }
    
    return { type: 'general', confidence: 0.6 };
  }

  enhanceQueryWithIntent(query, intent) {
    // Add context words to improve embedding matching
    switch (intent.type) {
      case 'long_term_care':
        return `${query} living with hiv treatment medication adherence viral load cd4 ongoing care`;
      case 'new_diagnosis':
        return `${query} newly diagnosed starting treatment first steps support recently positive`;
      case 'peer_support':
        return `${query} support group peer community counselling others like me stigma disclosure`;
      case 'service_search':
        return `${query} clinic location address phone booking`;
      case 'prevention':
        return `${query} prevention protect safe prep pep`;
      case 'urgent_help':
        return `${query} urgent immediate help support contact`;
      default:
        return query;
    }
  }

  async close() {
    await this.db.end();
  }
}

// Integration function for IVOR Core
export async function getIntelligentHealthResponse(userMessage, userLocation = null) {
  const healthAI = new IntelligentHealthResponses();
  
  try {
    await healthAI.initialize();
    const result = await healthAI.processHealthQueryWithIntent(userMessage, userLocation);
    return result;
  } catch (error) {
    console.error('❌ Health query processing failed:', error);
    return {
      response: "I'm having trouble accessing my health knowledge base right now. Please visit menrus.co.uk for comprehensive health resources, or contact your local sexual health clinic.",
      sources: ['https://menrus.co.uk'],
      confidence: 0,
      category: 'health',
      knowledge_source: 'error_fallback'
    };
  } finally {
    await healthAI.close();
  }
}

export default IntelligentHealthResponses;