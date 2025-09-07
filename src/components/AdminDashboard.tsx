import React from 'react'

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="bg-gray-800 rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <p className="text-gray-300 mb-8">Welcome to the BLKOUT admin panel.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Content Moderation</h3>
              <p className="text-gray-400">Review and moderate community submissions</p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Events Management</h3>
              <p className="text-gray-400">Create and manage community events</p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Newsroom</h3>
              <p className="text-gray-400">Publish news articles and updates</p>
            </div>
          </div>
          
          <div className="mt-8">
            <a href="/" className="text-blue-400 hover:text-blue-300">← Back to Platform</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard