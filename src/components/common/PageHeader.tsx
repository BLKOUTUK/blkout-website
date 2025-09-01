import React from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  className?: string
  iconColor?: 'black' | 'white'
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  className = '', 
  iconColor = 'white' 
}) => {
  const iconPath = iconColor === 'white' 
    ? '/images/squared/BLKOUTiconWHITE.png'
    : '/images/squared/BLKOUTiconBLACK.png'

  return (
    <div className={`flex items-center space-x-4 mb-8 ${className}`}>
      <img 
        src={iconPath}
        alt="BLKOUT"
        className="w-16 h-16 object-contain"
        onError={(e) => {
          // Fallback if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none'
        }}
      />
      <div>
        <h1 className="text-5xl font-bold uppercase tracking-wide">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl text-opacity-80 mt-2">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}

export default PageHeader