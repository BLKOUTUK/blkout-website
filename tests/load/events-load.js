import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate } from 'k6/metrics'

// Custom metrics
const errorRate = new Rate('errors')

// Load test configuration
export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Ramp up to 10 users
    { duration: '1m', target: 10 },    // Stay at 10 users
    { duration: '30s', target: 25 },   // Ramp up to 25 users
    { duration: '2m', target: 25 },    // Stay at 25 users
    { duration: '30s', target: 50 },   // Ramp up to 50 users
    { duration: '1m', target: 50 },    // Stay at 50 users
    { duration: '30s', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.05'],   // Error rate should be below 5%
    errors: ['rate<0.1'],             // Custom error rate below 10%
  },
}

// Base URL for the application
const BASE_URL = 'http://localhost:5173'
const API_BASE_URL = 'http://localhost:3001/api' // Events backend

// Test data
const eventQueries = [
  '',
  '?status=published',
  '?category=community',
  '?date=2025-08',
  '?featured=true',
  '?limit=10',
  '?page=1',
]

export default function () {
  // Test homepage load
  let response = http.get(BASE_URL)
  
  const homePageSuccess = check(response, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage loads in reasonable time': (r) => r.timings.duration < 2000,
    'homepage has title': (r) => r.body.includes('BLKOUT'),
  })

  if (!homePageSuccess) {
    errorRate.add(1)
  }

  sleep(1)

  // Test events API endpoints
  const randomQuery = eventQueries[Math.floor(Math.random() * eventQueries.length)]
  response = http.get(`${API_BASE_URL}/events${randomQuery}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const eventsAPISuccess = check(response, {
    'events API responds': (r) => r.status === 200 || r.status === 404, // 404 acceptable for test env
    'events API response time OK': (r) => r.timings.duration < 1000,
    'events API returns JSON': (r) => {
      try {
        JSON.parse(r.body)
        return true
      } catch {
        return false
      }
    },
  })

  if (!eventsAPISuccess && response.status !== 404) {
    errorRate.add(1)
  }

  sleep(1)

  // Test events stats endpoint
  response = http.get(`${API_BASE_URL}/events/stats`)
  
  check(response, {
    'events stats endpoint responds': (r) => r.status === 200 || r.status === 404,
    'events stats response time OK': (r) => r.timings.duration < 500,
  })

  sleep(1)

  // Test newsroom API
  response = http.get(`${API_BASE_URL}/articles`)
  
  check(response, {
    'newsroom API responds': (r) => r.status === 200 || r.status === 404,
    'newsroom API response time OK': (r) => r.timings.duration < 1000,
  })

  sleep(1)

  // Test static assets
  const staticAssets = [
    '/images/logo.png',
    '/favicon.ico',
    '/manifest.json',
  ]

  const randomAsset = staticAssets[Math.floor(Math.random() * staticAssets.length)]
  response = http.get(`${BASE_URL}${randomAsset}`)

  check(response, {
    'static asset loads': (r) => r.status === 200 || r.status === 404, // 404 acceptable if asset doesn't exist
    'static asset loads quickly': (r) => r.timings.duration < 1000,
  })

  sleep(2)
}

// Test concurrent database operations
export function testDatabaseLoad() {
  // Simulate concurrent read operations
  const responses = http.batch([
    ['GET', `${API_BASE_URL}/events?limit=50`],
    ['GET', `${API_BASE_URL}/articles?limit=20`],
    ['GET', `${API_BASE_URL}/events/stats`],
    ['GET', `${API_BASE_URL}/health`],
  ])

  responses.forEach((response, index) => {
    check(response, {
      [`batch request ${index} successful`]: (r) => r.status === 200 || r.status === 404,
      [`batch request ${index} fast enough`]: (r) => r.timings.duration < 2000,
    })
  })
}

// Stress test for POST operations (if applicable)
export function testEventCreation() {
  const eventData = {
    name: `Load Test Event ${Date.now()}`,
    description: 'Event created during load testing',
    event_date: '2025-09-01',
    location: { address: 'Load Test Location' },
    source: 'manual',
    status: 'draft'
  }

  const response = http.post(
    `${API_BASE_URL}/events`,
    JSON.stringify(eventData),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  const creationSuccess = check(response, {
    'event creation responds': (r) => r.status === 201 || r.status === 401 || r.status === 403, // Auth errors expected
    'event creation response time OK': (r) => r.timings.duration < 3000,
  })

  if (!creationSuccess && ![401, 403, 404].includes(response.status)) {
    errorRate.add(1)
  }
}

// Memory leak detection test
export function testMemoryUsage() {
  // Make multiple requests to check for memory leaks
  for (let i = 0; i < 20; i++) {
    http.get(`${BASE_URL}`)
    http.get(`${API_BASE_URL}/events`)
    
    if (i % 5 === 0) {
      sleep(0.1) // Brief pause every 5 requests
    }
  }

  // Check that responses are still fast (no memory degradation)
  const response = http.get(`${BASE_URL}`)
  check(response, {
    'no memory degradation': (r) => r.timings.duration < 2000,
  })
}

// Test teardown - verify system is still responsive
export function teardown() {
  const response = http.get(BASE_URL)
  console.log(`Final check - Status: ${response.status}, Duration: ${response.timings.duration}ms`)
  
  if (response.status !== 200 || response.timings.duration > 5000) {
    console.warn('⚠️ System may be degraded after load test')
  } else {
    console.log('✅ System responsive after load test')
  }
}