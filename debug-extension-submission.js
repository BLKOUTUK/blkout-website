// Debug script to compare extension vs manual submissions

// Simulate what the extension sends (with detected content)
const extensionSubmission = {
  title: "Detected Article Title",
  description: "This is the detected description from the webpage",
  sourceUrl: "https://example.com/article",
  detectedAt: new Date().toISOString(),
  submittedVia: "chrome-extension",
  // After transformation for articles:
  excerpt: "This is the detected description from the webpage", 
  content: "This is the detected description from the webpage",
  category: "Community Response",
  priority: "medium",
  type: "community_response",
  author: "Community Submitted",
  status: "draft",
  tags: ["community-submitted"],
  featured: false
  // description gets deleted
};

// What manual submission looks like (working)
const manualSubmission = {
  title: "Manual Article Title",
  excerpt: "Proper excerpt text",
  content: "Full article content here with proper formatting and length",
  category: "Community Response", 
  author: "Manual Submitter",
  status: "draft",
  tags: ["manual"],
  featured: false
};

console.log("=== EXTENSION SUBMISSION ===");
console.log(JSON.stringify(extensionSubmission, null, 2));

console.log("\n=== MANUAL SUBMISSION ===");
console.log(JSON.stringify(manualSubmission, null, 2));

console.log("\n=== KEY DIFFERENCES ===");
console.log("1. Extension uses detected content for both excerpt AND content");
console.log("2. Manual has separate excerpt and content fields");
console.log("3. Extension might have incomplete/truncated content");
console.log("4. Extension relies on auto-detection which might fail");

// Test what the API expects
const testSubmission = async () => {
  const response = await fetch('https://blkout-beta.vercel.app/api/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: "Debug Test Article",
      excerpt: "Short excerpt", 
      content: "Full content here",
      category: "Community Response",
      author: "Debug Test",
      status: "draft",
      tags: ["debug"],
      submittedVia: "debug-script"
    })
  });
  
  return response.json();
};

// Log the API requirements
console.log("\n=== API EXPECTS ===");
console.log("title: string (required)");
console.log("excerpt: string (for preview)");  
console.log("content: string (full article)");
console.log("category: string");
console.log("author: string");
console.log("status: 'draft' | 'published'");
console.log("tags: string[]");