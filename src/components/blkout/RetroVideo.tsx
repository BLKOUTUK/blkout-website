// Placeholder for removed VCR effects
import React from 'react'

interface RetroVideoProps {
  src: string
  className?: string
  vcrIntensity?: string
  overlayContent?: React.ReactNode
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
}

const RetroVideo: React.FC<RetroVideoProps> = ({ 
  src, 
  className = '', 
  overlayContent,
  autoPlay = false,
  muted = true,
  loop = false
}) => {
  return (
    <div className={`relative ${className}`}>
      <video 
        src={src}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        className="w-full h-full object-cover"
      />
      {overlayContent && (
        <div className="absolute inset-0 flex items-center justify-center">
          {overlayContent}
        </div>
      )}
    </div>
  )
}

export default RetroVideo