import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CommunityGovernanceMinimal from './components/community/CommunityGovernanceMinimal'

// Simple working components
const HomePage = () => (
  <div style={{ 
    padding: '40px', 
    backgroundColor: '#1a1a1a', 
    color: 'white', 
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif'
  }}>
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ color: '#6366f1', fontSize: '3rem', marginBottom: '20px' }}>
        BLKOUT
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: '#cbd5e1' }}>
        Community-owned platform for Black queer liberation
      </p>
      <div style={{ 
        backgroundColor: '#2a2a2a', 
        padding: '30px', 
        borderRadius: '10px',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: '#10b981', marginBottom: '15px' }}>
          Platform Status: Online ✅
        </h2>
        <p style={{ lineHeight: '1.6' }}>
          Welcome to BLKOUT, a cooperative platform built by and for Black queer communities. 
          Our governance system enables democratic participation in platform decisions.
        </p>
      </div>
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
            fontWeight: 'bold'
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
            fontWeight: 'bold'
          }}
        >
          🤝 Community Hub
        </a>
      </div>
    </div>
  </div>
)

const CommunityPage = () => (
  <div style={{ 
    padding: '40px', 
    backgroundColor: '#1a1a1a', 
    color: 'white', 
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif'
  }}>
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#10b981', marginBottom: '20px' }}>
        🤝 Community Hub
      </h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '30px', lineHeight: '1.6' }}>
        Connect with fellow community members, participate in discussions, and 
        contribute to our cooperative platform.
      </p>
      <div style={{ 
        backgroundColor: '#2a2a2a', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>Community Features:</h3>
        <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
          <li>Democratic governance participation</li>
          <li>Community-driven content</li>
          <li>Cooperative decision-making</li>
          <li>Transparent platform development</li>
        </ul>
      </div>
      <a 
        href="/" 
        style={{
          color: '#6366f1',
          textDecoration: 'none',
          fontSize: '1.1rem'
        }}
      >
        ← Back to Home
      </a>
    </div>
  </div>
)

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/governance" element={<CommunityGovernanceMinimal />} />
        <Route path="/community" element={<CommunityPage />} />
      </Routes>
    </Router>
  )
}

export default App