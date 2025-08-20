import { FullConfig } from '@playwright/test'

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown for E2E tests')

  // Clean up test data
  try {
    console.log('🗑️ Cleaning up test data...')
    // Clean up any persistent test data
    const response = await fetch('http://localhost:54321/rest/v1/events', {
      method: 'DELETE',
      headers: {
        'apikey': 'test-anon-key',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: { like: 'E2E Test%' }
      })
    })
  } catch (error) {
    console.warn('⚠️ Could not clean up test data:', error)
  }

  console.log('✅ Global teardown completed')
}

export default globalTeardown