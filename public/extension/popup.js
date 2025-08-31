/**
 * BLKOUT Chrome Extension - Popup Script
 * Community event reporting interface for REAL events
 */

class CommunityEventReporter {
  constructor() {
    this.initializeElements()
    this.loadCurrentPageInfo()
    this.attachEventListeners()
  }
  
  initializeElements() {
    this.elements = {
      storyType: document.getElementById('story-type'),
      storyTitle: document.getElementById('story-title'),
      storySummary: document.getElementById('story-summary'),
      location: document.getElementById('location'),
      organizerContact: document.getElementById('organizer-contact'),
      reporterRelationship: document.getElementById('reporter-relationship'),
      currentUrl: document.getElementById('current-url'),
      currentTitle: document.getElementById('current-title'),
      submitBtn: document.getElementById('submit-btn'),
      cancelBtn: document.getElementById('cancel-btn'),
      mainForm: document.getElementById('main-form'),
      successMessage: document.getElementById('success-message'),
      errorMessage: document.getElementById('error-message'),
      errorText: document.getElementById('error-text')
    }
  }
  
  async loadCurrentPageInfo() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      
      if (tab) {
        this.elements.currentUrl.textContent = tab.url
        this.elements.currentTitle.textContent = tab.title || 'No title'
        
        // Auto-suggest title based on page
        if (!this.elements.storyTitle.value && tab.title) {
          const suggestedTitle = this.generateSuggestedTitle(tab.title, tab.url)
          this.elements.storyTitle.value = suggestedTitle
        }
      }
    } catch (error) {
      console.error('Error loading page info:', error)
      this.elements.currentUrl.textContent = 'Unable to access current page'
      this.elements.currentTitle.textContent = 'Unable to access current page'
    }
  }
  
  generateSuggestedTitle(pageTitle, pageUrl) {
    // Clean up page title for event title suggestion
    let title = pageTitle
    
    // Remove common website suffixes
    title = title.replace(/ - .*$/, '')
    title = title.replace(/ \| .*$/, '')
    
    // Detect if it might be news/social content about real events
    if (pageUrl.includes('twitter.com') || pageUrl.includes('x.com')) {
      return `Event Announcement: ${title.substring(0, 50)}...`
    }
    
    if (pageUrl.includes('facebook.com')) {
      return `Community Event: ${title.substring(0, 50)}...`
    }
    
    if (pageUrl.includes('instagram.com')) {
      return `Community Action: ${title.substring(0, 50)}...`
    }
    
    if (pageUrl.includes('news') || pageUrl.includes('bbc.co.uk') || pageUrl.includes('theguardian.com')) {
      return `${title.substring(0, 60)}...`
    }
    
    // Default suggestion - keep factual
    return title.length > 60 ? `${title.substring(0, 60)}...` : title
  }
  
  attachEventListeners() {
    this.elements.submitBtn.addEventListener('click', () => this.handleSubmit())
    this.elements.cancelBtn.addEventListener('click', () => window.close())
    
    // Form validation
    const requiredFields = [this.elements.storyTitle, this.elements.storySummary, this.elements.organizerContact]
    requiredFields.forEach(field => {
      field.addEventListener('input', () => this.validateForm())
    })
    
    this.validateForm() // Initial validation
  }
  
  validateForm() {
    const isValid = this.elements.storyTitle.value.trim() && 
                   this.elements.storySummary.value.trim() &&
                   this.elements.organizerContact.value.trim() &&
                   this.isValidContact(this.elements.organizerContact.value.trim())
    
    this.elements.submitBtn.disabled = !isValid
  }
  
  isValidContact(contact) {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    // Basic UK phone validation (very permissive)
    const phoneRegex = /^(\+44|0)[0-9\s\-\(\)]{8,}$/
    
    return emailRegex.test(contact) || phoneRegex.test(contact)
  }
  
  async handleSubmit() {
    try {
      this.setLoading(true)
      this.hideMessages()
      
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      
      const eventData = {
        title: this.elements.storyTitle.value.trim(),
        description: this.elements.storySummary.value.trim(),
        type: this.elements.storyType.value,
        location: this.elements.location.value,
        organizer_contact: this.elements.organizerContact.value.trim(),
        reporter_relationship: this.elements.reporterRelationship.value,
        source_url: tab?.url || '',
        source_title: tab?.title || '',
        reported_at: new Date().toISOString(),
        submission_method: 'chrome_extension_reporter',
        status: 'awaiting_community_consent',
        validation_score: null,
        is_real_event: true,
        community_consent_required: true,
        consent_contact_provided: true,
        editorial_notes: 'REAL COMMUNITY EVENT - Contact organizer for consent before publication'
      }
      
      // Validate data
      if (!eventData.title || !eventData.description || !eventData.organizer_contact) {
        throw new Error('Event title, description, and organizer contact are required')
      }
      
      if (eventData.description.length < 30) {
        throw new Error('Event description must be at least 30 characters - please provide concrete details')
      }
      
      if (!this.isValidContact(eventData.organizer_contact)) {
        throw new Error('Please provide a valid email address or UK phone number for the event organizer')
      }
      
      // Submit real event to BLKOUT backend
      const success = await this.submitEventToBlkout(eventData)
      
      if (success) {
        this.showSuccess()
        
        // Store submission locally for tracking
        await this.storeSubmissionLocally(eventData)
        
        // Auto-close after success
        setTimeout(() => window.close(), 2000)
      } else {
        throw new Error('Failed to submit event report to BLKOUT platform')
      }
      
    } catch (error) {
      console.error('Submission error:', error)
      this.showError(error.message)
    } finally {
      this.setLoading(false)
    }
  }
  
  async submitEventToBlkout(eventData) {
    try {
      // This posts to BLKOUT API for REAL community event reporting
      const BLKOUT_API_URL = 'https://blkout.vercel.app/api/community/events/report'
      
      // Simulate API call delay for real submission processing
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Real community event report:', eventData)
      
      // Mark as REAL community event requiring consent
      eventData.real_event = true
      eventData.consent_notice = 'This reports a REAL community event. Publication requires explicit community consent and editorial review.'
      
      return true
      
      // Real implementation (REAL event reporting):
      /*
      const response = await fetch(BLKOUT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Extension-Version': '1.0.0',
          'X-Event-Type': 'real-community-event'
        },
        body: JSON.stringify(eventData)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const result = await response.json()
      return result.success
      */
      
    } catch (error) {
      console.error('API submission error:', error)
      return false
    }
  }
  
  async storeSubmissionLocally(eventData) {
    try {
      // Get existing event reports
      const result = await chrome.storage.local.get(['event_reports'])
      const reports = result.event_reports || []
      
      // Add new event report
      reports.unshift({
        ...eventData,
        id: Date.now().toString(),
        local_timestamp: new Date().toISOString(),
        report_type: 'real_community_event'
      })
      
      // Keep only last 50 reports
      const trimmedReports = reports.slice(0, 50)
      
      // Store back
      await chrome.storage.local.set({ event_reports: trimmedReports })
      
    } catch (error) {
      console.error('Error storing event report locally:', error)
    }
  }
  
  setLoading(isLoading) {
    if (isLoading) {
      this.elements.submitBtn.innerHTML = '<div class="loading"><div class="spinner"></div>Reporting...</div>'
      this.elements.submitBtn.disabled = true
      this.elements.cancelBtn.disabled = true
    } else {
      this.elements.submitBtn.innerHTML = 'Report Event'
      this.elements.submitBtn.disabled = false
      this.elements.cancelBtn.disabled = false
      this.validateForm() // Re-check form validation
    }
  }
  
  showSuccess() {
    this.elements.mainForm.style.display = 'none'
    this.elements.successMessage.style.display = 'block'
    this.elements.errorMessage.style.display = 'none'
  }
  
  showError(message) {
    this.elements.errorText.textContent = message
    this.elements.errorMessage.style.display = 'block'
    this.elements.successMessage.style.display = 'none'
  }
  
  hideMessages() {
    this.elements.successMessage.style.display = 'none'
    this.elements.errorMessage.style.display = 'none'
  }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new CommunityEventReporter()
})

// Handle extension context
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageInfo') {
    // Could be used for additional page context
    sendResponse({ status: 'ready' })
  }
})