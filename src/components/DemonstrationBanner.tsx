/**
 * Demonstration Banner
 * Clear warning banner for demonstration site
 */

import React from 'react'

const DemonstrationBanner: React.FC = () => {
  return (
    <div className="bg-red-600 text-white py-2 px-4 text-center text-sm font-bold border-b-2 border-red-700">
      <div className="max-w-7xl mx-auto">
        🚨 DEMONSTRATION • DEMONSTRATION • DEMONSTRATION • DEMONSTRATION • DEMONSTRATION • DEMONSTRATION 🚨
        <div className="text-xs mt-1 opacity-90">
          This is a speculative demonstration site showing potential platform capabilities - NOT a real community platform
        </div>
      </div>
    </div>
  )
}

export default DemonstrationBanner