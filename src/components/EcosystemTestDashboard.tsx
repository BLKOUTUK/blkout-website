// Ecosystem Test Dashboard
// Real-time testing interface for Website → Events → Newsroom → IVOR → Community flow

import { useState, useEffect } from 'react'
import { ecosystemTester, type FullEcosystemTest, type EcosystemTestResult } from '../services/ecosystemTester'

export default function EcosystemTestDashboard() {
  const [currentTest, setCurrentTest] = useState<FullEcosystemTest | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [testHistory, setTestHistory] = useState<FullEcosystemTest[]>([])
  const [showDetailedView, setShowDetailedView] = useState(false)

  useEffect(() => {
    // Load any existing test
    const existingTest = ecosystemTester.getCurrentTest()
    if (existingTest) {
      setCurrentTest(existingTest)
    }
  }, [])

  const runEcosystemTest = async () => {
    try {
      setIsRunning(true)
      const test = await ecosystemTester.runFullEcosystemTest()
      setCurrentTest(test)
      setTestHistory(prev => [test, ...prev.slice(0, 4)]) // Keep last 5 tests
    } catch (error) {
      console.error('Test run failed:', error)
      alert('Test run failed. Check console for details.')
    } finally {
      setIsRunning(false)
    }
  }

  const downloadTestReport = () => {
    if (!currentTest) return

    const report = ecosystemTester.generateTestReport(currentTest)
    const blob = new Blob([report], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `blkout-ecosystem-test-${currentTest.test_id}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      case 'running': return '⚡'
      default: return '❓'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'error': return 'text-red-600 bg-red-100'
      case 'running': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Ecosystem Flow Testing</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Comprehensive testing of the full BLKOUT ecosystem: Website → Events → Newsroom → IVOR → Community integration
          </p>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={runEcosystemTest}
              disabled={isRunning}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isRunning ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Running Test...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Run Full Ecosystem Test
                </>
              )}
            </button>

            {currentTest && (
              <button
                onClick={downloadTestReport}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Report
              </button>
            )}
          </div>
        </div>

        {/* Current Test Results */}
        {currentTest && (
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-white">
                    <span className="text-2xl mr-3">
                      {getStatusIcon(currentTest.overall_status)}
                    </span>
                    <div>
                      <h2 className="text-xl font-bold">
                        Current Test: {currentTest.test_id}
                      </h2>
                      <p className="text-indigo-100">
                        {currentTest.completed_at ? 'Completed' : 'Running'} • 
                        Success Rate: {currentTest.summary.success_rate.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right text-white">
                    <div className="text-sm text-indigo-100">Duration</div>
                    <div className="font-semibold">
                      {currentTest.total_duration_ms 
                        ? `${currentTest.total_duration_ms}ms`
                        : 'In Progress'
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Test Summary */}
              <div className="p-6 border-b">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {currentTest.summary.successful_steps}
                    </div>
                    <div className="text-gray-600">Successful</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">
                      {currentTest.summary.warning_steps}
                    </div>
                    <div className="text-gray-600">Warnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">
                      {currentTest.summary.error_steps}
                    </div>
                    <div className="text-gray-600">Errors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-600">
                      {currentTest.summary.total_steps}
                    </div>
                    <div className="text-gray-600">Total Steps</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-4 transition-all duration-500"
                      style={{ width: `${currentTest.summary.success_rate}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Test Steps */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Test Steps</h3>
                  <button
                    onClick={() => setShowDetailedView(!showDetailedView)}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    {showDetailedView ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>

                <div className="space-y-3">
                  {currentTest.steps.map((step, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-xl mr-3">{getStatusIcon(step.status)}</span>
                          <div>
                            <h4 className="font-medium text-gray-900">{step.step}</h4>
                            <p className="text-sm text-gray-600">{step.message}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(step.status)}`}>
                            {step.status.toUpperCase()}
                          </span>
                          {step.duration_ms && (
                            <div className="text-xs text-gray-500 mt-1">
                              {step.duration_ms}ms
                            </div>
                          )}
                        </div>
                      </div>

                      {showDetailedView && step.data && (
                        <div className="mt-3 pt-3 border-t bg-gray-50 rounded p-3">
                          <div className="text-xs font-medium text-gray-700 mb-2">Test Data:</div>
                          <pre className="text-xs text-gray-600 overflow-x-auto">
                            {JSON.stringify(step.data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Overall Status */}
        {currentTest && (
          <div className={`rounded-lg p-6 mb-8 ${
            currentTest.overall_status === 'success' 
              ? 'bg-green-100 border border-green-200'
              : currentTest.overall_status === 'warning'
              ? 'bg-yellow-100 border border-yellow-200'
              : currentTest.overall_status === 'error'
              ? 'bg-red-100 border border-red-200'
              : 'bg-blue-100 border border-blue-200'
          }`}>
            <div className="flex items-start">
              <span className="text-2xl mr-4">
                {getStatusIcon(currentTest.overall_status)}
              </span>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {currentTest.overall_status === 'success' && 'Ecosystem Fully Operational!'}
                  {currentTest.overall_status === 'warning' && 'Ecosystem Partially Operational'}
                  {currentTest.overall_status === 'error' && 'Ecosystem Issues Detected'}
                  {currentTest.overall_status === 'running' && 'Ecosystem Test in Progress'}
                </h3>
                
                <p className="text-sm mb-4">
                  {currentTest.overall_status === 'success' && 
                    '🎉 All ecosystem components are integrated and working correctly! The full Website → Events → Newsroom → IVOR → Community flow is operational.'
                  }
                  {currentTest.overall_status === 'warning' && 
                    '⚠️ Core ecosystem functionality is working, but some components have warnings that should be addressed.'
                  }
                  {currentTest.overall_status === 'error' && 
                    '❌ Critical ecosystem issues detected. Some components need immediate attention before full deployment.'
                  }
                  {currentTest.overall_status === 'running' && 
                    '⚡ Testing ecosystem integration... Please wait for completion.'
                  }
                </p>

                {currentTest.overall_status === 'success' && (
                  <div className="bg-white rounded p-3 text-sm">
                    <strong>Ready for Beta Launch:</strong> All integration tests passed. 
                    The BLKOUT ecosystem can successfully move community stories from events and IVOR conversations 
                    through democratic governance to social amplification.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Test History */}
        {testHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Test History</h3>
            <div className="space-y-3">
              {testHistory.map((test, index) => (
                <div key={test.test_id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">{getStatusIcon(test.overall_status)}</span>
                    <div>
                      <div className="font-medium">{test.test_id}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(test.started_at).toLocaleString()} • 
                        {test.total_duration_ms}ms • 
                        {test.summary.success_rate.toFixed(1)}% success
                      </div>
                    </div>
                  </div>
                  
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(test.overall_status)}`}>
                    {test.overall_status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-indigo-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-indigo-900 mb-3">About Ecosystem Testing</h3>
          <div className="text-indigo-800 text-sm space-y-2">
            <p>
              <strong>What it tests:</strong> This comprehensive test verifies the integration between all BLKOUT ecosystem components:
              Website services, Events calendar, Newsroom articles, IVOR AI conversations, Community governance, and Social amplification.
            </p>
            <p>
              <strong>Test Flow:</strong> Website connectivity → Events data → Newsroom articles → Story conversion → 
              IVOR story detection → Story capture → Governance integration → Social amplification → User journey simulation → Cross-service communication.
            </p>
            <p>
              <strong>Success Criteria:</strong> 80%+ success rate indicates the ecosystem is ready for beta launch with full community integration.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}