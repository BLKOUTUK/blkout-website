#!/usr/bin/env node

// BLKOUT Social Media Automation - Activation Script
// Run this script to activate and test all social media automation systems

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Color codes for console output
const colors = {
  red: '\x1b[31m%s\x1b[0m',
  green: '\x1b[32m%s\x1b[0m', 
  yellow: '\x1b[33m%s\x1b[0m',
  blue: '\x1b[34m%s\x1b[0m',
  magenta: '\x1b[35m%s\x1b[0m',
  cyan: '\x1b[36m%s\x1b[0m',
  white: '\x1b[37m%s\x1b[0m'
}

function log(color, message) {
  console.log(colors[color], message)
}

function logSection(title) {
  console.log('\n' + '='.repeat(60))
  log('cyan', `🚀 ${title}`)
  console.log('='.repeat(60))
}

// Configuration checker
class ConfigurationChecker {
  constructor() {
    this.platforms = ['linkedin', 'instagram', 'facebook', 'youtube', 'twitter']
    this.integrations = ['composio', 'zapier', 'n8n']
  }

  checkPlatformCredentials() {
    logSection('Platform Credentials Check')
    
    const platformConfigs = {
      linkedin: [
        'LINKEDIN_CLIENT_ID',
        'LINKEDIN_CLIENT_SECRET', 
        'LINKEDIN_ACCESS_TOKEN',
        'LINKEDIN_ORGANIZATION_ID'
      ],
      instagram: [
        'INSTAGRAM_ACCESS_TOKEN',
        'INSTAGRAM_USER_ID'
      ],
      facebook: [
        'FACEBOOK_PAGE_ACCESS_TOKEN',
        'FACEBOOK_PAGE_ID'
      ],
      youtube: [
        'YOUTUBE_ACCESS_TOKEN',
        'YOUTUBE_CHANNEL_ID'
      ],
      twitter: [
        'TWITTER_BEARER_TOKEN',
        'TWITTER_API_KEY',
        'TWITTER_API_SECRET',
        'TWITTER_ACCESS_TOKEN',
        'TWITTER_ACCESS_SECRET'
      ]
    }

    const results = {}

    for (const [platform, envVars] of Object.entries(platformConfigs)) {
      const missing = envVars.filter(envVar => !process.env[envVar])
      const configured = missing.length === 0
      
      results[platform] = {
        configured,
        missing,
        progress: `${envVars.length - missing.length}/${envVars.length}`
      }

      if (configured) {
        log('green', `✅ ${platform.toUpperCase()}: Fully configured`)
      } else {
        log('yellow', `⚠️  ${platform.toUpperCase()}: ${results[platform].progress} configured`)
        missing.forEach(envVar => {
          log('red', `   Missing: ${envVar}`)
        })
      }
    }

    return results
  }

  checkIntegrationCredentials() {
    logSection('Integration Credentials Check')
    
    const integrationConfigs = {
      composio: ['COMPOSIO_API_KEY'],
      zapier: ['ZAPIER_WEBHOOK_URL'],
      n8n: ['N8N_WEBHOOK_URL']
    }

    const results = {}

    for (const [integration, envVars] of Object.entries(integrationConfigs)) {
      const missing = envVars.filter(envVar => !process.env[envVar])
      const configured = missing.length === 0
      
      results[integration] = {
        configured,
        missing
      }

      if (configured) {
        log('green', `✅ ${integration.toUpperCase()}: Ready`)
      } else {
        log('yellow', `⚠️  ${integration.toUpperCase()}: Not configured`)
        missing.forEach(envVar => {
          log('red', `   Missing: ${envVar}`)
        })
      }
    }

    return results
  }

