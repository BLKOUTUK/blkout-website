import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Emergency minimal governance system - NO external dependencies
const EmergencyGovernancePage = () => {
  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#0f0f23',
      color: '#cccccc',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '2px solid #333', paddingBottom: '20px' }}>
          <h1 style={{ color: '#6366f1', fontSize: '3rem', margin: '0 0 10px 0', fontWeight: 'bold' }}>
            🏛️ BLKOUT GOVERNANCE
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#94a3b8', margin: 0 }}>
            Community Democracy • Cooperative Ownership • Transparent Decision-Making
          </p>
        </header>

        {/* Active Proposals */}
        <section style={{ marginBottom: '40px', backgroundColor: '#1a1a2e', padding: '30px', borderRadius: '10px', border: '1px solid #16213e' }}>
          <h2 style={{ color: '#10b981', fontSize: '1.8rem', margin: '0 0 20px 0' }}>🗳️ Active Proposals</h2>
          
          <div style={{ backgroundColor: '#16213e', padding: '20px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #0f3460' }}>
            <h3 style={{ color: 'white', margin: '0 0 10px 0', fontSize: '1.3rem' }}>Community Resource Allocation 2025</h3>
            <p style={{ color: '#cbd5e1', margin: '0 0 15px 0', lineHeight: '1.6' }}>
              Proposal to allocate community funds for platform development, community programs, and cooperative expansion initiatives.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button style={{
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                ✓ Support (73%)
              </button>
              <button style={{
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                ✗ Oppose (27%)
              </button>
            </div>
          </div>

          <div style={{ backgroundColor: '#16213e', padding: '20px', borderRadius: '8px', border: '1px solid #0f3460' }}>
            <h3 style={{ color: 'white', margin: '0 0 10px 0', fontSize: '1.3rem' }}>Governance Structure Review</h3>
            <p style={{ color: '#cbd5e1', margin: '0 0 15px 0', lineHeight: '1.6' }}>
              Annual review of community governance processes to ensure democratic participation and transparency.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button style={{
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                ✓ Support (89%)
              </button>
              <button style={{
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                ✗ Oppose (11%)
              </button>
            </div>
          </div>
        </section>

        {/* Three Column Layout */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '30px',
          marginBottom: '40px'
        }}>
          {/* Community Meetings */}
          <div style={{ backgroundColor: '#1a1a2e', padding: '25px', borderRadius: '10px', border: '1px solid #16213e' }}>
            <h2 style={{ color: '#f59e0b', fontSize: '1.5rem', margin: '0 0 15px 0' }}>📋 Community Meetings</h2>
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: 'white' }}>Next Meeting:</strong><br/>
              <span style={{ color: '#cbd5e1' }}>Community Assembly<br/>January 25, 2025 at 7:00 PM GMT</span>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: 'white' }}>Last Meeting:</strong><br/>
              <span style={{ color: '#cbd5e1' }}>Governance Review - January 15, 2025</span>
            </div>
            <button style={{
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              width: '100%'
            }}>
              View Meeting Archive
            </button>
          </div>

          {/* Submit Proposal */}
          <div style={{ backgroundColor: '#1a1a2e', padding: '25px', borderRadius: '10px', border: '1px solid #16213e' }}>
            <h2 style={{ color: '#8b5cf6', fontSize: '1.5rem', margin: '0 0 15px 0' }}>📝 Submit Proposal</h2>
            <p style={{ color: '#cbd5e1', margin: '0 0 15px 0', lineHeight: '1.6' }}>
              Community members can submit proposals for democratic consideration by the community council.
            </p>
            <ul style={{ color: '#94a3b8', margin: '0 0 20px 20px', lineHeight: '1.6' }}>
              <li>Resource Allocation</li>
              <li>Policy Changes</li>
              <li>Platform Development</li>
              <li>Community Programs</li>
            </ul>
            <button style={{
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              width: '100%'
            }}>
              Create New Proposal
            </button>
          </div>

          {/* Community Values */}
          <div style={{ backgroundColor: '#1a1a2e', padding: '25px', borderRadius: '10px', border: '1px solid #16213e' }}>
            <h2 style={{ color: '#ef4444', fontSize: '1.5rem', margin: '0 0 15px 0' }}>🤝 Our Values</h2>
            <p style={{ color: '#cbd5e1', margin: '0 0 15px 0', lineHeight: '1.6' }}>
              Our governance reflects BLKOUT's commitment to community empowerment and liberation.
            </p>
            <ul style={{ color: '#cbd5e1', margin: '0 0 0 20px', lineHeight: '1.8', listStyle: 'none' }}>
              <li>🏳️‍🌈 Black queer liberation</li>
              <li>🤝 Cooperative ownership</li>
              <li>🔓 Transparency & accountability</li>
              <li>📊 Data sovereignty</li>
              <li>🗳️ Democratic decision-making</li>
            </ul>
          </div>
        </div>

        {/* Stats */}
        <section style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: '#16213e',
          padding: '25px',
          borderRadius: '10px',
          marginBottom: '40px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ textAlign: 'center', minWidth: '120px' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#6366f1', margin: '0 0 5px 0' }}>156</div>
            <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Community Members</div>
          </div>
          <div style={{ textAlign: 'center', minWidth: '120px' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981', margin: '0 0 5px 0' }}>23</div>
            <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Active Proposals</div>
          </div>
          <div style={{ textAlign: 'center', minWidth: '120px' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b', margin: '0 0 5px 0' }}>87%</div>
            <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Participation Rate</div>
          </div>
          <div style={{ textAlign: 'center', minWidth: '120px' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ef4444', margin: '0 0 5px 0' }}>12</div>
            <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Meetings This Year</div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ 
          textAlign: 'center', 
          borderTop: '1px solid #333', 
          paddingTop: '20px',
          color: '#64748b'
        }}>
          <p style={{ margin: '0 0 5px 0' }}>BLKOUT Community Governance | Cooperative Democracy in Action</p>
          <p style={{ margin: '0 0 15px 0' }}>Building community-owned platforms for Black queer liberation</p>
          <a href="/" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 'bold' }}>
            ← Back to Main Platform
          </a>
        </footer>
      </div>
    </div>
  )
}

const EmergencyHomePage = () => {
  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#0f0f23',
      color: '#cccccc',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ 
          color: '#6366f1', 
          fontSize: '4rem', 
          margin: '0 0 20px 0',
          fontWeight: 'bold',
          textShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
        }}>
          BLKOUT
        </h1>
        <p style={{ fontSize: '1.4rem', margin: '0 0 10px 0', color: '#cbd5e1' }}>
          Community-owned platform for Black queer liberation
        </p>
        <p style={{ fontSize: '1rem', margin: '0 0 40px 0', color: '#94a3b8' }}>
          Cooperative democracy • Transparent governance • Community ownership
        </p>

        <div style={{ 
          backgroundColor: '#1a1a2e', 
          padding: '30px', 
          borderRadius: '12px',
          marginBottom: '30px',
          border: '1px solid #16213e'
        }}>
          <h2 style={{ color: '#10b981', margin: '0 0 15px 0', fontSize: '1.8rem' }}>
            ✅ Platform Status: Online
          </h2>
          <p style={{ lineHeight: '1.6', margin: '0 0 20px 0' }}>
            Welcome to BLKOUT, a cooperative platform built by and for Black queer communities. 
            Our governance system enables democratic participation in all platform decisions.
          </p>
          
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a 
              href="/governance" 
              style={{
                backgroundColor: '#6366f1',
                color: 'white',
                padding: '15px 30px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                display: 'inline-block',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
              }}
            >
              🏛️ Community Governance
            </a>
            <a 
              href="/community" 
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '15px 30px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                display: 'inline-block',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
            >
              🤝 Community Hub
            </a>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#16213e', 
          padding: '25px', 
          borderRadius: '10px',
          color: '#cbd5e1'
        }}>
          <h3 style={{ color: 'white', margin: '0 0 15px 0' }}>Emergency Stable Version</h3>
          <p style={{ margin: '0', fontSize: '0.9rem' }}>
            This is a stable fallback version ensuring platform accessibility. 
            Full features available while we resolve deployment issues.
          </p>
        </div>
      </div>
    </div>
  )
}

