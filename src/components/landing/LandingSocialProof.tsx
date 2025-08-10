'use client'

import React from 'react'
import { Star } from 'lucide-react'

interface AvatarItem {
  imageSrc: string
  name: string
}

interface LandingSocialProofProps {
  avatarItems: AvatarItem[]
  numberOfUsers: number
  suffixText?: string
  showRating?: boolean
  rating?: number
  className?: string
}

export const LandingSocialProof: React.FC<LandingSocialProofProps> = ({
  avatarItems,
  numberOfUsers,
  suffixText = 'community members',
  showRating = false,
  rating = 5,
  className = ''
}) => {
  return (
    <div className={`flex flex-col sm:flex-row items-center gap-6 ${className}`}>
      {/* Avatar Stack */}
      <div className="flex items-center">
        <div className="flex -space-x-2">
          {avatarItems.slice(0, 4).map((avatar, index) => (
            <img
              key={index}
              src={avatar.imageSrc}
              alt={avatar.name}
              className="w-10 h-10 rounded-full border-2 border-gray-800 object-cover"
            />
          ))}
          {avatarItems.length > 4 && (
            <div className="w-10 h-10 rounded-full border-2 border-gray-800 bg-gray-700 flex items-center justify-center text-xs font-medium text-white">
              +{avatarItems.length - 4}
            </div>
          )}
        </div>
      </div>

      {/* Social Proof Text */}
      <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-300">
        {showRating && (
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < rating ? 'text-yellow-400 fill-current' : 'text-gray-500'
                  }`}
                />
              ))}
            </div>
            <span className="ml-1 font-medium">{rating}.0</span>
          </div>
        )}
        
        <div className="text-center sm:text-left">
          <span className="font-semibold text-white">{numberOfUsers.toLocaleString()}</span>
          <span className="ml-1">{suffixText}</span>
        </div>
      </div>
    </div>
  )
}