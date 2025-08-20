/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/migration/setup.ts'],
    testTimeout: 120000, // 2 minutes for migration tests
    include: ['tests/migration/**/*.test.ts', 'tests/migration/**/*.spec.ts'],
    sequential: true, // Run migration tests sequentially to avoid conflicts
    env: {
      VITE_SUPABASE_URL: 'http://localhost:54321',
      VITE_SUPABASE_ANON_KEY: 'test-migration-key',
      TEST_MODE: 'migration'
    }
  },
})