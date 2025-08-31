// Story Capture Monitor Dashboard
// Real-time monitoring of IVOR conversations → Newsroom articles pipeline

import { useState, useEffect } from 'react'
import { storyCaptureService, type CaptureMetrics } from '../services/storyCaptureService'

interface QueueStatus {
  pending: number
  processing: number
  captured: number
  published: number
  total: number
  oldest_pending: string | null
}

export default function StoryCaptureMonitor() {
  const [metrics, setMetrics] = useState<CaptureMetrics | null>(null)
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [processingQueue, setProcessingQueue] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    loadDashboardData()
    
    // Auto-refresh every 10 seconds if enabled
    const interval = autoRefresh ? setInterval(loadDashboardData, 10000) : null
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [metricsData, queueData] = await Promise.all([
        storyCaptureService.getCaptureMetrics('day'),
        storyCaptureService.getQueueStatus()
      ])
      
      setMetrics(metricsData)
      setQueueStatus(queueData)
    } catch (error) {
      console.error('Failed to load story capture data:', error)
    } finally {
      setLoading(false)
    }
  }

  const processQueue = async () => {
    try {
      setProcessingQueue(true)
      const result = await storyCaptureService.processCaptureQueue()
      
      alert(`Queue processing complete!\nProcessed: ${result.processed}\nCaptured: ${result.captured}\nPublished: ${result.published}\nErrors: ${result.errors}`)
      
      await loadDashboardData()
    } catch (error) {
      console.error('Failed to process queue:', error)
      alert('Queue processing failed. Check console for details.')
    } finally {
      setProcessingQueue(false)
    }
  }

  const testStoryCapture = async () => {
    const testConversation = {
      message: "Just launched a new mutual aid network in Leeds! We're connecting Black queer folks for food sharing, skill exchanges, and community support. Already have 50 people signed up.",
      response: "This is incredible organizing work! Mutual aid networks like yours are the foundation of community resilience and liberation. The fact that you already have 50 people shows there was real need and enthusiasm. This kind of grassroots organizing is how we build collective power.",
      service: 'ivor-organizing',
      timestamp: new Date().toISOString(),
      userId: `test-user-${Date.now()}`,
      sessionId: `test-session-${Date.now()}`
    }

    try {
      const result = await storyCaptureService.queueConversationForAnalysis(testConversation, true)
      
      if (result.queued) {
        alert(`Test conversation queued successfully!\nQueue ID: ${result.queueId}`)
        await loadDashboardData()
      } else {
        alert(`Test conversation not queued: ${result.reason}`)
      }
    } catch (error) {
      console.error('Failed to test story capture:', error)
      alert('Story capture test failed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-8"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="h-8 bg-gray-300 rounded w-12 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Story Capture Pipeline Monitor</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Real-time monitoring of IVOR conversations flowing into community stories. 
            From AI detection to democratic validation to newsroom publication.
          </p>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={processQueue}
              disabled={processingQueue}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {processingQueue ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Process Queue
                </>
              )}
            </button>

            <button
              onClick={testStoryCapture}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Test Story Capture
            </button>

            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Auto-refresh</span>
            </label>
          </div>
        </div>

        {/* Queue Status Cards */}
        {queueStatus && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{queueStatus.pending}</div>
              <div className="text-gray-600">Pending</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{queueStatus.processing}</div>
              <div className="text-gray-600">Processing</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{queueStatus.captured}</div>
              <div className="text-gray-600">Captured</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{queueStatus.published}</div>
              <div className="text-gray-600">Published</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-gray-600 mb-2">{queueStatus.total}</div>
              <div className="text-gray-600">Total</div>
            </div>
          </div>
        )}

        {/* Pipeline Metrics */}
        {metrics && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pipeline Performance (Today)</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Detection Metrics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Story Detection</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Conversations Analyzed</span>
                    <span className="font-semibold">{metrics.total_conversations_analyzed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Stories Detected</span>
                    <span className="font-semibold text-green-600">{metrics.stories_detected}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Detection Accuracy</span>
                    <span className="font-semibold text-blue-600">{metrics.detection_accuracy.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Capture Metrics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Story Capture</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Stories Captured</span>
                    <span className="font-semibold text-purple-600">{metrics.stories_captured}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Stories Published</span>
                    <span className="font-semibold text-indigo-600">{metrics.stories_published}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Community Consent Rate</span>
                    <span className="font-semibold text-green-600">{metrics.community_consent_rate.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Avg Processing Time</span>
                    <span className="font-semibold">{Math.round(metrics.processing_time_avg_ms)}ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-semibold text-green-600">
                      {metrics.total_conversations_analyzed > 0 
                        ? ((metrics.stories_captured / metrics.total_conversations_analyzed) * 100).toFixed(1)
                        : 0
                      }%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Publish Rate</span>
                    <span className="font-semibold text-purple-600">
                      {metrics.stories_captured > 0 
                        ? ((metrics.stories_published / metrics.stories_captured) * 100).toFixed(1)
                        : 0
                      }%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="mt-8 space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Story Detection Rate</span>
                  <span>{metrics.detection_accuracy.toFixed(1)}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(metrics.detection_accuracy, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Community Consent Rate</span>
                  <span>{metrics.community_consent_rate.toFixed(1)}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(metrics.community_consent_rate, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pipeline Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Pipeline Health Status</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-green-800">Detection</div>
                <div className="text-xs text-green-600">Operational</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-blue-800">Capture</div>
                <div className="text-xs text-blue-600">Operational</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-purple-50 rounded-lg">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-purple-800">Governance</div>
                <div className="text-xs text-purple-600">Operational</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-indigo-50 rounded-lg">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-indigo-800">Publication</div>
                <div className="text-xs text-indigo-600">Operational</div>
              </div>
            </div>
          </div>

          {queueStatus?.oldest_pending && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.734 0L4.08 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-sm text-yellow-800">
                  Oldest pending item from: {new Date(queueStatus.oldest_pending).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="bg-indigo-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-indigo-900 mb-3">How Story Capture Works</h3>
          <div className="text-indigo-800 text-sm space-y-2">
            <p>
              <strong>1. AI Detection:</strong> IVOR conversations are analyzed for story potential using community-focused keywords, 
              impact assessment, and quality scoring.
            </p>
            <p>
              <strong>2. User Consent:</strong> Community members can opt-in to have their stories captured and shared 
              (respecting privacy and agency).
            </p>
            <p>
              <strong>3. Story Capture:</strong> Qualifying conversations are transformed into newsroom articles 
              with proper attribution and community context.
            </p>
            <p>
              <strong>4. Democratic Governance:</strong> Community votes on story validation and featuring 
              through transparent democratic processes.
            </p>
            <p>
              <strong>5. Publication & Amplification:</strong> Approved stories are published to the newsroom 
              and amplified through IVOR social sharing.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}