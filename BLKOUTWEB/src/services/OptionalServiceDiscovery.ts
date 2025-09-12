// Optional Service Discovery with Circuit Breaker Pattern
// Enables federated independence - modules work alone, enhance when connected
// File: src/services/OptionalServiceDiscovery.ts

interface ServiceInfo {
  name: string;
  baseUrl: string;
  healthEndpoint: string;
  capabilities: string[];
  version: string;
  timeout: number;
}

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastChecked: Date;
  responseTime: number;
  capabilities: string[];
  uptime?: number;
}

class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime?: Date;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private failureThreshold = 3,
    private recoveryTimeoutMs = 30000
  ) {}

  isOpen(): boolean {
    if (this.state === 'open') {
      // Check if recovery timeout has passed
      const now = new Date();
      const timeSinceFailure = this.lastFailureTime 
        ? now.getTime() - this.lastFailureTime.getTime()
        : 0;
        
      if (timeSinceFailure >= this.recoveryTimeoutMs) {
        this.state = 'half-open';
        return false;
      }
      return true;
    }
    return false;
  }

  recordSuccess(): void {
    this.failureCount = 0;
    this.state = 'closed';
  }

  recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = new Date();
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'open';
    }
  }

  getState(): string {
    return this.state;
  }
}

export class OptionalServiceDiscovery {
  private knownServices = new Map<string, ServiceInfo>();
  private healthCache = new Map<string, HealthStatus>();
  private circuitBreakers = new Map<string, CircuitBreaker>();

  constructor() {
    // Register known BLKOUT ecosystem services
    this.registerKnownServices();
  }

  private registerKnownServices(): void {
    // IVOR AI Assistant
    this.registerService('IVOR', {
      name: 'IVOR',
      baseUrl: 'https://ivor-api.blkout.uk',
      healthEndpoint: '/health',
      capabilities: ['wisdom', 'governance_insights', 'community_guidance'],
      version: '1.0.0',
      timeout: 2000
    });

    // Events Calendar
    this.registerService('EventsCalendar', {
      name: 'EventsCalendar', 
      baseUrl: 'https://events.blkout.uk',
      healthEndpoint: '/api/health',
      capabilities: ['events', 'calendar', 'event_context'],
      version: '1.0.0',
      timeout: 1500
    });

    // BLKOUTHUB Mobile
    this.registerService('BLKOUTHUB', {
      name: 'BLKOUTHUB',
      baseUrl: 'https://hub.blkout.uk',
      healthEndpoint: '/api/v1/health',
      capabilities: ['member_data', 'mobile_sync', 'notifications'],
      version: '1.0.0',
      timeout: 2000
    });

    // Liberation Journey (future)
    this.registerService('LiberationJourney', {
      name: 'LiberationJourney',
      baseUrl: 'https://journey.blkout.uk',
      healthEndpoint: '/health',
      capabilities: ['journey_tracking', 'personal_growth', 'community_support'],
      version: '1.0.0',
      timeout: 2000
    });
  }

  registerService(serviceName: string, serviceInfo: ServiceInfo): void {
    this.knownServices.set(serviceName, serviceInfo);
    this.circuitBreakers.set(serviceName, new CircuitBreaker(
      3, // failure threshold
      30000 // 30s recovery timeout
    ));
  }

  async discoverAvailableServices(timeoutMs = 2000): Promise<ServiceInfo[]> {
    const availableServices: ServiceInfo[] = [];
    const promises: Promise<void>[] = [];

    for (const [serviceName, serviceInfo] of this.knownServices) {
      const circuitBreaker = this.circuitBreakers.get(serviceName)!;
      
      // Skip if circuit breaker is open
      if (circuitBreaker.isOpen()) {
        console.log(`Service ${serviceName} circuit breaker is open, skipping`);
        continue;
      }

      const promise = this.checkServiceHealth(serviceName, timeoutMs)
        .then(health => {
          if (health && health.status === 'healthy') {
            availableServices.push(serviceInfo);
            circuitBreaker.recordSuccess();
          }
        })
        .catch(error => {
          console.log(`Service ${serviceName} health check failed:`, error.message);
          circuitBreaker.recordFailure();
        });

      promises.push(promise);
    }

    // Wait for all health checks to complete (or timeout)
    await Promise.allSettled(promises);
    
    return availableServices;
  }

  async checkServiceHealth(serviceName: string, timeoutMs = 2000): Promise<HealthStatus | null> {
    const serviceInfo = this.knownServices.get(serviceName);
    if (!serviceInfo) {
      throw new Error(`Unknown service: ${serviceName}`);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      const startTime = Date.now();
      const response = await fetch(
        `${serviceInfo.baseUrl}${serviceInfo.healthEndpoint}`,
        {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'BLKOUTNXT-Platform/1.0.0'
          }
        }
      );

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const healthData = await response.json();
      const health: HealthStatus = {
        status: healthData.status || 'healthy',
        lastChecked: new Date(),
        responseTime,
        capabilities: healthData.capabilities || serviceInfo.capabilities,
        uptime: healthData.uptime
      };

      this.healthCache.set(serviceName, health);
      return health;

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Health check timeout for ${serviceName}`);
      }
      
      throw error;
    }
  }

  getServiceHealth(serviceName: string): HealthStatus | null {
    return this.healthCache.get(serviceName) || null;
  }

  getCircuitBreakerState(serviceName: string): string {
    const breaker = this.circuitBreakers.get(serviceName);
    return breaker ? breaker.getState() : 'unknown';
  }

  async isServiceAvailable(serviceName: string): Promise<boolean> {
    const circuitBreaker = this.circuitBreakers.get(serviceName);
    if (!circuitBreaker || circuitBreaker.isOpen()) {
      return false;
    }

    try {
      const health = await this.checkServiceHealth(serviceName, 1000);
      return health?.status === 'healthy';
    } catch {
      return false;
    }
  }

  getServiceInfo(serviceName: string): ServiceInfo | undefined {
    return this.knownServices.get(serviceName);
  }

  getAllServices(): ServiceInfo[] {
    return Array.from(this.knownServices.values());
  }

  // Clear cache for testing or forced refresh
  clearHealthCache(): void {
    this.healthCache.clear();
  }

  // Reset circuit breakers (useful for recovery scenarios)
  resetCircuitBreakers(): void {
    for (const breaker of this.circuitBreakers.values()) {
      breaker.recordSuccess();
    }
  }
}

// Export singleton instance
export const serviceDiscovery = new OptionalServiceDiscovery();