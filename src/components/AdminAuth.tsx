import React, { useState } from 'react'

interface AdminAuthProps {
  children: React.ReactNode
}

const AdminAuth = ({ children }: AdminAuthProps) => {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password === 'BLKOUT2025!') {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Incorrect password')
      setPassword('')
    }
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Access</h1>
          <p className="text-gray-400">Enter password to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter admin password"
              required
            />
          </div>
          
          {error && (
            <div className="text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            Access Admin
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <a href="/" className="text-blue-400 hover:text-blue-300 text-sm">
            ← Back to Platform
          </a>
        </div>
      </div>
    </div>
  )
}

export default AdminAuth