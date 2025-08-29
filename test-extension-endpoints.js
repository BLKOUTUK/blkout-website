// Test the new Chrome extension API endpoints
import fetch from 'node-fetch';

async function testExtensionEndpoints() {
  console.log('🧪 Testing Chrome Extension API Endpoints...\n');

  // Test event submission
  try {
    console.log('📅 Testing event submission...');
    const eventResponse = await fetch('http://localhost:5173/api/extension/submit-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Real Chrome Extension Test Event',
        description: 'This is a real test from the Chrome extension API endpoint',
        date: '2025-04-15',
        time: '19:00:00',
        location: 'Community Center',
        organizer: 'BLKOUT Community',
        tags: ['real-extension-test', 'community'],
        sourceUrl: 'https://example.com/event',
        submittedVia: 'chrome-extension-test'
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
    console.error('💥 Event submission error:', error);
  }

  console.log('');

  // Test article submission
  try {
    console.log('📰 Testing article submission...');
    const articleResponse = await fetch('http://localhost:5173/api/extension/submit-article', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Real Chrome Extension Test Article',
        excerpt: 'This is a real test from the Chrome extension API endpoint',
        content: 'Full content of the article submitted via the Chrome extension endpoint test. This should appear in the moderation queue.',
        author: 'Extension User',
        sourceUrl: 'https://example.com/article',
        submittedVia: 'chrome-extension-test',
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
    console.error('💥 Article submission error:', error);
  }
}

testExtensionEndpoints();