  generateEnvironmentTemplate() {
    logSection('Environment Template Generation')
    
    const envTemplate = `# BLKOUT Social Media Automation - Environment Variables
# Copy this template to .env and fill in your actual values

# ======================
# LINKEDIN CONFIGURATION
# ======================
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token
LINKEDIN_ORGANIZATION_ID=your_linkedin_organization_id

# ======================
# INSTAGRAM CONFIGURATION  
# ======================
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token
INSTAGRAM_USER_ID=your_instagram_user_id

# ======================
# FACEBOOK CONFIGURATION
# ======================
FACEBOOK_PAGE_ACCESS_TOKEN=your_facebook_page_access_token
FACEBOOK_PAGE_ID=your_facebook_page_id

# ======================
# YOUTUBE CONFIGURATION
# ======================
YOUTUBE_ACCESS_TOKEN=your_youtube_access_token  
YOUTUBE_CHANNEL_ID=your_youtube_channel_id

# ======================
# TWITTER CONFIGURATION
# ======================
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_SECRET=your_twitter_access_secret

# ======================
# INTEGRATION METHODS
# ======================
# Choose one or more integration approaches

# Composio (Recommended)
COMPOSIO_API_KEY=your_composio_api_key

# Zapier (Alternative)
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/YOUR_HOOK_ID

# n8n (Self-hosted)
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook

# ======================
# COMMUNITY INTEGRATIONS
# ======================
BLKOUTHUB_API_URL=https://api.heartbeat.chat/v1
BLKOUTHUB_ACCESS_TOKEN=your_blkouthub_token
BLKOUTHUB_COMMUNITY_ID=your_community_id

# ======================
# DEPLOYMENT CONFIG
# ======================
VERCEL_URL=https://your-deployment-url.vercel.app
NODE_ENV=production
`

    return envTemplate
  }
}

