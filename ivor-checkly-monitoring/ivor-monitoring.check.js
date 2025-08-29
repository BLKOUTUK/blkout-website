import { ApiCheck, AssertionBuilder } from 'checkly/constructs'

// IVOR API Gateway Health Check
new ApiCheck('ivor-api-gateway-health', {
  name: 'IVOR API Gateway Health',
  tags: ['ivor', 'api', 'health'],
  maxResponseTime: 5000,
  degradedResponseTime: 2000,
  frequency: 300, // 5 minutes
  locations: ['eu-west-1'],
  
  request: {
    method: 'GET',
    url: 'https://ivor-api-gateway-1yhe12lks-robs-projects-54d653d3.vercel.app/health',
    headers: {}
  },

  assertions: [
    AssertionBuilder.statusCode().equals(200),
    AssertionBuilder.responseTime().lessThan(5000)
  ]
})

// IVOR Dashboard Health Check
new ApiCheck('ivor-dashboard-health', {
  name: 'IVOR Dashboard Health',
  tags: ['ivor', 'dashboard', 'health'],
  maxResponseTime: 5000,
  degradedResponseTime: 2000,
  frequency: 300, // 5 minutes
  locations: ['eu-west-1'],
  
  request: {
    method: 'GET',
    url: 'https://ivor-monitoring-service.vercel.app/',
    headers: {}
  },

  assertions: [
    AssertionBuilder.statusCode().equals(200),
    AssertionBuilder.responseTime().lessThan(5000)
  ]
})

// IVOR Chat Response Quality Check
new ApiCheck('ivor-chat-response', {
  name: 'IVOR Chat Response Quality',
  tags: ['ivor', 'chat', 'quality'],
  maxResponseTime: 8000,
  degradedResponseTime: 3000,
  frequency: 600, // 10 minutes
  locations: ['eu-west-1'],
  
  request: {
    method: 'POST',
    url: 'https://ivor-api-gateway-1yhe12lks-robs-projects-54d653d3.vercel.app/api/chat',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Test monitoring - can you help with community organizing?',
      context: { pathway: 'System Disruptor' }
    })
  },

  assertions: [
    AssertionBuilder.statusCode().equals(200),
    AssertionBuilder.responseTime().lessThan(8000)
  ]
})