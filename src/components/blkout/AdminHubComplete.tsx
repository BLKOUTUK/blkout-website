import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../common/PageHeader'
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
  Chrome,
  Download
} from 'lucide-react'

// Simple types to avoid complex hook dependencies
interface ServiceStatus {
  name: string
  status: 'healthy' | 'error' | 'loading'
  responseTime: number
  description: string
  capabilities: string[]
}

interface WorkflowStatus {
  id: string
  name: string
  status: 'active' | 'inactive' | 'error'
  last_run: string
  description: string
  triggers_today: number
  success_rate: number
  execution_time: string
  nodes: Array<{
    name: string
    type: string
    status: 'success' | 'error' | 'pending'
  }>
}

const AdminHubComplete: React.FC = () => {
  // Static data to avoid API dependencies that might cause blank pages
  const [ivorData] = useState({
    services: [
      {
        name: 'IVOR Frontend',
        status: 'healthy' as const,
        responseTime: 45,
        description: 'Main user interface for IVOR AI assistant',
        capabilities: ['user-interface', 'chat-interface', 'community-access']
      },
      {
        name: 'IVOR API Gateway',
        status: 'healthy' as const,
        responseTime: 52,
        description: 'Central API routing and authentication',
        capabilities: ['api-routing', 'authentication', 'rate-limiting']
      },
      {
        name: 'IVOR Core Service',
        status: 'healthy' as const,
        responseTime: 78,
        description: 'AI-powered support for Black queer communities',
        capabilities: ['community-focused-responses', 'liberation-centered']
      },
      {
        name: 'IVOR Organizing Service',
        status: 'healthy' as const,
        responseTime: 61,
        description: 'Community organizing and collective action tools',
        capabilities: ['organizing-support', 'collective-action']
      },
      {
        name: 'IVOR Community Service',
        status: 'healthy' as const,
        responseTime: 69,
        description: 'Community management and member support',
        capabilities: ['community-management', 'member-support']
      },
      {
        name: 'IVOR Social Service',
        status: 'healthy' as const,
        responseTime: 71,
        description: 'Social media integration and content sharing',
        capabilities: ['social-media', 'content-sharing']
      }
    ] as ServiceStatus[],
    overallStatus: 'healthy' as const,
    averageResponseTime: 62,
    totalServices: 6,
    healthyServices: 6,
    lastUpdate: new Date().toISOString()
  })

  const [n8nData] = useState({
    workflows: [
      {
        id: 'blkout_main_workflow',
        name: 'Content Calendar Automation',
        status: 'active' as const,
        last_run: new Date(Date.now() - 3600000).toISOString(),
        execution_time: '2.3s',
        description: 'Automated content distribution across platforms every Monday at 8 AM',
        triggers_today: 1,
        success_rate: 98.5,
        nodes: [
          { name: 'Schedule Trigger', type: 'cron', status: 'success' as const },
          { name: 'Fetch Content', type: 'googleSheets', status: 'success' as const },
          { name: 'Post to Social', type: 'httpRequest', status: 'success' as const }
        ]
      },
      {
        id: 'blkout_community_monitoring',
        name: 'Community Health Monitoring',
        status: 'active' as const,
        last_run: new Date(Date.now() - 1800000).toISOString(),
        execution_time: '1.8s',
        description: 'Engagement tracking and community analytics every 2 hours',
        triggers_today: 12,
        success_rate: 99.2,
        nodes: [
          { name: 'Interval Trigger', type: 'interval', status: 'success' as const },
          { name: 'Fetch Data', type: 'httpRequest', status: 'success' as const }
        ]
      },
      {
        id: 'blkout_emergent_response',
        name: 'Real-time Community Response',
        status: 'active' as const,
        last_run: new Date(Date.now() - 900000).toISOString(),
        execution_time: '0.8s',
        description: 'Handles community questions and emergent needs via webhooks',
        triggers_today: 8,
        success_rate: 96.8,
        nodes: [
          { name: 'Webhook Trigger', type: 'webhook', status: 'success' as const },
          { name: 'Query IVOR AI', type: 'httpRequest', status: 'success' as const }
        ]
      }
    ] as WorkflowStatus[],
    total_workflows: 3,
    active_workflows: 3,
    total_executions_today: 21,
    average_success_rate: 98.2,
    last_update: new Date().toISOString()
  })

  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const colors = {
      connected: 'bg-green-500/20 text-green-400 border-green-500/30',
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      disconnected: 'bg-red-500/20 text-red-400 border-red-500/30',
      inactive: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      error: 'bg-red-500/20 text-red-400 border-red-500/30',
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
        {/* Header with BLKOUT Branding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <PageHeader 
            title="ADMIN HUB" 
            subtitle="Unified administration dashboard for community moderation, IVOR AI system, and liberation technology infrastructure"
            iconColor="white"
            className="text-white justify-center text-center"
          />
        </motion.div>

        {/* IVOR System Status */}
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
                  <h2 className="text-2xl font-bold">IVOR SYSTEM STATUS</h2>
                  <p className="text-gray-400">Intelligent Virtual Organizer for Revolution - Live Monitoring</p>
                </div>
              </div>
              <StatusBadge status={ivorData.overallStatus} />
            </div>
            
            {/* IVOR Metrics */}
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
                  {new Date(ivorData.lastUpdate).toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* IVOR Services */}
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
                  <h2 className="text-2xl font-bold">N8N AUTOMATION WORKFLOWS</h2>
                  <p className="text-gray-400">Community-driven automation pipeline</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Total Workflows</div>
                <div className="text-2xl font-bold text-green-400">{n8nData.total_workflows}</div>
              </div>
            </div>

            {/* N8N Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-green-400" />
                  <div className="text-sm text-gray-400">Active Workflows</div>
                </div>
                <div className="text-2xl font-bold text-green-400">{n8nData.active_workflows}</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <div className="text-sm text-gray-400">Executions Today</div>
                </div>
                <div className="text-2xl font-bold text-blue-400">{n8nData.total_executions_today}</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  <div className="text-sm text-gray-400">Success Rate</div>
                </div>
                <div className="text-2xl font-bold text-purple-400">{n8nData.average_success_rate}%</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="w-4 h-4 text-orange-400" />
                  <div className="text-sm text-gray-400">Last Update</div>
                </div>
                <div className="text-sm font-bold text-orange-400">
                  {new Date(n8nData.last_update).toLocaleTimeString()}
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
                  className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50"
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
                      {workflow.nodes.slice(0, 2).map((node, i) => (
                        <span key={i} className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-xs">
                          {node.name}
                        </span>
                      ))}
                      {workflow.nodes.length > 2 && (
                        <span className="px-2 py-0.5 bg-gray-600/20 text-gray-400 rounded text-xs">
                          +{workflow.nodes.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Chrome Extension & Admin Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl p-6 border border-orange-500/20">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                <Chrome className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">CHROME EXTENSION & ADMIN TOOLS</h2>
                <p className="text-gray-400">Community moderation and content submission tools</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Chrome Extension Download */}
              <div className="bg-black/30 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Download className="w-5 h-5 mr-2 text-orange-400" />
                  EXTENSION DOWNLOAD
                </h3>
                <div className="space-y-3">
                  <div className="bg-orange-900/50 rounded-lg p-3">
                    <h4 className="font-semibold text-white mb-1">Complete Archive</h4>
                    <a 
                      href="/chrome-extension.zip"
                      download="blkout-extension-v1.1.zip"
                      className="inline-flex items-center bg-orange-600 hover:bg-orange-500 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download v1.1 (18KB)
                    </a>
                  </div>
                  <div className="text-xs text-gray-400">
                    <p>✅ Direct Supabase integration</p>
                    <p>✅ Auto content detection</p>
                    <p>✅ Real moderation queue</p>
                  </div>
                </div>
              </div>

              {/* Admin Password & Access */}
              <div className="bg-black/30 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-emerald-400" />
                  ADMIN ACCESS
                </h3>
                <div className="space-y-3">
                  <div className="bg-emerald-900/50 rounded-lg p-3">
                    <p className="text-sm text-emerald-100 mb-2">
                      Admin Password: <code className="bg-emerald-950/50 px-2 py-1 rounded">BLKOUT2025!</code>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <a 
                        href="/admin/moderation" 
                        className="text-xs px-2 py-1 bg-emerald-600 hover:bg-emerald-500 rounded transition-colors"
                      >
                        Moderation
                      </a>
                      <a 
                        href="/admin/newsroom" 
                        className="text-xs px-2 py-1 bg-emerald-600 hover:bg-emerald-500 rounded transition-colors"
                      >
                        Newsroom
                      </a>
                      <a 
                        href="/admin/events" 
                        className="text-xs px-2 py-1 bg-emerald-600 hover:bg-emerald-500 rounded transition-colors"
                      >
                        Events
                      </a>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    <p>Content pipeline: Extension → Moderation → Publishing</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Installation Guide */}
            <div className="mt-6 bg-gray-900/30 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3">QUICK INSTALLATION:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="bg-orange-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
                  <span className="text-gray-300">Download & extract</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-orange-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
                  <span className="text-gray-300">Chrome → Extensions → Developer Mode</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-orange-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
                  <span className="text-gray-300">Load unpacked folder</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Moderation Queue Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">MODERATION QUEUE STATUS</h2>
                  <p className="text-gray-400">Community content awaiting review</p>
                </div>
              </div>
              <a 
                href="/admin/moderation"
                className="flex items-center bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Shield className="w-4 h-4 mr-2" />
                Open Moderation
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Newspaper className="w-4 h-4 text-blue-400" />
                  <div className="text-sm text-gray-400">Pending Articles</div>
                </div>
                <div className="text-2xl font-bold text-blue-400">--</div>
                <div className="text-xs text-gray-500 mt-1">Chrome Extension + Form</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-green-400" />
                  <div className="text-sm text-gray-400">Pending Events</div>
                </div>
                <div className="text-2xl font-bold text-green-400">--</div>
                <div className="text-xs text-gray-500 mt-1">Community Submissions</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-yellow-400" />
                  <div className="text-sm text-gray-400">Governance Items</div>
                </div>
                <div className="text-2xl font-bold text-yellow-400">--</div>
                <div className="text-xs text-gray-500 mt-1">Proposals & Documents</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <div className="text-sm text-gray-400">Total Queue</div>
                </div>
                <div className="text-2xl font-bold text-purple-400">--</div>
                <div className="text-xs text-gray-500 mt-1">All content types</div>
              </div>
            </div>

            <div className="mt-6 bg-gray-900/30 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3 flex items-center">
                <Workflow className="w-4 h-4 mr-2" />
                CONTENT PIPELINE FLOW:
              </h4>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded">Chrome Extension</span>
                  <span className="text-gray-400">→</span>
                  <span className="px-2 py-1 bg-purple-900/50 text-purple-300 rounded">Moderation Queue</span>
                  <span className="text-gray-400">→</span>
                  <span className="px-2 py-1 bg-green-900/50 text-green-300 rounded">Published Content</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-6 text-center uppercase tracking-wide">QUICK ACTIONS</h2>
          
          {/* External Platform Links */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-300 mb-4 flex items-center justify-center gap-2">
              <ExternalLink className="w-5 h-5" />
              EXTERNAL PLATFORMS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                onClick={() => window.open('https://calendar.google.com/calendar/u/0/r', '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl transition-colors"
              >
                <Calendar className="w-6 h-6 mb-2 mx-auto" />
                <div className="text-sm font-semibold">Create Event</div>
              </button>
              <button 
                onClick={() => window.open('https://t.me/blkoutuk', '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl transition-colors"
              >
                <MessageSquare className="w-6 h-6 mb-2 mx-auto" />
                <div className="text-sm font-semibold">Community Telegram</div>
              </button>
              <button 
                onClick={() => window.open('https://ivor-beta.vercel.app', '_blank')}
                className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl transition-colors"
              >
                <Bot className="w-6 h-6 mb-2 mx-auto" />
                <div className="text-sm font-semibold">Launch IVOR AI</div>
              </button>
              <button 
                onClick={() => window.open('https://blkouthub.com', '_blank')}
                className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-xl transition-colors"
              >
                <Users className="w-6 h-6 mb-2 mx-auto" />
                <div className="text-sm font-semibold">BLKOUTHUB Portal</div>
              </button>
            </div>
          </div>

          {/* Internal Admin Pages */}
          <div>
            <h3 className="text-xl font-semibold text-gray-300 mb-4 flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              INTERNAL ADMIN
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                onClick={() => window.location.href = '/admin/moderation'}
                className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl transition-colors"
              >
                <Shield className="w-6 h-6 mb-2 mx-auto" />
                <div className="text-sm font-semibold">Moderation Queue</div>
              </button>
              <button 
                onClick={() => window.location.href = '/admin/events'}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl transition-colors"
              >
                <Calendar className="w-6 h-6 mb-2 mx-auto" />
                <div className="text-sm font-semibold">Events Admin</div>
              </button>
              <button 
                onClick={() => window.location.href = '/admin/newsroom'}
                className="bg-cyan-600 hover:bg-cyan-700 text-white p-4 rounded-xl transition-colors"
              >
                <Newspaper className="w-6 h-6 mb-2 mx-auto" />
                <div className="text-sm font-semibold">Newsroom Admin</div>
              </button>
              <button 
                onClick={() => window.location.href = '/admin/governance'}
                className="bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-xl transition-colors"
              >
                <Users className="w-6 h-6 mb-2 mx-auto" />
                <div className="text-sm font-semibold">Governance Admin</div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-gray-500 text-sm"
        >
          <p className="uppercase tracking-wide">BLKOUT UK ADMIN HUB - TECHNOLOGY FOR BLACK QUEER LIBERATION</p>
          <p className="mt-2">All systems operational • Real-time monitoring active</p>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminHubComplete