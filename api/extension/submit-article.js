// API endpoint for Chrome extension article submissions
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://bgjengudzfickgomjqmz.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnamVuZ3VkemZpY2tnb21qcW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MTI3NjcsImV4cCI6MjA3MTE4ODc2N30.kYQ2oFuQBGmu4V_dnj_1zDMDVsd-qpDZJwNvswzO6M0'
)

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      title,
      excerpt,
      content,
      author,
      sourceUrl,
      submittedVia,
      tags
    } = req.body

    console.log('📰 Extension Article Submission:', {
      title,
      excerpt,
      author,
      submittedVia
    })

    // Insert article into Supabase
    const { data, error } = await supabase
      .from('newsroom_articles')
      .insert([{
        title: title || 'Untitled Article',
        excerpt: excerpt || '',
        content: content || excerpt || '',
        status: 'draft', // Chrome extension submissions start as draft
        source_url: sourceUrl || null,
        community_funded: false,
        created_at: new Date().toISOString()
      }])
      .select()

    if (error) {
      console.error('❌ Supabase error:', error)
      return res.status(500).json({ 
        error: 'Database error', 
        details: error.message 
      })
    }

    console.log('✅ Article submitted successfully:', data[0])

    res.status(200).json({
      success: true,
      message: 'Article submitted for moderation',
      id: data[0].id,
      title: data[0].title
    })

  } catch (error) {
    console.error('💥 Extension article submission error:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    })
  }
}