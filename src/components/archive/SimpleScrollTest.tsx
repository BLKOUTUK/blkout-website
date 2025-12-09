import { useState, useEffect } from 'react'

const SimpleScrollTest = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    { id: 'slide1', title: 'Slide 1', content: 'This is the first slide' },
    { id: 'slide2', title: 'Slide 2', content: 'This is the second slide' },
    { id: 'slide3', title: 'Slide 3', content: 'This is the third slide' },
  ]

  return (
    <div className="w-full min-h-screen bg-black text-white">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-red-600 py-4 z-50">
        <div className="text-center">
          <h1 className="text-xl font-bold">SIMPLE TEST HEADER</h1>
        </div>
      </div>

      {/* Main Content with spacing for fixed header */}
      <div className="pt-20">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="w-full h-screen bg-gray-800 border-2 border-red-500 flex items-center justify-center"
            style={{ minHeight: '100vh' }}
          >
            <div className="text-center p-8 bg-blue-600 rounded-lg">
              <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>
              <p className="text-xl">{slide.content}</p>
              <p className="text-sm mt-4">Slide {index + 1} of {slides.length}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40">
        {slides.map((_, index) => (
          <div
            key={index}
            className="w-4 h-4 bg-yellow-400 rounded-full mb-2 border-2 border-white"
          />
        ))}
      </div>

      {/* Debug Info */}
      <div className="fixed bottom-4 left-4 z-40 bg-red-600 p-2 rounded text-xs">
        <div>Current Slide: {currentSlide}</div>
        <div>Total Slides: {slides.length}</div>
      </div>
    </div>
  )
}

export default SimpleScrollTest