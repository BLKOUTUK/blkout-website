// Test script for RSS and Instagram content discovery services
// Run before deployment to ensure all services work correctly

import { contentDiscoveryService } from '../services/contentDiscoveryService';
import { instagramContentDiscoveryService } from '../services/instagramContentDiscovery';
import { contentIntegrationService } from '../services/contentIntegrationService';

export interface TestResults {
  rssDiscovery: {
    success: boolean;
    itemsFound: number;
    error?: string;
  };
  instagramDiscovery: {
    success: boolean;
    itemsFound: number;
    error?: string;
  };
  contentIntegration: {
    success: boolean;
    eventsIntegrated: number;
    newsIntegrated: number;
    error?: string;
  };
  overallStatus: 'success' | 'partial' | 'failed';
}

export async function runContentDiscoveryTests(): Promise<TestResults> {
  console.log('🧪 Starting content discovery system tests...');
  
  const results: TestResults = {
    rssDiscovery: { success: false, itemsFound: 0 },
    instagramDiscovery: { success: false, itemsFound: 0 },
    contentIntegration: { success: false, eventsIntegrated: 0, newsIntegrated: 0 },
    overallStatus: 'failed'
  };

  // Test 1: RSS Content Discovery
  try {
    console.log('📡 Testing RSS content discovery...');
    
    const [blkoutContent, rssContent, eventContent] = await Promise.all([
      contentDiscoveryService.scrapeBLKOUTUKContent(),
      contentDiscoveryService.processRelevantRSSFeeds(),
      contentDiscoveryService.aggregateQueerEvents()
    ]);

    const totalRSSItems = blkoutContent.length + rssContent.length + eventContent.length;
    
    results.rssDiscovery = {
      success: true,
      itemsFound: totalRSSItems
    };
    
    console.log(`✅ RSS Discovery: Found ${totalRSSItems} items`);
    console.log(`   - BLKOUT UK: ${blkoutContent.length} items`);
    console.log(`   - RSS Feeds: ${rssContent.length} items`);
    console.log(`   - Events: ${eventContent.length} items`);
    
  } catch (error) {
    console.error('❌ RSS Discovery failed:', error);
    results.rssDiscovery = {
      success: false,
      itemsFound: 0,
      error: error instanceof Error ? error.message : String(error)
    };
  }

  // Test 2: Instagram Discovery (mock mode for testing)
  try {
    console.log('📱 Testing Instagram discovery...');
    
    const instagramEvents = await instagramContentDiscoveryService.discoverInstagramEvents();
    
    results.instagramDiscovery = {
      success: true,
      itemsFound: instagramEvents.length
    };
    
    console.log(`✅ Instagram Discovery: Found ${instagramEvents.length} events`);
    
    // Log sample discoveries for verification
    if (instagramEvents.length > 0) {
      console.log('   Sample discoveries:');
      instagramEvents.slice(0, 3).forEach(event => {
        console.log(`   - ${event.title} (${event.source})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Instagram Discovery failed:', error);
    results.instagramDiscovery = {
      success: false,
      itemsFound: 0,
      error: error instanceof Error ? error.message : String(error)
    };
  }

  // Test 3: Content Integration
  try {
    console.log('🔗 Testing content integration...');
    
    const integrationResults = await contentIntegrationService.runFullContentIntegration();
    
    results.contentIntegration = {
      success: true,
      eventsIntegrated: integrationResults.events,
      newsIntegrated: integrationResults.news
    };
    
    console.log(`✅ Content Integration: ${integrationResults.events} events, ${integrationResults.news} news items`);
    
  } catch (error) {
    console.error('❌ Content Integration failed:', error);
    results.contentIntegration = {
      success: false,
      eventsIntegrated: 0,
      newsIntegrated: 0,
      error: error instanceof Error ? error.message : String(error)
    };
  }

  // Test 4: Integration Statistics
  try {
    console.log('📊 Testing integration statistics...');
    
    const stats = await contentIntegrationService.getIntegrationStats();
    console.log(`📈 Stats: ${stats.totalDiscovered} discovered, ${stats.totalIntegrated} integrated`);
    
  } catch (error) {
    console.error('❌ Stats test failed:', error);
  }

  // Determine overall status
  const successCount = [
    results.rssDiscovery.success,
    results.instagramDiscovery.success,
    results.contentIntegration.success
  ].filter(Boolean).length;

  if (successCount === 3) {
    results.overallStatus = 'success';
    console.log('🎉 All content discovery tests passed!');
  } else if (successCount >= 1) {
    results.overallStatus = 'partial';
    console.log('⚠️ Partial success - some services working');
  } else {
    results.overallStatus = 'failed';
    console.log('❌ All tests failed - check configuration');
  }

  return results;
}

// Test helper functions
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    console.log('🔗 Testing Supabase connection...');
    
    const { supabase } = await import('../lib/supabase');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('auto_discovered_content')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
    
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    return false;
  }
}

export async function testDatabaseMigrations(): Promise<boolean> {
  try {
    console.log('🗄️ Testing database schema...');
    
    const { supabase } = await import('../lib/supabase');
    
    // Test that required tables exist
    const requiredTables = [
      'auto_discovered_content',
      'community_org_sources',
      'content_discovery_logs'
    ];
    
    for (const table of requiredTables) {
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.error(`❌ Table ${table} not accessible:`, error.message);
        return false;
      }
    }
    
    console.log('✅ Database schema looks good');
    return true;
    
  } catch (error) {
    console.error('❌ Database schema test failed:', error);
    return false;
  }
}

// Run all tests if called directly
if (typeof window !== 'undefined') {
  // Browser environment - can be called from console
  (window as any).testContentDiscovery = runContentDiscoveryTests;
  (window as any).testSupabaseConnection = testSupabaseConnection;
  (window as any).testDatabaseMigrations = testDatabaseMigrations;
}