import React from 'react'

const TestImageDisplay = () => {
  const testImages = [
    'BlackSQUARED.png',
    'queerSQUARED.PNG', 
    'WELLDEF_SQUARED.png',
    'facecard SQUARED.png'
  ]

  return (
    <div className="w-full min-h-screen bg-gray-900 p-8">
      <h1 className="text-white text-2xl mb-8">Image Loading Test</h1>
      
      <div className="grid grid-cols-2 gap-4">
        {testImages.map((image, index) => (
          <div key={index} className="border border-white p-4">
            <h3 className="text-white mb-2">{image}</h3>
            
            {/* Test as img tag */}
            <div className="mb-4">
              <p className="text-gray-300 text-sm mb-2">As img tag:</p>
              <img 
                src={`/images/squared/${image}`}
                alt={image}
                className="w-32 h-32 object-cover border border-red-500"
                onLoad={() => console.log(`Loaded: ${image}`)}
                onError={() => console.log(`Failed: ${image}`)}
              />
            </div>
            
            {/* Test as background image */}
            <div className="mb-4">
              <p className="text-gray-300 text-sm mb-2">As background:</p>
              <div 
                className="w-32 h-32 border border-green-500 bg-cover bg-center"
                style={{ backgroundImage: `url(/images/squared/${encodeURIComponent(image)})` }}
              />
            </div>
            
            {/* Test URL */}
            <div>
              <p className="text-gray-300 text-sm">URL:</p>
              <p className="text-blue-300 text-xs">/images/squared/{image}</p>
              <p className="text-yellow-300 text-xs">Encoded: /images/squared/{encodeURIComponent(image)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TestImageDisplay