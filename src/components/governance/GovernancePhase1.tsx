import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Vote, Users, Scale, Heart, MessageSquare, FileText, Shield, Award } from 'lucide-react'

const GovernancePhase1 = () => {
  const governanceAreas = [
    {
      id: 1,
      icon: Vote,
      title: "Community Voting",
      description: "Democratic decision-making on platform features, content guidelines, and partnership decisions",
      status: "Active",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 2,
      icon: FileText,
      title: "Proposals",
      description: "Submit and discuss ideas for platform improvements and community initiatives",
      status: "Open",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      id: 3,
      icon: Users,
      title: "Working Groups",
      description: "Safety, Content, Tech, and Community Organizing committees",
      status: "Recruiting",
      color: "from-purple-500 to-purple-600"
    },
    {
      id: 4,
      icon: Shield,
      title: "Transparency",
      description: "Open budget, decision logs, and community impact reports",
      status: "Updated",
      color: "from-amber-500 to-amber-600"
    }
  ]

  const coreValues = [
    {
      icon: Heart,
      title: "Cooperative Ownership",
      description: "Community-owned platform with democratic control over decisions and resources"
    },
    {
      icon: Scale,
      title: "Democratic Governance",
      description: "Every member has a voice in platform decisions through transparent voting processes"
    },
    {
      icon: Users,
      title: "Community Accountability",
      description: "Shared responsibility for maintaining safe, inclusive spaces for liberation"
    },
    {
      icon: Award,
      title: "Values-First Development",
      description: "All platform changes prioritize community needs over profit or growth metrics"
    }
  ]

  const statusColors = {
    "Active": "bg-green-600 text-green-100",
    "Open": "bg-blue-600 text-blue-100", 
    "Recruiting": "bg-purple-600 text-purple-100",
    "Updated": "bg-amber-600 text-amber-100"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-950 to-indigo-950">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center items-center gap-3 mb-6">
            <Scale className="w-12 h-12 text-purple-400" />
            <h1 className="text-5xl font-black text-white">
              Democratic <span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">Governance</span>
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Community-owned decision making. BLKOUT operates on principles of cooperative ownership and democratic governance.
          </p>
        </motion.div>

        {/* Governance Areas */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {governanceAreas.map((area, index) => {
            const IconComponent = area.icon
            return (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
                className="bg-white/5 rounded-xl p-8 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${area.color}`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[area.status as keyof typeof statusColors]}`}>
                    {area.status}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{area.title}</h3>
                <p className="text-gray-300 leading-relaxed">{area.description}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Community Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-2xl p-8 border border-purple-500/20 mb-12"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Democratic Values</h2>
            <p className="text-gray-300 text-lg">The principles that guide our community governance</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {coreValues.map((value, index) => {
              const IconComponent = value.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + (index * 0.1) }}
                  className="flex items-start gap-4"
                >
                  <div className="p-3 rounded-lg bg-purple-600/20 flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{value.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="bg-white/5 rounded-2xl p-8 border border-white/10 mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">How Democratic Governance Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">1. Discuss</h3>
              <p className="text-gray-300">Community members propose ideas and discuss implications together</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Vote className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">2. Vote</h3>
              <p className="text-gray-300">Democratic voting process with transparent results and participation tracking</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">3. Implement</h3>
              <p className="text-gray-300">Community decisions are implemented with progress updates and accountability</p>
            </div>
          </div>
        </motion.div>

        {/* Get Involved */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Get Involved in Governance</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Every community member has the power to shape BLKOUT's future through democratic participation
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-300">
              Join Working Group
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300">
              Submit Proposal
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300">
              View Current Votes
            </button>
          </div>
        </motion.div>

        {/* Back to Platform */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="text-center"
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-600 hover:bg-slate-700 text-white rounded-full transition-colors font-medium"
          >
            ← Back to Community Platform
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default GovernancePhase1