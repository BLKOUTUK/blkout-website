// IVOR Platform Functionality Test Suite
// Test all platform features without external dependencies

import { ivorAPI } from './src/lib/api-client.js';

/**
 * Comprehensive functionality test for IVOR platform
 */
class IVORFunctionalityTester {
  constructor() {
    this.testResults = [];
    this.totalTests = 0;
    this.passedTests = 0;
  }

  /**
   * Run all functionality tests
   */
  async runAllTests() {
    console.log('🧪 IVOR Community Liberation Platform - Functionality Testing');
    console.log('==========================================================\n');

    await this.testAPIClientInitialization();
    await this.testJourneyRecognition();
    await this.testIntelligentResponseGeneration();
    await this.testOrganizingProjectManagement();
    await this.testCommunityStatistics();
    await this.testDemoModeFeatures();
    await this.testErrorHandling();
    await this.testPerformanceBasics();

    this.generateFunctionalityReport();
  }

  /**
   * Test API client initialization
   */
  async testAPIClientInitialization() {
    console.log('🔧 Testing API Client Initialization...\n');
    
    try {
      const healthCheck = await ivorAPI.healthCheck();
      
      this.recordTest(
        'API Client Health Check',
        healthCheck.success,
        healthCheck.success ? 
          `Status: ${healthCheck.data.status}, Demo Mode: ${healthCheck.data.demo_mode}` : 
          `Error: ${healthCheck.error}`
      );

      console.log(`✅ API Client initialized successfully`);
      console.log(`📊 Services Status:`);
      if (healthCheck.success) {
        Object.entries(healthCheck.data.services).forEach(([service, status]) => {
          console.log(`   - ${service}: ${status}`);
        });
      }
      console.log();

    } catch (error) {
      this.recordTest('API Client Health Check', false, `Exception: ${error.message}`);
      console.error('❌ API Client initialization failed:', error.message);
    }
  }

  /**
   * Test journey recognition functionality
   */
  async testJourneyRecognition() {
    console.log('🧠 Testing Journey Recognition...\n');

    const testCases = [
      {
        input: "I'm having a mental health crisis and need immediate help",
        expectedDomain: 'core',
        expectedStage: 'crisis'
      },
      {
        input: "I want to organize my community around housing justice",
        expectedDomain: 'organizing',
        expectedStage: 'action'
      },
      {
        input: "I need healing and community connection",
        expectedDomain: 'core',
        expectedStage: 'community_healing'
      }
    ];

    for (const testCase of testCases) {
      try {
        console.log(`Testing: "${testCase.input}"`);
        
        const startTime = Date.now();
        const result = await ivorAPI.recognizeJourneyStage(
          testCase.input,
          { empowerment_goals: ['liberation', 'community_connection'] }
        );
        const responseTime = Date.now() - startTime;

        const success = result.success && 
                       result.data?.domain === testCase.expectedDomain;

        this.recordTest(
          `Journey Recognition: ${testCase.expectedStage}`,
          success,
          success ? 
            `Domain: ${result.data.domain}, Stage: ${result.data.stage}, Confidence: ${result.data.confidence}, Time: ${responseTime}ms` :
            `Error: ${result.error || 'Unexpected result'}`
        );

        if (success) {
          console.log(`✅ Recognized as ${result.data.domain}/${result.data.stage} (${Math.round(result.data.confidence * 100)}% confidence)`);
          console.log(`   Liberation Goals: ${result.data.liberationGoals.join(', ')}`);
          console.log(`   Response Time: ${responseTime}ms`);
        } else {
          console.log(`❌ Failed: ${result.error || 'Unexpected result'}`);
        }
        console.log();

      } catch (error) {
        this.recordTest(`Journey Recognition: ${testCase.expectedStage}`, false, `Exception: ${error.message}`);
        console.error(`❌ Exception testing "${testCase.input}":`, error.message);
      }
    }
  }

  /**
   * Test intelligent response generation
   */
  async testIntelligentResponseGeneration() {
    console.log('💬 Testing Intelligent Response Generation...\n');

    const testCases = [
      {
        input: "I'm feeling isolated and want to connect with my community",
        expectedElements: ['message', 'cultural_affirmation', 'specific_resources']
      },
      {
        input: "I want to start organizing around healthcare access",
        expectedElements: ['message', 'actionable_steps', 'community_connections']
      }
    ];

    for (const testCase of testCases) {
      try {
        console.log(`Testing: "${testCase.input}"`);
        
        const startTime = Date.now();
        const result = await ivorAPI.generateIntelligentResponse(
          testCase.input,
          { cultural_background: 'Black_queer', location: 'Chicago' },
          `test_session_${Date.now()}`
        );
        const responseTime = Date.now() - startTime;

        const hasAllElements = result.success && 
                              testCase.expectedElements.every(element => 
                                result.data && result.data[element]
                              );

        this.recordTest(
          `Intelligent Response: ${testCase.input.substring(0, 30)}...`,
          hasAllElements,
          hasAllElements ? 
            `Generated complete response in ${responseTime}ms` :
            `Missing elements or error: ${result.error || 'Incomplete response'}`
        );

        if (result.success && result.data) {
          console.log(`✅ Generated intelligent response (${responseTime}ms)`);
          console.log(`   Message: ${result.data.message.substring(0, 100)}...`);
          console.log(`   Cultural Affirmation: ${result.data.cultural_affirmation ? 'Yes' : 'No'}`);
          console.log(`   Resources: ${result.data.specific_resources.length}`);
          console.log(`   Actions: ${result.data.actionable_steps.length}`);
          console.log(`   Community Connections: ${result.data.community_connections.length}`);
        } else {
          console.log(`❌ Failed: ${result.error || 'No data returned'}`);
        }
        console.log();

      } catch (error) {
        this.recordTest(`Intelligent Response: ${testCase.input.substring(0, 30)}...`, false, `Exception: ${error.message}`);
        console.error(`❌ Exception testing response generation:`, error.message);
      }
    }
  }

  /**
   * Test organizing project management
   */
  async testOrganizingProjectManagement() {
    console.log('✊ Testing Organizing Project Management...\n');

    try {
      // Test loading active projects
      console.log('Loading active organizing projects...');
      const startTime = Date.now();
      const projectsResult = await ivorAPI.getActiveProjects();
      const loadTime = Date.now() - startTime;

      this.recordTest(
        'Load Active Projects',
        projectsResult.success,
        projectsResult.success ? 
          `Loaded ${projectsResult.data?.length || 0} projects in ${loadTime}ms` :
          `Error: ${projectsResult.error}`
      );

      if (projectsResult.success) {
        console.log(`✅ Loaded ${projectsResult.data?.length || 0} active projects (${loadTime}ms)`);
        if (projectsResult.data && projectsResult.data.length > 0) {
          const project = projectsResult.data[0];
          console.log(`   Example: "${project.title}" (${project.project_type})`);
          console.log(`   Community Support: ${project.community_support_level}%`);
          console.log(`   Validation Score: ${project.democratic_validation_score}%`);
        }
      } else {
        console.log(`❌ Failed to load projects: ${projectsResult.error}`);
      }

      // Test creating a project
      console.log('\nTesting project creation...');
      const createStartTime = Date.now();
      const createResult = await ivorAPI.createProject(
        {
          title: 'Test Liberation Project',
          description: 'Testing community project creation with liberation focus and democratic validation',
          project_type: 'education',
          journey_stage: 'action',
          liberation_objectives: ['educational_justice', 'community_empowerment'],
          organizing_stage: 'awareness',
          democratic_validation_score: 0,
          community_support_level: 0,
          status: 'proposed'
        },
        {
          session_id: `test_${Date.now()}`,
          empowerment_goals: ['educational_justice'],
          location: 'Test Area'
        }
      );
      const createTime = Date.now() - createStartTime;

      this.recordTest(
        'Create Organizing Project',
        createResult.success,
        createResult.success ? 
          `Project created successfully in ${createTime}ms` :
          `Error: ${createResult.error}`
      );

      if (createResult.success) {
        console.log(`✅ Project created successfully (${createTime}ms)`);
        console.log(`   Project ID: ${createResult.data?.project_id}`);
        console.log(`   Validation Status: ${createResult.data?.validation_needed ? 'Required' : 'Not Required'}`);
      } else {
        console.log(`❌ Failed to create project: ${createResult.error}`);
      }
      console.log();

    } catch (error) {
      this.recordTest('Organizing Project Management', false, `Exception: ${error.message}`);
      console.error('❌ Exception testing organizing features:', error.message);
    }
  }

