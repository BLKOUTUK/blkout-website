/**
 * IVOR Cascade Failure Detection & Checkly E2E Setup
 * 
 * Problem: IVOR services revert to weak fallback responses too quickly
 * instead of allowing proper service orchestration
 * 
 * This script sets up monitoring to detect:
 * 1. Premature fallbacks when services are actually available
 * 2. Weak response quality due to rushed timeout logic
 * 3. Service orchestration breakdown patterns
 */

const IVOR_SERVICES = {
  'api-gateway': 'https://ivor-api-gateway-1yhe12lks-robs-projects-54d653d3.vercel.app',
  'core': 'https://ivor-core-gj4mxzljt-robs-projects-54d653d3.vercel.app',
  'organizing': 'https://ivor-organizing-nu0qko6j6-robs-projects-54d653d3.vercel.app', 
  'community': 'https://ivor-community-47273u41f-robs-projects-54d653d3.vercel.app',
  'social': 'https://ivor-social-4j0x0h2te-robs-projects-54d653d3.vercel.app'
};

const TELEGRAM_WEBHOOK = process.env.TELEGRAM_WEBHOOK_URL;

/**
 * Test IVOR orchestration quality
 * Detects if responses are falling back prematurely
 */
async function testIVOROrchestration() {
  const testScenarios = [
    {
      name: 'System Disruptor Pathway Response',
      message: 'I need help organizing a community action around housing justice',
      context: { pathway: 'System Disruptor', focus: 'housing justice' },
      expectedQuality: 'high', // Should route to organizing + community services
      timeout: 8000 // Allow proper orchestration time
    },
    {
      name: 'Community Healer Pathway Response', 
      message: 'Looking for trauma-informed support resources in my area',
      context: { pathway: 'Community Healer', focus: 'trauma support' },
      expectedQuality: 'high', // Should route to community + core services
      timeout: 8000
    },
    {
      name: 'Multi-Service Knowledge Query',
      message: 'What community organizing strategies work best for Black queer communities?',
      context: null,
      expectedQuality: 'high', // Should orchestrate multiple services
      timeout: 10000
    }
  ];

  const results = [];

  for (const scenario of testScenarios) {
    console.log(`🧪 Testing: ${scenario.name}`);
    
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${IVOR_SERVICES['api-gateway']}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: scenario.message,
          context: scenario.context
        })
      });

      const responseTime = Date.now() - startTime;
      const data = await response.json();
      
      // Analyze response quality
      const analysis = analyzeResponseQuality(data, scenario, responseTime);
      
      results.push({
        scenario: scenario.name,
        ...analysis,
        responseTime,
        timestamp: new Date().toISOString()
      });

      console.log(`✅ ${scenario.name}: ${analysis.quality} (${responseTime}ms)`);
      
    } catch (error) {
      results.push({
        scenario: scenario.name,
        quality: 'error',
        issue: 'network_failure',
        error: error.message,
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
      
      console.log(`❌ ${scenario.name}: Error - ${error.message}`);
    }
  }

  return results;
}

/**
 * Analyze IVOR response quality to detect premature fallbacks
 */
function analyzeResponseQuality(response, scenario, responseTime) {
  const analysis = {
    quality: 'unknown',
    issues: [],
    serviceOrchestration: false,
    prematureFallback: false
  };

  // Check if response indicates proper service orchestration
  if (response.routedVia === 'ivor-api-gateway' && response.targetService) {
    analysis.serviceOrchestration = true;
  }

  // Detect fallback indicators
  const fallbackIndicators = [
    'offline mode',
    'temporarily unavailable',
    'fallback response',
    'cannot access',
    'currently operating in'
  ];

  const responseText = (response.response || '').toLowerCase();
  const hasFallbackLanguage = fallbackIndicators.some(indicator => 
    responseText.includes(indicator)
  );

  // Quality assessment
  if (hasFallbackLanguage && responseTime < 2000) {
    analysis.quality = 'weak';
    analysis.prematureFallback = true;
    analysis.issues.push('premature_fallback_detected');
  } else if (response.communityFocused && response.culturallyAffirming) {
    analysis.quality = 'high';
  } else if (responseText.length > 100 && analysis.serviceOrchestration) {
    analysis.quality = 'good';
  } else {
    analysis.quality = 'degraded';
    analysis.issues.push('low_quality_response');
  }

  // Pathway-specific analysis
  if (scenario.context?.pathway && !responseText.includes(scenario.context.pathway.toLowerCase())) {
    analysis.issues.push('pathway_context_ignored');
  }

  return analysis;
}

