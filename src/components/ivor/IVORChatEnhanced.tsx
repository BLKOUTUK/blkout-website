// IVOR Chat Interface - Journey-Aware Community Liberation AI
// Enhanced with semantic search, journey recognition, and intelligent responses

import React, { useState, useRef, useEffect } from 'react';
import { ivorAPI, type IntelligentResponse } from '../../lib/api-client';

export interface UserContext {
  location?: string;
  empowerment_goals?: string[];
  cultural_background?: string;
  skills?: string[];
  liberation_focus?: string[];
  previous_journey_stages?: string[];
  current_challenges?: string[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  journey_context?: {
    domain: string;
    stage: string;
    confidence: number;
  };
  response_data?: IntelligentResponse;
}

interface IVORChatProps {
  session_id?: string;
  initial_context?: UserContext;
  cultural_theme?: 'default' | 'pride' | 'liberation' | 'healing';
  liberation_focus?: string[];
}

export const IVORChatEnhanced: React.FC<IVORChatProps> = ({
  session_id,
  initial_context,
  cultural_theme = 'liberation',
  liberation_focus = ['empowerment', 'community_connection', 'liberation']
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [userContext, setUserContext] = useState<UserContext>(initial_context || {});
  const [currentJourney, setCurrentJourney] = useState<{
    domain: string;
    stage: string;
    confidence: number;
  } | null>(null);
  const [showJourneyInsights, setShowJourneyInsights] = useState(false);
  const [showResourcePanel, setShowResourcePanel] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: `Welcome to IVOR! I'm here to support your liberation journey with culturally affirming, community-centered guidance. 

I understand where you are in your empowerment journey and provide specific resources, connections, and next steps focused on Black queer liberation goals.

How can I support you today?`,
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);
  }, []);

  /**
   * Process user input with journey-aware intelligence
   */
  const processUserInput = async (input: string) => {
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');

    try {
      // Generate intelligent response using API client
      const responseResult = await ivorAPI.generateIntelligentResponse(
        input,
        userContext,
        session_id || `session_${Date.now()}`
      );

      if (!responseResult.success) {
        throw new Error(responseResult.error || 'Failed to generate response');
      }

      const response = responseResult.data!;

      // Update current journey state
      setCurrentJourney({
        domain: response.journey_insights.domain,
        stage: response.journey_insights.current_stage,
        confidence: 0.8 // Will be provided by journey recognition
      });

      // Create assistant message with enhanced data
      const assistantMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        journey_context: {
          domain: response.journey_insights.domain,
          stage: response.journey_insights.current_stage,
          confidence: 0.8
        },
        response_data: response
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Update user context based on conversation
      setUserContext(prev => ({
        ...prev,
        previous_journey_stages: [
          ...(prev.previous_journey_stages || []),
          `${response.journey_insights.domain}:${response.journey_insights.current_stage}`
        ].slice(-5), // Keep last 5 stages
        empowerment_goals: [
          ...(prev.empowerment_goals || []),
          ...response.journey_insights.liberation_focus
        ].slice(-10) // Keep relevant goals
      }));

    } catch (error) {
      console.error('IVOR processing error:', error);
      
      // Add error handling message
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: "I'm experiencing some technical difficulties, but I'm still here to support you. Please know that your needs are valid and there are community resources available. Would you like me to connect you with immediate support options?",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
      inputRef.current?.focus();
    }
  };

  /**
   * Handle input submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processUserInput(currentInput);
  };

  /**
   * Handle quick action buttons
   */
  const handleQuickAction = (action: string) => {
    const quickActions = {
      'crisis_support': 'I need immediate crisis support and resources.',
      'community_connect': 'I want to connect with community resources and peer support.',
      'empowerment_tools': 'I\'m looking for tools and resources for personal empowerment.',
      'organizing_help': 'I want to get involved in community organizing and advocacy.',
      'healing_resources': 'I need healing and wellness resources for my journey.'
    };

    const message = quickActions[action as keyof typeof quickActions];
    if (message) {
      setCurrentInput(message);
      processUserInput(message);
    }
  };

  /**
   * Get theme classes for cultural styling
   */
  const getThemeClasses = () => {
    const themes = {
      default: 'from-purple-900 to-pink-600',
      pride: 'from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500',
      liberation: 'from-amber-600 to-red-600',
      healing: 'from-green-600 to-blue-600'
    };
    return themes[cultural_theme] || themes.liberation;
  };

  /**
   * Render journey insights panel
   */
  const renderJourneyInsights = () => {
    if (!currentJourney || !showJourneyInsights) return null;

    return (
      <div className="bg-gradient-to-r from-purple-900/20 to-pink-600/20 p-4 rounded-lg mb-4 border border-purple-500/30">
        <h3 className="text-lg font-semibold text-purple-100 mb-2">Your Liberation Journey</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-purple-300">Domain:</span>
            <span className="ml-2 text-white capitalize">{currentJourney.domain}</span>
          </div>
          <div>
            <span className="text-purple-300">Stage:</span>
            <span className="ml-2 text-white capitalize">{currentJourney.stage.replace('_', ' ')}</span>
          </div>
          <div>
            <span className="text-purple-300">Confidence:</span>
            <span className="ml-2 text-white">{Math.round(currentJourney.confidence * 100)}%</span>
          </div>
          <div>
            <span className="text-purple-300">Focus:</span>
            <span className="ml-2 text-white">Liberation & Empowerment</span>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Render resources panel
   */
  const renderResourcesPanel = (responseData: IntelligentResponse) => {
    if (!showResourcePanel) return null;

    return (
      <div className="bg-gradient-to-r from-green-900/20 to-blue-600/20 p-4 rounded-lg mt-4 border border-green-500/30">
        <h3 className="text-lg font-semibold text-green-100 mb-3">Community Resources & Support</h3>
        
        <div className="space-y-4">
          {/* Specific Resources */}
          {responseData.specific_resources.length > 0 && (
            <div>
              <h4 className="font-medium text-green-200 mb-2">Immediate Resources:</h4>
              <div className="space-y-2">
                {responseData.specific_resources.slice(0, 3).map((resource, index) => (
                  <div key={index} className="bg-black/30 p-3 rounded border border-green-500/20">
                    <div className="font-medium text-white">{resource.title}</div>
                    <div className="text-sm text-green-200 mt-1">{resource.description}</div>
                    <div className="text-xs text-green-300 mt-1">
                      Cultural Competency: {resource.cultural_competency}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Steps */}
          {responseData.actionable_steps.length > 0 && (
            <div>
              <h4 className="font-medium text-blue-200 mb-2">Next Steps:</h4>
              <div className="space-y-2">
                {responseData.actionable_steps.slice(0, 3).map((step, index) => (
                  <div key={index} className="bg-black/30 p-3 rounded border border-blue-500/20">
                    <div className="text-white">{step.step}</div>
                    <div className="text-xs text-blue-300 mt-1">
                      Timeline: {step.timeline} | Community Connection: {step.community_connection ? 'Yes' : 'No'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Community Connections */}
          {responseData.community_connections.length > 0 && (
            <div>
              <h4 className="font-medium text-purple-200 mb-2">Community Connections:</h4>
              <div className="space-y-2">
                {responseData.community_connections.map((connection, index) => (
                  <div key={index} className="bg-black/30 p-3 rounded border border-purple-500/20">
                    <div className="font-medium text-white capitalize">
                      {connection.connection_type.replace('_', ' ')}
                    </div>
                    <div className="text-sm text-purple-200 mt-1">{connection.description}</div>
                    <div className="text-xs text-purple-300 mt-1">
                      Liberation Potential: {connection.liberation_potential}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[600px] bg-gradient-to-br from-gray-900 to-black rounded-lg border border-gray-700/50 shadow-2xl">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getThemeClasses()} p-4 rounded-t-lg`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">IVOR</h2>
            <p className="text-sm text-gray-200">Community Liberation AI Assistant</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowJourneyInsights(!showJourneyInsights)}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm text-white transition-colors"
              title="Toggle Journey Insights"
            >
              Journey
            </button>
            <button
              onClick={() => setShowResourcePanel(!showResourcePanel)}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm text-white transition-colors"
              title="Toggle Resources Panel"
            >
              Resources
            </button>
          </div>
        </div>
      </div>

      {/* Journey Insights */}
      {renderJourneyInsights()}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/50">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              message.role === 'user'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-100 border border-gray-600'
            }`}>
              <div className="whitespace-pre-wrap">{message.content}</div>
              
              {/* Journey Context Badge */}
              {message.journey_context && (
                <div className="mt-2 text-xs opacity-75">
                  Journey: {message.journey_context.domain} → {message.journey_context.stage}
                </div>
              )}

              {/* Cultural Affirmation */}
              {message.response_data?.cultural_affirmation && (
                <div className="mt-3 p-2 bg-gradient-to-r from-amber-900/30 to-red-900/30 rounded border border-amber-500/30">
                  <div className="text-sm text-amber-200 font-medium">Community Affirmation:</div>
                  <div className="text-sm text-amber-100 mt-1">
                    {message.response_data.cultural_affirmation}
                  </div>
                </div>
              )}

              {/* Resources Panel */}
              {message.response_data && renderResourcesPanel(message.response_data)}
              
              <div className="text-xs opacity-50 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-gray-100 p-3 rounded-lg border border-gray-600">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                <span>IVOR is analyzing your liberation journey...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="p-2 bg-gray-800/50 border-t border-gray-700">
        <div className="flex flex-wrap gap-2 mb-2">
          <button
            onClick={() => handleQuickAction('crisis_support')}
            className="px-3 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-200 text-sm rounded border border-red-500/30 transition-colors"
          >
            Crisis Support
          </button>
          <button
            onClick={() => handleQuickAction('community_connect')}
            className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-200 text-sm rounded border border-blue-500/30 transition-colors"
          >
            Community Connect
          </button>
          <button
            onClick={() => handleQuickAction('empowerment_tools')}
            className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/40 text-purple-200 text-sm rounded border border-purple-500/30 transition-colors"
          >
            Empowerment Tools
          </button>
          <button
            onClick={() => handleQuickAction('healing_resources')}
            className="px-3 py-1 bg-green-600/20 hover:bg-green-600/40 text-green-200 text-sm rounded border border-green-500/30 transition-colors"
          >
            Healing Resources
          </button>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 bg-gray-800/30">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="Share what's on your mind... I'm here to support your liberation journey."
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={isProcessing || !currentInput.trim()}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isProcessing || !currentInput.trim()
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
            }`}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default IVORChatEnhanced;