import React from 'react';
import { useModerationNotifications } from '../hooks/useModerationNotifications';

interface ModerationNotificationBadgeProps {
  className?: string;
  showCount?: boolean;
  onClick?: () => void;
}

export const ModerationNotificationBadge: React.FC<ModerationNotificationBadgeProps> = ({
  className = '',
  showCount = true,
  onClick
}) => {
  const { pendingCount, hasNewContent, isLoading } = useModerationNotifications();

  if (pendingCount === 0) {
    return null;
  }

  return (
    <div 
      className={`relative inline-flex items-center ${className}`}
      onClick={onClick}
    >
      {/* Bell Icon */}
      <svg
        className={`h-6 w-6 ${hasNewContent ? 'text-red-500' : 'text-gray-500'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-5-5V9a4.997 4.997 0 00-3-4.576A4.997 4.997 0 009 4.576V8l-5 5v4h11z"
        />
        {hasNewContent && (
          <circle cx="19" cy="5" r="3" fill="red" />
        )}
      </svg>
      
      {/* Badge Count */}
      {showCount && pendingCount > 0 && (
        <span className={`absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 ${
          hasNewContent ? 'bg-red-600 animate-pulse' : 'bg-orange-500'
        } rounded-full min-w-[20px] h-5`}>
          {pendingCount > 99 ? '99+' : pendingCount}
        </span>
      )}
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute -top-1 -right-1">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default ModerationNotificationBadge;