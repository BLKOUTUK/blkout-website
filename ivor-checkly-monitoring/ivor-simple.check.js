/**
 * Simple IVOR API Health Check
 */

import { ApiCheck, AssertionBuilder } from 'checkly/constructs';

const IVOR_API_GATEWAY = 'https://ivor-api-gateway-1yhe12lks-robs-projects-54d653d3.vercel.app';

// Simple API Gateway Health Check
new ApiCheck('ivor-api-health', {
  name: 'IVOR API Gateway Health',
  tags: ['ivor', 'health'],
  maxResponseTime: 5000,
  
  request: {
    method: 'GET',
    url: `${IVOR_API_GATEWAY}/health`
  },

  assertions: [
    AssertionBuilder.statusCode().equals(200),
    AssertionBuilder.responseTime().lessThan(5000)
  ]
});

// IVOR Chat Response Check
new ApiCheck('ivor-chat-response', {
  name: 'IVOR Chat Response Quality',
  tags: ['ivor', 'orchestration'],
  maxResponseTime: 8000,
  
  request: {
    method: 'POST',
    url: `${IVOR_API_GATEWAY}/api/chat`,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Hello, can you help with community organizing?',
      context: { pathway: 'System Disruptor' }
    })
  },

  assertions: [
    AssertionBuilder.statusCode().equals(200),
    AssertionBuilder.responseTime().lessThan(8000),
    AssertionBuilder.jsonBody('$.response').exists()
  ]
});

// Monitoring Dashboard Check
new ApiCheck('ivor-dashboard-health', {
  name: 'IVOR Dashboard Health',
  tags: ['ivor', 'dashboard'],
  maxResponseTime: 5000,
  
  request: {
    method: 'GET',
    url: 'https://ivor-monitoring-service.vercel.app/'
  },

  assertions: [
    AssertionBuilder.statusCode().equals(200),
    AssertionBuilder.responseTime().lessThan(5000)
  ]
});