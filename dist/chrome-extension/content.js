// BLKOUT Chrome Extension - Content Script
// This script runs on web pages to help extract content

console.log('🔌 BLKOUT Chrome Extension loaded on:', window.location.href);

// Function to extract article content from common news sites
function extractArticleContent() {
    // Try common article selectors
    const selectors = [
        'article',
        '.article-content',
        '.post-content',
        '.content',
        '.entry-content',
        '.story-body',
        '.article-body',
        'main'
    ];

    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
            return element.innerText.trim().substring(0, 500); // First 500 chars
        }
    }

    // Fallback to page text
    return document.body.innerText.trim().substring(0, 500);
}

// Function to extract event information
function extractEventInfo() {
    const text = document.body.innerText.toLowerCase();
    
    // Look for date patterns
    const datePatterns = [
        /(\d{1,2}\/\d{1,2}\/\d{4})/,
        /(\d{1,2}-\d{1,2}-\d{4})/,
        /(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4}/i
    ];

    let foundDate = null;
    for (const pattern of datePatterns) {
        const match = text.match(pattern);
        if (match) {
            foundDate = match[0];
            break;
        }
    }

    // Look for time patterns
    const timePattern = /(\d{1,2}:\d{2}\s*(am|pm|AM|PM))/;
    const timeMatch = text.match(timePattern);
    const foundTime = timeMatch ? timeMatch[0] : null;

    return {
        date: foundDate,
        time: foundTime,
        hasEventKeywords: /event|concert|meeting|workshop|conference|gathering/.test(text)
    };
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractContent') {
        const content = extractArticleContent();
        const eventInfo = extractEventInfo();
        
        sendResponse({
            title: document.title,
            url: window.location.href,
            content: content,
            eventInfo: eventInfo
        });
    }
});

// Add a small indicator that the extension is active
const indicator = document.createElement('div');
indicator.innerHTML = '🔌 BLKOUT Extension Active';
indicator.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: #6f2da8;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 10000;
    font-family: Arial, sans-serif;
    opacity: 0.8;
`;

// Show indicator for 3 seconds
document.body.appendChild(indicator);
setTimeout(() => {
    if (indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
    }
}, 3000);