'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, AlertCircle, Loader2 } from 'lucide-react'
import { getIvorResponse, trackIvorInteraction } from '../../services/ivor-api'

/**
 * IvorChatbot - IVOR Community Intelligence Platform
 * 
 * @purpose Connect community members with resources through AI-powered assistance
 * @values Community-driven AI, cultural authenticity, privacy protection
 * @accessibility Full keyboard navigation and screen reader support
 * @mobile Optimized for mobile-first community engagement
 * @integration OpenAI API with community knowledge base
 */

interface Message {
  id: string
  text: string
  sender: 'user' | 'ivor'
  timestamp: Date
  isError?: boolean
  sources?: string[]
}

export default function IvorChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey! I'm IVOR, inspired by the legacy of Ivor Cummings who was known for connecting our community with resources and support. I'm here to help you find what you need—whether that's mental health support, housing assistance, legal rights, community events, or just someone to talk to. What brings you here today?",
      sender: 'ivor',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputText
    setInputText('')
    setIsLoading(true)

    try {
      // Generate a simple user ID for rate limiting (could be improved with proper auth)
      const userId = `user-${Date.now()}`
      
      // Call IVOR API
      const response = await getIvorResponse(currentInput, userId)
      
      // Track interaction for community intelligence
      trackIvorInteraction(currentInput, response.message, userId)
      
      // Create IVOR response message
      const ivorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: 'ivor',
        timestamp: new Date(),
        isError: !response.success,
        sources: response.sources
      }
      
      setMessages(prev => [...prev, ivorResponse])
      
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Error response
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having some technical difficulties right now. In the meantime, you can reach out to our partner organizations directly: BLKOUT, Black Thrive BQC, Black Trans Hub, or QueerCroydon for support.",
        sender: 'ivor',
        timestamp: new Date(),
        isError: true
      }
      
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
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
                <h3 className="font-semibold">IVOR</h3>
                <p className="text-xs opacity-90">Community AI Assistant</p>
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
                        : message.isError
                        ? 'bg-red-50 text-red-800 border border-red-200'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.isError && (
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={14} />
                        <span className="text-xs font-medium">Connection Issue</span>
                      </div>
                    )}
                    <p className="text-sm">{message.text}</p>
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-2 text-xs text-gray-600">
                        <span className="font-medium">Sources: </span>
                        {message.sources.join(', ')}
                      </div>
                    )}
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' 
                        ? 'text-blkout-secondary' 
                        : message.isError 
                        ? 'text-red-600' 
                        : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
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
                  <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-800">
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      <span className="text-sm">IVOR is thinking...</span>
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
                  placeholder={isLoading ? "IVOR is thinking..." : "Ask IVOR about our community..."}
                  disabled={isLoading}
                  className="flex-1 p-2 border border-gray-300 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-blkout-primary 
                    focus:border-transparent text-sm disabled:opacity-50 
                    disabled:cursor-not-allowed"
                  aria-label="Message input"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  className="px-3 py-2 bg-blkout-primary text-white rounded-md 
                    hover:bg-blkout-warm transition-colors disabled:opacity-50 
                    disabled:cursor-not-allowed focus:outline-none focus:ring-2 
                    focus:ring-blkout-primary focus:ring-opacity-50"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </form>
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