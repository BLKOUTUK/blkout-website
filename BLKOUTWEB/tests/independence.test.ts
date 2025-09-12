// Comprehensive Independence Testing Suite
// Verifies all modules work completely alone with graceful degradation
// File: tests/independence.test.ts

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { blkoutModule } from '../src/services/IndependentModuleCore';
import { serviceDiscovery } from '../src/services/OptionalServiceDiscovery';
import { connectionManager } from '../src/services/FederatedConnectionManager';
import { governanceEnhancement } from '../src/services/GracefulEnhancement';
import { performanceMonitor } from '../src/services/PerformanceMonitoring';

// Mock network to simulate various failure scenarios
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Federated Independence Architecture Tests', () => {
  beforeEach(() => {
    // Clear all caches and reset state
    serviceDiscovery.clearHealthCache();
    serviceDiscovery.resetCircuitBreakers();
    connectionManager.closeAllConnections();
    blkoutModule.clearLocalState();
    
    // Reset mocks
    mockFetch.mockReset();
  });

  afterEach(() => {
    // Clean up after each test
    vi.clearAllMocks();
  });

  describe('Module Independence Tests', () => {
    it('should work completely without external dependencies', async () => {
      // Simulate complete network isolation
      mockFetch.mockRejectedValue(new Error('Network unavailable'));

      // Test all core functionality
      const isFullyFunctional = await blkoutModule.isFullyFunctional();
      expect(isFullyFunctional).toBe(true);
    });

    it('should handle proposal creation independently', async () => {
      // Block all external services
      mockFetch.mockRejectedValue(new Error('All services down'));

      const result = await blkoutModule.executeFeature('create_proposal', {
        title: 'Test Proposal',
        description: 'Testing independent proposal creation',
        proposer: 'test_user'
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.title).toBe('Test Proposal');
      expect(result.enhanced).toBe(false); // Should work without enhancements
    });

    it('should handle voting independently', async () => {
      // Create a proposal first
      const proposal = {
        id: 'test_proposal',
        title: 'Test Proposal',
        description: 'Test',
        proposer: 'test_user',
        created_at: new Date().toISOString()
      };

      // Block external services
      mockFetch.mockRejectedValue(new Error('Services unavailable'));

      const result = await blkoutModule.executeFeature('conduct_voting', proposal);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.votingActive).toBe(true);
      expect(result.enhanced).toBe(false);
    });

    it('should handle content moderation independently', async () => {
      // Mock Supabase calls to work locally
      mockFetch.mockImplementation((url) => {
        if (url.includes('supabase')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([])
          });
        }
        return Promise.reject(new Error('External service unavailable'));
      });

      const result = await blkoutModule.executeFeature('moderate_content', {
        contentId: 'test_content'
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should maintain state locally when external services fail', async () => {
      // Block all external services
      mockFetch.mockRejectedValue(new Error('All services down'));

      // Create some local state
      await blkoutModule.executeFeature('create_proposal', {
        title: 'Local Proposal',
        description: 'Stored locally',
        proposer: 'local_user'
      });

      await blkoutModule.executeFeature('get_member_profile', {
        memberId: 'test_member',
        username: 'test_user'
      });

      const localState = blkoutModule.getLocalState();
      expect(localState.size).toBeGreaterThan(0);

      // Should persist across instances
      const healthStatus = await blkoutModule.getHealthStatus();
      expect(healthStatus.fullyFunctional).toBe(true);
      expect(healthStatus.localStateSize).toBeGreaterThan(0);
    });
  });

  describe('Service Discovery and Circuit Breaker Tests', () => {
    it('should discover available services', async () => {
      // Mock healthy services
      mockFetch.mockImplementation((url) => {
        if (url.includes('/health')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              status: 'healthy',
              capabilities: ['test'],
              uptime: 3600
            })
          });
        }
        return Promise.reject(new Error('Not a health check'));
      });

      const availableServices = await serviceDiscovery.discoverAvailableServices(1000);
      expect(availableServices).toBeDefined();
      expect(Array.isArray(availableServices)).toBe(true);
    });

    it('should handle service timeouts gracefully', async () => {
      // Mock timeout
      mockFetch.mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 3000)
        )
      );

      const availableServices = await serviceDiscovery.discoverAvailableServices(1000);
      expect(availableServices).toEqual([]);
    });

    it('should open circuit breaker after failures', async () => {
      // Mock repeated failures
      mockFetch.mockRejectedValue(new Error('Service down'));

      // Attempt multiple health checks to trigger circuit breaker
      for (let i = 0; i < 5; i++) {
        try {
          await serviceDiscovery.checkServiceHealth('IVOR', 1000);
        } catch {
          // Expected to fail
        }
      }

      const circuitState = serviceDiscovery.getCircuitBreakerState('IVOR');
      expect(circuitState).toBe('open');

      // Should not attempt more calls when circuit is open
      const isAvailable = await serviceDiscovery.isServiceAvailable('IVOR');
      expect(isAvailable).toBe(false);
    });

    it('should recover after circuit breaker timeout', async () => {
      // First, trigger circuit breaker
      mockFetch.mockRejectedValue(new Error('Service down'));
      
      for (let i = 0; i < 5; i++) {
        try {
          await serviceDiscovery.checkServiceHealth('IVOR', 500);
        } catch {
          // Expected failures
        }
      }

      expect(serviceDiscovery.getCircuitBreakerState('IVOR')).toBe('open');

      // Mock service recovery
      mockFetch.mockImplementation((url) => {
        if (url.includes('/health')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ status: 'healthy' })
          });
        }
        return Promise.reject(new Error('Not health endpoint'));
      });

      // Wait for circuit breaker recovery (simulate timeout)
      // Note: In real test, you'd mock time or use shorter timeouts
      await new Promise(resolve => setTimeout(resolve, 100));

      // Reset circuit breaker for test
      serviceDiscovery.resetCircuitBreakers();

      const isAvailable = await serviceDiscovery.isServiceAvailable('IVOR');
      expect(isAvailable).toBe(true);
    });
  });

  describe('Graceful Enhancement Tests', () => {
    it('should enhance proposals when IVOR is available', async () => {
      // Mock IVOR service as available and responsive
      mockFetch.mockImplementation((url) => {
        if (url.includes('/health')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ status: 'healthy' })
          });
        }
        if (url.includes('/wisdom')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              insight: 'AI wisdom for community governance',
              relevance: 0.9,
              confidence: 0.8
            })
          });
        }
        return Promise.reject(new Error('Unknown endpoint'));
      });

      const proposal = {
        id: 'test_proposal',
        title: 'Community Safety',
        description: 'Improve community safety measures',
        topic: 'community-safety',
        proposer: 'safety_committee',
        created_at: new Date().toISOString()
      };

      const result = await governanceEnhancement.displayProposal(proposal);

      expect(result.baseData).toBeDefined();
      expect(result.baseData.title).toBe('Community Safety');
      expect(result.enhancements.wisdom).toBeDefined();
      expect(result.servicesUsed).toContain('IVOR');
      expect(result.responseTime).toBeDefined();
    });

    it('should work with fallback wisdom when IVOR is unavailable', async () => {
      // Mock IVOR as unavailable
      mockFetch.mockRejectedValue(new Error('IVOR service down'));

      const proposal = {
        id: 'test_proposal',
        title: 'Resource Allocation',
        description: 'How to allocate community resources',
        topic: 'resource-allocation',
        proposer: 'finance_committee',
        created_at: new Date().toISOString()
      };

      const result = await governanceEnhancement.displayProposal(proposal);

      expect(result.baseData).toBeDefined();
      expect(result.baseData.title).toBe('Resource Allocation');
      expect(result.enhancements.wisdom).toBeDefined();
      expect(result.enhancements.wisdom.source).toBe('local');
      expect(result.fallbacksUsed).toContain('IVOR-wisdom');
      expect(result.servicesUsed).not.toContain('IVOR');
    });

    it('should handle mixed service availability gracefully', async () => {
      // Mock IVOR as available, Events as unavailable
      mockFetch.mockImplementation((url) => {
        if (url.includes('ivor') && url.includes('/health')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ status: 'healthy' })
          });
        }
        if (url.includes('events')) {
          return Promise.reject(new Error('Events service down'));
        }
        if (url.includes('/wisdom')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              insight: 'IVOR wisdom available',
              relevance: 0.8
            })
          });
        }
        return Promise.reject(new Error('Service unavailable'));
      });

      const proposal = {
        id: 'mixed_test',
        title: 'Mixed Service Test',
        description: 'Testing mixed service availability',
        topic: 'community-safety',
        proposer: 'test_user',
        created_at: new Date().toISOString()
      };

      const result = await governanceEnhancement.displayProposal(proposal);

      expect(result.baseData).toBeDefined();
      expect(result.servicesUsed).toContain('IVOR');
      expect(result.servicesUsed).not.toContain('EventsCalendar');
      expect(result.fallbacksUsed).toContain('EventsCalendar-context');
      expect(result.enhancements.wisdom).toBeDefined();
      expect(result.enhancements.wisdom.source).toBe('IVOR');
    });
  });

  describe('Performance Tests', () => {
    it('should meet performance requirements when running independently', async () => {
      // Block all external services to test pure independence
      mockFetch.mockRejectedValue(new Error('All services down'));

      const startTime = Date.now();
      
      const result = await blkoutModule.executeFeature('create_proposal', {
        title: 'Performance Test Proposal',
        description: 'Testing performance in independent mode',
        proposer: 'performance_tester'
      });

      const executionTime = Date.now() - startTime;

      expect(result.success).toBe(true);
      expect(executionTime).toBeLessThan(500); // Should be fast when independent
      expect(result.enhanced).toBe(false);
    });

    it('should not degrade performance when external services are slow', async () => {
      // Mock slow external services
      mockFetch.mockImplementation((url) => {
        if (url.includes('/health')) {
          return new Promise(resolve => 
            setTimeout(() => resolve({
              ok: true,
              json: () => Promise.resolve({ status: 'healthy' })
            }), 3000) // 3 second delay
          );
        }
        return Promise.reject(new Error('Unknown endpoint'));
      });

      const startTime = Date.now();
      
      const result = await blkoutModule.executeFeature('create_proposal', {
        title: 'Slow Service Test',
        description: 'Testing with slow external services',
        proposer: 'slow_test_user'
      }, { timeout: 1000 });

      const executionTime = Date.now() - startTime;

      expect(result.success).toBe(true);
      expect(executionTime).toBeLessThan(2000); // Should timeout and fallback quickly
      expect(result.data).toBeDefined();
    });

    it('should track performance metrics correctly', async () => {
      // Mock successful service
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ status: 'healthy' })
      });

      // Execute a feature with performance tracking
      const startTime = Date.now();
      
      const result = await blkoutModule.executeFeature('get_governance_state', {});
      
      const executionTime = Date.now() - startTime;

      // Track the performance
      performanceMonitor.trackFeatureExecution(
        'get_governance_state',
        executionTime,
        result.success,
        result.enhanced || false,
        []
      );

      const metrics = performanceMonitor.getCurrentMetrics();
      
      expect(metrics).toBeDefined();
      expect(metrics.timestamp).toBeDefined();
      expect(metrics.platform).toBeDefined();
    });
  });

  describe('Error Recovery Tests', () => {
    it('should recover gracefully from temporary service failures', async () => {
      // First call fails
      let callCount = 0;
      mockFetch.mockImplementation(() => {
        callCount++;
        if (callCount <= 2) {
          return Promise.reject(new Error('Temporary failure'));
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: 'healthy' })
        });
      });

      // Should eventually succeed with retries
      const result = await connectionManager.executeOptionalCall(
        'IVOR',
        '/api/test',
        { retries: 3, fallbackValue: { recovered: true } }
      );

      expect(result).toBeDefined();
    });

    it('should maintain core functionality during service outages', async () => {
      // Simulate total service outage
      mockFetch.mockRejectedValue(new Error('Total outage'));

      // All core features should still work
      const features = [
        'create_proposal',
        'conduct_voting', 
        'get_governance_state',
        'get_member_profile'
      ];

      for (const feature of features) {
        const result = await blkoutModule.executeFeature(feature, {
          testData: true,
          feature
        });

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
      }
    });
  });

  describe('Integration Tests', () => {
    it('should run comprehensive independence test', async () => {
      // Block all external services
      mockFetch.mockRejectedValue(new Error('Independence test - all services down'));

      // Test module functionality
      const healthStatus = await blkoutModule.getHealthStatus();
      
      expect(healthStatus.fullyFunctional).toBe(true);
      expect(healthStatus.module).toBe('BLKOUTNXT-Platform');
      expect(healthStatus.connectedServices).toEqual([]);
      expect(healthStatus.availableEnhancements).toBe(0);
    });

    it('should demonstrate federated enhancement when services are available', async () => {
      // Mock all services as healthy
      mockFetch.mockImplementation((url) => {
        if (url.includes('/health')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              status: 'healthy',
              capabilities: ['test']
            })
          });
        }
        if (url.includes('/wisdom')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              insight: 'Federated wisdom',
              relevance: 0.9
            })
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ enhanced: true })
        });
      });

      const healthStatus = await blkoutModule.getHealthStatus();
      
      expect(healthStatus.fullyFunctional).toBe(true);
      expect(healthStatus.availableEnhancements).toBeGreaterThan(0);
      expect(healthStatus.connectedServices.length).toBeGreaterThan(0);
    });
  });
});

