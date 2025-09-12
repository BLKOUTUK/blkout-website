import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code for better caching
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Split federated services for optional loading
          federation: [
            './src/services/OptionalServiceDiscovery',
            './src/services/FederatedConnectionManager',
            './src/services/IndependentModuleCore',
            './src/services/GracefulEnhancement'
          ],
          // Performance monitoring can be loaded separately
          monitoring: [
            './src/services/PerformanceMonitoring',
            './src/hooks/useFederatedModule'
          ]
        }
      }
    },
    // Optimize for performance
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console for debugging federation
        drop_debugger: true
      }
    }
  },
  server: {
    port: 3000,
    host: true, // Allow external connections for testing
    // Proxy configuration for development federation testing
    proxy: {
      '/api/ivor': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ivor/, '')
      },
      '/api/events': {
        target: 'http://localhost:8002', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/events/, '')
      },
      '/api/blkouthub': {
        target: 'http://localhost:8003',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/blkouthub/, '')
      }
    }
  },
  // Optimize dependencies for federation architecture
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    // Exclude federation services from pre-bundling to allow dynamic loading
    exclude: []
  },
  // Define environment variables for federation configuration
  define: {
    __FEDERATION_ENABLED__: JSON.stringify(process.env.NODE_ENV !== 'test'),
    __PERFORMANCE_MONITORING__: JSON.stringify(true),
    __DEVELOPMENT_MODE__: JSON.stringify(process.env.NODE_ENV === 'development')
  }
})