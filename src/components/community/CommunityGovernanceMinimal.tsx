import React from 'react'

const CommunityGovernanceMinimal = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#1a1a1a', 
      color: 'white', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#6366f1', marginBottom: '20px' }}>
        🏛️ BLKOUT Community Governance
      </h1>
      
      <div style={{ 
        backgroundColor: '#2a2a2a', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#10b981', margin: '0 0 15px 0' }}>
          ✅ Governance System Online
        </h2>
        <p style={{ margin: '5px 0', lineHeight: '1.6' }}>
          Welcome to the BLKOUT Community Governance Dashboard. This democratic platform 
          empowers our community to participate in cooperative decision-making.
        </p>
      </div>

      <div style={{ 
        backgroundColor: '#1e3a8a', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: 'white', margin: '0 0 15px 0' }}>
          🗳️ Current Proposals
        </h3>
        <div style={{ 
          backgroundColor: '#3b82f6', 
          padding: '15px', 
          borderRadius: '6px',
          marginBottom: '10px'
        }}>
          <h4 style={{ margin: '0 0 8px 0', color: 'white' }}>
            Community Resource Allocation 2025
          </h4>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#e5e7eb' }}>
            Proposal to allocate community funds for platform development and community programs.
          </p>
          <button style={{
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            marginRight: '10px',
            cursor: 'pointer'
          }}>
            Support (73%)
          </button>
          <button style={{
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Oppose (27%)
          </button>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#166534', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: 'white', margin: '0 0 15px 0' }}>
          📋 Recent Meetings
        </h3>
        <div style={{ color: '#dcfce7' }}>
          <p style={{ margin: '5px 0' }}>
            <strong>Next Meeting:</strong> Community Assembly - Jan 25, 2025 at 7:00 PM GMT
          </p>
          <p style={{ margin: '5px 0' }}>
            <strong>Last Meeting:</strong> Governance Review - Jan 15, 2025
          </p>
          <button style={{
            backgroundColor: '#22c55e',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            marginTop: '10px',
            cursor: 'pointer'
          }}>
            View Meeting Archive
          </button>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#7c2d12', 
        padding: '20px', 
        borderRadius: '8px'
      }}>
        <h3 style={{ color: 'white', margin: '0 0 15px 0' }}>
          📝 Submit New Proposal
        </h3>
        <p style={{ color: '#fed7aa', margin: '0 0 15px 0' }}>
          Community members can submit proposals for democratic consideration.
        </p>
        <button style={{
          backgroundColor: '#ea580c',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '6px',
          fontSize: '16px',
          cursor: 'pointer'
        }}>
          Create Proposal
        </button>
      </div>

      <div style={{ 
        marginTop: '30px',
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '14px'
      }}>
        <p>BLKOUT Community Governance | Cooperative Democracy in Action</p>
        <p>Powered by community values, transparency, and collective decision-making</p>
      </div>
    </div>
  )
}

export default CommunityGovernanceMinimal