// Test the unified Chrome extension API endpoint
import fetch from 'node-fetch';

async function testUnifiedEndpoint() {
  console.log('🧪 Testing Unified Chrome Extension API Endpoint...\n');

  // Test event submission
  try {
    console.log('📅 Testing event submission...');
    const eventResponse = await fetch('http://localhost:5173/api/extension-submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'event',
        title: 'REAL Chrome Extension Test Event',
        description: 'This is a REAL test from the new Chrome extension API endpoint',
        date: '2025-04-15',
        time: '19:00:00',
        location: 'Community Center',
        organizer: 'BLKOUT Community',
        tags: ['real-extension-test', 'community'],
        sourceUrl: 'https://example.com/event',
        submittedVia: 'chrome-extension-api-test'
      })
    });

    if (eventResponse.ok) {
      const eventResult = await eventResponse.json();
      console.log('✅ Event submission successful:', eventResult);
    } else {
      const eventError = await eventResponse.text();
      console.log('❌ Event submission failed:', eventResponse.status, eventError);
    }
  } catch (error) {
    console.error('💥 Event submission error:', error.message);
  }

  console.log('');

  // Test article submission
  try {
    console.log('📰 Testing article submission...');
    const articleResponse = await fetch('http://localhost:5173/api/extension-submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'article',
        title: 'REAL Chrome Extension Test Article',
        excerpt: 'This is a REAL test from the new Chrome extension API endpoint',
        content: 'Full content of the REAL article submitted via the new Chrome extension endpoint. This should now appear in the moderation queue!',
        author: 'Extension User',
        sourceUrl: 'https://example.com/article',
        submittedVia: 'chrome-extension-api-test',
        tags: ['real-extension-test', 'news']
      })
    });

    if (articleResponse.ok) {
      const articleResult = await articleResponse.json();
      console.log('✅ Article submission successful:', articleResult);
    } else {
      const articleError = await articleResponse.text();
      console.log('❌ Article submission failed:', articleResponse.status, articleError);
    }
  } catch (error) {
    console.error('💥 Article submission error:', error.message);
  }

  console.log('\n🔍 Now check the moderation dashboard for the new submissions!');
}

testUnifiedEndpoint();