'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, Send, Mic, FileText, Search, 
  Brain, Zap, Users, Heart, Shield, Target,
  ChevronDown, Play, ArrowRight, Sparkles,
  Database, Globe, Book, Headphones, AlertCircle
} from 'lucide-react'
import PrimaryNavigationEnhanced from '../layout/PrimaryNavigationEnhanced'
import PlatformFooter from '../layout/PlatformFooter'
import { ivorService, IVORResponse, IVORMessage } from '../../services/ivorService'

// IVOR Capabilities
const ivorCapabilities = [
  {
    id: 'resources',
    title: 'RESOURCE DISCOVERY',
    description: 'Find mental health support, housing assistance, legal aid, and community resources tailored to Black queer men.',
    icon: Search,
    gradient: 'from-emerald-500 to-indigo-600',
    examples: ['Mental health services near me', 'LGBTQ+ friendly housing options', 'Legal support for discrimination']
  },
  {
    id: 'community',
    title: 'COMMUNITY CONNECTION',
    description: 'Connect with peer support groups, community events, and local organizations that understand your experience.',
    icon: Users,
    gradient: 'from-indigo-500 to-violet-600',
    examples: ['Support groups in Manchester', 'Black Pride events this month', 'QTIPOC meetups near me']
  },
  {
    id: 'wellness',
    title: 'WELLNESS GUIDANCE',
    description: 'Get personalized wellness recommendations, self-care strategies, and crisis support resources.',
    icon: Heart,
    gradient: 'from-violet-500 to-emerald-600',
    examples: ['Dealing with workplace discrimination', 'Coming out support', 'Managing anxiety and depression']
  },
  {
    id: 'education',
    title: 'EDUCATIONAL CONTENT',
    description: 'Access curated learning materials on liberation theory, cooperative economics, and movement building.',
    icon: Book,
    gradient: 'from-slate-500 to-blue-600',
    examples: ['Cooperative business models', 'Understanding intersectionality', 'Community organizing basics']
  }
]

