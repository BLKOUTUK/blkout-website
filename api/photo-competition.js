// BLKOUT Photo Competition Pilot - Action Research System
// Assesses community engagement baseline for 2026 Photography Award & Pride Tour planning

const COMPETITION_CONFIG = {
  name: "BLKOUT Lens: Community Perspectives 2025",
  period: "pilot", // pilot, full_award, pride_tour
  startDate: new Date('2025-02-01'),
  endDate: new Date('2025-05-01'),
  categories: [
    'community_joy',
    'resistance_resilience', 
    'everyday_liberation',
    'cultural_celebration',
    'intergenerational_wisdom'
  ]
}

const SUBMISSION_SCHEMA = {
  photographer: {
    name: String,
    pronouns: String,
    age_range: String, // 16-24, 25-34, 35-44, 45-54, 55+
    location: String, // City/Region
    instagram_handle: String,
    email: String,
    experience_level: String // beginner, intermediate, advanced, professional
  },
  submission: {
    title: String,
    category: String,
    description: String, // max 500 chars
    image_url: String,
    technical_details: String, // camera/phone, settings if relevant
    story: String, // max 1000 chars - what makes this photo meaningful
    consent: {
      media_usage: Boolean,
      social_sharing: Boolean,
      archive_inclusion: Boolean
    }
  },
  engagement_data: {
    referral_source: String, // instagram, linkedin, community, friend
    found_competition_how: String,
    previous_blkout_engagement: String,
    interested_in_future: String,
    feedback_on_competition: String
  }
}

const BASELINE_METRICS = {
  participation: {
    total_submissions: 0,
    unique_photographers: 0,
    geographic_spread: {},
    age_demographic: {},
    experience_levels: {},
    referral_sources: {}
  },
  engagement: {
    social_media_mentions: 0,
    community_discussions: 0,
    partnership_inquiries: 0,
    media_interest: 0,
    volunteer_applications: 0
  },
  quality: {
    technical_excellence: {},
    storytelling_depth: {},
    community_resonance: {},
    liberation_themes: {}
  }
}

async function saveSubmission(submissionData) {
  try {
    // Store submission data
    const submission = {
      id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...submissionData,
      submitted_at: new Date().toISOString(),
      status: 'submitted',
      moderation_required: false
    }

    // Add to database (using /tmp for now, would use proper DB in production)
    const submissions = await loadSubmissions()
    submissions.push(submission)
    await saveSubmissions(submissions)

    return { success: true, submission_id: submission.id }
  } catch (error) {
    console.error('Submission save error:', error)
    return { success: false, error: error.message }
  }
}

