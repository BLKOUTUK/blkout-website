// IVOR Semantic Search Engine - Intelligent Knowledge Retrieval
// Community Liberation Platform - Journey-Aware Content Discovery

import { supabase } from './supabase';
import OpenAI from 'openai';

export interface ContentMatch {
  id: number;
  title: string;
  content: string;
  domain: string;
  journey_stage: string;
  similarity_score: number;
  outcome_objectives: string[];
  next_stage_pathways: string[];
  cultural_context: string;
  liberation_goals: string[];
  authority_score: number;
  community_validation: any;
}

export interface SearchContext {
  domain?: 'core' | 'community' | 'organizing' | 'social';
  journey_stage?: string;
  user_context?: {
    location?: string;
    resources?: string[];
    community_connections?: string[];
    empowerment_goals?: string[];
  };
  cultural_requirements?: string[];
  liberation_focus?: string[];
}

export class SemanticSearchEngine {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY
    });
  }

  /**
   * Perform semantic search for journey-aware content
   */
  async searchContent(
    query: string,
    context: SearchContext = {},
    limit: number = 10,
    similarity_threshold: number = 0.7
  ): Promise<ContentMatch[]> {
    try {
      // Generate query embedding
      const queryEmbedding = await this.generateEmbedding(query);
      
      // Build context-aware search query
      let searchQuery = supabase
        .from('knowledge_content')
        .select(`
          id,
          title,
          content,
          domain,
          journey_stage,
          outcome_objectives,
          next_stage_pathways,
          cultural_context,
          liberation_goals,
          authority_score,
          community_validation
        `)
        .limit(limit);

      // Apply domain filter if specified
      if (context.domain) {
        searchQuery = searchQuery.eq('domain', context.domain);
      }

      // Apply journey stage filter if specified
      if (context.journey_stage) {
        searchQuery = searchQuery.eq('journey_stage', context.journey_stage);
      }

      // Execute semantic similarity search using pgvector
      const { data: results, error } = await searchQuery.rpc(
        'match_knowledge_content',
        {
          query_embedding: queryEmbedding,
          match_threshold: similarity_threshold,
          match_count: limit
        }
      );

      if (error) {
        console.error('Semantic search error:', error);
        // Fallback to text search if vector search fails
        return await this.fallbackTextSearch(query, context, limit);
      }

      // Enhance results with cultural and liberation context
      const enhancedResults = await this.enhanceSearchResults(
        results || [],
        query,
        context
      );

      return enhancedResults;

    } catch (error) {
      console.error('Search execution error:', error);
      return await this.fallbackTextSearch(query, context, limit);
    }
  }

  /**
   * Generate OpenAI embeddings for content
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text.substring(0, 8000) // Truncate to token limit
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Embedding generation error:', error);
      throw error;
    }
  }

  /**
   * Ingest new content with embedding generation
   */
  async ingestContent(content: {
    title: string;
    content_text: string;
    domain: 'core' | 'community' | 'organizing' | 'social';
    journey_stage: string;
    outcome_objectives?: string[];
    cultural_context?: string;
    liberation_goals?: string[];
    source_url?: string;
    authority_score?: number;
  }): Promise<{ success: boolean; content_id?: number; error?: string }> {
    try {
      // Generate embedding for content
      const contentForEmbedding = `${content.title}\n\n${content.content_text}`;
      const embedding = await this.generateEmbedding(contentForEmbedding);

      // Insert content with embedding
      const { data, error } = await supabase
        .from('knowledge_content')
        .insert({
          title: content.title,
          content: content.content_text,
          domain: content.domain,
          journey_stage: content.journey_stage,
          outcome_objectives: content.outcome_objectives || [],
          cultural_context: content.cultural_context || 'general',
          liberation_goals: content.liberation_goals || [],
          source_url: content.source_url,
          authority_score: content.authority_score || 50,
          embedding_vector: embedding,
          community_validation: {
            status: 'pending',
            created_at: new Date().toISOString()
          }
        })
        .select('id')
        .single();

      if (error) {
        console.error('Content ingestion error:', error);
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        content_id: data.id 
      };

    } catch (error) {
      console.error('Content ingestion error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Enhance search results with contextual ranking and cultural relevance
   */
  private async enhanceSearchResults(
    results: any[],
    originalQuery: string,
    context: SearchContext
  ): Promise<ContentMatch[]> {
    return results.map((result: any, index: number) => {
      // Calculate contextual relevance score
      let contextualScore = result.similarity || 0.5;

      // Boost score for domain alignment
      if (context.domain && result.domain === context.domain) {
        contextualScore += 0.1;
      }

      // Boost score for journey stage alignment
      if (context.journey_stage && result.journey_stage === context.journey_stage) {
        contextualScore += 0.15;
      }

      // Boost score for cultural requirements alignment
      if (context.cultural_requirements?.length && result.cultural_context) {
        const culturalMatch = context.cultural_requirements.some(req => 
          result.cultural_context.includes(req)
        );
        if (culturalMatch) {
          contextualScore += 0.1;
        }
      }

      // Boost score for liberation goals alignment
      if (context.liberation_focus?.length && result.liberation_goals?.length) {
        const liberationMatch = context.liberation_focus.some(goal =>
          result.liberation_goals.includes(goal)
        );
        if (liberationMatch) {
          contextualScore += 0.15;
        }
      }

      // Factor in community validation
      if (result.community_validation?.status === 'validated') {
        contextualScore += 0.05;
      }

      // Factor in authority score
      contextualScore += (result.authority_score || 50) / 1000;

      return {
        id: result.id,
        title: result.title,
        content: result.content,
        domain: result.domain,
        journey_stage: result.journey_stage,
        similarity_score: Math.min(contextualScore, 1.0),
        outcome_objectives: result.outcome_objectives || [],
        next_stage_pathways: result.next_stage_pathways || [],
        cultural_context: result.cultural_context || 'general',
        liberation_goals: result.liberation_goals || [],
        authority_score: result.authority_score || 50,
        community_validation: result.community_validation || {}
      };
    }).sort((a, b) => b.similarity_score - a.similarity_score);
  }

  /**
   * Fallback text search when semantic search fails
   */
  private async fallbackTextSearch(
    query: string,
    context: SearchContext,
    limit: number
  ): Promise<ContentMatch[]> {
    try {
      let searchQuery = supabase
        .from('knowledge_content')
        .select(`
          id,
          title,
          content,
          domain,
          journey_stage,
          outcome_objectives,
          next_stage_pathways,
          cultural_context,
          liberation_goals,
          authority_score,
          community_validation
        `)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .limit(limit);

      if (context.domain) {
        searchQuery = searchQuery.eq('domain', context.domain);
      }

      if (context.journey_stage) {
        searchQuery = searchQuery.eq('journey_stage', context.journey_stage);
      }

      const { data: results, error } = await searchQuery;

      if (error) {
        console.error('Fallback text search error:', error);
        return [];
      }

      return (results || []).map((result: any) => ({
        id: result.id,
        title: result.title,
        content: result.content,
        domain: result.domain,
        journey_stage: result.journey_stage,
        similarity_score: 0.5, // Default score for text search
        outcome_objectives: result.outcome_objectives || [],
        next_stage_pathways: result.next_stage_pathways || [],
        cultural_context: result.cultural_context || 'general',
        liberation_goals: result.liberation_goals || [],
        authority_score: result.authority_score || 50,
        community_validation: result.community_validation || {}
      }));

    } catch (error) {
      console.error('Fallback search error:', error);
      return [];
    }
  }

  /**
   * Batch ingest content from external sources (e.g., menrus.co.uk)
   */
  async batchIngestFromSource(
    sourceUrl: string,
    contentItems: Array<{
      title: string;
      content: string;
      domain: 'core' | 'community' | 'organizing' | 'social';
      journey_stage: string;
      cultural_context?: string;
      liberation_goals?: string[];
    }>
  ): Promise<{
    success: boolean;
    ingested_count: number;
    failed_count: number;
    errors: string[];
  }> {
    const results = {
      success: true,
      ingested_count: 0,
      failed_count: 0,
      errors: [] as string[]
    };

    for (const item of contentItems) {
      const result = await this.ingestContent({
        ...item,
        content_text: item.content,
        source_url: sourceUrl,
        authority_score: sourceUrl.includes('menrus.co.uk') ? 90 : 70 // Higher score for verified sources
      });

      if (result.success) {
        results.ingested_count++;
      } else {
        results.failed_count++;
        results.errors.push(result.error || 'Unknown error');
      }
    }

    if (results.failed_count > 0) {
      results.success = false;
    }

    return results;
  }

  /**
   * Search for content specifically focused on liberation outcomes
   */
  async searchLiberationFocused(
    query: string,
    liberation_goals: string[],
    context: SearchContext = {},
    limit: number = 5
  ): Promise<ContentMatch[]> {
    const enhancedContext = {
      ...context,
      liberation_focus: liberation_goals
    };

    const results = await this.searchContent(query, enhancedContext, limit, 0.6);

    // Additional filtering for liberation relevance
    return results.filter(result => 
      result.liberation_goals.some(goal => 
        liberation_goals.some(targetGoal => 
          goal.includes(targetGoal) || targetGoal.includes(goal)
        )
      )
    );
  }

  /**
   * Update community validation for content
   */
  async updateCommunityValidation(
    contentId: number,
    validation: {
      status: 'pending' | 'validated' | 'disputed';
      community_feedback?: string;
      cultural_authenticity_score?: number;
      liberation_alignment_score?: number;
      validator_info?: any;
    }
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('knowledge_content')
        .update({
          community_validation: {
            ...validation,
            updated_at: new Date().toISOString()
          }
        })
        .eq('id', contentId);

      if (error) {
        console.error('Validation update error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Community validation update error:', error);
      return false;
    }
  }
}

// PostgreSQL function for vector similarity search
export const VECTOR_SEARCH_FUNCTION = `
CREATE OR REPLACE FUNCTION match_knowledge_content(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE(
  id bigint,
  title text,
  content text,
  domain text,
  journey_stage text,
  outcome_objectives text[],
  next_stage_pathways text[],
  cultural_context text,
  liberation_goals text[],
  authority_score int,
  community_validation jsonb,
  similarity float
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    knowledge_content.id,
    knowledge_content.title,
    knowledge_content.content,
    knowledge_content.domain,
    knowledge_content.journey_stage,
    knowledge_content.outcome_objectives,
    knowledge_content.next_stage_pathways,
    knowledge_content.cultural_context,
    knowledge_content.liberation_goals,
    knowledge_content.authority_score,
    knowledge_content.community_validation,
    1 - (knowledge_content.embedding_vector <=> query_embedding) AS similarity
  FROM knowledge_content
  WHERE 1 - (knowledge_content.embedding_vector <=> query_embedding) > match_threshold
  ORDER BY knowledge_content.embedding_vector <=> query_embedding
  LIMIT match_count;
$$;
`;

// Export semantic search engine instance
export const semanticSearch = new SemanticSearchEngine();