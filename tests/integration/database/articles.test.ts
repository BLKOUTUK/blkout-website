import { describe, it, expect, beforeEach } from 'vitest'
import { testSupabase, waitForDatabase } from '../setup'
import { createMockArticle } from '../../utils/test-utils'
import type { Database } from '../../../src/types/supabase'

type Article = Database['public']['Tables']['articles']['Row']
type ArticleInsert = Database['public']['Tables']['articles']['Insert']

describe('Articles Database Integration', () => {
  beforeEach(async () => {
    // Clean up any existing test articles
    await testSupabase.from('articles').delete().ilike('title', 'Test%')
    await waitForDatabase()
  })

  describe('CRUD Operations', () => {
    it('should create a new article', async () => {
      const articleData: ArticleInsert = {
        title: 'Test Integration Article',
        excerpt: 'Test article excerpt for integration',
        content: 'Full content of the test article',
        author: 'Test Author',
        category: 'News',
        featured: false,
        status: 'draft'
      }

      const { data, error } = await testSupabase
        .from('articles')
        .insert(articleData)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.title).toBe(articleData.title)
      expect(data.excerpt).toBe(articleData.excerpt)
      expect(data.author).toBe(articleData.author)
      expect(data.category).toBe(articleData.category)
      expect(data.featured).toBe(articleData.featured)
      expect(data.status).toBe(articleData.status)
      expect(data.id).toBeDefined()
      expect(data.created_at).toBeDefined()
      expect(data.updated_at).toBeDefined()
    })

    it('should read an existing article', async () => {
      const articleData = createMockArticle({
        title: 'Test Read Article',
        content: 'Article for read test',
        author: 'Read Test Author',
        status: 'published'
      })

      const { data: insertData } = await testSupabase
        .from('articles')
        .insert(articleData)
        .select()
        .single()

      const { data, error } = await testSupabase
        .from('articles')
        .select('*')
        .eq('id', insertData.id)
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.id).toBe(insertData.id)
      expect(data.title).toBe(articleData.title)
    })

    it('should update an existing article', async () => {
      const { data: insertData } = await testSupabase
        .from('articles')
        .insert({
          title: 'Test Update Article',
          excerpt: 'Original excerpt',
          content: 'Original content',
          author: 'Original Author',
          category: 'News',
          status: 'draft'
        })
        .select()
        .single()

      const updateData = {
        title: 'Test Updated Article',
        content: 'Updated content',
        status: 'published' as const,
        featured: true
      }

      const { data, error } = await testSupabase
        .from('articles')
        .update(updateData)
        .eq('id', insertData.id)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.title).toBe(updateData.title)
      expect(data.content).toBe(updateData.content)
      expect(data.status).toBe(updateData.status)
      expect(data.featured).toBe(updateData.featured)
    })

    it('should delete an article', async () => {
      const { data: insertData } = await testSupabase
        .from('articles')
        .insert({
          title: 'Test Delete Article',
          excerpt: 'Article to be deleted',
          author: 'Delete Author',
          category: 'News'
        })
        .select()
        .single()

      const { error: deleteError } = await testSupabase
        .from('articles')
        .delete()
        .eq('id', insertData.id)

      expect(deleteError).toBeNull()

      const { data, error } = await testSupabase
        .from('articles')
        .select('*')
        .eq('id', insertData.id)
        .single()

      expect(error).toBeDefined()
      expect(data).toBeNull()
    })
  })

  describe('Query Operations', () => {
    beforeEach(async () => {
      const testArticles = [
        {
          title: 'Test Breaking News',
          excerpt: 'Breaking news article',
          content: 'Breaking news content',
          author: 'News Reporter',
          category: 'Breaking News',
          featured: true,
          status: 'published' as const,
          tags: ['breaking', 'news'],
          priority: 'high' as const
        },
        {
          title: 'Test Analysis Article',
          excerpt: 'Policy analysis article',
          content: 'In-depth analysis content',
          author: 'Policy Analyst',
          category: 'Analysis',
          featured: false,
          status: 'published' as const,
          tags: ['analysis', 'policy'],
          priority: 'medium' as const
        },
        {
          title: 'Test Draft Article',
          excerpt: 'Draft article excerpt',
          content: 'Draft content',
          author: 'Draft Author',
          category: 'Opinion',
          featured: false,
          status: 'draft' as const,
          tags: ['opinion'],
          priority: 'low' as const
        }
      ]

      await testSupabase.from('articles').insert(testArticles)
      await waitForDatabase()
    })

    it('should filter articles by status', async () => {
      const { data, error } = await testSupabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .ilike('title', 'Test%')

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.length).toBe(2)
      expect(data.every(article => article.status === 'published')).toBe(true)
    })

    it('should filter articles by category', async () => {
      const { data, error } = await testSupabase
        .from('articles')
        .select('*')
        .eq('category', 'Analysis')
        .ilike('title', 'Test%')

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.length).toBe(1)
      expect(data[0].category).toBe('Analysis')
    })

    it('should filter articles by featured status', async () => {
      const { data, error } = await testSupabase
        .from('articles')
        .select('*')
        .eq('featured', true)
        .ilike('title', 'Test%')

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.length).toBe(1)
      expect(data[0].featured).toBe(true)
    })

    it('should search articles by title and content', async () => {
      const { data, error } = await testSupabase
        .from('articles')
        .select('*')
        .or('title.ilike.%Breaking%,content.ilike.%Breaking%')

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.length).toBeGreaterThan(0)
    })

    it('should order articles by published date', async () => {
      const { data, error } = await testSupabase
        .from('articles')
        .select('*')
        .ilike('title', 'Test%')
        .order('published_at', { ascending: false })

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.length).toBeGreaterThan(1)
      
      // Verify descending order
      for (let i = 1; i < data.length; i++) {
        expect(new Date(data[i].published_at).getTime())
          .toBeLessThanOrEqual(new Date(data[i - 1].published_at).getTime())
      }
    })

    it('should filter by priority level', async () => {
      const { data, error } = await testSupabase
        .from('articles')
        .select('*')
        .eq('priority', 'high')
        .ilike('title', 'Test%')

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.length).toBe(1)
      expect(data[0].priority).toBe('high')
    })
  })

  describe('Full Text Search', () => {
    beforeEach(async () => {
      await testSupabase.from('articles').insert([
        {
          title: 'Test Liberation Article',
          excerpt: 'Article about Black queer liberation movements',
          content: 'This article discusses liberation theory and practice in Black QTIPOC communities',
          author: 'Liberation Scholar',
          category: 'Education',
          tags: ['liberation', 'theory', 'black-qtipoc']
        },
        {
          title: 'Test Community Building',
          excerpt: 'Building stronger communities through cooperation',
          content: 'Community organizing strategies for building collective power',
          author: 'Community Organizer',
          category: 'Community',
          tags: ['community', 'organizing', 'cooperation']
        }
      ])
      await waitForDatabase()
    })

    it('should search across multiple text fields', async () => {
      const { data, error } = await testSupabase
        .from('articles')
        .select('*')
        .or('title.ilike.%liberation%,excerpt.ilike.%liberation%,content.ilike.%liberation%')

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.length).toBeGreaterThan(0)
      expect(data.some(article => 
        article.title.toLowerCase().includes('liberation') ||
        article.excerpt?.toLowerCase().includes('liberation') ||
        article.content?.toLowerCase().includes('liberation')
      )).toBe(true)
    })

    it('should search by tags array', async () => {
      const { data, error } = await testSupabase
        .from('articles')
        .select('*')
        .contains('tags', ['community'])

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.length).toBeGreaterThan(0)
      expect(data[0].tags).toContain('community')
    })
  })

  describe('Article Statistics', () => {
    beforeEach(async () => {
      const articles = Array.from({ length: 5 }, (_, i) => ({
        title: `Test Stats Article ${i + 1}`,
        excerpt: `Stats test article ${i + 1}`,
        author: 'Stats Author',
        category: i % 2 === 0 ? 'News' : 'Analysis',
        featured: i < 2,
        status: i < 4 ? 'published' as const : 'draft' as const,
        read_time: (i + 1) * 2
      }))

      await testSupabase.from('articles').insert(articles)
      await waitForDatabase()
    })

    it('should count articles by status', async () => {
      const { data: publishedCount, error: publishedError } = await testSupabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')
        .ilike('title', 'Test Stats%')

      const { data: draftCount, error: draftError } = await testSupabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft')
        .ilike('title', 'Test Stats%')

      expect(publishedError).toBeNull()
      expect(draftError).toBeNull()
      expect(publishedCount).toBe(4)
      expect(draftCount).toBe(1)
    })

    it('should count featured articles', async () => {
      const { count, error } = await testSupabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('featured', true)
        .ilike('title', 'Test Stats%')

      expect(error).toBeNull()
      expect(count).toBe(2)
    })

    it('should calculate average read time', async () => {
      const { data, error } = await testSupabase
        .from('articles')
        .select('read_time')
        .ilike('title', 'Test Stats%')
        .not('read_time', 'is', null)

      expect(error).toBeNull()
      expect(data).toBeDefined()

      const avgReadTime = data.reduce((sum, article) => sum + (article.read_time || 0), 0) / data.length
      expect(avgReadTime).toBeGreaterThan(0)
    })
  })
})