// BLKOUT Extension Popup Logic - Production Version
// Connects to BLKOUT beta platform
const PRODUCTION_URL = 'https://blkout-beta.vercel.app';

class BlkoutPopup {
  constructor() {
    this.currentTab = null;
    this.detectedContent = null;
    this.init();
  }
  
  async init() {
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    this.currentTab = tab;
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Scan current page
    this.scanCurrentPage();
  }
  
  setupEventListeners() {
    // Quick action buttons
    document.getElementById('submit-event').addEventListener('click', () => {
      this.showForm('event');
    });
    
    document.getElementById('submit-article').addEventListener('click', () => {
      this.showForm('article');
    });
    
    // Form type change
    document.getElementById('type').addEventListener('change', (e) => {
      this.toggleFormFields(e.target.value);
    });
    
    // Form submission
    document.getElementById('submission-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
    
    // Cancel button
    document.getElementById('cancel-btn').addEventListener('click', () => {
      this.hideForm();
    });
  }
  
  async scanCurrentPage() {
    try {
      // Inject content script to detect content
      const results = await chrome.scripting.executeScript({
        target: { tabId: this.currentTab.id },
        func: this.detectPageContent
      });
      
      if (results && results[0] && results[0].result) {
        this.detectedContent = results[0].result;
        this.updateDetectionStatus(true);
      } else {
        this.updateDetectionStatus(false);
      }
    } catch (error) {
      console.error('Error scanning page:', error);
      this.updateDetectionStatus(false);
    }
  }
  
  // Content detection function (injected into page)
  detectPageContent() {
    const url = window.location.href;
    const hostname = window.location.hostname;
    const title = document.querySelector('h1')?.textContent?.trim() || 
                 document.title?.trim();
    
    // News platform detection
    if (hostname.includes('theguardian.com')) {
      const headline = document.querySelector('h1[data-gu-name="headline"]')?.textContent?.trim() ||
                      document.querySelector('.content__headline')?.textContent?.trim() ||
                      document.querySelector('h1')?.textContent?.trim();
      
      const standfirst = document.querySelector('[data-gu-name="standfirst"]')?.textContent?.trim();
      const content = document.querySelector('[data-gu-name="body"]')?.textContent?.trim();
      const author = document.querySelector('[data-gu-name="author"]')?.textContent?.trim();
      
      if (headline && (content || standfirst)) {
        return {
          type: 'article',
          platform: 'guardian',
          title: headline,
          description: standfirst || content?.substring(0, 300),
          author: author || 'The Guardian',
          url,
          moreInfoUrl: url
        };
      }
    }
    
    if (hostname.includes('bbc.co.uk') || hostname.includes('bbc.com')) {
      const headline = document.querySelector('h1[data-testid="headline"]')?.textContent?.trim() ||
                      document.querySelector('[data-component="headline"]')?.textContent?.trim() ||
                      document.querySelector('h1')?.textContent?.trim();
      
      const content = document.querySelector('[data-component="text-block"]')?.textContent?.trim() ||
                     document.querySelector('[data-testid="article-body"]')?.textContent?.trim();
      
      if (headline && content) {
        return {
          type: 'article',
          platform: 'bbc',
          title: headline,
          description: content.substring(0, 300),
          author: 'BBC News',
          url,
          moreInfoUrl: url
        };
      }
    }
    
    // Platform-specific detection for events
    if (hostname.includes('eventbrite.com')) {
      const eventTitle = document.querySelector('h1[data-automation="event-title"]')?.textContent?.trim();
      const description = document.querySelector('[data-automation="event-description"]')?.textContent?.trim();
      const dateTime = document.querySelector('[data-automation="event-date-time"]')?.textContent?.trim();
      const location = document.querySelector('[data-automation="event-location"]')?.textContent?.trim();
      const organizer = document.querySelector('[data-automation="event-organizer-name"]')?.textContent?.trim();
      
      if (eventTitle) {
        return {
          type: 'event',
          platform: 'eventbrite',
          title: eventTitle,
          description: description?.substring(0, 300),
          dateTime,
          location,
          organizer: organizer || 'Eventbrite Organizer',
          url,
          moreInfoUrl: url
        };
      }
    }
    
    if (hostname.includes('facebook.com') && url.includes('/events/')) {
      const eventTitle = document.querySelector('[data-testid="event-title"]')?.textContent?.trim() ||
                        document.querySelector('h1')?.textContent?.trim();
      const description = document.querySelector('[data-testid="event-description"]')?.textContent?.trim();
      
      if (eventTitle) {
        return {
          type: 'event',
          platform: 'facebook',
          title: eventTitle,
          description: description?.substring(0, 300),
          url,
          moreInfoUrl: url
        };
      }
    }
    
    // Generic content detection
    const content = document.querySelector('article')?.textContent?.trim() ||
                   document.querySelector('main')?.textContent?.trim() ||
                   document.querySelector('.content')?.textContent?.trim() ||
                   document.body?.textContent?.trim();
    
    if (title && content && content.length > 200) {
      // Check for event keywords
      const eventKeywords = ['event', 'workshop', 'conference', 'meetup', 'gathering', 'protest', 'march', 'rally', 'celebration'];
      const isEvent = eventKeywords.some(keyword => 
        title.toLowerCase().includes(keyword) || 
        content.toLowerCase().substring(0, 500).includes(keyword)
      );
      
      return {
        type: isEvent ? 'event' : 'article',
        platform: 'generic',
        title,
        description: content.substring(0, 300),
        url,
        moreInfoUrl: url
      };
    }
    
    return null;
  }
  
  updateDetectionStatus(found) {
    const statusEl = document.getElementById('detection-status');
    
    if (found && this.detectedContent) {
      statusEl.className = 'detection-status';
      statusEl.innerHTML = `
        <strong>✅ Content Detected!</strong>
        <p><strong>${this.detectedContent.type.toUpperCase()}:</strong> ${this.detectedContent.title?.substring(0, 80)}...</p>
        <p><small>From: ${this.detectedContent.platform}</small></p>
      `;
    } else {
      statusEl.className = 'detection-status none';
      statusEl.innerHTML = `
        <strong>🔍 No content detected</strong>
        <p>Use the buttons below to manually submit content.</p>
      `;
    }
  }
  
  showForm(type) {
    document.querySelector('.quick-actions').style.display = 'none';
    document.getElementById('submission-form').style.display = 'block';
    
    // Pre-fill form if content was detected
    if (this.detectedContent) {
      document.getElementById('type').value = this.detectedContent.type || type;
      document.getElementById('title').value = this.detectedContent.title || '';
      document.getElementById('description').value = this.detectedContent.description || '';
      
      if (this.detectedContent.type === 'event' && this.detectedContent.location) {
        document.getElementById('event-location').value = this.detectedContent.location;
      }
      
      // Show scraped info preview if available
      this.showScrapedInfoPreview();
    } else {
      document.getElementById('type').value = type;
      document.getElementById('title').value = this.currentTab.title || '';
    }
    
    this.toggleFormFields(document.getElementById('type').value);
  }
  
  hideForm() {
    document.querySelector('.quick-actions').style.display = 'grid';
    document.getElementById('submission-form').style.display = 'none';
    document.getElementById('status-message').innerHTML = '';
  }
  
  toggleFormFields(type) {
    const eventFields = document.getElementById('event-fields');
    const articleFields = document.getElementById('article-fields');
    
    if (type === 'event') {
      eventFields.style.display = 'block';
      articleFields.style.display = 'none';
      
      // Set default date to today
      if (!document.getElementById('event-date').value) {
        document.getElementById('event-date').value = new Date().toISOString().split('T')[0];
      }
    } else {
      eventFields.style.display = 'none';
      articleFields.style.display = 'block';
    }
  }
  
  async handleSubmit() {
    const formData = new FormData(document.getElementById('submission-form'));
    const type = formData.get('type');
    
    const submitData = {
      title: formData.get('title'),
      description: formData.get('description'),
      sourceUrl: this.currentTab.url,
      detectedAt: new Date().toISOString(),
      submittedVia: 'chrome-extension'
    };
    
    if (type === 'event') {
      // Event-specific fields - match database schema
      submitData.date = formData.get('date') || new Date().toISOString().split('T')[0];
      submitData.time = formData.get('time') || '18:00';
      submitData.location = formData.get('location') || 'TBD';
      submitData.status = 'pending'; // Events need approval
      submitData.tags = ['community-submitted'];
      
      // Add scraped metadata
      if (this.detectedContent?.moreInfoUrl) {
        submitData.moreInfoUrl = this.detectedContent.moreInfoUrl;
      }
      if (this.detectedContent?.organizer) {
        submitData.organizer = this.detectedContent.organizer;
      }
    } else {
      // Article-specific fields - match database schema
      submitData.excerpt = submitData.description; // API expects 'excerpt' not 'description'
      submitData.content = submitData.description; // Full content same as description for now
      submitData.category = 'community'; // Simplified category
      submitData.status = 'draft';
      submitData.tags = ['community-submitted'];
      
      // Add scraped metadata for articles
      if (this.detectedContent?.moreInfoUrl) {
        submitData.moreInfoUrl = this.detectedContent.moreInfoUrl;
      }
      
      // Remove description since API uses excerpt/content
      delete submitData.description;
    }
    
    this.showStatus('Submitting...', 'info');
    
    try {
      console.log('Submitting to BLKOUT:', submitData);
      
      // Use content script to access the web app's API
      const results = await chrome.scripting.executeScript({
        target: { tabId: this.currentTab.id },
        func: this.submitToBlkout,
        args: [submitData, type]
      });
      
      if (results && results[0] && results[0].result) {
        const result = results[0].result;
        if (result.success) {
          this.showStatus('✅ Successfully submitted to BLKOUT! Moderators will review it shortly.', 'success');
          setTimeout(() => {
            window.close();
          }, 2000);
        } else {
          throw new Error(result.error || 'Submission failed');
        }
      } else {
        throw new Error('Failed to connect to BLKOUT platform');
      }
    } catch (error) {
      console.error('Submission error:', error);
      this.showStatus(`❌ Submission failed: ${error.message}. Please try again or use the website directly.`, 'error');
    }
  }
  
  showScrapedInfoPreview() {
    if (!this.detectedContent) return;
    
    const formEl = document.getElementById('submission-form');
    let previewEl = document.getElementById('scraped-info-preview');
    
    // Create preview element if it doesn't exist
    if (!previewEl) {
      previewEl = document.createElement('div');
      previewEl.id = 'scraped-info-preview';
      previewEl.style.cssText = `
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        padding: 12px;
        margin: 15px 0;
        font-size: 12px;
        line-height: 1.4;
      `;
      formEl.insertBefore(previewEl, document.getElementById('status-message'));
    }
    
    let previewContent = '<strong>📋 Scraped Information:</strong><br>';
    
    if (this.detectedContent.moreInfoUrl && this.detectedContent.moreInfoUrl !== this.detectedContent.url) {
      previewContent += `🔗 <strong>More Info:</strong> <a href="${this.detectedContent.moreInfoUrl}" target="_blank">View Details</a><br>`;
    }
    
    if (this.detectedContent.organizer) {
      previewContent += `👤 <strong>Organizer:</strong> ${this.detectedContent.organizer}<br>`;
    }
    
    previewEl.innerHTML = previewContent;
  }

  // Content script function to submit data via the web app - PRODUCTION VERSION
  async submitToBlkout(submitData, type) {
    try {
      console.log('🔍 Checking API availability...', {
        hostname: window.location.hostname,
        hasApi: !!window.BlkoutExtensionApi,
        submitData,
        type
      });
      
      // Check if we're on the BLKOUT website and can access the API
      if ((window.location.hostname === 'localhost' || window.location.hostname === 'blkout-beta.vercel.app') && window.BlkoutExtensionApi) {
        if (type === 'event') {
          const result = await window.BlkoutExtensionApi.submitEvent(submitData);
          return { success: true, data: result };
        } else {
          // Ensure we have excerpt for articles
          if (!submitData.excerpt && submitData.description) {
            submitData.excerpt = submitData.description;
            delete submitData.description;
          }
          const result = await window.BlkoutExtensionApi.submitArticle(submitData);
          return { success: true, data: result };
        }
      } else {
        // Fallback to direct API call for production
        const endpoint = type === 'event' ? '/events' : '/articles';
        const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5173/api' : 'https://blkout-beta.vercel.app/api';
        const response = await fetch(`${apiUrl}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData)
        });
        
        const responseData = await response.json();
        if (response.ok && responseData.success) {
          return { success: true, data: responseData };
        } else {
          return { success: false, error: responseData.message || responseData.error || 'Unknown error' };
        }
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  showStatus(message, type) {
    const statusEl = document.getElementById('status-message');
    statusEl.innerHTML = message;
    statusEl.className = `status-message status-${type}`;
  }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new BlkoutPopup();
});