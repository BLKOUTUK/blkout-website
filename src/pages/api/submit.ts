import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Enable CORS for Chrome extension
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { type, title, content, description, source_url, author, organizer, event_date, location, tags } = req.body

    if (!type || !title) {
      return res.status(400).json({ error: 'Type and title are required' })
    }

    if (type === 'news' || type === 'article') {
      if (!content) {
        return res.status(400).json({ error: 'Content is required for news articles' })
      }

      const { data, error } = await supabase
        .from('newsroom')
        .insert([{
          title,
          content,
          source_url,
          author,
          status: 'pending',
          tags: tags || [],
          created_at: new Date().toISOString(),
          published_at: ''
        }])
        .select()

      if (error) throw error

      return res.status(201).json({ 
        success: true, 
        message: 'News article submitted for moderation',
        data: data[0]
      })
    } 
    
    else if (type === 'event') {
      if (!description || !event_date) {
        return res.status(400).json({ error: 'Description and event date are required for events' })
      }

      const { data, error } = await supabase
        .from('events')
        .insert([{
          title,
          description,
          event_date: new Date(event_date).toISOString(),
          location,
          source_url,
          organizer,
          status: 'pending',
          tags: tags || [],
          created_at: new Date().toISOString()
        }])
        .select()

      if (error) throw error

      return res.status(201).json({ 
        success: true, 
        message: 'Event submitted for moderation',
        data: data[0]
      })
    }

    else {
      return res.status(400).json({ error: 'Invalid submission type. Must be "news", "article", or "event"' })
    }

  } catch (error) {
    console.error('Submission error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}