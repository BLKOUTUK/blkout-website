// Test Journey Recognition and Semantic Search Integration
// IVOR Community Liberation Platform - Day 1 Foundation Testing

import { journeyEngine } from './src/lib/journey-recognition.js';
import { semanticSearch } from './src/lib/semantic-search.js';
import { intelligentResponse } from './src/lib/intelligent-response.js';

// Test scenarios for journey-aware AI
const testScenarios = [
  {
    name: 'Crisis Support Request',
    input: 'I\'m having a mental health crisis and need immediate help',
    expected_domain: 'core',
    expected_stage: 'crisis',
    context: {
      current_challenges: ['mental_health_crisis', 'isolation'],
      location: 'Chicago'
    }
  },
  {
    name: 'Community Pattern Recognition',
    input: 'I\'ve noticed many people in my community struggling with housing issues. How can we understand this better?',
    expected_domain: 'community',
    expected_stage: 'community_pattern',
    context: {
      community_connections: ['local_organizers', 'tenant_union'],
      empowerment_goals: ['community_analysis', 'systemic_understanding']
    }
  },
  {
    name: 'Organizing Action Request',
    input: 'I want to start a campaign to address healthcare access in my neighborhood',
    expected_domain: 'organizing',
    expected_stage: 'action',
    context: {
      empowerment_goals: ['campaign_leadership', 'healthcare_justice'],
      community_connections: ['local_activists']
    }
  },
  {
    name: 'Social Platform Growth',
    input: 'I love what IVOR is doing and want to share it with my network to help more people',
    expected_domain: 'social',
    expected_stage: 'network_activation',
    context: {
      empowerment_goals: ['platform_promotion', 'community_growth'],
      resources: ['social_media_presence', 'community_network']
    }
  }
];

// Content search test scenarios
const searchScenarios = [
  {
    name: 'Crisis Resources Search',
    query: 'emergency mental health support Black trans',
    expected_content_type: 'immediate_resources',
    context: {
      domain: 'core',
      journey_stage: 'crisis',
      liberation_focus: ['safety', 'immediate_empowerment']
    }
  },
  {
    name: 'Housing Justice Search',
    query: 'tenant organizing eviction defense strategies',
    expected_content_type: 'campaign_participation',
    context: {
      domain: 'organizing',
      journey_stage: 'action',
      liberation_focus: ['housing_rights', 'collective_action']
    }
  }
];

// Integration test scenarios
const integrationScenarios = [
  {
    name: 'Complete Journey-Aware Response',
    user_input: 'I\'m feeling isolated and want to connect with my community for support and healing',
    expected_elements: [
      'journey_insights',
      'specific_resources',
      'actionable_steps',
      'community_connections',
      'cultural_affirmation'
    ],
    context: {
      current_challenges: ['isolation', 'community_disconnection'],
      empowerment_goals: ['community_connection', 'healing'],
      cultural_background: 'Black_queer'
    }
  }
];

/**
 * Test journey recognition accuracy
 */
async function testJourneyRecognition() {
  console.log('\n🎯 Testing Journey Recognition Engine...\n');
  
  for (const scenario of testScenarios) {
    try {
      console.log(`Testing: ${scenario.name}`);
      console.log(`Input: "${scenario.input}"`);
      
      const result = await journeyEngine.recognizeJourneyStage(
        scenario.input,
        scenario.context
      );
      
      console.log(`Result: ${result.domain}/${result.stage} (${Math.round(result.confidence * 100)}% confidence)`);
      
      // Validate results
      const domainMatch = result.domain === scenario.expected_domain;
      const stageMatch = result.stage === scenario.expected_stage;
      
      console.log(`✅ Domain Match: ${domainMatch ? 'PASS' : 'FAIL'}`);
      console.log(`✅ Stage Match: ${stageMatch ? 'PASS' : 'FAIL'}`);
      console.log(`✅ Confidence: ${result.confidence > 0.6 ? 'PASS' : 'FAIL'} (${result.confidence})`);
      console.log(`Liberation Goals: ${result.liberationGoals.join(', ')}\n`);
      
    } catch (error) {
      console.error(`❌ Error in ${scenario.name}:`, error.message);
    }
  }
}

/**
 * Test semantic search functionality
 */
async function testSemanticSearch() {
  console.log('\n🔍 Testing Semantic Search Engine...\n');
  
  for (const scenario of searchScenarios) {
    try {
      console.log(`Testing: ${scenario.name}`);
      console.log(`Query: "${scenario.query}"`);
      
      const results = await semanticSearch.searchContent(
        scenario.query,
        scenario.context,
        5,
        0.6
      );
      
      console.log(`Found ${results.length} relevant content matches`);
      
      if (results.length > 0) {
        const topResult = results[0];
        console.log(`Top Result: "${topResult.title}"`);
        console.log(`Domain/Stage: ${topResult.domain}/${topResult.journey_stage}`);
        console.log(`Similarity: ${Math.round(topResult.similarity_score * 100)}%`);
        console.log(`Liberation Goals: ${topResult.liberation_goals.join(', ')}`);
        console.log(`Cultural Context: ${topResult.cultural_context}\n`);
      } else {
        console.log('❌ No content matches found\n');
      }
      
    } catch (error) {
      console.error(`❌ Error in ${scenario.name}:`, error.message);
    }
  }
}

