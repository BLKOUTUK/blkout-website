// Federation Status Dashboard Component
// Shows real-time status of federated services and platform health
// File: src/components/FederationStatusDashboard.tsx

import React, { useState } from 'react';
import { useServiceHealth, usePerformanceMetrics } from '../hooks/useFederatedModule';

interface ServiceStatusProps {
  service: any;
  compact?: boolean;
}

const ServiceStatusCard: React.FC<ServiceStatusProps> = ({ service, compact = false }) => {
  const getStatusColor = (available: boolean, responseTime?: number) => {
    if (!available) return 'text-red-400 bg-red-900/20 border-red-400/30';
    if (responseTime && responseTime > 2000) return 'text-yellow-400 bg-yellow-900/20 border-yellow-400/30';
    return 'text-green-400 bg-green-900/20 border-green-400/30';
  };

  const getStatusIcon = (available: boolean) => {
    if (available) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    );
  };

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 px-2 py-1 rounded-lg border ${getStatusColor(service.available, service.responseTime)}`}>
        {getStatusIcon(service.available)}
        <span className="text-sm font-medium">{service.name}</span>
        {service.responseTime && (
          <span className="text-xs opacity-75">{service.responseTime}ms</span>
        )}
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg border backdrop-blur-sm ${getStatusColor(service.available, service.responseTime)}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold flex items-center space-x-2">
          {getStatusIcon(service.available)}
          <span>{service.name}</span>
        </h3>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          service.available ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {service.available ? 'Online' : 'Offline'}
        </span>
      </div>
      
      <div className="space-y-1 text-sm opacity-75">
        {service.responseTime && (
          <div>Response: {service.responseTime}ms</div>
        )}
        {service.circuitBreakerState && (
          <div>Circuit: {service.circuitBreakerState}</div>
        )}
        <div>Last checked: {new Date(service.lastChecked).toLocaleTimeString()}</div>
      </div>
      
      {service.capabilities && service.capabilities.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {service.capabilities.slice(0, 3).map((capability: string) => (
            <span key={capability} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
              {capability}
            </span>
          ))}
          {service.capabilities.length > 3 && (
            <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
              +{service.capabilities.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

interface FederationStatusDashboardProps {
  compact?: boolean;
  showPerformance?: boolean;
}

export const FederationStatusDashboard: React.FC<FederationStatusDashboardProps> = ({
  compact = false,
  showPerformance = true
}) => {
  const { services, overallHealth, loading: servicesLoading, refresh } = useServiceHealth();
  const { metrics, runPerformanceTest } = usePerformanceMetrics();
  const [showDetails, setShowDetails] = useState(!compact);
  const [testRunning, setTestRunning] = useState(false);

  const handleRunPerformanceTest = async () => {
    setTestRunning(true);
    try {
      const results = await runPerformanceTest();
      console.log('Performance test results:', results);
      // You could show results in a modal or update state
    } catch (error) {
      console.error('Performance test failed:', error);
    } finally {
      setTestRunning(false);
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 0.8) return 'text-green-400';
    if (health >= 0.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const availableServices = services.filter(s => s.available).length;
  const totalServices = services.length;

  if (compact) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${availableServices > 0 ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-sm font-medium text-white">
              Federation Status
            </span>
            <span className="text-xs text-gray-400">
              {availableServices}/{totalServices} online
            </span>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {showDetails && (
          <div className="space-y-2">
            {services.map(service => (
              <ServiceStatusCard key={service.name} service={service} compact={true} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Federation Status</h2>
          <p className="text-gray-400">
            Real-time status of BLKOUT ecosystem services
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={refresh}
            disabled={servicesLoading}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            {servicesLoading ? 'Refreshing...' : 'Refresh'}
          </button>
          {showPerformance && (
            <button
              onClick={handleRunPerformanceTest}
              disabled={testRunning}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50"
            >
              {testRunning ? 'Testing...' : 'Run Performance Test'}
            </button>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Platform Health</h3>
              <div className={`text-3xl font-bold ${getHealthColor(overallHealth)}`}>
                {Math.round(overallHealth * 100)}%
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className={`w-6 h-6 ${getHealthColor(overallHealth)}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Overall system health score
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Services Online</h3>
              <div className="text-3xl font-bold text-white">
                {availableServices}/{totalServices}
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Connected federation services
          </p>
        </div>

        {showPerformance && metrics && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Avg Load Time</h3>
                <div className="text-3xl font-bold text-white">
                  {metrics.platform.averagePageLoadTime}ms
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Platform performance
            </p>
          </div>
        )}
      </div>

      {/* Services Grid */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Service Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(service => (
            <ServiceStatusCard key={service.name} service={service} />
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      {showPerformance && metrics && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{metrics.platform.systemHealth * 100}%</div>
              <div className="text-gray-400 text-sm">System Health</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{metrics.platform.independenceRatio * 100}%</div>
              <div className="text-gray-400 text-sm">Independence Ratio</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{metrics.platform.averagePageLoadTime}ms</div>
              <div className="text-gray-400 text-sm">Avg Page Load</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{availableServices}</div>
              <div className="text-gray-400 text-sm">Available Services</div>
            </div>
          </div>

          {metrics.performance.recentMetrics.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-white mb-2">Recent Performance</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {metrics.performance.recentMetrics.slice(-10).map((metric: any, index: number) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">{metric.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white">{metric.value}{metric.unit}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        metric.status === 'good' ? 'bg-green-500/20 text-green-400' :
                        metric.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {metric.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Independence Notice */}
      <div className="bg-violet-900/20 border border-violet-400/30 rounded-lg p-4 backdrop-blur-sm">
        <div className="flex items-center space-x-2 mb-2">
          <svg className="w-5 h-5 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <h4 className="text-violet-300 font-medium">Federated Independence Architecture</h4>
        </div>
        <p className="text-gray-300 text-sm">
          BLKOUTNXT platform works completely independently. External services enhance the experience but are never required for core functionality. 
          {availableServices === 0 ? 
            " Currently running in full independence mode - all features are available." :
            ` Currently enhanced by ${availableServices} connected service${availableServices !== 1 ? 's' : ''}.`
          }
        </p>
      </div>
    </div>
  );
};

export default FederationStatusDashboard;