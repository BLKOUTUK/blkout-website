import { useState, useEffect } from 'react'

// N8N Workflow status from monitoring
interface N8nWorkflow {
  id: string
  name: string
  status: 'active' | 'inactive' | 'error' | 'paused'
  last_run: string
  execution_time: string
  description: string
  triggers_today: number
  total_triggers: number
  success_rate: number
  next_run: string
  nodes: Array<{
    name: string
    type: string
    status: 'success' | 'error' | 'pending'
  }>
  error_handling?: {
    retry_count: number
    error_workflow?: string
    notification_webhook?: string
  }
}

interface N8nMonitoringData {
  workflows: N8nWorkflow[]
  total_workflows: number
  active_workflows: number
  total_executions_today: number
  average_success_rate: number
  last_update: string
}

export const useN8nMonitoring = () => {
  const [data, setData] = useState<N8nMonitoringData>({
    workflows: [],
    total_workflows: 0,
    active_workflows: 0,
    total_executions_today: 0,
    average_success_rate: 0,
    last_update: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchN8nData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // For now, load from static JSON (replace with API call when webhook is implemented)
        const response = await fetch('/src/data/n8n-workflow-monitoring.json')
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const jsonData = await response.json()
        const workflows = jsonData.workflows || []
        
        // Calculate aggregated metrics
        const activeWorkflows = workflows.filter((w: N8nWorkflow) => w.status === 'active').length
        const totalExecutionsToday = workflows.reduce((sum: number, w: N8nWorkflow) => sum + w.triggers_today, 0)
        const averageSuccessRate = workflows.length > 0 
          ? workflows.reduce((sum: number, w: N8nWorkflow) => sum + w.success_rate, 0) / workflows.length
          : 0

        setData({
          workflows,
          total_workflows: workflows.length,
          active_workflows: activeWorkflows,
          total_executions_today: totalExecutionsToday,
          average_success_rate: Math.round(averageSuccessRate * 10) / 10,
          last_update: new Date().toISOString()
        })
        
      } catch (err) {
        console.error('Failed to fetch N8N monitoring data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
        
        // Fallback to current mock data structure
        setData({
          workflows: [
            {
              id: 'blkout_main_workflow',
              name: 'Content Calendar Automation',
              status: 'active',
              last_run: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
              execution_time: '2.3s',
              description: 'Automated content distribution across platforms every Monday at 8 AM',
              triggers_today: 1,
              total_triggers: 24,
              success_rate: 98.5,
              next_run: 'Monday 8:00 AM',
              nodes: [
                { name: 'Schedule Trigger', type: 'cron', status: 'success' },
                { name: 'Fetch Content', type: 'googleSheets', status: 'success' },
                { name: 'Post to Social', type: 'httpRequest', status: 'success' },
                { name: 'BLKOUT Monitor', type: 'httpRequest', status: 'success' }
              ]
            },
            {
              id: 'blkout_community_monitoring_workflow',
              name: 'Community Health Monitoring',
              status: 'active',
              last_run: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
              execution_time: '1.8s',
              description: 'Engagement tracking and community analytics every 2 hours',
              triggers_today: 12,
              total_triggers: 156,
              success_rate: 99.2,
              next_run: 'Every 2 hours',
              nodes: [
                { name: 'Interval Trigger', type: 'interval', status: 'success' },
                { name: 'Fetch Data', type: 'httpRequest', status: 'success' },
                { name: 'Analyze Metrics', type: 'code', status: 'success' },
                { name: 'BLKOUT Monitor', type: 'httpRequest', status: 'success' }
              ]
            },
            {
              id: 'blkout_emergent_response_workflow',
              name: 'Real-time Community Response',
              status: 'active',
              last_run: new Date(Date.now() - 900000).toISOString(), // 15 mins ago
              execution_time: '0.8s',
              description: 'Handles community questions and emergent needs via webhooks',
              triggers_today: 8,
              total_triggers: 47,
              success_rate: 96.8,
              next_run: 'Webhook triggered',
              nodes: [
                { name: 'Webhook Trigger', type: 'webhook', status: 'success' },
                { name: 'Query IVOR AI', type: 'httpRequest', status: 'success' },
                { name: 'Send Response', type: 'httpRequest', status: 'success' },
                { name: 'BLKOUT Monitor', type: 'httpRequest', status: 'success' }
              ]
            }
          ],
          total_workflows: 3,
          active_workflows: 3,
          total_executions_today: 21,
          average_success_rate: 98.2,
          last_update: new Date().toISOString()
        })
      } finally {
        setLoading(false)
      }
    }

    // Initial fetch
    fetchN8nData()
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchN8nData, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  return { data, loading, error, refetch: () => {} }
}