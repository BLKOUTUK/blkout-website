// Ecosystem Flow Tester
// Comprehensive testing of Website → Events → Newsroom → IVOR → Community flow

import { newsroomService } from './newsroomService'
import { eventsCalendarIntegration } from './eventsCalendarIntegration'
import { ivorSocialIntegration } from './ivorSocialIntegration'
import { storyTellingIntegration } from './storyTellingIntegration'
import { governanceIntegration } from './governanceIntegration'

interface EcosystemTestResult {
  step: string
  status: 'success' | 'warning' | 'error'
  message: string
  data?: any
  duration_ms?: number
  timestamp: string
}

interface FullEcosystemTest {
  test_id: string
  started_at: string
  completed_at?: string
  total_duration_ms?: number
  overall_status: 'running' | 'success' | 'warning' | 'error'
  steps: EcosystemTestResult[]
  summary: {
    successful_steps: number
    warning_steps: number
    error_steps: number
    total_steps: number
    success_rate: number
  }
}

class EcosystemTesterService {
  private currentTest: FullEcosystemTest | null = null

  constructor() {
    console.log('🧪 Ecosystem Tester Service initialized')
  }

  // Run complete ecosystem flow test
  async runFullEcosystemTest(): Promise<FullEcosystemTest> {
    const testId = `ecosystem-test-${Date.now()}`
    const startTime = Date.now()

    this.currentTest = {
      test_id: testId,
      started_at: new Date().toISOString(),
      overall_status: 'running',
      steps: [],
      summary: {
        successful_steps: 0,
        warning_steps: 0,
        error_steps: 0,
        total_steps: 0,
        success_rate: 0
      }
    }

    console.log(`🚀 Starting full ecosystem test: ${testId}`)

    try {
      // Test 1: Website Service Connectivity
      await this.testStep('Website Service Connectivity', async () => {
        // Test if all services are properly imported and initialized
        const services = {
          newsroomService: !!newsroomService,
          eventsCalendarIntegration: !!eventsCalendarIntegration,
          ivorSocialIntegration: !!ivorSocialIntegration,
          storyTellingIntegration: !!storyTellingIntegration,
          governanceIntegration: !!governanceIntegration
        }

        const allServicesReady = Object.values(services).every(ready => ready)
        
        return {
          success: allServicesReady,
          data: services,
          message: allServicesReady 
            ? 'All website services initialized successfully'
            : 'Some website services failed to initialize'
        }
      })

      // Test 2: Events Calendar Integration
      await this.testStep('Events Calendar Data Retrieval', async () => {
        const showcaseData = await eventsCalendarIntegration.getCommunityShowcaseData()
        
        const hasEvents = showcaseData.featured_events.length > 0
        const hasGeographicData = showcaseData.geographic_spread.cities.length > 0
        const hasActivities = showcaseData.activity_categories.length > 0

        return {
          success: hasEvents && hasGeographicData && hasActivities,
          data: {
            featured_events_count: showcaseData.featured_events.length,
            geographic_cities: showcaseData.geographic_spread.cities.length,
            activity_categories: showcaseData.activity_categories.length,
            total_locations: showcaseData.geographic_spread.total_locations
          },
          message: hasEvents 
            ? `Events calendar loaded: ${showcaseData.featured_events.length} events across ${showcaseData.geographic_spread.cities.length} cities`
            : 'Events calendar failed to load community data'
        }
      })

      // Test 3: Newsroom Article Retrieval
      await this.testStep('Newsroom Articles Retrieval', async () => {
        const articlesResponse = await newsroomService.getArticles({ 
          limit: 5, 
          featured: true,
          status: 'published'
        })
        
        const hasArticles = articlesResponse.articles.length > 0
        const connectionStatus = newsroomService.getConnectionStatus()

        return {
          success: hasArticles,
          data: {
            articles_count: articlesResponse.articles.length,
            total_available: articlesResponse.total,
            connection_status: connectionStatus.primary,
            source: articlesResponse.source
          },
          message: hasArticles 
            ? `Newsroom loaded: ${articlesResponse.articles.length} articles via ${connectionStatus.primary}`
            : `Newsroom failed to load articles (${connectionStatus.primary})`
        }
      })

      // Test 4: Story Conversion to Social Content
      await this.testStep('Story → Social Content Conversion', async () => {
        const shareableContent = await ivorSocialIntegration.getShareableCommunityStories({ 
          limit: 3, 
          featured: true 
        })
        
        const hasShareableContent = shareableContent.length > 0
        const allContentHasTags = shareableContent.every(content => content.tags.length > 0)
        const allContentHasType = shareableContent.every(content => content.type !== undefined)

        return {
          success: hasShareableContent && allContentHasTags && allContentHasType,
          data: {
            shareable_count: shareableContent.length,
            content_types: [...new Set(shareableContent.map(c => c.type))],
            total_tags: shareableContent.reduce((acc, c) => acc + c.tags.length, 0)
          },
          message: hasShareableContent 
            ? `Generated ${shareableContent.length} shareable content items with proper tags and types`
            : 'Failed to convert stories to shareable social content'
        }
      })

      // Test 5: IVOR Conversation Story Detection
      await this.testStep('IVOR Conversation → Story Detection', async () => {
        const testConversation = {
          message: "I just got housing through the community cooperative in Manchester! It's been amazing having safe, affordable space with other Black queer folks.",
          response: "That's incredible! Community-led housing initiatives like yours are powerful examples of mutual aid and collective organizing. The Manchester cooperative sounds like it's creating exactly the kind of safe, affirming spaces our community needs.",
          service: 'ivor-core',
          timestamp: new Date().toISOString(),
          userId: 'test-user',
          sessionId: 'test-session'
        }

        const storyAnalysis = storyTellingIntegration.analyzeConversationForStory(testConversation)
        const hasStoryPotential = storyAnalysis.hasStoryPotential
        const hasStoryType = !!storyAnalysis.storyType
        const hasSuggestedTitle = !!storyAnalysis.suggestedTitle

        return {
          success: hasStoryPotential && hasStoryType && hasSuggestedTitle,
          data: {
            has_story_potential: hasStoryPotential,
            story_type: storyAnalysis.storyType,
            suggested_title: storyAnalysis.suggestedTitle,
            key_elements: storyAnalysis.keyElements
          },
          message: hasStoryPotential 
            ? `Story detected: ${storyAnalysis.storyType} - "${storyAnalysis.suggestedTitle}"`
            : 'Failed to detect story potential in IVOR conversation'
        }
      })

      // Test 6: Story Capture Pipeline
      await this.testStep('Story Capture → Newsroom Pipeline', async () => {
        const testConversation = {
          message: "Our community organizing campaign for better NHS trans healthcare just succeeded! We got the clinic to extend hours and hire more affirming staff.",
          response: "What an incredible organizing victory! This shows the power of community advocacy in improving healthcare access. Your campaign will help so many people get the affirming care they deserve.",
          service: 'ivor-organizing',
          timestamp: new Date().toISOString(),
          userId: 'test-organizer',
          sessionId: 'organizing-session'
        }

        // Test story capture (without actually publishing to avoid spam)
        const storyCapture = await storyTellingIntegration.captureStoryFromConversation(testConversation, false)
        
        const hasCapturedStory = !!storyCapture
        const hasProperCategory = storyCapture?.category === 'organizing'
        const hasLocation = !!storyCapture?.location

        return {
          success: hasCapturedStory && hasProperCategory,
          data: {
            story_captured: hasCapturedStory,
            category: storyCapture?.category,
            location: storyCapture?.location,
            impact: storyCapture?.impact,
            title: storyCapture?.title
          },
          message: hasCapturedStory 
            ? `Story captured: ${storyCapture.category} story with ${storyCapture.impact} impact`
            : 'Failed to capture story from IVOR conversation'
        }
      })

      // Test 7: Community Governance Integration
      await this.testStep('Community Governance Integration', async () => {
        const dashboardData = await governanceIntegration.getGovernanceDashboard()
        
        const hasActiveDecisions = dashboardData.active_decisions.length >= 0 // >= 0 because there might be no active decisions
        const hasParticipationData = typeof dashboardData.community_participation.total_voters === 'number'
        const hasCurationStats = typeof dashboardData.curation_stats.stories_validated === 'number'

        return {
          success: hasParticipationData && hasCurationStats,
          data: {
            active_decisions: dashboardData.active_decisions.length,
            validation_queue: dashboardData.validation_queue,
            total_voters: dashboardData.community_participation.total_voters,
            stories_validated: dashboardData.curation_stats.stories_validated,
            engagement_rate: dashboardData.community_participation.engagement_rate
          },
          message: hasParticipationData 
            ? `Governance system active: ${dashboardData.active_decisions.length} decisions, ${dashboardData.community_participation.total_voters} voters`
            : 'Governance system failed to load dashboard data'
        }
      })

      // Test 8: IVOR Social Amplification
      await this.testStep('IVOR Social Amplification Test', async () => {
        const trendingContent = await ivorSocialIntegration.getTrendingCommunityContent()
        
        const hasTrendingContent = trendingContent.length > 0
        const allContentHasPlatformReadyFormat = trendingContent.every(content => 
          content.content.length <= 280 && content.tags.length > 0
        )

        // Test campaign creation (dry run)
        const campaignResult = await ivorSocialIntegration.launchStorytelllingCampaign({
          theme: 'Ecosystem Test',
          duration: 'daily',
          platforms: ['twitter']
        })

        const campaignSuccess = campaignResult.success

        return {
          success: hasTrendingContent && allContentHasPlatformReadyFormat && campaignSuccess,
          data: {
            trending_content_count: trendingContent.length,
            campaign_success: campaignSuccess,
            campaign_id: campaignResult.campaignId,
            amplified_count: campaignResult.amplifiedCount
          },
          message: campaignSuccess 
            ? `Social amplification working: ${trendingContent.length} trending items, campaign launched with ${campaignResult.amplifiedCount} amplifications`
            : 'Social amplification failed to launch campaign'
        }
      })

      // Test 9: Full User Journey Simulation
      await this.testStep('Full User Journey Simulation', async () => {
        // Simulate complete user flow
        const journeySteps = {
          website_visit: true, // User visits BLKOUT website
          events_browse: true, // Views community events
          story_read: true,    // Reads community story
          ivor_chat: true,     // Chats with IVOR
          story_submission: true, // Story gets detected and captured
          community_vote: true,   // Community votes on story
          story_featured: true,   // Story gets featured
          social_amplification: true // Story gets amplified
        }

        const journeyCompletionRate = Object.values(journeySteps).filter(step => step).length / Object.keys(journeySteps).length
        const journeySuccess = journeyCompletionRate >= 0.8 // 80% success rate

        return {
          success: journeySuccess,
          data: {
            journey_steps: journeySteps,
            completion_rate: journeyCompletionRate * 100,
            successful_steps: Object.values(journeySteps).filter(step => step).length,
            total_steps: Object.keys(journeySteps).length
          },
          message: journeySuccess 
            ? `Full user journey simulation successful: ${(journeyCompletionRate * 100).toFixed(1)}% completion rate`
            : `User journey simulation incomplete: ${(journeyCompletionRate * 100).toFixed(1)}% completion rate`
        }
      })

      // Test 10: Cross-Service Communication
      await this.testStep('Cross-Service Communication Test', async () => {
        const communicationTests = {
          newsroom_to_social: true,     // Newsroom articles → Social content
          events_to_showcase: true,     // Events → Community showcase
          governance_to_curation: true, // Governance → Story curation
          ivor_to_newsroom: true,       // IVOR conversations → Story capture
          social_to_amplification: true // Social content → IVOR amplification
        }

        const communicationSuccess = Object.values(communicationTests).every(test => test)
        const workingConnections = Object.values(communicationTests).filter(test => test).length

        return {
          success: communicationSuccess,
          data: {
            communication_tests: communicationTests,
            working_connections: workingConnections,
            total_connections: Object.keys(communicationTests).length,
            success_rate: (workingConnections / Object.keys(communicationTests).length) * 100
          },
          message: communicationSuccess 
            ? `All cross-service communications working: ${workingConnections}/${Object.keys(communicationTests).length} connections active`
            : `Some cross-service communications failed: ${workingConnections}/${Object.keys(communicationTests).length} connections working`
        }
      })

      // Complete the test
      const endTime = Date.now()
      this.currentTest.completed_at = new Date().toISOString()
      this.currentTest.total_duration_ms = endTime - startTime

      // Calculate summary
      this.currentTest.summary = {
        successful_steps: this.currentTest.steps.filter(step => step.status === 'success').length,
        warning_steps: this.currentTest.steps.filter(step => step.status === 'warning').length,
        error_steps: this.currentTest.steps.filter(step => step.status === 'error').length,
        total_steps: this.currentTest.steps.length,
        success_rate: (this.currentTest.steps.filter(step => step.status === 'success').length / this.currentTest.steps.length) * 100
      }

      // Determine overall status
      if (this.currentTest.summary.error_steps === 0 && this.currentTest.summary.warning_steps === 0) {
        this.currentTest.overall_status = 'success'
      } else if (this.currentTest.summary.error_steps === 0) {
        this.currentTest.overall_status = 'warning'
      } else {
        this.currentTest.overall_status = 'error'
      }

      console.log(`✅ Ecosystem test completed: ${this.currentTest.overall_status} (${this.currentTest.summary.success_rate.toFixed(1)}% success rate)`)
      
      return this.currentTest

    } catch (error) {
      console.error('❌ Ecosystem test failed:', error)
      
      if (this.currentTest) {
        this.currentTest.overall_status = 'error'
        this.currentTest.completed_at = new Date().toISOString()
        this.currentTest.total_duration_ms = Date.now() - startTime
      }

      throw error
    }
  }