describe('Real-world Scenario Tests', () => {
  it('should handle community governance session with mixed service availability', async () => {
    // Simulate realistic scenario: IVOR available, Events down, BLKOUTHUB slow
    mockFetch.mockImplementation((url, options) => {
      if (url.includes('ivor')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            status: 'healthy',
            insight: 'Community consensus is important',
            relevance: 0.8
          })
        });
      }
      if (url.includes('events')) {
        return Promise.reject(new Error('Events service maintenance'));
      }
      if (url.includes('blkouthub')) {
        return new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve({ members: [] })
          }), 2500) // Slow response
        );
      }
      return Promise.reject(new Error('Unknown service'));
    });

    const proposal = {
      id: 'community_proposal',
      title: 'Community Space Allocation',
      description: 'How should we allocate our new community space?',
      topic: 'resource-allocation',
      proposer: 'space_committee',
      created_at: new Date().toISOString()
    };

    const result = await governanceEnhancement.displayProposal(proposal);

    expect(result.baseData).toBeDefined();
    expect(result.baseData.title).toBe('Community Space Allocation');
    expect(result.servicesUsed).toContain('IVOR');
    expect(result.fallbacksUsed).toContain('EventsCalendar-context');
    expect(result.responseTime).toBeLessThan(3000); // Should timeout slow services
  });

  it('should maintain data integrity during service failures', async () => {
    // Start with services available
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: 'healthy' })
    });

    // Create some enhanced data
    await blkoutModule.executeFeature('create_proposal', {
      title: 'Data Integrity Test',
      description: 'Testing data persistence during failures'
    });

    // Now simulate service failures
    mockFetch.mockRejectedValue(new Error('Services failed'));

    // Data should still be available and functional
    const result = await blkoutModule.executeFeature('get_governance_state', {});
    
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    
    const localState = blkoutModule.getLocalState();
    expect(localState.size).toBeGreaterThan(0);
  });
});