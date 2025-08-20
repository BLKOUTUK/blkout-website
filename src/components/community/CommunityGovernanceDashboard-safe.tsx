import React, { useState, useEffect } from 'react'

// Safe governance dashboard with error boundaries and debugging
const CommunityGovernanceDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  // Add debugging info
  useEffect(() => {
    const info = [
      'Dashboard component initialized',
      `Active tab: ${activeTab}`,
      `Timestamp: ${new Date().toISOString()}`,
      `Browser: ${navigator.userAgent.split(' ')[0]}`
    ]
    setDebugInfo(info)
    console.log('CommunityGovernanceDashboard loaded successfully', info)
  }, [activeTab])

  // Error boundary simulation
  const handleError = (error: Error) => {
    console.error('Dashboard Error:', error)
    setError(error.message)
  }

  if (error) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#1a1a1a',
        color: 'white',
        minHeight: '100vh'
      }}>
        <h1 style={{ color: '#ef4444' }}>Dashboard Error</h1>
        <p style={{ color: '#cbd5e1', marginBottom: '20px' }}>{error}</p>
        <button 
          onClick={() => setError(null)}
          style={{
            backgroundColor: '#6366f1',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#0f0f23',
      color: '#ffffff',
      minHeight: '100vh'
    }}>
      {/* Debug Panel */}
      <div style={{
        backgroundColor: '#1a1a2e',
        padding: '10px 20px',
        borderBottom: '1px solid #333',
        fontSize: '12px',
        color: '#94a3b8'
      }}>
        🔍 Debug: {debugInfo.join(' | ')}
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        {/* Header */}
        <header style={{ 
          textAlign: 'center', 
          marginBottom: '40px',
          padding: '40px 20px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '15px',
          border: '1px solid #333'
        }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            margin: '0 0 15px 0',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            🏛️ BLKOUT Community Governance
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#cbd5e1',
            margin: '0 0 10px 0'
          }}>
            Democratic Participation • Cooperative Ownership • Transparent Decision-Making
          </p>
          <p style={{ 
            color: '#94a3b8',
            fontSize: '1rem'
          }}>
            Empowering our community through values-driven governance
          </p>
        </header>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '40px',
          backgroundColor: '#1a1a2e',
          padding: '10px',
          borderRadius: '15px',
          border: '1px solid #333',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'overview', label: '📊 Overview', icon: '📊' },
            { id: 'proposals', label: '🗳️ Proposals', icon: '🗳️' },
            { id: 'meetings', label: '📋 Meetings', icon: '📋' },
            { id: 'documents', label: '📁 Documents', icon: '📁' },
            { id: 'metrics', label: '📈 Metrics', icon: '📈' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                try {
                  setActiveTab(tab.id)
                } catch (err) {
                  handleError(err as Error)
                }
              }}
              style={{
                padding: '12px 20px',
                border: 'none',
                borderRadius: '10px',
                backgroundColor: activeTab === tab.id ? '#6366f1' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#cbd5e1',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <main>
          {activeTab === 'overview' && (
            <div>
              <h2 style={{ color: '#10b981', fontSize: '2rem', marginBottom: '30px', textAlign: 'center' }}>
                Community Governance Overview
              </h2>
              
              {/* Stats Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '20px',
                marginBottom: '40px'
              }}>
                <div style={{
                  backgroundColor: '#1a1a2e',
                  padding: '25px',
                  borderRadius: '15px',
                  textAlign: 'center',
                  border: '1px solid #16213e'
                }}>
                  <div style={{ fontSize: '3rem', color: '#6366f1', fontWeight: 'bold' }}>156</div>
                  <div style={{ color: '#94a3b8' }}>Community Members</div>
                </div>
                <div style={{
                  backgroundColor: '#1a1a2e',
                  padding: '25px',
                  borderRadius: '15px',
                  textAlign: 'center',
                  border: '1px solid #16213e'
                }}>
                  <div style={{ fontSize: '3rem', color: '#10b981', fontWeight: 'bold' }}>23</div>
                  <div style={{ color: '#94a3b8' }}>Active Proposals</div>
                </div>
                <div style={{
                  backgroundColor: '#1a1a2e',
                  padding: '25px',
                  borderRadius: '15px',
                  textAlign: 'center',
                  border: '1px solid #16213e'
                }}>
                  <div style={{ fontSize: '3rem', color: '#f59e0b', fontWeight: 'bold' }}>87%</div>
                  <div style={{ color: '#94a3b8' }}>Participation Rate</div>
                </div>
                <div style={{
                  backgroundColor: '#1a1a2e',
                  padding: '25px',
                  borderRadius: '15px',
                  textAlign: 'center',
                  border: '1px solid #16213e'
                }}>
                  <div style={{ fontSize: '3rem', color: '#ef4444', fontWeight: 'bold' }}>12</div>
                  <div style={{ color: '#94a3b8' }}>Meetings This Year</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{
                backgroundColor: '#1a1a2e',
                padding: '30px',
                borderRadius: '15px',
                border: '1px solid #16213e'
              }}>
                <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '1.5rem' }}>Quick Actions</h3>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  <button style={{
                    backgroundColor: '#6366f1',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}>
                    Submit New Proposal
                  </button>
                  <button style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}>
                    View Active Votes
                  </button>
                  <button style={{
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}>
                    Meeting Archive
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'proposals' && (
            <div>
              <h2 style={{ color: '#10b981', fontSize: '2rem', marginBottom: '30px', textAlign: 'center' }}>
                🗳️ Community Proposals
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                  backgroundColor: '#1a1a2e',
                  padding: '25px',
                  borderRadius: '15px',
                  border: '1px solid #16213e'
                }}>
                  <h3 style={{ color: 'white', marginBottom: '15px' }}>Community Resource Allocation 2025</h3>
                  <p style={{ color: '#cbd5e1', marginBottom: '20px', lineHeight: '1.6' }}>
                    Proposal to allocate community funds for platform development, community programs, and cooperative expansion initiatives.
                  </p>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
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
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                    Voting ends: January 30, 2025 • 89 votes cast
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#1a1a2e',
                  padding: '25px',
                  borderRadius: '15px',
                  border: '1px solid #16213e'
                }}>
                  <h3 style={{ color: 'white', marginBottom: '15px' }}>Governance Structure Review</h3>
                  <p style={{ color: '#cbd5e1', marginBottom: '20px', lineHeight: '1.6' }}>
                    Annual review of community governance processes to ensure democratic participation and transparency.
                  </p>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
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
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                    Voting ends: February 5, 2025 • 124 votes cast
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'meetings' && (
            <div>
              <h2 style={{ color: '#10b981', fontSize: '2rem', marginBottom: '30px', textAlign: 'center' }}>
                📋 Community Meetings
              </h2>
              
              <div style={{
                backgroundColor: '#1a1a2e',
                padding: '30px',
                borderRadius: '15px',
                border: '1px solid #16213e'
              }}>
                <div style={{ marginBottom: '25px' }}>
                  <h3 style={{ color: '#f59e0b', marginBottom: '10px' }}>Next Meeting</h3>
                  <p style={{ color: 'white', fontSize: '1.2rem', marginBottom: '5px' }}>Community Assembly</p>
                  <p style={{ color: '#cbd5e1' }}>January 25, 2025 at 7:00 PM GMT</p>
                </div>
                
                <div style={{ marginBottom: '25px' }}>
                  <h3 style={{ color: '#10b981', marginBottom: '10px' }}>Recent Meeting</h3>
                  <p style={{ color: 'white', fontSize: '1.1rem', marginBottom: '5px' }}>Governance Review</p>
                  <p style={{ color: '#cbd5e1' }}>January 15, 2025</p>
                </div>

                <button style={{
                  backgroundColor: '#6366f1',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}>
                  View Full Meeting Archive
                </button>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <h2 style={{ color: '#10b981', fontSize: '2rem', marginBottom: '30px', textAlign: 'center' }}>
                📁 Governance Documents
              </h2>
              
              <div style={{
                backgroundColor: '#1a1a2e',
                padding: '30px',
                borderRadius: '15px',
                border: '1px solid #16213e'
              }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#16213e', borderRadius: '8px' }}>
                    <a href="#" style={{ color: '#6366f1', textDecoration: 'none', fontSize: '1.1rem' }}>
                      📄 Community Charter
                    </a>
                  </li>
                  <li style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#16213e', borderRadius: '8px' }}>
                    <a href="#" style={{ color: '#6366f1', textDecoration: 'none', fontSize: '1.1rem' }}>
                      📋 Governance Guidelines
                    </a>
                  </li>
                  <li style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#16213e', borderRadius: '8px' }}>
                    <a href="#" style={{ color: '#6366f1', textDecoration: 'none', fontSize: '1.1rem' }}>
                      📝 Meeting Minutes Archive
                    </a>
                  </li>
                  <li style={{ padding: '15px', backgroundColor: '#16213e', borderRadius: '8px' }}>
                    <a href="#" style={{ color: '#6366f1', textDecoration: 'none', fontSize: '1.1rem' }}>
                      💰 Financial Transparency Reports
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div>
              <h2 style={{ color: '#10b981', fontSize: '2rem', marginBottom: '30px', textAlign: 'center' }}>
                📈 Governance Metrics
              </h2>
              
              <div style={{
                backgroundColor: '#1a1a2e',
                padding: '30px',
                borderRadius: '15px',
                border: '1px solid #16213e'
              }}>
                <div style={{ marginBottom: '25px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ color: 'white' }}>Active Participation</span>
                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>87%</span>
                  </div>
                  <div style={{ backgroundColor: '#16213e', height: '10px', borderRadius: '5px' }}>
                    <div style={{ 
                      backgroundColor: '#10b981', 
                      height: '100%', 
                      width: '87%', 
                      borderRadius: '5px' 
                    }}></div>
                  </div>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ color: 'white' }}>Proposal Success Rate</span>
                    <span style={{ color: '#6366f1', fontWeight: 'bold' }}>73%</span>
                  </div>
                  <div style={{ backgroundColor: '#16213e', height: '10px', borderRadius: '5px' }}>
                    <div style={{ 
                      backgroundColor: '#6366f1', 
                      height: '100%', 
                      width: '73%', 
                      borderRadius: '5px' 
                    }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ color: 'white' }}>Community Engagement</span>
                    <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>91%</span>
                  </div>
                  <div style={{ backgroundColor: '#16213e', height: '10px', borderRadius: '5px' }}>
                    <div style={{ 
                      backgroundColor: '#f59e0b', 
                      height: '100%', 
                      width: '91%', 
                      borderRadius: '5px' 
                    }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          marginTop: '50px',
          padding: '30px',
          borderTop: '1px solid #333',
          color: '#64748b'
        }}>
          <p style={{ margin: '0 0 5px 0' }}>BLKOUT Community Governance</p>
          <p style={{ margin: '0 0 15px 0' }}>Cooperative Democracy • Community Ownership • Transparent Decision-Making</p>
          <a href="/" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 'bold' }}>
            ← Back to Main Platform
          </a>
        </footer>
      </div>
    </div>
  )
}

export default CommunityGovernanceDashboard