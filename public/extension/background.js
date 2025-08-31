/**
 * BLKOUT Chrome Extension - Background Service Worker
 * Handles extension lifecycle and communication
 */

class BlkoutExtensionBackground {
  constructor() {
    this.setupEventListeners()
    this.initializeExtension()
  }
  
  setupEventListeners() {
    // Extension installation/startup
    chrome.runtime.onInstalled.addListener((details) => {
      this.handleInstallation(details)
    })
    
    chrome.runtime.onStartup.addListener(() => {
      console.log('BLKOUT Extension: Starting up')
    })
    
    // Message handling
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse)
      return true // Keep message channel open
    })
    
    // Tab updates
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      this.handleTabUpdate(tabId, changeInfo, tab)
    })
    
    // Action button clicks
    chrome.action.onClicked.addListener((tab) => {
      this.handleActionClick(tab)
    })
  }
  
  async initializeExtension() {
    try {
      // Set initial badge
      await chrome.action.setBadgeText({ text: '' })
      await chrome.action.setBadgeBackgroundColor({ color: '#667eea' })
      
      // Initialize storage if needed
      const result = await chrome.storage.local.get(['submissions', 'settings'])
      
      if (!result.settings) {
        await chrome.storage.local.set({
          settings: {
            autoAnalyze: true,
            showHighRelevanceNotifications: true,
            debugMode: false
          }
        })
      }
      
      if (!result.submissions) {
        await chrome.storage.local.set({ submissions: [] })
      }
      
      console.log('BLKOUT Extension: Initialized successfully')
      
    } catch (error) {
      console.error('Extension initialization error:', error)
    }
  }
  
  handleInstallation(details) {
    if (details.reason === 'install') {
      console.log('BLKOUT Extension: First-time installation')
      
      // Open welcome page
      chrome.tabs.create({
        url: 'https://blkout.vercel.app/welcome?extension=installed'
      })
      
    } else if (details.reason === 'update') {
      console.log(`BLKOUT Extension: Updated to version ${chrome.runtime.getManifest().version}`)
    }
  }
  
  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'highRelevanceDetected':
          await this.handleHighRelevanceDetection(request, sender)
          sendResponse({ received: true })
          break
          
        case 'getExtensionStats':
          const stats = await this.getExtensionStats()
          sendResponse(stats)
          break
          
        case 'submitStoryToBlkout':
          const result = await this.submitStoryToBlkout(request.storyData)
          sendResponse(result)
          break
          
        case 'getRecentSubmissions':
          const submissions = await this.getRecentSubmissions(request.limit)
          sendResponse(submissions)
          break
          
        case 'updateSettings':
          await this.updateSettings(request.settings)
          sendResponse({ updated: true })
          break
          
        default:
          console.log('Unknown message action:', request.action)
          sendResponse({ error: 'Unknown action' })
      }
      
    } catch (error) {
      console.error('Message handling error:', error)
      sendResponse({ error: error.message })
    }
  }
  
  async handleTabUpdate(tabId, changeInfo, tab) {
    // Only process when page is completely loaded
    if (changeInfo.status !== 'complete' || !tab.url) return
    
    try {
      const settings = await this.getSettings()
      
      if (settings.autoAnalyze) {
        // Inject content script if needed and analyze page
        await chrome.scripting.executeScript({
          target: { tabId },
          files: ['content.js']
        })
      }
      
    } catch (error) {
      // Silently handle injection errors (e.g., on chrome:// pages)
      if (!error.message.includes('Cannot access')) {
        console.error('Tab update handling error:', error)
      }
    }
  }
  
  handleActionClick(tab) {
    // This is called when user clicks the extension icon
    // Popup should open automatically, but we can track the click
    console.log('Extension icon clicked for tab:', tab.url)
  }
  
  async handleHighRelevanceDetection(request, sender) {
    try {
      const settings = await this.getSettings()
      
      if (settings.showHighRelevanceNotifications) {
        // Show badge indicator
        await chrome.action.setBadgeText({ 
          text: '!',
          tabId: sender.tab.id 
        })
        
        // Update action title
        await chrome.action.setTitle({
          title: 'BLKOUT: High community relevance detected - Click to submit story',
          tabId: sender.tab.id
        })
        
        // Log for debugging
        console.log('High relevance detected:', {
          url: request.url,
          score: request.analysis.communityRelevance.score
        })
      }
      
    } catch (error) {
      console.error('High relevance detection handling error:', error)
    }
  }
  
  async getExtensionStats() {
    try {
      const result = await chrome.storage.local.get(['submissions'])
      const submissions = result.submissions || []
      
      const stats = {
        totalSubmissions: submissions.length,
        submissionsThisWeek: submissions.filter(s => {
          const submissionDate = new Date(s.submitted_at)
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          return submissionDate > weekAgo
        }).length,
        categoryCounts: {},
        locationCounts: {},
        lastSubmission: submissions[0]?.submitted_at || null
      }
      
      // Calculate category and location distributions
      submissions.forEach(submission => {
        stats.categoryCounts[submission.type] = (stats.categoryCounts[submission.type] || 0) + 1
        if (submission.location) {
          stats.locationCounts[submission.location] = (stats.locationCounts[submission.location] || 0) + 1
        }
      })
      
      return stats
      
    } catch (error) {
      console.error('Error getting extension stats:', error)
      return { error: error.message }
    }
  }
  
  async submitStoryToBlkout(storyData) {
    try {
      // This would integrate with the BLKOUT API
      // For now, simulate the submission
      
      console.log('Background: Submitting story to BLKOUT:', storyData)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mark as demo submission
      const submissionWithMeta = {
        ...storyData,
        id: Date.now().toString(),
        submission_timestamp: new Date().toISOString(),
        status: 'submitted',
        demo_content: true,
        platform: 'chrome_extension'
      }
      
      // Store locally
      const result = await chrome.storage.local.get(['submissions'])
      const submissions = result.submissions || []
      submissions.unshift(submissionWithMeta)
      
      // Keep only last 100 submissions
      await chrome.storage.local.set({ 
        submissions: submissions.slice(0, 100) 
      })
      
      return { 
        success: true, 
        id: submissionWithMeta.id,
        message: 'Story submitted successfully (demo mode)'
      }
      
    } catch (error) {
      console.error('Story submission error:', error)
      return { 
        success: false, 
        error: error.message 
      }
    }
  }
  
  async getRecentSubmissions(limit = 10) {
    try {
      const result = await chrome.storage.local.get(['submissions'])
      const submissions = result.submissions || []
      
      return submissions.slice(0, limit)
      
    } catch (error) {
      console.error('Error getting recent submissions:', error)
      return []
    }
  }
  
  async getSettings() {
    try {
      const result = await chrome.storage.local.get(['settings'])
      return result.settings || {
        autoAnalyze: true,
        showHighRelevanceNotifications: true,
        debugMode: false
      }
    } catch (error) {
      console.error('Error getting settings:', error)
      return {}
    }
  }
  
  async updateSettings(newSettings) {
    try {
      await chrome.storage.local.set({ settings: newSettings })
      console.log('Settings updated:', newSettings)
    } catch (error) {
      console.error('Error updating settings:', error)
    }
  }
}

// Initialize background service
new BlkoutExtensionBackground()

console.log('BLKOUT Extension: Background service worker loaded')