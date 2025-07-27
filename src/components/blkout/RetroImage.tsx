// Placeholder for removed VCR effects
import React from 'react'

interface RetroImageProps {
  src: string
  alt: string
  className?: string
  vcrIntensity?: string
  overlayContent?: React.ReactNode
}

const RetroImage: React.FC<RetroImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  overlayContent 
}) => {
  return (
    <div className={`relative ${className}`}>
      <img 
        src={src} 
        alt={alt} 
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

export default RetroImage