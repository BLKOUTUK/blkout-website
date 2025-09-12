// Federated Connection Manager for Resilient API Connections
// Manages optional connections to other BLKOUT ecosystem services
// File: src/services/FederatedConnectionManager.ts

import { serviceDiscovery } from './OptionalServiceDiscovery';

interface Connection {
  serviceName: string;
  baseUrl: string;
  isHealthy: boolean;
  lastUsed: Date;
  responseTime: number;
}

interface ConnectionPool {
  connections: Map<string, Connection>;
  maxConnections: number;
  lastCleanup: Date;
}

export interface FederatedCallOptions {
  timeout?: number;
  retries?: number;
  fallbackValue?: any;
  requiresAuth?: boolean;
}

export class FederatedConnectionManager {
  private connectionPools = new Map<string, ConnectionPool>();
  private defaultTimeout = 2000;
  private maxRetries = 2;

  constructor() {
    // Cleanup idle connections every 5 minutes
    setInterval(() => this.cleanupIdleConnections(), 5 * 60 * 1000);
  }

  async connect(serviceName: string, timeout = this.defaultTimeout): Promise<Connection | null> {
    const serviceInfo = serviceDiscovery.getServiceInfo(serviceName);
    if (!serviceInfo) {
      console.warn(`Unknown service: ${serviceName}`);
      return null;
    }

    // Check if service is available via circuit breaker
    const isAvailable = await serviceDiscovery.isServiceAvailable(serviceName);
    if (!isAvailable) {
      console.log(`Service ${serviceName} is not available (circuit breaker)`);
      return null;
    }

    try {
      // Get or create connection pool for service
      let pool = this.connectionPools.get(serviceName);
      if (!pool) {
        pool = {
          connections: new Map(),
          maxConnections: 5,
          lastCleanup: new Date()
        };
        this.connectionPools.set(serviceName, pool);
      }

      // Try to reuse existing healthy connection
      const existingConnection = pool.connections.get(serviceInfo.baseUrl);
      if (existingConnection && existingConnection.isHealthy) {
        existingConnection.lastUsed = new Date();
        return existingConnection;
      }

      // Create new connection
      const connection = await this.establishConnection(serviceInfo, timeout);
      pool.connections.set(serviceInfo.baseUrl, connection);
      
      return connection;

    } catch (error) {
      console.error(`Failed to connect to ${serviceName}:`, error);
      return null;
    }
  }

  private async establishConnection(
    serviceInfo: any, 
    timeout: number
  ): Promise<Connection> {
    const startTime = Date.now();
    
    // Test connection with health check
    const health = await serviceDiscovery.checkServiceHealth(serviceInfo.name, timeout);
    
    if (!health || health.status !== 'healthy') {
      throw new Error(`Service ${serviceInfo.name} is not healthy`);
    }

    const responseTime = Date.now() - startTime;

    return {
      serviceName: serviceInfo.name,
      baseUrl: serviceInfo.baseUrl,
      isHealthy: true,
      lastUsed: new Date(),
      responseTime
    };
  }

  async executeOptionalCall<T>(
    serviceName: string,
    endpoint: string,
    options: FederatedCallOptions = {}
  ): Promise<T | null> {
    const {
      timeout = this.defaultTimeout,
      retries = this.maxRetries,
      fallbackValue = null,
      requiresAuth = false
    } = options;

    // Get connection
    const connection = await this.connect(serviceName, timeout);
    if (!connection) {
      console.log(`No connection available for ${serviceName}, using fallback`);
      return fallbackValue;
    }

    // Execute call with retries
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const result = await this.makeHttpCall<T>(
          connection,
          endpoint,
          timeout,
          requiresAuth
        );
        
        // Mark connection as healthy on success
        connection.isHealthy = true;
        connection.lastUsed = new Date();
        
        return result;

      } catch (error) {
        lastError = error as Error;
        console.warn(`Call to ${serviceName}${endpoint} failed (attempt ${attempt + 1}):`, error);
        
        // Mark connection as unhealthy
        connection.isHealthy = false;
        
        // Don't retry on authentication errors
        if (error instanceof Error && error.message.includes('401')) {
          break;
        }
        
        // Wait before retry (exponential backoff)
        if (attempt < retries) {
          await this.delay(Math.pow(2, attempt) * 100);
        }
      }
    }

    console.error(`All attempts failed for ${serviceName}${endpoint}:`, lastError);
    return fallbackValue;
  }

  private async makeHttpCall<T>(
    connection: Connection,
    endpoint: string,
    timeout: number,
    requiresAuth: boolean
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'BLKOUTNXT-Platform/1.0.0'
      };

      // Add auth if required (implement auth strategy here)
      if (requiresAuth) {
        // TODO: Add authentication headers
        // headers['Authorization'] = `Bearer ${getAuthToken()}`;
      }

      const response = await fetch(`${connection.baseUrl}${endpoint}`, {
        method: 'GET',
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data as T;

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout for ${connection.serviceName}${endpoint}`);
      }
      
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private cleanupIdleConnections(): void {
    const maxIdleTime = 10 * 60 * 1000; // 10 minutes
    const now = new Date();

    for (const [serviceName, pool] of this.connectionPools) {
      for (const [url, connection] of pool.connections) {
        const idleTime = now.getTime() - connection.lastUsed.getTime();
        
        if (idleTime > maxIdleTime) {
          pool.connections.delete(url);
          console.log(`Cleaned up idle connection to ${serviceName}`);
        }
      }

      // Remove empty pools
      if (pool.connections.size === 0) {
        this.connectionPools.delete(serviceName);
      }
    }
  }

  // Get connection statistics for monitoring
  getConnectionStats(): Record<string, any> {
    const stats: Record<string, any> = {};

    for (const [serviceName, pool] of this.connectionPools) {
      stats[serviceName] = {
        activeConnections: pool.connections.size,
        healthyConnections: Array.from(pool.connections.values())
          .filter(conn => conn.isHealthy).length
      };
    }

    return stats;
  }

  // Manual connection health check
  async checkConnectionHealth(serviceName: string): Promise<boolean> {
    const connection = await this.connect(serviceName);
    return connection?.isHealthy || false;
  }

  // Close all connections (useful for cleanup)
  closeAllConnections(): void {
    this.connectionPools.clear();
  }
}

// Export singleton instance
export const connectionManager = new FederatedConnectionManager();