async function loadSubmissions() {
  try {
    const fs = require('fs').promises
    const data = await fs.readFile('/tmp/photo_submissions.json', 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

async function saveSubmissions(submissions) {
  try {
    const fs = require('fs').promises
    await fs.writeFile('/tmp/photo_submissions.json', JSON.stringify(submissions, null, 2))
  } catch (error) {
    console.error('Error saving submissions:', error)
  }
}

// Generate baseline engagement analytics
async function generateBaselineReport(timeframe = 'current') {
  const submissions = await loadSubmissions()
  
  const analytics = {
    participation: {
      total_submissions: submissions.length,
      unique_photographers: [...new Set(submissions.map(s => s.photographer.email))].length,
      geographic_spread: {},
      age_demographic: {},
      experience_levels: {},
      referral_sources: {}
    },
    engagement: {
      categories_popularity: {},
      storytelling_themes: {},
      technical_approaches: {},
      community_resonance_scores: {}
    },
    insights: {
      top_performing_categories: [],
      geographic_hotspots: [],
      demographic_engagement: [],
      partnership_opportunities: [],
      scaling_recommendations: []
    }
  }

  // Calculate participation metrics
  submissions.forEach(submission => {
    const { photographer, engagement_data } = submission
    
    // Geographic distribution
    const location = photographer.location || 'Unknown'
    analytics.participation.geographic_spread[location] = 
      (analytics.participation.geographic_spread[location] || 0) + 1
    
    // Age demographics
    const ageRange = photographer.age_range || 'Not specified'
    analytics.participation.age_demographic[ageRange] = 
      (analytics.participation.age_demographic[ageRange] || 0) + 1
    
    // Experience levels
    const experience = photographer.experience_level || 'Not specified'
    analytics.participation.experience_levels[experience] = 
      (analytics.participation.experience_levels[experience] || 0) + 1
    
    // Referral sources
    const source = engagement_data.referral_source || 'Unknown'
    analytics.participation.referral_sources[source] = 
      (analytics.participation.referral_sources[source] || 0) + 1

    // Category popularity
    const category = submission.submission.category
    analytics.engagement.categories_popularity[category] = 
      (analytics.engagement.categories_popularity[category] || 0) + 1
  })

  // Generate insights
  analytics.insights = generateActionResearchInsights(analytics, submissions)

  return analytics
}

function generateActionResearchInsights(analytics, submissions) {
  const insights = {
    participation_insights: [],
    engagement_patterns: [],
    geographic_opportunities: [],
    demographic_gaps: [],
    content_themes: [],
    partnership_potential: [],
    scaling_recommendations: []
  }

  // Participation insights
  const totalSubmissions = analytics.participation.total_submissions
  if (totalSubmissions > 50) {
    insights.participation_insights.push("Strong initial response - foundation for larger award")
  } else if (totalSubmissions > 20) {
    insights.participation_insights.push("Moderate engagement - focus on specific communities")
  } else {
    insights.participation_insights.push("Intimate pilot - prioritize depth over breadth")
  }

  // Geographic analysis
  const geoSpread = Object.keys(analytics.participation.geographic_spread).length
  if (geoSpread >= 5) {
    insights.geographic_opportunities.push("Multi-city engagement ready for Pride tour")
  } else {
    insights.geographic_opportunities.push("Focus on local community building first")
  }

  // Partnership potential based on submissions
  submissions.forEach(submission => {
    if (submission.engagement_data.interested_in_future?.includes('organize')) {
      insights.partnership_potential.push({
        type: 'community_organizer',
        contact: submission.photographer.email,
        location: submission.photographer.location,
        note: 'Expressed interest in organizing future events'
      })
    }
    
    if (submission.photographer.experience_level === 'professional') {
      insights.partnership_potential.push({
        type: 'professional_photographer',
        contact: submission.photographer.email,
        location: submission.photographer.location,
        note: 'Professional photographer - potential workshop leader'
      })
    }
  })

  // Scaling recommendations
  if (analytics.participation.referral_sources.instagram > analytics.participation.referral_sources.community) {
    insights.scaling_recommendations.push("Instagram highly effective - increase social media focus")
  }
  
  if (analytics.participation.age_demographic['25-34'] > analytics.participation.age_demographic['35-44']) {
    insights.scaling_recommendations.push("Strong millennial engagement - tailor messaging for this demographic")
  }

  return insights
}

// Integration with existing automation systems
async function triggerCompetitionWorkflows(submissionData, baselineData) {
  const workflows = []

  try {
    // Social media automation for submission announcements
    const socialResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/webhooks/social-media-automation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentType: 'announcement',
        content: {
          title: `New BLKOUT Lens Submission: ${submissionData.submission.title}`,
          description: `${submissionData.submission.description} - Category: ${submissionData.submission.category}`,
          url: `https://blkoutuk.com/photo-competition/${submissionData.id}`,
          photographer: submissionData.photographer.name,
          location: submissionData.photographer.location
        },
        platforms: ['instagram', 'twitter'], // Focus on visual platforms
        automationTool: 'auto'
      })
    })
    workflows.push({ social_media: socialResponse.ok })

    // BLKOUTHUB community sharing
    const blkouthubResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/webhooks/blkouthub-integration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'post',
        contentType: 'announcement',
        content: {
          title: `🎯 BLKOUT Lens Competition Update`,
          description: `New submission from ${submissionData.photographer.location}: "${submissionData.submission.title}" in ${submissionData.submission.category} category. ${submissionData.submission.story}`,
          id: submissionData.id
        }
      })
    })
    workflows.push({ blkouthub: blkouthubResponse.ok })

    // Newsletter digest inclusion for weekly roundups
    if (baselineData.weekly_summary) {
      const newsletterResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/webhooks/newsletter-digest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          frequency: 'weekly',
          sources: ['community', 'partnerships'],
          special_content: {
            type: 'photo_competition_update',
            submissions_count: baselineData.total_submissions,
            featured_submission: submissionData
          }
        })
      })
      workflows.push({ newsletter: newsletterResponse.ok })
    }

  } catch (error) {
    console.error('Workflow trigger error:', error)
    workflows.push({ error: error.message })
  }

  return workflows
}

