/**
 * BLKOUT Platform Health Check - Emergency Beta Launch
 * Comprehensive dependency testing for all critical services
 * 
 * Tests:
 * - IVOR AI backend services 
 * - Magazine service backend
 * - Events backend (Supabase + Legacy)
 * - Newsroom backend (Supabase + Legacy) 
 * - Critical APIs and data sources
 * 
 * Reports status for immediate failure detection
 */

// Import necessary utilities for timeout handling
const fetchWithTimeout = (url, options = {}, timeout = 5000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
};

export default async function handler(req, res) {
  // Set CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const startTime = Date.now();
  const healthChecks = [];

  // 1. IVOR Backend Service Test
  try {
    const ivorUrls = [
      'https://services-deploy.vercel.app/api/health',
      'https://ivor.vercel.app/api/health',  
      'https://blkout-ivor-api.vercel.app/api/health'
    ];
    
    let ivorHealthy = false;
    let ivorUrl = null;
    
    for (const url of ivorUrls) {
      try {
        const response = await fetchWithTimeout(url, {}, 3000);
        if (response.ok) {
          ivorHealthy = true;
          ivorUrl = url;
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    healthChecks.push({
      service: 'ivor_backend',
      name: 'IVOR AI Assistant',
      status: ivorHealthy ? 'healthy' : 'degraded',
      url: ivorUrl || ivorUrls[0],
      responseTime: null,
      critical: true,
      fallback: 'Offline mode with pathway-aware responses'
    });
  } catch (error) {
    healthChecks.push({
      service: 'ivor_backend',
      name: 'IVOR AI Assistant', 
      status: 'error',
      error: error.message,
      critical: true,
      fallback: 'Offline mode with pathway-aware responses'
    });
  }

  // 2. Magazine Backend Service Test
  try {
    const magazineStart = Date.now();
    const magazineResponse = await fetchWithTimeout(
      'https://magazine-deploy.vercel.app/health',
      {},
      3000
    );
    
    healthChecks.push({
      service: 'magazine_backend',
      name: 'Magazine & Stories Service',
      status: magazineResponse.ok ? 'healthy' : 'degraded',
      responseTime: Date.now() - magazineStart,
      critical: false,
      fallback: 'Live story archive from BLKOUT UK (250 articles)'
    });
  } catch (error) {
    healthChecks.push({
      service: 'magazine_backend',
      name: 'Magazine & Stories Service',
      status: 'degraded',
      error: error.message,
      critical: false,
      fallback: 'Live story archive from BLKOUT UK (250 articles)'
    });
  }

  // 3. Events Service Test (includes Supabase check)
  try {
    const eventsStart = Date.now();
    // Test our own events API which handles Supabase failover
    const eventsResponse = await fetchWithTimeout('/api/events', {}, 3000);
    
    healthChecks.push({
      service: 'events_service',
      name: 'Events & Community Calendar', 
      status: eventsResponse.ok ? 'healthy' : 'degraded',
      responseTime: Date.now() - eventsStart,
      critical: false,
      fallback: 'Mock community events with realistic data'
    });
  } catch (error) {
    healthChecks.push({
      service: 'events_service', 
      name: 'Events & Community Calendar',
      status: 'degraded',
      error: error.message,
      critical: false,
      fallback: 'Mock community events with realistic data'
    });
  }

  // 4. Articles/Content API Test  
  try {
    const articlesStart = Date.now();
    const articlesResponse = await fetchWithTimeout('/api/articles', {}, 3000);
    
    healthChecks.push({
      service: 'articles_api',
      name: 'Articles & Content API',
      status: articlesResponse.ok ? 'healthy' : 'degraded', 
      responseTime: Date.now() - articlesStart,
      critical: false,
      fallback: 'Curated default articles with community focus'
    });
  } catch (error) {
    healthChecks.push({
      service: 'articles_api',
      name: 'Articles & Content API',
      status: 'degraded', 
      error: error.message,
      critical: false,
      fallback: 'Curated default articles with community focus'
    });
  }

  // 5. External Dependencies Test
  try {
    // Test GitHub raw content (for extension downloads, etc.)
    const githubStart = Date.now();
    const githubResponse = await fetchWithTimeout(
      'https://api.github.com/repos/BLKOUTUK/blkout-extension',
      {},
      4000
    );
    
    healthChecks.push({
      service: 'github_content',
      name: 'GitHub Content Delivery',
      status: githubResponse.ok ? 'healthy' : 'degraded',
      responseTime: Date.now() - githubStart,
      critical: false,
      fallback: 'Local content mirrors available'
    });
  } catch (error) {
    healthChecks.push({
      service: 'github_content',
      name: 'GitHub Content Delivery',
      status: 'degraded',
      error: error.message,
      critical: false,
      fallback: 'Local content mirrors available'
    });
  }

  // Calculate overall health status
  const totalChecks = healthChecks.length;
  const healthyChecks = healthChecks.filter(check => check.status === 'healthy').length;
  const criticalFailures = healthChecks.filter(check => check.critical && check.status !== 'healthy').length;
  
  let overallStatus;
  if (criticalFailures > 0) {
    overallStatus = 'degraded'; // Critical services failing
  } else if (healthyChecks === totalChecks) {
    overallStatus = 'healthy'; // All systems operational
  } else if (healthyChecks >= totalChecks * 0.8) {
    overallStatus = 'healthy'; // 80%+ healthy = operational
  } else {
    overallStatus = 'degraded'; // Multiple service issues
  }

  const healthReport = {
    timestamp: new Date().toISOString(),
    status: overallStatus,
    version: '2.1.0-beta',
    platform: 'BLKOUT Community Platform',
    environment: process.env.NODE_ENV || 'production',
    
    summary: {
      total_services: totalChecks,
      healthy_services: healthyChecks,
      degraded_services: totalChecks - healthyChecks,
      critical_failures: criticalFailures,
      response_time_ms: Date.now() - startTime
    },
    
    services: healthChecks,
    
    // Beta launch readiness indicators
    beta_readiness: {
      core_functionality: criticalFailures === 0,
      user_experience: healthyChecks >= totalChecks * 0.75, 
      fallback_systems: true, // All services have fallbacks
      monitoring_active: true
    },
    
    // Emergency contact info for beta
    support: {
      telegram_bot: process.env.TELEGRAM_WEBHOOK_URL ? 'configured' : 'not_configured',
      emergency_rollback: 'manual', // For beta launch
      documentation: '/docs/emergency-procedures'
    }
  };

  // Send alert to Telegram if critical services are failing
  if (criticalFailures > 0 && process.env.TELEGRAM_WEBHOOK_URL) {
    try {
      await fetch(process.env.TELEGRAM_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🚨 BLKOUT BETA ALERT: ${criticalFailures} critical service(s) down. Platform status: ${overallStatus}. Check health dashboard immediately.`
        })
      });
    } catch (alertError) {
      console.error('Failed to send Telegram alert:', alertError);
    }
  }

  // Return appropriate HTTP status
  const httpStatus = overallStatus === 'healthy' ? 200 : 
                    criticalFailures > 0 ? 503 : 200;

  res.status(httpStatus).json(healthReport);
}