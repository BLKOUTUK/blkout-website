/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts', './tests/security/setup.ts'],
    testTimeout: 60000,
    include: ['tests/security/**/*.test.ts', 'tests/security/**/*.spec.ts'],
    // Use isolated test environment for security tests
    env: {
      VITE_SUPABASE_URL: 'http://localhost:54321',
      VITE_SUPABASE_ANON_KEY: 'test-security-key',
      TEST_MODE: 'security',
      NODE_ENV: 'test'
    }
  },
})