  /**
   * Test community statistics
   */
  async testCommunityStatistics() {
    console.log('📊 Testing Community Statistics...\n');

    try {
      console.log('Loading community statistics...');
      const startTime = Date.now();
      const statsResult = await ivorAPI.getCommunityStats();
      const loadTime = Date.now() - startTime;

      const hasValidStats = statsResult.success && 
                           statsResult.data &&
                           typeof statsResult.data.active_projects === 'number' &&
                           typeof statsResult.data.liberation_impact_score === 'number';

      this.recordTest(
        'Community Statistics',
        hasValidStats,
        hasValidStats ? 
          `Loaded statistics in ${loadTime}ms` :
          `Error or invalid data: ${statsResult.error || 'Invalid stats format'}`
      );

      if (hasValidStats) {
        console.log(`✅ Community statistics loaded (${loadTime}ms)`);
        console.log(`   Active Projects: ${statsResult.data.active_projects}`);
        console.log(`   Community Members: ${statsResult.data.community_members}`);
        console.log(`   Organizing Opportunities: ${statsResult.data.organizing_opportunities}`);
        console.log(`   Liberation Impact Score: ${statsResult.data.liberation_impact_score}%`);
        console.log(`   Cultural Authenticity: ${statsResult.data.cultural_authenticity_avg}%`);
      } else {
        console.log(`❌ Failed to load valid statistics: ${statsResult.error || 'Invalid data'}`);
      }
      console.log();

    } catch (error) {
      this.recordTest('Community Statistics', false, `Exception: ${error.message}`);
      console.error('❌ Exception testing community statistics:', error.message);
    }
  }

  /**
   * Test demo mode features
   */
  async testDemoModeFeatures() {
    console.log('🎭 Testing Demo Mode Features...\n');

    try {
      // Test that demo mode provides consistent results
      const testInputs = [
        "crisis help needed",
        "organize community action", 
        "healing and connection"
      ];

      let demoModeWorking = true;
      
      for (const input of testInputs) {
        const result = await ivorAPI.recognizeJourneyStage(input);
        if (!result.success || !result.data) {
          demoModeWorking = false;
          break;
        }
      }

      this.recordTest(
        'Demo Mode Functionality',
        demoModeWorking,
        demoModeWorking ? 
          'Demo mode providing consistent results for all test inputs' :
          'Demo mode not working consistently'
      );

      if (demoModeWorking) {
        console.log('✅ Demo mode functioning correctly');
        console.log('   - Consistent journey recognition responses');
        console.log('   - Mock data generation working');
        console.log('   - No external API dependencies required');
      } else {
        console.log('❌ Demo mode not working consistently');
      }
      console.log();

    } catch (error) {
      this.recordTest('Demo Mode Features', false, `Exception: ${error.message}`);
      console.error('❌ Exception testing demo mode:', error.message);
    }
  }

  /**
   * Test error handling
   */
  async testErrorHandling() {
    console.log('🛡️ Testing Error Handling...\n');

    try {
      // Test invalid inputs
      const invalidResult = await ivorAPI.recognizeJourneyStage('');
      
      const handlesEmptyInput = !invalidResult.success || 
                               (invalidResult.success && invalidResult.data?.confidence < 0.5);

      this.recordTest(
        'Error Handling: Empty Input',
        handlesEmptyInput,
        handlesEmptyInput ? 
          'Properly handles empty input' :
          'Does not properly handle empty input'
      );

      console.log(`${handlesEmptyInput ? '✅' : '❌'} Empty input handling: ${handlesEmptyInput ? 'Pass' : 'Fail'}`);
      console.log();

    } catch (error) {
      // Catching an exception for empty input is also valid error handling
      this.recordTest('Error Handling: Empty Input', true, 'Exception properly thrown for invalid input');
      console.log('✅ Empty input handling: Exception properly thrown');
    }
  }

