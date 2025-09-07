import React from 'react'

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="bg-gray-800 rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <p className="text-gray-300 mb-8">Welcome to the BLKOUT admin panel.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="/admin/moderation" className="block bg-gray-700 hover:bg-gray-600 rounded-lg p-6 transition-colors">
              <h3 className="text-xl font-semibold mb-2">Content Moderation</h3>
              <p className="text-gray-400">Review and moderate community submissions</p>
              <div className="mt-4 text-blue-400">→ Open Moderation Queue</div>
            </a>
            
            <a href="/submit" className="block bg-gray-700 hover:bg-gray-600 rounded-lg p-6 transition-colors">
              <h3 className="text-xl font-semibold mb-2">Submit Content</h3>
              <p className="text-gray-400">Add news articles and events for moderation</p>
              <div className="mt-4 text-blue-400">→ Submit Content</div>
            </a>
            
            <a href="/newsroom" className="block bg-gray-700 hover:bg-gray-600 rounded-lg p-6 transition-colors">
              <h3 className="text-xl font-semibold mb-2">Published Content</h3>
              <p className="text-gray-400">View published newsroom and events</p>
              <div className="mt-4 text-blue-400">→ View Published</div>
            </a>
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