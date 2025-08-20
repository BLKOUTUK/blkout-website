import { beforeAll, afterAll, beforeEach } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../src/types/supabase'

// Create test database client
export const testSupabase = createClient<Database>(
  'http://localhost:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  }
)

// Test data cleanup utilities
export const cleanupTestData = async () => {
  try {
    // Clean up test data in reverse dependency order
    await testSupabase.from('scraping_logs').delete().ilike('source', 'test%')
    await testSupabase.from('articles').delete().ilike('title', 'Test%')
    await testSupabase.from('events').delete().ilike('name', 'Test%')
    await testSupabase.from('contacts').delete().ilike('name', 'Test%')
  } catch (error) {
    console.warn('Cleanup failed:', error)
  }
}

// Wait for database operations to complete
export const waitForDatabase = async (ms = 100) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Verify database connection
export const verifyDatabaseConnection = async () => {
  try {
    const { data, error } = await testSupabase
      .from('events')
      .select('id')
      .limit(1)
    
    if (error) {
      throw new Error(`Database connection failed: ${error.message}`)
    }
    
    return true
  } catch (error) {
    throw new Error(`Cannot connect to test database: ${error}`)
  }
}

// Setup and teardown
beforeAll(async () => {
  await verifyDatabaseConnection()
  console.log('✅ Connected to test Supabase instance')
})

beforeEach(async () => {
  await cleanupTestData()
  await waitForDatabase()
})

afterAll(async () => {
  await cleanupTestData()
  console.log('🧹 Cleaned up test data')
})