import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App-simple.tsx'
import './index.css'

// Simplified initialization
console.log('Starting minimal BLKOUT app...')

const rootElement = document.getElementById('root')
if (!rootElement) {
  document.body.innerHTML = '<div style="color: red; padding: 20px;">Root element not found!</div>'
} else {
  console.log('Root element found, initializing React...')
  try {
    ReactDOM.createRoot(rootElement).render(<App />)
    console.log('React app initialized successfully')
  } catch (error) {
    console.error('React initialization failed:', error)
    document.body.innerHTML = `<div style="color: red; padding: 20px;">React Error: ${error}</div>`
  }
}