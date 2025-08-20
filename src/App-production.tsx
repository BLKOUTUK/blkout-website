import React, { Component, ErrorInfo, ReactNode, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class RouteErrorBoundary extends Component<
  { children: ReactNode; routeName: string },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; routeName: string }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Error in route ${this.props.routeName}:`, error)
    console.error('Error info:', errorInfo)
    this.setState({ error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          border: '2px solid #ff6b6b',
          borderRadius: '8px',
          backgroundColor: '#fff5f5'
        }}>
          <h2 style={{ color: '#d63031' }}>Error in {this.props.routeName}</h2>
          <p><strong>Error:</strong> {this.state.error?.message}</p>
          <details style={{ marginTop: '10px' }}>
            <summary>Technical Details</summary>
            <pre style={{ 
              background: '#f8f8f8', 
              padding: '10px', 
              overflow: 'auto',
              fontSize: '12px'
            }}>
              {this.state.error?.stack}
            </pre>
          </details>
          <button 
            onClick={() => this.setState({ hasError: false })}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#0984e3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Service Health Check Component
function ServiceHealthCheck() {
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'connected' | 'failed'>('checking')
  const [supabaseError, setSupabaseError] = useState<string>('')

  useEffect(() => {
    // Test Supabase connection
    const testSupabase = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
        
        if (!supabaseUrl || !supabaseKey) {
          throw new Error('Missing Supabase environment variables')
        }

        // Simple fetch test to Supabase
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        })

        if (response.ok) {
          setSupabaseStatus('connected')
        } else {
          throw new Error(`Supabase responded with status ${response.status}`)
        }
      } catch (error) {
        console.error('Supabase connection test failed:', error)
        setSupabaseStatus('failed')
        setSupabaseError(error instanceof Error ? error.message : 'Unknown error')
      }
    }

    testSupabase()
  }, [])

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'white',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '12px',
      zIndex: 9999,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div><strong>Service Status</strong></div>
      <div style={{ 
        color: supabaseStatus === 'connected' ? 'green' : 
               supabaseStatus === 'failed' ? 'red' : 'orange'
      }}>
        Supabase: {supabaseStatus}
        {supabaseError && <div style={{ fontSize: '10px' }}>{supabaseError}</div>}
      </div>
    </div>
  )
}

// Fallback Components
function FallbackHomepage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>BLKOUT - Community Platform</h1>
      <p>Liberation through collective action and cooperative ownership.</p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/governance" style={{ 
          padding: '10px 20px', 
          backgroundColor: '#6c5ce7', 
          color: 'white', 
          textDecoration: 'none',
          borderRadius: '4px',
          margin: '10px'
        }}>
          Community Governance
        </Link>
        <Link to="/movement" style={{ 
          padding: '10px 20px', 
          backgroundColor: '#00b894', 
          color: 'white', 
          textDecoration: 'none',
          borderRadius: '4px',
          margin: '10px'
        }}>
          Movement
        </Link>
      </div>
    </div>
  )
}

function FallbackGovernance() {
  return (
    <div style={{ padding: '40px' }}>
      <h1>Community Governance Dashboard</h1>
      <p>Cooperative democracy for BLKOUT Media community.</p>
      <div style={{ 
        background: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>🏛️ Governance Features</h3>
        <ul>
          <li>Community Proposal System</li>
          <li>Democratic Voting Interface</li>
          <li>Meeting Minutes Archive</li>
          <li>Transparency Documents</li>
          <li>Community Metrics</li>
        </ul>
        <p><em>Note: Full functionality requires Supabase connection.</em></p>
      </div>
      <Link to="/" style={{ color: '#6c5ce7' }}>← Back to Home</Link>
    </div>
  )
}

function FallbackMovement() {
  return (
    <div style={{ padding: '40px' }}>
      <h1>Movement</h1>
      <p>Black queer liberation through community organizing and cooperative economics.</p>
      <div style={{ 
        background: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>Our Values</h3>
        <ul>
          <li>🏳️‍⚧️ Trans Liberation</li>
          <li>🏳️‍🌈 Queer Joy</li>
          <li>✊🏿 Black Power</li>
          <li>🤝 Cooperative Ownership</li>
          <li>🌍 Community Sovereignty</li>
        </ul>
      </div>
      <Link to="/governance" style={{ color: '#00b894', marginRight: '20px' }}>
        Community Governance →
      </Link>
      <Link to="/" style={{ color: '#6c5ce7' }}>← Back to Home</Link>
    </div>
  )
}

// Navigation Component
function Navigation() {
  return (
    <nav style={{
      background: '#2d3436',
      padding: '10px 20px',
      color: 'white'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ 
          color: 'white', 
          textDecoration: 'none', 
          fontSize: '18px', 
          fontWeight: 'bold' 
        }}>
          BLKOUT
        </Link>
        <div>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', margin: '0 10px' }}>
            Home
          </Link>
          <Link to="/movement" style={{ color: 'white', textDecoration: 'none', margin: '0 10px' }}>
            Movement
          </Link>
          <Link to="/governance" style={{ color: 'white', textDecoration: 'none', margin: '0 10px' }}>
            Governance
          </Link>
        </div>
      </div>
    </nav>
  )
}

// Main App with Progressive Enhancement
function App() {
  const [appInitialized, setAppInitialized] = useState(false)
  const [initError, setInitError] = useState<string>('')

  useEffect(() => {
    console.log('🚀 BLKOUT App initializing...')
    console.log('Environment:', {
      NODE_ENV: import.meta.env.MODE,
      SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing',
      SUPABASE_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
    })

    // Initialize app with error handling
    try {
      setAppInitialized(true)
      console.log('✅ BLKOUT App initialized successfully')
    } catch (error) {
      console.error('❌ App initialization failed:', error)
      setInitError(error instanceof Error ? error.message : 'Unknown initialization error')
    }
  }, [])

  if (!appInitialized) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '40px', 
            marginBottom: '20px',
            animation: 'pulse 2s infinite'
          }}>
            🚀
          </div>
          <h2>BLKOUT Loading...</h2>
          {initError && (
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '10px', 
              borderRadius: '4px',
              marginTop: '20px'
            }}>
              Error: {initError}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <ServiceHealthCheck />
        <Navigation />
        
        <Routes>
          <Route path="/" element={
            <RouteErrorBoundary routeName="Homepage">
              <FallbackHomepage />
            </RouteErrorBoundary>
          } />
          
          <Route path="/governance" element={
            <RouteErrorBoundary routeName="Governance">
              <FallbackGovernance />
            </RouteErrorBoundary>
          } />
          
          <Route path="/movement" element={
            <RouteErrorBoundary routeName="Movement">
              <FallbackMovement />
            </RouteErrorBoundary>
          } />
          
          <Route path="*" element={
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <h2>404 - Page Not Found</h2>
              <Link to="/">← Back to Home</Link>
            </div>
          } />
        </Routes>
        
        <footer style={{
          background: '#2d3436',
          color: 'white',
          textAlign: 'center',
          padding: '20px',
          marginTop: '40px'
        }}>
          <p>&copy; 2024 BLKOUT - Community Platform | Liberation through Cooperation</p>
        </footer>
      </div>
    </Router>
  )
}

export default App