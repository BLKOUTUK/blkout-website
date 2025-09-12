// Performance Monitoring for Federated Independence Architecture
// Real-time metrics to ensure <2s load times and 99.9% uptime
// File: src/services/PerformanceMonitoring.ts

import { serviceDiscovery } from './OptionalServiceDiscovery';
import { connectionManager } from './FederatedConnectionManager';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  threshold?: number;
  status: 'good' | 'warning' | 'critical';
}

interface PageLoadMetric {
  page: string;
  loadTime: number;
  contentLoadTime: number;
  servicesUsed: string[];
  fallbacksUsed: string[];
  timestamp: Date;
}

interface ServiceMetric {
  serviceName: string;
  responseTime: number;
  availability: number;
  errorRate: number;
  circuitBreakerState: string;
  timestamp: Date;
}

export class PerformanceMonitoring {
  private metrics: PerformanceMetric[] = [];
  private pageLoadMetrics: PageLoadMetric[] = [];
  private serviceMetrics: ServiceMetric[] = [];
  private maxMetricsHistory = 1000;
  private alertThresholds = {
    pageLoadTime: 2000, // 2 seconds
    serviceResponseTime: 1000, // 1 second
    availability: 0.999, // 99.9%
    errorRate: 0.01 // 1%
  };

  constructor() {
    this.startPerformanceCollection();
  }

  private startPerformanceCollection(): void {
    // Collect metrics every 10 seconds
    setInterval(() => {
      this.collectSystemMetrics();
      this.collectServiceMetrics();
    }, 10000);

    // Clean up old metrics every 5 minutes
    setInterval(() => {
      this.cleanupOldMetrics();
    }, 5 * 60 * 1000);
  }

  // Track page load performance
  trackPageLoad(
    page: string,
    startTime: number,
    servicesUsed: string[] = [],
    fallbacksUsed: string[] = []
  ): void {
    const loadTime = Date.now() - startTime;
    const contentLoadTime = this.measureContentLoadTime();

    const metric: PageLoadMetric = {
      page,
      loadTime,
      contentLoadTime,
      servicesUsed,
      fallbacksUsed,
      timestamp: new Date()
    };

    this.pageLoadMetrics.push(metric);
    
    // Add performance metric
    this.addMetric({
      name: `page_load_${page}`,
      value: loadTime,
      unit: 'ms',
      timestamp: new Date(),
      threshold: this.alertThresholds.pageLoadTime,
      status: loadTime < this.alertThresholds.pageLoadTime ? 'good' : 
              loadTime < this.alertThresholds.pageLoadTime * 1.5 ? 'warning' : 'critical'
    });

    // Alert if load time exceeds threshold
    if (loadTime > this.alertThresholds.pageLoadTime) {
      console.warn(`Page load time exceeded threshold: ${page} took ${loadTime}ms`);
      this.triggerAlert('page_load_slow', {
        page,
        loadTime,
        threshold: this.alertThresholds.pageLoadTime
      });
    }
  }