// API Testing Suite
class APITester {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl
  }

  async testEndpoint(path, method = 'GET', body = null) {
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      }

      if (body) {
        options.body = JSON.stringify(body)
      }

      const response = await fetch(`${this.baseUrl}${path}`, options)
      const data = await response.json()

      return {
        success: response.ok,
        status: response.status,
        data: data
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  async testSocialMediaHub() {
    logSection('Social Media Hub Testing')
    
    // Test GET endpoint (configuration)
    log('blue', '📡 Testing configuration endpoint...')
    const configTest = await this.testEndpoint('/api/webhooks/social-media-automation')
    
    if (configTest.success) {
      log('green', '✅ Configuration endpoint: OK')
      log('white', `   Platforms: ${configTest.data.automation?.platforms ? Object.keys(configTest.data.automation.platforms).join(', ') : 'Unknown'}`)
      log('white', `   Content Types: ${configTest.data.automation?.contentTypes ? Object.keys(configTest.data.automation.contentTypes).join(', ') : 'Unknown'}`)
    } else {
      log('red', `❌ Configuration endpoint failed: ${configTest.error || configTest.status}`)
    }

    // Test POST endpoint with sample data
    log('blue', '📡 Testing posting endpoint with sample event...')
    const sampleEvent = {
      contentType: 'event',
      content: {
        id: 'test_event_001',
        title: '🧪 Test Community Event - Automation Check',
        description: 'This is a test event to verify our social media automation system is working correctly.',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        location: { address: 'Test Location, London' },
        organizer: 'BLKOUT Automation System',
        registration_url: 'https://blkoutuk.com/events/test',
        tags: ['test', 'automation', 'community']
      },
      platforms: ['linkedin'], // Start with just LinkedIn for testing
      automationTool: 'auto'
    }

    const postTest = await this.testEndpoint('/api/webhooks/social-media-automation', 'POST', sampleEvent)
    
    if (postTest.success) {
      log('green', '✅ Posting endpoint: OK')
      log('white', `   Automation Results: ${JSON.stringify(postTest.data.automationResults, null, 2)}`)
    } else {
      log('red', `❌ Posting endpoint failed: ${postTest.error || postTest.status}`)
    }

    return { configTest, postTest }
  }

  async testBLKOUTHUBIntegration() {
    logSection('BLKOUTHUB Integration Testing')
    
    // Test configuration
    const configTest = await this.testEndpoint('/api/webhooks/blkouthub-integration')
    
    if (configTest.success) {
      log('green', '✅ BLKOUTHUB configuration: OK')
      log('white', `   Configured: ${configTest.data.blkouthub_integration?.configured}`)
    } else {
      log('red', `❌ BLKOUTHUB configuration failed: ${configTest.error || configTest.status}`)
    }

    return { configTest }
  }

  async testNewsletterDigest() {
    logSection('Newsletter Digest Testing')
    
    // Test configuration
    const configTest = await this.testEndpoint('/api/webhooks/newsletter-digest')
    
    if (configTest.success) {
      log('green', '✅ Newsletter digest configuration: OK')
      log('white', `   Maven Networks: ${JSON.stringify(configTest.data.maven_network, null, 2)}`)
    } else {
      log('red', `❌ Newsletter digest configuration failed: ${configTest.error || configTest.status}`)
    }

    // Test digest generation
    log('blue', '📡 Testing digest generation...')
    const digestTest = await this.testEndpoint('/api/webhooks/newsletter-digest', 'POST', {
      action: 'generate',
      frequency: 'weekly',
      sources: ['events', 'newsroom'],
      distribute: false // Don't actually send during test
    })
    
    if (digestTest.success) {
      log('green', '✅ Digest generation: OK')
      log('white', `   Content Summary: ${JSON.stringify(digestTest.data.digest?.contentSummary, null, 2)}`)
    } else {
      log('red', `❌ Digest generation failed: ${digestTest.error || digestTest.status}`)
    }

    return { configTest, digestTest }
  }

  async runFullTestSuite() {
    logSection('Full API Test Suite')
    
    const results = {
      socialMediaHub: await this.testSocialMediaHub(),
      blkouthubIntegration: await this.testBLKOUTHUBIntegration(), 
      newsletterDigest: await this.testNewsletterDigest()
    }

    // Test summary
    logSection('Test Results Summary')
    
    const allTests = [
      results.socialMediaHub.configTest,
      results.socialMediaHub.postTest,
      results.blkouthubIntegration.configTest,
      results.newsletterDigest.configTest,
      results.newsletterDigest.digestTest
    ]

    const passedTests = allTests.filter(test => test.success).length
    const totalTests = allTests.length

    if (passedTests === totalTests) {
      log('green', `🎉 All tests passed! (${passedTests}/${totalTests})`)
      log('green', '✅ Social media automation system is ready for activation!')
    } else {
      log('yellow', `⚠️  ${passedTests}/${totalTests} tests passed`)
      log('yellow', '🔧 Some configurations need attention before full activation')
    }

    return results
  }
}

// Main activation script
class ActivationScript {
  constructor() {
    this.checker = new ConfigurationChecker()
    this.tester = new APITester()
  }

  async run() {
    console.clear()
    log('magenta', '🚀 BLKOUT Social Media Automation - Activation Script')
    log('white', 'This script will check your configuration and test all automation systems\n')

    // Step 1: Check configurations
    const platformCheck = this.checker.checkPlatformCredentials()
    const integrationCheck = this.checker.checkIntegrationCredentials()

    // Step 2: Generate environment template if needed
    const fullyConfiguredPlatforms = Object.values(platformCheck).filter(p => p.configured).length
    const configuredIntegrations = Object.values(integrationCheck).filter(i => i.configured).length

    if (fullyConfiguredPlatforms === 0 || configuredIntegrations === 0) {
      logSection('Environment Template')
      log('yellow', '📝 Generating .env template file...')
      
      const template = this.checker.generateEnvironmentTemplate()
      const templatePath = path.join(__dirname, '..', '.env.template')
      
      try {
        await fs.writeFile(templatePath, template)
        log('green', `✅ Template saved to: ${templatePath}`)
        log('white', '   Copy this to .env and fill in your credentials')
      } catch (error) {
        log('red', `❌ Failed to save template: ${error.message}`)
      }
    }

    // Step 3: Run API tests if we have some configuration
    if (fullyConfiguredPlatforms > 0 || configuredIntegrations > 0) {
      const testResults = await this.tester.runFullTestSuite()
    }

    // Step 4: Provide next steps
    this.provideNextSteps(platformCheck, integrationCheck)
  }

  provideNextSteps(platformCheck, integrationCheck) {
    logSection('Next Steps & Recommendations')

    const fullyConfigured = Object.values(platformCheck).filter(p => p.configured)
    const partiallyConfigured = Object.values(platformCheck).filter(p => !p.configured && p.missing.length < Object.keys(p).length)
    
    if (fullyConfigured.length === 0) {
      log('yellow', '🔧 IMMEDIATE ACTIONS NEEDED:')
      log('white', '   1. Set up developer accounts for social media platforms')
      log('white', '   2. Generate API keys and access tokens')
      log('white', '   3. Copy .env.template to .env and fill in credentials')
      log('white', '   4. Run this script again to test configuration')
    } else if (fullyConfigured.length < 5) {
      log('green', '🎯 PARTIAL SUCCESS - Continue Setup:')
      log('white', `   ✅ ${fullyConfigured.length} platforms ready`)
      log('white', `   🔧 ${5 - fullyConfigured.length} platforms need configuration`)
      log('white', '   Run individual platform tests as you configure each one')
    } else {
      log('green', '🎉 FULL SUCCESS - Ready for Production!')
      log('white', '   ✅ All platforms configured')
      log('white', '   ✅ Automation system ready')
      log('white', '   🚀 You can now activate social media automation')
    }

    // Integration recommendations
    const configuredIntegrations = Object.entries(integrationCheck).filter(([_, config]) => config.configured).map(([name]) => name)
    
    if (configuredIntegrations.length === 0) {
      log('yellow', '\n🔗 INTEGRATION SETUP:')
      log('white', '   Choose one integration method:')
      log('white', '   • Composio (recommended): Direct API control, cost-effective')
      log('white', '   • Zapier: Visual workflows, easy setup')
      log('white', '   • n8n: Open source, self-hosted')
    } else {
      log('green', `\n✅ Integration Ready: ${configuredIntegrations.join(', ').toUpperCase()}`)
    }

    // Deployment URLs
    log('cyan', '\n📡 API Endpoints:')
    log('white', '   Social Media Hub: POST /api/webhooks/social-media-automation')
    log('white', '   BLKOUTHUB Integration: POST /api/webhooks/blkouthub-integration') 
    log('white', '   Newsletter Digest: POST /api/webhooks/newsletter-digest')

    // Documentation
    log('cyan', '\n📚 Documentation:')
    log('white', '   Activation Plan: ./SOCIAL_MEDIA_AUTOMATION_ACTIVATION_PLAN.md')
    log('white', '   Platform Handlers: ./api/webhooks/platform-specific-handlers.js')
    log('white', '   Integration Configs: ./api/webhooks/composio-zapier-configs.js')

    log('magenta', '\n🚀 Ready to transform individual posts into collective liberation!')
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  const activation = new ActivationScript()

  switch (command) {
    case 'check':
      log('blue', '🔍 Running configuration check only...')
      activation.checker.checkPlatformCredentials()
      activation.checker.checkIntegrationCredentials()
      break

    case 'test':
      log('blue', '🧪 Running API tests only...')
      await activation.tester.runFullTestSuite()
      break

    case 'template':
      log('blue', '📝 Generating environment template only...')
      const template = activation.checker.generateEnvironmentTemplate()
      console.log(template)
      break

    default:
      await activation.run()
  }
}

// Error handling
process.on('unhandledRejection', (error) => {
  log('red', `❌ Unhandled error: ${error.message}`)
  process.exit(1)
})

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    log('red', `❌ Script failed: ${error.message}`)
    process.exit(1)
  })
}

export { ActivationScript, ConfigurationChecker, APITester }