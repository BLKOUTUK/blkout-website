'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, Calendar, ExternalLink } from 'lucide-react'
import IvorAvatar from './IvorAvatar'

/**
 * IvorChatbot - IVOR beta integration for community interaction
 * 
 * @purpose Demonstrate new direction and collaboration capabilities
 * @values Community-driven AI, authentic connection
 * @accessibility Full keyboard navigation and screen reader support
 * @mobile Optimized for mobile-first community engagement
 */

interface Message {
  id: string
  text: string
  sender: 'user' | 'ivor'
  timestamp: Date
  sources?: Array<{ title: string; source: string; url?: string }>
  suggestions?: string[]
  modelUsed?: string
}

interface EventCard {
  id: string
  title: string
  description: string
  start_time: string
  location?: string
  registration_url?: string
  category?: string
}

export default function IvorChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey! I'm IVOR, BLKOUT's community AI. I'm here to help connect you with our movement for cooperative ownership. What brings you to our community today?",
      sender: 'ivor',
      timestamp: new Date(),
      suggestions: [
        "What's happening in the community?",
        "Tell me about BLKOUT's values",
        "How do I get involved?"
      ]
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => `session-${Date.now()}`)
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WebSocket | null>(null)

  // WebSocket connection
  useEffect(() => {
    if (isOpen && !wsRef.current) {
      connectWebSocket()
    }
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [isOpen])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const connectWebSocket = () => {
    try {
      const wsUrl = process.env.NODE_ENV === 'production' 
        ? 'wss://your-domain.com/ws'
        : 'ws://localhost:8000/ws'
      
      wsRef.current = new WebSocket(wsUrl)
      
      wsRef.current.onopen = () => {
        setIsConnected(true)
        console.log('WebSocket connected')
      }
      
      wsRef.current.onmessage = (event) => {
        const response = JSON.parse(event.data)
        if (response.type === 'response') {
          const ivorMessage: Message = {
            id: `ivor-${Date.now()}`,
            text: response.message,
            sender: 'ivor',
            timestamp: new Date(response.timestamp),
            sources: response.sources,
            suggestions: response.suggestions,
            modelUsed: response.model_used
          }
          setMessages(prev => [...prev, ivorMessage])
          setIsLoading(false)
        }
      }
      
      wsRef.current.onclose = () => {
        setIsConnected(false)
        console.log('WebSocket disconnected')
      }
      
      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error)
        setIsConnected(false)
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
      setIsConnected(false)
    }
  }

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputText.trim()
    if (!textToSend) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        // Send via WebSocket
        wsRef.current.send(JSON.stringify({
          message: textToSend,
          session_id: sessionId,
          context: {}
        }))
      } else {
        // Fallback to HTTP API
        const response = await fetch('http://localhost:8000/chat/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: textToSend,
            session_id: sessionId,
            context: {}
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          const ivorMessage: Message = {
            id: `ivor-${Date.now()}`,
            text: data.message,
            sender: 'ivor',
            timestamp: new Date(data.timestamp),
            sources: data.sources,
            suggestions: data.suggestions,
            modelUsed: data.model_used
          }
          setMessages(prev => [...prev, ivorMessage])
        } else {
          throw new Error('Failed to get response')
        }
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Fallback response
      const errorMessage: Message = {
        id: `ivor-error-${Date.now()}`,
        text: "I'm having some technical difficulties right now. Our community values authentic connection, so let me be real - something's not working quite right! Please try again in a moment.",
        sender: 'ivor',
        timestamp: new Date(),
        suggestions: ["Try again", "What are BLKOUT's values?", "Tell me about the community"]
      }
      setMessages(prev => [...prev, errorMessage])
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Chat Toggle Button with Avatar */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 ${isOpen ? 'hidden' : 'flex'} 
          items-center justify-center w-16 h-16 bg-transparent
          focus:outline-none focus:ring-4 focus:ring-blkout-primary focus:ring-opacity-50`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Open IVOR community chatbot"
      >
        <IvorAvatar 
          state={isLoading ? 'thinking' : isConnected ? 'idle' : 'error'} 
          size="large"
          className="drop-shadow-lg"
        />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 w-80 h-96 bg-white rounded-lg shadow-2xl 
              border border-gray-200 flex flex-col overflow-hidden
              md:w-96 md:h-[500px]"
          >
            {/* Header */}
            <div className="bg-blkout-primary text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <IvorAvatar 
                  state={isLoading ? 'thinking' : isConnected ? 'idle' : 'error'} 
                  size="medium"
                />
                <div>
                  <h3 className="font-semibold">IVOR</h3>
                  <p className="text-xs opacity-90">
                    {isConnected ? 'Community AI Assistant' : 'Connecting...'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-blkout-warm rounded transition-colors
                  focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${message.sender === 'user' ? 'ml-8' : 'mr-8'}`}>
                    {/* Message bubble */}
                    <div
                      className={`p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blkout-primary text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      
                      {/* Message metadata */}
                      <div className={`flex items-center justify-between mt-2 text-xs ${
                        message.sender === 'user' ? 'text-blkout-secondary' : 'text-gray-500'
                      }`}>
                        <span>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        {message.modelUsed && message.sender === 'ivor' && (
                          <span className="opacity-70">via {message.modelUsed}</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Sources */}
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.sources.map((source, index) => (
                          <div key={index} className="text-xs bg-gray-50 p-2 rounded border-l-2 border-blkout-primary">
                            <div className="font-medium">{source.title || 'Community Resource'}</div>
                            <div className="text-gray-600">{source.source}</div>
                            {source.url && (
                              <a href={source.url} target="_blank" rel="noopener noreferrer" 
                                 className="text-blkout-primary hover:underline flex items-center mt-1">
                                View source <ExternalLink size={12} className="ml-1" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && message.sender === 'ivor' && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xs text-gray-600 font-medium">You might also ask:</p>
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => sendMessage(suggestion)}
                            className="block w-full text-left text-xs bg-white border border-gray-200 
                              hover:border-blkout-primary hover:bg-blkout-primary hover:text-white 
                              p-2 rounded transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <Bot size={16} className="text-blkout-primary" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blkout-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-blkout-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-blkout-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <form 
                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                className="flex space-x-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={isConnected ? "Ask IVOR about our community..." : "Connecting to IVOR..."}
                  disabled={isLoading || !isConnected}
                  className="flex-1 p-2 border border-gray-300 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-blkout-primary 
                    focus:border-transparent text-sm disabled:bg-gray-50"
                  aria-label="Message input"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading || !isConnected}
                  className="px-3 py-2 bg-blkout-primary text-white rounded-md 
                    hover:bg-blkout-warm transition-colors disabled:opacity-50 
                    disabled:cursor-not-allowed focus:outline-none focus:ring-2 
                    focus:ring-blkout-primary focus:ring-opacity-50"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </form>
              
              {/* Connection status */}
              {!isConnected && (
                <div className="mt-2 text-xs text-gray-500 flex items-center">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-2" />
                  Connecting to IVOR... (Fallback to HTTP API available)
                </div>
              )}
            </div>

            {/* Community Values Footer */}
            <div className="px-4 py-2 bg-gray-50 text-xs text-gray-600 text-center">
              🏳️‍🌈 Building cooperative ownership together
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}