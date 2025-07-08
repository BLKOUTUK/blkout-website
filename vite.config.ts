import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Simple TypeScript config to avoid ES module issues
export default defineConfig({
  plugins: [react()],
  base: '/', // Vercel deployment - use root path
  build: {
    outDir: 'dist'
  }
})