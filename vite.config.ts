import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'animations': ['framer-motion', 'gsap'],
          'ui': ['lucide-react'],
          'supabase': ['@supabase/supabase-js'],
          'governance': [
            // Separate governance components into their own chunk
            './src/components/community/CommunityGovernanceDashboard',
            './src/components/community/ProposalVotingInterface',
            './src/components/community/ProposalSubmissionForm',
            './src/components/community/MeetingMinutesWidget',
            './src/components/admin/GovernanceDocumentsAdmin'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  // Ensure proper handling of environment variables
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  }
})