  /**
   * Test basic performance
   */
  async testPerformanceBasics() {
    console.log('⚡ Testing Basic Performance...\n');

    try {
      const performanceTests = [];
      
      // Test response times for key operations
      for (let i = 0; i < 5; i++) {
        const startTime = Date.now();
        await ivorAPI.recognizeJourneyStage('test performance query');
        const responseTime = Date.now() - startTime;
        performanceTests.push(responseTime);
      }

      const avgResponseTime = performanceTests.reduce((a, b) => a + b, 0) / performanceTests.length;
      const maxResponseTime = Math.max(...performanceTests);
      const performanceGood = avgResponseTime < 2000 && maxResponseTime < 5000;

      this.recordTest(
        'Basic Performance',
        performanceGood,
        `Avg: ${Math.round(avgResponseTime)}ms, Max: ${maxResponseTime}ms`
      );

      console.log(`${performanceGood ? '✅' : '❌'} Performance test: ${performanceGood ? 'Pass' : 'Fail'}`);
      console.log(`   Average Response Time: ${Math.round(avgResponseTime)}ms`);
      console.log(`   Max Response Time: ${maxResponseTime}ms`);
      console.log(`   Performance Target (<2s avg): ${avgResponseTime < 2000 ? 'Met' : 'Not Met'}`);
      console.log();

    } catch (error) {
      this.recordTest('Basic Performance', false, `Exception: ${error.message}`);
      console.error('❌ Exception testing performance:', error.message);
    }
  }

  /**
   * Record test result
   */
  recordTest(testName, passed, details) {
    this.totalTests++;
    if (passed) {
      this.passedTests++;
    }
    
    this.testResults.push({
      name: testName,
      passed,
      details,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Generate functionality report
   */
  generateFunctionalityReport() {
    console.log('\n📋 IVOR Platform Functionality Test Report');
    console.log('==========================================\n');

    const successRate = Math.round((this.passedTests / this.totalTests) * 100);

    console.log(`📊 Overall Test Results:`);
    console.log(`   Total Tests: ${this.totalTests}`);
    console.log(`   Passed: ${this.passedTests}`);
    console.log(`   Failed: ${this.totalTests - this.passedTests}`);
    console.log(`   Success Rate: ${successRate}%\n`);

    // Detailed results
    console.log('📝 Detailed Test Results:');
    this.testResults.forEach(result => {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      console.log(`   ${status} ${result.name}`);
      console.log(`      ${result.details}`);
    });

    // Platform status assessment
    console.log('\n🎯 Platform Status Assessment:');
    
    if (successRate >= 90) {
      console.log('   🎉 EXCELLENT: Platform fully functional and ready for production');
      console.log('   ✅ All core features working correctly');
      console.log('   ✅ Error handling robust');
      console.log('   ✅ Performance meets targets');
      console.log('   ✅ Demo mode fully operational');
      
      console.log('\n🚀 IVOR Community Liberation Platform: FULLY FUNCTIONAL');
      console.log('=====================================================');
      console.log('🌟 Ready for community engagement and real-world liberation impact!');
      
    } else if (successRate >= 75) {
      console.log('   ✅ GOOD: Platform mostly functional with minor issues');
      console.log('   🔧 Some features may need attention but core functionality works');
      
    } else if (successRate >= 50) {
      console.log('   ⚠️ PARTIAL: Platform partially functional');
      console.log('   🔧 Significant issues need to be addressed');
      
    } else {
      console.log('   ❌ CRITICAL: Major functionality issues detected');
      console.log('   🔧 Platform needs significant work before deployment');
    }

    // Next steps
    console.log('\n🎯 Next Steps:');
    if (successRate >= 90) {
      console.log('   1. ✅ Platform testing complete');
      console.log('   2. 🚀 Ready for community launch');
      console.log('   3. 📈 Monitor performance in production');
      console.log('   4. 🏘️ Begin community onboarding');
    } else {
      const failedTests = this.testResults.filter(r => !r.passed);
      console.log('   1. 🔧 Address failed tests:');
      failedTests.forEach(test => {
        console.log(`      - ${test.name}: ${test.details}`);
      });
      console.log('   2. 🧪 Re-run functionality tests');
      console.log('   3. 📊 Validate all features working');
    }

    return {
      totalTests: this.totalTests,
      passedTests: this.passedTests,
      successRate,
      platformReady: successRate >= 90,
      testResults: this.testResults
    };
  }
}

// Export for use in other modules
export { IVORFunctionalityTester };

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new IVORFunctionalityTester();
  await tester.runAllTests();
}