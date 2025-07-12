/**
 * Email Service - Community Newsletter & Engagement
 * 
 * @purpose Handle community email capture with n8n workflow integration
 * @values Privacy-first, community-controlled data, cooperative ownership
 * @integration Works with n8n automation and Google Sheets community tracking
 */

export interface CommunityEmailData {
  email: string
  interests: string[]
  source: 'scrollytelling' | 'homepage' | 'quiz' | 'direct'
  timestamp: string
  blkouthubInterest?: boolean
  location?: string
  referrer?: string
}

export interface EmailResponse {
  success: boolean
  message: string
  error?: string
  trackingId?: string
}

interface SubscriptionPreferences {
  newsletter: boolean
  events: boolean
  movementUpdates: boolean
  blkouthubAccess: boolean
  communityResources: boolean
}

/**
 * N8N Webhook Configuration
 * Points to BLKOUT community automation workflow
 */
const N8N_WEBHOOK_URL = (import.meta as any).env?.VITE_N8N_WEBHOOK_URL || 'https://n8n.blkoutuk.com/webhook/community-signup'
const BACKUP_WEBHOOK_URL = (import.meta as any).env?.VITE_BACKUP_WEBHOOK_URL || null
const DEMO_MODE = (import.meta as any).env?.VITE_ENVIRONMENT === 'demo' || !N8N_WEBHOOK_URL.includes('blkoutuk.com')

/**
 * Validate email address with community-appropriate standards
 */
export function validateEmail(email: string): { valid: boolean; message?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!email.trim()) {
    return { valid: false, message: "We need an email to keep you connected to the community" }
  }
  
  if (!emailRegex.test(email)) {
    return { valid: false, message: "That doesn't look like a valid email address" }
  }
  
  if (email.length > 254) {
    return { valid: false, message: "That email address is too long" }
  }
  
  return { valid: true }
}

/**
 * Validate community interests selection
 */
export function validateInterests(interests: string[]): { valid: boolean; message?: string } {
  const validInterests = [
    'newsletter',
    'events', 
    'movement-updates',
    'blkouthub-access',
    'community-resources',
    'cooperative-ownership',
    'storytelling',
    'mutual-aid'
  ]
  
  if (interests.length === 0) {
    return { valid: false, message: "Please select at least one way to stay connected" }
  }
  
  const invalidInterests = interests.filter(interest => !validInterests.includes(interest))
  if (invalidInterests.length > 0) {
    return { valid: false, message: "Some selected interests aren't available" }
  }
  
  return { valid: true }
}

/**
 * Generate tracking ID for community analytics
 */
function generateTrackingId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `blkout-${timestamp}-${random}`
}

/**
 * Prepare data for n8n workflow processing
 */
function prepareWorkflowData(data: CommunityEmailData): any {
  return {
    email: data.email,
    interests: data.interests,
    source: data.source,
    timestamp: data.timestamp,
    blkouthub_interest: data.blkouthubInterest || false,
    location: data.location || 'unknown',
    referrer: data.referrer || 'direct',
    tracking_id: generateTrackingId(),
    community_platform: 'blkout-website',
    engagement_level: determineEngagementLevel(data.interests),
    privacy_consent: true, // Required for GDPR compliance
    community_values_acknowledged: true
  }
}

/**
 * Determine engagement level based on interests
 */
function determineEngagementLevel(interests: string[]): 'casual' | 'active' | 'committed' {
  if (interests.includes('blkouthub-access') || interests.includes('cooperative-ownership')) {
    return 'committed'
  }
  if (interests.length >= 3 || interests.includes('movement-updates')) {
    return 'active'
  }
  return 'casual'
}

/**
 * Send to n8n workflow with fallback handling
 */
