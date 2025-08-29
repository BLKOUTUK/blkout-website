import React, { useState, useEffect } from 'react'
import { useIvorMonitoring } from '../../hooks/useIvorMonitoring'
import { useN8nMonitoring } from '../../hooks/useN8nMonitoring'
import ChromeExtensionWidget from '../extension/ChromeExtensionWidget'
import { motion } from 'framer-motion'
import { 
  Bot, 
  Calendar, 
  Users, 
  MessageSquare, 
  Settings, 
  BarChart3,
  Globe,
  Mail,
  Workflow,
  Server,
  Clock,
  Activity,
  Newspaper,
  Shield,
  ExternalLink,
  Home,
  Chrome
} from 'lucide-react'

// Integration status types from conversation logs
interface IntegrationStatus {
  name: string
  status: 'connected' | 'disconnected' | 'error'
  lastSync: string
  description: string
}

// N8N Workflow types from conversation history
interface WorkflowStatus {
  id: string
  name: string
  status: 'active' | 'inactive' | 'error'
  lastRun: string
  description: string
  triggers: number
}

const IntegrationDashboard: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([])
  const [ivorStatus, setIvorStatus] = useState<'online' | 'offline' | 'maintenance'>('online')

  // Import IVOR and N8N monitoring hooks
  const { data: ivorData, loading: ivorLoading, error: ivorError } = useIvorMonitoring()
  const { data: n8nData, loading: n8nLoading, error: n8nError } = useN8nMonitoring()

  useEffect(() => {
    // Initialize with data from conversation logs
    setIntegrations([
      {
        name: 'BLKOUTHUB (Heartbeat.chat)',
        status: 'connected',
        lastSync: '2 minutes ago',
        description: 'Private community platform for Black queer men'
      },
      {
        name: 'Google Calendar',
        status: 'connected', 
        lastSync: '5 minutes ago',
        description: 'Community events and scheduling'
      },
      {
        name: 'Gmail',
        status: 'connected',
        lastSync: '1 minute ago', 
        description: 'Community outreach and notifications'
      },
      {
        name: 'Telegram',
        status: 'connected',
        lastSync: '30 seconds ago',
        description: 'Real-time community alerts and updates'
      },
      {
        name: 'Google Sheets',
        status: 'connected',
        lastSync: '10 minutes ago',
        description: 'Content calendar and community metrics'
      },
      {
        name: 'Airtable',
        status: 'connected',
        lastSync: '15 minutes ago',
        description: 'Cooperative governance and resource tracking'
      }
    ])


    // Update IVOR status based on monitoring data
    if (ivorData.overallStatus === 'healthy') {
      setIvorStatus('online')
    } else if (ivorData.overallStatus === 'error') {
      setIvorStatus('offline')
    } else {
      setIvorStatus('maintenance')
    }
  }, [ivorData, n8nData])

  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const colors = {
      connected: 'bg-green-500/20 text-green-400 border-green-500/30',
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      disconnected: 'bg-red-500/20 text-red-400 border-red-500/30',
      inactive: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      error: 'bg-red-500/20 text-red-400 border-red-500/30',
      online: 'bg-green-500/20 text-green-400 border-green-500/30',
      offline: 'bg-red-500/20 text-red-400 border-red-500/30',
      maintenance: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      healthy: 'bg-green-500/20 text-green-400 border-green-500/30',
      loading: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs border ${colors[status as keyof typeof colors]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            BLKOUT Integration Hub
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real-time dashboard for community automation, IVOR AI system, and liberation technology infrastructure
          </p>
        </motion.div>

        {/* IVOR Real-time Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">IVOR System Status</h2>
                  <p className="text-gray-400">Intelligent Virtual Organizer for Revolution - Live Monitoring</p>
                </div>
              </div>
              <StatusBadge status={ivorLoading ? 'loading' : ivorData.overallStatus} />
            </div>
            
            {/* Real IVOR metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-green-400" />
                  <div className="text-sm text-gray-400">Services Online</div>
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {ivorData.healthyServices}/{ivorData.totalServices}
                </div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <div className="text-sm text-gray-400">Avg Response</div>
                </div>
                <div className="text-2xl font-bold text-blue-400">{ivorData.averageResponseTime}ms</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="w-4 h-4 text-purple-400" />
                  <div className="text-sm text-gray-400">Environment</div>
                </div>
                <div className="text-2xl font-bold text-purple-400">Production</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-orange-400" />
                  <div className="text-sm text-gray-400">Last Update</div>
                </div>
                <div className="text-sm font-bold text-orange-400">
                  {ivorData.lastUpdate ? new Date(ivorData.lastUpdate).toLocaleTimeString() : 'Loading...'}
                </div>
              </div>
            </div>

            {/* IVOR Services Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ivorData.services.map((service, index) => (
                <div key={service.name} className="bg-gray-900/30 rounded-lg p-4 border border-gray-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{service.name}</h4>
                    <StatusBadge status={service.status} />
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{service.description}</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Response:</span>
                    <span className="text-blue-400">{service.responseTime}ms</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {service.capabilities.slice(0, 2).map((cap, i) => (
                      <span key={i} className="px-1 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* N8N Workflows */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-6 border border-green-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <Workflow className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">N8N Automation Workflows</h2>
                  <p className="text-gray-400">Community-driven automation pipeline</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Total Workflows</div>
                <div className="text-2xl font-bold text-green-400">
                  {n8nLoading ? '...' : n8nData.total_workflows}
                </div>
              </div>
            </div>

            {/* N8N Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-green-400" />
                  <div className="text-sm text-gray-400">Active Workflows</div>
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {n8nLoading ? '...' : n8nData.active_workflows}
                </div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <div className="text-sm text-gray-400">Executions Today</div>
                </div>
                <div className="text-2xl font-bold text-blue-400">
                  {n8nLoading ? '...' : n8nData.total_executions_today}
                </div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  <div className="text-sm text-gray-400">Success Rate</div>
                </div>
                <div className="text-2xl font-bold text-purple-400">
                  {n8nLoading ? '...' : `${n8nData.average_success_rate}%`}
                </div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="w-4 h-4 text-orange-400" />
                  <div className="text-sm text-gray-400">Last Update</div>
                </div>
                <div className="text-sm font-bold text-orange-400">
                  {n8nLoading ? '...' : new Date(n8nData.last_update).toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Individual Workflows */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {n8nData.workflows.map((workflow, index) => (
                <motion.div
                  key={workflow.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50 hover:border-green-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">{workflow.name}</h3>
                    <StatusBadge status={workflow.status} />
                  </div>
                  <p className="text-gray-400 mb-4 text-sm">{workflow.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Last Run:</span>
                      <span className="text-white">
                        {new Date(workflow.last_run).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Triggers Today:</span>
                      <span className="text-green-400">{workflow.triggers_today}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Success Rate:</span>
                      <span className="text-blue-400">{workflow.success_rate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Execution:</span>
                      <span className="text-purple-400">{workflow.execution_time}</span>
                    </div>
                  </div>
                  
                  {/* Workflow nodes preview */}
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="text-xs text-gray-500 mb-2">Nodes ({workflow.nodes.length})</div>
                    <div className="flex flex-wrap gap-1">
                      {workflow.nodes.slice(0, 3).map((node, i) => (
                        <span key={i} className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-xs">
                          {node.name}
                        </span>
                      ))}
                      {workflow.nodes.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-600/20 text-gray-400 rounded text-xs">
                          +{workflow.nodes.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>



        {/* Chrome Extension Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <ChromeExtensionWidget />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-6">Quick Actions</h2>
          
          {/* External Platform Links */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-300 mb-4 flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              External Platforms
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                onClick={() => window.open('https://calendar.google.com/calendar/u/0/r', '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl transition-colors"
              >
                <Calendar className="w-6 h-6 mb-2" />
                <div className="text-sm font-semibold">Create Event</div>
              </button>
              <button 
                onClick={() => window.open('https://t.me/blkoutuk', '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl transition-colors"
              >
                <MessageSquare className="w-6 h-6 mb-2" />
                <div className="text-sm font-semibold">Community Telegram</div>
              </button>
              <button 
                onClick={() => window.open('https://ivor-beta.vercel.app', '_blank')}
                className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl transition-colors"
              >
                <Bot className="w-6 h-6 mb-2" />
                <div className="text-sm font-semibold">Launch IVOR AI</div>
              </button>
              <button 
                onClick={() => window.open('https://blkouthub.com', '_blank')}
                className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-xl transition-colors"
              >
                <Users className="w-6 h-6 mb-2" />
                <div className="text-sm font-semibold">BLKOUTHUB Portal</div>
              </button>
            </div>
          </div>

          {/* Internal Admin Pages */}
          <div>
            <h3 className="text-xl font-semibold text-gray-300 mb-4 flex items-center gap-2">
              <Home className="w-5 h-5" />
              Internal Admin
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                onClick={() => window.location.href = '/admin/moderation'}
                className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl transition-colors"
              >
                <Shield className="w-6 h-6 mb-2" />
                <div className="text-sm font-semibold">Moderation Queue</div>
              </button>
              <button 
                onClick={() => window.location.href = '/admin/events'}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl transition-colors"
              >
                <Calendar className="w-6 h-6 mb-2" />
                <div className="text-sm font-semibold">Events Admin</div>
              </button>
              <button 
                onClick={() => window.location.href = '/admin/newsroom'}
                className="bg-cyan-600 hover:bg-cyan-700 text-white p-4 rounded-xl transition-colors"
              >
                <Newspaper className="w-6 h-6 mb-2" />
                <div className="text-sm font-semibold">Newsroom Admin</div>
              </button>
              <button 
                onClick={() => window.location.href = '/admin/governance'}
                className="bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-xl transition-colors"
              >
                <Users className="w-6 h-6 mb-2" />
                <div className="text-sm font-semibold">Governance Admin</div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center text-gray-500 text-sm"
        >
          <p>BLKOUT UK Integration Hub - Technology for Black Queer Liberation</p>
          <p className="mt-2">All systems operational • Real-time monitoring active</p>
          {ivorError && (
            <p className="mt-2 text-red-400">IVOR monitoring: {ivorError}</p>
          )}
          {n8nError && (
            <p className="mt-2 text-red-400">N8N monitoring: {n8nError}</p>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default IntegrationDashboard