// Test what happens when extension submits vs manual

async function testExtensionSubmission() {
  console.log('🧪 Testing Extension-style Submission...');
  
  // Simulate what extension sends when content is auto-detected
  const extensionData = {
    title: "Auto-detected: The UK's approach to tackling racism needs radical reform", 
    excerpt: "New research shows current anti-racism policies are failing to address systemic issues affecting Black communities across Britain.",
    content: "New research shows current anti-racism policies are failing to address systemic issues affecting Black communities across Britain.", // Same as excerpt - this might be the issue!
    category: "Community Response",
    priority: "medium", 
    type: "community_response",
    author: "Community Submitted",
    status: "draft",
    tags: ["community-submitted"],
    featured: false,
    sourceUrl: "https://www.theguardian.com/uk-news/test-article",
    detectedAt: new Date().toISOString(),
    submittedVia: "chrome-extension"
  };
  
  try {
    const response = await fetch('https://blkout-beta.vercel.app/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'chrome-extension://test-extension-id'
      },
      body: JSON.stringify(extensionData)
    });
    
    const result = await response.json();
    console.log('✅ Extension-style submission result:', result);
    
    if (result.success) {
      console.log('🎉 Extension submission worked! Article ID:', result.article.id);
      return result.article.id;
    } else {
      console.error('❌ Extension submission failed:', result.error);
      return null;
    }
  } catch (error) {
    console.error('💥 Extension submission error:', error);
    return null;
  }
}

async function testManualSubmission() {
  console.log('🧪 Testing Manual-style Submission...');
  
  // Simulate what works manually 
  const manualData = {
    title: "Manual: The UK's approach to tackling racism needs radical reform",
    excerpt: "A thoughtful excerpt summarizing the key points of this important article about racism policy reform.",
    content: `This is a full, well-structured article about racism policy reform in the UK. 

It contains multiple paragraphs with detailed analysis, proper formatting, and comprehensive coverage of the topic.

The content is substantial and provides real value to readers, unlike the truncated auto-detected content that might be too short or incomplete.

This represents what a properly submitted article should look like with full content rather than just a brief excerpt.`,
    category: "Community Response", 
    author: "Manual Submitter",
    status: "draft",
    tags: ["manual-test"],
    featured: false
  };
  
  try {
    const response = await fetch('https://blkout-beta.vercel.app/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(manualData)
    });
    
    const result = await response.json();
    console.log('✅ Manual-style submission result:', result);
    
    if (result.success) {
      console.log('🎉 Manual submission worked! Article ID:', result.article.id);
      return result.article.id;
    } else {
      console.error('❌ Manual submission failed:', result.error);
      return null;
    }
  } catch (error) {
    console.error('💥 Manual submission error:', error);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting Extension vs Manual Submission Tests...\n');
  
  const extensionId = await testExtensionSubmission();
  console.log('\n' + '='.repeat(50) + '\n');
  const manualId = await testManualSubmission();
  
  console.log('\n' + '📊 TEST SUMMARY:');
  console.log('Extension submission:', extensionId ? 'SUCCESS ✅' : 'FAILED ❌');
  console.log('Manual submission:', manualId ? 'SUCCESS ✅' : 'FAILED ❌');
  
  if (extensionId && manualId) {
    console.log('\n🔍 Both worked! Issue might be in extension UI/detection logic');
  } else if (!extensionId && manualId) {
    console.log('\n🚨 Extension-style data is rejected by API!');
  } else if (extensionId && !manualId) {
    console.log('\n🤔 Manual style failed? This is unexpected...');
  } else {
    console.log('\n💥 Both failed - API might be down');
  }
}

// Run the tests
runTests().catch(console.error);