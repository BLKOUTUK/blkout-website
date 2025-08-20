import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../src/types/supabase'

// Create test Supabase client
export const createTestSupabaseClient = () => {
  return createClient<Database>(
    'http://localhost:54321',
    'test-anon-key',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    }
  )
}

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[]
}

const AllTheProviders = ({ 
  children, 
  initialEntries = ['/'] 
}: { 
  children: React.ReactNode
  initialEntries?: string[]
}) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  )
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { initialEntries, ...renderOptions } = options
  
  return render(ui, {
    wrapper: (props) => <AllTheProviders {...props} initialEntries={initialEntries} />,
    ...renderOptions,
  })
}

// Test data factories
export const createMockEvent = (overrides = {}) => ({
  id: 'test-event-1',
  name: 'Test Event',
  description: 'Test event description',
  event_date: '2025-08-20',
  location: { address: 'Test Location', city: 'London' },
  source: 'community' as const,
  source_url: 'https://example.com',
  organizer_id: 'org-1',
  organizer_name: 'Test Organizer',
  tags: ['test', 'community'],
  status: 'published' as const,
  scraped_date: null,
  listed_date: '2025-08-01',
  image_url: null,
  price: 'Free',
  contact_email: 'test@example.com',
  registration_link: 'https://register.example.com',
  target_audience: ['Black', 'QTIPOC'],
  attendee_count: null,
  relevance_score: 0.9,
  created_at: '2025-08-01T00:00:00Z',
  updated_at: '2025-08-01T00:00:00Z',
  ...overrides
})

export const createMockArticle = (overrides = {}) => ({
  id: 'test-article-1',
  title: 'Test Article',
  excerpt: 'Test article excerpt',
  content: 'Test article content',
  author: 'Test Author',
  published_at: '2025-08-01T00:00:00Z',
  category: 'News',
  featured: false,
  status: 'published' as const,
  tags: ['test', 'news'],
  image_url: null,
  source_url: null,
  read_time: 5,
  priority: 'medium' as const,
  submitted_via: 'admin',
  created_at: '2025-08-01T00:00:00Z',
  updated_at: '2025-08-01T00:00:00Z',
  ...overrides
})

export const createMockContact = (overrides = {}) => ({
  id: 'test-contact-1',
  name: 'Test Contact',
  email: 'test@example.com',
  organization: 'Test Organization',
  phone: '+44 123 456 789',
  website: 'https://test.example.com',
  social_media: { twitter: '@test' },
  verified: false,
  created_at: '2025-08-01T00:00:00Z',
  updated_at: '2025-08-01T00:00:00Z',
  ...overrides
})

export const createMockScrapingLog = (overrides = {}) => ({
  id: 'test-log-1',
  source: 'eventbrite',
  events_found: 10,
  events_added: 8,
  status: 'success' as const,
  error_message: null,
  error: null,
  metadata: { duration: 5000 },
  created_at: '2025-08-01T00:00:00Z',
  ...overrides
})

// Wait for async operations
export const waitForAsyncOperations = () => {
  return new Promise(resolve => setTimeout(resolve, 0))
}

// Custom matchers for Supabase responses
export const expectSupabaseSuccess = (result: any) => {
  expect(result).toHaveProperty('data')
  expect(result).toHaveProperty('error', null)
}

export const expectSupabaseError = (result: any) => {
  expect(result).toHaveProperty('error')
  expect(result.error).not.toBeNull()
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }