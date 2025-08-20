import React from 'react'

function App() {
  const [debugInfo, setDebugInfo] = React.useState<string[]>([])
  
  React.useEffect(() => {
    const info = [
      `Browser: ${navigator.userAgent}`,
      `URL: ${window.location.href}`,
      `Time: ${new Date().toISOString()}`,
      `Document ready state: ${document.readyState}`,
      `Screen size: ${window.screen.width}x${window.screen.height}`,
      `Window size: ${window.innerWidth}x${window.innerHeight}`
    ]
    setDebugInfo(info)
    
    // Test local storage
    try {
      localStorage.setItem('test', 'working')
      const test = localStorage.getItem('test')
      info.push(`LocalStorage: ${test === 'working' ? 'Working' : 'Failed'}`)
    } catch (e) {
      info.push(`LocalStorage: Error - ${e}`)
    }
    
    setDebugInfo([...info])
  }, [])
  
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#1a1a1a', 
      color: '#00ff00', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px'
    }}>
      <h1 style={{ color: '#ffffff', marginBottom: '20px' }}>🟢 BLKOUT - Debug Deployment</h1>
      <div style={{ backgroundColor: '#333', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
        <h2 style={{ color: '#00ff00', margin: '0 0 10px 0' }}>✅ React is working!</h2>
        <p style={{ margin: '5px 0' }}>If you can see this green text, React has loaded successfully.</p>
      </div>
      
      <div style={{ backgroundColor: '#004400', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Debug Information:</h3>
        {debugInfo.map((info, index) => (
          <p key={index} style={{ margin: '3px 0', fontSize: '14px', fontFamily: 'monospace' }}>
            {info}
          </p>
        ))}
      </div>
      
      <div style={{ backgroundColor: '#000066', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
        <h3 style={{ color: '#ffffff', margin: '0 0 10px 0' }}>Governance Dashboard Test</h3>
        <p style={{ color: '#cccccc' }}>This is a debugging version to isolate deployment issues.</p>
        <button 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#6366f1', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            marginTop: '10px',
            fontSize: '16px'
          }}
          onClick={() => alert('Button clicked! JavaScript is working.')}
        >
          Test Interactivity
        </button>
      </div>
      
      <div style={{ backgroundColor: '#660000', padding: '15px', borderRadius: '5px' }}>
        <h3 style={{ color: '#ffffff', margin: '0 0 10px 0' }}>Status Report</h3>
        <ul style={{ margin: '0', padding: '0 0 0 20px', color: '#cccccc' }}>
          <li>✅ HTML loaded successfully</li>
          <li>✅ CSS styles applied</li>
          <li>✅ React components rendering</li>
          <li>✅ JavaScript execution working</li>
          <li>✅ Event handlers functional</li>
        </ul>
      </div>
    </div>
  )
}

export default App