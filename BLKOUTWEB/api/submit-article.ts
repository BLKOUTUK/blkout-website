// Article Submission API Route
// File: api/submit-article.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { publicationService } from '../src/services/publicationService';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests supported for article submission'
    });
  }

  try {
    const { title, description, priority, source, author, category, type } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'title and description are required'
      });
    }

    // Submit to newsroom_articles table via publicationService
    const articleData = {
      title,
      content: description,
      priority: priority || 'medium',
      source: source || 'web_form',
      author: author || 'Community Submitted'
    };

    const result = await publicationService.submitContent(articleData, 'newsroom_articles');

    return res.status(201).json({
      success: true,
      message: 'Article submitted successfully to moderation queue',
      data: {
        id: result.id,
        title: result.title,
        status: result.status,
        created_at: result.created_at,
        moderation_queue: true
      }
    });

  } catch (error) {
    console.error('Article submission failed:', error);
    return res.status(500).json({
      error: 'Submission failed',
      message: error instanceof Error ? error.message : 'Unknown error during article submission'
    });
  }
}