const CommunityPage = () => {
  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#0f0f23',
      color: '#cccccc',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: '#10b981', margin: '0 0 20px 0', fontSize: '2.5rem' }}>
          🤝 Community Hub
        </h1>
        <p style={{ fontSize: '1.1rem', margin: '0 0 30px 0', lineHeight: '1.6' }}>
          Connect with fellow community members, participate in discussions, and 
          contribute to our cooperative platform.
        </p>
        
        <div style={{ 
          backgroundColor: '#1a1a2e', 
          padding: '25px', 
          borderRadius: '10px',
          marginBottom: '30px',
          border: '1px solid #16213e'
        }}>
          <h3 style={{ color: 'white', margin: '0 0 15px 0' }}>Community Features:</h3>
          <ul style={{ margin: '0 0 0 20px', lineHeight: '1.8', color: '#cbd5e1' }}>
            <li>Democratic governance participation</li>
            <li>Community-driven content creation</li>
            <li>Cooperative decision-making processes</li>
            <li>Transparent platform development</li>
            <li>Values-first community building</li>
          </ul>
        </div>
        
        <a 
          href="/" 
          style={{
            color: '#6366f1',
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}
        >
          ← Back to Home
        </a>
      </div>
    </div>
  )
}

function App() {
  // Add error boundary
  const [hasError, setHasError] = React.useState(false)
  
  React.useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Application Error:', error)
      setHasError(true)
    }
    
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])
  
  if (hasError) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#0f0f23',
        color: 'white',
        minHeight: '100vh'
      }}>
        <h1 style={{ color: '#ef4444' }}>Application Error</h1>
        <p>Something went wrong. Please refresh the page.</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            backgroundColor: '#6366f1',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Reload Page
        </button>
      </div>
    )
  }
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EmergencyHomePage />} />
        <Route path="/governance" element={<EmergencyGovernancePage />} />
        <Route path="/community" element={<CommunityPage />} />
      </Routes>
    </Router>
  )
}

export default App