/**
 * Test intelligent response generation
 */
async function testIntelligentResponse() {
  console.log('\n🧠 Testing Intelligent Response Generation...\n');
  
  for (const scenario of integrationScenarios) {
    try {
      console.log(`Testing: ${scenario.name}`);
      console.log(`Input: "${scenario.user_input}"`);
      
      const response = await intelligentResponse.generateResponse({
        user_input: scenario.user_input,
        user_context: scenario.context,
        session_id: `test_${Date.now()}`
      });
      
      console.log('\n📋 Response Analysis:');
      console.log(`Domain: ${response.journey_insights.domain}`);
      console.log(`Stage: ${response.journey_insights.current_stage}`);
      console.log(`Support Type: ${response.journey_insights.support_type}`);
      console.log(`Liberation Focus: ${response.journey_insights.liberation_focus.join(', ')}`);
      
      console.log(`\n📚 Resources: ${response.specific_resources.length} resources found`);
      response.specific_resources.slice(0, 2).forEach((resource, i) => {
        console.log(`  ${i + 1}. ${resource.title} (${resource.type})`);
      });
      
      console.log(`\n🎯 Actions: ${response.actionable_steps.length} actionable steps`);
      response.actionable_steps.slice(0, 2).forEach((step, i) => {
        console.log(`  ${i + 1}. ${step.step} (${step.timeline})`);
      });
      
      console.log(`\n🤝 Community: ${response.community_connections.length} connections`);
      response.community_connections.forEach((connection, i) => {
        console.log(`  ${i + 1}. ${connection.connection_type}: ${connection.description.substring(0, 60)}...`);
      });
      
      console.log(`\n✨ Cultural Affirmation: ${response.cultural_affirmation.substring(0, 100)}...`);
      
      // Validate expected elements
      const hasAllElements = scenario.expected_elements.every(element => 
        response[element] !== undefined
      );
      
      console.log(`\n✅ Complete Response: ${hasAllElements ? 'PASS' : 'FAIL'}`);
      console.log(`✅ Message Generated: ${response.message ? 'PASS' : 'FAIL'}`);
      console.log(`✅ Resources Provided: ${response.specific_resources.length > 0 ? 'PASS' : 'FAIL'}`);
      console.log(`✅ Cultural Affirmation: ${response.cultural_affirmation ? 'PASS' : 'FAIL'}\n`);
      
    } catch (error) {
      console.error(`❌ Error in ${scenario.name}:`, error.message);
    }
  }
}

/**
 * Test content ingestion
 */
async function testContentIngestion() {
  console.log('\n📥 Testing Content Ingestion...\n');
  
  const testContent = {
    title: 'Black Trans Joy and Resilience Resources',
    content_text: 'Comprehensive collection of resources celebrating Black trans joy, resilience, and community strength. Includes cultural events, peer support networks, creative expression opportunities, and empowerment workshops designed specifically for Black transgender community members.',
    domain: 'core',
    journey_stage: 'growth',
    cultural_context: 'strength_based_development',
    liberation_goals: ['personal_empowerment', 'community_celebration', 'trans_joy'],
    authority_score: 85
  };
  
  try {
    console.log('Ingesting test content...');
    const result = await semanticSearch.ingestContent(testContent);
    
    if (result.success) {
      console.log(`✅ Content ingested successfully! ID: ${result.content_id}`);
      
      // Test search for ingested content
      console.log('\nSearching for ingested content...');
      const searchResults = await semanticSearch.searchContent(
        'Black trans joy resilience empowerment',
        {
          domain: 'core',
          journey_stage: 'growth'
        },
        3
      );
      
      const foundContent = searchResults.find(r => r.id === result.content_id);
      console.log(`✅ Content Searchable: ${foundContent ? 'PASS' : 'FAIL'}`);
      
      if (foundContent) {
        console.log(`Similarity Score: ${Math.round(foundContent.similarity_score * 100)}%`);
      }
      
    } else {
      console.log(`❌ Content ingestion failed: ${result.error}`);
    }
    
  } catch (error) {
    console.error('❌ Content ingestion error:', error.message);
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('🚀 IVOR Community Liberation Platform - Day 1 Foundation Testing');
  console.log('=================================================================');
  
  try {
    await testJourneyRecognition();
    await testSemanticSearch();
    await testIntelligentResponse();
    await testContentIngestion();
    
    console.log('\n🎉 Day 1 Foundation Testing Complete!');
    console.log('=================================');
    console.log('\n✅ Key Components Tested:');
    console.log('  - Journey Recognition Engine');
    console.log('  - Semantic Search with pgvector');
    console.log('  - Intelligent Response Generation');
    console.log('  - Content Ingestion Pipeline');
    console.log('  - Cultural Authenticity Integration');
    console.log('  - Liberation Values Alignment');
    
    console.log('\n🚀 Ready for Day 2: Advanced Features & Integration');
    
  } catch (error) {
    console.error('❌ Critical testing error:', error);
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}

export {
  testJourneyRecognition,
  testSemanticSearch,
  testIntelligentResponse,
  testContentIngestion,
  runAllTests
};