// IVOR Hero Section
const IVORHero = () => (
  <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-orange-950 via-orange-900 to-amber-900 overflow-hidden">
    {/* Background pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500 rounded-full blur-3xl"></div>
    </div>
    
    <div className="relative z-10 max-w-7xl mx-auto px-8 py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center mb-8"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-indigo-600 flex items-center justify-center mr-6">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black heading-block uppercase">
                <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
                  I.V.O.R.
                </span>
              </h1>
              <p className="text-indigo-300 font-mono uppercase tracking-wider text-sm">
                INTELLIGENT VIRTUAL ORGANIZING RESOURCE
              </p>
            </div>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl md:text-4xl font-black heading-block mb-6 leading-tight uppercase"
          >
            <span className="bg-gradient-to-r from-slate-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              YOUR AI-POWERED COMMUNITY ASSISTANT
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl text-indigo-100 leading-relaxed font-light mb-8 max-w-2xl"
          >
            IVOR understands the unique challenges facing Black queer men and provides 
            personalized support, resources, and connections to help you thrive in your journey toward liberation.
          </motion.p>

          {/* Status Indicator */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex items-center space-x-4 mb-8"
          >
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 font-bold heading-block text-sm uppercase">
                IVOR IS ONLINE
              </span>
            </div>
            <div className="text-indigo-300 text-sm font-light">
              Response time: ~2 seconds
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <motion.button 
              onClick={() => setShowChat(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-12 py-4 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-black text-lg hover:from-emerald-500 hover:to-indigo-500 transition-all duration-300 shadow-xl hover:shadow-2xl heading-block uppercase tracking-wide flex items-center justify-center"
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              START CONVERSATION
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-12 py-4 border-2 border-indigo-400 text-indigo-100 font-black text-lg hover:bg-indigo-400 hover:text-indigo-900 transition-all duration-300 heading-block uppercase tracking-wide flex items-center justify-center"
            >
              <Play className="w-6 h-6 mr-3" />
              WATCH DEMO
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Interactive Chat Preview */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="bg-indigo-900/50 backdrop-blur-sm border border-indigo-700/50 p-8 min-h-[500px]">
            <div className="flex items-center mb-6 pb-4 border-b border-indigo-700/30">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-indigo-600 flex items-center justify-center mr-4">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-black text-white heading-block">I.V.O.R.</h3>
                <p className="text-xs text-emerald-400">Online • Ready to help</p>
              </div>
            </div>
            
            {/* Sample Conversation */}
            <div className="space-y-4 mb-6">
              <div className="bg-indigo-800/50 p-4 max-w-xs">
                <p className="text-white font-light">
                  Hello! I'm IVOR, your community AI assistant. How can I support you today?
                </p>
              </div>
              <div className="bg-emerald-600/50 p-4 max-w-xs ml-auto">
                <p className="text-white font-light">
                  I'm looking for mental health resources that understand Black queer experiences
                </p>
              </div>
              <div className="bg-indigo-800/50 p-4 max-w-xs">
                <p className="text-white font-light">
                  I found 7 culturally affirming therapists in your area, plus 3 peer support groups. 
                  Would you like me to share contact details and meeting times?
                </p>
              </div>
            </div>
            
            {/* Input Field */}
            <div className="flex items-center space-x-3">
              <input
                type="text"
                placeholder="Ask IVOR anything..."
                className="flex-1 px-4 py-3 bg-indigo-950/50 border border-indigo-700/50 text-white placeholder-indigo-300 focus:outline-none focus:border-indigo-500 font-light"
                disabled
              />
              <button className="p-3 bg-emerald-600 text-white hover:bg-emerald-500 transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-indigo-400 mt-2 text-center">
              Interactive demo - Start a real conversation above
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
)

// IVOR Capabilities Section
const IVORCapabilities = () => (
  <section className="py-24 bg-orange-50/5 backdrop-blur-sm">
    <div className="max-w-6xl mx-auto px-8">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black heading-block mb-6 uppercase"
        >
          <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
            HOW IVOR
          </span>
          <span className="bg-gradient-to-r from-violet-400 to-slate-400 bg-clip-text text-transparent ml-4">
            HELPS YOU
          </span>
        </motion.h2>
        <p className="text-xl text-indigo-100 font-light leading-relaxed max-w-3xl mx-auto">
          Powered by community knowledge and designed for our specific needs and experiences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {ivorCapabilities.map((capability, index) => {
          const IconComponent = capability.icon
          
          return (
            <motion.div
              key={capability.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 p-8 hover:bg-indigo-900/50 transition-all duration-500 group"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${capability.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-black heading-block mb-4 uppercase">
                <span className={`bg-gradient-to-r ${capability.gradient} bg-clip-text text-transparent`}>
                  {capability.title}
                </span>
              </h3>
              
              <p className="text-indigo-100 mb-6 leading-relaxed font-light">
                {capability.description}
              </p>
              
              <div className="space-y-2">
                <p className="text-sm font-bold text-indigo-300 heading-block uppercase">
                  Example Questions:
                </p>
                {capability.examples.map((example, exIndex) => (
                  <div key={exIndex} className="flex items-center text-sm text-indigo-200">
                    <div className={`w-2 h-2 bg-gradient-to-r ${capability.gradient} mr-3`}></div>
                    "{example}"
                  </div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  </section>
)

// IVOR Features Section
const IVORFeatures = () => (
  <section className="py-24">
    <div className="max-w-6xl mx-auto px-8">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black heading-block mb-6 uppercase"
        >
          <span className="bg-gradient-to-r from-slate-400 to-indigo-400 bg-clip-text text-transparent">
            ADVANCED
          </span>
          <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent ml-4">
            FEATURES
          </span>
        </motion.h2>
        <p className="text-indigo-200 font-light text-lg">
          Built with privacy, security, and community needs at the center
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
          {
            icon: Shield,
            title: 'PRIVACY FIRST',
            description: 'Your conversations are encrypted and never stored. IVOR processes requests in real-time without saving personal data.',
            gradient: 'from-emerald-500 to-blue-600'
          },
          {
            icon: Database,
            title: 'COMMUNITY KNOWLEDGE',
            description: 'Trained on verified resources, peer-reviewed content, and community-contributed knowledge specific to our experiences.',
            gradient: 'from-indigo-500 to-violet-600'
          },
          {
            icon: Globe,
            title: 'LOCATION AWARE',
            description: 'Provides resources and connections based on your location, with coverage across the UK and expanding globally.',
            gradient: 'from-violet-500 to-emerald-600'
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="text-center"
          >
            <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} flex items-center justify-center mx-auto mb-6`}>
              <feature.icon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-black heading-block mb-4 uppercase">
              <span className={`bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                {feature.title}
              </span>
            </h3>
            <p className="text-indigo-100 leading-relaxed font-light">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Getting Started CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-br from-emerald-600 via-indigo-600 to-violet-600 p-16 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative z-10">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-6xl mb-8"
          >
            🤖
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-black text-white heading-block mb-6 uppercase">
            READY TO GET
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              STARTED?
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            IVOR is available 24/7 to provide support, resources, and connections. 
            Start your first conversation and experience AI built for our community.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.button
              onClick={() => setShowChat(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-12 py-4 bg-white text-indigo-900 font-black text-lg hover:bg-gray-100 transition-colors heading-block uppercase flex items-center justify-center"
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              TALK TO IVOR NOW
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-12 py-4 border-2 border-white text-white font-black text-lg hover:bg-white hover:text-indigo-900 transition-colors heading-block uppercase flex items-center justify-center"
            >
              <Headphones className="w-6 h-6 mr-3" />
              VOICE ASSISTANT
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
)

// Chat Interface Component
const IVORChatInterface = ({ backendStatus, pathwayContext, initialMessage }: { 
  backendStatus: string, 
  pathwayContext?: any, 
  initialMessage?: string 
}) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'ivor',
      content: pathwayContext 
        ? `Hello! I'm IVOR, your community AI assistant. I see you've just completed your liberation pathway assessment and discovered you're a ${pathwayContext.pathway}. That's exciting! I'm here to help you understand your pathway and connect you with resources, community, and opportunities that align with your journey. How can I support you today?`
        : "Hello! I'm IVOR, your community AI assistant. I'm here to help you find resources, connect with community, and support your journey. How can I assist you today?",
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState(initialMessage || '')
  const [isTyping, setIsTyping] = useState(false)

  // Auto-send initial message if pathway context is present
  React.useEffect(() => {
    if (initialMessage && pathwayContext && backendStatus === 'connected') {
      // Send the initial pathway message automatically after a brief delay
      setTimeout(() => {
        sendMessage()
      }, 2000)
    }
  }, [initialMessage, pathwayContext, backendStatus])

  const sendMessage = async () => {
    if (!inputMessage.trim() || backendStatus === 'offline') return

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    try {
      const response = await fetch('http://localhost:8000/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          context: pathwayContext ? {
            type: 'liberation_pathway',
            pathway: pathwayContext.pathway,
            focus: pathwayContext.focus,
            description: pathwayContext.description
          } : 'community_support'
        })
      })

      if (response.ok) {
        const data = await response.json()
        const ivorMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ivor',
          content: data.response || "I'm here to help! Could you tell me more about what you're looking for?",
          timestamp: new Date()
        }
        setMessages(prev => [...prev, ivorMessage])
      } else {
        throw new Error('Failed to get response')
      }
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ivor',
        content: "I'm having trouble connecting right now. Please try again in a moment, or check if the IVOR backend is running.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-8">
        <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 min-h-[600px] flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center p-6 border-b border-indigo-700/30">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-indigo-600 flex items-center justify-center mr-4">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-white heading-block text-lg uppercase">I.V.O.R. CHAT</h3>
              <div className="flex items-center space-x-3">
                {backendStatus === 'connected' && (
                  <>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-emerald-400 font-bold heading-block uppercase">ONLINE</span>
                  </>
                )}
                {backendStatus === 'offline' && (
                  <>
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <span className="text-xs text-amber-400 font-bold heading-block uppercase">OFFLINE</span>
                  </>
                )}
                {backendStatus === 'checking' && (
                  <>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-indigo-400 font-bold heading-block uppercase">CONNECTING</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-96">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-3 ${
                  message.type === 'user' 
                    ? 'bg-emerald-600/50 text-white ml-auto' 
                    : 'bg-indigo-800/50 text-white'
                }`}>
                  <p className="font-light leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-75 mt-2 font-mono">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-indigo-800/50 text-white px-4 py-3 max-w-xs">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input */}
          <div className="p-6 border-t border-indigo-700/30">
            <div className="flex items-center space-x-4">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={backendStatus === 'offline' ? 'IVOR is offline. Please start the backend first.' : 'Ask IVOR anything about resources, community, or support...'}
                className="flex-1 px-4 py-3 bg-indigo-950/50 border border-indigo-700/50 text-white placeholder-indigo-300 focus:outline-none focus:border-indigo-500 font-light resize-none"
                rows={2}
                disabled={backendStatus === 'offline'}
              />
              <motion.button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || backendStatus === 'offline' || isTyping}
                whileHover={{ scale: backendStatus === 'connected' ? 1.05 : 1 }}
                whileTap={{ scale: backendStatus === 'connected' ? 0.95 : 1 }}
                className={`p-3 transition-colors ${
                  backendStatus === 'connected' && inputMessage.trim() && !isTyping
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
            
            {backendStatus === 'offline' && (
              <p className="text-sm text-amber-400 mt-3 font-light">
                To start IVOR backend: <code className="bg-indigo-950/50 px-2 py-1 font-mono">cd ivor/ivor/backend && ./start.sh</code>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function IVORInterfaceEnhanced() {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'offline'>('checking')
  const [showChat, setShowChat] = useState(false)
  const [pathwayContext, setPathwayContext] = useState<any>(null)
  const [initialMessage, setInitialMessage] = useState<string>('')

  useEffect(() => {
    // Check IVOR backend status using service
    const checkConnection = async () => {
      const connected = await ivorService.checkConnection()
      setBackendStatus(connected ? 'connected' : 'offline')
    }
    
    checkConnection()

    // Check for pathway context from URL or localStorage
    const urlParams = new URLSearchParams(window.location.search)
    const pathwayParam = urlParams.get('pathway')
    
    if (pathwayParam) {
      // If pathway is in URL, show chat immediately with context
      setShowChat(true)
      setInitialMessage(`I just completed the liberation pathway assessment and discovered I'm a ${pathwayParam}. Can you help me understand what this means and how I can get involved?`)
    }

    // Check localStorage for pathway context
    const storedContext = localStorage.getItem('pathwayContext')
    if (storedContext) {
      try {
        const context = JSON.parse(storedContext)
        setPathwayContext(context)
        if (context.pathway) {
          setShowChat(true)
          setInitialMessage(`I just completed the liberation pathway assessment and discovered I'm a ${context.pathway}. My focus area is ${context.focus}. Can you help me understand what this means and provide specific resources for my journey?`)
        }
        // Clear the context after using it
        localStorage.removeItem('pathwayContext')
      } catch (error) {
        // Pathway context parsing failed - using default state
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-950 via-orange-900 to-amber-900">
      {/* Enhanced Navigation */}
      <PrimaryNavigationEnhanced />
      
      {/* IVOR Hero */}
      <IVORHero />
      
      {/* Pathway Context Banner */}
      {pathwayContext && (
        <section className="py-8 bg-gradient-to-r from-emerald-600/20 to-indigo-600/20 backdrop-blur-sm border-y border-emerald-500/30">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center space-x-4"
            >
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <p className="text-emerald-300 font-bold heading-block uppercase">
                Liberation Pathway Activated: {pathwayContext.pathway}
              </p>
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            </motion.div>
            <p className="text-indigo-200 font-light mt-2">
              IVOR will provide personalized support based on your pathway results
            </p>
          </div>
        </section>
      )}

      {/* Chat Interface */}
      {showChat ? (
        <IVORChatInterface 
          backendStatus={backendStatus} 
          pathwayContext={pathwayContext}
          initialMessage={initialMessage}
        />
      ) : (
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <motion.button
              onClick={() => setShowChat(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-12 py-4 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-black text-lg hover:from-emerald-500 hover:to-indigo-500 transition-all duration-300 shadow-xl hover:shadow-2xl heading-block uppercase tracking-wide flex items-center mx-auto"
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              {pathwayContext ? `CONTINUE WITH ${pathwayContext.pathway} PATHWAY` : 'START CONVERSATION WITH IVOR'}
            </motion.button>
            {backendStatus === 'offline' && (
              <p className="text-amber-400 mt-4 font-light">
                Backend is offline. Please start IVOR backend first.
              </p>
            )}
          </div>
        </section>
      )}
      
      {/* IVOR Capabilities */}
      <IVORCapabilities />
      
      {/* IVOR Features */}
      <IVORFeatures />
      
      {/* Platform Footer */}
      <PlatformFooter />
    </div>
  )
}