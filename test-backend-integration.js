// Test script to verify backend integration
async function testBackends() {
  console.log('Testing Backend Integration...\n')
  
  // Test Events Backend
  console.log('1. Testing Events Backend:')
  try {
    const eventsResponse = await fetch('https://events-deploy.vercel.app/api/events')
    const eventsData = await eventsResponse.json()
    console.log('✅ Events Backend Response:', {
      success: eventsData.success,
      eventCount: eventsData.events?.length || 0,
      firstEventTitle: eventsData.events?.[0]?.title || 'None'
    })
  } catch (error) {
    console.log('❌ Events Backend Error:', error.message)
  }
  
  // Test Newsroom Backend  
  console.log('\n2. Testing Newsroom Backend:')
  try {
    const newsResponse = await fetch('https://newsroom-deploy.vercel.app/api/articles')
    const newsData = await newsResponse.json()
    console.log('✅ Newsroom Backend Response:', {
      success: newsData.success,
      articleCount: newsData.articles?.length || 0,
      firstArticleTitle: newsData.articles?.[0]?.title || 'None'
    })
  } catch (error) {
    console.log('❌ Newsroom Backend Error:', error.message)
  }
  
  // Test Magazine Backend
  console.log('\n3. Testing Magazine Backend:')
  try {
    const magazineResponse = await fetch('https://magazine-deploy.vercel.app/health')
    const magazineData = await magazineResponse.json()
    console.log('✅ Magazine Backend Health:', {
      service: magazineData.service,
      status: magazineData.status,
      features: magazineData.features
    })
  } catch (error) {
    console.log('❌ Magazine Backend Error:', error.message)
  }
}

// Run in browser environment
if (typeof window !== 'undefined') {
  testBackends()
} else {
  console.log('This script should be run in a browser environment')
}