// Partnership opportunity identification from submissions
function identifyPartnershipOpportunities(submissions) {
  const opportunities = {
    photographers_as_partners: [],
    location_based_partnerships: [],
    community_organizations: [],
    venues_and_spaces: [],
    potential_sponsors: []
  }

  submissions.forEach(submission => {
    const { photographer, submission: photo, engagement_data } = submission

    // Professional photographers as potential partners
    if (photographer.experience_level === 'professional') {
      opportunities.photographers_as_partners.push({
        name: photographer.name,
        location: photographer.location,
        specialization: photo.category,
        contact: photographer.email,
        partnership_potential: 'workshop_leader_or_judge'
      })
    }

    // Community organizers
    if (engagement_data.interested_in_future?.includes('organize') || 
        engagement_data.feedback_on_competition?.includes('community')) {
      opportunities.community_organizations.push({
        contact: photographer.email,
        location: photographer.location,
        interest: 'community_organizing',
        potential_role: 'local_chapter_coordinator'
      })
    }

    // Venues mentioned in stories
    const story = photo.story?.toLowerCase() || ''
    if (story.includes('space') || story.includes('venue') || story.includes('gallery')) {
      opportunities.venues_and_spaces.push({
        photographer: photographer.name,
        location: photographer.location,
        potential_venue_connection: photo.story.substring(0, 200)
      })
    }
  })

  return opportunities
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    if (req.method === 'POST') {
      const { action, submissionData, reportType } = req.body

      switch (action) {
        case 'submit':
          if (!submissionData) {
            return res.status(400).json({
              success: false,
              error: 'submissionData is required'
            })
          }

          const saveResult = await saveSubmission(submissionData)
          
          if (saveResult.success) {
            // Generate updated baseline metrics
            const baselineData = await generateBaselineReport()
            
            // Trigger automation workflows
            const workflows = await triggerCompetitionWorkflows(submissionData, baselineData)
            
            return res.status(200).json({
              success: true,
              submission_id: saveResult.submission_id,
              baseline_update: {
                total_submissions: baselineData.participation.total_submissions,
                geographic_spread: baselineData.participation.geographic_spread,
                category_popularity: baselineData.engagement.categories_popularity
              },
              workflows_triggered: workflows,
              next_steps: {
                photographer: "Thank you for your submission! Follow @blkoutuk for updates",
                admin: "Review submission for potential partnership opportunities"
              }
            })
          } else {
            return res.status(422).json({
              success: false,
              error: saveResult.error
            })
          }

        case 'generate_report':
          const reportData = await generateBaselineReport(reportType)
          const partnerships = identifyPartnershipOpportunities(await loadSubmissions())
          
          return res.status(200).json({
            success: true,
            report_type: reportType || 'current',
            baseline_metrics: reportData,
            partnership_opportunities: partnerships,
            action_research_insights: {
              readiness_for_2026: reportData.insights.scaling_recommendations,
              community_engagement_level: reportData.participation.total_submissions > 30 ? 'high' : 'developing',
              geographic_reach: Object.keys(reportData.participation.geographic_spread).length,
              demographic_diversity: Object.keys(reportData.participation.age_demographic).length
            },
            next_phase_recommendations: generateNextPhaseRecommendations(reportData, partnerships)
          })

        default:
          return res.status(400).json({
            success: false,
            error: 'Invalid action. Use: submit, generate_report'
          })
      }
    }

    if (req.method === 'GET') {
      const submissions = await loadSubmissions()
      const currentMetrics = await generateBaselineReport()
      
      return res.status(200).json({
        success: true,
        competition: {
          name: COMPETITION_CONFIG.name,
          period: COMPETITION_CONFIG.period,
          status: 'active',
          categories: COMPETITION_CONFIG.categories,
          timeline: {
            start: COMPETITION_CONFIG.startDate,
            end: COMPETITION_CONFIG.endDate,
            days_remaining: Math.ceil((COMPETITION_CONFIG.endDate - new Date()) / (1000 * 60 * 60 * 24))
          }
        },
        current_metrics: currentMetrics,
        submission_form: {
          endpoint: '/api/photo-competition',
          method: 'POST',
          required_fields: Object.keys(SUBMISSION_SCHEMA),
          categories: COMPETITION_CONFIG.categories
        },
        action_research: {
          purpose: "Assess community engagement baseline for 2026 Photography Award & Pride Tour",
          metrics_tracking: Object.keys(BASELINE_METRICS),
          partnership_identification: "Automatic detection of photographers, organizers, venues, sponsors"
        }
      })
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })

  } catch (error) {
    console.error('Photo competition error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    })
  }
}

function generateNextPhaseRecommendations(reportData, partnerships) {
  const recommendations = {
    immediate_actions: [],
    partnership_development: [],
    scaling_strategy: [],
    pride_2026_readiness: []
  }

  // Immediate actions based on current data
  if (reportData.participation.total_submissions < 20) {
    recommendations.immediate_actions.push("Focus on community outreach - current engagement suggests intimate pilot approach")
    recommendations.immediate_actions.push("Leverage social media automation more heavily")
  } else if (reportData.participation.total_submissions > 50) {
    recommendations.immediate_actions.push("Scale up infrastructure for larger Photography Award")
    recommendations.immediate_actions.push("Begin venue partnerships for exhibition planning")
  }

  // Partnership development
  if (partnerships.photographers_as_partners.length > 0) {
    recommendations.partnership_development.push(`Connect with ${partnerships.photographers_as_partners.length} professional photographers for advisory roles`)
  }
  
  if (partnerships.community_organizations.length > 0) {
    recommendations.partnership_development.push(`Engage ${partnerships.community_organizations.length} community organizers for local chapter development`)
  }

  // Scaling strategy
  const topLocation = Object.entries(reportData.participation.geographic_spread)
    .sort(([,a], [,b]) => b - a)[0]?.[0]
  
  if (topLocation) {
    recommendations.scaling_strategy.push(`${topLocation} shows highest engagement - prioritize for Pride tour planning`)
  }

  // 2026 readiness assessment
  const totalEngagement = reportData.participation.total_submissions
  if (totalEngagement > 30 && Object.keys(reportData.participation.geographic_spread).length >= 3) {
    recommendations.pride_2026_readiness.push("Strong foundation for multi-city Photography Award")
    recommendations.pride_2026_readiness.push("Geographic spread supports Pride tour concept")
  } else {
    recommendations.pride_2026_readiness.push("Focus on deepening community engagement before expanding geographically")
    recommendations.pride_2026_readiness.push("Build partnerships in key locations first")
  }

  return recommendations
}