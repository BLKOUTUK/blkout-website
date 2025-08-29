// API endpoint for Chrome extension submissions - articles
import { supabase } from '../lib/supabase'

export interface ArticleSubmission {
  title: string
  excerpt: string
  content?: string
  category?: string
  author?: string
  priority?: string
  sourceUrl?: string
  submittedVia?: string
  moreInfoUrl?: string
  publishDate?: string
  section?: string
  tags?: string[]
  status?: string
}

export async function handleArticleSubmission(data: ArticleSubmission) {
  try {
    const {
      title,
      excerpt,
      content,
      category,
      author,
      priority,
      sourceUrl,
      submittedVia,
      moreInfoUrl,
      publishDate,
      section,
      tags,
      status = 'draft'
    } = data

    // Validate required fields
    if (!title || !excerpt) {
      throw new Error('Title and excerpt are required')
    }

    // Create article record
    const { data: article, error } = await supabase
      .from('newsroom')
      .insert([{
        title,
        excerpt,
        content: content || excerpt,
        category: category || 'Community Response',
        author: author || 'Community Submitted',
        priority: priority || 'medium',
        source_url: sourceUrl,
        submitted_via: submittedVia || 'chrome-extension',
        more_info_url: moreInfoUrl,
        publish_date: publishDate,
        section: section,
        tags: tags || ['community-submitted'],
        status: status,
        featured: false,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      message: 'Article created successfully',
      article
    }
  } catch (error: any) {
    console.error('Article submission error:', error)
    return {
      success: false,
      error: error.message || 'Failed to create article'
    }
  }
}

export async function getArticles() {
  try {
    const { data: articles, error } = await supabase
      .from('newsroom')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return {
      success: true,
      articles: articles || []
    }
  } catch (error: any) {
    console.error('Articles fetch error:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch articles'
    }
  }
}