/**
 * Send detailed cascade failure alert to Telegram
 */
async function sendCascadeAlert(results) {
  if (!TELEGRAM_WEBHOOK) {
    console.log('⚠️ No Telegram webhook configured');
    return;
  }

  const weakResponses = results.filter(r => r.quality === 'weak' || r.prematureFallback);
  const errorResponses = results.filter(r => r.quality === 'error');

  if (weakResponses.length === 0 && errorResponses.length === 0) {
    return; // No issues to report
  }

  let alertMessage = `🚨 IVOR CASCADE FAILURE DETECTED\n\n`;
  
  if (weakResponses.length > 0) {
    alertMessage += `⚠️ PREMATURE FALLBACKS (${weakResponses.length}):\n`;
    weakResponses.forEach(r => {
      alertMessage += `• ${r.scenario}: ${r.responseTime}ms (too fast)\n`;
    });
    alertMessage += '\n';
  }

  if (errorResponses.length > 0) {
    alertMessage += `❌ SERVICE FAILURES (${errorResponses.length}):\n`;
    errorResponses.forEach(r => {
      alertMessage += `• ${r.scenario}: ${r.error}\n`;
    });
    alertMessage += '\n';
  }

  alertMessage += `📊 Check monitoring: https://ivor-monitoring-service.vercel.app/\n`;
  alertMessage += `⏰ Time: ${new Date().toLocaleString()}`;

  try {
    await fetch(TELEGRAM_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: alertMessage })
    });
    console.log('📱 Cascade failure alert sent to Telegram');
  } catch (error) {
    console.error('Failed to send Telegram alert:', error);
  }
}

/**
 * Main monitoring function
 */
async function runCascadeMonitoring() {
  console.log('🔍 IVOR Cascade Monitoring Started');
  console.log('Monitoring for premature fallbacks and weak responses...\n');

  const results = await testIVOROrchestration();
  
  // Report summary
  const highQuality = results.filter(r => r.quality === 'high').length;
  const weakQuality = results.filter(r => r.quality === 'weak' || r.prematureFallback).length;
  const errors = results.filter(r => r.quality === 'error').length;

  console.log('\n📋 IVOR CASCADE MONITORING SUMMARY');
  console.log(`✅ High Quality Responses: ${highQuality}`);
  console.log(`⚠️ Weak/Premature Fallbacks: ${weakQuality}`);
  console.log(`❌ Errors: ${errors}`);
  
  // Send alerts if needed
  await sendCascadeAlert(results);
  
  return {
    timestamp: new Date().toISOString(),
    summary: { highQuality, weakQuality, errors },
    results,
    overallHealth: weakQuality === 0 && errors === 0 ? 'healthy' : 
                   weakQuality > 1 ? 'degraded' : 'warning'
  };
}

// Export for both Node.js and Checkly
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runCascadeMonitoring, testIVOROrchestration };
}

// Run if called directly
if (require.main === module) {
  runCascadeMonitoring().then(results => {
    console.log('\n🏁 Monitoring complete');
    process.exit(results.overallHealth === 'healthy' ? 0 : 1);
  }).catch(error => {
    console.error('❌ Monitoring failed:', error);
    process.exit(1);
  });
}