import React from 'react'
import PageHeader from '../common/PageHeader'

const TestAdmin: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '40px' }}>
      <PageHeader 
        title="ADMIN HUB" 
        subtitle="Unified administration dashboard for community platform management"
        iconColor="white"
        className="text-white"
      />
      <p>If you can see this, the routing is working!</p>
      <div>
        <h2>Admin Tools:</h2>
        <ul>
          <li><a href="/admin/moderation" style={{ color: '#60a5fa' }}>Moderation Panel</a></li>
          <li><a href="/admin/newsroom" style={{ color: '#60a5fa' }}>Newsroom Admin</a></li>
          <li><a href="/admin/events" style={{ color: '#60a5fa' }}>Events Admin</a></li>
        </ul>
        <h2>Downloads:</h2>
        <p>
          <a 
            href="/chrome-extension.zip" 
            download="blkout-extension-v1.1.zip"
            style={{ color: '#fbbf24', textDecoration: 'underline' }}
          >
            Download Chrome Extension v1.1
          </a>
        </p>
        <h2>Admin Password:</h2>
        <code style={{ backgroundColor: '#1f2937', padding: '5px 10px', borderRadius: '4px' }}>
          BLKOUT2025!
        </code>
      </div>
    </div>
  )
}

export default TestAdmin