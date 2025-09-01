// BLKOUTUK.com Article Migration Admin Panel
// Provides interface for migrating articles from the original BLKOUTUK.com site

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Upload, CheckCircle, XCircle, AlertCircle, RefreshCw, Database, FileText, Clock, ArrowRight } from 'lucide-react'
import { BlkoutUKMigration, type MigrationResult, type BlkoutUKArticle } from '../../lib/blkoutuk-migration'

interface MigrationProgress {
  phase: 'idle' | 'discovering' | 'backing_up' | 'migrating' | 'complete' | 'error'
  currentStep: string
  progress: number
  discovered: number
  processed: number
  imported: number
  errors: string[]
}

export default function BlkoutUKMigrationPanel() {
  const [migrationProgress, setMigrationProgress] = useState<MigrationProgress>({
    phase: 'idle',
    currentStep: '',
    progress: 0,
    discovered: 0,
    processed: 0,
    imported: 0,
    errors: []
  })
  
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null)
  const [discoveredArticles, setDiscoveredArticles] = useState<BlkoutUKArticle[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const migration = new BlkoutUKMigration()

  const startMigration = async () => {
    if (isRunning) return

    setIsRunning(true)
    setMigrationResult(null)
    setMigrationProgress({
      phase: 'discovering',
      currentStep: 'Connecting to BLKOUTUK.com...',
      progress: 0,
      discovered: 0,
      processed: 0,
      imported: 0,
      errors: []
    })

    try {
      // Step 1: Discover articles
      setMigrationProgress(prev => ({
        ...prev,
        phase: 'discovering',
        currentStep: 'Scanning BLKOUTUK.com for articles...',
        progress: 10
      }))

      const articles = await migration.discoverArticles()
      setDiscoveredArticles(articles)
      
      setMigrationProgress(prev => ({
        ...prev,
        currentStep: `Found ${articles.length} articles`,
        progress: 30,
        discovered: articles.length
      }))

      if (articles.length === 0) {
        setMigrationProgress(prev => ({
          ...prev,
          phase: 'complete',
          currentStep: 'No articles found to migrate',
          progress: 100
        }))
        setIsRunning(false)
        return
      }

      // Step 2: Create backup
      setMigrationProgress(prev => ({
        ...prev,
        phase: 'backing_up',
        currentStep: 'Creating pre-migration backup...',
        progress: 40
      }))

      await migration.createPreMigrationBackup()

      // Step 3: Migrate articles
      setMigrationProgress(prev => ({
        ...prev,
        phase: 'migrating',
        currentStep: 'Importing articles to community platform...',
        progress: 50
      }))

      const result = await migration.migrateArticles(articles)
      setMigrationResult(result)

      setMigrationProgress(prev => ({
        ...prev,
        phase: result.success ? 'complete' : 'error',
        currentStep: result.success ? 'Migration completed successfully!' : 'Migration completed with errors',
        progress: 100,
        processed: result.articlesProcessed,
        imported: result.articlesImported,
        errors: result.errors
      }))

    } catch (error) {
      console.error('Migration failed:', error)
      setMigrationProgress(prev => ({
        ...prev,
        phase: 'error',
        currentStep: `Migration failed: ${error}`,
        progress: 100,
        errors: [...prev.errors, `Critical error: ${error}`]
      }))
    } finally {
      setIsRunning(false)
    }
  }

  const discoverOnly = async () => {
    if (isRunning) return

    setIsRunning(true)
    setMigrationProgress({
      phase: 'discovering',
      currentStep: 'Discovering articles from BLKOUTUK.com...',
      progress: 50,
      discovered: 0,
      processed: 0,
      imported: 0,
      errors: []
    })

    try {
      const articles = await migration.discoverArticles()
      setDiscoveredArticles(articles)
      
      setMigrationProgress(prev => ({
        ...prev,
        phase: 'complete',
        currentStep: `Discovery complete: ${articles.length} articles found`,
        progress: 100,
        discovered: articles.length
      }))
    } catch (error) {
      setMigrationProgress(prev => ({
        ...prev,
        phase: 'error',
        currentStep: `Discovery failed: ${error}`,
        progress: 100,
        errors: [`Discovery error: ${error}`]
      }))
    } finally {
      setIsRunning(false)
    }
  }

  const resetMigration = () => {
    setMigrationProgress({
      phase: 'idle',
      currentStep: '',
      progress: 0,
      discovered: 0,
      processed: 0,
      imported: 0,
      errors: []
    })
    setMigrationResult(null)
    setDiscoveredArticles([])
    setIsRunning(false)
  }

  const getPhaseIcon = (phase: MigrationProgress['phase']) => {
    switch (phase) {
      case 'idle': return <Database className="w-6 h-6 text-gray-400" />
      case 'discovering': return <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
      case 'backing_up': return <Download className="w-6 h-6 text-yellow-500" />
      case 'migrating': return <Upload className="w-6 h-6 text-purple-500" />
      case 'complete': return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'error': return <XCircle className="w-6 h-6 text-red-500" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Database className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">BLKOUTUK.com Article Migration</h1>
            <p className="text-gray-600">Import articles from the original BLKOUTUK.com site to the community platform</p>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Migration Process</h3>
              <p className="text-sm text-blue-700 mt-1">
                This tool will discover articles from BLKOUTUK.com, create a backup of existing content, 
                and import the articles while preserving their metadata, categories, and content structure.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Migration Controls</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={discoverOnly}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Discover Only
            </button>
            <button
              onClick={startMigration}
              disabled={isRunning}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Start Full Migration
            </button>
            <button
              onClick={resetMigration}
              disabled={isRunning}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Progress Display */}
        {migrationProgress.phase !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 rounded-lg p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              {getPhaseIcon(migrationProgress.phase)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {migrationProgress.currentStep}
                  </span>
                  <span className="text-sm text-gray-500">
                    {migrationProgress.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${
                      migrationProgress.phase === 'error' ? 'bg-red-500' : 
                      migrationProgress.phase === 'complete' ? 'bg-green-500' : 'bg-purple-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${migrationProgress.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{migrationProgress.discovered}</div>
                <div className="text-sm text-gray-500">Discovered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{migrationProgress.processed}</div>
                <div className="text-sm text-gray-500">Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{migrationProgress.imported}</div>
                <div className="text-sm text-gray-500">Imported</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{migrationProgress.errors.length}</div>
                <div className="text-sm text-gray-500">Errors</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Discovered Articles */}
      {discoveredArticles.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Discovered Articles ({discoveredArticles.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {discoveredArticles.map((article, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
              >
                {article.featured_image && (
                  <img
                    src={article.featured_image}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{article.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      {article.category}
                    </span>
                    <span>{new Date(article.published_date).toLocaleDateString()}</span>
                    <span>{article.tags.length} tags</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Migration Results */}
      {migrationResult && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Migration Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium text-green-800">Imported</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{migrationResult.articlesImported}</div>
              <div className="text-sm text-green-600">articles successfully imported</div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                <span className="font-medium text-yellow-800">Skipped</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">{migrationResult.skipped.length}</div>
              <div className="text-sm text-yellow-600">articles already existed</div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="font-medium text-red-800">Errors</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{migrationResult.errors.length}</div>
              <div className="text-sm text-red-600">articles failed to import</div>
            </div>
          </div>

          {/* Error Details */}
          {migrationResult.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-2">Migration Errors</h4>
              <div className="space-y-1">
                {migrationResult.errors.map((error, index) => (
                  <div key={index} className="text-sm text-red-700">
                    • {error}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success Message */}
          {migrationResult.success && migrationResult.articlesImported > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium text-green-800">
                  Migration completed successfully! {migrationResult.articlesImported} articles 
                  from BLKOUTUK.com have been imported to the community platform.
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}