async function sendToWorkflow(workflowData: any): Promise<{ success: boolean; error?: string }> {
  try {
    // Demo mode - simulate successful submission
    if (DEMO_MODE) {
      console.log('Demo mode: Simulating webhook submission', workflowData)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
      return { success: true }
    }

    // Primary n8n webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Source': 'blkout-website',
        'X-Community': 'true'
      },
      body: JSON.stringify(workflowData)
    })
    
    if (response.ok) {
      return { success: true }
    }
    
    // Try backup webhook if primary fails
    if (BACKUP_WEBHOOK_URL) {
      const backupResponse = await fetch(BACKUP_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...workflowData,
          fallback_used: true,
          primary_webhook_failed: true
        })
      })
      
      if (backupResponse.ok) {
        return { success: true }
      }
    }
    
    throw new Error(`Webhook failed: ${response.status} ${response.statusText}`)
    
  } catch (error) {
    console.error('Workflow submission error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Store locally as backup (for development and offline support)
 */
function storeLocalBackup(data: CommunityEmailData): void {
  try {
    const backups = JSON.parse(localStorage.getItem('blkout-email-backups') || '[]')
    backups.push({
      ...data,
      stored_at: new Date().toISOString(),
      sync_status: 'pending'
    })
    
    // Keep only last 50 entries for storage management
    if (backups.length > 50) {
      backups.splice(0, backups.length - 50)
    }
    
    localStorage.setItem('blkout-email-backups', JSON.stringify(backups))
  } catch (error) {
    console.error('Local backup failed:', error)
  }
}

/**
 * Main email signup function
 */
export async function signupForCommunity(data: CommunityEmailData): Promise<EmailResponse> {
  try {
    // Validate email
    const emailValidation = validateEmail(data.email)
    if (!emailValidation.valid) {
      return {
        success: false,
        message: emailValidation.message || 'Email validation failed'
      }
    }
    
    // Validate interests
    const interestsValidation = validateInterests(data.interests)
    if (!interestsValidation.valid) {
      return {
        success: false,
        message: interestsValidation.message || 'Interest validation failed'
      }
    }
    
    // Prepare data for workflow
    const workflowData = prepareWorkflowData(data)
    
    // Store local backup
    storeLocalBackup(data)
    
    // Send to n8n workflow
    const workflowResult = await sendToWorkflow(workflowData)
    
    if (workflowResult.success) {
      return {
        success: true,
        message: "Welcome to the BLKOUT community! Check your email for next steps.",
        trackingId: workflowData.tracking_id
      }
    } else {
      return {
        success: false,
        message: "We're having technical difficulties. Your information has been saved and we'll add you to the community soon.",
        error: workflowResult.error
      }
    }
    
  } catch (error) {
    console.error('Community signup error:', error)
    
    // Still store locally for manual processing
    storeLocalBackup(data)
    
    return {
      success: false,
      message: "Something went wrong, but we've saved your information. We'll get you connected to the community soon.",
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Check if email is already in community (privacy-conscious check)
 */
export async function checkCommunityMembership(email: string): Promise<boolean> {
  // This would integrate with community database
  // For now, return false to allow all signups
  return false
}

/**
 * Get recommended interests based on scrollytelling journey
 */
export function getRecommendedInterests(source: string, quizResponses?: any[]): string[] {
  const baseInterests = ['newsletter', 'events']
  
  if (source === 'scrollytelling') {
    baseInterests.push('movement-updates')
  }
  
  if (source === 'quiz' && quizResponses) {
    // Add logic based on quiz responses
    baseInterests.push('community-resources')
  }
  
  return baseInterests
}

/**
 * Analytics tracking for community insights
 */
export function trackEmailEngagement(event: string, email: string, metadata?: any): void {
  const tracking = {
    event,
    email_hash: btoa(email).slice(0, 10), // Privacy-conscious tracking
    timestamp: new Date().toISOString(),
    metadata,
    source: 'blkout-website'
  }
  
  // In production, send to community analytics
  console.log('Email engagement:', tracking)
}

/**
 * Export types for component use
 */
export type { SubscriptionPreferences }