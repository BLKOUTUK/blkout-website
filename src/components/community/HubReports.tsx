'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, Users, MessageSquare, Target, Calendar, 
  ExternalLink, ArrowRight, Award, Sparkles, Globe,
  BarChart3, Clock, MapPin
} from 'lucide-react'
import MagazineLayout from '../magazine/MagazineLayout'

interface WeeklyReport {
  week: string
  date: string
  highlights: string[]
  stats: {
    newMembers: number
    discussions: number
    projects: number
    events: number
  }
  featured: {
    title: string
    description: string
    participants: number
    outcome?: string
  }
}

interface MonthlyReport {
  month: string
  year: number
  summary: string
  keyAchievements: string[]
  growthMetrics: {
    members: { current: number, growth: string }
    projects: { completed: number, active: number }
    resources: { created: number, downloaded: number }
  }
  spotlight: {
    title: string
    description: string
    impact: string
    location?: string
  }
}

const weeklyReports: WeeklyReport[] = [
  {
    week: 'Week of January 6',
    date: '2025-01-06',
    highlights: [
      'Oakland cleaning cooperative launches with 8 worker-owners',
      'Mutual aid resource database reaches 500+ listings',
      'New discussion: "Cooperative Business Models for Creative Workers"'
    ],
    stats: {
      newMembers: 12,
      discussions: 34,
      projects: 3,
      events: 2
    },
    featured: {
      title: 'Worker Cooperative Launch',
      description: 'Community-supported cleaning cooperative in Oakland officially opens',
      participants: 45,
      outcome: 'First contracts secured, democratic governance structure established'
    }
  },
  {
    week: 'Week of December 30',
    date: '2024-12-30',
    highlights: [
      'Year-end community reflection session drew 67 participants',
      'New resource: "Fundraising for Cooperatives" guide published',
      'Community land trust project in Detroit gains momentum'
    ],
    stats: {
      newMembers: 8,
      discussions: 28,
      projects: 5,
      events: 1
    },
    featured: {
      title: 'Year-End Reflection',
      description: 'Community gathering to celebrate achievements and plan for 2025',
      participants: 67,
      outcome: 'Priorities set for Q1 2025, new working groups formed'
    }
  }
]

const monthlyReport: MonthlyReport = {
  month: 'December',
  year: 2024,
  summary: 'December was a month of reflection, celebration, and planning. The community came together to assess our collective achievements while laying groundwork for 2025 initiatives.',
  keyAchievements: [
    'Launched 3 new worker cooperatives across different cities',
    'Published comprehensive "State of the Movement" annual report',
    'Reached 500+ members milestone in BLKOUTHUB',
    'Completed mutual aid resource database with national coverage',
    'Established 5 new community land trust projects'
  ],
  growthMetrics: {
    members: { current: 127, growth: '+23%' },
    projects: { completed: 12, active: 18 },
    resources: { created: 47, downloaded: 2340 }
  },
  spotlight: {
    title: 'Detroit Community Land Trust',
    description: 'Residents organizing to create community-controlled affordable housing and prevent displacement',
    impact: '15 properties secured, 40+ families protected from gentrification',
    location: 'Detroit, MI'
  }
}

