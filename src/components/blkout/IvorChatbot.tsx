'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send } from 'lucide-react'

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

  const sendMessage = () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')

    // Simulate IVOR response (in real implementation, this would call IVOR API)
    setTimeout(() => {
      const ivorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "That's a great question! Our community believes in cooperative ownership and Black queer liberation. Let me connect you with someone who can share more about our movement. Would you like to join our next community gathering?",
        sender: 'ivor',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, ivorResponse])
    }, 1000)
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
                  placeholder="Ask IVOR about our community..."
                  className="flex-1 p-2 border border-gray-300 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-blkout-primary 
                    focus:border-transparent text-sm"
                  aria-label="Message input"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-3 py-2 bg-blkout-primary text-white rounded-md 
                    hover:bg-blkout-warm transition-colors disabled:opacity-50 
                    disabled:cursor-not-allowed focus:outline-none focus:ring-2 
                    focus:ring-blkout-primary focus:ring-opacity-50"
                  aria-label="Send message"
                >
                  <Send size={16} />
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