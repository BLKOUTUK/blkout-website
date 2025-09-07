// Simple serverless function for Chrome extension submissions
// This bridges the extension to our Supabase-based submission system

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function handler(req, res) {
  // Enable CORS for Chrome extension
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
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
      const { data, error } = await supabase
        .from('newsroom')
        .insert([{
          title,
          content: content || description || 'Submitted via Chrome extension',
          source_url,
          author,
          status: 'pending',
          tags: tags || [],
          created_at: new Date().toISOString(),
          published_at: ''
        }])

      if (error) throw error

      return res.status(201).json({ 
        success: true, 
        message: 'News article submitted for moderation',
        id: data[0].id
      })
    } 
    
    else if (type === 'event') {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          title,
          description: description || content || 'Event submitted via Chrome extension',
          event_date: event_date ? new Date(event_date).toISOString() : new Date().toISOString(),
          location,
          source_url,
          organizer,
          status: 'pending',
          tags: tags || [],
          created_at: new Date().toISOString()
        }])

      if (error) throw error

      return res.status(201).json({ 
        success: true, 
        message: 'Event submitted for moderation',
        id: data[0].id
      })
    }

    return res.status(400).json({ error: 'Invalid type. Use "news", "article", or "event"' })

  } catch (error) {
    console.error('Extension submission error:', error)
    return res.status(500).json({ 
      error: 'Submission failed',
      details: error.message
    })
  }
}