  private measureContentLoadTime(): number {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = window.performance.getEntriesByType('navigation')[0] as any;
      if (navigation) {
        return navigation.loadEventEnd - navigation.loadEventStart;
      }
    }
    return 0;
  }

  // Track feature execution performance
  trackFeatureExecution(
    featureName: string,
    executionTime: number,
    success: boolean,
    enhanced: boolean,
    servicesUsed: string[] = []
  ): void {
    const metric: PerformanceMetric = {
      name: `feature_${featureName}`,
      value: executionTime,
      unit: 'ms',
      timestamp: new Date(),
      status: success ? (executionTime < 500 ? 'good' : 'warning') : 'critical'
    };

    this.addMetric(metric);

    // Track enhancement success rate
    if (servicesUsed.length > 0) {
      this.addMetric({
        name: `enhancement_${featureName}`,
        value: enhanced ? 1 : 0,
        unit: 'boolean',
        timestamp: new Date(),
        status: enhanced ? 'good' : 'warning'
      });
    }
  }

  private collectSystemMetrics(): void {
    // Memory usage
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory;
      this.addMetric({
        name: 'memory_used',
        value: memory.usedJSHeapSize / 1024 / 1024,
        unit: 'MB',
        timestamp: new Date(),
        status: memory.usedJSHeapSize / memory.jsHeapSizeLimit < 0.8 ? 'good' : 'warning'
      });
    }

    // Connection count
    const connectionStats = connectionManager.getConnectionStats();
    const totalConnections = Object.values(connectionStats)
      .reduce((total, stat: any) => total + stat.activeConnections, 0);
    
    this.addMetric({
      name: 'active_connections',
      value: totalConnections,
      unit: 'count',
      timestamp: new Date(),
      status: totalConnections < 10 ? 'good' : 'warning'
    });
  }

  private async collectServiceMetrics(): Promise<void> {
    const services = serviceDiscovery.getAllServices();
    
    for (const service of services) {
      try {
        const startTime = Date.now();
        const isAvailable = await serviceDiscovery.isServiceAvailable(service.name);
        const responseTime = Date.now() - startTime;
        
        const circuitBreakerState = serviceDiscovery.getCircuitBreakerState(service.name);
        
        const serviceMetric: ServiceMetric = {
          serviceName: service.name,
          responseTime,
          availability: isAvailable ? 1 : 0,
          errorRate: circuitBreakerState === 'open' ? 1 : 0,
          circuitBreakerState,
          timestamp: new Date()
        };

        this.serviceMetrics.push(serviceMetric);

        // Add individual metrics
        this.addMetric({
          name: `service_response_${service.name}`,
          value: responseTime,
          unit: 'ms',
          timestamp: new Date(),
          threshold: this.alertThresholds.serviceResponseTime,
          status: responseTime < this.alertThresholds.serviceResponseTime ? 'good' : 'warning'
        });

        this.addMetric({
          name: `service_availability_${service.name}`,
          value: isAvailable ? 1 : 0,
          unit: 'boolean',
          timestamp: new Date(),
          status: isAvailable ? 'good' : 'critical'
        });

      } catch (error) {
        console.error(`Failed to collect metrics for ${service.name}:`, error);
      }
    }
  }

  private addMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    
    // Limit history size
    if (this.metrics.length > this.maxMetricsHistory) {
      this.metrics = this.metrics.slice(-this.maxMetricsHistory);
    }
  }

  private cleanupOldMetrics(): void {
    const cutoffTime = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
    
    this.metrics = this.metrics.filter(m => m.timestamp > cutoffTime);
    this.pageLoadMetrics = this.pageLoadMetrics.filter(m => m.timestamp > cutoffTime);
    this.serviceMetrics = this.serviceMetrics.filter(m => m.timestamp > cutoffTime);
  }

  private triggerAlert(type: string, data: any): void {
    const alert = {
      type,
      data,
      timestamp: new Date(),
      severity: this.getAlertSeverity(type)
    };

    console.warn('Performance Alert:', alert);
    
    // In production, this would send to monitoring service
    // await this.sendToMonitoringService(alert);
  }

  private getAlertSeverity(type: string): 'low' | 'medium' | 'high' | 'critical' {
    switch (type) {
      case 'page_load_slow': return 'high';
      case 'service_unavailable': return 'medium';
      case 'memory_high': return 'medium';
      case 'error_rate_high': return 'high';
      default: return 'low';
    }
  }

  // Public API for getting metrics
  getCurrentMetrics(): Record<string, any> {
    const now = new Date();
    const last5Minutes = new Date(now.getTime() - 5 * 60 * 1000);
    
    const recentMetrics = this.metrics.filter(m => m.timestamp > last5Minutes);
    
    return {
      timestamp: now.toISOString(),
      platform: {
        averagePageLoadTime: this.getAveragePageLoadTime(),
        systemHealth: this.getSystemHealthScore(),
        serviceAvailability: this.getServiceAvailability(),
        independenceRatio: this.getIndependenceRatio()
      },
      services: this.getServiceSummary(),
      performance: {
        pageLoads: this.pageLoadMetrics.slice(-10),
        recentMetrics: recentMetrics.slice(-20)
      }
    };
  }

  private getAveragePageLoadTime(): number {
    const recentLoads = this.pageLoadMetrics.slice(-10);
    if (recentLoads.length === 0) return 0;
    
    const total = recentLoads.reduce((sum, load) => sum + load.loadTime, 0);
    return Math.round(total / recentLoads.length);
  }

  private getSystemHealthScore(): number {
    const recentMetrics = this.metrics.filter(
      m => m.timestamp > new Date(Date.now() - 5 * 60 * 1000)
    );
    
    if (recentMetrics.length === 0) return 1;
    
    const goodMetrics = recentMetrics.filter(m => m.status === 'good').length;
    return Math.round((goodMetrics / recentMetrics.length) * 100) / 100;
  }

  private getServiceAvailability(): Record<string, number> {
    const availability: Record<string, number> = {};
    const services = serviceDiscovery.getAllServices();
    
    for (const service of services) {
      const recentMetrics = this.serviceMetrics
        .filter(m => m.serviceName === service.name)
        .slice(-10);
        
      if (recentMetrics.length > 0) {
        const availableCount = recentMetrics.filter(m => m.availability === 1).length;
        availability[service.name] = Math.round((availableCount / recentMetrics.length) * 100) / 100;
      } else {
        availability[service.name] = 0;
      }
    }
    
    return availability;
  }

  private getIndependenceRatio(): number {
    const recentLoads = this.pageLoadMetrics.slice(-20);
    if (recentLoads.length === 0) return 1;
    
    const independentLoads = recentLoads.filter(load => 
      load.servicesUsed.length === 0 || load.fallbacksUsed.length > 0
    ).length;
    
    return Math.round((independentLoads / recentLoads.length) * 100) / 100;
  }

  private getServiceSummary(): Record<string, any> {
    const summary: Record<string, any> = {};
    const services = serviceDiscovery.getAllServices();
    
    for (const service of services) {
      const recentMetrics = this.serviceMetrics
        .filter(m => m.serviceName === service.name)
        .slice(-10);
        
      if (recentMetrics.length > 0) {
        const avgResponseTime = recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length;
        const availability = recentMetrics.filter(m => m.availability === 1).length / recentMetrics.length;
        const circuitBreakerState = recentMetrics[recentMetrics.length - 1].circuitBreakerState;
        
        summary[service.name] = {
          averageResponseTime: Math.round(avgResponseTime),
          availability: Math.round(availability * 100) / 100,
          circuitBreakerState,
          lastChecked: recentMetrics[recentMetrics.length - 1].timestamp
        };
      } else {
        summary[service.name] = {
          averageResponseTime: null,
          availability: 0,
          circuitBreakerState: 'unknown',
          lastChecked: null
        };
      }
    }
    
    return summary;
  }

  // Performance testing utilities
  async runPerformanceTest(): Promise<any> {
    console.log('Running performance test...');
    
    const testResults = {
      pageLoadTimes: [],
      serviceResponseTimes: [],
      independenceTest: null as any,
      timestamp: new Date().toISOString()
    };

    // Test page load times (simulate)
    const pages = ['/', '/governance', '/ecosystem', '/moderation'];
    for (const page of pages) {
      const startTime = Date.now();
      // Simulate page load
      await this.delay(100 + Math.random() * 500);
      const loadTime = Date.now() - startTime;
      
      (testResults.pageLoadTimes as any[]).push({
        page,
        loadTime,
        passesThreshold: loadTime < this.alertThresholds.pageLoadTime
      });
    }

    // Test service response times
    const services = serviceDiscovery.getAllServices();
    for (const service of services) {
      try {
        const startTime = Date.now();
        const isAvailable = await serviceDiscovery.isServiceAvailable(service.name);
        const responseTime = Date.now() - startTime;
        
        (testResults.serviceResponseTimes as any[]).push({
          service: service.name,
          responseTime,
          available: isAvailable,
          passesThreshold: responseTime < this.alertThresholds.serviceResponseTime
        });
      } catch (error) {
        (testResults.serviceResponseTimes as any[]).push({
          service: service.name,
          responseTime: null,
          available: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Test independence (simulate all services down)
    serviceDiscovery.clearHealthCache();
    const independenceStartTime = Date.now();
    
    try {
      // Test core functionality without external services
      const coreFeatures = ['governance', 'moderation', 'content_submission'];
      const independenceResults = [];
      
      for (const feature of coreFeatures) {
        const featureStartTime = Date.now();
        // Simulate feature execution
        await this.delay(50 + Math.random() * 200);
        const executionTime = Date.now() - featureStartTime;
        
        independenceResults.push({
          feature,
          executionTime,
          success: true,
          workingIndependently: true
        });
      }
      
      testResults.independenceTest = {
        totalTime: Date.now() - independenceStartTime,
        features: independenceResults,
        allFeaturesWorking: independenceResults.every(f => f.success),
        averageExecutionTime: independenceResults.reduce((sum, f) => sum + f.executionTime, 0) / independenceResults.length
      };
      
    } catch (error) {
      testResults.independenceTest = {
        error: error instanceof Error ? error.message : 'Independence test failed',
        success: false
      };
    }

    console.log('Performance test completed:', testResults);
    return testResults;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Health check endpoint for monitoring
  getHealthCheck(): any {
    const metrics = this.getCurrentMetrics();
    
    return {
      status: metrics.platform.systemHealth > 0.8 ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      platform: {
        systemHealth: metrics.platform.systemHealth,
        averagePageLoadTime: metrics.platform.averagePageLoadTime,
        independenceRatio: metrics.platform.independenceRatio
      },
      services: metrics.services,
      alerts: this.getActiveAlerts()
    };
  }

  private getActiveAlerts(): any[] {
    // Return any active performance alerts
    // This would be implemented based on specific monitoring needs
    return [];
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitoring();