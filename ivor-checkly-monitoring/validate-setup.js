/**
 * Pre-deployment validation for IVOR Checkly monitoring
 * Validates all endpoints before deploying to Checkly cloud
 */

const IVOR_SERVICES = {
  'api-gateway': 'https://ivor-api-gateway-1yhe12lks-robs-projects-54d653d3.vercel.app',
  'core': 'https://ivor-core-gj4mxzljt-robs-projects-54d653d3.vercel.app',
  'organizing': 'https://ivor-organizing-nu0qko6j6-robs-projects-54d653d3.vercel.app', 
  'community': 'https://ivor-community-47273u41f-robs-projects-54d653d3.vercel.app',
  'social': 'https://ivor-social-4j0x0h2te-robs-projects-54d653d3.vercel.app'
};

const MONITORING_DASHBOARD = 'https://ivor-monitoring-service.vercel.app';

async function validateEndpoint(name, url, expectedStatus = 200) {
  try {
    console.log(`🔍 Testing ${name}: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const isHealthy = response.status === expectedStatus;
    const status = isHealthy ? '✅' : '❌';
    
    console.log(`${status} ${name}: ${response.status} (${response.statusText})`);
    return isHealthy;
    
  } catch (error) {
    console.log(`❌ ${name}: Error - ${error.message}`);
    return false;
  }
}

async function validateOrchestration() {
  console.log('🧪 Testing IVOR orchestration...');
  
  const testMessage = {
    message: 'Test orchestration for Checkly monitoring setup',
    context: { pathway: 'System Disruptor', focus: 'monitoring' }
  };
  
  try {
    const response = await fetch(`${IVOR_SERVICES['api-gateway']}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testMessage)
    });
    
    if (response.ok) {
      const data = await response.json();
      const hasGoodResponse = data.response && data.response.length > 50;
      const hasOrchestration = data.routedVia === 'ivor-api-gateway';
      
      if (hasGoodResponse && hasOrchestration) {
        console.log('✅ IVOR Orchestration: High-quality response received');
        return true;
      } else {
        console.log('⚠️ IVOR Orchestration: Response quality issues detected');
        console.log(`  - Response length: ${data.response?.length || 0}`);
        console.log(`  - Routed via: ${data.routedVia || 'unknown'}`);
        return false;
      }
    } else {
      console.log(`❌ IVOR Orchestration: HTTP ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ IVOR Orchestration: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 IVOR Checkly Monitoring - Pre-deployment Validation\n');
  
  const results = [];
  
  // Test individual service health endpoints
  for (const [name, url] of Object.entries(IVOR_SERVICES)) {
    const healthUrl = `${url}/api/health`;
    const result = await validateEndpoint(`${name} health`, healthUrl);
    results.push(result);
  }
  
  console.log(''); // Spacing
  
  // Test monitoring dashboard
  const dashboardResult = await validateEndpoint('Monitoring Dashboard', MONITORING_DASHBOARD);
  results.push(dashboardResult);
  
  console.log(''); // Spacing
  
  // Test orchestration
  const orchestrationResult = await validateOrchestration();
  results.push(orchestrationResult);
  
  console.log('\n📋 VALIDATION SUMMARY');
  const passedTests = results.filter(r => r).length;
  const totalTests = results.length;
  
  console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED - Ready for Checkly deployment!');
    console.log('\nNext steps:');
    console.log('1. Run: checkly login');
    console.log('2. Run: checkly deploy');
    console.log('3. Monitor: https://app.checklyhq.com/checks');
    process.exit(0);
  } else {
    console.log('\n⚠️ Some tests failed - review IVOR services before deployment');
    console.log('\nTroubleshooting:');
    console.log('1. Check https://ivor-monitoring-service.vercel.app/');
    console.log('2. Wait 1-2 minutes for cold starts');  
    console.log('3. Re-run this validation');
    process.exit(1);
  }
}

// Handle both CommonJS and ES modules
if (typeof require !== 'undefined' && require.main === module) {
  main();
} else if (typeof window === 'undefined') {
  main();
}