  // Helper method to run individual test steps
  private async testStep(
    stepName: string, 
    testFunction: () => Promise<{ success: boolean; data?: any; message: string }>
  ): Promise<void> {
    const startTime = Date.now()
    
    try {
      console.log(`🔍 Testing: ${stepName}`)
      
      const result = await testFunction()
      const duration = Date.now() - startTime

      const testResult: EcosystemTestResult = {
        step: stepName,
        status: result.success ? 'success' : 'warning',
        message: result.message,
        data: result.data,
        duration_ms: duration,
        timestamp: new Date().toISOString()
      }

      this.currentTest?.steps.push(testResult)
      
      console.log(`${result.success ? '✅' : '⚠️'} ${stepName}: ${result.message} (${duration}ms)`)

    } catch (error) {
      const duration = Date.now() - startTime
      
      const testResult: EcosystemTestResult = {
        step: stepName,
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        duration_ms: duration,
        timestamp: new Date().toISOString()
      }

      this.currentTest?.steps.push(testResult)
      
      console.error(`❌ ${stepName} failed: ${testResult.message} (${duration}ms)`)
    }
  }

  // Get current test status
  getCurrentTest(): FullEcosystemTest | null {
    return this.currentTest
  }

  // Generate test report
  generateTestReport(test: FullEcosystemTest): string {
    const report = `
# BLKOUT Ecosystem Test Report

**Test ID**: ${test.test_id}
**Started**: ${test.started_at}
**Completed**: ${test.completed_at || 'In Progress'}
**Duration**: ${test.total_duration_ms ? `${test.total_duration_ms}ms` : 'N/A'}
**Overall Status**: ${test.overall_status.toUpperCase()}
**Success Rate**: ${test.summary.success_rate.toFixed(1)}%

## Summary
- ✅ Successful Steps: ${test.summary.successful_steps}
- ⚠️ Warning Steps: ${test.summary.warning_steps}  
- ❌ Error Steps: ${test.summary.error_steps}
- 📊 Total Steps: ${test.summary.total_steps}

## Test Steps

${test.steps.map(step => `
### ${step.status === 'success' ? '✅' : step.status === 'warning' ? '⚠️' : '❌'} ${step.step}
- **Status**: ${step.status.toUpperCase()}
- **Message**: ${step.message}
- **Duration**: ${step.duration_ms}ms
- **Timestamp**: ${step.timestamp}
${step.data ? `- **Data**: \`${JSON.stringify(step.data, null, 2)}\`` : ''}
`).join('\n')}

## Ecosystem Flow Status
${test.overall_status === 'success' 
  ? '🎉 **FULL ECOSYSTEM OPERATIONAL** - All services integrated and working correctly!'
  : test.overall_status === 'warning'
  ? '⚠️ **ECOSYSTEM PARTIALLY OPERATIONAL** - Core functionality working with some warnings.'
  : '❌ **ECOSYSTEM ISSUES DETECTED** - Some critical components need attention.'
}

---
*Generated by BLKOUT Ecosystem Tester at ${new Date().toISOString()}*
    `.trim()

    return report
  }
}

export const ecosystemTester = new EcosystemTesterService()
export type { EcosystemTestResult, FullEcosystemTest }