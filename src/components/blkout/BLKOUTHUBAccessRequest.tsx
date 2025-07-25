import React from 'react'

interface BLKOUTHUBAccessRequestProps {
  onSuccess?: (data: any) => void
}

const BLKOUTHUBAccessRequest: React.FC<BLKOUTHUBAccessRequestProps> = ({ onSuccess }) => {
  return (
    <div className="text-center">
      <button 
        onClick={() => onSuccess?.({ status: 'requested' })}
        className="px-8 py-3 bg-gradient-to-r from-blkout-primary to-blkout-warm text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
      >
        Request BLKOUT HUB Access
      </button>
      <p className="text-gray-300 text-sm mt-2">
        Join our private community for Black queer men
      </p>
    </div>
  )
}

export default BLKOUTHUBAccessRequest