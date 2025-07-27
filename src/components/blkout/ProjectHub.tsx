import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Calendar, 
  FileText, 
  Video, 
  PenTool, 
  Bot, 
  Users, 
  ArrowRight,
  Heart,
  Target,
  Sparkles,
  Home,
  ExternalLink
} from 'lucide-react'

interface ProjectCardProps {
  title: string
  description: string
  status: 'active' | 'coming-soon'
  route: string
  icon: React.ReactNode
  color: string
  features: string[]
  isExternal?: boolean
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  title, 
  description, 
  status, 
  route, 
  icon, 
  color,
  features,
  isExternal = false
}) => {
  const isActive = status === 'active'
  
  const cardContent = (
    <motion.div
      whileHover={{ scale: isActive ? 1.02 : 1.01 }}
      className={`
        relative overflow-hidden rounded-2xl border-2 transition-all duration-300 h-full
        ${isActive 
          ? `border-${color}-400/50 bg-gradient-to-br from-${color}-500/10 to-${color}-600/5 hover:border-${color}-400` 
          : 'border-gray-600/30 bg-gray-800/30 hover:border-gray-500/50'
        }
      `}
    >
      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${isActive ? `bg-${color}-500/20` : 'bg-gray-700/50'}`}>
            {icon}
          </div>
          <div className="flex items-center gap-2">
            {isExternal && isActive && <ExternalLink className="w-4 h-4 text-gray-400" />}
            <div className={`
              px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider
              ${isActive 
                ? `bg-${color}-500/20 text-${color}-300` 
                : 'bg-gray-700/50 text-gray-400'
              }
            `}>
              {status === 'active' ? 'Live' : 'Coming Soon'}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2 heading-block">{title}</h3>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">{description}</p>
          
          {/* Features */}
          <ul className="space-y-2 mb-6">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center text-xs text-gray-400">
                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${isActive ? `bg-${color}-400` : 'bg-gray-600'}`} />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Action */}
        {isActive && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
              bg-${color}-500 hover:bg-${color}-600 text-white font-bold transition-all cursor-pointer
            `}
          >
            Access {title}
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        )}
        
        {!isActive && (
          <div className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-700 text-gray-400 font-bold cursor-not-allowed">
            Coming Soon
            <Sparkles className="w-4 h-4" />
          </div>
        )}
      </div>
    </motion.div>
  )

  if (isActive) {
    if (isExternal) {
      return (
        <a href={route} target="_blank" rel="noopener noreferrer" className="block h-full">
          {cardContent}
        </a>
      )
    } else {
      return (
        <Link to={route} className="block h-full">
          {cardContent}
        </Link>
      )
    }
  }

  return cardContent
}

const ProjectHub: React.FC = () => {
  const projects: ProjectCardProps[] = [
    {
      title: 'IVOR AI',
      description: 'Your personal community intelligence assistant. Get personalized opportunities, connect with community members, and access liberation-focused resources.',
      status: 'active',
      route: '/ivor',
      icon: <Bot className="w-6 h-6 text-blue-400" />,
      color: 'blue',
      features: [
        'Personalized liberation pathways',
        'Community opportunity matching',
        'AI-powered resource discovery',
        'Real-time support & guidance'
      ]
    },
    {
      title: 'Events Calendar',
      description: 'Discover Black QTIPOC+ events across the UK. Community-curated, automatically updated, and focused on spaces where we can be authentic.',
      status: 'active',
      route: '/events',
      icon: <Calendar className="w-6 h-6 text-yellow-400" />,
      color: 'yellow',
      features: [
        'Multi-source event aggregation',
        'Community moderation & verification',
        'Advanced filtering & search',
        'Calendar integration & reminders'
      ]
    },
    {
      title: 'Newsroom',
      description: 'Community-owned news aggregation and analysis. Liberation-focused journalism that centers Black queer voices and experiences.',
      status: 'active',
      route: '/newsroom',
      icon: <FileText className="w-6 h-6 text-green-400" />,
      color: 'green',
      features: [
        'Curated liberation news',
        'Community analysis & commentary',
        'RSS feed integration',
        'Democratic editorial process'
      ]
    },
    {
      title: 'Channel BLKOUT',
      description: 'Community video platform for education, celebration, and connection. Stories by us, for us, amplifying Black queer creativity and wisdom.',
      status: 'coming-soon',
      route: '/media/channel',
      icon: <Video className="w-6 h-6 text-purple-400" />,
      color: 'purple',
      features: [
        'Community video submissions',
        'Educational content library',
        'Live streaming capabilities',
        'Creator support & revenue sharing'
      ]
    },
    {
      title: 'Storylab',
      description: 'Share your story, connect through narrative. A space for authentic community storytelling - from everyday realness to transformation.',
      status: 'coming-soon',
      route: '/media/storylab',
      icon: <PenTool className="w-6 h-6 text-pink-400" />,
      color: 'pink',
      features: [
        'Multi-format story sharing',
        'Community response & dialogue',
        'Anonymous & attributed options',
        'Collaborative storytelling tools'
      ]
    },
    {
      title: 'Community Hub',
      description: 'For Black queer men: Private community spaces, peer support networks, and collective action opportunities through BLKOUTHUB.',
      status: 'active',
      route: 'https://heartbeat.chat', // External link to actual community
      isExternal: true,
      icon: <Users className="w-6 h-6 text-orange-400" />,
      color: 'orange',
      features: [
        'Private community access',
        'Peer support networks',
        'Collective action coordination',
        'Leadership development'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blkout-primary/20 to-blkout-warm/20 border-b border-white/10">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center space-y-6"
          >
            <div className="inline-block bg-gradient-to-r from-blkout-primary to-blkout-warm rounded-full px-6 py-2 mb-4">
              <span className="text-white font-mono text-sm uppercase tracking-widest font-bold">
                Your Liberation Toolkit
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight heading-block">
              BLKOUT PROJECTS
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Welcome to your community platform. Choose your tools for connection, 
              growth, and collective liberation.
            </p>
            
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-400" />
                <span className="text-gray-400">Built by community</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400">Owned by community</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-400">Serving liberation</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 * index }}
              className="h-full"
            >
              <ProjectCard {...project} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Footer Actions */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="space-y-8"
        >
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-4 heading-block">
              New to BLKOUT?
            </h3>
            <p className="text-gray-300 mb-6">
              Want to understand our vision and discover your liberation pathway? 
              Experience our full journey from the beginning.
            </p>
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blkout-primary to-blkout-warm px-8 py-3 rounded-lg text-white font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
              >
                <Home className="w-4 h-4" />
                Experience the Full Journey
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProjectHub