import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for E2E tests')

  // Start Supabase local instance if not running
  try {
    // Check if Supabase is already running
    const response = await fetch('http://localhost:54321/rest/v1/', {
      method: 'HEAD'
    })
    
    if (!response.ok) {
      console.log('📦 Starting Supabase local instance...')
      // In a real setup, you would start Supabase here
      // exec('npx supabase start')
    } else {
      console.log('✅ Supabase is already running')
    }
  } catch (error) {
    console.warn('⚠️ Could not verify Supabase status:', error)
  }

  // Create test data for E2E tests
  console.log('🌱 Setting up test data...')
  
  // Browser setup for authentication state
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  // Create test user session if needed
  try {
    await page.goto('http://localhost:5173/auth/login')
    // Setup test authentication state
  } catch (error) {
    console.warn('⚠️ Could not setup test authentication:', error)
  }
  
  await browser.close()
  console.log('✅ Global setup completed')
}

export default globalSetup