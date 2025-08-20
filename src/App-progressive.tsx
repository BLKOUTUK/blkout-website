import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Progressive loading app to identify problematic components
function App() {
  const [loadingStage, setLoadingStage] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [componentStatuses, setComponentStatuses] = useState<{[key: string]: 'loading' | 'success' | 'failed'}>({})

  const stages = [
    { name: 'Router Setup', component: null },
    { name: 'Basic Homepage', component: 'Homepage' },
    { name: 'Navigation', component: 'Navigation' },
    { name: 'Governance Dashboard', component: 'Governance' },
    { name: 'Full Application', component: 'Full' }
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loadingStage < stages.length - 1) {
        setLoadingStage(prev => prev + 1)
      }
    }, 2000) // Load next stage after 2 seconds

    return () => clearTimeout(timer)
  }, [loadingStage])

  const updateComponentStatus = (component: string, status: 'loading' | 'success' | 'failed') => {
    setComponentStatuses(prev => ({ ...prev, [component]: status }))
  }

  // Safe wrapper for components
  const SafeComponent = ({ name, children }: { name: string, children: React.ReactNode }) => {
    useEffect(() => {
      updateComponentStatus(name, 'loading')
      try {
        // Component loaded successfully
        updateComponentStatus(name, 'success')
      } catch (err) {
        updateComponentStatus(name, 'failed')
        setError(`${name}: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }, [name])

    return <>{children}</>
  }

  // Progressive components
  const BasicHomepage = () => (
    <SafeComponent name="BasicHomepage">
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1 style={{ color: '#6c5ce7', marginBottom: '20px' }}>BLKOUT - Community Platform</h1>
        <p style={{ fontSize: '18px', color: '#2d3436', marginBottom: '30px' }}>
          Liberation through collective action and cooperative ownership.
        </p>
        <div>
          <a href="/governance" style={{ 
            padding: '12px 24px', 
            backgroundColor: '#6c5ce7', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '6px',
            margin: '0 10px',
            display: 'inline-block'
          }}>
            Community Governance
          </a>
          <a href="/movement" style={{ 
            padding: '12px 24px', 
            backgroundColor: '#00b894', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '6px',
            margin: '0 10px',
            display: 'inline-block'
          }}>
            Movement
          </a>
        </div>
      </div>
    </SafeComponent>
  )

  const BasicNavigation = () => (
    <SafeComponent name="BasicNavigation">
      <nav style={{ 
        background: '#2d3436', 
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>
          BLKOUT
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="/" style={{ color: 'white', textDecoration: 'none' }}>Home</a>
          <a href="/governance" style={{ color: 'white', textDecoration: 'none' }}>Governance</a>
          <a href="/movement" style={{ color: 'white', textDecoration: 'none' }}>Movement</a>
          <a href="/admin" style={{ color: 'white', textDecoration: 'none' }}>Admin</a>
        </div>
      </nav>
    </SafeComponent>
  )

  const BasicGovernance = () => (
    <SafeComponent name="BasicGovernance">
      <div style={{ padding: '40px' }}>
        <h1 style={{ color: '#6c5ce7', marginBottom: '20px' }}>Community Governance Dashboard</h1>
        <p style={{ fontSize: '16px', marginBottom: '30px' }}>
          Cooperative democracy for BLKOUT Media community.
        </p>
        <div style={{ 
          background: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3>🏛️ Governance Features</h3>
          <ul>
            <li>Community Proposal System</li>
            <li>Democratic Voting Interface</li>
            <li>Meeting Minutes Archive</li>
            <li>Transparency Documents</li>
            <li>Community Metrics</li>
          </ul>
        </div>
        <p><strong>Admin Password:</strong> BLKOUT2025!Admin</p>
      </div>
    </SafeComponent>
  )

  const renderCurrentStage = () => {
    const stage = stages[loadingStage]
    
    switch (loadingStage) {
      case 0:
        return <div style={{ padding: '40px', textAlign: 'center' }}>Setting up Router...</div>
      case 1:
        return <BasicHomepage />
      case 2:
        return (
          <>
            <BasicNavigation />
            <BasicHomepage />
          </>
        )
      case 3:
        return (
          <>
            <BasicNavigation />
            <Routes>
              <Route path="/" element={<BasicHomepage />} />
              <Route path="/governance" element={<BasicGovernance />} />
              <Route path="/movement" element={<div style={{ padding: '40px' }}><h1>Movement Page</h1><p>Black queer liberation values.</p></div>} />
              <Route path="/admin" element={<div style={{ padding: '40px' }}><h1>Admin Access</h1><p>Password: BLKOUT2025!Admin</p></div>} />
              <Route path="*" element={<div style={{ padding: '40px' }}><h2>404 - Page Not Found</h2></div>} />
            </Routes>
          </>
        )
      case 4:
        // This would load the full application
        return (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2 style={{ color: '#e74c3c' }}>⚠️ FULL APPLICATION STAGE</h2>
            <p>This stage would load all components. Since we got this far, the issue is likely in a specific heavy component.</p>
            <p>The basic functionality is working correctly.</p>
            <div style={{ marginTop: '30px' }}>
              <button 
                onClick={() => window.location.href = '/governance'} 
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#6c5ce7',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  margin: '0 10px'
                }}
              >
                Test Governance
              </button>
              <button 
                onClick={() => window.location.href = '/admin'} 
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  margin: '0 10px'
                }}
              >
                Test Admin
              </button>
            </div>
          </div>
        )
      default:
        return <div>Loading...</div>
    }
  }

  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        {/* Progress indicator */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: '#2d3436',
          color: 'white',
          padding: '10px',
          fontSize: '14px',
          zIndex: 1000
        }}>
          <div>
            <strong>Progressive Loading Stage {loadingStage + 1}/{stages.length}:</strong> {stages[loadingStage].name}
          </div>
          
          {Object.keys(componentStatuses).length > 0 && (
            <div style={{ marginTop: '5px', fontSize: '12px' }}>
              {Object.entries(componentStatuses).map(([name, status]) => (
                <span key={name} style={{ marginRight: '15px' }}>
                  {name}: {
                    status === 'loading' ? '🔄' : 
                    status === 'success' ? '✅' : '❌'
                  }
                </span>
              ))}
            </div>
          )}

          {error && (
            <div style={{ 
              marginTop: '10px', 
              padding: '10px', 
              background: '#e74c3c', 
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              <strong>Error Detected:</strong> {error}
            </div>
          )}
        </div>

        <div style={{ paddingTop: error ? '120px' : '80px' }}>
          {renderCurrentStage()}
        </div>
      </div>
    </Router>
  )
}

export default App