export default function HubReports() {
  return (
    <MagazineLayout
      title="Community Reports"
      subtitle="Regular updates from BLKOUTHUB activity and achievements"
    >
      <div className="py-8">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-5xl mb-6"
          >
            📊
          </motion.div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Movement in Motion
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Regular reports from BLKOUTHUB show how individual actions become collective power. 
            See the real impact of community organizing and cooperative development.
          </p>
        </motion.section>

        {/* Monthly Spotlight */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-electric-magenta/10 to-electric-cyan/10 rounded-2xl p-8 border border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-electric-magenta rounded-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Monthly Report</h2>
                <p className="text-gray-600">{monthlyReport.month} {monthlyReport.year}</p>
              </div>
            </div>

            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              {monthlyReport.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-white rounded-xl">
                <div className="text-3xl font-bold text-electric-magenta">
                  {monthlyReport.growthMetrics.members.current}
                </div>
                <div className="text-sm text-gray-600">Active Members</div>
                <div className="text-xs text-electric-green font-semibold">
                  {monthlyReport.growthMetrics.members.growth}
                </div>
              </div>
              
              <div className="text-center p-4 bg-white rounded-xl">
                <div className="text-3xl font-bold text-electric-cyan">
                  {monthlyReport.growthMetrics.projects.completed}
                </div>
                <div className="text-sm text-gray-600">Projects Completed</div>
                <div className="text-xs text-gray-500">
                  {monthlyReport.growthMetrics.projects.active} active
                </div>
              </div>
              
              <div className="text-center p-4 bg-white rounded-xl">
                <div className="text-3xl font-bold text-electric-indigo">
                  {monthlyReport.growthMetrics.resources.downloaded}
                </div>
                <div className="text-sm text-gray-600">Resource Downloads</div>
                <div className="text-xs text-gray-500">
                  {monthlyReport.growthMetrics.resources.created} new resources
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Key Achievements</h3>
                <ul className="space-y-2">
                  {monthlyReport.keyAchievements.map((achievement, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="flex items-start space-x-3"
                    >
                      <Sparkles className="w-4 h-4 text-electric-magenta mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{achievement}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Target className="w-5 h-5 text-electric-cyan" />
                  <h3 className="text-lg font-bold text-gray-900">Community Spotlight</h3>
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-2">
                  {monthlyReport.spotlight.title}
                </h4>
                
                {monthlyReport.spotlight.location && (
                  <div className="flex items-center space-x-1 mb-3 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{monthlyReport.spotlight.location}</span>
                  </div>
                )}
                
                <p className="text-gray-700 mb-3 leading-relaxed">
                  {monthlyReport.spotlight.description}
                </p>
                
                <div className="p-3 bg-electric-green/10 rounded-lg">
                  <p className="text-sm font-semibold text-electric-green">
                    Impact: {monthlyReport.spotlight.impact}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Weekly Reports */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Weekly Updates</h2>
              <p className="text-gray-600">Regular pulse checks from the community</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-electric-magenta text-white rounded-lg hover:bg-electric-cyan transition-colors"
            >
              <span>All Reports</span>
              <ExternalLink className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="space-y-6">
            {weeklyReports.map((report, index) => (
              <motion.div
                key={report.week}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 + 0.5 }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{report.week}</h3>
                    <p className="text-gray-500 text-sm">{report.date}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-electric-magenta hover:bg-electric-magenta/10 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h4 className="font-semibold text-gray-900 mb-3">Weekly Highlights</h4>
                    <ul className="space-y-2">
                      {report.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-electric-cyan rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-semibold text-gray-900 mb-2">Featured: {report.featured.title}</h5>
                      <p className="text-gray-700 text-sm mb-2">{report.featured.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{report.featured.participants} participants</span>
                        </div>
                      </div>
                      {report.featured.outcome && (
                        <div className="mt-2 p-2 bg-electric-green/10 rounded text-sm text-electric-green">
                          <strong>Outcome:</strong> {report.featured.outcome}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">This Week's Numbers</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">New Members</span>
                        <span className="font-bold text-electric-magenta">{report.stats.newMembers}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Discussions</span>
                        <span className="font-bold text-electric-cyan">{report.stats.discussions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">New Projects</span>
                        <span className="font-bold text-electric-indigo">{report.stats.projects}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Events</span>
                        <span className="font-bold text-electric-green">{report.stats.events}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Join CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-electric-cyan to-electric-indigo rounded-2xl p-12 text-white">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-5xl mb-6"
            >
              📈
            </motion.div>
            
            <h2 className="text-3xl font-bold mb-4">
              Be Part of the Data
            </h2>
            
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              These achievements happen because community members like you take action. 
              Join BLKOUTHUB and contribute to next week's report.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center space-x-2 px-8 py-4 bg-white text-electric-cyan rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                <span>Join BLKOUTHUB</span>
                <ExternalLink className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center space-x-2 px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-electric-cyan transition-colors font-semibold"
              >
                <span>Subscribe to Updates</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.section>
      </div>
    </MagazineLayout>
  )
}