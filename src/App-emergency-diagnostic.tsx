import React, { useEffect, useState } from 'react'

// Emergency diagnostic app to identify blank page cause
function App() {
  const [diagnostics, setDiagnostics] = useState({
    react: 'Starting...',
    supabase_env: 'Checking...',
    supabase_connection: 'Checking...',
    error: null as string | null
  })

  useEffect(() => {
    console.log('🚨 EMERGENCY DIAGNOSTIC MODE ACTIVATED')
    
    // Test React rendering
    setDiagnostics(prev => ({ ...prev, react: '✅ React is working' }))

    // Test environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      setDiagnostics(prev => ({ 
        ...prev, 
        supabase_env: '❌ Missing Supabase environment variables',
        error: `VITE_SUPABASE_URL: ${supabaseUrl ? 'Set' : 'MISSING'}, VITE_SUPABASE_ANON_KEY: ${supabaseKey ? 'Set' : 'MISSING'}`
      }))
      return
    }

    setDiagnostics(prev => ({ ...prev, supabase_env: '✅ Environment variables present' }))

    // Test Supabase connection
    const testSupabase = async () => {
      try {
        console.log('Testing Supabase connection to:', supabaseUrl)
        
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'GET',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
          }
        })

        console.log('Supabase response status:', response.status)
        console.log('Supabase response headers:', Object.fromEntries(response.headers.entries()))

        if (response.ok) {
          setDiagnostics(prev => ({ ...prev, supabase_connection: '✅ Supabase connection successful' }))
        } else {
          const errorText = await response.text()
          setDiagnostics(prev => ({ 
            ...prev, 
            supabase_connection: '❌ Supabase connection failed',
            error: `Status: ${response.status}, Response: ${errorText}`
          }))
        }
      } catch (error) {
        console.error('Supabase connection error:', error)
        setDiagnostics(prev => ({ 
          ...prev, 
          supabase_connection: '❌ Supabase connection error',
          error: error instanceof Error ? error.message : 'Unknown error'
        }))
      }
    }

    testSupabase()
  }, [])

  return (
    <div style={{
      fontFamily: 'monospace',
      padding: '20px',
      backgroundColor: '#000',
      color: '#00ff00',
      minHeight: '100vh',
      fontSize: '14px'
    }}>
      <h1 style={{ color: '#ff0000', marginBottom: '30px' }}>
        🚨 EMERGENCY DIAGNOSTIC MODE 🚨
      </h1>
      
      <div style={{ marginBottom: '20px' }}>
        <strong style={{ color: '#ffff00' }}>BLKOUT Website Debug Information:</strong>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>React Status:</strong> {diagnostics.react}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>Environment Variables:</strong> {diagnostics.supabase_env}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>Supabase Connection:</strong> {diagnostics.supabase_connection}
      </div>

      {diagnostics.error && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#330000', 
          border: '1px solid #ff0000',
          color: '#ffcccc'
        }}>
          <strong>Error Details:</strong><br />
          {diagnostics.error}
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#003300', border: '1px solid #00ff00' }}>
        <strong>Environment Info:</strong><br />
        Mode: {import.meta.env.MODE}<br />
        Dev: {import.meta.env.DEV ? 'true' : 'false'}<br />
        Prod: {import.meta.env.PROD ? 'true' : 'false'}<br />
        Base URL: {import.meta.env.BASE_URL}<br />
        Timestamp: {new Date().toISOString()}
      </div>

      <div style={{ marginTop: '30px', fontSize: '12px', color: '#666' }}>
        If you see this page, React is working. The issue is likely with Supabase configuration or imports.
      </div>

      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            padding: '10px 20px',
            backgroundColor: '#0066cc',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          🔄 Retry Test
        </button>
        
        <button 
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(diagnostics, null, 2))
            alert('Diagnostic info copied to clipboard')
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#cc6600',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          📋 Copy Debug Info
        </button>
      </div>
    </div>
  )
}

export default App