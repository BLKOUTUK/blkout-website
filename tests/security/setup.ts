import { beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../src/types/supabase'

// Test users for security testing
export const testUsers = {
  admin: {
    email: 'admin@test.blkout.com',
    password: 'AdminTest123!',
    role: 'admin'
  },
  moderator: {
    email: 'moderator@test.blkout.com',
    password: 'ModeratorTest123!',
    role: 'moderator'
  },
  user: {
    email: 'user@test.blkout.com',
    password: 'UserTest123!',
    role: 'authenticated'
  },
  anonymous: {
    email: null,
    password: null,
    role: 'anon'
  }
}

// Create clients for different user types
export const createSecurityTestClient = (userType: keyof typeof testUsers) => {
  const client = createClient<Database>(
    'http://localhost:54321',
    'test-security-key',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    }
  )

  // Mock the auth state based on user type
  if (userType !== 'anonymous') {
    const user = testUsers[userType]
    client.auth.getUser = vi.fn().mockResolvedValue({
      data: {
        user: {
          id: `test-${userType}-id`,
          email: user.email,
          role: user.role,
          user_metadata: { role: user.role }
        }
      },
      error: null
    })
  } else {
    client.auth.getUser = vi.fn().mockResolvedValue({
      data: { user: null },
      error: { message: 'Not authenticated' }
    })
  }

  return client
}

// Security test utilities
export const securityTestUtils = {
  // Test SQL injection attempts
  sqlInjectionPayloads: [
    "'; DROP TABLE events; --",
    "1' OR '1'='1",
    "admin'--",
    "admin'/*",
    "' OR 1=1--",
    "' OR 'a'='a",
    "') OR ('1'='1",
    "' UNION SELECT * FROM users--"
  ],

  // Test XSS payloads
  xssPayloads: [
    '<script>alert("XSS")</script>',
    '<img src="x" onerror="alert(1)">',
    'javascript:alert("XSS")',
    '<svg/onload=alert("XSS")>',
    '<iframe src="javascript:alert(1)"></iframe>',
    '"><script>alert("XSS")</script>',
    "';alert('XSS');//"
  ],

  // Test CSRF attempts
  csrfPayloads: [
    { _method: 'DELETE' },
    { _method: 'PUT' },
    { csrf_token: 'invalid_token' },
    { authenticity_token: 'fake_token' }
  ],

  // Test unauthorized access patterns
  unauthorizedPaths: [
    '/admin',
    '/admin/users',
    '/admin/events',
    '/api/admin',
    '/api/admin/users',
    '../../../etc/passwd',
    '/./././admin',
    '////admin',
    '/admin/../admin'
  ],

  // Test data tampering attempts
  dataTamperingPayloads: [
    { id: '../../../sensitive_data' },
    { id: '../../admin/users' },
    { user_id: 'admin' },
    { role: 'admin' },
    { is_admin: true },
    { permissions: ['admin', 'delete', 'modify'] }
  ],

  // Generate large payloads for DoS testing
  generateLargePayload: (size: number) => 'A'.repeat(size),

  // Generate invalid UUID attempts
  invalidUUIDs: [
    'not-a-uuid',
    '123456789',
    'null',
    'undefined',
    '',
    ' ',
    '../admin',
    '../../users'
  ]
}

// Mock dangerous functions to prevent actual security issues during testing
vi.mock('child_process', () => ({
  exec: vi.fn(),
  spawn: vi.fn(),
  execSync: vi.fn()
}))

vi.mock('fs', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
  unlinkSync: vi.fn(),
  existsSync: vi.fn()
}))

beforeAll(() => {
  console.log('🔒 Starting security tests with isolated environment')
})

beforeEach(() => {
  vi.clearAllMocks()
})

afterAll(() => {
  console.log('🔒 Security tests completed')
})