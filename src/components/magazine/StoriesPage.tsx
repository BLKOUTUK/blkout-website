'use client'

import React, { useState } from 'react'
import MagazineLayout from './MagazineLayout'
import ArticleGrid from './ArticleGrid'
import ArticlePage from './ArticlePage'

export default function StoriesPage() {
  const [currentView, setCurrentView] = useState<'grid' | 'article'>('grid')
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null)

  const handleBackToGrid = () => {
    setCurrentView('grid')
    setSelectedArticleId(null)
  }

  const handleArticleClick = (articleId: string) => {
    setSelectedArticleId(articleId)
    setCurrentView('article')
  }

  return (
    <MagazineLayout
      title={currentView === 'grid' ? 'Stories & Analysis' : undefined}
      subtitle={currentView === 'grid' ? 'Authentic voices from our community' : undefined}
      showBackButton={currentView === 'article'}
      onBack={handleBackToGrid}
    >
      {currentView === 'grid' ? (
        <ArticleGrid />
      ) : (
        <ArticlePage onBack={handleBackToGrid} />
      )}
    </MagazineLayout>
  )
}