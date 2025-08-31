/**
 * Onboarding Integration Service
 * Coordinates user journey across BLKOUT ecosystem components
 * Tracks progress and triggers cross-component actions
 */

interface OnboardingProgress {
  user_id?: string
  current_step: number
  completed_steps: string[]
  engagement_level: 'newcomer' | 'exploring' | 'engaged' | 'community_member'
  first_visit_timestamp: number
  last_activity_timestamp: number
  preferences: {
    preferred_location?: string
    interests?: string[]
    accessibility_needs?: string[]
  }
  ecosystem_interactions: {
    website_visits: number
    ivor_conversations: number
    events_explored: number
    stories_read: number
    governance_participation: number
  }
}

interface CrossComponentAction {
  component: 'ivor' | 'events' | 'newsroom' | 'governance' | 'extension'
  action: string
  data: any
  timestamp: number
}

class OnboardingIntegrationService {
  private readonly STORAGE_KEY = 'blkout_onboarding_progress'
  private readonly IVOR_API_URL = 'https://blkoutnxt-ivor-frontend.vercel.app'
  
  async getProgress(): Promise<OnboardingProgress> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        const progress = JSON.parse(stored)
        // Update last activity
        progress.last_activity_timestamp = Date.now()
        this.saveProgress(progress)
        return progress
      }
    } catch (error) {
      console.warn('Error reading onboarding progress:', error)
    }
    
    // Return default progress for new users
    return {
      current_step: 1,
      completed_steps: [],
      engagement_level: 'newcomer',
      first_visit_timestamp: Date.now(),
      last_activity_timestamp: Date.now(),
      preferences: {},
      ecosystem_interactions: {
        website_visits: 1,
        ivor_conversations: 0,
        events_explored: 0,
        stories_read: 0,
        governance_participation: 0
      }
    }
  }
  
  saveProgress(progress: OnboardingProgress): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress))
      
      // Also send to analytics/backend if user consents
      this.sendProgressUpdate(progress)
    } catch (error) {
      console.warn('Error saving onboarding progress:', error)
    }
  }
  
  private async sendProgressUpdate(progress: OnboardingProgress): Promise<void> {
    // Send anonymized progress data for community insights
    try {
      const anonymizedProgress = {
        current_step: progress.current_step,
        completed_steps_count: progress.completed_steps.length,
        engagement_level: progress.engagement_level,
        days_since_first_visit: Math.floor((Date.now() - progress.first_visit_timestamp) / (1000 * 60 * 60 * 24)),
        ecosystem_interactions: progress.ecosystem_interactions
      }
      
      // In production, this would go to your analytics endpoint
      console.log('📊 Onboarding Analytics:', anonymizedProgress)
    } catch (error) {
      console.warn('Error sending progress update:', error)
    }
  }
  
  completeStep(stepId: string): OnboardingProgress {
    const progress = this.getProgressSync()
    
    if (!progress.completed_steps.includes(stepId)) {
      progress.completed_steps.push(stepId)
      progress.current_step = Math.min(progress.current_step + 1, 6) // Max 6 steps
      
      // Update engagement level based on progress
      progress.engagement_level = this.calculateEngagementLevel(progress.completed_steps.length)
      
      // Trigger cross-component actions
      this.triggerCrossComponentActions(stepId, progress)
      
      this.saveProgress(progress)
    }
    
    return progress
  }
  
  private getProgressSync(): OnboardingProgress {
    // Synchronous version for immediate updates
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.warn('Error reading progress sync:', error)
    }
    
    return {
      current_step: 1,
      completed_steps: [],
      engagement_level: 'newcomer',
      first_visit_timestamp: Date.now(),
      last_activity_timestamp: Date.now(),
      preferences: {},
      ecosystem_interactions: {
        website_visits: 1,
        ivor_conversations: 0,
        events_explored: 0,
        stories_read: 0,
        governance_participation: 0
      }
    }
  }
  
  private calculateEngagementLevel(completedSteps: number): OnboardingProgress['engagement_level'] {
    if (completedSteps >= 5) return 'community_member'
    if (completedSteps >= 3) return 'engaged'
    if (completedSteps >= 1) return 'exploring'
    return 'newcomer'
  }
  
  private triggerCrossComponentActions(stepId: string, progress: OnboardingProgress): void {
    const actions: Record<string, CrossComponentAction[]> = {
      'welcome_blkouthub': [
        {
          component: 'ivor',
          action: 'prepare_welcome_context',
          data: { new_user: true, first_visit: true },
          timestamp: Date.now()
        }
      ],
      'meet_ivor_ai': [
        {
          component: 'events',
          action: 'highlight_beginner_friendly',
          data: { user_location: progress.preferences.preferred_location },
          timestamp: Date.now()
        }
      ],
      'discover_local_events': [
        {
          component: 'newsroom',
          action: 'recommend_local_stories',
          data: { user_location: progress.preferences.preferred_location },
          timestamp: Date.now()
        }
      ],
      'join_storytelling': [
        {
          component: 'extension',
          action: 'prepare_onboarding_guide',
          data: { user_engagement: progress.engagement_level },
          timestamp: Date.now()
        }
      ],
      'become_community_reporter': [
        {
          component: 'governance',
          action: 'introduce_voting_rights',
          data: { user_ready_for_governance: true },
          timestamp: Date.now()
        }
      ]
    }
    
    const stepActions = actions[stepId]
    if (stepActions) {
      stepActions.forEach(action => {
        this.executeCrossComponentAction(action)
      })
    }
  }
  
  private executeCrossComponentAction(action: CrossComponentAction): void {
    switch (action.component) {
      case 'ivor':
        this.sendToIVOR(action)
        break
      case 'events':
        this.updateEventsContext(action)
        break
      case 'newsroom':
        this.updateNewsroomRecommendations(action)
        break
      case 'governance':
        this.prepareGovernanceIntro(action)
        break
      case 'extension':
        this.prepareExtensionOnboarding(action)
        break
    }
  }
  
  private async sendToIVOR(action: CrossComponentAction): Promise<void> {
    try {
      // In production, this would integrate with IVOR's context API
      const contextUpdate = {
        user_onboarding_stage: action.data,
        action_type: action.action,
        timestamp: action.timestamp
      }
      
      console.log('🤖 IVOR Context Update:', contextUpdate)
      
      // Could also store in localStorage for IVOR to read
      localStorage.setItem('ivor_onboarding_context', JSON.stringify(contextUpdate))
    } catch (error) {
      console.warn('Error sending to IVOR:', error)
    }
  }
  
  private updateEventsContext(action: CrossComponentAction): void {
    // Update events component to highlight beginner-friendly events
    const eventsContext = {
      highlight_beginner_events: true,
      user_location: action.data.user_location,
      onboarding_stage: action.action,
      timestamp: action.timestamp
    }
    
    localStorage.setItem('events_onboarding_context', JSON.stringify(eventsContext))
    console.log('📅 Events Context Update:', eventsContext)
  }
  
  private updateNewsroomRecommendations(action: CrossComponentAction): void {
    // Update newsroom to show location-relevant stories
    const newsroomContext = {
      recommend_local_stories: true,
      user_location: action.data.user_location,
      prioritize_newcomer_friendly: true,
      timestamp: action.timestamp
    }
    
    localStorage.setItem('newsroom_onboarding_context', JSON.stringify(newsroomContext))
    console.log('📰 Newsroom Context Update:', newsroomContext)
  }
  
  private prepareGovernanceIntro(action: CrossComponentAction): void {
    // Prepare governance component for introducing voting
    const governanceContext = {
      show_onboarding_intro: true,
      user_ready_for_participation: action.data.user_ready_for_governance,
      highlight_beginner_proposals: true,
      timestamp: action.timestamp
    }
    
    localStorage.setItem('governance_onboarding_context', JSON.stringify(governanceContext))
    console.log('🏛️ Governance Context Update:', governanceContext)
  }
  
  private prepareExtensionOnboarding(action: CrossComponentAction): void {
    // Prepare extension onboarding guide
    const extensionContext = {
      show_detailed_guide: true,
      user_engagement_level: action.data.user_engagement,
      emphasize_consent_process: true,
      timestamp: action.timestamp
    }
    
    localStorage.setItem('extension_onboarding_context', JSON.stringify(extensionContext))
    console.log('🔗 Extension Context Update:', extensionContext)
  }
  
  trackInteraction(component: keyof OnboardingProgress['ecosystem_interactions']): void {
    const progress = this.getProgressSync()
    progress.ecosystem_interactions[component]++
    progress.last_activity_timestamp = Date.now()
    this.saveProgress(progress)
  }
  
  updatePreferences(preferences: Partial<OnboardingProgress['preferences']>): void {
    const progress = this.getProgressSync()
    progress.preferences = { ...progress.preferences, ...preferences }
    this.saveProgress(progress)
  }
  
  resetOnboarding(): void {
    localStorage.removeItem(this.STORAGE_KEY)
    
    // Clear all component contexts
    const contextKeys = [
      'ivor_onboarding_context',
      'events_onboarding_context',
      'newsroom_onboarding_context',
      'governance_onboarding_context',
      'extension_onboarding_context'
    ]
    
    contextKeys.forEach(key => localStorage.removeItem(key))
  }
  
  getRecommendations(): string[] {
    const progress = this.getProgressSync()
    const recommendations: string[] = []
    
    // Smart recommendations based on progress and interactions
    if (progress.ecosystem_interactions.ivor_conversations === 0) {
      recommendations.push('Try asking IVOR about organizing strategies or health resources')
    }
    
    if (progress.ecosystem_interactions.events_explored < 3) {
      recommendations.push('Explore events in different UK cities to see community breadth')
    }
    
    if (progress.ecosystem_interactions.stories_read < 5) {
      recommendations.push('Read community stories to understand organizing victories')
    }
    
    if (progress.completed_steps.length >= 3 && progress.ecosystem_interactions.governance_participation === 0) {
      recommendations.push('Join governance discussions to shape the platform')
    }
    
    return recommendations
  }
}

// Export singleton instance
export const onboardingService = new OnboardingIntegrationService()
export type { OnboardingProgress }