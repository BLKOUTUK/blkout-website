import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { data: articles, error } = await supabase
        .from('newsroom')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return res.status(200).json({
        success: true,
        articles: articles || []
      });
    } catch (error) {
      console.error('Articles GET error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch articles'
      });
    }
  }
  
  if (req.method === 'POST') {
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
      } = req.body;
      
      // Validate required fields
      if (!title || !excerpt) {
        return res.status(400).json({
          success: false,
          error: 'Title and excerpt are required'
        });
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
        .single();
      
      if (error) throw error;
      
      return res.status(201).json({
        success: true,
        message: 'Article created successfully',
        article
      });
    } catch (error) {
      console.error('Articles POST error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create article'
      });
    }
  }
  
  if (req.method === 'PUT') {
    // Handle moderation updates
    const { id } = req.query;
    const { status, moderatorNotes, moderatedAt, moderatedBy } = req.body;
    
    try {
      const { data: article, error } = await supabase
        .from('newsroom')
        .update({
          status,
          moderator_notes: moderatorNotes,
          moderated_at: moderatedAt || new Date().toISOString(),
          moderated_by: moderatedBy
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return res.status(200).json({
        success: true,
        message: 'Article updated successfully',
        article
      });
    } catch (error) {
      console.error('Articles PUT error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update article'
      });
    }
  }
  
  res.setHeader('Allow', ['GET', 'POST', 'PUT']);
  return res.status(405).json({
    success: false,
    error: `Method ${req.method} not allowed`
  });
}