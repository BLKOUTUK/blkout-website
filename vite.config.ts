import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Simple TypeScript config to avoid ES module issues
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist'
  }
})