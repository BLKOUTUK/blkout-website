'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Wifi, WifiOff } from 'lucide-react'
import { ivorService } from '../../services/ivorService'

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
}

export default function IvorChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey! I'm IVOR, BLKOUT's community AI. I'm here to help connect you with our movement for cooperative ownership. What brings you to our community today?",
      sender: 'ivor',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isTyping, setIsTyping] = useState(false)

  // Check IVOR connection status on mount
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await ivorService.checkConnection()
      setIsConnected(connected)
    }
    checkConnection()
  }, [])

  const sendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const messageText = inputText
    setInputText('')
    setIsTyping(true)

    try {
      // Get pathway context from localStorage for personalized responses
      const pathwayContext = localStorage.getItem('pathwayContext')
      let context = null
      try {
        context = pathwayContext ? JSON.parse(pathwayContext) : null
      } catch (e) {
        // Ignore parsing errors
      }

      // Call real IVOR service
      const response = await ivorService.sendMessage(messageText, context)
      
      const ivorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message || "I'm here to help with your community needs!",
        sender: 'ivor',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, ivorResponse])
      
      // Update connection status based on response
      setIsConnected(ivorService.getConnectionStatus())
      
    } catch (error) {
      console.error('Failed to send message to IVOR:', error)
      
      // Fallback response when API fails
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now, but I'm still here to help! BLKOUT supports Black queer liberation through community organizing, cooperative ownership, and mutual aid. How can I point you toward the resources you need?",
        sender: 'ivor',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, fallbackResponse])
      setIsConnected(false)
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 ${isOpen ? 'hidden' : 'flex'} 
          items-center justify-center w-14 h-14 bg-blkout-primary text-white 
          rounded-full shadow-lg hover:bg-blkout-warm transition-colors
          focus:outline-none focus:ring-4 focus:ring-blkout-primary focus:ring-opacity-50`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Open IVOR community chatbot"
      >
        <MessageCircle size={24} />
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
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold">IVOR</h3>
                  {isConnected === null ? (
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" title="Connecting..." />
                  ) : isConnected ? (
                    <Wifi size={16} className="text-green-400" title="Connected" />
                  ) : (
                    <WifiOff size={16} className="text-red-400" title="Offline" />
                  )}
                </div>
                <p className="text-xs opacity-90">
                  {isConnected === null ? 'Connecting...' : 
                   isConnected ? 'Community AI Assistant' : 'Offline Mode'}
                </p>
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
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blkout-primary text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blkout-secondary' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
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
                  placeholder={
                    isConnected === null ? "Connecting to IVOR..." :
                    isConnected === false ? "IVOR is offline, but still helpful..." :
                    "Ask IVOR about our community..."
                  }
                  disabled={isTyping}
                  className="flex-1 p-2 border border-gray-300 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-blkout-primary 
                    focus:border-transparent text-sm disabled:bg-gray-100"
                  aria-label="Message input"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isTyping}
                  className="px-3 py-2 bg-blkout-primary text-white rounded-md 
                    hover:bg-blkout-warm transition-colors disabled:opacity-50 
                    disabled:cursor-not-allowed focus:outline-none focus:ring-2 
                    focus:ring-blkout-primary focus:ring-opacity-50"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </form>
              
              {/* Connection status */}
              {isConnected === false && (
                <div className="mt-2 text-xs text-gray-500 text-center">
                  Running in offline mode with community resources
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