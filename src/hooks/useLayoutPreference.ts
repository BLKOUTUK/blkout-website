import { useState, useEffect } from 'react'

export type LayoutMode = 'scrollytelling' | 'direct' | 'bento'

const LAYOUT_PREFERENCE_KEY = 'blkout_layout_preference'

export function useLayoutPreference() {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('scrollytelling')
  const [hasVisited, setHasVisited] = useState(false)

  useEffect(() => {
    // Check if user has a saved preference
    const savedPreference = localStorage.getItem(LAYOUT_PREFERENCE_KEY)
    const visitCount = localStorage.getItem('blkout_visit_count') || '0'
    const visits = parseInt(visitCount, 10)
    
    // Increment visit count
    localStorage.setItem('blkout_visit_count', (visits + 1).toString())
    
    if (savedPreference) {
      setLayoutMode(savedPreference as LayoutMode)
      setHasVisited(true)
    } else if (visits > 1) {
      // If they've visited before but no preference saved, they might want direct access
      setHasVisited(true)
    }
  }, [])

  const toggleLayout = () => {
    const layoutCycle: LayoutMode[] = ['scrollytelling', 'bento', 'direct']
    const currentIndex = layoutCycle.indexOf(layoutMode)
    const nextIndex = (currentIndex + 1) % layoutCycle.length
    const newMode = layoutCycle[nextIndex]
    setLayoutMode(newMode)
    localStorage.setItem(LAYOUT_PREFERENCE_KEY, newMode)
  }

  const setLayoutPreference = (mode: LayoutMode) => {
    setLayoutMode(mode)
    localStorage.setItem(LAYOUT_PREFERENCE_KEY, mode)
  }

  return {
    layoutMode,
    toggleLayout,
    setLayoutPreference,
    hasVisited,
    isFirstTime: !hasVisited
  }
}