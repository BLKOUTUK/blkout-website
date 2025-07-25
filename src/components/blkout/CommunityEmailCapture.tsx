import React from 'react'

interface CommunityEmailCaptureProps {
  source?: string
  variant?: string
  preselectedInterests?: string[]
  onSuccess?: (trackingId: string) => void
}

const CommunityEmailCapture: React.FC<CommunityEmailCaptureProps> = ({ onSuccess }) => {
  return (
    <div className="bg-black/20 p-6 rounded-lg">
      <p className="text-white text-center mb-4">Join our community newsletter</p>
      <div className="flex gap-2">
        <input 
          type="email" 
          placeholder="Enter your email" 
          className="flex-1 px-3 py-2 bg-white/10 text-white rounded border border-white/20"
        />
        <button 
          onClick={() => onSuccess?.('placeholder-id')}
          className="px-4 py-2 bg-blkout-primary text-white rounded hover:bg-blkout-primary/80"
        >
          Join
        </button>
      </div>
    </div>
  )
}

export default CommunityEmailCapture