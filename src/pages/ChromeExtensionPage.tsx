import React from 'react'

const ChromeExtensionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Reporter Extension</h1>
          <p className="text-lg text-gray-600 mb-8">
            Report real community events with organizer consent for democratic journalism
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-3">🔗 Chrome Extension Available</h2>
            <p className="text-blue-700 mb-4">
              Our community reporter extension is ready for installation. It enables ethical 
              reporting of real community events with proper consent collection.
            </p>
            <div className="space-y-2 text-sm text-blue-600">
              <p>✓ Real community event reporting</p>
              <p>✓ Organizer consent collection</p>
              <p>✓ Democratic editorial process</p>
              <p>✓ Community validation workflow</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Extension files are prepared and ready for Chrome Web Store submission.
            </p>
            <button 
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              onClick={() => window.open('/extension/popup.html', '_blank')}
            >
              Preview Extension Interface
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChromeExtensionPage