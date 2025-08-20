import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { HttpResponse, http } from 'msw'

// Mock server for API requests
export const server = setupServer(
  // Mock Supabase endpoints
  http.post('http://localhost:54321/rest/v1/*', () => {
    return HttpResponse.json({ data: [], error: null })
  }),
  http.get('http://localhost:54321/rest/v1/*', () => {
    return HttpResponse.json({ data: [], error: null })
  }),
  http.patch('http://localhost:54321/rest/v1/*', () => {
    return HttpResponse.json({ data: {}, error: null })
  }),
  http.delete('http://localhost:54321/rest/v1/*', () => {
    return HttpResponse.json({ data: {}, error: null })
  })
)

// Mock environment variables
vi.mock('import.meta.env', () => ({
  VITE_SUPABASE_URL: 'http://localhost:54321',
  VITE_SUPABASE_ANON_KEY: 'test-anon-key',
  MODE: 'test',
  DEV: false,
  PROD: false
}))

// Mock window.matchMedia for responsive components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Setup and teardown
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  cleanup()
  server.resetHandlers()
  vi.clearAllMocks()
})

afterAll(() => {
  server.close()
})