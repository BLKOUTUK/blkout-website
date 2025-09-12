// Custom Hook for Federated Independence Architecture
// Provides easy integration of optional services with graceful fallback
// File: src/hooks/useFederatedModule.ts

import { useState, useEffect, useCallback } from 'react';
import { blkoutModule } from '../services/IndependentModuleCore';
import { performanceMonitor } from '../services/PerformanceMonitoring';
import { serviceDiscovery } from '../services/OptionalServiceDiscovery';

interface FederatedState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  enhanced: boolean;
  servicesUsed: string[];
  fallbacksUsed: string[];
  responseTime: number;
}

interface UseFederatedModuleOptions {
  feature: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  trackPerformance?: boolean;
}

export function useFederatedModule<T>(
  options: UseFederatedModuleOptions
): {
  state: FederatedState<T>;
  execute: (parameters: any) => Promise<void>;
  refresh: () => Promise<void>;
  isIndependent: boolean;
  serviceStatuses: Record<string, boolean>;
} {
  const [state, setState] = useState<FederatedState<T>>({
    data: null,
    loading: false,
    error: null,
    enhanced: false,
    servicesUsed: [],
    fallbacksUsed: [],
    responseTime: 0
  });

  const [serviceStatuses, setServiceStatuses] = useState<Record<string, boolean>>({});
  const [isIndependent, setIsIndependent] = useState(true);

  const execute = useCallback(async (parameters: any) => {
    const startTime = Date.now();
    
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await blkoutModule.executeFeature<T>(
        options.feature,
        parameters,
        {
          timeout: 2000,
          retries: 1,
          fallbackValue: null
        }
      );

      const responseTime = Date.now() - startTime;

      if (result.success) {
        setState({
          data: result.data || null,
          loading: false,
          error: null,
          enhanced: result.enhanced || false,
          servicesUsed: result.servicesUsed || [],
          fallbacksUsed: result.fallbacksUsed || [],
          responseTime
        });

        // Track performance if enabled
        if (options.trackPerformance) {
          performanceMonitor.trackFeatureExecution(
            options.feature,
            responseTime,
            true,
            result.enhanced || false,
            result.servicesUsed || []
          );
        }

      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: result.error || 'Feature execution failed',
          responseTime
        }));

        // Track failed execution
        if (options.trackPerformance) {
          performanceMonitor.trackFeatureExecution(
            options.feature,
            responseTime,
            false,
            false,
            []
          );
        }
      }

    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        responseTime
      }));

      // Track error
      if (options.trackPerformance) {
        performanceMonitor.trackFeatureExecution(
          options.feature,
          responseTime,
          false,
          false,
          []
        );
      }
    }
  }, [options.feature, options.trackPerformance]);

  const refresh = useCallback(() => execute({}), [execute]);

  const checkServiceStatuses = useCallback(async () => {
    try {
      const services = serviceDiscovery.getAllServices();
      const statuses: Record<string, boolean> = {};
      
      for (const service of services) {
        statuses[service.name] = await serviceDiscovery.isServiceAvailable(service.name);
      }
      
      setServiceStatuses(statuses);
      
      // Determine if we're running independently
      const anyServiceAvailable = Object.values(statuses).some(status => status);
      setIsIndependent(!anyServiceAvailable);
      
    } catch (error) {
      console.error('Failed to check service statuses:', error);
      setIsIndependent(true); // Default to independent mode
    }
  }, []);

  useEffect(() => {
    // Initial service status check
    checkServiceStatuses();
    
    // Set up auto-refresh if enabled
    if (options.autoRefresh) {
      const interval = setInterval(() => {
        checkServiceStatuses();
        refresh();
      }, options.refreshInterval || 30000);

      return () => clearInterval(interval);
    }
  }, [options.autoRefresh, options.refreshInterval, refresh, checkServiceStatuses]);

  return {
    state,
    execute,
    refresh,
    isIndependent,
    serviceStatuses
  };
}

export function useServiceHealth() {
  const [services, setServices] = useState<any[]>([]);
  const [overallHealth, setOverallHealth] = useState(0);
  const [loading, setLoading] = useState(true);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    try {
      const allServices = serviceDiscovery.getAllServices();
      const healthResults = await Promise.all(
        allServices.map(async (service) => {
          try {
            const isAvailable = await serviceDiscovery.isServiceAvailable(service.name);
            const health = serviceDiscovery.getServiceHealth(service.name);
            const circuitBreakerState = serviceDiscovery.getCircuitBreakerState(service.name);
            
            return {
              name: service.name,
              available: isAvailable,
              responseTime: health?.responseTime || null,
              status: health?.status || 'unknown',
              circuitBreakerState,
              capabilities: service.capabilities,
              lastChecked: health?.lastChecked || new Date()
            };
          } catch (error) {
            return {
              name: service.name,
              available: false,
              error: error instanceof Error ? error.message : 'Unknown error',
              circuitBreakerState: 'unknown',
              capabilities: service.capabilities,
              lastChecked: new Date()
            };
          }
        })
      );

      setServices(healthResults);
      
      // Calculate overall health score
      const availableServices = healthResults.filter(s => s.available).length;
      const healthScore = availableServices / healthResults.length;
      setOverallHealth(healthScore);
      
    } catch (error) {
      console.error('Health check failed:', error);
      setServices([]);
      setOverallHealth(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  return {
    services,
    overallHealth,
    loading,
    refresh: checkHealth
  };
}

export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadMetrics = useCallback(() => {
    try {
      const currentMetrics = performanceMonitor.getCurrentMetrics();
      setMetrics(currentMetrics);
    } catch (error) {
      console.error('Failed to load performance metrics:', error);
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const runPerformanceTest = useCallback(async () => {
    setLoading(true);
    try {
      const testResults = await performanceMonitor.runPerformanceTest();
      return testResults;
    } catch (error) {
      console.error('Performance test failed:', error);
      throw error;
    } finally {
      setLoading(false);
      loadMetrics();
    }
  }, [loadMetrics]);

  useEffect(() => {
    loadMetrics();
    
    // Refresh metrics every 10 seconds
    const interval = setInterval(loadMetrics, 10000);
    return () => clearInterval(interval);
  }, [loadMetrics]);

  return {
    metrics,
    loading,
    refresh: loadMetrics,
    runPerformanceTest
  };
}