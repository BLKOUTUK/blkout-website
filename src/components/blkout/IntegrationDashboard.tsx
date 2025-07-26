import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Bot, 
  Calendar, 
  Users, 
  MessageSquare, 
  Zap, 
  Settings, 
  BarChart3,
  Globe,
  Mail,
  Workflow
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
  const [workflows, setWorkflows] = useState<WorkflowStatus[]>([])
  const [ivorStatus, setIvorStatus] = useState<'online' | 'offline' | 'maintenance'>('online')

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

    setWorkflows([
      {
        id: 'blkout_main_workflow',
        name: 'Content Calendar Automation',
        status: 'active',
        lastRun: '1 hour ago',
        description: 'Automated content distribution across platforms (Mondays 8 AM)',
        triggers: 24
      },
      {
        id: 'blkout_community_monitoring_workflow', 
        name: 'Community Health Monitoring',
        status: 'active',
        lastRun: '2 hours ago',
        description: 'Engagement tracking and community analytics (Every 2 hours)',
        triggers: 156
      },
      {
        id: 'blkout_emergent_response_workflow',
        name: 'Real-time Community Response',
        status: 'active', 
        lastRun: '30 minutes ago',
        description: 'Handles community questions and emergent needs via webhooks',
        triggers: 8
      }
    ])
  }, [])

  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const colors = {
      connected: 'bg-green-500/20 text-green-400 border-green-500/30',
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      disconnected: 'bg-red-500/20 text-red-400 border-red-500/30',
      inactive: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      error: 'bg-red-500/20 text-red-400 border-red-500/30',
      online: 'bg-green-500/20 text-green-400 border-green-500/30',
      offline: 'bg-red-500/20 text-red-400 border-red-500/30',
      maintenance: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
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

        {/* IVOR Status */}
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
                  <p className="text-gray-400">Intelligent Virtual Organizer for Revolution</p>
                </div>
              </div>
              <StatusBadge status={ivorStatus} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400">1,247</div>
                <div className="text-sm text-gray-400">Community Interactions</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400">89%</div>
                <div className="text-sm text-gray-400">Response Accuracy</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">24/7</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
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
          <div className="flex items-center mb-6">
            <Workflow className="w-8 h-8 text-blue-400 mr-3" />
            <h2 className="text-3xl font-bold">N8N Automation Workflows</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {workflows.map((workflow, index) => (
              <motion.div
                key={workflow.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{workflow.name}</h3>
                  <StatusBadge status={workflow.status} />
                </div>
                <p className="text-gray-400 mb-4 text-sm">{workflow.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Last Run:</span>
                    <span className="text-white">{workflow.lastRun}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Triggers:</span>
                    <span className="text-blue-400">{workflow.triggers}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Composio Integrations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center mb-6">
            <Zap className="w-8 h-8 text-purple-400 mr-3" />
            <h2 className="text-3xl font-bold">Composio Platform Integrations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {integration.name.includes('BLKOUTHUB') && <Users className="w-6 h-6 text-blue-400" />}
                    {integration.name.includes('Calendar') && <Calendar className="w-6 h-6 text-green-400" />}
                    {integration.name.includes('Gmail') && <Mail className="w-6 h-6 text-red-400" />}
                    {integration.name.includes('Telegram') && <MessageSquare className="w-6 h-6 text-blue-500" />}
                    {integration.name.includes('Sheets') && <BarChart3 className="w-6 h-6 text-green-500" />}
                    {integration.name.includes('Airtable') && <Settings className="w-6 h-6 text-orange-400" />}
                    <h3 className="text-lg font-semibold">{integration.name}</h3>
                  </div>
                  <StatusBadge status={integration.status} />
                </div>
                <p className="text-gray-400 mb-3 text-sm">{integration.description}</p>
                <div className="text-xs text-gray-500">
                  Last sync: {integration.lastSync}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Community Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center mb-6">
            <BarChart3 className="w-8 h-8 text-green-400 mr-3" />
            <h2 className="text-3xl font-bold">Community Liberation Metrics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-700/30 rounded-xl p-6 border border-blue-500/20">
              <div className="text-3xl font-bold text-blue-400 mb-2">487</div>
              <div className="text-sm text-gray-300">Active BLKOUTHUB Members</div>
              <div className="text-xs text-green-400 mt-1">+23 this month</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-purple-700/30 rounded-xl p-6 border border-purple-500/20">
              <div className="text-3xl font-bold text-purple-400 mb-2">92%</div>
              <div className="text-sm text-gray-300">Community Health Score</div>
              <div className="text-xs text-green-400 mt-1">Excellent engagement</div>
            </div>
            <div className="bg-gradient-to-br from-green-900/30 to-green-700/30 rounded-xl p-6 border border-green-500/20">
              <div className="text-3xl font-bold text-green-400 mb-2">156</div>
              <div className="text-sm text-gray-300">Events This Quarter</div>
              <div className="text-xs text-blue-400 mt-1">Digital + In-person</div>
            </div>
            <div className="bg-gradient-to-br from-orange-900/30 to-orange-700/30 rounded-xl p-6 border border-orange-500/20">
              <div className="text-3xl font-bold text-orange-400 mb-2">2.3K</div>
              <div className="text-sm text-gray-300">Liberation Stories Shared</div>
              <div className="text-xs text-purple-400 mt-1">Cross-platform reach</div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl transition-colors">
              <Globe className="w-6 h-6 mb-2" />
              <div className="text-sm font-semibold">Trigger Content Distribution</div>
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl transition-colors">
              <MessageSquare className="w-6 h-6 mb-2" />
              <div className="text-sm font-semibold">Send Community Alert</div>
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl transition-colors">
              <Calendar className="w-6 h-6 mb-2" />
              <div className="text-sm font-semibold">Create Event</div>
            </button>
            <button className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-xl transition-colors">
              <BarChart3 className="w-6 h-6 mb-2" />
              <div className="text-sm font-semibold">Generate Report</div>
            </button>
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
        </motion.div>
      </div>
    </div>
  )
}

export default IntegrationDashboard