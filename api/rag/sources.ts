import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
)

// Content sources management API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    if (req.method === 'GET') {
      // Get all content sources
      const { data: sources, error } = await supabase
        .from('content_sources')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      // Add some community-curated sources by default if none exist
      if (sources.length === 0) {
        const defaultSources = [
          {
            type: 'rss',
            url: 'https://feeds.theguardian.com/theguardian/world/rss',
            name: 'The Guardian - World News',
            credibility_score: 0.85,
            check_interval: 1800, // 30 minutes
            is_active: true,
            community_verified: true
          },
          {
            type: 'rss', 
            url: 'https://rss.cnn.com/rss/edition.rss',
            name: 'CNN - Latest News',
            credibility_score: 0.75,
            check_interval: 3600, // 1 hour
            is_active: true,
            community_verified: false
          },
          {
            type: 'website',
            url: 'https://www.blacklivesmatter.com',
            name: 'Black Lives Matter',
            credibility_score: 0.95,
            check_interval: 7200, // 2 hours
            is_active: true,
            community_verified: true
          },
          {
            type: 'rss',
            url: 'https://www.advocate.com/feeds/all.rss',
            name: 'The Advocate - LGBTQ News',
            credibility_score: 0.80,
            check_interval: 3600,
            is_active: true,
            community_verified: true
          },
          {
            type: 'website',
            url: 'https://www.eventbrite.co.uk/d/united-kingdom--london/lgbtq/',
            name: 'Eventbrite - LGBTQ Events London',
            credibility_score: 0.70,
            check_interval: 7200,
            is_active: true,
            community_verified: false
          }
        ]

        // Insert default sources
        const { data: inserted, error: insertError } = await supabase
          .from('content_sources')
          .insert(defaultSources)
          .select()

        if (insertError) {
          console.error('Error inserting default sources:', insertError)
        } else {
          sources.push(...(inserted || []))
        }
      }

      res.status(200).json({
        success: true,
        sources,
        total: sources.length,
        active: sources.filter(s => s.is_active).length,
        community_verified: sources.filter(s => s.community_verified).length
      })
    }
    else if (req.method === 'POST') {
      // Add new content source
      const { type, url, name, credibility_score, check_interval, community_verified } = req.body

      if (!type || !url) {
        return res.status(400).json({
          success: false,
          error: 'Type and URL are required'
        })
      }

      // Validate source type
      if (!['rss', 'website', 'api', 'social'].includes(type)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid source type. Must be: rss, website, api, or social'
        })
      }

      // Validate URL format
      try {
        new URL(url)
      } catch {
        return res.status(400).json({
          success: false,
          error: 'Invalid URL format'
        })
      }

      // Check if source already exists
      const { data: existing } = await supabase
        .from('content_sources')
        .select('id')
        .eq('url', url)
        .single()

      if (existing) {
        return res.status(409).json({
          success: false,
          error: 'Source with this URL already exists'
        })
      }

      // Create new source
      const newSource = {
        type,
        url,
        name: name || url,
        credibility_score: credibility_score || 0.5,
        check_interval: check_interval || 3600,
        is_active: true,
        community_verified: community_verified || false,
        last_checked: null
      }

      const { data: source, error } = await supabase
        .from('content_sources')
        .insert(newSource)
        .select()
        .single()

      if (error) {
        throw new Error(`Error creating source: ${error.message}`)
      }

      res.status(201).json({
        success: true,
        source,
        message: 'Content source added successfully'
      })
    }
    else if (req.method === 'PUT') {
      // Update content source
      const { id } = req.query
      const updates = req.body

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Source ID is required'
        })
      }

      // Remove fields that shouldn't be updated
      delete updates.id
      delete updates.created_at

      const { data: source, error } = await supabase
        .from('content_sources')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({
            success: false,
            error: 'Source not found'
          })
        }
        throw new Error(`Error updating source: ${error.message}`)
      }

      res.status(200).json({
        success: true,
        source,
        message: 'Source updated successfully'
      })
    }
    else if (req.method === 'DELETE') {
      // Delete content source
      const { id } = req.query

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Source ID is required'
        })
      }

      const { error } = await supabase
        .from('content_sources')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(`Error deleting source: ${error.message}`)
      }

      res.status(200).json({
        success: true,
        message: 'Source deleted successfully'
      })
    }
    else {
      res.status(405).json({
        success: false,
        error: 'Method not allowed'
      })
    }
  } catch (error) {
    console.error('Content sources API error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    })
  }
}