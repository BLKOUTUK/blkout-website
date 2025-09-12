// Main entry point for BLKOUTNXT Platform
// Federated Independence Architecture - Community Liberation Technology
// File: src/main.tsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Initialize federated architecture
import { performanceMonitor } from './services/PerformanceMonitoring'
import { blkoutModule } from './services/IndependentModuleCore'

// Track application startup performance
const startTime = Date.now()

// Verify independence on startup
blkoutModule.isFullyFunctional().then(isIndependent => {
  console.log(`🛡️ BLKOUTNXT Platform ${isIndependent ? 'FULLY INDEPENDENT' : 'PARTIALLY DEPENDENT'}`)
  
  performanceMonitor.trackPageLoad('application_startup', startTime, [], [])
}).catch(error => {
  console.error('Independence check failed:', error)
})

// Mount the application
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Performance monitoring for federated architecture
performanceMonitor.trackPageLoad('main_application', startTime)