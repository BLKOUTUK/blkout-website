import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add error boundary to catch and log any initialization errors
window.addEventListener('error', (e) => {
  console.error('Application error:', e.error)
  document.body.innerHTML = `<div style="color: red; padding: 20px;">Error: ${e.message}</div>`
})

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason)
})

try {
  const rootElement = document.getElementById('root')
  if (!rootElement) {
    throw new Error('Root element not found')
  }

  console.log('Initializing BLKOUT application...')

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} catch (error) {
  console.error('Failed to initialize app:', error)
  document.body.innerHTML = `<div style="color: red; padding: 20px; font-family: monospace;">
    <h1>BLKOUT - Initialization Error</h1>
    <p>Error: ${error}</p>
    <p>Please check the console for more details.</p>
  </div>`
}