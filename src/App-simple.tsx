import React from 'react'

function App() {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#1a1a1a', 
      color: 'white', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>BLKOUT - Test Deployment</h1>
      <p>If you can see this, React is working correctly.</p>
      <p>Time: {new Date().toISOString()}</p>
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #333' }}>
        <h2>Governance Dashboard Test</h2>
        <p>This is a simplified version to test deployment.</p>
        <button style={{ 
          padding: '10px 20px', 
          backgroundColor: '#6366f1', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px' 
        }}>
          Test Button
        </button>
      </div>
    </div>
  )
}

export default App